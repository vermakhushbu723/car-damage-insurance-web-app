import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCamera,
    FaCar,
    FaBullseye,
    FaPalette,
    FaBox,
    FaWrench,
    FaIdCard,
    FaMapMarkedAlt,
    FaCalendarAlt,
    FaUser,
    FaMobileAlt,
    FaEnvelope,
    FaFileAlt,
    FaBuilding,
    FaEdit,
    FaCheck,
    FaStopwatch,
} from 'react-icons/fa';
import AppHeader from '../../../../components/common/AppHeader';
import SignaturePad from '../../../../components/common/SignaturePad';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { ROUTES } from './routes';

const VehicleInformationPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehiclePhotos: [],
        make: 'Volkswagen',
        model: 'Polo',
        Variant: 'DSG Automatic',
        bodyType: 'Sedan',
        engineNumber: 'MA1234567',
        odometer: 'N/A',
        MfgYear: '2017',
        State: 'MH',
        registrationNumber: 'MH 44 CD 2545',
        registrationDate: '17/10/2017',
        piRefNumber: '123456789CAR20',
        insuredName: 'User Full Name',
        mobileNumber: '+91 1234567890',
        emailAddress: 'useremail@gmail.com',
        insuranceCompany: 'XYZ Insurance company ltd',
        customerSignature: sessionStorage.getItem('sign_customer') || null,
        inspectionAgentSignature: sessionStorage.getItem('sign_inspector') || null,
    });

    // Declaration acceptance is set on the declaration pages (persisted in
    // sessionStorage) and read back here, so signing can be gated on it.
    const customerDeclAccepted = sessionStorage.getItem('decl_customer') === '1';
    const inspectorDeclAccepted = sessionStorage.getItem('decl_inspector') === '1';

    const [surveyRecommendation, setSurveyRecommendation] = useState('pending'); // pending, approved, rejected

    useEffect(() => {
        // Load vehicle photos from localStorage
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        if (Object.keys(stored).length > 0) {
            setFormData(prev => ({
                ...prev,
                vehiclePhotos: Object.values(stored).slice(0, 6),
            }));
        }
    }, []);

    // Update one of the signature fields with the data URL produced by the
    // SignaturePad on stroke-end (or null when the user clears the pad).
    const signKey = (field) => (field === 'customerSignature' ? 'sign_customer' : 'sign_inspector');

    const handleSignatureChange = (field) => (dataUrl) => {
        setFormData(prev => ({ ...prev, [field]: dataUrl }));
        try { if (dataUrl) sessionStorage.setItem(signKey(field), dataUrl); else sessionStorage.removeItem(signKey(field)); } catch { /* ignore */ }
    };

    const handleClearSignature = (field) => {
        setFormData(prev => ({ ...prev, [field]: null }));
        try { sessionStorage.removeItem(signKey(field)); } catch { /* ignore */ }
    };

    const handleRecentSurvey = () => {
        navigate(-1);
    };

    const handleSubmitSurvey = () => {
        // Validate form and submit
        if (!formData.customerSignature || !formData.inspectionAgentSignature) {
            alert('Please capture both signatures');
            return;
        }
        try {
            ['decl_customer', 'decl_inspector', 'sign_customer', 'sign_inspector'].forEach((k) => sessionStorage.removeItem(k));
        } catch { /* ignore */ }
        navigate(ROUTES.DASHBOARD);
    };

    const handleUndoSignature = (field) => {
        handleClearSignature(field);
    };

    const SignatureSection = ({
        title,
        subtitle,
        field,
        value,
        placeholder,
        declarationLabel,
        icon,
        accepted,
    }) => (
        <div
            style={{
                background: '#fff',
                borderRadius: 14,
                padding: 14,
                marginBottom: 14,
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: icon.background,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: icon.color,
                            fontSize: 18,
                        }}
                    >
                        {icon.symbol}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{title}</p>
                        <p style={{ margin: 0, fontSize: 12, color: COLORS.textSecondary }}>{subtitle}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => handleUndoSignature(field)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.textPrimary,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                    }}
                >
                    Undo
                </button>
            </div>
            <div style={{ position: 'relative' }}>
                <SignaturePad
                    value={value}
                    onChange={handleSignatureChange(field)}
                    height={132}
                    placeholder={placeholder}
                    showClearButton={false}
                />
                {!accepted && (
                    <div
                        onClick={() => navigate(field === 'customerSignature' ? ROUTES.CUSTOMER_DECLARATION : ROUTES.INSPECTOR_DECLARATION)}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(241,245,249,0.88)',
                            borderRadius: 8, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center', padding: 12,
                            fontSize: 12, fontWeight: 600, color: COLORS.textSecondary,
                        }}
                    >
                        Accept the {declarationLabel} to sign here
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 12 }}>
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(field === 'customerSignature' ? ROUTES.CUSTOMER_DECLARATION : ROUTES.INSPECTOR_DECLARATION)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#2563EB',
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        {declarationLabel}
                    </button>
                </div>
                <label
                    onClick={() => navigate(field === 'customerSignature' ? ROUTES.CUSTOMER_DECLARATION : ROUTES.INSPECTOR_DECLARATION)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: COLORS.textSecondary, cursor: 'pointer' }}
                >
                    <input type="checkbox" checked={accepted} readOnly style={{ cursor: 'pointer' }} />
                    <span>I Agree</span>
                </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                    type="button"
                    onClick={() => handleClearSignature(field)}
                    style={{
                        flex: 1,
                        padding: '12px 0',
                        background: '#E5F2FF',
                        color: '#0D6EFD',
                        border: '1px solid #D6E9FF',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={() => {
                        // Navigate to the matching declaration page when saved
                        const dest = field === 'customerSignature' ? ROUTES.CUSTOMER_DECLARATION : ROUTES.INSPECTOR_DECLARATION;
                        navigate(dest);
                    }}
                    style={{
                        flex: 1,
                        padding: '12px 0',
                        background: COLORS.btnPrimary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: value ? 'pointer' : 'not-allowed',
                        opacity: value ? 1 : 0.6,
                    }}
                    disabled={!value}
                >
                    Save
                </button>
            </div>
        </div>
    );

    const InformationRow = ({ icon, label, value, color = '#3B82F6' }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: color + '22', border: '1.5px solid ' + color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontSize: 16, flexShrink: 0 }}>{icon}</div>
            <span style={{ width: 120, fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
            <span style={{ flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: 600 }}>{value}</span>
        </div>
    );

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
                    Vehicle Information
                </span>
            </div>

            {/* Scrollable Content */}
            <div
                style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    background: '#DAF0FE',
                }}
            >
                {/* Vehicle Photos Section */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: 12,
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 10 }}>
                        Vehicle Photos
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 8,
                        }}
                    >
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                style={{
                                    aspectRatio: '1',
                                    background: '#F1F5F9',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                }}
                            >
                                {formData.vehiclePhotos[i] ? (
                                    <img
                                        src={formData.vehiclePhotos[i]}
                                        alt={`Vehicle ${i + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#9CA3AF',
                                            fontSize: 20,
                                        }}
                                    >
                                        <FaCamera />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Details Section */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 12 }}>
                        Vehicle Details
                    </p>
                    <InformationRow icon={<FaCar />} label="Make" value={formData.make} color="#3B82F6" />
                    <InformationRow icon={<FaBullseye />} label="Model" value={formData.model} color="#EF4444" />
                    <InformationRow icon={<FaPalette />} label="Variant" value={formData.Variant} color="#A855F7" />
                    <InformationRow icon={<FaBox />} label="Body Type" value={formData.bodyType} color="#F97316" />
                    <InformationRow icon={<FaWrench />} label="Mfg Year" value={formData.MfgYear} color="#14B8A6" />
                    <InformationRow icon={<FaIdCard />} label="Registration Number" value={formData.registrationNumber} color="#6366F1" />
                    <InformationRow icon={<FaStopwatch />} label="Odometer" value={formData.odometer} color="#EC4899" />
                    <InformationRow icon={<FaMapMarkedAlt />} label="State" value={formData.State} color="#22C55E" />
                    <InformationRow icon={<FaCalendarAlt />} label="Registration Date" value={formData.registrationDate} color="#F59E0B" />
                </div>

                {/* Insured Details Section */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 12 }}>
                        Insured Details
                    </p>
                    <InformationRow icon={<FaUser />} label="Insured Name" value={formData.insuredName} color="#0EA5E9" />
                    <InformationRow icon={<FaMobileAlt />} label="Mobile Number" value={formData.mobileNumber} color="#22C55E" />
                    <InformationRow icon={<FaEnvelope />} label="Email Address" value={formData.emailAddress} color="#F59E0B" />
                    <InformationRow icon={<FaFileAlt />} label="PI Ref.Number" value={formData.piRefNumber} color="#A855F7" />
                    <InformationRow icon={<FaBuilding />} label="Insurance Co" value={formData.insuranceCompany} color="#EF4444" />
                </div>

                <SignatureSection
                    title="Customer/Representative signature"
                    subtitle="Please sign in the box below"
                    field="customerSignature"
                    value={formData.customerSignature}
                    placeholder="Please sign in the box below"
                    declarationLabel="Customer Declaration"
                    accepted={customerDeclAccepted}
                    icon={{ symbol: <FaUser />, background: '#DBEAFE', color: '#1D4ED8' }}
                />

                <SignatureSection
                    title="Inspection agent signature"
                    subtitle="Please sign in the box below"
                    field="inspectionAgentSignature"
                    value={formData.inspectionAgentSignature}
                    placeholder="Please sign in the box below"
                    declarationLabel="Inspector Declaration"
                    accepted={inspectorDeclAccepted}
                    icon={{ symbol: <FaEdit />, background: '#FEF3C7', color: '#B45309' }}
                />

                <div
                    style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: 18,
                        marginBottom: 14,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div
                                style={{
                                    width: 43,
                                    height: 30,
                                    borderRadius: '50%',
                                    background: '#DCFCE7',
                                    border: '1px solid #22C55E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: '#22C55E',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: 14,
                                        fontWeight: 700,
                                    }}
                                >
                                    <FaCheck />
                                </div>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
                                    Recommendation
                                </p>
                                <p style={{ margin: '6px 0 0', fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.4 }}>
                                    Is this Preinspection recommended?
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                                onClick={() => setSurveyRecommendation('approved')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: surveyRecommendation === 'approved' ? '6px solid #22C55E' : '2px solid #22C55E',
                                    background: surveyRecommendation === 'approved' ? '#22C55E' : '#FFFFFF',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span
                                    style={{
                                        width: 100,
                                        height: '100%',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: surveyRecommendation === 'approved' ? '#fff' : '#22C55E',
                                        fontSize: 14,
                                        fontWeight: 700,
                                    }}
                                >
                                </span>
                            </button>
                            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>Yes</span>
                            <button
                                onClick={() => setSurveyRecommendation('rejected')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: surveyRecommendation === 'rejected' ? '6px solid #EF4444' : '2px solid #EF4444',
                                    background: surveyRecommendation === 'rejected' ? '#EF4444' : '#FFFFFF',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span
                                    style={{
                                        width: 100,
                                        height: '100%',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: surveyRecommendation === 'rejected' ? '#fff' : '#EF4444',
                                        fontSize: 14,
                                        fontWeight: 700,
                                    }}
                                >
                                </span>
                            </button>
                            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>No</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={handleRecentSurvey}
                            style={{
                                flex: 1,
                                padding: 14,
                                background: '#FFFFFF',
                                color: '#0F172A',
                                border: '1px solid #CBD5E1',
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Restart Survey
                        </button>
                        <button
                            onClick={handleSubmitSurvey}
                            style={{
                                flex: 1,
                                padding: 14,
                                background: COLORS.btnPrimary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Submit Survey
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleInformationPage;
