// Route path constants
export const ROUTES = {
    LANDING: '/',
    LOGIN: '/claim-workshop-login',
    CLAIM_WORKSHOP_LOGIN: '/claim-workshop-login',
    CLAIM_SURVEYOR_LOGIN: '/claim-surveyor-login',
    CLAIM_WEBLINK: '/claim-weblink',
    PREINSPECTION_AGENT_LOGIN: '/preinspection-agent-login',
    PREINSPECTION_SURVEYOR_LOGIN: '/preinspection-surveyor-login',
    PREINSPECTION_WEBLINK: '/preinspection-weblink',
    DASHBOARD: '/dashboard',
    CLAIM_START: '/claim-start',
    OWNER_VEHICLE_DETAILS: '/owner-vehicle-details',
    DOCUMENT_UPLOAD: '/document-upload',
    INSPECTION_DETAILS: '/inspection-details',
    PHOTO_CAPTURE_SELECTION: '/photo-capture-selection',
    CAMERA_CAPTURE: '/camera-capture/:angle',
    WALK_AROUND_VIDEO: '/walk-around-video',
    ADD_DAMAGE_PHOTOS: '/add-damage-photos',
    CUSTOMER_DECLARATION: '/customer-declaration',
    INSPECTOR_DECLARATION: '/inspector-declaration',
    DAMAGE_REVIEW: '/damage-review',
    SUBMITTED: '/submitted',
    REINSPECTION_PHOTOS: '/reinspection-photos',
    REPAIR_SUBMISSION: '/repair-submission',
    VEHICLE_INFORMATION: '/vehicle-information',

    // ── Admin panel ────────────────────────────────────────────────────
    // All admin-side routes live under /admin/*. Nested for organisation
    // — use as `ROUTES.ADMIN.LOGIN`, `ROUTES.ADMIN.DASHBOARD`, etc.
    ADMIN: {
        SELECT: '/admin',
        LOGIN: '/admin/login',
        DASHBOARD: '/admin/dashboard',
        CLAIM: '/admin/claim',
        PREINSPECTION: '/admin/preinspection',
        SETTINGS: '/admin/settings',
        SUPPORT: '/admin/support',
        USER_CREATION: '/admin/user-creation',
        INSURER: '/admin/insurer',
        BROKER: '/admin/broker',
        SURVEYOR: '/admin/surveyor',
        WORKSHOP: '/admin/workshop',
    },

    // ── Intimation Management System ──────────────────────────────────
    INTIMATION: {
        BASE: '/admin/intimation',
        CLAIM_HANDLER: '/admin/intimation/claim-handler',
        SURVEYOR_APPOINTMENT: '/admin/intimation/surveyor-appointment',
        CLAIM_DETAILS: '/admin/intimation/claim-details',
        ILA: '/admin/intimation/ila',
        SETTLEMENT: '/admin/intimation/settlement',
        FLA: '/admin/intimation/fla',
        RECOMMENDATION: '/admin/intimation/recommendation',
        DMS_SURVEYOR: '/admin/intimation/dms-surveyor',
        DMS_PREINSPECTION: '/admin/intimation/dms-preinspection',
    },
};
