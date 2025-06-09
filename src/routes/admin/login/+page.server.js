import { redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD, ADMIN_SECRET_KEY, ADMIN_EMAILS } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function load({ cookies }) {
    const adminToken = cookies.get('admin_token');

    if (adminToken) {
        try {
            const decoded = jwt.verify(adminToken, ADMIN_SECRET_KEY);
            if (decoded.email && isAdminEmail(decoded.email)) {
                throw redirect(302, '/admin');
            }
        } catch (err) {
            // Invalid token, continue to login
        }
    }

    return {};
}

function isAdminEmail(email) {
    const adminEmails = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // Input validation
        if (!email || !password) {
            return {
                success: false,
                error: 'Invalid credentials.'
            };
        }

        // Check both email authorization AND password
        // Use same error message for both failures
        if (!isAdminEmail(email) || password !== ADMIN_PASSWORD) {
            return {
                success: false,
                error: 'Invalid credentials.'
            };
        }

        // Success case
        const token = jwt.sign(
            { email: email, role: 'admin' },
            ADMIN_SECRET_KEY,
            { expiresIn: '24h' }
        );

        cookies.set('admin_token', token, {
            path: '/',
            maxAge: 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        throw redirect(302, '/admin');
    }
};