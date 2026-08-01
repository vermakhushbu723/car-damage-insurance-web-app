import React, { useState } from 'react';

const BLUE = '#114EC9';

// ── Shared styles ──────────────────────────────────────────────────────
const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#F5F7FA',
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
};

const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 6,
    display: 'block',
};

// ── Step config ────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Personal details' },
    { id: 2, label: 'Irdai license details' },
    { id: 3, label: 'Professional details' },
    { id: 4, label: 'Banking details' },
    { id: 5, label: 'Documents & photo' },
    { id: 6, label: 'Platform & app access' },
];

const SECTION_TITLES = [
    'Personal Details',
    'IRDAI License Details',
    'Professional Details',
    'Banking Details',
    'Documents & Photo',
    'Platform & App Access',
];

// ── Helper components ──────────────────────────────────────────────────

const Field = ({ label, placeholder, type = 'text' }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <input type={type} placeholder={placeholder} style={inputStyle} />
    </div>
);

const SelectField = ({ label, placeholder, options = [] }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ position: 'relative' }}>
            <select
                defaultValue=""
                style={{
                    ...inputStyle,
                    appearance: 'none',
                    paddingRight: 36,
                    cursor: 'pointer',
                    color: '#9CA3AF',
                }}
            >
                <option value="" disabled style={{ color: '#9CA3AF' }}>{placeholder}</option>
                {options.map((o) => (
                    <option key={o} value={o} style={{ color: '#1e293b' }}>{o}</option>
                ))}
            </select>
            <span style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B',
                display: 'flex', alignItems: 'center',
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </span>
        </div>
    </div>
);

const DateField = ({ label, placeholder = 'DD-MM-YYYY' }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder={placeholder}
                style={{ ...inputStyle, paddingRight: 38 }}
            />
            <span style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#94A3B8',
                display: 'flex', alignItems: 'center',
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </span>
        </div>
    </div>
);

const UploadField = ({ label, placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <label style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    ...inputStyle,
                    display: 'flex', alignItems: 'center',
                    paddingRight: 40, color: '#9CA3AF', fontSize: 12,
                    minHeight: 42,
                }}>
                    {placeholder}
                </div>
                <span style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)', color: '#64748B',
                    display: 'flex', alignItems: 'center',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </span>
            </div>
            <input type="file" style={{ display: 'none' }} />
        </label>
    </div>
);

// ── Section header ─────────────────────────────────────────────────────
const SectionHeader = ({ number, title, onClick }) => (
    <div
        onClick={onClick}
        style={{ display: 'flex', alignItems: 'center', padding: '18px 0', cursor: 'pointer' }}
    >
        <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: BLUE, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, flexShrink: 0, marginRight: 14,
        }}>
            {number}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: BLUE, letterSpacing: 0.6 }}>
            {title.toUpperCase()}
        </span>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 1 — Personal Details
// ════════════════════════════════════════════════════════════════════════
const PersonalDetailsForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Full name" placeholder="Eg: MG 1234567890" />
            <SelectField
                label="Gender"
                placeholder="Gender"
                options={['Male', 'Female', 'Other', 'Prefer not to say']}
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Aadhaar number" placeholder="Aadhaar number" />
            <DateField label="Date of birth" placeholder="DD-MM-YYYY" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Primary Contact Number" placeholder="Operating State" />
            <Field label="PAN" placeholder="Eg: MSRT37851G" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Register Address" placeholder="Eg: Companyname@gmail.com" />
            <Field label="Official Email ID" placeholder="Eg: +91 1234567890" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16 }}>
            <Field label="State" placeholder="Eg: +91 1234567890" />
            <Field label="PIN" placeholder="6 Digit Code" />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 2 — IRDAI License Details
// ════════════════════════════════════════════════════════════════════════
const IrdaiLicenseForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="IRDAI surveyor license no" placeholder="Eg: MS 1234567890" />
            <SelectField
                label="License category"
                placeholder="Gender"
                options={['Motor', 'Non-Motor', 'Both']}
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <UploadField label="License certificate upload" placeholder="PDF or JPG, max 5MB" />
            <DateField label="License issue date" placeholder="DD-MM-YYYY" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16 }}>
            <DateField label="License expiry date" placeholder="DD-MM-YYYY" />
            <div />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 3 — Professional Details
// ════════════════════════════════════════════════════════════════════════
const ProfessionalDetailsForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Specialization" placeholder="Eg: MG 1234567890" />
            <SelectField
                label="Years of experience"
                placeholder="Years of experience"
                options={['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years']}
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Empanelled insurers" placeholder="Select from active insurers; min 1 required" />
            <Field label="Service states" placeholder="All Indian states" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Service districts" placeholder="Select from active insurers; min 1 required" />
            <Field label="Max concurrent surveys" placeholder="Service states" />
        </div>
        <div>
            <Field
                label="Vehicle types handled"
                placeholder="2-Wheeler / 4-Wheeler Sedan / SUV / Commercial LCV / Commercial HCV / EV"
            />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 4 — Banking Details
