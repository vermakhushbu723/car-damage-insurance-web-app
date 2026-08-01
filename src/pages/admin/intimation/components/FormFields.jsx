import React, { useEffect, useRef, useState } from 'react';
import { PALETTE } from '../../adminTheme';

// Shared building blocks for the multi-section detail forms (Intimation,
// Handler, Claim Details, ...) — one numbered "SectionCard" per step, laid
// out as a 2-column field grid, matching the Figma design system used
// across the intimation flow.

export const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 6,
    border: `1px solid ${PALETTE.cardBorder}`, background: '#F3F4F6',
    fontSize: 13, color: PALETTE.body, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
};

export const labelStyle = {
    fontSize: 12, fontWeight: 700, color: PALETTE.primaryBlue, marginBottom: 6, display: 'block',
};

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconAdorned = ({ icon, children }) => (
    <div style={{ position: 'relative' }}>
        {children}
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
            {icon}
        </span>
    </div>
);

export const SectionCard = ({ number, title, children }) => (
    <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 20, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{
                width: 26, height: 26, borderRadius: '50%', background: PALETTE.primaryBlue, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
                {number}
            </span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PALETTE.body }}>{title}</h2>
        </div>
        <div className="im-form-grid">
            {children}
        </div>
    </div>
);

export const Field = ({ label, full, children }) => (
    <div style={full ? { gridColumn: '1 / -1' } : undefined}>
        <label style={labelStyle}>{label}</label>
        {children}
    </div>
);

export const TextField = ({ value, onChange, placeholder, type = 'text' }) => (
    <input type={type} style={inputStyle} value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />
);

// Native date/time inputs -- clicking anywhere in the field forces the
// browser's real calendar / time picker open (showPicker(), not just
// relying on the tiny native icon), and typing is validated to an actual
// date/time instead of free text.
const openPicker = (e) => { try { e.target.showPicker?.(); } catch { /* unsupported browser -- native icon still works */ } };

export const DateField = ({ value, onChange }) => (
    <input type="date" style={inputStyle} value={value || ''} onChange={(e) => onChange?.(e.target.value)} onClick={openPicker} onFocus={openPicker} />
);

export const TimeField = ({ value, onChange }) => (
    <input type="time" style={inputStyle} value={value || ''} onChange={(e) => onChange?.(e.target.value)} onClick={openPicker} onFocus={openPicker} />
);

export const SearchField = ({ value, onChange, placeholder }) => (
    <IconAdorned icon={<SearchIcon />}>
        <input type="text" style={{ ...inputStyle, paddingRight: 34 }} value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />
    </IconAdorned>
);

// Custom dropdown, not a native <select> -- native select popups are
// rendered by the OS/browser and can pop open wider than (or misaligned
// with) the field on some mobile browsers, which looked broken. This one
// is a plain positioned div, so the menu always matches the field's own
// width exactly at every screen size.
//
// `options` accepts either plain strings (["Motor", "Health"]) or
// {value, label} objects (for when the stored value and displayed text
// differ, e.g. vehicle type codes) -- both are normalized the same way.
export const SelectField = ({ value, onChange, options = [], placeholder = 'Select Type', disabled = false, compact = false }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onDocPointerDown = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDocPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const normalized = options.map((opt) => (typeof opt === 'object' && opt !== null ? opt : { value: opt, label: opt }));
    const selected = normalized.find((opt) => opt.value === value);
    const choose = (optValue) => { if (disabled) return; onChange?.(optValue); setOpen(false); };
    const triggerStyle = compact ? { ...inputStyle, padding: '4px 8px' } : inputStyle;

    return (
        <div ref={rootRef} style={{ position: 'relative' }}>
            <button
                type="button"
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); if (!disabled) setOpen((o) => !o); }}
                style={{
                    ...triggerStyle, paddingRight: 30, textAlign: 'left',
                    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    color: selected ? PALETTE.body : '#6B7280',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected ? selected.label : placeholder}</span>
                <span style={{ flexShrink: 0, display: 'flex', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s ease' }}>
                    <ChevronIcon />
                </span>
            </button>
            {open && !disabled && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8,
                        boxShadow: '0 10px 30px rgba(15,23,42,0.18)', zIndex: 60,
                        maxHeight: 220, overflowY: 'auto', padding: 4,
                    }}
                >
                    <div
                        onClick={() => choose('')}
                        style={{ padding: '8px 10px', borderRadius: 6, fontSize: 13, color: '#9CA3AF', cursor: 'pointer', background: !value ? '#F1F5F9' : 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = !value ? '#F1F5F9' : 'transparent'; }}
                    >
                        {placeholder}
                    </div>
                    {normalized.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => choose(opt.value)}
                            style={{ padding: '8px 10px', borderRadius: 6, fontSize: 13, color: PALETTE.body, cursor: 'pointer', fontWeight: value === opt.value ? 700 : 400, background: value === opt.value ? '#EFF6FF' : 'transparent' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = value === opt.value ? '#EFF6FF' : 'transparent'; }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const TextAreaField = ({ value, onChange, placeholder, rows = 4 }) => (
    <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: rows * 22 }}
        rows={rows} value={value} placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
    />
);

export const RadioYesNo = ({ name, value, onChange }) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', height: 40 }}>
        {['Yes', 'No'].map((opt) => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: PALETTE.body, cursor: 'pointer' }}>
                <input type="radio" name={name} checked={value === opt} onChange={() => onChange?.(opt)} />
                {opt}
            </label>
        ))}
    </div>
);
