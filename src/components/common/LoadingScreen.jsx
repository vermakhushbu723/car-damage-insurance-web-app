import React from 'react';
import { COLORS } from '../../constants/theme';

const LoadingScreen = () => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: COLORS.bgApp }}
        >
            <div className="flex flex-col items-center">
                {/* Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div
                        className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
                        style={{ animationDuration: '1s' }}
                    ></div>
                </div>

                {/* Loading text */}
                <p className="mt-4 text-white text-lg font-medium">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
