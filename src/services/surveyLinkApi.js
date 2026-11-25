// Client for the call-center survey link (callcenter-service, public
// /api/v1/survey/:token routes). The call center sends the customer a link
// that lands on /claim-weblink/claim-start?token=...; the token is kept in
// sessionStorage for the rest of the flow. Every document / photo / video
// captured is uploaded into the claim's Documents DMS, then the survey is
// submitted.
//
// Override the base URL with VITE_SURVEY_API_URL in .env.
const BASE_URL = import.meta.env.VITE_SURVEY_API_URL || 'https://callsenter.ibimaassist.online/api/v1';
const TOKEN_KEY = 'survey_link_token';
const CLAIM_KEY = 'survey_link_claim';

async function parseOrThrow(response) {
    let body = null;
    try {
        body = await response.json();
    } catch {
        /* not JSON */
    }
    if (!response.ok) throw new Error(body?.detail || `Survey request failed (${response.status})`);
    return body;
}

/** Reads ?token= from the URL (survey link) into the session; returns the active token. */
export function captureSurveyToken(search = window.location.search) {
    const token = new URLSearchParams(search).get('token');
    try {
        if (token && token !== sessionStorage.getItem(TOKEN_KEY)) {
            sessionStorage.setItem(TOKEN_KEY, token);
            sessionStorage.removeItem(CLAIM_KEY);
        }
        return sessionStorage.getItem(TOKEN_KEY);
    } catch {
        return token;
    }
}

export const getSurveyToken = () => {
    try {
        return sessionStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

/** The claim fetched for this link (cached for the session). */
export const getCachedSurveyClaim = () => {
    try {
        return JSON.parse(sessionStorage.getItem(CLAIM_KEY) || 'null');
    } catch {
        return null;
    }
};

/** GET the intimation details the call center entered for this link. */
export async function fetchSurveyClaim(token = getSurveyToken()) {
    if (!token) return null;
    const claim = await parseOrThrow(await fetch(`${BASE_URL}/survey/${encodeURIComponent(token)}`));
    try {
        sessionStorage.setItem(CLAIM_KEY, JSON.stringify(claim));
    } catch {
        /* ignore */
    }
    return claim;
}

/** Uploads one file (File / Blob) as a DMS document of `type`. */
export async function uploadSurveyFile(type, file, name, token = getSurveyToken()) {
    if (!token) return null;
    const res = await fetch(`${BASE_URL}/survey/${encodeURIComponent(token)}/files/${encodeURIComponent(type)}`, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream', 'X-File-Name': encodeURIComponent(name || file.name || 'document') },
        body: file,
    });
    return parseOrThrow(res);
}

/** data:image/...;base64 (or blob:) URL -> Blob. */
export async function urlToBlob(url) {
    return (await fetch(url)).blob();
}

export async function submitSurvey(payload, token = getSurveyToken()) {
    const res = await fetch(`${BASE_URL}/survey/${encodeURIComponent(token)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload ?? {}),
    });
    return parseOrThrow(res);
}

/** Survey document id (DocumentUploadPage) -> DMS document type. */
export const SURVEY_DOC_TYPES = {
    claim_form: 'claim-form',
    driving_license: 'dl',
    rc: 'rc',
    repair_estimate: 'estimate',
    aadhar: 'kyc',
    pan: 'kyc',
    others: 'other',
};
