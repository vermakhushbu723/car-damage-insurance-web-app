import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CAMERA_ACCESS_KEY } from '../../../routes/ProtectedCameraRoute';
import { ROUTES } from './routes';
import { selectVehicleCategory } from '../../../store/vehicleSlice';
import {
    setOption,
    WORKFLOW_TYPES,
    selectWorkflowOption,
    selectSubmitRoute,
} from '../../../store/workflowSlice';
import { getCenterImage, isAngleSupported } from '../../../constants/vehicleAssets';
import { usePageLoading } from '../../../hooks/usePageLoading';
import { FaMobileAlt, FaSyncAlt, FaVideo, FaCamera, FaCheck } from 'react-icons/fa';
import { COLORS } from '../../../constants/theme';

const PhotoCaptureSelectionPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    // Vehicle category (car / bike / truck) chosen on /owner-vehicle-details
    // — drives which silhouette + angle guides are shown.
    const vehicleCategory = useSelector(selectVehicleCategory);
    // Which workflow the user chose on the landing page — picks the
    // post-capture destination (damage-review vs vehicle-information).
    const workflowOption = useSelector(selectWorkflowOption);
    const submitRoute = null; // flow-local routing
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    // Pixel size of the car container — used to draw direction arrows that
    // point from each capture point toward the car, with correct angles
    // despite the container's non-square aspect ratio.
    const carContainerRef = useRef(null);
    const [containerDims, setContainerDims] = useState({ w: 0, h: 0 });
    const [capturedPhotos, setCapturedPhotos] = useState({});
    const [videoUrl, setVideoUrl] = useState('');
    const [videoLoadError, setVideoLoadError] = useState(false);

    // Load captured photos + walk-around video status from localStorage
    const loadCapturedPhotos = () => {
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        setCapturedPhotos(stored);
        const url = localStorage.getItem('walk_around_video_url') || '';
        setVideoUrl(url);
        if (url) setVideoLoadError(false);
    };

    const hasVideo = !!videoUrl && !videoLoadError;

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

    // Track the car container's pixel size so arrow angles stay accurate
    // across resizes / orientation changes.
    useEffect(() => {
        const el = carContainerRef.current;
        if (!el) return;
        const measure = () => setContainerDims({ w: el.clientWidth, h: el.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [isLandscape]);

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
    // Points evenly placed on an oval ring around the car (clockwise from the
    // top), so the layout reads as a clean circle like the reference diagram.
    const allPhotoPoints = [
        { id: 'rear-rh-side', label: 'Rear RH Side', top: '13%', left: '50%', labelPosition: 'top' },
        { id: 'rear-side', label: 'Rear Side', top: '19%', left: '72%', labelPosition: 'top' },
        { id: 'rear-lh-side', label: 'Rear LH Side', top: '35%', left: '86%', labelPosition: 'right' },
        { id: 'lh-side', label: 'LH Side', top: '55%', left: '90%', labelPosition: 'right' },
        { id: 'front-lh', label: 'Front LH', top: '74%', left: '80%', labelPosition: 'right' },
        { id: 'chassis-number', label: 'Chassis Number', top: '86%', left: '61%', labelPosition: 'bottom' },
        { id: 'front-side', label: 'Front Side', top: '86%', left: '39%', labelPosition: 'bottom' },
        { id: 'odometer', label: 'Odometer', top: '74%', left: '20%', labelPosition: 'left' },
        { id: 'video', label: 'Video', top: '55%', left: '10%', labelPosition: 'left' },
        { id: 'front-rh-side', label: 'Front RH Side', top: '35%', left: '14%', labelPosition: 'left' },
        { id: 'rh-side', label: 'RH Side', top: '19%', left: '28%', labelPosition: 'top' },
    ];
    const photoPoints = allPhotoPoints.filter(p => isAngleSupported(vehicleCategory, p.id));
    const centerImage = getCenterImage(vehicleCategory);

    // All capture points (including the walk-around video) must be done
    // before the Next button enables.
    const allDone = photoPoints.every((p) =>
        p.id === 'video' ? hasVideo : !!capturedPhotos[p.id]
    );

    const handleNext = () => {
        if (!allDone) return;
        // Respect the workflow the user picked on the landing page:
        //   OPTION_GROUP_1 (claim flows)        → /damage-review
        //   OPTION_GROUP_2 (preinspection flows) → /add-others-photos
        // If somehow no workflow is set (deep-link / refresh), default to
        // claim-flow so /damage-review stays accessible.
        const effectiveOption = workflowOption || WORKFLOW_TYPES.OPTION_GROUP_1;
        if (!workflowOption) dispatch(setOption(effectiveOption));
        const destination = submitRoute
            || (effectiveOption === WORKFLOW_TYPES.OPTION_GROUP_2
                ? ROUTES.ADD_OTHERS_PHOTOS
                : ROUTES.DAMAGE_REVIEW);
        navigate(destination);
    };

    const handlePhotoPointClick = (point) => {
        // The "Video" point is a walk-around video flow, not a single-photo
        // capture — route it to the dedicated recording page instead of the
        // per-angle camera page.
        if (point.id === 'video') {
            navigate(ROUTES.WALK_AROUND_VIDEO, {
                state: { returnTo: '/preinspection-surveyor/photo-capture-selection' },
            });
            return;
        }

        // Hand the camera route a durable access ticket — survives
        // StrictMode remounts and any re-render that would drop location.state.
        window.sessionStorage.setItem(CAMERA_ACCESS_KEY, 'true');
        navigate(`/preinspection-surveyor/camera-capture/${point.id}`, {
            state: {
                returnTo: '/preinspection-surveyor/photo-capture-selection',
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
                        <FaMobileAlt className="text-white mb-6" style={{ fontSize: 64 }} />
                        <h2 className="text-2xl font-bold text-white mb-4">Rotate Device</h2>
                        <p className="text-white text-lg mb-8">
                            Please rotate your device to landscape mode to capture vehicle photos
                        </p>
                        <FaSyncAlt className="text-white animate-spin" style={{ fontSize: 48 }} />
                    </div>
                </div>
            ) : (
                // Landscape Mode - Show car with photo points
                <div className="w-screen h-screen flex items-center justify-center overflow-hidden" style={{ background: '#FFFFFF', padding: '20px' }}>
                    {/* Car Container */}
                    <div
                        ref={carContainerRef}
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
                            const circleSize = Math.min(Math.max(window.innerWidth * 0.062, 58), 82);
                            const fontSize = Math.min(Math.max(window.innerWidth * 0.016, 13), 18);

                            const isVideoPoint = point.id === 'video';
                            const isPointDone = isVideoPoint ? hasVideo : !!capturedImageUrl;

                            // Blue before capture, green once captured.
                            const POINT_BLUE = '#3B82F6';
                            const POINT_GREEN = '#22C55E';
                            const pointColor = isPointDone ? POINT_GREEN : POINT_BLUE;

                            // Clean arrow that simply points from this capture
                            // point toward the car center (like the reference
                            // diagram). Computed in pixels so the angle isn't
                            // skewed by the container's wide aspect ratio.
                            const W = containerDims.w || 1;
                            const H = containerDims.h || 1;
                            const px = parseFloat(point.left);
                            const py = parseFloat(point.top);
                            // Vector from car center to this point (pixels).
                            const cx = ((px - 50) / 100) * W;
                            const cy = ((py - 50) / 100) * H;
                            const distPx = Math.hypot(cx, cy) || 1;
                            // Arrow points from the point back toward the center.
                            const arrowAngle = Math.atan2(-cy, -cx) * (180 / Math.PI);
                            // Small, clean arrow sitting between the point and the car.
                            const arrowLen = Math.min(Math.max(distPx * 0.12, 12), 28);

                            // Determine label position styles based on photo direction
                            const getLabelStyles = () => {
                                const baseStyle = {
                                    position: 'absolute',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                    pointerEvents: 'none',
                                    color: pointColor,
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
                                    {/* Direction arrow — starts at the button edge
                                        and points toward the car. */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            height: 0,
                                            transform: `rotate(${arrowAngle}deg)`,
                                            transformOrigin: '0 0',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                        }}
                                    >
                                        {/* line */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: `${circleSize / 2 + 2}px`,
                                                top: '-2px',
                                                width: `${arrowLen}px`,
                                                height: '4px',
                                                background: pointColor,
                                                borderRadius: 2,
                                            }}
                                        />
                                        {/* arrowhead */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: `${circleSize / 2 + 2 + arrowLen}px`,
                                                top: '-7px',
                                                width: 0,
                                                height: 0,
                                                borderTop: '7px solid transparent',
                                                borderBottom: '7px solid transparent',
                                                borderLeft: `11px solid ${pointColor}`,
                                            }}
                                        />
                                    </div>

                                    {/* Camera Icon Button */}
                                    <button
                                        onClick={() => handlePhotoPointClick(point)}
                                        className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none overflow-hidden"
                                        style={{
                                            width: `${circleSize}px`,
                                            height: `${circleSize}px`,
                                            border: `2px solid ${pointColor}`,
                                            background: capturedImageUrl
                                                ? 'transparent'
                                                : (isPointDone ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                                            cursor: 'pointer',
                                            position: 'relative',
                                            minWidth: '50px',
                                            minHeight: '50px',
                                        }}
                                        title={point.label}
                                    >
                                        {isVideoPoint && videoUrl && !videoLoadError ? (
                                            <video
                                                src={videoUrl}
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                                onError={() => setVideoLoadError(true)}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                }}
                                            />
                                        ) : capturedImageUrl ? (
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
                                            <span style={{ fontSize: `${circleSize * 0.35}px`, color: pointColor, display: 'flex' }}>
                                                {isVideoPoint ? <FaVideo /> : <FaCamera />}
                                            </span>
                                        )}
                                        {isPointDone && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    bottom: -2, right: -2,
                                                    width: 18, height: 18, borderRadius: '50%',
                                                    background: COLORS.statusCompleted,
                                                    color: '#fff', fontSize: 10, fontWeight: 700,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: '2px solid #fff',
                                                }}
                                            >
                                                <FaCheck />
                                            </span>
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

                    {/* Next button — enabled only after every angle (including
                        the walk-around video) has been captured. */}
                    <button
                        onClick={handleNext}
                        disabled={!allDone}
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            padding: '8px 10px',
                            background: allDone ? COLORS.btnPrimary : '#9CA3AF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: allDone ? 'pointer' : 'not-allowed',
                            opacity: allDone ? 1 : 0.6,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                            zIndex: 50,
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}
        </>
    );
};

export default PhotoCaptureSelectionPage;
