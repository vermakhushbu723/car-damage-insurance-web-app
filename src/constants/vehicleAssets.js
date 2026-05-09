// Maps the "Select Product" choice on /owner-vehicle-details to the asset
// folder under /public/images/png/ that holds the matching silhouette and
// per-angle guide images. The folder names also double as the Redux
// "category" value used by the camera flow.

export const VEHICLE_CATEGORIES = Object.freeze({
    CAR: 'car',
    BIKE: 'bike',
    TRUCK: 'truck',
});

// Each "Select Product" option from OwnerVehicleDetailsPage maps to one
// of the three image folders. Anything not listed here falls back to CAR.
export const PRODUCT_TO_CATEGORY = Object.freeze({
    'Private Car': VEHICLE_CATEGORIES.CAR,
    'Taxi': VEHICLE_CATEGORIES.CAR,
    'Two Wheeler': VEHICLE_CATEGORIES.BIKE,
    'Commercial Vehicle': VEHICLE_CATEGORIES.TRUCK,
});

// Per-category filename map for angle guide images. The folders use
// inconsistent casing for the rear-right file (`RearRight.png` for cars
// but `Rearright.png` for bikes/trucks), so we cannot template a single
// path — each category gets its own table. A `null` entry means the
// image isn't shipped for that category (e.g. bikes have no chassis
// number plate, so 'chassis-number' is null).
const ANGLE_FILES = {
    [VEHICLE_CATEGORIES.CAR]: {
        'rear-rh-side': 'RearRight.png',
        'rear-side': 'Rear.png',
        'rear-lh-side': 'RearLeft.png',
        'rh-side': 'Right.png',
        'front-rh-side': 'FrontRight.png',
        'front-side': 'Front.png',
        'front-lh': 'FrontLeft.png',
        'lh-side': 'Left.png',
        'odometer': 'Odometer.png',
        'chassis-number': 'ChassisNumber.png',
        'video': 'car.png',
    },
    [VEHICLE_CATEGORIES.BIKE]: {
        'rear-rh-side': 'Rearright.png',
        'rear-side': 'Rear.png',
        'rear-lh-side': 'RearLeft.png',
        'rh-side': 'Right.png',
        'front-rh-side': 'FrontRight.png',
        'front-side': 'Front.png',
        'front-lh': 'FrontLeft.png',
        'lh-side': 'Left.png',
        'odometer': 'Odometer.png',
        'chassis-number': null, // bikes don't have a chassis-number plate asset
        'video': 'bike.png',
    },
    [VEHICLE_CATEGORIES.TRUCK]: {
        'rear-rh-side': 'Rearright.png',
        'rear-side': 'Rear.png',
        'rear-lh-side': 'RearLeft.png',
        'rh-side': 'Right.png',
        'front-rh-side': 'FrontRight.png',
        'front-side': 'Front.png',
        'front-lh': 'FrontLeft.png',
        'lh-side': 'Left.png',
        'odometer': 'Odometer.png',
        'chassis-number': 'ChassisNumber.png',
        'video': 'truck.png',
    },
};

const safeCategory = (category) =>
    ANGLE_FILES[category] ? category : VEHICLE_CATEGORIES.CAR;

// Resolve a "Select Product" string to a folder category (with car as
// the default for unknown / missing values).
export const getCategoryForProduct = (product) =>
    PRODUCT_TO_CATEGORY[product] || VEHICLE_CATEGORIES.CAR;

// Whole-vehicle silhouette used as the centre image on
// /photo-capture-selection and as a fallback guide on /camera-capture.
export const getCenterImage = (category) => {
    const cat = safeCategory(category);
    return `/images/png/${cat}/${cat}.png`;
};

// Per-angle guide image path. Falls back to the centre silhouette if the
// angle is not shipped for the requested category, so the camera page
// always has something to overlay.
export const getAngleImage = (category, angleId) => {
    const cat = safeCategory(category);
    const file = ANGLE_FILES[cat][angleId];
    return file ? `/images/png/${cat}/${file}` : getCenterImage(cat);
};

// Whether the given angle has a real guide image for this category
// (used by /photo-capture-selection to hide unsupported photo points,
// e.g. chassis-number for bikes).
export const isAngleSupported = (category, angleId) => {
    const cat = safeCategory(category);
    return Boolean(ANGLE_FILES[cat][angleId]);
};
