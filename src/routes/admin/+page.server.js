// src/routes/admin/+page.server.js
import { fail } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role key for server-side operations
const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to validate admin access (for actions)
async function validateAdminAccess(locals) {
    try {
        const { data: { user }, error } = await locals.supabase.auth.getUser();

        if (error || !user) {
            console.log('No authenticated user found');
            return null;
        }

        const adminEmails = ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase());
        console.log('Admin emails from env:', adminEmails);
        console.log('User email:', user.email);

        if (!adminEmails.includes(user.email.toLowerCase())) {
            console.log('User is not an admin');
            return null;
        }

        console.log('Admin access granted!');
        return user;
    } catch (error) {
        console.error('Error validating admin access:', error);
        return null;
    }
}

export async function load({ parent }) {
    const { adminUser } = await parent();

    try {
        console.log('Loading admin data for:', adminUser.email);

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

        // For each pending review, check if the user has already reviewed this club
        const reviewsWithExistingCheck = await Promise.all(
            (pendingReviews || []).map(async (review) => {
                const { data: existingReviews, error: existingError } = await supabase
                    .from('reviews')
                    .select('id, created_at, approved_at')
                    .eq('user_email', review.user_email)
                    .eq('club_slug', review.club_slug);

                if (existingError) {
                    console.error('Error checking existing reviews:', existingError);
                    return {
                        ...review,
                        hasExistingReview: false,
                        existingReviewCount: 0
                    };
                }

                return {
                    ...review,
                    hasExistingReview: existingReviews && existingReviews.length > 0,
                    existingReviewCount: existingReviews ? existingReviews.length : 0,
                    existingReviews: existingReviews || []
                };
            })
        );

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

        return {
            authenticated: true,
            adminEmail: adminUser.email,
            session: { user: adminUser },
            pendingReviews: reviewsWithExistingCheck || [],
            pendingClubUpdates: pendingClubUpdates || []
        };
    } catch (error) {
        console.error('Error in load function:', error);
        return fail(500, { error: 'Failed to load admin data: ' + error.message });
    }
}

