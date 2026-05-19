import React, { useState } from 'react';
import { PALETTE } from '../adminTheme';

// ── step meta ─────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, code: 'ED-AIR' },
    { id: 2, code: 'RA' },
    { id: 3, code: 'GS' },
    { id: 4, code: 'P&A' },
    { id: 5, code: 'MP-RW' },
    { id: 6, code: 'RSEF-NM' },
    { id: 7, code: 'RSEF-RM' },
    { id: 8, code: 'RSEF-SM' },
    { id: 9, code: 'RSEF-CSM/H' },
    { id: 10, code: 'RSEF-CCA' },
];

// ── shared style tokens ───────────────────────────────────────────────
const NAV_BLUE = '#0B2D9B';

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

// ── tiny atoms ────────────────────────────────────────────────────────
const Lbl = ({ children }) => (
    <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#111827' }}>{children}</p>
);

const Field = ({ label, children, style }) => (
    <div style={{ marginBottom: 22, ...style }}>
        {label && <Lbl>{label}</Lbl>}
        {children}
    </div>
);

const TextInput = ({ placeholder, type = 'text' }) => (
    <input type={type} placeholder={placeholder} style={inputBase} />
);

const SelectInput = ({ placeholder, options = [] }) => (
    <div style={{ position: 'relative' }}>
        <select
            defaultValue=""
            style={{ ...inputBase, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 36 }}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280', fontSize: 13 }}>▾</span>
    </div>
);

