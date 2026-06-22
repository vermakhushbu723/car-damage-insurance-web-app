import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import AppHeader from '../../../../components/common/AppHeader';
import { ROUTES } from './routes';
import { COLORS } from '../../../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { useCameraContext } from '../../../../contexts/CameraContext';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import {
    selectWorkflowOption,
    WORKFLOW_SUBMIT_ROUTES,
    setOption,
    WORKFLOW_TYPES,
} from '../../../../store/workflowSlice';
import { CAMERA_ACCESS_KEY } from '../../../../routes/ProtectedCameraRoute';
import carFrontLeft from '../../../../assets/png/car/FrontLeft.png';
import carFront from '../../../../assets/png/car/Front.png';
import carFrontRight from '../../../../assets/png/car/FrontRight.png';
import carLeft from '../../../../assets/png/car/Left.png';
import carRearLeft from '../../../../assets/png/car/RearLeft.png';
import carRight from '../../../../assets/png/car/Right.png';
import carRearRight from '../../../../assets/png/car/RearRight.png';
import carRear from '../../../../assets/png/car/Rear.png';

// ── Sections matching the reference image UI ──────────────────────────────
const PHOTO_SECTIONS = [
    {
        id: 'front',
        label: 'Front side',
        captureAngle: 'front-side',
        thumbnails: [
            carFrontLeft,
            carFront,
            carFrontRight,
            carFront,
        ],
    },
    {
        id: 'left',
        label: 'Left side',
        captureAngle: 'lh-side',
        thumbnails: [
            carLeft,
            carFrontLeft,
            carLeft,
            carRearLeft,
        ],
    },
    {
        id: 'right',
        label: 'Right side',
        captureAngle: 'rh-side',
        thumbnails: [
            carRight,
            carFrontRight,
            carRight,
            carRearRight,
        ],
    },
    {
        id: 'rear',
        label: 'Rear side',
        captureAngle: 'rear-side',
        thumbnails: [
            carRearLeft,
            carRear,
            carRearRight,
            carRear,
        ],
    },
];

// Required angles to consider "all done"
export const REQUIRED_ANGLES = ['front-side', 'lh-side', 'rh-side', 'rear-side'];

const AddDamagePhotosPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const location = useLocation();
    const { enableCamera } = useCameraContext();
    const workflowOption = useSelector(selectWorkflowOption);
    const dispatch = useDispatch();
    const [capturedPhotos, setCapturedPhotos] = useState({});

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        setCapturedPhotos(stored);
    }, []);

    const completedCount = PHOTO_SECTIONS.filter(s => capturedPhotos[s.captureAngle]).length;
    const totalCount = PHOTO_SECTIONS.length + 1; // +1 for additional damage section
    const progress = Math.round((completedCount / totalCount) * 100);

    // Group every captured photo by the angle's primary direction, so all
    // "front" angles (front-side, front-rh-side, front-lh) show in the Front
    // section, all "rear" in Rear, "rh-side" in Right, "lh-side" in Left.
    const sideImagesFor = (captureAngle) => {
        const side = captureAngle.split('-')[0];
        return Object.keys(capturedPhotos)
            .filter((k) => capturedPhotos[k] && k.split('-')[0] === side)
            .sort((a, b) => a.localeCompare(b));
    };

    // Next free capture slot for a side: base angle first, then -1, -2, ...
    const nextSideSlot = (captureAngle) => {
        if (!capturedPhotos[captureAngle]) return captureAngle;
        let n = 1;
        while (capturedPhotos[captureAngle + '-' + n]) n++;
        return captureAngle + '-' + n;
    };

    // Additional damage photos — capture as many as needed. Each capture lands
    // in a fresh additional-damage-N slot so they never overwrite each other.
    const additionalKeys = Object.keys(capturedPhotos)
        .filter((k) => k.startsWith('additional-damage-') && capturedPhotos[k])
        .sort((a, b) => Number(a.slice('additional-damage-'.length)) - Number(b.slice('additional-damage-'.length)));
    let nextAdditionalIndex = 0;
    while (capturedPhotos['additional-damage-' + nextAdditionalIndex]) nextAdditionalIndex++;

    const removeAdditional = (key) => {
        setCapturedPhotos((prev) => {
            const next = { ...prev };
            delete next[key];
            try {
                const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
                delete stored[key];
                localStorage.setItem('damage_photos', JSON.stringify(stored));
            } catch { /* ignore */ }
            return next;
        });
    };

    const handleCapture = (captureAngle) => {
        // Hand the camera route a durable access ticket — survives
        // StrictMode remounts and any re-render that would drop location.state.
        window.sessionStorage.setItem(CAMERA_ACCESS_KEY, 'true');
        navigate(`/preinspection-weblink/camera-capture/${captureAngle}`, {
            state: {
                returnTo: '/preinspection-weblink/add-damage-photos',
                cameraEnabled: true,
            },
        });
    };

    const handleSubmit = () => {
        // Workflow is picked on the landing page (stored in Redux), so jump
        // straight to its destination. If the current workflow option is
        // missing, assume the Damage Review flow because this page belongs to
        // that route and persist the fallback so protected routing works.
        const selectedOption = workflowOption || WORKFLOW_TYPES.OPTION_GROUP_1;
        if (!workflowOption) {
            dispatch(setOption(selectedOption));
        }

        const next = WORKFLOW_SUBMIT_ROUTES[selectedOption] || ROUTES.DAMAGE_REVIEW;
        navigate(next);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: COLORS.bgCard }}>
            {/* Header */}
            <AppHeader />

            {/* Page Title Bar */}
            <div
                style={{
                    background: COLORS.bgPageTitle,
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: 22,
                        cursor: 'pointer',
                        lineHeight: 1,
                        padding: 0,
                    }}
                >
                    ‹
                </button>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                    Add Damage Photos
                </span>
            </div>

            {/* Scrollable Content */}
            <div
                style={{
                    flex: 1,
                    padding: '14px 14px 24px',
                    overflowY: 'auto',
                    background: '#DAF0FE',
                }}
            >
                {/* ── Progress Card ─────────────────────────────────── */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: '12px 16px',
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                        }}
                    >
                        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
                            {completedCount} Of {totalCount} Completed
                        </span>
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: COLORS.primary,
                            }}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div
                        style={{
                            height: 6,
                            background: '#E2E8F0',
                            borderRadius: 99,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: COLORS.primary,
                                borderRadius: 99,
                                transition: 'width 0.4s ease',
                            }}
                        />
                    </div>
                </div>

                {/* ── Photo Sections ─────────────────────────────────── */}
                {PHOTO_SECTIONS.map((section) => {
                    const sideKeys = sideImagesFor(section.captureAngle);
                    const captured = sideKeys.length > 0;
                    return (
                        <div
                            key={section.id}
                            style={{
                                background: '#fff',
                                borderRadius: 14,
                                padding: '12px 12px 14px',
                                marginBottom: 14,
                                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                            }}
                        >
                            <p
                                style={{
                                    color: COLORS.textSecondary,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 10,
                                }}
                            >
                                {section.label}
                            </p>

                            {/* All captured photos for this side, then guide outlines */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                                {sideKeys.map((key) => (
                                    <div
                                        key={key}
                                        style={{
                                            width: 'calc((100% - 18px) / 4)',
                                            aspectRatio: '1',
                                            background: '#F1F5F9',
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <img src={capturedPhotos[key]} alt={section.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div
                                            style={{
                                                position: 'absolute', top: 4, right: 4,
                                                background: '#22C55E', borderRadius: '50%',
                                                width: 16, height: 16,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 9, color: '#fff',
                                            }}
                                        >
                                            <FaCheck />
                                        </div>
                                        <button
                                            onClick={() => removeAdditional(key)}
                                            aria-label="Remove"
                                            style={{
                                                position: 'absolute', top: 4, left: 4,
                                                background: '#EF4444', borderRadius: '50%',
                                                width: 16, height: 16, border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 8, color: '#fff',
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Capture button — capture as many photos per side as needed */}
                            <button
                                onClick={() => handleCapture(nextSideSlot(section.captureAngle))}
                                style={{
                                    width: '100%',
                                    padding: '13px 0',
                                    background: COLORS.btnPrimary,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    letterSpacing: 0.2,
                                }}
                            >
                                {captured ? '+ Add Photo' : 'Capture'}
                            </button>
                        </div>
                    );
                })}

                {/* ── Additional Photos Of Damage ─────────────────────── */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: '12px 12px 14px',
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <p
                        style={{
                            color: COLORS.textSecondary,
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 10,
                        }}
                    >
                        Additional Photos Of Damage
                    </p>

                    {/* Captured additional photos — capture as many as needed */}
                    {additionalKeys.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                            {additionalKeys.map((key) => (
                                <div
                                    key={key}
                                    style={{
                                        width: 'calc((100% - 12px) / 3)',
                                        aspectRatio: '1',
                                        background: '#F1F5F9',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    <img src={capturedPhotos[key]} alt="Damage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        onClick={() => removeAdditional(key)}
                                        aria-label="Remove"
                                        style={{
                                            position: 'absolute', top: 4, right: 4,
                                            width: 18, height: 18, borderRadius: '50%',
                                            background: '#EF4444', color: '#fff', border: 'none',
                                            cursor: 'pointer', fontSize: 9,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => handleCapture('additional-damage-' + nextAdditionalIndex)}
                        style={{
                            width: '100%',
                            padding: '13px 0',
                            background: COLORS.btnPrimary,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: 0.2,
                        }}
                    >
                        {additionalKeys.length > 0 ? '+ Add Another Photo' : 'Capture'}
                    </button>
                </div>

                {/* ── Submit button (shown when all 4 main sides done) ── */}
                {completedCount >= PHOTO_SECTIONS.length && (
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: '100%',
                            padding: '15px 0',
                            background: '#22C55E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                        }}
                    >
                        Save & Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddDamagePhotosPage;
