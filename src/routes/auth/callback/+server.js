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

        if (data.user?.email) {
            const email = data.user.email.toLowerCase()

            if (!email.endsWith('@usc.edu')) {
                await supabase.auth.signOut()
                redirect(303, '/auth?error=invalid_domain')
            }
        }
        redirect(303, next)
    }

    redirect(303, '/auth')
}