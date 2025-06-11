import { redirect, fail } from '@sveltejs/kit';
import { ADMIN_SECRET_KEY, ADMIN_EMAILS, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Create Supabase client with service role key for server-side operations
const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

function isAdminEmail(email) {
    const adminEmails = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}

async function verifyAdminToken(cookies) {
    const adminToken = cookies.get('admin_token');

    if (!adminToken) {
        throw redirect(302, '/admin/login');
    }

    try {
        const decoded = jwt.verify(adminToken, ADMIN_SECRET_KEY);

        if (!decoded.email || !isAdminEmail(decoded.email)) {
            throw redirect(302, '/admin/login');
        }

        return decoded;
    } catch (err) {
        console.error('Token verification failed:', err.name);
        throw redirect(302, '/admin/login');
    }
}

export async function load({ cookies }) {

    try {
        const decoded = await verifyAdminToken(cookies);
        console.log('Token verified successfully for:', decoded.email);
    } catch (error) {
        console.log('Token verification failed, redirecting to login');
        throw error; // This will be the redirect
    }

    try {
        console.log('Attempting to connect to Supabase...');
        console.log('Supabase client created with URL:', PUBLIC_SUPABASE_URL);
        console.log('Supabase client created with key length:', SUPABASE_SERVICE_ROLE_KEY?.length);

        // Load pending reviews
        const { data: pendingReviews, error: reviewError } = await supabase
            .from('pending_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Pending reviews query result:', {
            data: pendingReviews?.length,
            error: reviewError?.message
        });

        if (reviewError) {
            console.error('Error loading pending reviews:', reviewError);
            return fail(500, { error: 'Failed to load pending reviews: ' + reviewError.message });
        }

        // Load pending club updates
        const { data: pendingClubUpdates, error: updateError } = await supabase
            .from('pending_club_updates')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Pending club updates query result:', {
            data: pendingClubUpdates?.length,
            error: updateError?.message
        });

        if (updateError) {
            console.error('Error loading pending club updates:', updateError);
            return fail(500, { error: 'Failed to load pending club updates: ' + updateError.message });
        }

        console.log('Successfully loaded admin data');
        const decoded = await verifyAdminToken(cookies);

        return {
            authenticated: true,
            adminEmail: decoded.email,
            pendingReviews: pendingReviews || [],
            pendingClubUpdates: pendingClubUpdates || []
        };
    } catch (error) {
        console.error('Error in load function:', error);
        return fail(500, { error: 'Failed to load admin data: ' + error.message });
    }
}

async function recalculateClubStats(clubId) {
    try {
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('leadership_rating, inclusivity_rating, development_rating, social_rating, overall_rating')
            .eq('club_id', clubId);

        if (reviewsError) throw reviewsError;

        if (reviews.length === 0) return;

        const totals = reviews.reduce(
            (acc, review) => {
                acc.leadership += review.leadership_rating;
                acc.inclusivity += review.inclusivity_rating;
                acc.development += review.development_rating;
                acc.social += review.social_rating;
                acc.overall += review.overall_rating;
                return acc;
            },
            {
                leadership: 0,
                inclusivity: 0,
                development: 0,
                social: 0,
                overall: 0
            }
        );

        const count = reviews.length;
        const averages = {
            leadership_rating: Number((totals.leadership / count).toFixed(1)),
            inclusivity_rating: Number((totals.inclusivity / count).toFixed(1)),
            development_rating: Number((totals.development / count).toFixed(1)),
            social_rating: Number((totals.social / count).toFixed(1)),
            overall_vibes_rating: Number((totals.overall / count).toFixed(1))
        };

        const overallRating = Number(
            (
                (averages.leadership_rating +
                    averages.inclusivity_rating +
                    averages.development_rating +
                    averages.social_rating +
                    averages.overall_vibes_rating) /
                5
            ).toFixed(1)
        );

        const { error: updateError } = await supabase
            .from('clubs')
            .update({
                leadership_rating: averages.leadership_rating,
                inclusivity_rating: averages.inclusivity_rating,
                development_rating: averages.development_rating,
                social_rating: averages.social_rating,
                overall_vibes_rating: averages.overall_vibes_rating,
                overall_rating: overallRating,
                review_count: count
            })
            .eq('id', clubId);

        if (updateError) throw updateError;
    } catch (error) {
        console.error('Error recalculating club stats:', error);
        throw error;
    }
}

