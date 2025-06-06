// src/routes/auth/+page.server.js
import { redirect } from '@sveltejs/kit'

export const actions = {
    google: async ({ url, locals: { supabase }, request }) => {
        // Get the referrer (the page the user came from)
        const referrer = request.headers.get('referer')
        let returnPath = '/all-clubs' // default fallback

        if (referrer) {
            try {
                const referrerUrl = new URL(referrer)
                // Make sure it's from the same origin (security)
                if (referrerUrl.origin === url.origin) {
                    returnPath = referrerUrl.pathname + referrerUrl.search
                }
            } catch (e) {
                // If URL parsing fails, use default
            }
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(returnPath)}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                    hd: 'usc.edu'
                }
            }
        })

        if (error) {
            console.error('OAuth error:', error)
            return { error: error.message }
        }

        if (data.url) {
            redirect(303, data.url)
        }
    },

    logout: async ({ locals: { supabase } }) => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Logout error:', error)
            return { error: error.message }
        }

        // Redirect to homepage after logout
        redirect(303, '/')
    }
}