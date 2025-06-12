import { supabase } from "$lib/supabaseClient";

export async function load() {
    const { data } = await supabase.from("clubs").select();

    const { data: popularClubs, error: popularError } = await supabase
        .from('clubs')
        .select('*')
        .order('review_count', { ascending: false })
        .limit(4);

    if (popularError) {
        console.error('Error fetching popular clubs:', popularError);
    }

    return {
        popularClubs: popularClubs || [],
        clubs: data ?? [],
    };
}

