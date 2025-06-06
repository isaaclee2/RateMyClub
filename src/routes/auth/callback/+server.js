// src/routes/auth/callback/+server.js
import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/all-clubs'

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            redirect(303, '/auth?error=callback_error')
        }

        // Validate that the user's email is from USC domain
        if (data.user?.email) {
            const email = data.user.email.toLowerCase()

            if (!email.endsWith('@usc.edu')) {
                // Sign out the user immediately
                await supabase.auth.signOut()

                // Redirect back to auth with error
                redirect(303, '/auth?error=invalid_domain')
            }
        }

        // If we get here, the email is valid
        redirect(303, next)
    }

    // If no code, redirect to auth
    redirect(303, '/auth')
}