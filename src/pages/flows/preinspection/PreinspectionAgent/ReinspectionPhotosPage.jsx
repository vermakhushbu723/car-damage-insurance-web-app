import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import AppHeader from '../../../../components/common/AppHeader';
import DocumentCameraModal from '../../../../components/modals/DocumentCameraModal';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import galleryIcon from '../../../../assets/icons/GALLERY.svg';
import fileIcon from '../../../../assets/icons/FILE.svg';
import cameraIcon from '../../../../assets/icons/CAMERA_ICON.svg';
import carRearLeft from '../../../../assets/png/car/RearLeft.png';
import carLeft from '../../../../assets/png/car/Left.png';
import carRight from '../../../../assets/png/car/Right.png';
import carFrontRight from '../../../../assets/png/car/FrontRight.png';
import carFront from '../../../../assets/png/car/Front.png';
import carRear from '../../../../assets/png/car/Rear.png';

const DEFAULT_VEHICLE_PHOTOS = [
    carRearLeft,
    carLeft,
    carRight,
    carFrontRight,
    carFront,
    carRear,
];

const TOTAL_EXPECTED = 12;

const ReinspectionPhotosPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [vehiclePhotos, setVehiclePhotos] = useState([]);

    // Load vehicle photos from localStorage
    useEffect(() => {
        const storedPhotos = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        // Show only photos actually captured (base64 data URLs) — never the
        // guide-outline placeholders.
        const photoArray = Object.values(storedPhotos).filter(
            (p) => typeof p === 'string' && p.startsWith('data:')
        );
        setVehiclePhotos(photoArray);
    }, []);

    const [reinspectionPhoto, setReinspectionPhoto] = useState(null); // base64 or null
    const [reinspectionStatus, setReinspectionStatus] = useState('required'); // 'required' | 'submitted'
    const [billFile, setBillFile] = useState(null);
    const [billStatus, setBillStatus] = useState('required'); // 'required' | 'submitted' | 'pending'
    const [extraPhotos, setExtraPhotos] = useState([]);
    const [camTarget, setCamTarget] = useState(null); // 'reinspection' | 'bill' | 'more' | null

    const uploadedCount = (reinspectionPhoto ? 1 : 0) + extraPhotos.length + (billFile ? 1 : 0);

    const progress = Math.min((uploadedCount / TOTAL_EXPECTED) * 100, 100);

    const scrollPhotos = (dir) => {
        const el = scrollRef.current;
        if (el) el.scrollBy({ left: dir * 110, behavior: 'smooth' });
    };

    // ── Simulate camera capture (open native camera via file input) ────────
    const triggerCamera = (onCapture) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => onCapture(ev.target.result);
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const triggerGallery = (onCapture) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => onCapture(ev.target.result);
                reader.readAsDataURL(file);
            } else {
                onCapture(file.name); // PDF — just store name
            }
        };
        input.click();
    };

    const triggerFile = (onCapture) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,image/jpeg,image/png';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            onCapture(file.name);
        };
        input.click();
    };

    // Live-camera capture (DocumentCameraModal) → store by the active target.
    const handleCamCapture = (side, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const data = ev.target.result;
            if (camTarget === 'reinspection') { setReinspectionPhoto(data); setReinspectionStatus('submitted'); }
            else if (camTarget === 'bill') { setBillFile(data); setBillStatus('submitted'); }
            else if (camTarget === 'more') { setExtraPhotos((prev) => [...prev, data]); }
        };
        reader.readAsDataURL(file);
    };

    const handleReinspectionCamera = () => setCamTarget('reinspection');

    const handleReinspectionGallery = () => {
        triggerGallery((data) => { setReinspectionPhoto(data); setReinspectionStatus('submitted'); });
    };

    const handleTakeMore = () => setCamTarget('more');

    const handleBillCamera = () => setCamTarget('bill');

    const handleBillGallery = () => {
        triggerGallery((data) => { setBillFile(data); setBillStatus('submitted'); });
    };

    const handleBillFile = () => {
        triggerFile((name) => { setBillFile(name); setBillStatus('submitted'); });
    };

    const handleSubmit = () => {
        // This is the last page in the flow — wipe every form-related cache so
        // the next session starts clean.
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('localStorage.clear failed:', e);
        }
        navigate('/preinspection-agent/repair-submission');
    };

    // ── Status badge ──────────────────────────────────────────────────────
    const Badge = ({ status }) => {
        const cfg = {
            required: { label: 'Required', bg: '#FEE2E2', color: '#EF4444', border: '#EF4444' },
            submitted: { label: 'Submitted', bg: '#DCFCE7', color: '#16A34A', border: '#16A34A' },
            pending: { label: 'Pending', bg: '#FEE2E2', color: '#EF4444', border: '#EF4444' },
        }[status] || {};
        return (
            <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: cfg.bg, color: cfg.color,
                border: `1px solid ${cfg.border}`,
                fontSize: 12, fontWeight: 600,
            }}>
                {cfg.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#fff' }}>
            {/* Header */}
            <AppHeader />

            {/* Title bar */}
            <div
                style={{
                    background: COLORS.bgPageTitle,
                    padding: '13px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >
                    ‹
                </button>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Add Damage Photos</span>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 12px', background: '#fff' }}>

                {/* ── Progress bar ─── */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>No of photos uploaded</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{uploadedCount}</span>
                    </div>
                    <div style={{ height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${progress}%`,
                            background: COLORS.primary, borderRadius: 99, transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* ── Under repair / Reinspection photo ─── */}
                <div style={{
                    background: '#DAF0FE', borderRadius: 14,
                    padding: '14px 14px',
                    marginBottom: 12,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaCheckCircle style={{ color: '#22C55E', fontSize: 18 }} />
                            <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>
                                Under repair/Reinspection photo
                            </span>
                        </div>
                        <Badge status={reinspectionStatus} />
                    </div>

                    {/* Preview */}
                    {reinspectionPhoto && (
                        <div style={{ marginBottom: 10 }}>
                            <img
                                src={reinspectionPhoto}
                                alt="reinspection"
                                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={handleReinspectionCamera}
                            style={{
                                flex: 1, padding: '12px 0',
                                background: COLORS.btnPrimary, color: '#fff',
                                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Camera
                        </button>
                        <button
                            onClick={handleReinspectionGallery}
                            style={{
                                flex: 1, padding: '12px 0',
                                background: '#fff', color: COLORS.primary,
                                border: `1.5px solid ${COLORS.primary}`, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Gallery
                        </button>
                    </div>
                </div>

                {/* ── Take More Photos ─── */}
                <button
                    onClick={handleTakeMore}
                    style={{
                        width: '100%', padding: '14px 0',
                        background: COLORS.btnPrimary, color: '#fff',
                        border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        marginBottom: 16,
                    }}
                >
                    Take More Photos
                </button>

                {/* Extra photos grid */}
                {extraPhotos.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                        {extraPhotos.map((src, i) => (
                            <img key={i} src={src} alt={`extra-${i}`}
                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        ))}
                    </div>
                )}

                {/* ── Vehicle Photos ─── */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>Vehicle Photos</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => scrollPhotos(-1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: COLORS.textSecondary, padding: '2px 4px' }}>‹</button>
                            <button onClick={() => scrollPhotos(1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: COLORS.textSecondary, padding: '2px 4px' }}>›</button>
                            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>Swipe</span>
                        </div>
                    </div>
                    <div
                        ref={scrollRef}
                        style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}
                    >
                        {vehiclePhotos.map((src, i) => (
                            <div key={i} style={{ minWidth: 100, height: 88, borderRadius: 10, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                                <img src={src} alt={`v-${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Upload repair bill / invoice ─── */}
                <p style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary, marginBottom: 10 }}>
                    Upload repair bill / invoice
                </p>
                <div style={{
                    background: '#DAF0FE', borderRadius: 14, padding: '14px 14px',
                    marginBottom: 16,
                }}>
                    {/* Status row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <Badge status={billStatus} />
                    </div>

                    {/* File preview */}
                    {billFile && typeof billFile === 'string' && !billFile.startsWith('data:') && (
                        <div style={{ marginBottom: 10, padding: '8px 12px', background: '#fff', borderRadius: 8, fontSize: 13, color: COLORS.textSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaFileAlt /> {billFile}
                        </div>
                    )}
                    {billFile && typeof billFile === 'string' && billFile.startsWith('data:image') && (
                        <img src={billFile} alt="bill"
                            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                    )}

                    {/* Gallery / File / Camera options */}
                    <div style={{
                        background: '#fff', borderRadius: 10,
                        display: 'flex', alignItems: 'stretch',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                    }}>
                        {/* Gallery */}
                        <button
                            onClick={handleBillGallery}
                            style={{
                                flex: 1, padding: '14px 8px', background: 'none', border: 'none',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                borderRight: '1px solid #E2E8F0',
                            }}
                        >
                            <span style={{ fontSize: 26 }}>
                                <img src={galleryIcon} alt="GALLERY" className="" />
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>GALLERY</span>
                            <span style={{ fontSize: 10, color: COLORS.textSecondary }}>Photos & Images</span>
                        </button>

                        {/* File */}
                        <button
                            onClick={handleBillFile}
                            style={{
                                flex: 1, padding: '14px 8px', background: 'none', border: 'none',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                borderRight: '1px solid #E2E8F0',
                            }}
                        >
                            <span style={{ fontSize: 26 }}>
                                <img src={fileIcon} alt="FILE" className="" />
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6' }}>FILE</span>
                            <span style={{ fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' }}>Documents{'\n'}(PDF, JPG, PNG)</span>
                        </button>

                        {/* Camera */}
                        <button
                            onClick={handleBillCamera}
                            style={{
                                flex: 1, padding: '14px 8px', background: 'none', border: 'none',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            }}
                        >
                            <span style={{ fontSize: 26 }}>
                                <img src={cameraIcon} alt="CAMERA" className="" />
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>CAMERA</span>
                            <span style={{ fontSize: 10, color: COLORS.textSecondary }}>Scan Invoice Now</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Submit ─── */}
            <div style={{
                // position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff', padding: '12px 16px',
                // boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
                maxWidth: 448,
                // margin: '0 auto',
            }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%', padding: '15px 0',
                        background: COLORS.btnPrimary, color: '#fff',
                        border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
            </div>

            {/* Live camera for the reinspection photo / repair bill */}
            <DocumentCameraModal
                visible={!!camTarget}
                docName={camTarget === 'bill' ? 'Repair Bill / Invoice' : 'Reinspection Photo'}
                source="camera"
                mode="single"
                onClose={() => setCamTarget(null)}
                onCapture={handleCamCapture}
            />
        </div>
    );
};

export default ReinspectionPhotosPage;
