// Tracks which claim (created on Owner & Vehicle Details) the current
// survey flow -- Document Upload → Inspection Details → Photo Capture →
// Add Damage Photos → Damage Review → Submitted -- is for. sessionStorage
// (not localStorage) since this is scoped to one in-progress survey, same
// lifetime as OwnerVehicleDetailsPage's own form-persistence key.

const KEY = 'activeClaimId';

export function setActiveClaimId(claimId) {
    try {
        window.sessionStorage.setItem(KEY, claimId);
    } catch {
        /* ignore quota / disabled-storage errors */
    }
}

export function getActiveClaimId() {
    try {
        return window.sessionStorage.getItem(KEY) || null;
    } catch {
        return null;
    }
}

export function clearActiveClaimId() {
    try {
        window.sessionStorage.removeItem(KEY);
    } catch {
        /* ignore */
    }
}
