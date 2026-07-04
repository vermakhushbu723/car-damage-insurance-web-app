import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMobileAlt, FaSyncAlt, FaCamera, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { COLORS } from '../../../../constants/theme';
import { useCameraContext } from '../../../../contexts/CameraContext';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { selectVehicleCategory } from '../../../../store/vehicleSlice';
import { getAngleImage, isAngleSupported } from '../../../../constants/vehicleAssets';
import { unlockOrientation } from '../../../../utils/orientation';

// Helper function to create a precise mask that fits the outline of the vehicle frame.
// Uses a flood-fill algorithm from the edges to find the "outside" of the frame,
// then erodes the "outside" region so the cleared zone extends a few pixels past
// the outline. Without this padding, sub-pixel rounding clips the red border of
// the silhouette when the mask is rescaled to the rendered DOM size.
const createMaskFromOutline = (imageUrl) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;

            // Lower threshold catches even faint anti-aliased outline pixels —
            // the flood-fill stops at the outer edge of the anti-alias halo
            // instead of walking into it.
            const OUTLINE_ALPHA_THRESHOLD = 4;
            // Pull the "outside" boundary back just 1 pixel from the outline —
            // enough breathing room that the red border is never clipped by
            // sub-pixel rounding, but tight enough that no visible gap appears
            // between the outline and where the blur begins.
            const DILATION_PASSES = 1;

            const visited = new Uint8Array(width * height);
            let stackPtr = 0;
            const stackX = new Int32Array(width * height);
            const stackY = new Int32Array(width * height);

            const push = (x, y) => {
                if (x < 0 || x >= width || y < 0 || y >= height) return;
                const idx = y * width + x;
                if (visited[idx]) return;
                if (data[idx * 4 + 3] > OUTLINE_ALPHA_THRESHOLD) return;
                visited[idx] = 1;
                stackX[stackPtr] = x;
                stackY[stackPtr] = y;
                stackPtr++;
            };

            for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
            for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

            while (stackPtr > 0) {
                stackPtr--;
                const x = stackX[stackPtr];
                const y = stackY[stackPtr];
                push(x + 1, y);
                push(x - 1, y);
                push(x, y + 1);
                push(x, y - 1);
            }

            // Erode the "outside" region: any visited pixel adjacent to a
            // non-visited pixel becomes non-visited. Repeating this N times
            // pulls the boundary back N pixels, growing the clear zone so
            // the silhouette outline sits safely inside it.
            let current = visited;
            for (let pass = 0; pass < DILATION_PASSES; pass++) {
                const next = new Uint8Array(current);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const idx = y * width + x;
                        if (!current[idx]) continue;
                        const up = y > 0 ? current[idx - width] : 0;
                        const down = y < height - 1 ? current[idx + width] : 0;
                        const left = x > 0 ? current[idx - 1] : 0;
                        const right = x < width - 1 ? current[idx + 1] : 0;
                        if (!up || !down || !left || !right) next[idx] = 0;
                    }
                }
                current = next;
            }

            const maskData = ctx.createImageData(width, height);
            for (let i = 0; i < width * height; i++) {
                if (current[i]) {
                    maskData.data[i * 4] = 0;
                    maskData.data[i * 4 + 1] = 0;
                    maskData.data[i * 4 + 2] = 0;
                    maskData.data[i * 4 + 3] = 255;
                } else {
                    maskData.data[i * 4] = 0;
                    maskData.data[i * 4 + 1] = 0;
                    maskData.data[i * 4 + 2] = 0;
                    maskData.data[i * 4 + 3] = 0;
                }
            }

            ctx.putImageData(maskData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = imageUrl;
    });
};

