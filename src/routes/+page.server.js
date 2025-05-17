import { supabase } from "$lib/supabaseClient";

export async function load() {
    const { data } = await supabase.from("clubs").select();
    return {
        clubs: data ?? [],
    };
}

