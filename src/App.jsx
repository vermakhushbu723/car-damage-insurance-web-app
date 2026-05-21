import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { CameraProvider } from './contexts/CameraContext';
import LoadingScreen from './components/common/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';

const AppContent = () => {
    const location = useLocation();
    const isLoading = useSelector((state) => state.loading.isLoading);

    // Check if current route is a fullscreen landscape page. The mobile-
    // styled flows are clamped to `max-w-sm`, but the camera/photo-capture
    // screens and the admin panel (everything under /admin/*) need to use
    // the full viewport width.
    const isFullscreenPage = location.pathname.includes('photo-capture-selection') ||
        location.pathname.includes('camera-capture') ||
        location.pathname.startsWith('/admin');

    return (
        <div
            className="min-h-screen w-full flex justify-center"
            style={{ background: '#94A3B8' }}
        >
            <ScrollToTop />
            {isLoading && <LoadingScreen />}
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
