import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCar,
    FaBullseye,
    FaPalette,
    FaIndustry,
    FaIdCard,
    FaStopwatch,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from 'react-icons/fa';
import AppHeader from '../../../../components/common/AppHeader';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { getClaim, submitClaim } from '../../../../services/claimsApi';
import { getSession } from '../../../../utils/authSession';
import { getActiveClaimId, clearActiveClaimId } from '../../../../utils/activeClaim';
import carRearLeft from '../../../../assets/png/car/RearLeft.png';
import carLeft from '../../../../assets/png/car/Left.png';
import carRight from '../../../../assets/png/car/Right.png';
import carFrontRight from '../../../../assets/png/car/FrontRight.png';
import carFront from '../../../../assets/png/car/Front.png';
import carRear from '../../../../assets/png/car/Rear.png';
import greenInsuredNameIcon from '../../../../assets/icons/GreenInsuredName.svg';
import phoneNumberIcon from '../../../../assets/icons/PhoneNumber.svg';
import emailAddressIcon from '../../../../assets/icons/EmailAddress.svg';
import purpleClaimNumberIcon from '../../../../assets/icons/PurpleClaimNumber.svg';
import insuranceCompanyIcon from '../../../../assets/icons/InsuranceCompany.svg';

// ── Default fallback photos ─────────────────────────
const DEFAULT_VEHICLE_PHOTOS = [
    carRearLeft,
    carLeft,
    carRight,
    carFrontRight,
    carFront,
    carRear,
];

const PORTAL_ROLE = 'claim_surveyor';

// Builds the two detail cards from a real claim (see claims-service's
// toPublicClaim) -- replaces what used to be hardcoded placeholder values
// ("Volkswagen Polo", "User Full Name", etc). No "Body Type" (not collected
// on Owner & Vehicle Details) or "Policy Number" (same reason, see
// InspectionDetailsPage's identical note) -- there's no honest value to
// show for either.
function buildVehicleDetails(claim) {
    if (!claim) return [];
    return [
        { icon: <FaCar />, color: '#2563EB', label: 'Make', value: claim.make || '—' },
        { icon: <FaBullseye />, color: '#DB2777', label: 'Model', value: claim.model || '—' },
        { icon: <FaPalette />, color: '#7C3AED', label: 'Variant', value: claim.variant || '—' },
        { icon: <FaIndustry />, color: '#0891B2', label: 'Mfg Year', value: claim.manufacturingYear || '—' },
        { icon: <FaIdCard />, color: '#16A34A', label: 'Registration number', value: claim.registrationNumber || '—' },
        { icon: <FaStopwatch />, color: '#DC2626', label: 'Odometer', value: claim.odometer ? `${claim.odometer} KMS` : '—' },
        { icon: <FaMapMarkerAlt />, color: '#0D9488', label: 'State', value: claim.location || '—' },
        { icon: <FaCalendarAlt />, color: '#4F46E5', label: 'Registration Date', value: claim.registrationDate || '—' },
    ];
}

function buildInsuredDetails(claim) {
    if (!claim) return [];
    return [
        { icon: greenInsuredNameIcon, label: 'Insured Name', value: claim.insuredName || '—', color: '#22C55E' },
        { icon: phoneNumberIcon, label: 'Mobile Number', value: claim.mobile ? `+91 ${claim.mobile}` : '—', color: '#EC4899' },
        { icon: emailAddressIcon, label: 'Email Address', value: claim.email || '—', color: '#F97316' },
        { icon: purpleClaimNumberIcon, label: 'Claim number', value: claim.claimNumber || '—', color: '#7C3AED', muted: true },
        { icon: insuranceCompanyIcon, label: 'Insurance Co', value: claim.insurerName || '—', color: '#3B82F6' },
    ];
}

