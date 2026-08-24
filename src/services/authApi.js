// Thin client for the standalone login backend
// (../../ai-damage-assessment-service/auth-service). Kept as its own file,
// separate from aiDamageAssessmentApi.js, since it's a different service
// (different port, different concern -- see that service's README.md).
//
// Base URL defaults to the service's local dev port; override with
// VITE_AUTH_SERVICE_URL in .env if it's deployed elsewhere.
const BASE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8010';

async function parseOrThrow(response) {
    if (!response.ok) {
        let detail = response.statusText;
        try {
            const body = await response.json();
            detail = body.detail || JSON.stringify(body);
        } catch {
            /* response wasn't JSON -- keep statusText */
        }
        throw new Error(detail || `Login service request failed (${response.status})`);
    }
    return response.json();
}

/**
 * Logs in to one specific portal. The same username can exist under
 * different roles as unrelated accounts, so `role` always has to match the
 * portal the user is signing into.
 * @param {'claim_workshop'|'claim_surveyor'|'preinspection_agent'|'preinspection_surveyor'} role
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{token: string, expiresInSeconds: number, user: object}>}
 */
export async function login(role, username, password) {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password }),
    });
    return parseOrThrow(response);
}

/** Re-validates a token against the backend and returns the current user (or throws if invalid/expired/deactivated). */
export async function fetchCurrentUser(token) {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return parseOrThrow(response);
}

/** Stateless on the backend (nothing to invalidate) -- called for consistency/future-proofing. Never throws. */
export async function logout(token) {
    try {
        await fetch(`${BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    } catch {
        /* best-effort -- local session is cleared regardless, see authSession.js */
    }
}
