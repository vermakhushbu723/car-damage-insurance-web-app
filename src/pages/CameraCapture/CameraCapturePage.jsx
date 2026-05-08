import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import { COLORS } from '../../constants/theme';
import { REQUIRED_ANGLES } from '../AddDamagePhotos/AddDamagePhotosPage';

const CameraCapturePage = () => {
    const { angle } = useParams();
    const navigate = useNavigate();
    const routeLocation = useLocation();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('Fetching...');
    const [dateTime, setDateTime] = useState('');

    const formatAngleName = (name) =>
        name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // ── Map each angle to its guide image ─────────────────────────────────
    const ANGLE_IMAGES = {
        'rear-rh-side': '/images/png/car/RearRight.png',
        'rear-side': '/images/png/car/Rear.png',
        'rear-lh-side': '/images/png/car/RearLeft.png',
        'rh-side': '/images/png/car/Right.png',
        'front-rh-side': '/images/png/car/FrontRight.png',
        'front-side': '/images/png/car/Front.png',
        'front-lh': '/images/png/car/FrontLeft.png',
        'lh-side': '/images/png/car/Left.png',
        'odometer': '/images/png/car/Odometer.png',
        'chassis-number': '/images/png/car/ChassisNumber.png',
        'video': '/images/png/car/car.png',
    };

    const guideImage = ANGLE_IMAGES[angle] || '/images/png/car/car.png';

    // ── Live clock ─────────────────────────────────────────────────────────
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const d = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
            setDateTime(`${d}, ${t}`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ── Geolocation ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!navigator.geolocation) { setLocation('Not supported'); return; }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
            },
            () => setLocation('Location unavailable'),
            { timeout: 8000 }
        );
    }, []);

    // ── Get camera stream ──────────────────────────────────────────────────
    const getCameraStream = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw Object.assign(new Error('Not supported'), { name: 'NotSupportedError' });
        }
        try {
            return await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false,
            });
        } catch {
            return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
    };

    const getErrorMessage = (err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
            return 'Camera permission denied. Tap the 🔒 lock icon → set Camera to Allow → Try Again.';
        if (err.name === 'NotFoundError') return 'No camera found on this device.';
        if (err.name === 'NotReadableError') return 'Camera busy. Close other camera apps and try again.';
        if (err.name === 'NotSupportedError') return 'Camera not supported. Try Chrome or Samsung Internet.';
        if (err.name === 'SecurityError') return 'Camera needs HTTPS. Use: ' + window.location.href.replace('http://', 'https://');
        return `Camera error: ${err.message || err.name}`;
    };

    // ── Attach stream to <video> ───────────────────────────────────────────
    const startVideoPreview = useCallback((mediaStream) => {
        const video = videoRef.current;
        if (!video || !mediaStream) return;
        video.srcObject = mediaStream;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        const tryPlay = () => {
            video.play()
                .then(() => setIsCameraReady(true))
                .catch(e => console.warn('play() failed:', e));
        };
        if (video.readyState >= 3) { tryPlay(); }
        else {
            video.addEventListener('canplay', tryPlay, { once: true });
            video.addEventListener('loadedmetadata', tryPlay, { once: true });
        }
    }, []);

    // ── Start camera ───────────────────────────────────────────────────────
    useEffect(() => {
        const start = async () => {
            try {
                setError(null);
                setIsCameraReady(false);
                const mediaStream = await getCameraStream();
                streamRef.current = mediaStream;
                startVideoPreview(mediaStream);
            } catch (err) {
                console.error('Camera error:', err);
                setError(getErrorMessage(err));
            }
        };
        start();
        return () => {
            if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
        };
    }, []);

    // ── Capture photo ──────────────────────────────────────────────────────
    const handleCapturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        setIsCapturing(true);
        try {
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
            if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
        } catch (err) {
            console.error('Capture error:', err);
            setError('Failed to capture photo. Try again.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleRetake = async () => {
        setCapturedImage(null); setIsCameraReady(false); setError(null);
        try {
            const ms = await getCameraStream();
            streamRef.current = ms;
            setTimeout(() => startVideoPreview(ms), 100);
        } catch (err) { setError(getErrorMessage(err)); }
    };

    const handleRetryCamera = async () => {
        setError(null); setIsCameraReady(false);
        try {
            const ms = await getCameraStream();
            streamRef.current = ms;
            setTimeout(() => startVideoPreview(ms), 100);
        } catch (err) { setError(getErrorMessage(err)); }
    };

    const handleSavePhoto = () => {
        // Save captured image to localStorage keyed by angle
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        stored[angle] = capturedImage;
        localStorage.setItem('damage_photos', JSON.stringify(stored));

        // If all required angles are now captured → go to Add Damage Photos page
        const allDone = REQUIRED_ANGLES.every(a => stored[a]);
        if (allDone) {
            navigate('/add-damage-photos');
        } else {
            // Otherwise return to where we came from (returnTo state) or photo-capture-selection
            const returnTo = routeLocation.state?.returnTo || '/photo-capture-selection';
            navigate(returnTo);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>

            {/* Header — only when camera NOT live */}
            {(!isCameraReady || capturedImage) && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 }}>
                    <AppHeader />
                    <PageTitleBar title={`Capture - ${formatAngleName(angle)}`} />
                </div>
            )}

            {/* ── Live video — always in DOM ── */}
            <video
                ref={videoRef}
                playsInline muted autoPlay
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    display: isCameraReady && !capturedImage ? 'block' : 'none',
                }}
            />

            {/* ── Captured image ── */}
            {capturedImage && (
                <img src={capturedImage} alt="Captured"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                />
            )}

            {/* ── Loading ── */}
            {!isCameraReady && !capturedImage && !error && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                    <p style={{ fontSize: 16 }}>Opening camera...</p>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', maxWidth: 360, width: '100%' }}>
                        <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                        <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Camera Access Required</p>
                        <p style={{ color: '#374151', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{error}</p>
                        <button onClick={handleRetryCamera}
                            style={{ width: '100%', padding: 12, background: COLORS.btnPrimary, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, marginBottom: 10, cursor: 'pointer' }}>
                            Try Again
                        </button>
                        <button onClick={() => navigate(-1)}
                            style={{ width: '100%', padding: 12, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════ LIVE CAMERA OVERLAY — exactly like reference image ═══════════ */}
            {isCameraReady && !capturedImage && (
                <>
                    {/* ── Car guide image — center ── */}
                    <img
                        src={guideImage}
                        alt="Vehicle guide"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'auto', height: 'auto',
                            maxWidth: '75%', maxHeight: '75%',
                            objectFit: 'contain',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            zIndex: 5,
                        }}
                    />

                    {/* ── TOP RIGHT — angle label (red, like reference) ── */}
                    <div style={{
                        position: 'absolute', top: 16, right: 16,
                        zIndex: 10, color: '#ef4444',
                        fontSize: 15, fontWeight: 700,
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    }}>
                        {formatAngleName(angle)}
                    </div>

                    {/* ── BOTTOM LEFT — Location & Date/Time ── */}
                    <div style={{
                        position: 'absolute', bottom: 20, left: 16,
                        zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontWeight: 700, fontSize: 13 }}>
                            <span style={{ fontSize: 14 }}>📍</span>
                            <span style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontWeight: 700, fontSize: 13 }}>
                            <span style={{ fontSize: 14 }}>🕐</span>
                            <span style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{dateTime}</span>
                        </div>
                    </div>

                    {/* ── TOP-LEFT — back button ── */}
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            position: 'absolute', top: 16, left: 16,
                            zIndex: 10,
                            background: 'rgba(0,0,0,0.45)',
                            border: '2px solid rgba(255,255,255,0.7)',
                            borderRadius: '50%',
                            width: 44, height: 44,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#fff', fontSize: 18,
                        }}
                    >
                        ↓
                    </button>

                    {/* ── RIGHT — Capture button (like reference right-side circle) ── */}
                    <button
                        onClick={handleCapturePhoto}
                        disabled={isCapturing}
                        style={{
                            position: 'absolute',
                            right: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: 76, height: 76,
                            borderRadius: '50%',
                            background: '#fff',
                            border: `4px solid ${COLORS.btnPrimary}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            opacity: isCapturing ? 0.5 : 1,
                        }}
                    >
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: COLORS.btnPrimary }} />
                    </button>
                </>
            )}

            {/* ── Retake / Save (after capture) ── */}
            {capturedImage && (
                <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, display: 'flex', gap: 12, zIndex: 10 }}>
                    <button onClick={handleRetake}
                        style={{ flex: 1, padding: 14, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                        Retake
                    </button>
                    <button onClick={handleSavePhoto}
                        style={{ flex: 1, padding: 14, background: COLORS.btnPrimary, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                        Save & Continue
                    </button>
                </div>
            )}

            {/* Hidden canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraCapturePage;
