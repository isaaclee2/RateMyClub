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
    console.log('ADMIN_EMAILS env var:', ADMIN_EMAILS);
    const adminEmails = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    console.log('Processed admin emails:', adminEmails);
    console.log('Checking email:', email.toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        console.log('Login attempt:');
        console.log('Email:', email);
        console.log('Password provided:', password ? 'Yes' : 'No');

        // Check if email is in admin list
        if (!isAdminEmail(email)) {
            console.log('Email not in admin list');
            return {
                success: false,
                error: 'You are not authorized to access this admin panel.'
            };
        }

        console.log('Email authorized, checking password...');

        // Check password
        if (password === ADMIN_PASSWORD) {
            console.log('Password correct, creating token...');

            // Create JWT token with email
            const token = jwt.sign(
                { email: email, role: 'admin' },
                ADMIN_SECRET_KEY,
                { expiresIn: '24h' }
            );

            cookies.set('admin_token', token, {
                path: '/',
                maxAge: 60 * 60 * 24, // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            console.log('Token created and cookie set, redirecting...');
            // Don't wrap this in try-catch - redirects are supposed to throw!
            throw redirect(302, '/admin');
        }

        console.log('Password incorrect');
        return {
            success: false,
            error: 'Invalid credentials.'
        };
    }
};