import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import SignaturePad from '../../components/common/SignaturePad';
import { COLORS } from '../../constants/theme';
import { usePageLoading } from '../../hooks/usePageLoading';

const VehicleInformationPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehiclePhotos: [],
        make: 'Volkswagen',
        model: 'Polo',
        color: 'Silver',
        bodyType: 'Sedan',
        engineNumber: 'MA1234567',
        odometer: 'N/A',
        registrationNumber: 'MH 44 CD 2545',
        registrationDate: '17/10/2017',
        insuredName: 'User Full Name',
        mobileNumber: '+91 1234567890',
        emailAddress: 'useremail@gmail.com',
        insuranceCompany: 'XYZ Insurance company ltd',
        customerSignature: null,
        inspectionAgentSignature: null,
    });

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
    const handleSignatureChange = (field) => (dataUrl) => {
        setFormData(prev => ({ ...prev, [field]: dataUrl }));
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
        navigate('/submitted');
    };

    const InformationRow = ({ icon, label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
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
                                        📷
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
                    <InformationRow icon="🚗" label="Make" value={formData.make} />
                    <InformationRow icon="🎯" label="Model" value={formData.model} />
                    <InformationRow icon="🎨" label="Color" value={formData.color} />
                    <InformationRow icon="📦" label="Body Type" value={formData.bodyType} />
                    <InformationRow icon="🔧" label="Engine Number" value={formData.engineNumber} />
                    <InformationRow icon="⏱️" label="Odometer" value={formData.odometer} />
                    <InformationRow icon="📋" label="Registration Number" value={formData.registrationNumber} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12 }}>
                        <div style={{ fontSize: 20 }}>📅</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 }}>Registration Date</p>
                            <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{formData.registrationDate}</p>
                        </div>
                    </div>
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
                    <InformationRow icon="👤" label="Insured Name" value={formData.insuredName} />
                    <InformationRow icon="📱" label="Mobile Number" value={formData.mobileNumber} />
                    <InformationRow icon="📧" label="Email Address" value={formData.emailAddress} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12 }}>
                        <div style={{ fontSize: 20 }}>🏢</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 }}>Insurance Co</p>
                            <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{formData.insuranceCompany}</p>
                        </div>
                    </div>
                </div>

                {/* Customer/Representative Signature */}
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
                        Customer/Representative Signature
                    </p>
                    <SignaturePad
                        value={formData.customerSignature}
                        onChange={handleSignatureChange('customerSignature')}
                        height={120}
                        placeholder="Please sign in this field"
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>I Agree</span>
                    </label>
                </div>

                {/* Inspection Agent Signature */}
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
                        Inspection Agent Signature
                    </p>
                    <SignaturePad
                        value={formData.inspectionAgentSignature}
                        onChange={handleSignatureChange('inspectionAgentSignature')}
                        height={120}
                        placeholder="Please sign in this field"
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>I Agree</span>
                    </label>
                </div>

                {/* Recommendation Section */}
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
                        Recommendation
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                        <button
                            onClick={() => setSurveyRecommendation('approved')}
                            style={{
                                flex: 1,
                                padding: 8,
                                background: surveyRecommendation === 'approved' ? '#22C55E' : '#E5E7EB',
                                color: surveyRecommendation === 'approved' ? '#fff' : '#6B7280',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ✓ Approved
                        </button>
                        <button
                            onClick={() => setSurveyRecommendation('rejected')}
                            style={{
                                flex: 1,
                                padding: 8,
                                background: surveyRecommendation === 'rejected' ? '#EF4444' : '#E5E7EB',
                                color: surveyRecommendation === 'rejected' ? '#fff' : '#6B7280',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ✗ Rejected
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={handleRecentSurvey}
                            style={{
                                flex: 1,
                                padding: 12,
                                background: COLORS.btnSecondary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Recent Survey
                        </button>
                        <button
                            onClick={handleSubmitSurvey}
                            style={{
                                flex: 1,
                                padding: 12,
                                background: COLORS.btnPrimary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 10,
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