const Toggle = ({ defaultOn = true }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <div
            role="switch"
            aria-checked={on}
            tabIndex={0}
            onClick={() => setOn(v => !v)}
            onKeyDown={e => e.key === ' ' && setOn(v => !v)}
            style={{
                width: 46, height: 26, borderRadius: 13,
                background: on ? NAV_BLUE : '#D1D5DB',
                position: 'relative', cursor: 'pointer',
                transition: 'background 0.2s', flexShrink: 0, border: 'none', outline: 'none',
                display: 'inline-block',
            }}
        >
            <div style={{
                position: 'absolute', top: 3,
                left: on ? 23 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
        </div>
    );
};

const PermGroup = ({ options }) => {
    const [sel, setSel] = useState(null);
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {options.map(o => (
                <button
                    key={o}
                    onClick={() => setSel(prev => prev === o ? null : o)}
                    style={{
                        padding: '8px 20px', borderRadius: 20,
                        border: `1.5px solid ${sel === o ? NAV_BLUE : '#D1D5DB'}`,
                        background: sel === o ? NAV_BLUE : '#fff',
                        color: sel === o ? '#fff' : '#374151',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    {o}
                </button>
            ))}
        </div>
    );
};

const ModuleRow = ({ title, options }) => (
    <div style={{ marginBottom: 28 }}>
        <Lbl>{title}</Lbl>
        <Toggle defaultOn />
        <PermGroup options={options} />
    </div>
);

const StepHeader = ({ n, title, subtitle }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: NAV_BLUE, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{n}</div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: NAV_BLUE, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {title}
            </h2>
        </div>
        {subtitle && <p style={{ margin: '0 0 0 40px', fontSize: 12, color: '#6B7280' }}>{subtitle}</p>}
    </div>
);

// ── Step panels ───────────────────────────────────────────────────────
const Step1 = () => (
    <div>
        <StepHeader n={1} title="ED-AIR (EMPLOYEE DETAILS)" subtitle="Enter The basic information of employee" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Full Name"><TextInput placeholder="Eg. MS_1234567890" /></Field>
            <Field label="Employee ID"><TextInput placeholder="Enter Employee Name" /></Field>
            <Field label="Mobile Number"><TextInput placeholder="+91 1234567890" /></Field>
            <Field label="Official Email Address"><TextInput placeholder="FullName@gmail.com" type="email" /></Field>
            <Field label="Alternet Mobile Number"><TextInput placeholder="+91 1234567890" /></Field>
            <Field label="Date Of Joining"><TextInput placeholder="mm/dd/yyyy" type="date" /></Field>
            <Field label="Department">
                <SelectInput placeholder="Claim Operations" options={['Claim Operations', 'Finance', 'Tech', 'Operations', 'HR']} />
            </Field>
            {/* Photo upload */}
            <div>
                <Lbl>&nbsp;</Lbl>
                <div style={{ width: 164, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', display: 'inline-block' }}>
                    <div style={{ background: '#F9FAFB', padding: '20px 0', textAlign: 'center' }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            border: '2px solid #D1D5DB', background: '#F3F4F6',
                            margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    </div>
                    <button style={{
                        width: '100%', padding: '10px 0', background: NAV_BLUE,
                        color: '#fff', border: 'none', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontFamily: 'inherit',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload Photo
                    </button>
                    <p style={{ fontSize: 10, color: '#9CA3AF', margin: '6px 8px 8px', textAlign: 'center' }}>PNG, JPG or JPEG (max.2MB)</p>
                </div>
            </div>
        </div>
    </div>
);

const Step2 = () => (
    <div>
        <StepHeader n={2} title="RA (ROLE ASSIGNMENT)" subtitle="Assign role,level & reporting manager" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Role"><TextInput placeholder="Eg. MS_1234567890" /></Field>
            <Field label="Role Level"><TextInput placeholder="Enter Employee Name" /></Field>
        </div>
        <div style={{ maxWidth: 460 }}>
            <Field label="Reporting Manager">
                <SelectInput placeholder="Claim Operations" options={['Claim Operations', 'Manager A', 'Manager B', 'Manager C']} />
            </Field>
        </div>
    </div>
);

const Step3 = () => (
    <div>
        <StepHeader n={3} title="GS (GEOGRAPHY SCOPE)" subtitle="Define the geography access for this users" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Zone">
                <SelectInput placeholder="Zone" options={['North', 'South', 'East', 'West', 'Central']} />
            </Field>
            <Field label="State"><TextInput placeholder="State" /></Field>
        </div>
        <div style={{ maxWidth: 460 }}>
            <Field label="City/village">
                <SelectInput placeholder="Claim Operations" options={['Mumbai', 'Delhi', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad']} />
            </Field>
        </div>
    </div>
);

const Step4 = () => (
    <div>
        <StepHeader n={4} title="P & A (PLATFORM & ACCESS)" subtitle="set platform access, account status & credentials" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Platform Access">
                <SelectInput placeholder="Zone" options={['Web', 'Mobile', 'Both']} />
            </Field>
            <Field label="Effective From Date"><TextInput placeholder="State" type="date" /></Field>
            <Field label="Account Status">
                <SelectInput placeholder="Claim Operations" options={['Active', 'Inactive', 'Pending']} />
            </Field>
            <Field label="Temp Password">
                <SelectInput placeholder="Claim Operations" options={['Auto Generate', 'Manual Set']} />
            </Field>
        </div>
    </div>
);

const Step5 = () => (
    <div>
        <StepHeader n={5} title="MP-RW (MODULE PERMISSIONS — ROLE WISE)" subtitle="configure module-level permission & access rights" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            <ModuleRow title="Claim Management" options={['View', 'Handle', 'Approve', 'Full']} />
            <ModuleRow title="Pre-inspection reports" options={['None', 'View', 'Generate', 'Full']} />
            <ModuleRow title="Survey tracking" options={['None', 'View', 'Assign', 'Full']} />
            <ModuleRow title="Insurer / Broker management" options={['None', 'View', 'Manage', 'Full']} />
            <div style={{ marginBottom: 28 }}>
                <Lbl>User management</Lbl>
                <Toggle defaultOn />
                <PermGroup options={['None', 'Own Team', 'State', 'Regional', 'Full']} />
            </div>
            <ModuleRow title="Reports & MIS" options={['None', 'View', 'Export', 'Full']} />
        </div>
    </div>
);

const Step6 = () => (
    <div>
        <StepHeader n={6} title="RSEF-NM (ROLE-SPECIFIC EXTRA FIELDS — NATIONAL MANAGER)" subtitle="configure module-level permission & access rights" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Designation"><TextInput placeholder="Designation" /></Field>
            <Field label="Scope"><TextInput placeholder="Scope" /></Field>
        </div>
    </div>
);

const Step7 = () => (
    <div>
        <StepHeader n={7} title="ROLE-SPECIFIC EXTRA FIELDS — REGIONAL MANAGER" subtitle="configure module-level permission & access rights" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Designation"><TextInput placeholder="Designation" /></Field>
            <Field label="Region name"><TextInput placeholder="Region name" /></Field>
        </div>
        <Field label="States covered">
            <PermGroup options={['None', 'View', 'Generate', 'Full']} />
        </Field>
    </div>
);

const Step8 = () => (
    <div>
        <StepHeader n={8} title="ROLE-SPECIFIC EXTRA FIELDS — STATE MANAGER" subtitle="configure module-level permission & access rights" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Designation"><TextInput placeholder="Designation" /></Field>
            <Field label="State assigned">
                <SelectInput placeholder="State Assigned" options={['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu']} />
            </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Surveyor coordination access"><Toggle defaultOn /></Field>
            <Field label="Workshop coordination access"><Toggle defaultOn /></Field>
        </div>
    </div>
);

const Step9 = () => (
    <div>
        <StepHeader n={9} title="ROLE-SPECIFIC EXTRA FIELDS — CSM / HANDLER" subtitle="configure module-level permission & access rights" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            <Field label="Designation"><TextInput placeholder="Designation" /></Field>
            <div style={{ marginBottom: 22 }}>
                <Lbl>Assigned insurer accounts</Lbl>
                <PermGroup options={['None', 'View', 'Generate', 'Full']} />
            </div>
            <div style={{ marginBottom: 22 }}>
                <Lbl>Assigned broker accounts</Lbl>
                <PermGroup options={['None', 'View', 'Generate', 'Full']} />
            </div>
            <Field label="SLA tier">
                <SelectInput placeholder="SLA Tier" options={['Tier 1', 'Tier 2', 'Tier 3']} />
            </Field>
        </div>
        <div style={{ maxWidth: 460, marginTop: 4 }}>
            <Field label="Max open claims (concurrent)">
                <TextInput placeholder="1,2,3,4,5,6" />
            </Field>
        </div>
    </div>
);

const Step10 = () => (
    <div>
        <StepHeader n={10} title="RSEF-CCA (ROLE-SPECIFIC EXTRA FIELDS — CLAIM COORDINATION AGENT)" subtitle="configure claim coordination agent specific fields" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Field label="Designation"><TextInput placeholder="Designation" /></Field>
            <Field label="Agent Code"><TextInput placeholder="Agent Code" /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            <div style={{ marginBottom: 22 }}>
                <Lbl>Claim access level</Lbl>
                <PermGroup options={['None', 'View', 'Process', 'Full']} />
            </div>
            <div style={{ marginBottom: 22 }}>
                <Lbl>Coordination type</Lbl>
                <PermGroup options={['Internal', 'External', 'Both']} />
            </div>
        </div>
        <div style={{ maxWidth: 460 }}>
            <Field label="Max concurrent cases">
                <TextInput placeholder="1,2,3,4,5,6" />
            </Field>
        </div>
    </div>
);

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10];

// ── Stepper ───────────────────────────────────────────────────────────
const Stepper = ({ current, onStepClick }) => (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
        {STEPS.map((step, idx) => {
            const done = step.id < current;
            const active = step.id === current;
            const inactive = step.id > current;
            return (
                <React.Fragment key={step.id}>
                    <button
                        onClick={() => !inactive && onStepClick(step.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            flexShrink: 0, background: 'none', border: 'none',
                            cursor: inactive ? 'default' : 'pointer', padding: '2px 0',
                        }}
                    >
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: inactive ? 'transparent' : NAV_BLUE,
                            border: `2px solid ${inactive ? '#C9CDD8' : NAV_BLUE}`,
                            color: inactive ? '#9CA3AF' : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, flexShrink: 0,
                            transition: 'all 0.15s',
                        }}>
                            {step.id}
                        </div>
                        <span style={{
                            fontSize: 12, fontWeight: active ? 700 : 500,
                            color: inactive ? '#9CA3AF' : '#111827',
                            whiteSpace: 'nowrap',
                        }}>
                            {step.code}
                        </span>
                    </button>
                    {idx < STEPS.length - 1 && (
                        <div style={{
                            flex: '0 0 18px', height: 1.5,
                            background: done ? NAV_BLUE : '#D1D5DB',
                            margin: '0 2px',
                        }} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────
const AdminUserCreationPage = () => {
    const [step, setStep] = useState(1);
    const StepContent = STEP_COMPONENTS[step - 1];
    const isLast = step === STEPS.length;

    return (
        <main className="admin-page">
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: PALETTE.primaryBlue }}>
                        Internal User Creation
                    </h1>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                        Provision new access and deine role-based permission&nbsp;for insure personal
                    </p>
                </div>
                <button
                    onClick={() => isLast ? alert('User created successfully!') : setStep(s => s + 1)}
                    style={{
                        padding: '12px 36px', background: NAV_BLUE, color: '#fff',
                        border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
                        boxShadow: '0 2px 8px rgba(11,45,155,0.25)',
                    }}
                >
                    {isLast ? 'Submit' : 'Continue'}
                </button>
            </div>

            {/* Stepper */}
            <div style={{ borderBottom: '1px solid #E5E7EB', padding: '18px 0 14px', marginBottom: 14 }}>
                <Stepper current={step} onStepClick={setStep} />
            </div>

            {/* Form card */}
            <div style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6,
                padding: '28px 32px', boxShadow: '0 1px 3px rgba(15,23,42,0.07)',
            }}>
                <StepContent />
            </div>
        </main>
    );
};

export default AdminUserCreationPage;