export const actions = {
    approveReview: async ({ request, cookies }) => {
        const decoded = await verifyAdminToken(cookies);

        try {
            const data = await request.formData();
            const reviewId = data.get('reviewId');

            if (!reviewId) {
                return fail(400, { error: 'Review ID is required' });
            }

            // Get the pending review
            const { data: review, error: fetchError } = await supabase
                .from('pending_reviews')
                .select('*')
                .eq('id', reviewId)
                .single();

            if (fetchError) {
                console.error('Error fetching pending review:', fetchError);
                return fail(500, { error: 'Failed to fetch pending review' });
            }

            // Insert into reviews table
            const { error: insertError } = await supabase.from('reviews').insert([
                {
                    club_id: review.club_id,
                    club_slug: review.club_slug,
                    user_email: review.user_email,
                    connection: review.connection,
                    year_joined: review.year_joined,
                    leadership_rating: review.leadership_rating,
                    inclusivity_rating: review.inclusivity_rating,
                    development_rating: review.development_rating,
                    social_rating: review.social_rating,
                    overall_rating: review.overall_rating,
                    members_estimate: review.members_estimate,
                    selectivity_estimate: review.selectivity_estimate,
                    review_text: review.review_text,
                    approved_at: new Date().toISOString()
                }
            ]);

            if (insertError) {
                console.error('Error inserting approved review:', insertError);
                return fail(500, { error: 'Failed to approve review' });
            }

            // Delete from pending_reviews
            const { error: deleteError } = await supabase
                .from('pending_reviews')
                .delete()
                .eq('id', reviewId);

            if (deleteError) {
                console.error('Error deleting pending review:', deleteError);
                return fail(500, { error: 'Failed to remove pending review' });
            }

            // Recalculate club stats
            await recalculateClubStats(review.club_id);

            return { success: true, message: 'Review approved successfully!' };
        } catch (error) {
            console.error('Error in approveReview action:', error);
            return fail(500, { error: 'Failed to approve review' });
        }
    },

    rejectReview: async ({ request, cookies }) => {
        const decoded = await verifyAdminToken(cookies);

        try {
            const data = await request.formData();
            const reviewId = data.get('reviewId');

            if (!reviewId) {
                return fail(400, { error: 'Review ID is required' });
            }

            const { error } = await supabase
                .from('pending_reviews')
                .delete()
                .eq('id', reviewId);

            if (error) {
                console.error('Error rejecting review:', error);
                return fail(500, { error: 'Failed to reject review' });
            }

            return { success: true, message: 'Review rejected and deleted.' };
        } catch (error) {
            console.error('Error in rejectReview action:', error);
            return fail(500, { error: 'Failed to reject review' });
        }
    },

    confirmClubUpdate: async ({ request, cookies }) => {
        const decoded = await verifyAdminToken(cookies);

        try {
            const data = await request.formData();
            const updateId = data.get('updateId');

            if (!updateId) {
                return fail(400, { error: 'Update ID is required' });
            }

            const { error } = await supabase
                .from('pending_club_updates')
                .delete()
                .eq('id', updateId);

            if (error) {
                console.error('Error confirming club update:', error);
                return fail(500, { error: 'Failed to confirm club update' });
            }

            return { success: true, message: 'Club update request marked as complete!' };
        } catch (error) {
            console.error('Error in confirmClubUpdate action:', error);
            return fail(500, { error: 'Failed to confirm club update' });
        }
    },

    rejectClubUpdate: async ({ request, cookies }) => {
        const decoded = await verifyAdminToken(cookies);

        try {
            const data = await request.formData();
            const updateId = data.get('updateId');

            if (!updateId) {
                return fail(400, { error: 'Update ID is required' });
            }

            const { error } = await supabase
                .from('pending_club_updates')
                .delete()
                .eq('id', updateId);

            if (error) {
                console.error('Error rejecting club update:', error);
                return fail(500, { error: 'Failed to reject club update' });
            }

            return { success: true, message: 'Club update request rejected and deleted.' };
        } catch (error) {
            console.error('Error in rejectClubUpdate action:', error);
            return fail(500, { error: 'Failed to reject club update' });
        }
    },

    logout: async ({ cookies }) => {
        cookies.delete('admin_token', { path: '/' });
        throw redirect(302, '/admin/login');
    }
};