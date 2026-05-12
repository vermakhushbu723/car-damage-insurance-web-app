import React, { useRef, useState, useEffect, useCallback } from 'react';
import { COLORS } from '../../constants/theme';
import cameraIcon from '../../assets/icons/camera.svg';

/**
 * Document Camera/Gallery picker modal
 *
 * Flow:
 *   1. Selection step — shows "Front Side" and "Back Side" buttons.
 *   2. After picking a side:
 *      - source="gallery" → triggers a hidden <input type="file"> so the
 *        device's gallery / file picker opens.
 *      - source="camera"  → switches the modal into a live camera view
 *        (getUserMedia) and lets the user capture a photo. On desktop the
 *        `capture` attribute is ignored, so we open a real camera ourselves
 *        instead of relying on the file-picker fallback.
 *
 * onCapture is called as: onCapture(side, file)
 *   - side: "Front Side" | "Back Side"
 *   - file: a File object (gallery selection or camera-captured JPEG)
 */
const DocumentCameraModal = ({ visible, docName, source = 'camera', onClose, onCapture }) => {
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [activeSide, setActiveSide] = useState(null); // null = selection step; "Front Side"/"Back Side" = camera step
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // ── Stop any running camera stream ─────────────────────────────────────
    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsCameraReady(false);
    }, []);

    const getErrorMessage = (err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
            return 'Camera permission denied. Allow camera access and try again.';
        if (err.name === 'NotFoundError') return 'No camera found on this device.';
        if (err.name === 'NotReadableError') return 'Camera busy. Close other camera apps and try again.';
        if (err.name === 'NotSupportedError') return 'Camera not supported in this browser.';
        if (err.name === 'SecurityError') return 'Camera needs HTTPS.';
        return `Camera error: ${err.message || err.name}`;
    };

    // ── Start the live camera (only when source=camera + a side was picked)
    useEffect(() => {
        if (!visible || source !== 'camera' || !activeSide) return;

        let cancelled = false;

        const start = async () => {
            setCameraError(null);
            setIsCameraReady(false);
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw Object.assign(new Error('Not supported'), { name: 'NotSupportedError' });
                }
                let mediaStream;
                try {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { exact: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                        audio: false,
                    });
                } catch {
                    // Fallback: front camera / any camera (typical on desktop).
                    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                }
                if (cancelled) {
                    mediaStream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = mediaStream;
                const video = videoRef.current;
                if (video) {
                    video.srcObject = mediaStream;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('muted', '');
                    const tryPlay = () => {
                        video.play()
                            .then(() => !cancelled && setIsCameraReady(true))
                            .catch(e => console.warn('play() failed:', e));
                    };
                    if (video.readyState >= 3) tryPlay();
                    else {
                        video.addEventListener('canplay', tryPlay, { once: true });
                        video.addEventListener('loadedmetadata', tryPlay, { once: true });
                    }
                }
            } catch (err) {
                if (cancelled) return;
                console.error('Camera error:', err);
                setCameraError(getErrorMessage(err));
            }
        };
        start();

        return () => {
            cancelled = true;
            stopStream();
        };
    }, [visible, source, activeSide, stopStream]);

    // ── Close / reset on modal hide ────────────────────────────────────────
    useEffect(() => {
        if (!visible) {
            stopStream();
            setActiveSide(null);
            setCameraError(null);
        }
    }, [visible, stopStream]);

    if (!visible) return null;

    // ── Gallery flow ───────────────────────────────────────────────────────
    const triggerGalleryPicker = (side) => {
        const ref = side === 'Front Side' ? frontInputRef : backInputRef;
        if (ref.current) {
            ref.current.value = '';
            ref.current.click();
        }
    };

    const handleFileChange = (side) => (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        onCapture && onCapture(side, file);
    };

    // ── Side button click — branches on source ─────────────────────────────
    const handleSideClick = (side) => {
        if (source === 'gallery') {
            triggerGalleryPicker(side);
        } else {
            // camera → switch to live camera view
            setActiveSide(side);
        }
    };

    // ── Capture from live video ────────────────────────────────────────────
    const handleCapturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        setIsCapturing(true);
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            setIsCapturing(false);
            if (!blob) return;
            const file = new File(
                [blob],
                `${(docName || 'document').replace(/\s+/g, '_')}_${activeSide.replace(/\s+/g, '_')}.jpg`,
                { type: 'image/jpeg' }
            );
            stopStream();
            const side = activeSide;
            setActiveSide(null);
            onCapture && onCapture(side, file);
        }, 'image/jpeg', 0.92);
    };

    const handleBackToSelection = () => {
        stopStream();
        setActiveSide(null);
        setCameraError(null);
    };

    // capture="environment" hint for mobile gallery input (ignored on desktop).
    // We don't set it at all — gallery flow should NEVER open the camera.
    const galleryCaptureAttr = undefined;

    // ── Render ─────────────────────────────────────────────────────────────
    const inCameraView = source === 'camera' && activeSide !== null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: COLORS.overlay }}
            onClick={inCameraView ? undefined : onClose}
        >
            <div
                className={inCameraView ? 'w-full h-full' : 'w-full max-w-sm rounded-2xl p-6 bg-white'}
                style={inCameraView ? { background: '#000', position: 'relative' } : undefined}
                onClick={(e) => e.stopPropagation()}
            >
                {!inCameraView && (
                    <>
                        {/* Title Row */}
                        <div className="flex items-center justify-between pb-3">
                            <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
                                {docName || 'Document Name'}
                            </span>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-full border flex items-center justify-center"
                                style={{ borderColor: COLORS.borderLight, }}
                            >
                                <span style={{ color: COLORS.textPrimary, fontSize: 14 }}>✕</span>
                            </button>
                        </div>

                        {/* Front / Back */}
                        <div className="flex gap-10 justify-center items-center">
                            {['Front Side', 'Back Side'].map((side, index) => (
                                <div key={side} className="flex items-center gap-10">
                                    <button
                                        type="button"
                                        onClick={() => handleSideClick(side)}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className="w-20 h-20 rounded-md border-2 flex items-center justify-center"
                                        >
                                            <span style={{ fontSize: 32 }}>
                                                <img src={cameraIcon} alt="" className="src" />
                                            </span>
                                        </div>
                                        <span className="text-md">{side}</span>
                                    </button>
                                    {index === 0 && (
                                        <div style={{ width: '1px', height: '150px', background: COLORS.borderLight }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Hidden inputs for gallery flow */}
                        <input
                            ref={frontInputRef}
                            type="file"
                            accept="image/*"
                            capture={galleryCaptureAttr}
                            style={{ display: 'none' }}
                            onChange={handleFileChange('Front Side')}
                        />
                        <input
                            ref={backInputRef}
                            type="file"
                            accept="image/*"
                            capture={galleryCaptureAttr}
                            style={{ display: 'none' }}
                            onChange={handleFileChange('Back Side')}
                        />
                    </>
                )}

                {inCameraView && (
                    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
                        {/* Live video */}
                        <video
                            ref={videoRef}
                            playsInline muted autoPlay
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                display: isCameraReady ? 'block' : 'none',
                            }}
                        />

                        {/* Loading */}
                        {!isCameraReady && !cameraError && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', color: '#fff'
                            }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                                <p style={{ fontSize: 16 }}>Opening camera...</p>
                            </div>
                        )}

                        {/* Error */}
                        {cameraError && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(0,0,0,0.88)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 16, zIndex: 20,
                            }}>
                                <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', maxWidth: 360, width: '100%' }}>
                                    <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                                    <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Camera Access Required</p>
                                    <p style={{ color: '#374151', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{cameraError}</p>
                                    <button onClick={handleBackToSelection}
                                        style={{ width: '100%', padding: 12, background: COLORS.btnPrimary || '#01A0FE', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Top bar: side label + close */}
                        <div style={{
                            position: 'absolute', top: 16, left: 16, right: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            zIndex: 10,
                        }}>
                            <button
                                onClick={handleBackToSelection}
                                style={{
                                    background: 'rgba(0,0,0,0.45)',
                                    border: '2px solid rgba(255,255,255,0.7)',
                                    borderRadius: '50%',
                                    width: 40, height: 40,
                                    color: '#fff', fontSize: 18, cursor: 'pointer',
                                }}
                            >
                                ←
                            </button>
                            <span style={{
                                color: '#fff', fontWeight: 700, fontSize: 15,
                                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                            }}>
                                {(docName || 'Document')} — {activeSide}
                            </span>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(0,0,0,0.45)',
                                    border: '2px solid rgba(255,255,255,0.7)',
                                    borderRadius: '50%',
                                    width: 40, height: 40,
                                    color: '#fff', fontSize: 16, cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Capture button */}
                        {isCameraReady && !cameraError && (
                            <button
                                onClick={handleCapturePhoto}
                                disabled={isCapturing}
                                style={{
                                    position: 'absolute',
                                    bottom: 32, left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 76, height: 76,
                                    borderRadius: '50%',
                                    background: '#fff',
                                    border: `4px solid ${COLORS.btnPrimary || '#01A0FE'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: isCapturing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    opacity: isCapturing ? 0.5 : 1,
                                    zIndex: 10,
                                }}
                            >
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: COLORS.btnPrimary || '#01A0FE' }} />
                            </button>
                        )}

                        {/* Hidden canvas for capture */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentCameraModal;
