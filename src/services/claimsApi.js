// Thin client for the claims backend
// (../../ai-damage-assessment-service/claims-service). Kept as its own
// file, separate from authApi.js/aiDamageAssessmentApi.js, since it's a
// different service (different port, different concern -- see that
// service's README.md).
//
// Base URL defaults to the service's local dev port; override with
// VITE_CLAIMS_SERVICE_URL in .env if it's deployed elsewhere.
const BASE_URL = import.meta.env.VITE_CLAIMS_SERVICE_URL || 'http://localhost:8020';

async function parseOrThrow(response) {
    if (!response.ok) {
        let detail = response.statusText;
        try {
            const body = await response.json();
            detail = body.detail || JSON.stringify(body);
        } catch {
            /* response wasn't JSON -- keep statusText */
        }
        throw new Error(detail || `Claims service request failed (${response.status})`);
    }
    return response.json();
}

/**
 * Creates a claim from the Owner & Vehicle Details form. Requires a valid
 * login token (see src/utils/authSession.js) -- the claim's role/creator
 * are stamped server-side from that token, not sent here.
 * @param {string} token
 * @param {object} form - ownerName, mobile, email, odometer, registrationNumber, state, registrationDate, product, make, model, variant, manufacturingYear
 * @returns {Promise<{claim: object}>}
 */
export async function createClaim(token, form) {
    const response = await fetch(`${BASE_URL}/api/v1/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
    });
    return parseOrThrow(response);
}

/**
 * Lists claims for the logged-in portal only (role-scoped server-side).
 * @param {string} token
 * @param {'Pending'|'Completed'} [status]
 * @returns {Promise<{claims: object[], counts: {total: number, completed: number, pending: number}}>}
 */
export async function getClaims(token, status) {
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`${BASE_URL}/api/v1/claims${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return parseOrThrow(response);
}
