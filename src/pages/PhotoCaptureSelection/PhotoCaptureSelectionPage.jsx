import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CAMERA_ACCESS_KEY } from '../../routes/ProtectedCameraRoute';
import { ROUTES } from '../../constants/routes';
import { selectVehicleCategory } from '../../store/vehicleSlice';
import { getCenterImage, isAngleSupported } from '../../constants/vehicleAssets';

const PhotoCaptureSelectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Vehicle category (car / bike / truck) chosen on /owner-vehicle-details
    // — drives which silhouette + angle guides are shown.
    const vehicleCategory = useSelector(selectVehicleCategory);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    const [capturedPhotos, setCapturedPhotos] = useState({});

    // Load captured photos from localStorage
    const loadCapturedPhotos = () => {
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        setCapturedPhotos(stored);
    };

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

    // Load photos on mount and every time we come back to this page
    useEffect(() => {
        loadCapturedPhotos();
        const onFocus = () => loadCapturedPhotos();
        const onVisible = () => { if (!document.hidden) loadCapturedPhotos(); };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [location]); // re-run when navigating back to this page

    // Photo capture points positioned around the silhouette. Points whose
    // angle has no guide image for the current vehicle category are
    // filtered out below (e.g. chassis-number for bikes).
    const allPhotoPoints = [
        { id: 'rear-rh-side', label: 'Rear RH Side', top: '8%', left: '60%' },
        { id: 'rear-side', label: 'Rear Side', top: '12%', left: '72%' },
        { id: 'rear-lh-side', label: 'Rear LH Side', top: '8%', left: '84%' },
        { id: 'rh-side', label: 'RH Side', top: '28%', left: '12%' },
        { id: 'front-rh-side', label: 'Front RH Side', top: '44%', left: '10%' },
        { id: 'odometer', label: 'Odometer', top: '56%', left: '18%' },
        { id: 'front-side', label: 'Front Side', top: '72%', left: '32%' },
        { id: 'chassis-number', label: 'Chassis Number', top: '80%', left: '50%' },
        { id: 'front-lh', label: 'Front LH', top: '72%', left: '68%' },
        { id: 'lh-side', label: 'LH Side', top: '36%', left: '86%' },
        { id: 'video', label: 'Video', top: '50%', left: '92%' },
    ];
    const photoPoints = allPhotoPoints.filter(p => isAngleSupported(vehicleCategory, p.id));
    const centerImage = getCenterImage(vehicleCategory);

    const handlePhotoPointClick = (point) => {
        // The "Video" point is a walk-around video flow, not a single-photo
        // capture — route it to the dedicated recording page instead of the
        // per-angle camera page.
        if (point.id === 'video') {
            navigate(ROUTES.WALK_AROUND_VIDEO, {
                state: { returnTo: '/photo-capture-selection' },
            });
            return;
        }

        // Hand the camera route a durable access ticket — survives
        // StrictMode remounts and any re-render that would drop location.state.
        window.sessionStorage.setItem(CAMERA_ACCESS_KEY, 'true');
        navigate(`/camera-capture/${point.id}`, {
            state: {
                returnTo: '/photo-capture-selection',
                cameraEnabled: true,
            },
        });
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
                        {/* Vehicle silhouette — switches between car/bike/truck
                            based on the "Select Product" choice on
                            /owner-vehicle-details. */}
                        <img
                            src={centerImage}
                            alt="Vehicle"
                            className="h-5/6 w-auto object-contain"
                        />

                        {/* Photo Points - Circular Buttons with Labels */}
                        {photoPoints.map((point) => {
                            const isDone = !!capturedPhotos[point.id];
                            return (
                                <div key={point.id} className="absolute" style={{ top: point.top, left: point.left }}>
                                    {/* Camera Icon Button */}
                                    <button
                                        onClick={() => handlePhotoPointClick(point)}
                                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
                                        style={{
                                            border: `3px solid ${isDone ? '#22C55E' : '#EF4444'}`,
                                            background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                                            cursor: 'pointer',
                                        }}
                                        title={point.label}
                                    >
                                        <span className="text-xl">{isDone ? '✅' : '📷'}</span>
                                    </button>

                                    {/* Label Below Circle */}
                                    <div
                                        className="absolute top-full mt-1 whitespace-nowrap text-center font-semibold text-xs pointer-events-none"
                                        style={{
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            color: isDone ? '#22C55E' : '#EF4444',
                                        }}
                                    >
                                        {point.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default PhotoCaptureSelectionPage;
