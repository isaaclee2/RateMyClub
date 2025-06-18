// src/routes/admin/+layout.server.js
import { redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$env/static/private';

function isAdminEmail(email) {
    const adminEmails = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    console.log('Admin emails from env:', adminEmails);
    console.log('User email:', email?.toLowerCase());
    return adminEmails.includes(email?.toLowerCase());
}

export async function load({ parent, url }) {
    try {
        console.log('Admin layout load started');

        const parentData = await parent();
        console.log('Parent data:', parentData);

        const { session } = parentData;
        console.log('Session in admin layout:', session);

        // Check if user is logged in
        if (!session?.user) {
            console.log('No session, redirecting to auth');
            const returnPath = url.pathname + url.search;
            throw redirect(302, `/auth?next=${encodeURIComponent(returnPath)}`);
        }

        // Check if user is admin
        if (!isAdminEmail(session.user.email)) {
            console.log('Not admin email, redirecting to home');
            throw redirect(302, '/?error=unauthorized');
        }

        console.log('Admin access granted!');
        return {
            adminUser: session.user
        };
    } catch (error) {
        console.error('Error in admin layout load:', error);
        throw error;
    }
}