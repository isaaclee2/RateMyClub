import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, url }) {
    // Get session using the safeGetSession method from hooks
    const { session, user } = await locals.safeGetSession();

    // Check authentication
    if (!session?.user) {
        throw redirect(302, `/?redirect=${encodeURIComponent(url.pathname)}`);
    }

    const { slug } = params;

    const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select()
        .eq('slug', slug)
        .single();

    if (clubError) {
        console.error(clubError);
        return {
            status: 404,
            error: new Error('Club not found'),
        };
    }

    const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('club_id', clubData.id)
        .order('time', { ascending: false });

    if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
    }

    return {
        club: clubData,
        reviews: reviewsData || [],
        session,
        user
    };
}