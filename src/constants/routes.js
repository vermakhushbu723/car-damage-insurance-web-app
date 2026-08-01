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
    ADD_OTHERS_PHOTOS: '/add-others-photos',
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
    // Sidebar order/labels match the Figma "Untitled" design file 1:1 —
    // see IntimationSidebar.jsx. A few older routes (ILA, Settlement, Dms
    // surveyor, Dms pre-inspection, Annotation Studio) predate that design
    // and aren't in its sidebar; their pages are kept (still reachable by
    // direct URL) but unlinked from nav so they don't get lost.
    INTIMATION: {
        BASE: '/admin/intimation',
        SURVEYOR_APPOINTMENT: '/admin/intimation/surveyor-allocation',
        CLAIM_HANDLER: '/admin/intimation/handler',
        CLAIM_DETAILS: '/admin/intimation/claim-details',
        CLAIM_DETAILS_ANALYTICS: '/admin/intimation/claim-details/analytics',
        AI_ILA: '/admin/intimation/ai-ila',
        ILA_NEW: '/admin/intimation/ila-new',
        FLA: '/admin/intimation/fla',
        RECOMMENDATION: '/admin/intimation/recommendation',
        FEE_BILL: '/admin/intimation/fee-bill',

        // Kept, not in the current sidebar (see note above)
        ILA: '/admin/intimation/ila',
        SETTLEMENT: '/admin/intimation/settlement',
        DMS_SURVEYOR: '/admin/intimation/dms-surveyor',
        DMS_PREINSPECTION: '/admin/intimation/dms-preinspection',
        ANNOTATION_STUDIO: '/admin/intimation/annotation-studio',
    },
};
