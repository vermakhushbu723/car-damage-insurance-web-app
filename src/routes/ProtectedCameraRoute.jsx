import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Key for the one-shot ticket that authorises a visit to /camera-capture/:angle.
// Using sessionStorage keeps the flag stable across React 19 StrictMode
// double-mount cycles and unrelated re-renders that would otherwise wipe
// `location.state` and bounce the user back to "/".
export const CAMERA_ACCESS_KEY = 'cameraAccessAllowed';

const ProtectedCameraRoute = ({ element }) => {
    const location = useLocation();

    // Allow access if either the ticket is set OR the navigation state still
    // carries the flag. Either is sufficient — whichever survives the render.
    const cameraEnabled =
        location.state?.cameraEnabled === true ||
        (typeof window !== 'undefined' &&
            window.sessionStorage.getItem(CAMERA_ACCESS_KEY) === 'true');

    if (!cameraEnabled) {
        console.warn('Camera access denied - navigate from allowed routes only');
        return <Navigate to="/" replace />;
    }

    return element;
};

export default ProtectedCameraRoute;

