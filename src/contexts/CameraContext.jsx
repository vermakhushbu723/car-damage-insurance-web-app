import React, { createContext, useContext, useState, useCallback } from 'react';

const CameraContext = createContext();

// Routes where camera access is allowed
const CAMERA_ALLOWED_ROUTES = [
    '/photo-capture-selection',
    '/add-damage-photos',
    '/reinspection-photos',
];

export const CameraProvider = ({ children }) => {
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [returnPath, setReturnPath] = useState(null);

    const enableCamera = useCallback((allowedFromRoute) => {
        if (CAMERA_ALLOWED_ROUTES.includes(allowedFromRoute)) {
            setCameraEnabled(true);
            setReturnPath(allowedFromRoute);
            return true;
        }
        console.warn(`Camera access denied. Not allowed from route: ${allowedFromRoute}`);
        return false;
    }, []);

    const disableCamera = useCallback(() => {
        setCameraEnabled(false);
        setReturnPath(null);
    }, []);

    const isCameraAllowedFrom = useCallback((route) => {
        return CAMERA_ALLOWED_ROUTES.includes(route);
    }, []);

    return (
        <CameraContext.Provider
            value={{
                cameraEnabled,
                enableCamera,
                disableCamera,
                returnPath,
                isCameraAllowedFrom,
            }}
        >
            {children}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () => {
    const context = useContext(CameraContext);
    if (!context) {
        throw new Error('useCameraContext must be used within CameraProvider');
    }
    return context;
};
