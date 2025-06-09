import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET_KEY, ADMIN_EMAILS } from '$env/static/private';
import jwt from 'jsonwebtoken';

function isAdminEmail(email) {
    const adminEmails = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}

export async function load({ cookies }) {
    console.log('Admin page load function running...');
    const adminToken = cookies.get('admin_token');
    console.log('Admin token exists:', adminToken ? 'Yes' : 'No');
    console.log('Token length:', adminToken ? adminToken.length : 0);

    if (!adminToken) {
        console.log('No token, redirecting to login');
        throw redirect(302, '/admin/login');
    }

    try {
        console.log('Verifying token...');
        console.log('Using secret key (first 10 chars):', ADMIN_SECRET_KEY.substring(0, 10));
        const decoded = jwt.verify(adminToken, ADMIN_SECRET_KEY);
        console.log('Token decoded successfully:', decoded);

        // Verify the email is still in the admin list
        if (!decoded.email || !isAdminEmail(decoded.email)) {
            console.log('Email not authorized or missing:', decoded.email);
            throw redirect(302, '/admin/login');
        }

        console.log('Token valid, showing admin dashboard for:', decoded.email);
        return {
            authenticated: true,
            adminEmail: decoded.email
        };
    } catch (err) {
        console.error('Token verification failed:', err.name, err.message);
        throw redirect(302, '/admin/login');
    }
}

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete('admin_token', { path: '/' });
        throw redirect(302, '/admin/login');
    }
};