import React, { useState } from 'react';

const BLUE = '#114EC9';

const STEPS = [
    { id: 1, label: 'Company Details' },
    { id: 2, label: 'Primary Admin (National Manager)' },
    { id: 3, label: 'Branding' },
    { id: 4, label: 'Access Lifecycle' },
    { id: 5, label: 'Role Hierarchy' },
    { id: 6, label: 'Sub-user creation — all roles' },
];

const SECTION_TITLES = [
    'Company Details',
    'Primary Admin ( National Manager )',
    'Branding',
    'Access Lifecycle',
    'Role Hierarchy',
    'Sub-User Creation — All Roles',
];

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

const Field = ({ label, placeholder, type = 'text', style = {} }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>{label}</label>
        <input type={type} placeholder={placeholder} style={{ ...inputStyle, ...style }} />
    </div>
);

// ── Toggle switch ──────────────────────────────────────────────────────
const Toggle = ({ defaultOn = true }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <div
            onClick={() => setOn(!on)}
            style={{
                width: 42, height: 24,
                borderRadius: 12,
                background: on ? BLUE : '#CBD5E1',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
                flexShrink: 0,
            }}
        >
            <div style={{
                width: 18, height: 18,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: on ? 21 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }} />
        </div>
    );
};

// ── Checkbox ───────────────────────────────────────────────────────────
const Checkbox = ({ label, defaultChecked = false }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div
            onClick={() => setChecked(!checked)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}
        >
            <div style={{
                width: 18, height: 18,
                borderRadius: 4,
                border: `2px solid ${checked ? BLUE : '#CBD5E1'}`,
                background: checked ? BLUE : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s, border-color 0.15s',
            }}>
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <span style={{ fontSize: 13, color: '#374151', userSelect: 'none' }}>{label}</span>
        </div>
    );
};

