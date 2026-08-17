// Realistic mock AI ILA data so the redesigned screen can be fully tested
// WITHOUT the Python backend running — no detect/assess/report network
// calls happen in demo mode. Every number here is either hand-picked to be
// plausible (clearly a demo, not a real claim) or, where noted, will later
// be swapped for a real client-side computed metric (image quality,
// duplicates) once wired to actual photos.

import sampleFront from '../assets/png/car/Front.png';
import sampleFrontLeft from '../assets/png/car/FrontLeft.png';
import sampleFrontRight from '../assets/png/car/FrontRight.png';
import sampleLeft from '../assets/png/car/Left.png';
import sampleRight from '../assets/png/car/Right.png';
import sampleRear from '../assets/png/car/Rear.png';
import sampleRearLeft from '../assets/png/car/RearLeft.png';
import sampleOdometer from '../assets/png/car/Odometer.png';

export const DEMO_VEHICLE = { make: 'Toyota', model: 'Camry XSE', year: 2024, region: 'default' };
export const DEMO_CLAIM = { claimId: 'CLM-2026-01984', policyNumber: 'POL-88214-A' };
export const DEMO_REPORTED_CAUSE = 'front_collision';

// Bounding boxes are normalized (0-1) [x, y] rectangle corners over the
// "Front.png" sample silhouette — illustrative placement, not derived from
// real pixel detections (there's no real damaged-Camry photo in this repo).
const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export const DEMO_DETECTIONS = [
    { part: 'front_bumper', damage_type: 'crack', confidence: 0.96, mask_area_ratio: 0.22, mask_polygon: box(0.27, 0.70, 0.46, 0.13), displayLabel: 'Front Bumper', displayStatus: 'Cracked' },
    { part: 'left_headlight', damage_type: 'lamp_broken', confidence: 0.94, mask_area_ratio: 0.20, mask_polygon: box(0.15, 0.42, 0.16, 0.12), displayLabel: 'Left Headlight', displayStatus: 'Broken' },
    { part: 'front_left_fender', damage_type: 'dent', confidence: 0.88, mask_area_ratio: 0.16, mask_polygon: box(0.08, 0.55, 0.18, 0.15), displayLabel: 'Front Left Fender', displayStatus: 'Dented' },
    { part: 'hood', damage_type: 'scratch', confidence: 0.82, mask_area_ratio: 0.18, mask_polygon: box(0.30, 0.30, 0.40, 0.15), displayLabel: 'Hood', displayStatus: 'Paint Damage' },
    { part: 'left_door', damage_type: 'scratch', confidence: 0.78, mask_area_ratio: 0.14, mask_polygon: box(0.05, 0.38, 0.20, 0.16), displayLabel: 'Left Door', displayStatus: 'Scratched' },
    { part: 'rear_right_quarter', damage_type: 'dent', confidence: 0.91, mask_area_ratio: 0.15, mask_polygon: box(0.74, 0.55, 0.20, 0.14), displayLabel: 'Rear Right Quarter', displayStatus: 'Dented' },
    { part: 'rear_bumper', damage_type: 'scratch', confidence: 0.74, mask_area_ratio: 0.12, mask_polygon: box(0.30, 0.85, 0.40, 0.10), displayLabel: 'Rear Bumper', displayStatus: 'Scratched' },
    { part: 'windshield_front', damage_type: 'crack', confidence: 0.92, mask_area_ratio: 0.15, mask_polygon: box(0.30, 0.08, 0.40, 0.16), displayLabel: 'Windshield', displayStatus: 'Cracked' },
];

// Row status the handler has assigned in the reviewer workflow (see
// rowStatus state in AiIlaAssessmentPage.jsx) -- keyed by part, applied
// when entering demo mode so it matches the reference design exactly.
export const DEMO_ROW_STATUS = {
    front_bumper: 'Pending', left_headlight: 'Approval', front_left_fender: 'Pending',
    hood: 'In Review', left_door: 'In Review', rear_right_quarter: 'Pending',
    rear_bumper: 'Pending', windshield_front: 'Approval',
};

