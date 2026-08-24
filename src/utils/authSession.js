// Per-role session storage. Keyed by role (not one shared "auth" key) so
// logging into one portal in a browser tab never clobbers a session held
// for another portal -- each of the 4 field-portal logins
// (claim-workshop, claim-surveyor, preinspection-agent,
// preinspection-surveyor) keeps its own independent session, matching how
// ../../ai-damage-assessment-service/auth-service scopes accounts by
// (role, username).

const STORAGE_PREFIX = 'ibima_auth_';

function storageKey(role) {
    return `${STORAGE_PREFIX}${role}`;
}

/** Decodes a JWT's payload without verifying the signature (verification happens server-side) -- used here only to read `exp` for a cheap client-side "is this still current" check. */
function decodeTokenPayload(token) {
    try {
        const [, payloadB64] = String(token).split('.');
        const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function isTokenExpired(token) {
    const payload = decodeTokenPayload(token);
    if (!payload || typeof payload.exp !== 'number') return true;
    return Math.floor(Date.now() / 1000) >= payload.exp;
}

/** @param {string} role @param {{token: string, user: object}} session */
export function saveSession(role, session) {
    localStorage.setItem(storageKey(role), JSON.stringify(session));
}

/** Returns { token, user } for this role, or null if there's no session / it's expired (and clears it if so). */
export function getSession(role) {
    const raw = localStorage.getItem(storageKey(role));
    if (!raw) return null;
    try {
        const session = JSON.parse(raw);
        if (!session?.token || isTokenExpired(session.token)) {
            clearSession(role);
            return null;
        }
        return session;
    } catch {
        clearSession(role);
        return null;
    }
}

export function clearSession(role) {
    localStorage.removeItem(storageKey(role));
}

export function isAuthenticated(role) {
    return getSession(role) !== null;
}
