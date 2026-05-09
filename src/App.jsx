import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { CameraProvider } from './contexts/CameraContext';

const AppContent = () => {
    const location = useLocation();

    // Check if current route is a fullscreen landscape page
    const isFullscreenPage = location.pathname.includes('photo-capture-selection') ||
                             location.pathname.includes('camera-capture');

    return (
        <div
            className="min-h-screen w-full flex justify-center"
            style={{ background: '#94A3B8' }}
        >
            <div
                className={`w-full ${!isFullscreenPage ? 'max-w-sm' : ''} min-h-screen relative overflow-x-hidden`}
                style={{ background: 'transparent' }}
            >
                <AppRoutes />
            </div>
        </div>
    );
};

const App = () => {
    // Workflow state lives in the Redux store now (see src/store) so it
    // doesn't need a context provider here. Camera state is still local
    // UI plumbing, so it stays as a context.
    return (
        <BrowserRouter>
            <CameraProvider>
                <AppContent />
            </CameraProvider>
        </BrowserRouter>
    );
};

export default App;
