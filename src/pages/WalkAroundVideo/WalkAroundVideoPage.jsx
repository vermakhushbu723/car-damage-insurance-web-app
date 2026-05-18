import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/theme';
import rightLogo from '../../assets/rightlogo.svg';
import { usePageLoading } from '../../hooks/usePageLoading';

/**
 * Walk-Around Video capture page.
 *
 * Opens the rear camera, starts recording, and walks the user through a
 * scripted set of instructions — one shown for INSTRUCTION_SECONDS each.
 * The on-screen overlay matches the reference design:
 *
 *   ┌────────────────────────────────────────────────────┐
 *   │ [logo]        ● REC  00:54     WALK AROUND - 6/08  │
 *   │                                Front + Number Plate│
 *   │                                                    │
 *   │                LIVE CAMERA VIDEO                   │
 *   │                                                    │
 *   ├────────────────────────────────────────────────────┤
 *   │ Open the driver-side door, ...   07:34 AM, 06-05-26│
 *   │                                            Geo-Tag │
 *   └────────────────────────────────────────────────────┘
 */

// Each instruction is shown for this many seconds before auto-advancing.
const INSTRUCTION_SECONDS = 10;

// 8-step script. `section` is the top-right heading; `sub` is the highlighted
// sub-label; `desc` is the long instruction shown in the bottom bar.
const INSTRUCTIONS = [
    {
        section: 'WALK AROUND',
        sub: 'Front + Number Plate',
        desc: 'Open the driver-side door, sit in the driver seat, and record the inside view of the front windshield clearly.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Inside The Car',
        desc: 'Record both sides of the RC (Registration Certificate) clearly. (Mandatory)',
    },
    {
        section: 'WALK AROUND',
        sub: 'Inside The Car',
        desc: 'Record the Insurance Policy clearly, if available.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Inside The Car',
        desc: 'Start the engine and record the odometer reading clearly.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Inside The Car',
        desc: 'Open the bonnet, record the chassis number clearly, and capture the complete engine compartment.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Out side The Car',
        desc: 'Take a close-up video of the damaged portion clearly from multiple angles.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Out side The Car',
        desc: 'Walk around the vehicle and record all four sides — front, rear, left and right.',
    },
    {
        section: 'WALK AROUND',
        sub: 'Out side The Car',
        desc: 'Record the rear of the vehicle including the number plate clearly.',
    },
];

const TOTAL_STEPS = INSTRUCTIONS.length;
const TOTAL_SECONDS = TOTAL_STEPS * INSTRUCTION_SECONDS;