// ── Section header row ─────────────────────────────────────────────────
const SectionHeader = ({ number, title, rightLabel, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 0', cursor: 'pointer',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: BLUE, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
                {number}
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: BLUE, letterSpacing: 0.6 }}>
                {title.toUpperCase()}
            </span>
        </div>
        {rightLabel && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: 0.5 }}>
                {rightLabel}
            </span>
        )}
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 1 — Company Details
// ════════════════════════════════════════════════════════════════════════
const CompanyDetailsForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Company Name" placeholder="Eg: MG 1234567890" />
            <Field label="CIN" placeholder="Enter Employee Name" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="IRDAI License" placeholder="Eg: MG 1234567890" />
            <Field label="Insure Type" placeholder="Enter Employee Name" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="GST" placeholder="Eg: MG 1234567890" />
            <Field label="PAN" placeholder="Eg: MGMT12310" />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="Official Email" placeholder="Eg: Companyname@gmail.com" />
            <Field label="Contact Number" placeholder="Eg: +91 1234567890" />
        </div>
        <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Register Address</label>
            <textarea
                placeholder="Full Postal Address"
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
            />
        </div>
        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
            <Field label="State" placeholder="Operating State" />
            <Field label="PIN" placeholder="6 Digit Code" />
        </div>
        <Field label="Website" placeholder="Eg: MG 1234567890" />
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 2 — Primary Admin
// ════════════════════════════════════════════════════════════════════════
const PrimaryAdminForm = () => {
    const [showPwd, setShowPwd] = useState(false);
    return (
        <div style={{ paddingBottom: 28 }}>
            <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
                <Field label="Full Name" placeholder="Eg: MG 1234567890" />
                <Field label="Employee ID" placeholder="Enter Employee Name" />
            </div>
            <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
                <Field label="Work Email" placeholder="Eg: MG 1234567890" />
                <Field label="Mobile" placeholder="Eg: M18T57810" />
            </div>
            <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
                <Field label="Designation" placeholder="Eg: Companyname@gmail.com" />
                <Field label="Department" placeholder="Eg: +91 1234567890" />
            </div>
            <div>
                <label style={labelStyle}>Temporary Password</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••••••••••••••"
                        style={{ ...inputStyle, paddingRight: 44 }}
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
                        {showPwd ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════
//  Section 3 — Branding
// ════════════════════════════════════════════════════════════════════════
const BrandingForm = () => {
    const [color, setColor] = useState('#004AC6');
    return (
        <div style={{ paddingBottom: 28 }}>
            <div className="ad-form-grid" style={{ gap: 48 }}>
                <div>
                    <div style={{
                        width: 108, height: 108,
                        border: '2px dashed #93C5FD',
                        borderRadius: 10,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 8, cursor: 'pointer', background: '#F8FAFF',
                    }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginTop: 8, letterSpacing: 0.5 }}>
                        UPLOAD LOGO
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 14, letterSpacing: 0.5 }}>
                        PRIMARY BRAND COLOUR
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 6,
                            background: color, border: '1px solid #E2E8F0',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer',
                        }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    position: 'absolute', inset: 0, opacity: 0,
                                    cursor: 'pointer', width: '100%', height: '100%',
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={{ ...inputStyle, width: 130 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════
//  Section 4 — Access Lifecycle
// ════════════════════════════════════════════════════════════════════════
const AccessLifecycleForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: 16 }}>
            <div>
                <label style={labelStyle}>Effective From</label>
                <input type="date" style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Expiry Date</label>
                <input type="date" style={inputStyle} />
            </div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 5 — Role Hierarchy
// ════════════════════════════════════════════════════════════════════════
const ROLES = [
    { id: 'national', label: 'National Manager' },
    { id: 'regional', label: 'Regional Manager' },
    { id: 'state', label: 'State Manager' },
    { id: 'hub', label: 'Hub Manager' },
    { id: 'branch', label: 'Branch Manager' },
];

const RoleHierarchyForm = () => (
    <div style={{ paddingBottom: 28 }}>
        <div className="ad-form-grid" style={{ gap: '16px 40px' }}>
            {ROLES.map((role) => (
                <div key={role.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>{role.label}</span>
                    <Toggle defaultOn />
                </div>
            ))}
            <div>
                <label style={labelStyle}>Max Users Per Role</label>
                <input type="number" defaultValue={50} style={inputStyle} />
            </div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
//  Section 6 — Sub-user Creation
// ════════════════════════════════════════════════════════════════════════
const MODULE_PERMS = [
    { label: 'Clean Processing', checked: true },
    { label: 'Policy Endorsement', checked: true },
    { label: 'Financial Settlements', checked: false },
    { label: 'Dealer Management', checked: false },
    { label: 'Document Repository', checked: true },
];

const CLAIM_TYPES = [
    { label: 'Own Damage (OD)', checked: true },
    { label: 'Third Party', checked: true },
    { label: 'Thrift Claims', checked: false },
    { label: 'Total Loss/Net Of Salvage', checked: false },
    { label: 'Commercial Glass Only', checked: true },
];

const SubUserCreationForm = () => {
    const [regions, setRegions] = useState(['North-West', 'South-Central']);

    const removeRegion = (r) => setRegions((prev) => prev.filter((x) => x !== r));

    return (
        <div style={{ paddingBottom: 28 }}>
            {/* Role selector */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
                <select style={{
                    ...inputStyle,
                    appearance: 'none',
                    paddingRight: 36,
                    cursor: 'pointer',
                }}>
                    <option>Internal Claims Auditor</option>
                    <option>National Manager</option>
                    <option>Regional Manager</option>
                    <option>State Manager</option>
                    <option>Hub Manager</option>
                    <option>Branch Manager</option>
                </select>
                <span style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {/* User ID */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                    ...inputStyle, flex: 1, color: '#374151', fontSize: 13,
                    display: 'flex', alignItems: 'center',
                }}>
                    National_Admin_HQ_01
                </div>
                <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#64748B', display: 'flex', alignItems: 'center', padding: 4,
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
            </div>

            {/* Multi-Region Assignment */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8 }}>
                    Multi-Region Assignment
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {regions.map((r) => (
                        <span key={r} style={{
                            padding: '5px 16px',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            borderRadius: 20,
                            fontSize: 12, fontWeight: 500, color: BLUE,
                        }}>
                            {r}
                        </span>
                    ))}
                    <button style={{
                        padding: '5px 16px',
                        background: 'none',
                        border: '1px dashed #94A3B8',
                        borderRadius: 20,
                        fontSize: 12, color: '#64748B', cursor: 'pointer',
                    }}>
                        + Add
                    </button>
                </div>
            </div>

            {/* Permissions grid */}
            <div className="ad-form-grid" style={{ gap: 32 }}>
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 14, letterSpacing: 0.5 }}>
                        MODULE PERMISSION
                    </div>
                    {MODULE_PERMS.map((p) => (
                        <Checkbox key={p.label} label={p.label} defaultChecked={p.checked} />
                    ))}
                </div>
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 14, letterSpacing: 0.5 }}>
                        CLAIM TYPES ACCESSIBILE
                    </div>
                    {CLAIM_TYPES.map((p) => (
                        <Checkbox key={p.label} label={p.label} defaultChecked={p.checked} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════
//  Section content map
// ════════════════════════════════════════════════════════════════════════
const SECTION_FORMS = [
    <CompanyDetailsForm key="1" />,
    <PrimaryAdminForm key="2" />,
    <BrandingForm key="3" />,
    <AccessLifecycleForm key="4" />,
    <RoleHierarchyForm key="5" />,
    <SubUserCreationForm key="6" />,
];

const SECTION_RIGHT_LABELS = [null, null, null, 'PLATFORM: WEB ONLY', null, null];

// ════════════════════════════════════════════════════════════════════════
//  Main InsurerPage
// ════════════════════════════════════════════════════════════════════════
const InsurerPage = () => {
    const [activeStep, setActiveStep] = useState(1);

    const handleContinue = () => {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length));
    };

    return (
        <div className="ad-page-padding" style={{ padding: '28px 36px', minHeight: '100%', background: '#fff' }}>
            {/* Page title + Continue button */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                marginBottom: 32,
            }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    INSURER&nbsp;&nbsp;Survey &amp; Claims System
                </h1>
                <button
                    onClick={handleContinue}
                    style={{
                        padding: '10px 30px',
                        background: BLUE,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: 0.3,
                    }}
                >
                    Continue
                </button>
            </div>

            {/* Two-column layout -- stacks on tablet/mobile (see .ad-page-flex) */}
            <div className="ad-page-flex">
                {/* ── Left: step list ─────────────────────────────────── */}
                <div className="ad-step-rail" style={{ width: 210, flexShrink: 0, paddingTop: 4 }}>
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
                                    marginBottom: 22, cursor: 'pointer',
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
                                    rightLabel={isActive ? SECTION_RIGHT_LABELS[idx] : null}
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

export default InsurerPage;
