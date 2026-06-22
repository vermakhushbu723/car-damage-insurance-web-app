import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import AppHeader from '../../../../components/common/AppHeader';
import DocumentCameraModal from '../../../../components/modals/DocumentCameraModal';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';

const TOTAL_EXPECTED = 12;

// ── Status badge ──────────────────────────────────────────────────────────
const Badge = ({ status }) => {
    const cfg = {
        required: { label: 'Required', bg: '#FEE2E2', color: '#EF4444', border: '#EF4444' },
        submitted: { label: 'Submitted', bg: '#DCFCE7', color: '#16A34A', border: '#16A34A' },
        pending: { label: 'Pending', bg: '#FEE2E2', color: '#EF4444', border: '#EF4444' },
    }[status] || {};
    return (
        <span style={{
            padding: '4px 14px', borderRadius: 99,
            background: cfg.bg, color: cfg.color,
            border: `1.5px solid ${cfg.border}`,
            fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
        }}>
            {cfg.label}
        </span>
    );
};

const RepairSubmissionPage = () => {
    usePageLoading();
    const navigate = useNavigate();

    const [reinspectionPhoto, setReinspectionPhoto] = useState(null);
    const [reinspectionStatus, setReinspectionStatus] = useState('required');
    const [billPhoto, setBillPhoto] = useState(null);
    const [billStatus, setBillStatus] = useState('required');
    const [extraPhotos, setExtraPhotos] = useState([]);
    const [camTarget, setCamTarget] = useState(null); // 'reinspection' | 'bill' | 'more' | null

    const uploadedCount = (reinspectionPhoto ? 1 : 0) + extraPhotos.length + (billPhoto ? 1 : 0);
    const progress = Math.min((uploadedCount / TOTAL_EXPECTED) * 100, 100);

    // ── File helpers ──────────────────────────────────────────────────────
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
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => onCapture(ev.target.result);
            reader.readAsDataURL(file);
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
            else if (camTarget === 'bill') { setBillPhoto(data); setBillStatus('submitted'); }
            else if (camTarget === 'more') { setExtraPhotos((prev) => [...prev, data]); }
        };
        reader.readAsDataURL(file);
    };

    const handleReinspectionCamera = () => setCamTarget('reinspection');

    const handleReinspectionGallery = () =>
        triggerGallery((d) => { setReinspectionPhoto(d); setReinspectionStatus('submitted'); });

    const handleTakeMore = () => setCamTarget('more');

    const handleBillCamera = () => setCamTarget('bill');

    const handleBillGallery = () =>
        triggerGallery((d) => { setBillPhoto(d); setBillStatus('submitted'); });

    const handleSubmit = () => {
        // Safety net in case any flow lands here with leftover cache.
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('localStorage.clear failed:', e);
        }
        navigate('/claim-weblink/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
            {/* ── Header ── */}
            <AppHeader />

            {/* ── Title bar ── */}
            <div style={{ background: COLORS.bgPageTitle, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >
                    ‹
                </button>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Add Damage Photos</span>
            </div>

            {/* ── Scrollable body ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 100px', background: '#fff' }}>

                {/* Progress bar */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>No of photos uploaded</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{uploadedCount}</span>
                    </div>
                    <div style={{ height: 7, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: COLORS.primary,
                            borderRadius: 99,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* ── Under repair / Reinspection photo card ── */}
                <div style={{
                    background: '#EFF6FF',
                    borderRadius: 16,
                    padding: '16px 16px 18px',
                    marginBottom: 14,
                }}>
                    {/* Row: icon + label + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaCheckCircle style={{ fontSize: 20, color: '#22C55E' }} />
                            <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary }}>
                                Under repair/Reinspection photo
                            </span>
                        </div>
                        <Badge status={reinspectionStatus} />
                    </div>

                    {/* Captured preview */}
                    {reinspectionPhoto && (
                        <div style={{ marginBottom: 12 }}>
                            <img
                                src={reinspectionPhoto}
                                alt="reinspection"
                                style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10 }}
                            />
                        </div>
                    )}

                    {/* Camera / Gallery buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleReinspectionCamera}
                            style={{
                                flex: 1, padding: '14px 0',
                                background: COLORS.btnPrimary, color: '#fff',
                                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Camera
                        </button>
                        <button
                            onClick={handleReinspectionGallery}
                            style={{
                                flex: 1, padding: '14px 0',
                                background: '#fff', color: COLORS.primary,
                                border: `2px solid ${COLORS.primary}`, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Gallery
                        </button>
                    </div>
                </div>

                {/* ── Take More Photos button ── */}
                <button
                    onClick={handleTakeMore}
                    style={{
                        width: '100%', padding: '15px 0',
                        background: COLORS.btnPrimary, color: '#fff',
                        border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        marginBottom: 20,
                    }}
                >
                    Take More Photos
                </button>

                {/* Extra photos grid */}
                {extraPhotos.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                        {extraPhotos.map((src, i) => (
                            <img key={i} src={src} alt={`extra-${i}`}
                                style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 8 }} />
                        ))}
                    </div>
                )}

                {/* ── Repair Bill / invoice heading ── */}
                <p style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary, marginBottom: 12 }}>
                    Repair Bill/invoice
                </p>

                {/* ── Repair bill card ── */}
                <div style={{
                    background: '#EFF6FF',
                    borderRadius: 16,
                    padding: '16px 16px 18px',
                    marginBottom: 16,
                }}>
                    {/* Row: green tick + badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                        <FaCheckCircle style={{ fontSize: 20, color: '#22C55E' }} />
                        <Badge status={billStatus} />
                    </div>

                    {/* Bill preview */}
                    {billPhoto && (
                        <div style={{ marginBottom: 12 }}>
                            <img
                                src={billPhoto}
                                alt="bill"
                                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }}
                            />
                        </div>
                    )}

                    {/* Camera / Gallery buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleBillCamera}
                            style={{
                                flex: 1, padding: '14px 0',
                                background: COLORS.btnPrimary, color: '#fff',
                                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Camera
                        </button>
                        <button
                            onClick={handleBillGallery}
                            style={{
                                flex: 1, padding: '14px 0',
                                background: '#fff', color: COLORS.primary,
                                border: `2px solid ${COLORS.primary}`, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Gallery
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Fixed Submit button ── */}
            <div style={{
                // position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff',
                padding: '12px 16px',
                // boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
                maxWidth: 448,
                // margin: '0 auto',
            }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%', padding: '16px 0',
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

export default RepairSubmissionPage;