export const DEMO_LINE_ITEMS = [
    { part: 'front_bumper', damage_type: 'crack', severity: 'severe', action: 'repair', part_cost: 0, labor_cost: 32000, paint_consumables_cost: 16500, line_total: 48500, rate_source: 'parts_rate_db' },
    { part: 'left_headlight', damage_type: 'lamp_broken', severity: 'severe', action: 'replace', part_cost: 21000, labor_cost: 1800, paint_consumables_cost: 0, line_total: 22800, rate_source: 'parts_rate_db' },
    { part: 'front_left_fender', damage_type: 'dent', severity: 'moderate', action: 'repair', part_cost: 0, labor_cost: 7200, paint_consumables_cost: 5200, line_total: 12400, rate_source: 'parts_rate_db' },
    { part: 'hood', damage_type: 'scratch', severity: 'minor', action: 'repair', part_cost: 0, labor_cost: 3600, paint_consumables_cost: 3200, line_total: 6800, rate_source: 'parts_rate_db' },
    { part: 'left_door', damage_type: 'scratch', severity: 'minor', action: 'repair', part_cost: 0, labor_cost: 1800, paint_consumables_cost: 1400, line_total: 3200, rate_source: 'parts_rate_db' },
    { part: 'rear_right_quarter', damage_type: 'dent', severity: 'moderate', action: 'repair', part_cost: 0, labor_cost: 8400, paint_consumables_cost: 5800, line_total: 14200, rate_source: 'parts_rate_db' },
    { part: 'rear_bumper', damage_type: 'scratch', severity: 'minor', action: 'repair', part_cost: 0, labor_cost: 2200, paint_consumables_cost: 1900, line_total: 4100, rate_source: 'parts_rate_db' },
    { part: 'windshield_front', damage_type: 'crack', severity: 'moderate', action: 'replace', part_cost: 16500, labor_cost: 2400, paint_consumables_cost: 0, line_total: 18900, rate_source: 'parts_rate_db' },
];

export const DEMO_NARRATIVE = `[DEMO DATA -- no photo was analyzed and no LLM was called; this narrative is illustrative, matching the shape a real /report response returns.]

Vehicle: ${DEMO_VEHICLE.year} ${DEMO_VEHICLE.make} ${DEMO_VEHICLE.model}
Reported cause: front collision

Damage summary:
- Front Bumper: crack, severe -> repair (structural crack, bumper reinforcement intact).
- Left Headlight: lamp_broken, severe -> replace (housing destroyed, non-repairable).
- Front Left Fender: dent, moderate -> repair (panel beating + repaint).
- Hood: paint damage, minor -> repair (surface scratch, no denting).
- Left Door: scratch, minor -> repair (cosmetic, panel intact).
- Rear Right Quarter: dent, moderate -> repair (panel beating + repaint).
- Rear Bumper: scratch, minor -> repair (cosmetic, no structural damage).
- Windshield: crack, moderate -> replace (crack within driver's critical vision area).

Cause-consistency: the reported cause (front collision) is consistent with damage
concentrated on the front bumper, left headlight, hood and windshield -- the cluster
a frontal impact would affect. The rear/side damage (fender, door, rear quarter,
rear bumper) is flagged for review since it falls outside that expected cluster.`;

export const DEMO_CAUSE_CHECK = {
    reported_cause: DEMO_REPORTED_CAUSE,
    consistency_score: 0.94,
    is_consistent: true,
    expected_parts: ['front_bumper', 'left_headlight', 'hood', 'windshield_front'],
    detected_parts: ['front_bumper', 'left_headlight', 'front_left_fender', 'hood', 'left_door', 'rear_right_quarter', 'rear_bumper', 'windshield_front'],
    explanation: 'Detected damage is concentrated on the front bumper, left headlight, hood and windshield, consistent with the reported front collision; the additional side/rear damage is a minor inconsistency flagged for handler review.',
};

export const DEMO_TOTAL_COST = DEMO_LINE_ITEMS.reduce((sum, item) => sum + item.line_total, 0);

// 8 distinct sample photos for the thumbnail strip / duplicate-check demo
// -- genuinely distinct images, so the real perceptual-hash duplicate
// checker (src/utils/aiImageAnalysis.js) should honestly report 0
// duplicates against these, the same way it would for 8 real distinct
// survey photos.
export const DEMO_PHOTOS = [
    { id: 'front', label: 'Front', src: sampleFront },
    { id: 'front-left', label: 'Front Left', src: sampleFrontLeft },
    { id: 'front-right', label: 'Front Right', src: sampleFrontRight },
    { id: 'left', label: 'Left', src: sampleLeft },
    { id: 'right', label: 'Right', src: sampleRight },
    { id: 'rear', label: 'Rear', src: sampleRear },
    { id: 'rear-left', label: 'Rear Left', src: sampleRearLeft },
    { id: 'odometer', label: 'Odometer', src: sampleOdometer },
];

function estimateRepairDurationDays(lineItems) {
    const replaceCount = lineItems.filter((i) => i.action === 'replace').length;
    const repairCount = lineItems.filter((i) => i.action === 'repair').length;
    const maxDays = Math.round(2 + replaceCount * 1.5 + repairCount * 1);
    const minDays = Math.max(1, maxDays - 2);
    return `${minDays}-${maxDays} Days`;
}

export const DEMO_EST_REPAIR_DURATION = estimateRepairDurationDays(DEMO_LINE_ITEMS);
