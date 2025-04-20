// src/routes/clubs/[slug]/+page.js
import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const { slug } = params;

    const { data, error } = await supabase
        .from('clubs')
        .select()
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(error);
        return {
            status: 404,
            error: new Error('Club not found'),
        };
    }

    return {
        club: data
    };
}
