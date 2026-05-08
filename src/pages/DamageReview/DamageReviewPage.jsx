import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import { COLORS } from '../../constants/theme';

// ── Static data (replace with API data as needed) ─────────────────────────
const VEHICLE_PHOTOS = [
    '/images/png/car/RearLeft.png',
    '/images/png/car/Left.png',
    '/images/png/car/Right.png',
    '/images/png/car/FrontRight.png',
    '/images/png/car/Front.png',
    '/images/png/car/Rear.png',
];

const VEHICLE_DETAILS = [
    { icon: '🏗️', label: 'Make', value: 'Volkswagen Polo' },
    { icon: '🚗', label: 'Model', value: 'GT Tsi' },
    { icon: '🧬', label: 'Variant', value: 'DSG Automatic' },
    { icon: '🚙', label: 'Body Type', value: 'Hatch Back', muted: true },
    { icon: '🏭', label: 'Mfg Year', value: '2017' },
    { icon: '📋', label: 'Registration number', value: 'MH 49 DS 2345' },
    { icon: '⏱️', label: 'Odometer', value: '141470 KMS' },
    { icon: '📍', label: 'State', value: 'MH' },
    { icon: '📅', label: 'Registration Date', value: '17/03/2017' },
];

const INSURED_DETAILS = [
    { icon: 'public/images/icons/GreenInsuredName.svg', label: 'Insured Name', value: 'User Full Name', color: '#22C55E' },
    { icon: 'public/images/icons/PhoneNumber.svg', label: 'Mobile Number', value: '+91 1234567890', color: '#EC4899' },
    { icon: 'public/images/icons/EmailAddress.svg', label: 'Email Address', value: 'Username@gmail.com', color: '#F97316' },
    { icon: 'public/images/icons/PurpleClaimNumber.svg', label: 'Claim number', value: '123456789CAR20', color: '#7C3AED', muted: true },
    { icon: 'public/images/icons/PolicyNumber.svg', label: 'Policy Number', value: '123456789CAR20', color: '#22C55E', muted: true },
    { icon: 'public/images/icons/InsuranceCompany.svg', label: 'Insurance Co', value: 'XYZ insurance comapny ltd', color: '#3B82F6' },
];

// ── Row component ─────────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value, muted, last, isImg }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingTop: 13,
            paddingBottom: 13,
            borderBottom: last ? 'none' : '1px solid #E2E8F0',
        }}
    >
        <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isImg
                ? <img src={icon} alt={label} style={{ width: 26, height: 26, objectFit: 'contain' }} />
                : <span style={{ fontSize: 20 }}>{icon}</span>}
        </div>
        <span style={{ flex: 1, fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: muted ? '#94A3B8' : COLORS.textPrimary, textAlign: 'right', maxWidth: '52%' }}>
            {value}
        </span>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const DamageReviewPage = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [photoIndex, setPhotoIndex] = useState(0);

    const scrollPhotos = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 110, behavior: 'smooth' });
    };

    const handleSubmit = () => {
        navigate('/submitted');
    };

    const handleRestart = () => {
        localStorage.removeItem('damage_photos');
        navigate('/inspection-details');
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#fff' }}>
            {/* Header */}
            <AppHeader />

            {/* Title bar */}
            <div style={{ background: COLORS.bgPageTitle, padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, paddingBottom: 4 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1 }}
                    >
                        ‹
                    </button>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Vehicle Information</span>
                </div>
                <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, paddingBottom: 10, marginLeft: 32 }}>
                    Upload All Reqired Documents
                </p>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff', paddingBottom: 90 }}>

                {/* ── Vehicle Photos ─── */}
                <div style={{ padding: '14px 16px 0' }}>
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
                        style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}
                    >
                        {VEHICLE_PHOTOS.map((src, i) => (
                            <div
                                key={i}
                                style={{
                                    minWidth: 100, height: 90, borderRadius: 10, overflow: 'hidden',
                                    background: '#F1F5F9', flexShrink: 0,
                                    border: i === photoIndex ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                                }}
                                onClick={() => setPhotoIndex(i)}
                            >
                                <img src={src} alt={`vehicle-${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Vehicle Details Card ─── */}
                <div style={{ margin: '14px 14px 0', background: '#EFF6FF', borderRadius: 14, padding: '4px 14px 4px' }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary, padding: '12px 0 4px' }}>Vehicle Details</p>
                    {VEHICLE_DETAILS.map((row, i) => (
                        <DetailRow key={i} {...row} last={i === VEHICLE_DETAILS.length - 1} isImg={false} />
                    ))}
                </div>

                {/* ── Insured Details Card ─── */}
                <div style={{ margin: '14px 14px 0', background: '#EFF6FF', borderRadius: 14, padding: '4px 14px 4px' }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary, padding: '12px 0 4px' }}>Insured Details</p>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 4 }} />
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 4 }} />
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 4 }} />
                    </div>
                    {INSURED_DETAILS.map((row, i) => (
                        <DetailRow key={i} {...row} last={i === INSURED_DETAILS.length - 1} isImg={true} />
                    ))}
                </div>
            </div>

            {/* ── Bottom Buttons ─── */}
            <div
                style={{
                    // position: 'fixed', bottom: 0, left: 0, right: 0,
                    background: '#fff',
                    padding: '12px 16px',
                    display: 'flex', gap: 10,
                    // boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
                    maxWidth: 448,
                    // margin: '0 auto',
                }}
            >
                <button
                    onClick={handleRestart}
                    style={{
                        flex: 1, padding: '14px 0',
                        background: '#fff',
                        color: COLORS.textSecondary,
                        border: `1.5px solid ${COLORS.borderInput}`,
                        borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Restart Survey
                </button>
                <button
                    onClick={handleSubmit}
                    style={{
                        flex: 1, padding: '14px 0',
                        background: COLORS.btnPrimary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Submit Survey
                </button>
            </div>
        </div>
    );
};

export default DamageReviewPage;