// ── Row component ─────────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value, muted, last, isImg, color }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingTop: 6,
            paddingBottom: 6,
            borderBottom: last ? 'none' : '1px solid #E2E8F0',
        }}
    >
        <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isImg
                ? <img src={icon} alt={label} style={{ width: 22, height: 22, objectFit: 'contain' }} />
                : <span style={{ fontSize: 18, lineHeight: 1, display: 'flex', color }}>{icon}</span>}
        </div>
        {/* Label with fixed width */}
        <span style={{ width: 118, fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>{label}</span>
        {/* Value left-aligned and flexible */}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: muted ? '#94A3B8' : COLORS.textPrimary }}>{value}</span>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const DamageReviewPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [vehiclePhotos, setVehiclePhotos] = useState([]);
    const [claim, setClaim] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Load vehicle photos from localStorage
    useEffect(() => {
        const storedPhotos = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        const photoArray = Object.values(storedPhotos).filter(photo => photo);

        // If we have photos from localStorage, use them; otherwise use default photos
        if (photoArray.length > 0) {
            setVehiclePhotos(photoArray);
        } else {
            setVehiclePhotos(DEFAULT_VEHICLE_PHOTOS);
        }
    }, []);

    // Load the real claim -- this is what feeds the Vehicle Details / Insured
    // Details cards below instead of hardcoded placeholder values.
    useEffect(() => {
        const claimId = getActiveClaimId();
        if (!claimId) {
            setIsLoading(false);
            setLoadError('No active claim found — please start from Owner & Vehicle Details.');
            return;
        }
        (async () => {
            const session = getSession(PORTAL_ROLE);
            if (!session) return;
            try {
                const { claim: fetchedClaim } = await getClaim(session.token, claimId);
                setClaim(fetchedClaim);
            } catch (err) {
                setLoadError(err.message || 'Could not load claim details.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const vehicleDetails = buildVehicleDetails(claim);
    const insuredDetails = buildInsuredDetails(claim);

    const scrollPhotos = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 110, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        const claimId = getActiveClaimId();
        if (!claimId) {
            navigate('/claim-surveyor/submitted');
            return;
        }
        setSubmitError('');
        setIsSubmitting(true);
        try {
            const session = getSession(PORTAL_ROLE);
            let submittedClaim = claim;
            if (session) {
                const { claim: updated } = await submitClaim(session.token, claimId);
                submittedClaim = updated;
            }
            // Survey is done -- clear the active-claim pointer so a fresh
            // Owner & Vehicle Details submission starts its own new claim
            // rather than accidentally reusing this one. The claim number
            // still reaches SubmittedPage via navigation state below.
            clearActiveClaimId();
            navigate('/claim-surveyor/submitted', { state: { claimNumber: submittedClaim?.claimNumber } });
        } catch (err) {
            setSubmitError(err.message || 'Could not submit survey. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestart = () => {
        localStorage.removeItem('damage_photos');
        navigate('/claim-surveyor/inspection-details');
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#fff' }}>
            {/* Header */}
            <AppHeader />

            {/* Title bar */}
            <div style={{ background: COLORS.bgPageTitle, padding: '0 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6, paddingBottom: 2 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: 0, lineHeight: 1 }}
                    >
                        ‹
                    </button>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Vehicle Information</span>
                </div>
                <p style={{ color: '#fff', fontSize: 11, fontWeight: 500, paddingBottom: 6, marginLeft: 22 }}>
                    Upload All Reqired Documents
                </p>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff', paddingBottom: 8 }}>

                {/* ── Vehicle Photos ─── */}
                <div style={{ padding: '8px 12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>Vehicle Photos</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <button onClick={() => scrollPhotos(-1)} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: COLORS.textSecondary, padding: '2px 4px' }}>‹</button>
                            <button onClick={() => scrollPhotos(1)} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: COLORS.textSecondary, padding: '2px 4px' }}>›</button>
                            <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Swipe</span>
                        </div>
                    </div>
                    <div
                        ref={scrollRef}
                        style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}
                    >
                        {vehiclePhotos.map((src, i) => (
                            <div
                                key={i}
                                style={{
                                    minWidth: 78, height: 70, borderRadius: 8, overflow: 'hidden',
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

                {isLoading ? (
                    <p style={{ margin: '8px 10px 0', fontSize: 13, color: COLORS.textSecondary }}>Loading claim details…</p>
                ) : loadError ? (
                    <p role="alert" style={{ margin: '8px 10px 0', fontSize: 13, color: '#DC2626' }}>{loadError}</p>
                ) : (
                <>
                {/* ── Vehicle Details Card ─── */}
                <div style={{ margin: '8px 10px 0', background: '#DAF0FE', borderRadius: 10, padding: '2px 10px 4px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: COLORS.textPrimary, padding: '6px 0 2px' }}>Vehicle Details</p>
                    {vehicleDetails.map((row, i) => (
                        <DetailRow key={i} {...row} last={i === vehicleDetails.length - 1} isImg={false} />
                    ))}
                </div>

                {/* ── Insured Details Card ─── */}
                <div style={{ margin: '8px 10px 0', background: '#DAF0FE', borderRadius: 10, padding: '2px 10px 4px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: COLORS.textPrimary, padding: '6px 0 2px' }}>Insured Details</p>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 2 }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 2 }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.textSecondary, marginTop: 2 }} />
                    </div>
                    {insuredDetails.map((row, i) => (
                        <DetailRow key={i} {...row} last={i === insuredDetails.length - 1} isImg={true} />
                    ))}
                </div>
                </>
                )}

                {submitError && (
                    <p role="alert" style={{ margin: '8px 10px 0', fontSize: 13, color: '#DC2626' }}>{submitError}</p>
                )}
            </div>

            {/* ── Bottom Buttons ─── */}
            <div
                style={{
                    background: '#fff',
                    padding: '8px 12px',
                    display: 'flex', gap: 8,
                    maxWidth: 448,
                }}
            >
                <button
                    onClick={handleRestart}
                    style={{
                        flex: 1, padding: '10px 0',
                        background: '#fff',
                        color: COLORS.textSecondary,
                        border: `1.5px solid ${COLORS.borderInput}`,
                        borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Restart Survey
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        flex: 1, padding: '10px 0',
                        background: COLORS.btnPrimary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8, fontSize: 13, fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                    }}
                >
                    {isSubmitting ? 'Submitting…' : 'Submit Survey'}
                </button>
            </div>
        </div>
    );
};

export default DamageReviewPage;