const formatClock = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const WalkAroundVideoPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const tickRef = useRef(null);

    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [elapsed, setElapsed] = useState(0);      // seconds since recording started
    const [stepIndex, setStepIndex] = useState(0);  // current instruction (0..TOTAL_STEPS-1)
    const [recordedUrl, setRecordedUrl] = useState(null);
    const [recBlink, setRecBlink] = useState(true);
    const [dateTime, setDateTime] = useState('');
    const [geoTag, setGeoTag] = useState('Location: Not available');
    const [isRecording, setIsRecording] = useState(false);

    // ── Live clock for the bottom-right timestamp ──────────────────────────
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const d = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            setDateTime(`${t}, ${d}`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ── Geolocation for the "Geo-Tag" label ────────────────────────────────
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setGeoTag(`Location: ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`);
            },
            () => setGeoTag('Location: Not available'),
            { timeout: 8000 }
        );
    }, []);

    // ── REC dot blinker ────────────────────────────────────────────────────
    useEffect(() => {
        const id = setInterval(() => setRecBlink((b) => !b), 600);
        return () => clearInterval(id);
    }, []);

    // Start Recording functionnality (triggered by the "Stop & Finish" button or auto-finish when time's up)
    const handleStartRecording = () => {
        if (recorderRef.current && recorderRef.current.state === 'inactive') {
            recorderRef.current.start(1000);
            setIsRecording(true);

            const startedAt = Date.now();
            tickRef.current = setInterval(() => {
                const secs = Math.floor((Date.now() - startedAt) / 1000);
                setElapsed(secs);

                const idx = Math.min(TOTAL_STEPS - 1, Math.floor(secs / INSTRUCTION_SECONDS));
                setStepIndex(idx);

                if (secs >= TOTAL_SECONDS) {
                    clearInterval(tickRef.current);
                    tickRef.current = null;

                    recorderRef.current.stop();
                    streamRef.current?.getTracks().forEach(t => t.stop());
                }
            }, 250);
        }
    };

    // ── Get camera + mic stream ────────────────────────────────────────────
    const getStream = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw Object.assign(new Error('Not supported'), { name: 'NotSupportedError' });
        }
        try {
            return await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: true,
            });
        } catch {
            return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
    };

    const getErrorMessage = (err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
            return 'Camera & mic permission denied. Allow access and try again.';
        if (err.name === 'NotFoundError') return 'No camera found on this device.';
        if (err.name === 'NotReadableError') return 'Camera busy. Close other camera apps and try again.';
        if (err.name === 'NotSupportedError') return 'Camera not supported in this browser.';
        if (err.name === 'SecurityError') return 'Camera needs HTTPS.';
        return `Camera error: ${err.message || err.name}`;
    };

    // ── Stop everything (used on cleanup & on user finish) ─────────────────
    const stopAll = useCallback(() => {
        if (tickRef.current) {
            clearInterval(tickRef.current);
            tickRef.current = null;
        }
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            try { recorderRef.current.stop(); } catch { /* ignore */ }
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    // ── Start camera + recorder once on mount ──────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const start = async () => {
            try {
                setCameraError(null);
                setIsCameraReady(false);
                const stream = await getStream();
                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = stream;

                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('muted', '');
                    video.muted = true; // avoid feedback loop with the mic
                    const tryPlay = () => video.play().then(() => !cancelled && setIsCameraReady(true)).catch(() => { });
                    if (video.readyState >= 3) tryPlay();
                    else {
                        video.addEventListener('canplay', tryPlay, { once: true });
                        video.addEventListener('loadedmetadata', tryPlay, { once: true });
                    }
                }

                // Pick a MediaRecorder mime the browser supports.
                const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
                const mime = candidates.find((c) => window.MediaRecorder && MediaRecorder.isTypeSupported(c)) || '';
                const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
                chunksRef.current = [];
                recorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
                };
                recorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    setRecordedUrl(url);
                };
                recorderRef.current = recorder;
                // recorder.start(1000); // emit a chunk every second

                // ── Drive the on-screen timer + auto-advance instructions ──
                // const startedAt = Date.now();
                // tickRef.current = setInterval(() => {
                //     const secs = Math.floor((Date.now() - startedAt) / 1000);
                //     setElapsed(secs);
                //     const idx = Math.min(TOTAL_STEPS - 1, Math.floor(secs / INSTRUCTION_SECONDS));
                //     setStepIndex(idx);
                //     if (secs >= TOTAL_SECONDS) {
                //         // Auto-finish once the script is done.
                //         clearInterval(tickRef.current);
                //         tickRef.current = null;
                //         if (recorderRef.current && recorderRef.current.state !== 'inactive') {
                //             try { recorderRef.current.stop(); } catch { /* ignore */ }
                //         }
                //         if (streamRef.current) {
                //             streamRef.current.getTracks().forEach((t) => t.stop());
                //             streamRef.current = null;
                //         }
                //     }
                // }, 250);
            } catch (err) {
                if (cancelled) return;
                console.error('Walk-around video error:', err);
                setCameraError(getErrorMessage(err));
            }
        };

        start();

        return () => {
            cancelled = true;
            stopAll();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── User actions ───────────────────────────────────────────────────────
    const handleFinishNow = () => {
        stopAll();
    };

    const handleRetake = () => {
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(null);
        // Hard reload of the page state by re-running the start effect via key
        // would be cleaner, but easier here: navigate to the same route fresh.
        navigate(0);
    };

    const handleSave = () => {
        // Persist the captured video as a data URL so a refresh doesn't lose
        // it. (Larger files should go through the backend instead.)
        if (recordedUrl) {
            try {
                localStorage.setItem('walk_around_video_url', recordedUrl);
            } catch { /* quota — ignore */ }
        }
        navigate(-1);
    };

    const handleBack = () => {
        stopAll();
        navigate(-1);
    };

    const current = INSTRUCTIONS[stepIndex] || INSTRUCTIONS[0];
    const stepLabel = `${current.section} - STEP ${String(stepIndex + 1).padStart(2, '0')}/${String(TOTAL_STEPS).padStart(2, '0')}`;
    const isFinished = recordedUrl !== null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
            {/* ── Live preview ───────────────────────────────────────────── */}
            {!isFinished && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        display: isCameraReady ? 'block' : 'none',
                    }}
                />
            )}

            {/* ── Recorded playback ──────────────────────────────────────── */}
            {isFinished && (
                <video
                    src={recordedUrl}
                    controls
                    autoPlay
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                />
            )}

            {/* ── Loading ────────────────────────────────────────────────── */}
            {!isCameraReady && !cameraError && !isFinished && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                    <p style={{ fontSize: 16 }}>Opening camera...</p>
                </div>
            )}

            {/* ── Error ──────────────────────────────────────────────────── */}
            {cameraError && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.88)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 16, zIndex: 30,
                }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', maxWidth: 360, width: '100%' }}>
                        <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                        <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Camera Access Required</p>
                        <p style={{ color: '#374151', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{cameraError}</p>
                        <button
                            onClick={handleBack}
                            style={{ width: '100%', padding: 12, background: COLORS.btnPrimary, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* ── Recording overlay (only while live) ────────────────────── */}
            {isCameraReady && !isFinished && (
                <>
                    {/* ── Top-left: logo + back affordance ── */}
                    <div style={{
                        position: 'absolute', top: 16, left: 16, zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <img
                            src={rightLogo}
                            alt="IBima Assist"
                            style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 6, background: 'rgba(255,255,255,0.06)', padding: 4 }}
                        />
                    </div>

                    {/* ── Top-center: REC + elapsed timer ── */}
                    <div style={{
                        position: 'absolute', top: 16, left: '50%',
                        transform: 'translateX(-50%)', zIndex: 10,
                        display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                        <div style={{
                            background: '#EF4444', color: '#fff',
                            padding: '6px 14px', borderRadius: 10,
                            fontWeight: 700, fontSize: 16,
                            display: 'flex', alignItems: 'center', gap: 6,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#fff',
                                opacity: recBlink ? 1 : 0.25,
                                transition: 'opacity 0.2s',
                            }} />
                            REC
                        </div>
                        <div style={{
                            background: 'rgba(60,60,60,0.85)', color: '#fff',
                            padding: '6px 14px', borderRadius: 10,
                            fontWeight: 700, fontSize: 16,
                            fontVariantNumeric: 'tabular-nums',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        }}>
                            {formatClock(elapsed)}
                        </div>
                    </div>

                    {/* ── Top-right: step + sub-label ── */}
                    <div style={{
                        position: 'absolute', top: 16, right: 16, zIndex: 10,
                        textAlign: 'right', color: '#fff',
                        textShadow: '0 1px 6px rgba(0,0,0,0.7)',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, letterSpacing: 0.5 }}>
                            {stepLabel}
                        </div>
                        <div style={{
                            marginTop: 6,
                            fontSize: 20, fontWeight: 800,
                            padding: '4px 10px',
                            border: '1.5px solid rgba(255,255,255,0.85)',
                            borderRadius: 6,
                            display: 'inline-block',
                        }}>
                            {current.sub}
                        </div>
                    </div>

                    {/* ── Close (top-right corner of top bar) ── */}
                    <button
                        onClick={handleBack}
                        style={{
                            position: 'absolute', top: 16, right: '50%',
                            transform: 'translateX(140px)', zIndex: 11,
                            background: 'rgba(0,0,0,0.5)',
                            border: '1.5px solid rgba(255,255,255,0.6)',
                            color: '#fff', width: 32, height: 32,
                            borderRadius: '50%', cursor: 'pointer',
                            fontSize: 14, display: 'none', // hidden; back is on the bottom bar instead
                        }}
                    >
                        ✕
                    </button>

                    {/* ── Bottom bar: instruction text + timestamp/geo ── */}
                    <div style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                        background: '#000',
                        padding: '16px 20px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                        gap: 16, zIndex: 10,
                    }}>
                        <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: 1.35, maxWidth: '70%' }}>
                            {current.desc}
                        </div>
                        <div style={{ color: '#fff', textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.95 }}>Date: {dateTime}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>{geoTag}</div>
                        </div>
                    </div>

                    {isCameraReady && !isFinished && !isRecording && (
                        <button
                            onClick={handleStartRecording}
                            style={{
                                position: 'absolute',
                                bottom: 90,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 12,
                                width: 70,
                                height: 70,
                                borderRadius: '50%',
                                background: '#fff',
                                border: '5px solid #EF4444',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                            }}
                        />
                    )}

                    {/* ── Finish Now (small floating button) ── */}
                    <button
                        onClick={handleFinishNow}
                        style={{
                            position: 'absolute', bottom: 90, right: 20, zIndex: 12,
                            background: '#EF4444', color: '#fff',
                            border: 'none', borderRadius: 999,
                            padding: '10px 18px',
                            fontWeight: 700, fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                        }}
                    >
                        ■ Stop & Finish
                    </button>
                </>
            )}

            {/* ── Post-recording controls ────────────────────────────────── */}
            {isFinished && (
                <div style={{
                    position: 'absolute', left: 16, right: 16, bottom: 24,
                    display: 'flex', gap: 12, zIndex: 10,
                }}>
                    <button
                        onClick={handleRetake}
                        style={{ flex: 1, padding: 14, background: '#EF4444', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
                    >
                        Retake
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ flex: 1, padding: 14, background: COLORS.btnPrimary, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
                    >
                        Save & Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalkAroundVideoPage;
