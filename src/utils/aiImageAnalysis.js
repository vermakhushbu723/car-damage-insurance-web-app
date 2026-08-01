// Lightweight, real (not mocked) client-side image heuristics used by the
// AI ILA screen's "Assessment Insights" panel — no Python/backend needed
// for these specific numbers, since they're classic CV signal-processing,
// not learned models:
//
//   - Image Quality  -> Laplacian-variance blur/sharpness estimate
//   - Duplicate Images -> perceptual average-hash (aHash) + Hamming distance
//
// Both run entirely in the browser via <canvas>. They're heuristics, not a
// trained quality/dedup model — good enough to flag "this photo looks
// blurry" or "these two photos look the same," not a substitute for a real
// no-reference image-quality model if you need one later.

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function drawToCanvas(img, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);
    return ctx.getImageData(0, 0, size, size);
}

function toGrayscale(imageData) {
    const { data, width, height } = imageData;
    const gray = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }
    return { gray, width, height };
}

/**
 * 0-100 sharpness score via variance of the Laplacian (edge response) —
 * the standard cheap blur-detection heuristic. Higher variance = more
 * high-frequency detail = sharper photo. The /1500 normalization constant
 * was picked empirically against a handful of test photos; tune it if your
 * survey photos run consistently sharper/blurrier than that.
 */
export async function computeImageQuality(src) {
    const SIZE = 256;
    const img = await loadImageElement(src);
    const imageData = drawToCanvas(img, SIZE);
    const { gray, width, height } = toGrayscale(imageData);

    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            const laplacian =
                4 * gray[idx] - gray[idx - 1] - gray[idx + 1] - gray[idx - width] - gray[idx + width];
            sum += laplacian;
            sumSq += laplacian * laplacian;
            count++;
        }
    }
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;

    const score = Math.round(Math.min(100, (variance / 1500) * 100));
    return Math.max(0, score);
}

/**
 * 8x8 average-hash (aHash): downsample to 8x8 grayscale, threshold each
 * pixel against the mean -> a 64-bit fingerprint. Near-identical photos
 * (e.g. the same shot uploaded twice, or two frames a second apart) produce
 * hashes with a small Hamming distance.
 */
export async function computeAverageHash(src) {
    const SIZE = 8;
    const img = await loadImageElement(src);
    const imageData = drawToCanvas(img, SIZE);
    const { gray } = toGrayscale(imageData);

    const mean = gray.reduce((a, b) => a + b, 0) / gray.length;
    return gray.map((v) => (v >= mean ? '1' : '0')).join('');
}

export function hammingDistance(hashA, hashB) {
    let dist = 0;
    for (let i = 0; i < hashA.length; i++) {
        if (hashA[i] !== hashB[i]) dist++;
    }
    return dist;
}

/**
 * Given a list of { id, hash } photos, returns the set of ids that have at
 * least one near-duplicate elsewhere in the list (Hamming distance <=
 * threshold out of 64 bits — 8 is a commonly-used aHash duplicate cutoff).
 */
export function findDuplicateIds(photos, threshold = 4) {
    const duplicateIds = new Set();
    for (let i = 0; i < photos.length; i++) {
        for (let j = i + 1; j < photos.length; j++) {
            if (hammingDistance(photos[i].hash, photos[j].hash) <= threshold) {
                duplicateIds.add(photos[i].id);
                duplicateIds.add(photos[j].id);
            }
        }
    }
    return duplicateIds;
}
