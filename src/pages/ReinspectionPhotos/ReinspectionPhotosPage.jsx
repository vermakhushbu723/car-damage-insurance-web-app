import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import { COLORS } from '../../constants/theme';

const VEHICLE_PHOTOS = [
    '/images/png/car/RearLeft.png',
    '/images/png/car/Left.png',
    '/images/png/car/Right.png',
    '/images/png/car/FrontRight.png',
    '/images/png/car/Front.png',
    '/images/png/car/Rear.png',
];

const TOTAL_EXPECTED = 12;

const ReinspectionPhotosPage = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [reinspectionPhoto, setReinspectionPhoto] = useState(null); // base64 or null
    const [reinspectionStatus, setReinspectionStatus] = useState('required'); // 'required' | 'submitted'
    const [billFile, setBillFile] = useState(null);
    const [billStatus, setBillStatus] = useState('required'); // 'required' | 'submitted' | 'pending'
    const [extraPhotos, setExtraPhotos] = useState([]);

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

    const handleReinspectionCamera = () => {
        triggerCamera((data) => { setReinspectionPhoto(data); setReinspectionStatus('submitted'); });
    };

    const handleReinspectionGallery = () => {
        triggerGallery((data) => { setReinspectionPhoto(data); setReinspectionStatus('submitted'); });
    };

    const handleTakeMore = () => {
        triggerCamera((data) => setExtraPhotos(prev => [...prev, data]));
    };

    const handleBillCamera = () => {
        triggerCamera((data) => { setBillFile(data); setBillStatus('submitted'); });
    };

    const handleBillGallery = () => {
        triggerGallery((data) => { setBillFile(data); setBillStatus('submitted'); });
    };

    const handleBillFile = () => {
        triggerFile((name) => { setBillFile(name); setBillStatus('submitted'); });
    };

    const handleSubmit = () => {
        navigate('/repair-submission');
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 90px', background: '#fff' }}>

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
                    background: '#EFF6FF', borderRadius: 14,
                    padding: '14px 14px',
                    marginBottom: 12,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#22C55E', fontSize: 20 }}>✅</span>
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
                        {VEHICLE_PHOTOS.map((src, i) => (
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
                    background: '#EFF6FF', borderRadius: 14, padding: '14px 14px',
                    marginBottom: 16,
                }}>
                    {/* Status row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <Badge status={billStatus} />
                    </div>

                    {/* File preview */}
                    {billFile && typeof billFile === 'string' && !billFile.startsWith('data:') && (
                        <div style={{ marginBottom: 10, padding: '8px 12px', background: '#fff', borderRadius: 8, fontSize: 13, color: COLORS.textSecondary }}>
                            📄 {billFile}
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
                            <span style={{ fontSize: 26 }}>🖼️</span>
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
                            <span style={{ fontSize: 26 }}>📁</span>
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
                            <span style={{ fontSize: 26 }}>📷</span>
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
        </div>
    );
};

export default ReinspectionPhotosPage;