// ════════════════════════════════════════════════════════════════════════
const BankingDetailsForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Account holder name" placeholder="Eg: MG 1234567890" />
            <SelectField
                label="Bank name"
                placeholder="Years of experience"
                options={['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Bank of Baroda']}
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Account number" placeholder="Select from active insurers; min 1 required" />
            <Field label="IFSC code" placeholder="All Indian states" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16 }}>
            <Field label="Account type" placeholder="Select from active insurers; min 1 required" />
            <Field label="Cancelled cheque / passbook" placeholder="Service states" />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 5 — Documents & Photo
// ════════════════════════════════════════════════════════════════════════
const DocumentsPhotoForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <UploadField
                label="Profile photo"
                placeholder="JPG/PNG; max 1MB; face clearly visible; min 200×200px"
            />
            <UploadField
                label="ID proof"
                placeholder="Aadhaar / Passport / Voter ID — PDF or JPG, max 3MB"
            />
        </div>
        <div>
            <UploadField
                label="Address proof"
                placeholder="Utility bill / Aadhaar / Bank statement — max 5MB; not older than 3 months"
            />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 6 — Platform & App Access
// ════════════════════════════════════════════════════════════════════════
const PlatformAppAccessForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Platform" placeholder="Eg: MG 1234567890" />
            <Field
                label="App permissions"
                placeholder="Vehicle Survey / Pre-inspection / Photo-Video Capture / Survey Report Submit / GPS Tracking"
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16 }}>
            <Field
                label="Effective from"
                placeholder="Select from active insurers; min 1 required"
            />
            <Field
                label="Account status"
                placeholder="Active / Inactive / Suspended / License Expired"
            />
        </div>
    </div>
);

// ── Section content map ────────────────────────────────────────────────
const SECTION_FORMS = [
    <PersonalDetailsForm key="1" />,
    <IrdaiLicenseForm key="2" />,
    <ProfessionalDetailsForm key="3" />,
    <BankingDetailsForm key="4" />,
    <DocumentsPhotoForm key="5" />,
    <PlatformAppAccessForm key="6" />,
];

// ════════════════════════════════════════════════════════════════════════
//  Main SurveyorPage
// ════════════════════════════════════════════════════════════════════════
const SurveyorPage = () => {
    const [activeStep, setActiveStep] = useState(1);

    const handleContinue = () => {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length));
    };

    return (
        <div className="ad-page-padding" style={{ padding: '28px 36px', minHeight: '100%', background: '#fff' }}>
            {/* Page title + Continue */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                marginBottom: 32,
            }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    SURVEYOR &mdash; Survey &amp; Claims System
                </h1>
                <button
                    onClick={handleContinue}
                    style={{
                        padding: '10px 30px',
                        background: BLUE, color: '#fff',
                        border: 'none', borderRadius: 6,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.3,
                    }}
                >
                    Continue
                </button>
            </div>

            {/* Two-column layout -- stacks on tablet/mobile (see .ad-page-flex) */}
            <div className="ad-page-flex">
                {/* ── Left: step list ─────────────────────────────────── */}
                <div className="ad-step-rail" style={{ width: 200, flexShrink: 0, paddingTop: 4 }}>
                    {STEPS.map((step) => {
                        const isActive = step.id === activeStep;
                        const isDone = step.id < activeStep;
                        const isFuture = step.id > activeStep;
                        return (
                            <div
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 12,
                                    marginBottom: 20, cursor: 'pointer',
                                    opacity: isFuture ? 0.4 : 1,
                                }}
                            >
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    background: isActive || isDone ? BLUE : 'transparent',
                                    border: `2px solid ${isActive || isDone ? BLUE : '#CBD5E1'}`,
                                    color: isActive || isDone ? '#fff' : '#94A3B8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                                }}>
                                    {step.id}
                                </div>
                                <span style={{
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? BLUE : isDone ? '#64748B' : '#94A3B8',
                                    lineHeight: 1.4,
                                    paddingTop: 3,
                                }}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Right: accordion sections ────────────────────────── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {STEPS.map((step, idx) => {
                        const isActive = step.id === activeStep;
                        return (
                            <div key={step.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <SectionHeader
                                    number={step.id}
                                    title={SECTION_TITLES[idx]}
                                    onClick={() => setActiveStep(step.id)}
                                />
                                {isActive && SECTION_FORMS[idx]}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SurveyorPage;
