import React, { useState } from 'react';
import { PALETTE } from '../../adminTheme';

const RcCopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" />
    </svg>
);

// Mock OCR/extraction output for a vehicle RC copy -- there's no real OCR
// backend wired up yet (see ai-damage-assessment-service/docs/ARCHITECTURE.md
// for how that would eventually work), so this is what a real extraction
// would plausibly return, letting the "Fill Form" button genuinely populate
// whichever of these fields exist on the page it's used from.
export const MOCK_RC_EXTRACTED_DATA = {
    ownerName: 'Amit Verma',
    vehicleRegNumber: 'MP04AB1234',
    make: 'Maruti Suzuki',
    model: 'Swift',
    engineNumber: 'MLMI95948787AHUFIE',
    chassisNumber: 'CHS01234567890',
    registrationDate: '2021-01-12',
};

const EXTRACTED_FIELD_LABELS = {
    ownerName: 'Owner Name', vehicleRegNumber: 'Vehicle Reg Number', make: 'Make', model: 'Model',
    engineNumber: 'Engine Number', chassisNumber: 'Chassis Number', registrationDate: 'Registration Date',
};

const ExtractFillModal = ({ docLabel, onClose, onFill }) => (
    <div
        onClick={onClose}
        style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
    >
        <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, width: 480, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${PALETTE.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PALETTE.body }}>{docLabel} — Extracted Data</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: PALETTE.muted, lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ padding: 20 }}>
                <div style={{
                    background: '#F3F6FB', border: `1px dashed ${PALETTE.cardBorder}`, borderRadius: 8,
                    padding: '28px 16px', textAlign: 'center', marginBottom: 18,
                }}>
                    <RcCopyIcon />
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: PALETTE.muted }}>{docLabel} preview (scanned document)</p>
                </div>

                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 800, color: PALETTE.muted, letterSpacing: 0.4 }}>
                    FIELDS DETECTED
                </p>
                {Object.entries(MOCK_RC_EXTRACTED_DATA).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${PALETTE.borderLight}`, fontSize: 13 }}>
                        <span style={{ color: PALETTE.muted }}>{EXTRACTED_FIELD_LABELS[key]}</span>
                        <span style={{ fontWeight: 700, color: PALETTE.body }}>{value}</span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '14px 20px', borderTop: `1px solid ${PALETTE.cardBorder}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 6, border: `1px solid ${PALETTE.cardBorder}`, background: '#fff', color: PALETTE.muted, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    Close
                </button>
                <button
                    onClick={() => { onFill?.(MOCK_RC_EXTRACTED_DATA); onClose(); }}
                    style={{ padding: '9px 18px', borderRadius: 6, border: 'none', background: PALETTE.primaryBlue, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                    Fill Form
                </button>
            </div>
        </div>
    </div>
);

const DocRow = ({ label, onExtractFill }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '10px 12px', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 6, marginBottom: 8,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RcCopyIcon />
            <span style={{ fontSize: 12, fontWeight: 600, color: PALETTE.body }}>{label}</span>
        </div>
        <button
            onClick={onExtractFill}
            style={{ fontSize: 11, fontWeight: 700, color: PALETTE.primaryBlue, background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}
        >
            Extract - Fill
        </button>
    </div>
);

/**
 * Right-hand "Document Management (DMS)" panel shown alongside the
 * multi-section forms (Intimation, Handler, Claim Details, ...) — flags
 * which uploaded documents are relevant to the stage the handler is on.
 * "Extract - Fill" opens a preview of the (mock-)extracted document data;
 * "Fill Form" pushes it into the page's form via `onExtractFill`, when the
 * page supplies one.
 */
const DocumentManagementPanel = ({
    stageName = 'Claim Details',
    relevantCount = 2,
    relevantDocs = ['RC Copy', 'RC Copy'],
    otherDocs = ['RC Copy', 'RC Copy', 'RC Copy', 'RC Copy', 'RC Copy', 'RC Copy', 'RC Copy', 'RC Copy', 'RC Copy'],
    onExtractFill,
}) => {
    const [openDoc, setOpenDoc] = useState(null);

    return (
        <div className="im-dms-panel" style={{
            background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8,
            padding: 18, width: 260, minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', flexShrink: 0, alignSelf: 'flex-start',
        }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PALETTE.body }}>Document Management(DMS)</h2>
            <p style={{ margin: '6px 0 16px', fontSize: 11, color: PALETTE.muted, lineHeight: 1.5 }}>
                {relevantCount} Documents Flagged As Relevant To &ldquo;{stageName}&rdquo;
            </p>

            <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: PALETTE.muted, letterSpacing: 0.4 }}>
                RELEVANT TO THIS STAGE
            </p>
            {relevantDocs.map((label, i) => (
                <DocRow key={`rel-${i}`} label={label} onExtractFill={() => setOpenDoc(`${label} (relevant #${i + 1})`)} />
            ))}

            <p style={{ margin: '12px 0 8px', fontSize: 10, fontWeight: 800, color: PALETTE.muted, letterSpacing: 0.4 }}>
                OTHER DOCUMENTS
            </p>
            {otherDocs.map((label, i) => (
                <DocRow key={`other-${i}`} label={label} onExtractFill={() => setOpenDoc(`${label} (other #${i + 1})`)} />
            ))}

            {openDoc && (
                <ExtractFillModal docLabel={openDoc} onClose={() => setOpenDoc(null)} onFill={onExtractFill} />
            )}
        </div>
    );
};

export default DocumentManagementPanel;
