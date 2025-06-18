// src/routes/auth/+page.server.js
import { redirect, fail } from '@sveltejs/kit'

// Rate limiting storage
const authAttempts = new Map();
const MAX_AUTH_ATTEMPTS = 10;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function getClientIP(request) {
    return request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const attempts = authAttempts.get(ip);

    if (!attempts) {
        authAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }

    if (now > attempts.resetTime) {
        authAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }

    if (attempts.count >= MAX_AUTH_ATTEMPTS) {
        return false;
    }

    attempts.count++;
    return true;
}

function isValidReturnPath(path) {
    // Only allow specific safe paths
    const allowedPaths = [
        '/', '/all-clubs', '/about', '/contact', '/admin'
        // Add other safe paths here
    ];

    // Check if it's a club page (e.g., /club/some-club-name)
    const clubPageRegex = /^\/club\/[a-zA-Z0-9-]+$/;

    return allowedPaths.includes(path) || clubPageRegex.test(path);
}

export const actions = {
    google: async ({ url, locals: { supabase }, request }) => {
        const ip = getClientIP(request);

        // Rate limiting check
        if (!checkRateLimit(ip)) {
            console.log(`Auth rate limit exceeded for IP: ${ip} at ${new Date()}`);
            return fail(429, {
                error: 'Too many authentication attempts. Please try again in 5 minutes.'
            });
        }

        // Check for next parameter in URL first, then fallback to referrer
        let returnPath = url.searchParams.get('next') || '/all-clubs';

        // If no next param, check referrer
        if (!url.searchParams.get('next')) {
            const referrer = request.headers.get('referer');
            if (referrer) {
                try {
                    const referrerUrl = new URL(referrer);
                    if (referrerUrl.origin === url.origin) {
                        const requestedPath = referrerUrl.pathname + referrerUrl.search;

                        // Validate the return path for security
                        if (isValidReturnPath(referrerUrl.pathname)) {
                            returnPath = requestedPath;
                        }
                    }
                } catch (e) {
                    console.log(`Invalid referrer URL from IP: ${ip}:`, e.message);
                }
            }
        }

        // Validate the next parameter too
        if (url.searchParams.get('next')) {
            try {
                const nextUrl = new URL(url.searchParams.get('next'), url.origin);
                if (!isValidReturnPath(nextUrl.pathname)) {
                    returnPath = '/all-clubs'; // Safe fallback
                }
            } catch (e) {
                returnPath = '/all-clubs'; // Safe fallback
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
        });

        if (error) {
            console.error(`OAuth error from IP: ${ip}:`, error.message);
            return fail(500, { error: 'Authentication failed. Please try again.' });
        }

        if (data.url) {
            console.log(`Successful OAuth redirect for IP: ${ip} at ${new Date()}`);
            redirect(303, data.url);
        }

        return fail(500, { error: 'Authentication failed. Please try again.' });
    },

    logout: async ({ locals: { supabase }, request }) => {
        const ip = getClientIP(request);
        console.log(`User logout from IP: ${ip} at ${new Date()}`);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(`Logout error from IP: ${ip}:`, error.message);
            return fail(500, { error: 'Logout failed. Please try again.' });
        }

        redirect(303, '/');
    }
}