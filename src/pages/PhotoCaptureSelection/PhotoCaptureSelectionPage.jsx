import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CAMERA_ACCESS_KEY } from '../../routes/ProtectedCameraRoute';
import { ROUTES } from '../../constants/routes';
import { selectVehicleCategory } from '../../store/vehicleSlice';
import { getCenterImage, isAngleSupported } from '../../constants/vehicleAssets';
import { usePageLoading } from '../../hooks/usePageLoading';

const PhotoCaptureSelectionPage = () => {
    usePageLoading();
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
        { id: 'rear-rh-side', label: 'Rear RH Side', top: '12%', left: '55%', labelPosition: 'top' },
        { id: 'rear-side', label: 'Rear Side', top: '12%', left: '70%', labelPosition: 'top' },
        { id: 'rear-lh-side', label: 'Rear LH Side', top: '12%', left: '85%', labelPosition: 'top' },
        { id: 'rh-side', label: 'RH Side', top: '35%', left: '15%', labelPosition: 'left' },
        { id: 'front-rh-side', label: 'Front RH Side', top: '58%', left: '12%', labelPosition: 'left' },
        { id: 'odometer', label: 'Odometer', top: '70%', left: '22%', labelPosition: 'bottom' },
        { id: 'front-side', label: 'Front Side', top: '80%', left: '35%', labelPosition: 'bottom' },
        { id: 'chassis-number', label: 'Chassis Number', top: '85%', left: '50%', labelPosition: 'bottom' },
        { id: 'front-lh', label: 'Front LH', top: '80%', left: '65%', labelPosition: 'bottom' },
        { id: 'lh-side', label: 'LH Side', top: '38%', left: '88%', labelPosition: 'right' },
        { id: 'video', label: 'Video', top: '65%', left: '88%', labelPosition: 'right' },
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
                <div className="w-screen h-screen flex items-center justify-center overflow-hidden" style={{ background: '#9CA3AF', padding: '20px' }}>
                    {/* Car Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        style={{
                            maxWidth: '95vw',
                            maxHeight: '90vh',
                            margin: '0 auto',
                        }}
                    >
                        {/* Vehicle silhouette — switches between car/bike/truck
                            based on the "Select Product" choice on
                            /owner-vehicle-details. */}
                        <img
                            src={centerImage}
                            alt="Vehicle"
                            className="object-contain"
                            style={{
                                maxHeight: '60vh',
                                maxWidth: '50vw',
                                width: 'auto',
                                height: 'auto',
                            }}
                        />

                        {/* Photo Points - Circular Buttons with Labels */}
                        {photoPoints.map((point) => {
                            const isDone = !!capturedPhotos[point.id];
                            const capturedImageUrl = capturedPhotos[point.id];

                            // Calculate responsive circle size based on viewport
                            const circleSize = Math.min(Math.max(window.innerWidth * 0.055, 45), 65);
                            const fontSize = Math.min(Math.max(window.innerWidth * 0.012, 10), 12);

                            // Determine label position styles based on photo direction
                            const getLabelStyles = () => {
                                const baseStyle = {
                                    position: 'absolute',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    pointerEvents: 'none',
                                    color: '#EF4444',
                                    fontSize: `${fontSize}px`,
                                };

                                switch (point.labelPosition) {
                                    case 'top':
                                        return {
                                            ...baseStyle,
                                            bottom: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            marginBottom: '4px',
                                        };
                                    case 'bottom':
                                        return {
                                            ...baseStyle,
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            marginTop: '4px',
                                        };
                                    case 'left':
                                        return {
                                            ...baseStyle,
                                            right: '100%',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            marginRight: '8px',
                                        };
                                    case 'right':
                                        return {
                                            ...baseStyle,
                                            left: '100%',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            marginLeft: '8px',
                                        };
                                    default:
                                        return {
                                            ...baseStyle,
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            marginTop: '4px',
                                        };
                                }
                            };

                            return (
                                <div
                                    key={point.id}
                                    className="absolute"
                                    style={{
                                        top: point.top,
                                        left: point.left,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    {/* Camera Icon Button */}
                                    <button
                                        onClick={() => handlePhotoPointClick(point)}
                                        className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none overflow-hidden"
                                        style={{
                                            width: `${circleSize}px`,
                                            height: `${circleSize}px`,
                                            border: '2px solid #EF4444',
                                            background: capturedImageUrl ? 'transparent' : 'rgba(239, 68, 68, 0.1)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            minWidth: '50px',
                                            minHeight: '50px',
                                        }}
                                        title={point.label}
                                    >
                                        {capturedImageUrl ? (
                                            <img
                                                src={capturedImageUrl}
                                                alt={point.label}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: `${circleSize * 0.35}px` }}>📷</span>
                                        )}
                                    </button>

                                    {/* Label - Position based on photo direction */}
                                    <div style={getLabelStyles()}>
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
