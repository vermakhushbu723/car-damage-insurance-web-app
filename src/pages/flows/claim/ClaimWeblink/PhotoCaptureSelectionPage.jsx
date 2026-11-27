import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CAMERA_ACCESS_KEY } from '../../../../routes/ProtectedCameraRoute';
import { ROUTES } from './routes';
import { selectVehicleCategory } from '../../../../store/vehicleSlice';
import {
    setOption,
    WORKFLOW_TYPES,
    selectWorkflowOption,
    selectSubmitRoute,
} from '../../../../store/workflowSlice';
import { getCenterImage, isAngleSupported } from '../../../../constants/vehicleAssets';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { FaMobileAlt, FaSyncAlt, FaVideo, FaCamera, FaCheck } from 'react-icons/fa';

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
    const [view, setView] = useState({ w: window.innerWidth, h: window.innerHeight });
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
            setView({ w: window.innerWidth, h: window.innerHeight });
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

    // Capture points around the vehicle (fractions of the inset box), as in the IBima Assist app.
    const allPhotoPoints = [
        { id: 'rh-side', label: 'RH Side', top: '10%', left: '42%', labelPosition: 'top' },
        { id: 'rear-rh-side', label: 'Rear RH Side', top: '20%', left: '72%', labelPosition: 'top' },
        { id: 'rear-side', label: 'Rear Side', top: '46%', left: '80%', labelPosition: 'right' },
        { id: 'rear-lh-side', label: 'Rear LH Side', top: '72%', left: '80%', labelPosition: 'right' },
        { id: 'lh-side', label: 'LH Side', top: '90%', left: '63%', labelPosition: 'bottom' },
        { id: 'front-lh', label: 'Front LH', top: '92%', left: '46%', labelPosition: 'bottom' },
        { id: 'chassis-number', label: 'Chassis Number', top: '90%', left: '30%', labelPosition: 'bottom' },
        { id: 'front-side', label: 'Front Side', top: '74%', left: '18%', labelPosition: 'bottom' },
        { id: 'odometer', label: 'Odometer', top: '50%', left: '13%', labelPosition: 'left' },
        { id: 'front-rh-side', label: 'Front RH Side', top: '26%', left: '23%', labelPosition: 'left' },
        { id: 'video', label: 'Video', top: '90%', left: '3%', labelPosition: 'top' },
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
                : ROUTES.ADD_DAMAGE_PHOTOS);
        navigate(destination);
    };

    const handlePhotoPointClick = (point) => {
        // The "Video" point is a walk-around video flow, not a single-photo
        // capture — route it to the dedicated recording page instead of the
        // per-angle camera page.
        if (point.id === 'video') {
            navigate(ROUTES.WALK_AROUND_VIDEO, {
                state: { returnTo: '/claim-weblink/photo-capture-selection' },
            });
            return;
        }

        // Hand the camera route a durable access ticket — survives
        // StrictMode remounts and any re-render that would drop location.state.
        window.sessionStorage.setItem(CAMERA_ACCESS_KEY, 'true');
        navigate(`/claim-weblink/camera-capture/${point.id}`, {
            state: {
                returnTo: '/claim-weblink/photo-capture-selection',
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
                // Landscape Mode -- same layout as the IBima Assist app (Flutter):
                // the vehicle and the ring of capture points sit in ONE inset
                // box, and the margin around it holds the circles + captions,
                // so nothing is ever cut off at the screen edge.
                (() => {
                    const PAD = 20;
                    const W = view.w - PAD * 2;
                    const H = view.h - PAD * 2;
                    const circleSize = Math.min(Math.max(Math.min(W, H) * 0.135, 46), 76);
                    const SIDE_LABEL_W = 84;
                    const LABEL_GAP = 5;
                    const LABEL_H = 15;
                    const marginX = circleSize / 2 + LABEL_GAP + SIDE_LABEL_W;
                    const marginY = circleSize / 2 + LABEL_GAP + LABEL_H + 4;
                    const iw = Math.max(0, W - 2 * marginX);
                    const ih = Math.max(0, H - 2 * marginY);
                    const BLUE = '#3B82F6';
                    const GREEN = '#22C55E';

                    const labelStyle = (pos, color) => {
                        const base = { position: 'absolute', whiteSpace: 'nowrap', textAlign: 'center', fontWeight: 700, fontSize: 11, letterSpacing: '0.3px', color, pointerEvents: 'none' };
                        switch (pos) {
                            case 'top': return { ...base, bottom: circleSize + LABEL_GAP, left: '50%', transform: 'translateX(-50%)' };
                            case 'bottom': return { ...base, top: circleSize + LABEL_GAP, left: '50%', transform: 'translateX(-50%)' };
                            case 'left': return { ...base, right: circleSize + LABEL_GAP, top: '50%', transform: 'translateY(-50%)', width: SIDE_LABEL_W };
                            default: return { ...base, left: circleSize + LABEL_GAP, top: '50%', transform: 'translateY(-50%)', width: SIDE_LABEL_W };
                        }
                    };

                    return (
                        <div className="w-screen h-screen overflow-hidden" style={{ background: '#FFFFFF', padding: PAD, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: PAD + marginX, top: PAD + marginY, width: iw, height: ih }}>
                                {/* Vehicle silhouette (car / bike / truck from the owner details) */}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={centerImage} alt="Vehicle" style={{ height: ih * 0.54, width: iw * 0.46, objectFit: 'contain' }} />
                                </div>

                                {photoPoints.map((point) => {
                                    const isVideo = point.id === 'video';
                                    const done = isVideo ? hasVideo : !!capturedPhotos[point.id];
                                    const color = done ? GREEN : BLUE;
                                    const cx = (parseFloat(point.left) / 100) * iw;
                                    const cy = (parseFloat(point.top) / 100) * ih;
                                    return (
                                        <div key={point.id} style={{ position: 'absolute', left: cx - circleSize / 2, top: cy - circleSize / 2, width: circleSize, height: circleSize }}>
                                            <button
                                                type="button"
                                                onClick={() => handlePhotoPointClick(point)}
                                                title={point.label}
                                                aria-label={point.label}
                                                className="rounded-full flex items-center justify-center focus:outline-none"
                                                style={{
                                                    width: circleSize,
                                                    height: circleSize,
                                                    border: `2px solid ${color}`,
                                                    background: done ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <span style={{ fontSize: circleSize * 0.35, color, display: 'flex' }}>{isVideo ? <FaVideo /> : <FaCamera />}</span>
                                            </button>
                                            {done ? (
                                                <span
                                                    style={{
                                                        position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%',
                                                        background: GREEN, color: '#fff', fontSize: 10,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                                                    }}
                                                >
                                                    <FaCheck />
                                                </span>
                                            ) : null}
                                            <div style={labelStyle(point.labelPosition, color)}>{point.label}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Next: only after every angle and the walk-around video */}
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!allDone}
                                style={{
                                    position: 'absolute', bottom: PAD, right: PAD, padding: '12px 16px',
                                    background: allDone ? '#01A0FE' : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 10,
                                    fontWeight: 700, fontSize: 16, cursor: allDone ? 'pointer' : 'not-allowed', zIndex: 50,
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    );
                })()
            )}
        </>
    );
};

export default PhotoCaptureSelectionPage;