async function recalculateClubStats(clubSlug) {
    try {
        console.log(`Recalculating stats for club: ${clubSlug}`);

        // Get all approved reviews for this club
        const { data: clubReviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('leadership_rating, inclusivity_rating, development_rating, social_rating, overall_rating')
            .eq('club_slug', clubSlug);

        if (reviewsError) {
            console.error('Error fetching club reviews:', reviewsError);
            return false;
        }

        console.log(`Found ${clubReviews?.length || 0} reviews for club ${clubSlug}`);
        console.log('Sample review data:', clubReviews?.[0]);

        if (!clubReviews || clubReviews.length === 0) {
            console.log('No reviews found for club, setting default stats');
            // Set default values when no reviews exist
            const { error: updateError } = await supabase
                .from('clubs')
                .update({
                    leadership_rating: null,
                    inclusivity_rating: null,
                    development_rating: null,
                    social_rating: null,
                    overall_vibes_rating: null,
                    overall_rating: 0.0,
                    review_count: 0
                })
                .eq('slug', clubSlug);

            if (updateError) {
                console.error('Error updating club stats to defaults:', updateError);
                return false;
            }
            return true;
        }

        // Calculate averages
        const totalReviews = clubReviews.length;
        const avgLeadership = clubReviews.reduce((sum, r) => sum + r.leadership_rating, 0) / totalReviews;
        const avgInclusivity = clubReviews.reduce((sum, r) => sum + r.inclusivity_rating, 0) / totalReviews;
        const avgDevelopment = clubReviews.reduce((sum, r) => sum + r.development_rating, 0) / totalReviews;
        const avgSocial = clubReviews.reduce((sum, r) => sum + r.social_rating, 0) / totalReviews;
        const avgOverall = clubReviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews;

        console.log(`Calculated averages for ${clubSlug}:`, {
            totalReviews,
            avgLeadership: avgLeadership.toFixed(2),
            avgInclusivity: avgInclusivity.toFixed(2),
            avgDevelopment: avgDevelopment.toFixed(2),
            avgSocial: avgSocial.toFixed(2),
            avgOverall: avgOverall.toFixed(2)
        });

        // Update club stats with correct column names
        const updateData = {
            leadership_rating: Math.round(avgLeadership * 100) / 100,
            inclusivity_rating: Math.round(avgInclusivity * 100) / 100,
            development_rating: Math.round(avgDevelopment * 100) / 100,
            social_rating: Math.round(avgSocial * 100) / 100,
            overall_vibes_rating: Math.round(avgOverall * 100) / 100,
            overall_rating: Math.round(avgOverall * 100) / 100,
            review_count: totalReviews
        };

        console.log(`Updating club ${clubSlug} with data:`, updateData);

        const { data: updateResult, error: updateError } = await supabase
            .from('clubs')
            .update(updateData)
            .eq('slug', clubSlug)
            .select();

        if (updateError) {
            console.error('Error updating club stats:', updateError);
            return false;
        }

        console.log(`Successfully updated stats for ${clubSlug}:`, updateResult);
        return true;
    } catch (error) {
        console.error('Error in recalculateClubStats:', error);
        return false;
    }
}

export const actions = {
    logout: async ({ locals }) => {
        console.log('Admin logout action called');

        const { error } = await locals.supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            return fail(500, { error: 'Failed to logout' });
        }

        console.log('Admin logout successful');
        return { message: 'Logged out successfully' };
    },

    approveReview: async ({ request, locals }) => {
        console.log('Approve review action called');

        // Validate admin access
        const adminUser = await validateAdminAccess(locals);
        if (!adminUser) {
            console.log('Unauthorized approve review attempt');
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            const formData = await request.formData();
            const reviewId = formData.get('reviewId');

            if (!reviewId) {
                return fail(400, { error: 'Review ID is required' });
            }

            console.log(`Admin ${adminUser.email} approving review ${reviewId}`);

            // Get the pending review
            const { data: pendingReview, error: fetchError } = await supabase
                .from('pending_reviews')
                .select('*')
                .eq('id', reviewId)
                .single();

            if (fetchError || !pendingReview) {
                console.error('Error fetching pending review:', fetchError);
                return fail(404, { error: 'Review not found' });
            }

            // Get the club ID from the slug
            const { data: club, error: clubError } = await supabase
                .from('clubs')
                .select('id')
                .eq('slug', pendingReview.club_slug)
                .single();

            if (clubError || !club) {
                console.error('Error fetching club:', clubError);
                return fail(404, { error: 'Club not found' });
            }

            // Move to approved reviews table
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    user_email: pendingReview.user_email,
                    club_id: club.id,
                    club_slug: pendingReview.club_slug,
                    leadership_rating: pendingReview.leadership_rating,
                    inclusivity_rating: pendingReview.inclusivity_rating,
                    development_rating: pendingReview.development_rating,
                    social_rating: pendingReview.social_rating,
                    overall_rating: pendingReview.overall_rating,
                    review_text: pendingReview.review_text,
                    connection: pendingReview.connection,
                    year_joined: pendingReview.year_joined,
                    members_estimate: pendingReview.members_estimate,
                    selectivity_estimate: pendingReview.selectivity_estimate,
                    created_at: pendingReview.created_at
                });

            if (insertError) {
                console.error('Error inserting approved review:', insertError);
                return fail(500, { error: 'Failed to approve review: ' + insertError.message });
            }

            // Remove from pending reviews
            const { error: deleteError } = await supabase
                .from('pending_reviews')
                .delete()
                .eq('id', reviewId);

            if (deleteError) {
                console.error('Error deleting pending review:', deleteError);
                return fail(500, { error: 'Failed to remove pending review: ' + deleteError.message });
            }

            // Recalculate club stats
            console.log(`About to recalculate stats for club: ${pendingReview.club_slug}`);
            const statsUpdated = await recalculateClubStats(pendingReview.club_slug);
            if (!statsUpdated) {
                console.warn('Failed to update club stats, but review was approved');
            } else {
                console.log('Club stats updated successfully');
            }

            console.log(`Review ${reviewId} approved successfully by ${adminUser.email}`);
            return { message: 'Review approved successfully!' };

        } catch (error) {
            console.error('Error in approveReview action:', error);
            return fail(500, { error: 'Failed to approve review: ' + error.message });
        }
    },

    rejectReview: async ({ request, locals }) => {
        console.log('Reject review action called');

        // Validate admin access
        const adminUser = await validateAdminAccess(locals);
        if (!adminUser) {
            console.log('Unauthorized reject review attempt');
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            const formData = await request.formData();
            const reviewId = formData.get('reviewId');

            if (!reviewId) {
                return fail(400, { error: 'Review ID is required' });
            }

            console.log(`Admin ${adminUser.email} rejecting review ${reviewId}`);

            // Delete the pending review
            const { error: deleteError } = await supabase
                .from('pending_reviews')
                .delete()
                .eq('id', reviewId);

            if (deleteError) {
                console.error('Error deleting pending review:', deleteError);
                return fail(500, { error: 'Failed to reject review: ' + deleteError.message });
            }

            console.log(`Review ${reviewId} rejected successfully by ${adminUser.email}`);
            return { message: 'Review rejected successfully!' };

        } catch (error) {
            console.error('Error in rejectReview action:', error);
            return fail(500, { error: 'Failed to reject review: ' + error.message });
        }
    },

    confirmClubUpdate: async ({ request, locals }) => {
        console.log('Confirm club update action called');

        // Validate admin access
        const adminUser = await validateAdminAccess(locals);
        if (!adminUser) {
            console.log('Unauthorized club update attempt');
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            const formData = await request.formData();
            const updateId = formData.get('updateId');

            if (!updateId) {
                return fail(400, { error: 'Update ID is required' });
            }

            console.log(`Admin ${adminUser.email} confirming club update ${updateId}`);

            // Delete the pending club update
            const { error: deleteError } = await supabase
                .from('pending_club_updates')
                .delete()
                .eq('id', updateId);

            if (deleteError) {
                console.error('Error deleting pending club update:', deleteError);
                return fail(500, { error: 'Failed to confirm club update: ' + deleteError.message });
            }

            console.log(`Club update ${updateId} confirmed successfully by ${adminUser.email}`);
            return { message: 'Club update confirmed successfully!' };

        } catch (error) {
            console.error('Error in confirmClubUpdate action:', error);
            return fail(500, { error: 'Failed to confirm club update: ' + error.message });
        }
    },

    rejectClubUpdate: async ({ request, locals }) => {
        console.log('Reject club update action called');

        // Validate admin access
        const adminUser = await validateAdminAccess(locals);
        if (!adminUser) {
            console.log('Unauthorized reject club update attempt');
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            const formData = await request.formData();
            const updateId = formData.get('updateId');

            if (!updateId) {
                return fail(400, { error: 'Update ID is required' });
            }

            console.log(`Admin ${adminUser.email} rejecting club update ${updateId}`);

            // Delete the pending club update
            const { error: deleteError } = await supabase
                .from('pending_club_updates')
                .delete()
                .eq('id', updateId);

            if (deleteError) {
                console.error('Error deleting pending club update:', deleteError);
                return fail(500, { error: 'Failed to reject club update: ' + deleteError.message });
            }

            console.log(`Club update ${updateId} rejected successfully by ${adminUser.email}`);
            return { message: 'Club update rejected successfully!' };

        } catch (error) {
            console.error('Error in rejectClubUpdate action:', error);
            return fail(500, { error: 'Failed to reject club update: ' + error.message });
        }
    }
};