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

// ── Annotation Studio ──────────────────────────────────────────────────
// Backs the "Upload photos → annotate → save" flow, which writes straight
// into ../../ai-damage-assessment-service/training/raw_pool/<vehicle_type>/
// -- exactly what training/scripts/prepare_dataset.py expects next. See
// that service's server/src/routes/annotations.js.

/** Absolute URL for an annotation photo's raw image bytes (for an <img src>). */
export function annotationPhotoFileUrl(fileUrl) {
    return `${BASE_URL}${fileUrl}`;
}

/**
 * Uploads one or more photos for a vehicle type. Each becomes a pending
 * (unannotated) row the studio can list and open.
 * @param {File[]} files
 * @param {'car'|'two_wheeler'|'commercial_vehicle'} vehicleType
 */
export async function uploadAnnotationPhotos(files, vehicleType) {
    const form = new FormData();
    form.append('vehicle_type', vehicleType);
    files.forEach((file) => form.append('photos', file));

    const response = await fetch(`${BASE_URL}/api/v1/annotations/upload`, {
        method: 'POST',
        body: form,
    });
    return parseOrThrow(response);
}

/** Lists uploaded photos (annotated + pending) for a vehicle type, newest first. */
export async function listAnnotationPhotos(vehicleType) {
    const response = await fetch(`${BASE_URL}/api/v1/annotations/photos?vehicle_type=${vehicleType}`);
    return parseOrThrow(response);
}

/**
 * Saves polygon annotations for one photo -- writes a YOLO segmentation
 * label into the raw pool and marks the photo annotated.
 * @param {string} photoId
 * @param {{imageWidth: number, imageHeight: number, polygons: Array<{part: string, damage_type: string, points: [number, number][]}>}} payload
 */
export async function saveAnnotation(photoId, { imageWidth, imageHeight, polygons }) {
    const response = await fetch(`${BASE_URL}/api/v1/annotations/photos/${photoId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_width: imageWidth, image_height: imageHeight, polygons }),
    });
    return parseOrThrow(response);
}

/** Deletes an uploaded photo (and its label, if any) from the raw pool. */
export async function deleteAnnotationPhoto(photoId) {
    const response = await fetch(`${BASE_URL}/api/v1/annotations/photos/${photoId}`, { method: 'DELETE' });
    return parseOrThrow(response);
}

// ── Training (the "Start Training" button) ──────────────────────────────
// Runs training/scripts/prepare_dataset.py then train.py as a background
// process on the server -- see server/src/routes/training.js. One job at a
// time; poll getTrainingStatus() while it's preparing/training.

/**
 * @param {{vehicleType: 'car'|'two_wheeler'|'commercial_vehicle', epochs?: number, base?: string, device?: string, batch?: number}} opts
 * `batch` can be omitted -- the server picks a safe default per device (low
 * on CPU, since a big base checkpoint at the default batch reliably
 * crashes with an out-of-memory access violation on CPU-only machines).
 */
export async function startTraining({ vehicleType, epochs, base, device, batch }) {
    const response = await fetch(`${BASE_URL}/api/v1/training/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_type: vehicleType, epochs, base, device, batch }),
    });
    return parseOrThrow(response);
}

export async function getTrainingStatus() {
    const response = await fetch(`${BASE_URL}/api/v1/training/status`);
    return parseOrThrow(response);
}

export async function cancelTraining() {
    const response = await fetch(`${BASE_URL}/api/v1/training/cancel`, { method: 'POST' });
    return parseOrThrow(response);
}

/** Absolute URL for a training report chart/image (job.report.image_urls entries are relative). */
export function trainingReportImageUrl(relativeUrl) {
    return `${BASE_URL}${relativeUrl}`;
}
