import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <BrowserRouter>
            {/* Mobile-first container: centered, max-width mobile, full height */}
            <div
                className="min-h-screen w-full flex justify-center"
                style={{ background: '#94A3B8' }}
            >
                <div
                    className="w-full max-w-sm min-h-screen relative overflow-x-hidden"
                    style={{ background: 'transparent' }}
                >
                    <AppRoutes />
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