const CameraCapturePage = () => {
    usePageLoading();
    const { angle } = useParams();
    const navigate = useNavigate();
    const routeLocation = useLocation();
    const { disableCamera, returnPath } = useCameraContext();
    // Vehicle category from /owner-vehicle-details — picks the asset
    // folder (car / bike / truck) for the per-angle guide image.
    const vehicleCategory = useSelector(selectVehicleCategory);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('Fetching...');
    const [dateTime, setDateTime] = useState('');
    // Match PhotoCaptureSelectionPage: photo capture must happen in
    // landscape. Used to gate the camera-start effect *and* the render —
    // in portrait we show a rotate prompt and keep the camera fully off
    // so the device light doesn't stay on behind a hidden UI.
    const [isLandscape, setIsLandscape] = useState(
        typeof window !== 'undefined' && window.innerWidth > window.innerHeight
    );

    const [silhouetteMask, setSilhouetteMask] = useState(null);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef(null);

    const formatAngleName = (name) =>
        name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Resolve the guide image for the current angle from the vehicle
    // category's asset folder. Falls back to the centre silhouette if
    // the requested angle isn't available for that category (e.g.
    // chassis-number on a bike).
    // Strip a trailing -N (extra capture slot) so e.g. 'front-side-2' still
    // shows the 'front-side' guide; unknown angles stay null (clean camera).
    const baseAngle = angle.replace(/-\d+$/, '');
    // "Add Others" photos (dashboard, selfie, windshield, tyres, doors-open …)
    // are free-form shots — never overlay the 360° vehicle silhouette there,
    // regardless of which angle key they reuse.
    const fromOthersFlow =
        ['add-others-photos', 'add-damage-photos'].some((p) => (routeLocation.state?.returnTo || '').includes(p));
    const guideImage = !fromOthersFlow && isAngleSupported(vehicleCategory, baseAngle)
        ? getAngleImage(vehicleCategory, baseAngle)
        : null;

    // ── Orientation watcher ────────────────────────────────────────────────
    // Mirrors PhotoCaptureSelectionPage so the camera flow is consistent —
    // we only render the live preview / capture UI in landscape; portrait
    // shows a rotate prompt.
    useEffect(() => {
        // Release any portrait-lock left over from a previous Save & Continue
        // — otherwise the user would be trapped on the "rotate device" prompt
        // because the browser keeps reporting portrait dimensions.
        unlockOrientation();
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    // ── Generate silhouette mask for the specific guide image ──────────────
    useEffect(() => {
        if (!guideImage) return;
        let cancelled = false;
        createMaskFromOutline(guideImage).then(url => {
            if (!cancelled) setSilhouetteMask(url);
        });
        return () => { cancelled = true; };
    }, [guideImage]);

    // ── Track the exact pixel dimensions of the guide image ────────────────
    useEffect(() => {
        if (!imgRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setImgSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [isCameraReady, capturedImage]);

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
                video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
        } catch {
            return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
    };

    const getErrorMessage = (err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
            return 'Camera permission denied. Tap the lock icon → set Camera to Allow → Try Again.';
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
        // Camera only runs in landscape — rotating to portrait tears down
        // this effect (cleanup stops the stream), rotating back to landscape
        // re-runs it and reopens the camera.
        if (!isLandscape) return;

        // Guard against StrictMode's mount → cleanup → remount cycle: if the
        // effect is torn down while getUserMedia() is still pending, the
        // stream we eventually receive must be stopped instead of leaking
        // (otherwise the camera light stays on after navigation).
        let cancelled = false;
        const start = async () => {
            try {
                setError(null);
                setIsCameraReady(false);
                const mediaStream = await getCameraStream();
                if (cancelled) {
                    mediaStream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = mediaStream;
                startVideoPreview(mediaStream);
            } catch (err) {
                if (cancelled) return;
                console.error('Camera error:', err);
                setError(getErrorMessage(err));
            }
        };
        start();
        return () => {
            cancelled = true;
            // ── CRITICAL: Stop all camera streams when component unmounts ──
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => {
                    t.stop();
                });
                streamRef.current = null;
            }
            // ── Disable camera access in context ──
            disableCamera();
        };
    }, [startVideoPreview, disableCamera, isLandscape]);

    // ── Capture photo ──────────────────────────────────────────────────────
    // Captures the live frame, then downscales to ≤1280px and JPEG q=0.75 so
    // the base64 fits inside localStorage's ~5MB quota even when several
    // angles are saved (a 0.92-quality full-frame can easily exceed 1MB).
    const handleCapturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        setIsCapturing(true);
        try {
            const srcW = video.videoWidth || 1280;
            const srcH = video.videoHeight || 720;
            const MAX = 1280;
            let w = srcW, h = srcH;
            if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
            else if (h >= w && h > MAX) { w = Math.round((w * MAX) / h); h = MAX; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(video, 0, 0, w, h);
            setCapturedImage(canvas.toDataURL('image/jpeg', 0.75));
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
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
        // Save captured image to localStorage keyed by angle.
        // Storage is best-effort: if the quota is exceeded the user must
        // still be able to navigate forward, otherwise the whole flow
        // gets stuck (see bug: second Save & Continue did nothing on phone).
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        stored[angle] = capturedImage;
        let storedOk = true;
        try {
            localStorage.setItem('damage_photos', JSON.stringify(stored));
        } catch (e) {
            storedOk = false;
            console.warn('damage_photos write failed (quota?), navigating anyway:', e);
            // Drop other large entries that aren't damage_photos so future
            // saves can succeed. Keeps the current attempt's data only.
            try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (!k || k === 'damage_photos') continue;
                    const v = localStorage.getItem(k);
                    if (v && v.length > 200 * 1024) localStorage.removeItem(k);
                }
                localStorage.setItem('damage_photos', JSON.stringify(stored));
                storedOk = true;
            } catch (e2) {
                console.warn('damage_photos still failed after cleanup:', e2);
            }
        }

        // Always return to the selection screen — user advances explicitly
        // via the "Next" button there once every angle has been captured.
        const returnTo = routeLocation.state?.returnTo || '/claim-surveyor/photo-capture-selection';
        navigate(returnTo);
    };

    const handleNavigateBack = () => {
        // Navigate back - cleanup will happen in useEffect
        navigate(-1);
    };

    // ─────────────────────────────────────────────────────────────────────
    // Portrait branch — match PhotoCaptureSelectionPage's rotate prompt
    // so every /camera-capture/* angle behaves identically. The camera
    // is not started in this branch (see the gated useEffect above).
    if (!isLandscape) {
        return (
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
        );
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>

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
                    <FaCamera style={{ fontSize: 40, marginBottom: 12 }} />
                    <p style={{ fontSize: 16 }}>Opening camera...</p>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', maxWidth: 360, width: '100%' }}>
                        <FaCamera style={{ fontSize: 48, marginBottom: 8, color: '#dc2626' }} />
                        <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Camera Access Required</p>
                        <p style={{ color: '#374151', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{error}</p>
                        <button onClick={handleRetryCamera}
                            style={{ width: '100%', padding: 12, background: COLORS.btnPrimary, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, marginBottom: 10, cursor: 'pointer' }}>
                            Try Again
                        </button>
                        <button onClick={handleNavigateBack}
                            style={{ width: '100%', padding: 12, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════ LIVE CAMERA OVERLAY — exactly like reference image ═══════════ */}
            {isCameraReady && !capturedImage && (
                <>
                    {/* ── Peripheral blur — keeps a clear "window" in the
                        centre (where the vehicle silhouette sits) and
                        blurs everything around it so distractions in the
                        surroundings fade away. The radial-gradient mask
                        is transparent in the middle (overlay hidden →
                        clear video shows through) and fully opaque at the
                        edges (overlay visible → blurred view). The size
                        is tuned to match the silhouette's `maxWidth/Height`
                        of 75% × 95%. ── */}
                    {guideImage && (<>
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 4,
                            pointerEvents: 'none',
                            backdropFilter: 'blur(18px) saturate(1.05)',
                            WebkitBackdropFilter: 'blur(18px) saturate(1.05)',
                            background: 'rgba(0,0,0,0.18)',
                            WebkitMaskImage: silhouetteMask 
                                ? `url(${silhouetteMask}), linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(50% - ${imgSize.width/2}px + 4px), rgba(0,0,0,0) calc(50% - ${imgSize.width/2}px + 4px), rgba(0,0,0,0) calc(50% + ${imgSize.width/2}px - 4px), rgba(0,0,0,1) calc(50% + ${imgSize.width/2}px - 4px), rgba(0,0,0,1) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(50% - ${imgSize.height/2}px + 4px), rgba(0,0,0,0) calc(50% - ${imgSize.height/2}px + 4px), rgba(0,0,0,0) calc(50% + ${imgSize.height/2}px - 4px), rgba(0,0,0,1) calc(50% + ${imgSize.height/2}px - 4px), rgba(0,0,0,1) 100%)`
                                : 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 8%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.85) 92%, rgba(0,0,0,1) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 1.5%, rgba(0,0,0,0) 2.5%, rgba(0,0,0,0) 97.5%, rgba(0,0,0,0.85) 98.5%, rgba(0,0,0,1) 100%)',
                            maskImage: silhouetteMask 
                                ? `url(${silhouetteMask}), linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(50% - ${imgSize.width/2}px + 4px), rgba(0,0,0,0) calc(50% - ${imgSize.width/2}px + 4px), rgba(0,0,0,0) calc(50% + ${imgSize.width/2}px - 4px), rgba(0,0,0,1) calc(50% + ${imgSize.width/2}px - 4px), rgba(0,0,0,1) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(50% - ${imgSize.height/2}px + 4px), rgba(0,0,0,0) calc(50% - ${imgSize.height/2}px + 4px), rgba(0,0,0,0) calc(50% + ${imgSize.height/2}px - 4px), rgba(0,0,0,1) calc(50% + ${imgSize.height/2}px - 4px), rgba(0,0,0,1) 100%)`
                                : 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 8%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.85) 92%, rgba(0,0,0,1) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 1.5%, rgba(0,0,0,0) 2.5%, rgba(0,0,0,0) 97.5%, rgba(0,0,0,0.85) 98.5%, rgba(0,0,0,1) 100%)',
                            WebkitMaskSize: silhouetteMask ? `${imgSize.width}px ${imgSize.height}px, 100% 100%, 100% 100%` : '100% 100%, 100% 100%',
                            maskSize: silhouetteMask ? `${imgSize.width}px ${imgSize.height}px, 100% 100%, 100% 100%` : '100% 100%, 100% 100%',
                            WebkitMaskPosition: silhouetteMask ? 'center, center, center' : 'center, center',
                            maskPosition: silhouetteMask ? 'center, center, center' : 'center, center',
                            WebkitMaskRepeat: silhouetteMask ? 'no-repeat, no-repeat, no-repeat' : 'no-repeat, no-repeat',
                            maskRepeat: silhouetteMask ? 'no-repeat, no-repeat, no-repeat' : 'no-repeat, no-repeat',
                            WebkitMaskMode: 'alpha',
                            maskMode: 'alpha',
                        }}
                    />

                    {/* ── Car guide image — center ── */}
                    <img
                        ref={imgRef}
                        src={guideImage}
                        alt="Vehicle guide"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'auto', height: 'auto',
                            maxWidth: '75%', maxHeight: '95%',
                            objectFit: 'contain',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            zIndex: 5,
                            clipPath: 'inset(4px)',
                            WebkitClipPath: 'inset(4px)'
                        }}
                    />
                    </>)}

                    {/* ── TOP RIGHT — angle label ── */}
                    <div style={{
                        position: 'absolute', top: 'calc(26px + env(safe-area-inset-top))', right: 'calc(26px + env(safe-area-inset-right))',
                        zIndex: 10, color: COLORS.btnPrimary,
                        fontSize: 22, fontWeight: 700,
                        
                    }}>
                        {formatAngleName(angle)}
                    </div>

                    {/* ── BOTTOM LEFT — Location & Date/Time ── */}
                    <div style={{
                        position: 'absolute', bottom: 'calc(30px + env(safe-area-inset-bottom))', left: 'calc(26px + env(safe-area-inset-left))',
                        zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.btnPrimary, fontWeight: 700, fontSize: 16 }}>
                            <FaMapMarkerAlt style={{ fontSize: 14 }} />
                            <span >Location: {location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.btnPrimary, fontWeight: 700, fontSize: 16 }}>
                            <FaClock style={{ fontSize: 14 }} />
                            <span >Date: {dateTime}</span>
                        </div>
                    </div>

                    {/* ── TOP-LEFT — back button ── */}
                    <button
                        onClick={handleNavigateBack}
                        style={{
                            position: 'absolute', top: 'calc(26px + env(safe-area-inset-top))', left: 'calc(26px + env(safe-area-inset-left))',
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
                            right: 'calc(30px + env(safe-area-inset-right))',
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
                <div style={{ position: 'absolute', bottom: 'calc(34px + env(safe-area-inset-bottom))', left: 'calc(26px + env(safe-area-inset-left))', right: 'calc(26px + env(safe-area-inset-right))', display: 'flex', gap: 12, zIndex: 10 }}>
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
