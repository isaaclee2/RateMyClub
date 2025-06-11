import { redirect, fail } from '@sveltejs/kit';
import { ADMIN_PASSWORD, ADMIN_SECRET_KEY, ADMIN_EMAILS } from '$env/static/private';
import jwt from 'jsonwebtoken';

// Rate limiting storage (in production, use Redis or database)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request) {
    return request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (!attempts) {
        loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }

    if (now > attempts.resetTime) {
        loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }

    if (attempts.count >= MAX_ATTEMPTS) {
        return false;
    }

    attempts.count++;
    return true;
}

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
        const ip = getClientIP(request);

        // Rate limiting check
        if (!checkRateLimit(ip)) {
            console.log(`Rate limit exceeded for IP: ${ip} at ${new Date()}`);
            return fail(429, {
                error: 'Too many login attempts. Please try again in 15 minutes.'
            });
        }

        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // Input validation
        if (!email || !password) {
            console.log(`Invalid login attempt (missing fields) from IP: ${ip} at ${new Date()}`);
            return fail(400, {
                error: 'Invalid credentials.'
            });
        }

        // Check both email authorization AND password
        if (!isAdminEmail(email) || password !== ADMIN_PASSWORD) {
            console.log(`Failed login attempt for email: ${email} from IP: ${ip} at ${new Date()}`);
            return fail(401, {
                error: 'Invalid credentials.'
            });
        }

        // Success case
        console.log(`Successful admin login: ${email} from IP: ${ip} at ${new Date()}`);

        const token = jwt.sign(
            { email: email, role: 'admin', loginTime: Date.now() },
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

        // Clear rate limit on successful login
        loginAttempts.delete(ip);

        throw redirect(302, '/admin');
    }
};