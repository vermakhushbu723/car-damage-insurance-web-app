import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';
import vehicleReducer from './vehicleSlice';
import loadingReducer from './loadingSlice';

// Single application store. Add new slices to the `reducer` map as the
// app grows; each slice owns its own piece of state.
export const store = configureStore({
    reducer: {
        workflow: workflowReducer,
        vehicle: vehicleReducer,
        loading: loadingReducer,
    },
});
