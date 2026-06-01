import { createSlice } from '@reduxjs/toolkit';

// The two workflow groups the user can pick on the landing page.
// The first 3 buttons map to OPTION_GROUP_1 (Damage Review flow); the
// last 3 map to OPTION_GROUP_2 (Vehicle Information flow).
export const WORKFLOW_TYPES = Object.freeze({
    OPTION_GROUP_1: 'option_group_1',
    OPTION_GROUP_2: 'option_group_2',
});

// Routes that ProtectedWorkflowRoute will allow per workflow.
export const WORKFLOW_ROUTES = Object.freeze({
    [WORKFLOW_TYPES.OPTION_GROUP_1]: [
        '/damage-review',
        '/submitted',
        '/reinspection-photos',
        '/repair-submission',
    ],
    [WORKFLOW_TYPES.OPTION_GROUP_2]: [
        '/add-others-photos',
        '/vehicle-information',
    ],
});

// Where Save & Continue (on the last damage photo) should land the user
// for each workflow. Centralised here so the camera page doesn't have to
// re-derive routing rules.
export const WORKFLOW_SUBMIT_ROUTES = Object.freeze({
    [WORKFLOW_TYPES.OPTION_GROUP_1]: '/damage-review',
    [WORKFLOW_TYPES.OPTION_GROUP_2]: '/add-others-photos',
});

const PERSIST_KEY = 'selectedWorkflow';

// Read any previously persisted choice so a refresh in the middle of the
// flow doesn't lose which workflow the user picked on the landing page.
const readPersisted = () => {
    if (typeof window === 'undefined') return null;
    try {
        const v = window.sessionStorage.getItem(PERSIST_KEY);
        return Object.values(WORKFLOW_TYPES).includes(v) ? v : null;
    } catch {
        return null;
    }
};

const writePersisted = (value) => {
    if (typeof window === 'undefined') return;
    try {
        if (value) window.sessionStorage.setItem(PERSIST_KEY, value);
        else window.sessionStorage.removeItem(PERSIST_KEY);
    } catch {
        /* ignore quota / disabled-storage errors */
    }
};

const workflowSlice = createSlice({
    name: 'workflow',
    initialState: {
        // Which landing-page option group the user picked, or null if they
        // haven't picked anything yet (or hit a protected route directly).
        selectedOption: readPersisted(),
    },
    reducers: {
        setOption(state, action) {
            const value = action.payload;
            if (!Object.values(WORKFLOW_TYPES).includes(value)) {
                console.warn(`workflowSlice.setOption: invalid value ${value}`);
                return;
            }
            state.selectedOption = value;
            writePersisted(value);
        },
        clearOption(state) {
            state.selectedOption = null;
            writePersisted(null);
        },
    },
});

export const { setOption, clearOption } = workflowSlice.actions;
export default workflowSlice.reducer;

// ── Selectors ───────────────────────────────────────────────────────────
export const selectWorkflowOption = (state) => state.workflow.selectedOption;

export const selectIsRouteAllowed = (route) => (state) => {
    const opt = state.workflow.selectedOption;
    if (!opt) return false;
    return (WORKFLOW_ROUTES[opt] || []).includes(route);
};

// Helper: where should Save & Continue send the user after the last photo?
// Returns null if no workflow has been chosen — caller decides the fallback.
export const selectSubmitRoute = (state) => {
    const opt = state.workflow.selectedOption;
    return opt ? WORKFLOW_SUBMIT_ROUTES[opt] || null : null;
};
