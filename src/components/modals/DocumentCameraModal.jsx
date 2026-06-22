import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCheck, FaCamera, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { COLORS } from '../../constants/theme';
import cameraIcon from '../../assets/icons/camera.svg';
import galleryIcon from '../../assets/icons/GALLERY.svg';

/**
 * Document Camera/Gallery picker modal
 *
 * `mode` controls the picker layout:
 *   - 'frontBack' (default) → two tiles: "Front Side" / "Back Side".
 *       Used for documents with two sides (Aadhar, PAN).
 *   - 'single'              → one tile: a single document image.
 *       Used for single-page documents (no front/back choice).
 *   - 'other'               → an editable document-name field + a grid that
 *       accepts MULTIPLE images (gallery multi-select and/or camera).
 *
 * Callbacks:
 *   - onCapture(side, file)        → frontBack / single modes.
 *   - onSaveOther(name, files[])   → 'other' mode (custom name + many images).
 */
const DocumentCameraModal = ({
    visible,
    docName,
    source = 'camera',
    mode = 'frontBack',
    onClose,
    onCapture,
    onSaveOther,
}) => {
    const galleryInputRef = useRef(null);
    const gallerySideRef = useRef(null);
    const otherGalleryRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [activeSide, setActiveSide] = useState(null); // null = selection step; a label = camera step
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingUrl, setPendingUrl] = useState(null);

    // 'other' mode — custom name + a list of selected images.
    const [otherName, setOtherName] = useState('');
    const [otherImages, setOtherImages] = useState([]); // [{ file, url }]

    // In-memory previews keyed by `${docName}_${side}` → object URL.
    const previewsRef = useRef({});
    const [, setPreviewsTick] = useState(0);

    const isOther = mode === 'other';        // multiple images + editable name
    const isMultiple = mode === 'multiple';  // multiple images, fixed name
    const isMulti = isOther || isMultiple;   // any multi-image layout
    const isSingle = mode === 'single';
    const sides = isSingle ? ['Document'] : ['Front Side', 'Back Side'];

    // One-time: purge stale large localStorage entries from older builds.
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

    // ── Start the live camera when a side is active (camera step) ──────────
    // In 'other' mode the camera can be opened regardless of `source`.
    useEffect(() => {
        if (!visible || !activeSide || pendingFile) return;
        if (source !== 'camera' && !isMulti) return;

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
    }, [visible, source, activeSide, pendingFile, isMulti, stopStream]);

    // ── Reset on modal hide ────────────────────────────────────────────────
    useEffect(() => {
        if (!visible) {
            stopStream();
            setActiveSide(null);
            setCameraError(null);
            setPendingFile(null);
            setPendingUrl((url) => { if (url) URL.revokeObjectURL(url); return null; });
            setOtherName('');
            setOtherImages((imgs) => { imgs.forEach(i => i.url && URL.revokeObjectURL(i.url)); return []; });
        }
    }, [visible, stopStream]);

    // Single + camera → jump straight to the live camera (no tile step), so a
    // single "Camera" tap opens the viewfinder immediately.
    useEffect(() => {
        if (visible && isSingle && source === 'camera' && !activeSide && !pendingFile) {
            setActiveSide('Document');
        }
    }, [visible, isSingle, source, activeSide, pendingFile]);

    if (!visible) return null;

    // Compress + resize for the optional localStorage cache.
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

    const saveToLocalStorage = async (side, file) => {
        const key = `${docName}_${side}`;
        const prevUrl = previewsRef.current[key];
        if (prevUrl && prevUrl.startsWith('blob:')) URL.revokeObjectURL(prevUrl);
        previewsRef.current[key] = URL.createObjectURL(file);
        setPreviewsTick((n) => n + 1);

        onCapture && onCapture(side, file);

        try {
            const base64String = await compressImage(file);
            try {
                localStorage.setItem(key, base64String);
            } catch (storageErr) {
                console.warn('localStorage write failed (preview kept in memory):', storageErr);
            }
        } catch (err) {
            console.error('Image compression failed (preview kept in memory):', err);
        }
    };

    // Gallery flow (frontBack / single).
    const triggerGalleryPicker = (side) => {
        gallerySideRef.current = side;
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
            galleryInputRef.current.click();
        }
    };

    const handleGalleryChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        saveToLocalStorage(gallerySideRef.current, file);
        if (isSingle) onClose && onClose();
    };

    // 'other' mode — gallery multi-select appends every chosen image.
    const handleOtherGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setOtherImages((prev) => [
            ...prev,
            ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        ]);
        e.target.value = '';
    };

    const removeOtherImage = (idx) => {
        setOtherImages((prev) => {
            const next = [...prev];
            const [removed] = next.splice(idx, 1);
            if (removed?.url) URL.revokeObjectURL(removed.url);
            return next;
        });
    };

    // For 'other' a document name is mandatory; for fixed-name multi docs the
    // label is implicit, so only images are required.
    const canSaveMulti = otherImages.length > 0 && (!isOther || otherName.trim().length > 0);

    const handleSaveMulti = () => {
        if (!canSaveMulti) return;
        const name = isOther ? otherName.trim() : (docName || '');
        onSaveOther && onSaveOther(name, otherImages.map((i) => i.file));
        onClose && onClose();
    };

    // Side button (frontBack / single).
    const handleSideClick = (side) => {
        if (source === 'gallery') triggerGalleryPicker(side);
        else setActiveSide(side); // camera
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
            const baseName = (isOther ? (otherName || 'document') : (docName || 'document')).replace(/\s+/g, '_');
            const file = new File(
                [blob],
                `${baseName}_${(activeSide || 'image').replace(/\s+/g, '_')}_${otherImages.length + 1}.jpg`,
                { type: 'image/jpeg' }
            );
            const url = URL.createObjectURL(file);
            stopStream();
            setPendingFile(file);
            setPendingUrl(url);
        }, 'image/jpeg', 0.92);
    };

    // ✓ — accept the captured photo
    const handleConfirmCapture = () => {
        if (!pendingFile) return;
        if (isMulti) {
            // Append to the multi-image list; keep the preview URL for the thumb.
            setOtherImages((prev) => [...prev, { file: pendingFile, url: pendingUrl }]);
            setPendingFile(null);
            setPendingUrl(null);
            setActiveSide(null); // back to the multi-image panel
            return;
        }
        const side = activeSide;
        const fileToSave = pendingFile;
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
        setActiveSide(null);
        saveToLocalStorage(side, fileToSave);
        if (isSingle) onClose && onClose();
    };

    const handleRetake = () => {
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
    };

    const handleBackToSelection = () => {
        stopStream();
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingFile(null);
        setPendingUrl(null);
        setCameraError(null);
        // Single mode has no selection step to go back to — just close.
        if (isSingle) { onClose && onClose(); return; }
        setActiveSide(null);
    };

    const getStoredImage = (side) => {
        if (!docName) return null;
        const key = `${docName}_${side}`;
        return previewsRef.current[key] || localStorage.getItem(key);
    };

    const inCameraView = activeSide !== null;

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
                {/* ── Multi-image panel — multiple images (editable name for 'other') ── */}
                {!inCameraView && isMulti && (
                    <>
                        <div className="flex items-center justify-between pb-3 gap-2">
                            {isOther ? (
                                <input
                                    type="text"
                                    value={otherName}
                                    onChange={(e) => setOtherName(e.target.value)}
                                    placeholder="Enter document name"
                                    className="flex-1 outline-none text-base font-semibold border-b px-1 py-1"
                                    style={{ color: COLORS.textPrimary, borderColor: COLORS.borderInput }}
                                />
                            ) : (
                                <span className="flex-1 font-semibold text-base" style={{ color: COLORS.textPrimary }}>
                                    {docName || 'Document Name'}
                                </span>
                            )}
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0"
                                style={{ borderColor: COLORS.borderLight }}
                            >
                                <FaTimes style={{ color: COLORS.textPrimary, fontSize: 14 }} />
                            </button>
                        </div>

                        {/* Selected images grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4 max-h-56 overflow-y-auto">
                            {otherImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative rounded-md overflow-hidden"
                                    style={{ aspectRatio: '1', background: '#F1F5F9' }}
                                >
                                    <img src={img.url} alt={`doc-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        onClick={() => removeOtherImage(idx)}
                                        aria-label="Remove"
                                        style={{
                                            position: 'absolute', top: 2, right: 2,
                                            width: 20, height: 20, borderRadius: '50%',
                                            background: COLORS.statusPending, color: '#fff',
                                            border: 'none', cursor: 'pointer', fontSize: 10,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            {/* Single "Add" tile — uses the source the modal was opened
                                with: the card's Camera button → live camera, the card's
                                Gallery button → multi-select picker. */}
                            <button
                                onClick={() => (source === 'camera' ? setActiveSide('Other') : otherGalleryRef.current?.click())}
                                className="rounded-md flex flex-col items-center justify-center gap-1"
                                style={{ aspectRatio: '1', border: `1.5px dashed ${COLORS.primary}`, color: COLORS.primary, background: '#F8FBFF' }}
                            >
                                <FaPlus />
                                <span style={{ fontSize: 10, fontWeight: 600 }}>Add</span>
                            </button>
                        </div>

                        {otherImages.length === 0 && (
                            <p className="text-xs mb-3 text-center" style={{ color: COLORS.textSecondary }}>
                                Tap “Add” to add one or more images for this document.
                            </p>
                        )}

                        {/* Save */}
                        <button
                            onClick={handleSaveMulti}
                            disabled={!canSaveMulti}
                            className="w-full py-3 rounded-xl text-white text-sm font-bold"
                            style={{
                                background: canSaveMulti ? COLORS.statusCompleted : '#9CA3AF',
                                cursor: canSaveMulti ? 'pointer' : 'not-allowed',
                                opacity: canSaveMulti ? 1 : 0.7,
                            }}
                        >
                            Save{otherImages.length ? ` (${otherImages.length})` : ''}
                        </button>

                        <input
                            ref={otherGalleryRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleOtherGalleryChange}
                        />
                    </>
                )}

                {/* ── Selection step (frontBack / single) ── */}
                {!inCameraView && !isMulti && (
                    <>
                        <div className="flex items-center justify-between pb-3">
                            <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
                                {docName || 'Document Name'}
                            </span>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-full border flex items-center justify-center"
                                style={{ borderColor: COLORS.borderLight }}
                            >
                                <FaTimes style={{ color: COLORS.textPrimary, fontSize: 14 }} />
                            </button>
                        </div>

                        <div className={`flex justify-center items-center ${isSingle ? '' : 'gap-10'}`}>
                            {sides.map((side, index) => {
                                const storedImage = getStoredImage(side);
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
                                                    <img src={storedImage} alt={side} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: 32 }}>
                                                        {/* Gallery mode → gallery icon (tap opens device gallery);
                                                            camera mode → camera icon (unchanged). */}
                                                        <img src={source === 'gallery' ? galleryIcon : cameraIcon} alt="" className="src" />
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-md">{isSingle ? 'Upload Document' : side}</span>
                                        </button>
                                        {!isSingle && index === 0 && (
                                            <div style={{ width: '1px', height: '150px', background: COLORS.borderLight }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleGalleryChange}
                        />
                    </>
                )}

                {inCameraView && (
                    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
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

                        {pendingFile && pendingUrl && (
                            <img
                                src={pendingUrl}
                                alt="Captured preview"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                            />
                        )}

                        {!pendingFile && !isCameraReady && !cameraError && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <FaCamera style={{ fontSize: 40, marginBottom: 12 }} />
                                <p style={{ fontSize: 16 }}>Opening camera...</p>
                            </div>
                        )}

                        {cameraError && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 20 }}>
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

                        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                            <button
                                onClick={handleBackToSelection}
                                style={{ background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FaArrowLeft />
                            </button>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                                {(isOther ? (otherName || 'Document') : (docName || 'Document'))}{isSingle || isMulti ? '' : ` — ${activeSide}`}
                            </span>
                            <button
                                onClick={onClose}
                                style={{ background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {!pendingFile && isCameraReady && !cameraError && (
                            <button
                                onClick={handleCapturePhoto}
                                disabled={isCapturing}
                                style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: 76, height: 76, borderRadius: '50%', background: '#fff', border: `4px solid ${COLORS.btnPrimary || '#01A0FE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isCapturing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', opacity: isCapturing ? 0.5 : 1, zIndex: 10 }}
                            >
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: COLORS.btnPrimary || '#01A0FE' }} />
                            </button>
                        )}

                        {pendingFile && (
                            <>
                                <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                                    <span style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                                        {isOther ? 'Add this photo?' : 'Use this photo?'}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, zIndex: 10 }}>
                                    <button
                                        onClick={handleRetake}
                                        aria-label="Retake"
                                        style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', border: `3px solid ${COLORS.statusPending}`, color: COLORS.statusPending, fontSize: 24, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FaTimes />
                                    </button>
                                    <button
                                        onClick={handleConfirmCapture}
                                        aria-label="Use photo"
                                        style={{ width: 64, height: 64, borderRadius: '50%', background: COLORS.statusCompleted, border: '3px solid #fff', color: '#fff', fontSize: 24, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FaCheck />
                                    </button>
                                </div>
                            </>
                        )}

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentCameraModal;
