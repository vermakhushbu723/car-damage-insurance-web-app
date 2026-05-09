import { createSlice } from '@reduxjs/toolkit';
import {
    PRODUCT_TO_CATEGORY,
    VEHICLE_CATEGORIES,
} from '../constants/vehicleAssets';

// Persist key for the user's "Select Product" choice. Stored in
// sessionStorage so a refresh in the middle of the flow doesn't lose it.
const PERSIST_KEY = 'selectedProduct';

const readPersisted = () => {
    if (typeof window === 'undefined') return null;
    try {
        const v = window.sessionStorage.getItem(PERSIST_KEY);
        return v && PRODUCT_TO_CATEGORY[v] ? v : null;
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

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: {
        // Raw "Select Product" string from /owner-vehicle-details
        // (e.g. 'Private Car', 'Two Wheeler'). Null when the user
        // hasn't picked anything yet.
        product: readPersisted(),
    },
    reducers: {
        setProduct(state, action) {
            const value = action.payload;
            if (value && !PRODUCT_TO_CATEGORY[value]) {
                console.warn(`vehicleSlice.setProduct: unknown product ${value}`);
                return;
            }
            state.product = value || null;
            writePersisted(state.product);
        },
        clearProduct(state) {
            state.product = null;
            writePersisted(null);
        },
    },
});

export const { setProduct, clearProduct } = vehicleSlice.actions;
export default vehicleSlice.reducer;

// ── Selectors ───────────────────────────────────────────────────────────
export const selectProduct = (state) => state.vehicle.product;

// Always returns a valid folder name — falls back to 'car' when no
// product has been selected, so downstream pages never have to handle
// a null category themselves.
export const selectVehicleCategory = (state) =>
    PRODUCT_TO_CATEGORY[state.vehicle.product] || VEHICLE_CATEGORIES.CAR;
