import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoCaptureSelectionPage = () => {
    const navigate = useNavigate();
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    // Check for landscape orientation on mount and orientation change
    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        // Listen for resize and orientation change events
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    // Photo capture points with positioning around the car
    const photoPoints = [
        { id: 'rear-rh-side', label: 'Rear RH Side', top: '20%', left: '70%' },
        { id: 'rear-side', label: 'Rear Side', top: '12%', left: '78%' },
        { id: 'rear-lh-side', label: 'Rear LH Side', top: '20%', left: '86%' },
        { id: 'rh-side', label: 'RH Side', top: '35%', left: '12%' },
        { id: 'front-rh-side', label: 'Front RH Side', top: '48%', left: '10%' },
        { id: 'odometer', label: 'Odometer', top: '62%', left: '18%' },
        { id: 'front-side', label: 'Front Side', top: '72%', left: '32%' },
        { id: 'chassis-number', label: 'Chassis Number', top: '78%', left: '50%' },
        { id: 'front-lh', label: 'Front LH', top: '72%', left: '68%' },
        { id: 'lh-side', label: 'LH Side', top: '35%', left: '88%' },
        { id: 'video', label: 'Video', top: '50%', left: '92%' },
    ];

    const handlePhotoPointClick = (point) => {
        navigate(`/camera-capture/${point.id}`);
    };

    return (
        <>
            {!isLandscape ? (
                // Portrait Mode - Show rotate message
                <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#3B82F6' }}>
                    <div className="flex flex-col items-center justify-center text-center px-6">
                        <div className="text-6xl mb-6">📱</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Rotate Device</h2>
                        <p className="text-white text-lg mb-8">
                            Please rotate your device to landscape mode to capture vehicle photos
                        </p>
                        <div className="text-5xl animate-spin">↻</div>
                    </div>
                </div>
            ) : (
                // Landscape Mode - Show car with photo points
                <div className="w-screen h-screen flex items-center justify-center overflow-hidden" style={{ background: '#9CA3AF' }}>
                    {/* Car Container */}
                    <div className="relative w-full h-full flex items-center justify-center" style={{ overflow: 'visible' }}>
                        {/* Car Image */}
                        <img
                            src="/public/images/png/car.png"
                            alt="Vehicle"
                            className="h-5/6 w-auto object-contain"
                        />

                        {/* Photo Points - Circular Buttons with Labels */}
                        {photoPoints.map((point) => (
                            <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                                {/* Camera Icon Button */}
                                <button
                                    onClick={() => handlePhotoPointClick(point)}
                                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
                                    style={{
                                        border: '3px solid #EF4444',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        cursor: 'pointer',
                                    }}
                                    title={point.label}
                                >
                                    <span className="text-xl">📷</span>
                                </button>

                                {/* Label Below Circle */}
                                <div
                                    className="absolute top-full mt-1 whitespace-nowrap text-center font-semibold text-xs pointer-events-none"
                                    style={{
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: '#EF4444',
                                    }}
                                >
                                    {point.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default PhotoCaptureSelectionPage;
