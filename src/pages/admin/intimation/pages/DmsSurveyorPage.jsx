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
        label: 'AML_KYC DOC', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        )
    },
    {
        label: 'RC Copy-Tax', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        )
    },
    {
        label: 'Claim Form', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        )
    },
    {
        label: 'Driving Licence', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="12" r="2" />
                <line x1="13" y1="10" x2="18" y2="10" /><line x1="13" y1="14" x2="18" y2="14" />
            </svg>
        )
    },
    {
        label: 'FIR', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        )
    },
    {
        label: 'Estimate Of Repair', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        )
    },
    {
        label: 'Photo', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        )
    },
    {
        label: 'Repair Bills', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
        )
    },
    {
        label: 'Others', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
        )
    },
    {
        label: 'Fitness Certificate', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
        )
    },
    {
        label: 'Permit Copy', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
        )
    },
    {
        label: 'Load Challan', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        )
    },
    {
        label: 'Towing Bill', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
        )
    },
    {
        label: 'FLA Copy', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        )
    },
    {
        label: 'Estimate Of Repair', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        )
    },
    {
        label: 'Investigation Report', icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1454D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        )
    },
];

const DmsSurveyorPage = () => (
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

        {/* DMS Surveyor Document Grid */}
        <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 16 }}>Document Management System - Surveyor</h2>
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
                        transition: 'box-shadow 0.15s',
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

export default DmsSurveyorPage;
