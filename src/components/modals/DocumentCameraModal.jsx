import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCheck, FaCamera, FaArrowLeft } from 'react-icons/fa';
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
    // Captured-but-not-yet-confirmed photo (camera flow). When set, the live
    // video is hidden and a preview with ✕ (retake) / ✓ (confirm) is shown.
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingUrl, setPendingUrl] = useState(null);
    // In-memory previews keyed by `${docName}_${side}` → object URL.
    // Stored as a ref so multiple uploads in sequence don't race with React
    // re-render; mirrored to a state counter for repaint.
    const previewsRef = useRef({});
    const [, setPreviewsTick] = useState(0);

    // One-time: purge stale large localStorage entries from older builds that
    // tried to persist multi-MB base64 images (the cause of the bug where the
    // second upload silently failed because the first one filled the quota).
    useEffect(() => {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const k = localStorage.key(i);
                if (!k) continue;
                const v = localStorage.getItem(k);
                if (v && v.length > 600 * 1024 && v.startsWith('data:image')) {
                    localStorage.removeItem(k);
                }
            }
        } catch { /* ignore */ }
    }, []);

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

    // ── Start the live camera (only when source=camera + a side was picked,
    //    and no captured preview is awaiting confirmation)
    useEffect(() => {
        if (!visible || source !== 'camera' || !activeSide || pendingFile) return;

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
    }, [visible, source, activeSide, pendingFile, stopStream]);

    // ── Close / reset on modal hide ────────────────────────────────────────
    useEffect(() => {
        if (!visible) {
            stopStream();
            setActiveSide(null);
            setCameraError(null);
            setPendingFile((prev) => {
                if (prev) {
                    // nothing — file is just dropped; URL revoke handled below
                }
                return null;
            });
            setPendingUrl((url) => {
                if (url) URL.revokeObjectURL(url);
                return null;
            });
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

    // Compress + resize the image so the base64 preview fits inside the
    // ~5MB localStorage quota even when several documents are uploaded.
    const compressImage = (file, maxDimension = 1024, quality = 0.75) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error);
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = () => reject(new Error('Image decode failed'));
                img.onload = () => {
                    let { width, height } = img;
                    if (width > height && width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else if (height >= width && height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

    // Save the upload: store a blob URL for preview, optionally cache a small
    // compressed copy in localStorage, and notify the parent. localStorage is
    // a nice-to-have for cross-session persistence — never load-bearing.
    const saveToLocalStorage = async (side, file) => {
        const key = `${docName}_${side}`;
        // 1) In-memory preview (no quota, never fails)
        const prevUrl = previewsRef.current[key];
        if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
        previewsRef.current[key] = URL.createObjectURL(file);
        setPreviewsTick((n) => n + 1);

        // 2) Always notify the parent first — uploads must not depend on storage.
        onCapture && onCapture(side, file);

        // 3) Best-effort: compress + persist to localStorage for re-opens.
        try {
            const base64String = await compressImage(file);
            try {
                localStorage.setItem(key, base64String);
                const metadata = {
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    side,
                    timestamp: new Date().toISOString(),
                };
                localStorage.setItem(`${key}_metadata`, JSON.stringify(metadata));
            } catch (storageErr) {
                console.warn('localStorage write failed (preview kept in memory):', storageErr);
            }
        } catch (err) {
            console.error('Image compression failed (preview kept in memory):', err);
        }
    };

    const handleFileChange = (side) => (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Directly save to localStorage
        saveToLocalStorage(side, file);
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
    // Doesn't save yet — produces a preview the user can approve (✓) or
    // retake (✕). Saving happens in handleConfirmCapture.
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
            const url = URL.createObjectURL(file);
            // Stop the stream so the still preview takes over.
            stopStream();
            setPendingFile(file);
            setPendingUrl(url);
        }, 'image/jpeg', 0.92);
    };

    // ✓ — accept the captured photo
    const handleConfirmCapture = () => {
        if (!pendingFile) return;
        const side = activeSide;
        const fileToSave = pendingFile;
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
        setActiveSide(null);
        saveToLocalStorage(side, fileToSave);
    };

    // ✕ — discard and resume the camera so the user can retake
    const handleRetake = () => {
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
        // Camera will restart automatically via the start-stream useEffect
        // when pendingFile becomes null.
    };

    const handleBackToSelection = () => {
        stopStream();
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
        setActiveSide(null);
        setCameraError(null);
    };

    // capture="environment" hint for mobile gallery input (ignored on desktop).
    // We don't set it at all — gallery flow should NEVER open the camera.
    const galleryCaptureAttr = undefined;

    // Prefer the in-memory blob URL from this session; fall back to any
    // base64 we previously cached in localStorage (for re-opens).
    const getStoredImage = (side) => {
        if (!docName) return null;
        const key = `${docName}_${side}`;
        return previewsRef.current[key] || localStorage.getItem(key);
    };

    const frontImage = getStoredImage('Front Side');
    const backImage = getStoredImage('Back Side');

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
                                <FaTimes style={{ color: COLORS.textPrimary, fontSize: 14 }} />
                            </button>
                        </div>

                        {/* Front / Back */}
                        <div className="flex gap-10 justify-center items-center">
                            {['Front Side', 'Back Side'].map((side, index) => {
                                const storedImage = side === 'Front Side' ? frontImage : backImage;
                                return (
                                    <div key={side} className="flex items-center gap-10">
                                        <button
                                            type="button"
                                            onClick={() => handleSideClick(side)}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className="w-20 h-20 rounded-md border-2 flex items-center justify-center overflow-hidden"
                                                style={{ position: 'relative' }}
                                            >
                                                {storedImage ? (
                                                    <img
                                                        src={storedImage}
                                                        alt={side}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: 32 }}>
                                                        <img src={cameraIcon} alt="" className="src" />
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-md">{side}</span>
                                        </button>
                                        {index === 0 && (
                                            <div style={{ width: '1px', height: '150px', background: COLORS.borderLight }} />
                                        )}
                                    </div>
                                );
                            })}
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
                        {/* Live video — hidden while a captured preview is pending */}
                        <video
                            ref={videoRef}
                            playsInline muted autoPlay
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                display: !pendingFile && isCameraReady ? 'block' : 'none',
                            }}
                        />

                        {/* Captured still preview (awaiting confirm) */}
                        {pendingFile && pendingUrl && (
                            <img
                                src={pendingUrl}
                                alt="Captured preview"
                                style={{
                                    position: 'absolute', inset: 0,
                                    width: '100%', height: '100%',
                                    objectFit: 'contain',
                                    background: '#000',
                                }}
                            />
                        )}

                        {/* Loading */}
                        {!pendingFile && !isCameraReady && !cameraError && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', color: '#fff'
                            }}>
                                <FaCamera style={{ fontSize: 40, marginBottom: 12 }} />
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
                                    <FaCamera style={{ fontSize: 48, marginBottom: 8, color: '#dc2626' }} />
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
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <FaArrowLeft />
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
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Capture button (live camera, nothing pending) */}
                        {!pendingFile && isCameraReady && !cameraError && (
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

                        {/* Approve / Retake controls (captured-photo preview) */}
                        {pendingFile && (
                            <>
                                <div style={{
                                    position: 'absolute', top: 70, left: 0, right: 0,
                                    display: 'flex', justifyContent: 'center',
                                    zIndex: 10,
                                }}>
                                    <span style={{
                                        background: 'rgba(0,0,0,0.55)',
                                        color: '#fff',
                                        padding: '6px 14px',
                                        borderRadius: 999,
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}>
                                        Use this photo?
                                    </span>
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    bottom: 32, left: 0, right: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: 60,
                                    zIndex: 10,
                                }}>
                                    {/* Retake (✕) */}
                                    <button
                                        onClick={handleRetake}
                                        aria-label="Retake"
                                        style={{
                                            width: 64, height: 64,
                                            borderRadius: '50%',
                                            background: '#fff',
                                            border: `3px solid ${COLORS.statusPending}`,
                                            color: COLORS.statusPending,
                                            fontSize: 24, fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <FaTimes />
                                    </button>

                                    {/* Confirm (✓) */}
                                    <button
                                        onClick={handleConfirmCapture}
                                        aria-label="Use photo"
                                        style={{
                                            width: 64, height: 64,
                                            borderRadius: '50%',
                                            background: COLORS.statusCompleted,
                                            border: '3px solid #fff',
                                            color: '#fff',
                                            fontSize: 24, fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <FaCheck />
                                    </button>
                                </div>
                            </>
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
