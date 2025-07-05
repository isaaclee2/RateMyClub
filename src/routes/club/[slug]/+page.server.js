import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const { slug } = params;
    console.log("Loading club with slug:", slug);

    const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select()
        .eq('slug', slug)
        .single();

    if (clubError) {
        console.error(clubError);
        throw error(404, {
            message: 'Club not found'
        });
    }

    // Only fetch reviews if we have a valid club
    const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('club_id', clubData.id)
        .order('created_at', { ascending: false });

    if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
        throw error(500, {
            message: 'Error fetching reviews'
        });
    }

    return {
        club: clubData,
        reviews: reviewsData || []
    };
}
