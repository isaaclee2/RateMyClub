import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageLoad} */
export async function load({ locals, params }) {
    const session = await locals.supabase.auth.getSession();
    if (!session?.data?.session?.user) {
        throw redirect(302, `/club/${params.slug}`);
    }
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

    return {
        club: clubData,
        session: session.data.session
    };
}
