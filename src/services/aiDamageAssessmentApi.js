// Thin client for the AI Damage Assessment Service (../../ai-damage-assessment-service).
// See that service's README.md / docs/ARCHITECTURE.md for what each call does.
//
// Base URL defaults to the service's local dev port; override with
// VITE_AI_SERVICE_URL in a .env file if it's deployed elsewhere.
const BASE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

async function parseOrThrow(response) {
    if (!response.ok) {
        let detail = response.statusText;
        try {
            const body = await response.json();
            detail = body.detail || JSON.stringify(body);
        } catch {
            /* response wasn't JSON — keep statusText */
        }
        throw new Error(`AI service request failed (${response.status}): ${detail}`);
    }
    return response.json();
}

/**
 * Runs YOLO11-seg damage detection on one photo.
 * @param {File} photoFile
 * @param {'car'|'two_wheeler'|'commercial_vehicle'} vehicleType
 */
export async function detectDamage(photoFile, vehicleType) {
    const form = new FormData();
    form.append('photo', photoFile);
    form.append('vehicle_type', vehicleType);

    const response = await fetch(`${BASE_URL}/api/v1/detect`, {
        method: 'POST',
        body: form,
    });
    return parseOrThrow(response);
}

/**
 * Runs the cost/severity engine against a set of detections.
 * @param {{make: string, model: string, year: number, region?: string}} vehicle
 * @param {Array<object>} detections
 * @param {string} [photoId]
 */
export async function assessDamage(vehicle, detections, photoId) {
    const response = await fetch(`${BASE_URL}/api/v1/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, detections, photo_id: photoId }),
    });
    return parseOrThrow(response);
}

/**
 * Generates the Llama narrative + cause-consistency check for a claim.
 */
export async function generateReport({ claimId, vehicle, reportedCause, detections, assessment }) {
    const response = await fetch(`${BASE_URL}/api/v1/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            claim_id: claimId,
            vehicle,
            reported_cause: reportedCause,
            detections,
            assessment,
        }),
    });
    return parseOrThrow(response);
}

/**
 * Logs a handler's correction to the AI output — this feeds the retraining
 * queue (docs/ARCHITECTURE.md Section 5).
 */
export async function submitCorrection({ claimId, photoId, vehicleType, aiOutput, correctedOutput, reviewerId, reason }) {
    const response = await fetch(`${BASE_URL}/api/v1/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            claim_id: claimId,
            photo_id: photoId,
            vehicle_type: vehicleType,
            ai_output: aiOutput,
            corrected_output: correctedOutput,
            reviewer_id: reviewerId,
            reason,
        }),
    });
    return parseOrThrow(response);
}

export async function getRetrainingQueueStats() {
    const response = await fetch(`${BASE_URL}/api/v1/corrections/stats`);
    return parseOrThrow(response);
}

export async function getPartsRates({ make, model, year, region } = {}) {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (region) params.set('region', region);

    const response = await fetch(`${BASE_URL}/api/v1/parts-rates?${params.toString()}`);
    return parseOrThrow(response);
}
