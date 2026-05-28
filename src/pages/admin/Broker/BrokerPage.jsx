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
    { id: 1, label: 'Firm details' },
    { id: 2, label: 'logo' },
    { id: 3, label: 'Empanelment' },
    { id: 4, label: 'Platform access' },
    { id: 5, label: 'Role hierarchy' },
    { id: 6, label: 'Primary admin' },
    { id: 7, label: 'Sub-user creation' },
];

const SECTION_TITLES = [
    'Firm Details',
    'Logo',
    'Empanelment',
    'Platform Access',
    'Role Hierarchy',
    'Primary Admin',
    'Sub-User Creation',
];

// ── Helper field components ────────────────────────────────────────────

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

const DateField = ({ label }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <input type="date" style={inputStyle} />
    </div>
);

const LinkIconField = ({ label, placeholder }) => (
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
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            </span>
        </div>
    </div>
);

const EditIconField = ({ label, placeholder }) => (
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </span>
        </div>
    </div>
);

// ── Toggle switch ──────────────────────────────────────────────────────
const Toggle = ({ defaultOn = true }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <div
            onClick={() => setOn(!on)}
            style={{
                width: 42, height: 24, borderRadius: 12,
                background: on ? BLUE : '#CBD5E1',
                position: 'relative', cursor: 'pointer',
                transition: 'background 0.2s', flexShrink: 0,
            }}
        >
            <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: '#fff', position: 'absolute',
                top: 3, left: on ? 21 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }} />
        </div>
    );
};

// ── Section header ─────────────────────────────────────────────────────
const SectionHeader = ({ number, title, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center',
            padding: '18px 0', cursor: 'pointer',
        }}
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
//  Section 1 — Firm Details
// ════════════════════════════════════════════════════════════════════════
const FirmDetailsForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Broker" placeholder="Eg: MG 1234567890" />
            <SelectField
                label="Broker Type"
                placeholder="Broker Type"
                options={['Individual', 'Corporate', 'Composite']}
            />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="IRDAI Broker License Number" placeholder="Eg: MG 1234567890" />
            <DateField label="License Exp Date" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="CIN Number" placeholder="Eg: MG 1234567890" />
            <Field label="PAN" placeholder="Eg: MGMT12310" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="GST Number" placeholder="Eg: Companyname@gmail.com" />
            <Field label="Official Email ID" placeholder="Eg: +91 1234567890" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Primary Contact Number" placeholder="Operating State" />
            <LinkIconField label="Website URL" placeholder="Website Link" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Register Address" placeholder="Eg: Companyname@gmail.com" />
            <Field label="State" placeholder="Eg: +91 1234567890" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="PIN" placeholder="6 Digit Code" />
            <div />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 2 — Logo
// ════════════════════════════════════════════════════════════════════════
const LogoForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <label style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{
                background: '#F5F7FA',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '48px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'background 0.15s',
            }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span style={{ fontSize: 13, color: '#64748B' }}>
                    Upload Logo In Png Or Jpeg Format.
                </span>
            </div>
            <input type="file" accept="image/png,image/jpeg" style={{ display: 'none' }} />
        </label>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 3 — Empanelment
// ════════════════════════════════════════════════════════════════════════
const EmpanelmentForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Lines of business" placeholder="Eg: MS 1234567890" />
            <SelectField
                label="Empanelled insurers"
                placeholder="Broker Type"
                options={['Insurer A', 'Insurer B', 'Insurer C']}
            />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 4 — Platform Access
// ════════════════════════════════════════════════════════════════════════
const PlatformAccessForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Platform</label>
            <input
                type="text"
                defaultValue="Static — Web only"
                readOnly
                style={{ ...inputStyle, color: '#64748B', cursor: 'default', maxWidth: '50%' }}
            />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <DateField label="Effective from" />
            <DateField label="Expiry date" />
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 5 — Role Hierarchy
// ════════════════════════════════════════════════════════════════════════
const RoleHierarchyForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 48px' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>National Manager (HO)</span>
                <Toggle defaultOn />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>Hub Manager</span>
                <Toggle defaultOn />
            </div>
            {/* Row 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>Regional Manager</span>
                <Toggle defaultOn />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>Branch Manager</span>
                <Toggle defaultOn />
            </div>
            {/* Row 3 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>State Manager</span>
                <Toggle defaultOn />
            </div>
            <div>
                <label style={labelStyle}>Max users per role</label>
                <input type="number" placeholder="Number" style={inputStyle} />
            </div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 6 — Primary Admin
// ════════════════════════════════════════════════════════════════════════
const PrimaryAdminForm = () => {
    const [showPwd, setShowPwd] = useState(false);
    return (
        <div style={{ paddingBottom: 28 }}>
            <div style={{ marginBottom: 16 }}>
                <Field label="Admin full name" placeholder="Eg: MG 1234567890" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="Employee ID" placeholder="Eg: Companyname@gmail.com" />
                <Field label="Admin email" placeholder="Eg: +91 1234567890" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="Admin mobile Number" placeholder="Operating State" />
                <LinkIconField label="Designation" placeholder="Website Link" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Linked insurers" placeholder="Eg: Companyname@gmail.com" />
                <div>
                    <label style={labelStyle}>Temp password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="••••••••••••••••••"
                            style={{ ...inputStyle, paddingRight: 38 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            style={{
                                position: 'absolute', right: 12, top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#94A3B8', display: 'flex', alignItems: 'center', padding: 0,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════
//  Section 7 — Sub-user Creation
// ════════════════════════════════════════════════════════════════════════
const SubUserCreationForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <SelectField
                label="Role"
                placeholder="Select Role"
                options={['National Manager', 'Regional Manager', 'Hub Manager', 'Branch Manager', 'State Manager']}
            />
            <EditIconField label="Parent user" placeholder="Website Link" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <SelectField
                label="Geography assignment"
                placeholder="Select"
                options={['North', 'South', 'East', 'West', 'North-East', 'South-West']}
            />
            <EditIconField label="Module access" placeholder="Website Link" />
        </div>
    </div>
);

// ── Section content map ────────────────────────────────────────────────
const SECTION_FORMS = [
    <FirmDetailsForm key="1" />,
    <LogoForm key="2" />,
    <EmpanelmentForm key="3" />,
    <PlatformAccessForm key="4" />,
    <RoleHierarchyForm key="5" />,
    <PrimaryAdminForm key="6" />,
    <SubUserCreationForm key="7" />,
];

// ════════════════════════════════════════════════════════════════════════
//  Main BrokerPage
// ════════════════════════════════════════════════════════════════════════
const BrokerPage = () => {
    const [activeStep, setActiveStep] = useState(1);

    const handleContinue = () => {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length));
    };

    return (
        <div style={{ padding: '28px 36px', minHeight: '100%', background: '#fff' }}>
            {/* Page title + Continue */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 32,
            }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    BROKER &mdash; Survey &amp; Claims System
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

            {/* Two-column layout */}
            <div style={{ display: 'flex', gap: 40 }}>
                {/* ── Left: step list ─────────────────────────────────── */}
                <div style={{ width: 200, flexShrink: 0, paddingTop: 4 }}>
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

export default BrokerPage;
