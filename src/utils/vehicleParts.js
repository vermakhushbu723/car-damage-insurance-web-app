// Shared vehicle-part vocabulary for the AI Damage Assessment and Offline
// Training (Annotation Studio) pages. Values match the backend's PARTS list
// (ai-damage-assessment-service/server/src/schemas/constants.js) so the cost
// engine's parts-rate lookup keeps working; labels are what the UI shows.

export const ALL_PARTS = 'all';

export const PART_OPTIONS = [
    { value: 'front_bumper', label: 'Front Bumper' },
    { value: 'rear_bumper', label: 'Rear Bumper' },
    { value: 'bonnet', label: 'Bonnet' },
    { value: 'front_door_lh', label: 'Front Door (Left)' },
    { value: 'front_door_rh', label: 'Front Door (Right)' },
    { value: 'rear_door_lh', label: 'Rear Door (Left)' },
    { value: 'rear_door_rh', label: 'Rear Door (Right)' },
    { value: 'fender_lh', label: 'Fender (Left)' },
    { value: 'fender_rh', label: 'Fender (Right)' },
    { value: 'headlamp_lh', label: 'Headlight (Left)' },
    { value: 'headlamp_rh', label: 'Headlight (Right)' },
    { value: 'tail_light_lh', label: 'Tail Light (Left)' },
    { value: 'tail_light_rh', label: 'Tail Light (Right)' },
    { value: 'windshield_front', label: 'Front Windshield' },
    { value: 'windshield_rear', label: 'Rear Windshield' },
    { value: 'roof', label: 'Roof' },
    { value: 'boot_lid', label: 'Boot / Dickey' },
    { value: 'wheel_tyre', label: 'Wheel / Tyre' },
];

export const PART_VALUES = PART_OPTIONS.map((p) => p.value);

export const PART_FILTER_OPTIONS = [{ value: ALL_PARTS, label: 'All Parts (Full Vehicle)' }, ...PART_OPTIONS];

export function partLabel(value) {
    if (!value || value === 'unassigned') return 'Unassigned';
    return PART_OPTIONS.find((p) => p.value === value)?.label || value;
}

export function matchesPart(part, filter) {
    return filter === ALL_PARTS || part === filter;
}

function centroid(polygon) {
    if (!polygon?.length) return { x: 0.5, y: 0.5 };
    const sum = polygon.reduce((acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }), { x: 0, y: 0 });
    return { x: sum.x / polygon.length, y: sum.y / polygon.length };
}

// Best-guess part for a detection the model left "unassigned" -- the model
// only predicts damage type, not part. Uses the damage type, the photo angle
// the handler picked under the thumbnail, and where the damage sits in the
// frame. It's a rule of thumb, not a trained classifier: the handler can
// change it in the table, and those edits go to the retraining queue.
export function suggestPart(detection, angle = 'Other') {
    const { damage_type: type } = detection;
    const { x, y } = centroid(detection.mask_polygon);
    const a = angle.toLowerCase();
    const isFront = a.startsWith('front');
    const isRear = a.startsWith('rear');
    // Facing the front of the car, the car's left side is on the image's right.
    const frontSide = x < 0.5 ? 'rh' : 'lh';
    const rearSide = x < 0.5 ? 'lh' : 'rh';
    const sideOf = a.includes('left') ? 'lh' : a.includes('right') ? 'rh' : null;
    // Side photos: the car's front is on the image's left for a left-side
    // shot and on the right for a right-side shot -- fx is 0 at the front.
    const fx = sideOf === 'rh' ? 1 - x : x;

    if (type === 'tire_flat') return 'wheel_tyre';

    if (type === 'lamp_broken') {
        if (isRear) return `tail_light_${sideOf || rearSide}`;
        if (sideOf && !isFront) return fx < 0.5 ? `headlamp_${sideOf}` : `tail_light_${sideOf}`;
        return `headlamp_${sideOf || frontSide}`;
    }

    if (type === 'glass_shatter') {
        if (isRear) return 'windshield_rear';
        if (isFront || !sideOf) return 'windshield_front';
        return fx < 0.5 ? `front_door_${sideOf}` : `rear_door_${sideOf}`;
    }

    // dent / scratch / crack / unknown -- body panels
    if (isFront) {
        if (a === 'front') return y > 0.55 ? 'front_bumper' : 'bonnet';
        return y > 0.6 ? 'front_bumper' : `fender_${sideOf}`;
    }
    if (isRear) {
        if (a === 'rear') return y > 0.55 ? 'rear_bumper' : 'boot_lid';
        return y > 0.6 ? 'rear_bumper' : `rear_door_${sideOf}`;
    }
    if (sideOf) {
        if (y < 0.25) return 'roof';
        if (fx < 0.25) return `fender_${sideOf}`;
        return fx < 0.55 ? `front_door_${sideOf}` : `rear_door_${sideOf}`;
    }
    return 'unassigned';
}
