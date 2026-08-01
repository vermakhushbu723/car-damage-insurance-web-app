// Derives the "AI Assessment Insights" panel's summary numbers from the
// same Detection / AssessmentResult / CauseCheckResult shapes the real
// backend returns (app/schemas.py) -- so these work identically whether
// the data came from a real /detect+/assess+/report run or from demo mode
// (src/utils/aiDemoData.js). None of this needs a model; it's just a
// summary rollup of numbers the pipeline already produced.

const SEVERITY_WEIGHT = { minor: 25, moderate: 55, severe: 90 };

/** Average detection confidence across all detections, as a 0-100 percent. */
export function computeAiConfidence(detections) {
    if (!detections?.length) return 0;
    const avg = detections.reduce((sum, d) => sum + (d.confidence || 0), 0) / detections.length;
    return Math.round(avg * 100);
}

/** 0-100 severity-weighted index across only the actually-damaged detections. */
export function computeDamageScore(lineItems) {
    if (!lineItems?.length) return 0;
    const weighted = lineItems.map((item) => SEVERITY_WEIGHT[item.severity] ?? 40);
    return Math.round(weighted.reduce((a, b) => a + b, 0) / weighted.length);
}

/**
 * Rough fraud-signal indicator derived from the cause-consistency check
 * (app/models/cause_check.py) -- NOT a trained fraud model. A low
 * consistency score (detected damage doesn't match the reported cause)
 * pushes this up; this is meant to feed the fraud-rules engine as one
 * signal among several, per docs/ARCHITECTURE.md Section 4.3, not to be
 * read as a calibrated probability on its own.
 */
export function computeFraudSignal(causeCheck) {
    if (!causeCheck) return null;
    return Math.round((1 - causeCheck.consistency_score) * 100);
}

export function estimateRepairDurationDays(lineItems) {
    if (!lineItems?.length) return 'N/A';
    const replaceCount = lineItems.filter((i) => i.action === 'replace').length;
    const repairCount = lineItems.filter((i) => i.action === 'repair').length;
    const maxDays = Math.round(2 + replaceCount * 1.5 + repairCount * 1);
    const minDays = Math.max(1, maxDays - 2);
    return `${minDays}-${maxDays} Days`;
}
