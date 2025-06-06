// src/routes/+layout.server.js
export const load = async ({ locals: { safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    return {
        session,
        user,
    }
}