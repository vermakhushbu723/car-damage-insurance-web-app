import React from 'react';
import FilterBar from '../components/FilterBar';

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const tableRows = [
    { flaDetails: 'CLM001', settlementType: 'Partial Loss', recDate: '11/01/2022', closureType: 'Payment', invoiceNumber: 'W0309G202200416', invoiceAmount: '₹45817', status: 'CLM001' },
    { flaDetails: 'CLM001', settlementType: 'Partial Loss', recDate: '11/01/2022', closureType: 'Payment', invoiceNumber: 'W0309G202200416', invoiceAmount: '₹45817', status: 'CLM001' },
];

const docItems = [
    {
        label: 'Vehicle Photos', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        )
    },
    {
        label: 'Document Upload', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        )
    },
    {
        label: 'RC Verification', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
        )
    },
    {
        label: 'Insurance Policy', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        )
    },
    {
        label: 'Location Details', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        )
    },
    {
        label: 'Inspection Report', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        )
    },
    {
        label: 'Damage Assess...', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        )
    },
    {
        label: 'Pre-Inspection Ph...', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        )
    },
];

const DmsPreInspectionPage = () => (
    <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1454D1' }}>Dms surveyor<br />Recommendation</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>Manage Loss Approvals and First Loss Assessments</p>
            </div>
            <button style={{ background: '#1454D1', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Add Recommendation
            </button>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Recommendation Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                        {['FLA Details', 'Settlement Type', 'Recommendation Date', 'Closure Type', 'Invoice Number', 'Invoice Amount', 'Status', 'Action'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{row.flaDetails}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.settlementType}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.recDate}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.closureType}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.invoiceNumber}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.invoiceAmount}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.status}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><EyeIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* DMS Pre-Inspection Document Grid */}
        <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 16 }}>Document Management System - Pre-Inspection</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
                {docItems.map((item, i) => (
                    <button key={i} style={{
                        background: '#fff',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: 8,
                        padding: '16px 8px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                        cursor: 'pointer',
                        textAlign: 'center',
                    }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(20,84,209,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                        {item.icon}
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1454D1', lineHeight: 1.3 }}>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    </main>
);

export default DmsPreInspectionPage;
