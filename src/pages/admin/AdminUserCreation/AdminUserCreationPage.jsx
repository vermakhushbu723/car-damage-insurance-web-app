import React, { useEffect, useRef, useState } from 'react';
import { PALETTE } from '../adminTheme';

const NAV_BLUE = '#0B2D9B';

const SECTIONS = [
    { id: 1, label: 'Platform' },
    { id: 2, label: 'Role Assignment' },
    { id: 3, label: 'User Profile Details' },
    { id: 4, label: 'Organization' },
    { id: 5, label: 'Account Status' },
];

const inputBase = {
    width: '100%',
    padding: '13px 16px',
    background: '#F3F4F6',
    border: '1.5px solid #E5E7EB',
    borderRadius: 6,
    fontSize: 13,
    color: '#374151',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
};

// ── icons ─────────────────────────────────────────────────────────────
const PhoneIcon = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);
const MonitorIcon = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="18" x2="12" y2="21" />
    </svg>
);
const HeadsetIcon = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1v-7H3z" />
    </svg>
);
const CheckCircleIcon = ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

// ── shared atoms ──────────────────────────────────────────────────────
const Lbl = ({ children }) => (
    <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#111827' }}>{children}</p>
);

const Field = ({ label, children }) => (
    <div>
        {label && <Lbl>{label}</Lbl>}
        {children}
    </div>
);

const TextInput = ({ value, onChange, placeholder, type = 'text' }) => (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} style={inputBase} />
);

