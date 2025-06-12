import { supabase } from '$lib/supabaseClient';

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
        return {
            status: 404,
            error: new Error('Club not found'),
        };
    }

    const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('club_id', clubData.id)
        .order('created_at', { ascending: false });

    if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
    }

    return {
        club: clubData,
        reviews: reviewsData || []
    };
}