const RadioDot = ({ checked, color }) => (
    <span style={{
        width: 18, height: 18, borderRadius: '50%', border: `2px solid ${checked ? color : '#CBD5E1'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff',
    }}>
        {checked && <span style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />}
    </span>
);

const SelectCard = ({ selected, onClick, icon, label, accent = NAV_BLUE }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            flex: '1 1 160px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '24px 16px', borderRadius: 10, cursor: 'pointer', position: 'relative',
            border: `1.5px solid ${selected ? accent : '#E5E7EB'}`,
            background: selected ? `${accent}0D` : '#fff',
            fontFamily: 'inherit',
        }}
    >
        <span style={{ position: 'absolute', top: 12, right: 12 }}>
            <RadioDot checked={selected} color={accent} />
        </span>
        <span style={{
            width: 44, height: 44, borderRadius: '50%', background: selected ? `${accent}1A` : '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon(selected ? accent : '#6B7280')}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? accent : '#374151' }}>{label}</span>
    </button>
);

const SectionCard = ({ innerRef, number, title, subtitle, children }) => (
    <div ref={innerRef} style={{ background: '#fff', border: `1px solid ${PALETTE.borderLight}`, borderRadius: 8, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 3px rgba(15,23,42,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{
                width: 26, height: 26, borderRadius: '50%', background: NAV_BLUE, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
                {number}
            </span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: NAV_BLUE, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {title}
            </h2>
        </div>
        {subtitle && <p style={{ margin: '0 0 18px 36px', fontSize: 12, color: '#6B7280' }}>{subtitle}</p>}
        {children}
    </div>
);

const initialForm = {
    platform: 'omni',
    internal: '', externalInsurer: '',
    userId: '', branchOffice: '', mobileNumber: '', emailAddress: '', setPassword: '',
    businessEntity: '', fullName: '', region: '', stateProvince: '',
    accountStatus: 'active',
};

/**
 * "Internal User Creation" -- matches the client's reference design
 * exactly: a single scrolling page with all 5 sections visible at once
 * (not an accordion/wizard), a left step rail that tracks scroll position
 * and jumps to a section on click, and a "Create Now" submit at the end.
 */
const AdminUserCreationPage = () => {
    const [form, setForm] = useState(initialForm);
    const [activeSection, setActiveSection] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const sectionRefs = useRef([]);

    const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) {
                    const idx = sectionRefs.current.indexOf(visible[0].target);
                    if (idx !== -1) setActiveSection(idx + 1);
                }
            },
            { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        sectionRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        sectionRefs.current[id - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCreate = () => {
        setSubmitted(true);
        window.setTimeout(() => setSubmitted(false), 3500);
    };

    return (
        <main className="admin-page">
            <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color: PALETTE.primaryBlue }}>As SaaS</h1>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#374151', fontWeight: 600 }}>
                Setup a new user with secure access to the motor insurance platform
            </p>

            {submitted && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: '#ECFDF5', border: '1px solid #A7F3D0',
                    color: '#047857', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, fontWeight: 600,
                }}>
                    <CheckCircleIcon color="#047857" /> User created successfully.
                </div>
            )}

            <div className="ad-page-flex">
                {/* ── Left: step rail ──────────────────────────────────── */}
                <div className="ad-step-rail" style={{ width: 200, flexShrink: 0, paddingTop: 4, position: 'sticky', top: 4, alignSelf: 'flex-start' }}>
                    {SECTIONS.map((s) => {
                        const isActive = s.id === activeSection;
                        return (
                            <div
                                key={s.id}
                                onClick={() => scrollToSection(s.id)}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 22, cursor: 'pointer' }}
                            >
                                <span style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    background: isActive ? NAV_BLUE : 'transparent',
                                    border: `2px solid ${isActive ? NAV_BLUE : '#CBD5E1'}`,
                                    color: isActive ? '#fff' : '#94A3B8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                                }}>
                                    {s.id}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? NAV_BLUE : '#94A3B8', lineHeight: 1.4, paddingTop: 3, whiteSpace: 'nowrap' }}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Right: all sections, always visible ──────────────── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SectionCard innerRef={(el) => { sectionRefs.current[0] = el; }} number={1} title="Platform" subtitle="Enter The basic information of employee">
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <SelectCard selected={form.platform === 'mobile'} onClick={() => set('platform')('mobile')} icon={(c) => <PhoneIcon color={c} />} label="Mob Application" />
                            <SelectCard selected={form.platform === 'web'} onClick={() => set('platform')('web')} icon={(c) => <MonitorIcon color={c} />} label="Web Portal" />
                            <SelectCard selected={form.platform === 'omni'} onClick={() => set('platform')('omni')} icon={(c) => <HeadsetIcon color={c} />} label="Omni-Channel (Both)" />
                        </div>
                    </SectionCard>

                    <SectionCard innerRef={(el) => { sectionRefs.current[1] = el; }} number={2} title="Role Assignment" subtitle="Enter The basic information of employee">
                        <div className="ad-form-grid" style={{ gap: 16 }}>
                            <Field label="Internal"><TextInput value={form.internal} onChange={set('internal')} placeholder="Eg. MS_1234567890" /></Field>
                            <Field label="External - Insurer"><TextInput value={form.externalInsurer} onChange={set('externalInsurer')} placeholder="Enter Employee Name" /></Field>
                        </div>
                    </SectionCard>

                    <SectionCard innerRef={(el) => { sectionRefs.current[2] = el; }} number={3} title="User Profile Details" subtitle="Assign role,level & reporting manager">
                        <div className="ad-form-grid" style={{ gap: 16, marginBottom: 16 }}>
                            <Field label="User ID"><TextInput value={form.userId} onChange={set('userId')} placeholder="Eg. MS_1234567890" /></Field>
                            <Field label="Branch/Office"><TextInput value={form.branchOffice} onChange={set('branchOffice')} placeholder="Enter Employee Name" /></Field>
                            <Field label="Mobile Number"><TextInput value={form.mobileNumber} onChange={set('mobileNumber')} placeholder="+91 1234567890" /></Field>
                            <Field label="Email Address"><TextInput value={form.emailAddress} onChange={set('emailAddress')} placeholder="Enter Employee Name" type="email" /></Field>
                        </div>
                        <div style={{ maxWidth: 460 }}>
                            <Field label="Set Password"><TextInput value={form.setPassword} onChange={set('setPassword')} placeholder="Set Password" type="password" /></Field>
                        </div>
                    </SectionCard>

                    <SectionCard innerRef={(el) => { sectionRefs.current[3] = el; }} number={4} title="Organization" subtitle="Assign role,level & reporting manager">
                        <div className="ad-form-grid" style={{ gap: 16 }}>
                            <Field label="Business Entity"><TextInput value={form.businessEntity} onChange={set('businessEntity')} placeholder="Architectural Savvy" /></Field>
                            <Field label="Full Name"><TextInput value={form.fullName} onChange={set('fullName')} placeholder="Metropolitan HQ" /></Field>
                            <Field label="Region"><TextInput value={form.region} onChange={set('region')} placeholder="India" /></Field>
                            <Field label="State/Province"><TextInput value={form.stateProvince} onChange={set('stateProvince')} placeholder="Maharashtra" /></Field>
                        </div>
                    </SectionCard>

                    <SectionCard innerRef={(el) => { sectionRefs.current[4] = el; }} number={5} title="Account Status" subtitle="Assign role,level & reporting manager">
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={() => set('accountStatus')('active')}
                                style={{
                                    flex: '1 1 260px', maxWidth: 340, display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '14px 18px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                                    border: `1.5px solid ${form.accountStatus === 'active' ? '#10B981' : '#E5E7EB'}`,
                                    background: form.accountStatus === 'active' ? '#ECFDF5' : '#fff',
                                }}
                            >
                                <RadioDot checked={form.accountStatus === 'active'} color="#10B981" />
                                <span>
                                    <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#111827' }}>Active</span>
                                    <span style={{ display: 'block', fontSize: 11, color: '#6B7280' }}>Users Can Access The System</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => set('accountStatus')('inactive')}
                                style={{
                                    flex: '1 1 260px', maxWidth: 340, display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '14px 18px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                                    border: `1.5px solid ${form.accountStatus === 'inactive' ? '#94A3B8' : '#E5E7EB'}`,
                                    background: form.accountStatus === 'inactive' ? '#F1F5F9' : '#fff',
                                }}
                            >
                                <RadioDot checked={form.accountStatus === 'inactive'} color="#64748B" />
                                <span>
                                    <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#111827' }}>Inactive</span>
                                    <span style={{ display: 'block', fontSize: 11, color: '#6B7280' }}>Access Restricted</span>
                                </span>
                            </button>
                        </div>
                    </SectionCard>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                        <button
                            onClick={handleCreate}
                            style={{
                                padding: '12px 36px', background: NAV_BLUE, color: '#fff',
                                border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(11,45,155,0.25)',
                            }}
                        >
                            Create Now
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminUserCreationPage;
