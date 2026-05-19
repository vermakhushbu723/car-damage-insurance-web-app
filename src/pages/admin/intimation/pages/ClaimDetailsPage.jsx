import React from 'react';
import MetricCard from '../components/MetricCard';
import FilterBar from '../components/FilterBar';

const DocListIcon = ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
const ClockIcon = ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const CheckCircleIcon = ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const HourglassIcon = ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" /><path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
);

const ActionBtn = ({ children, title }) => (
    <button title={title} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        {children}
    </button>
);
const EyeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
);

const ROWS = Array(8).fill({
    claimNo: 'C1234567891F8B',
    policyNo: 'P00025468795FD',
    insuredName: 'AMIN AYUB',
    claimHandler: 'Prashant kulkarni',
    sumInsured: '7500000',
    lossDate: '06-07-2025, 15:43',
    riskRating: 'Ok',
    status: 'Open',
});

const TH = ({ children }) => (
    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{children}</th>
);
const TD = ({ children, style }) => (
    <td style={{ padding: '14px 14px', fontSize: 12, color: '#374151', verticalAlign: 'middle', ...style }}>{children}</td>
);

const ClaimDetailsPage = () => (
    <main style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Details of Claim</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>Manage and view comprehensive claim details</p>
            </div>
            <button style={{ padding: '10px 20px', background: '#1140C7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(17,64,199,0.3)' }}>
                + Create New Claim
            </button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <MetricCard title="Total Claims" value="03" iconBg="#EFF6FF" iconBorderColor="#BFDBFE" icon={<DocListIcon color="#3B82F6" />} sparkVariant="blue" />
            <MetricCard title="Open" value="01" iconBg="#FEF3C7" iconBorderColor="#FDE68A" icon={<ClockIcon color="#F59E0B" />} sparkVariant="orange" />
            <MetricCard title="In Progress" value="01" iconBg="#ECFDF5" iconBorderColor="#A7F3D0" icon={<CheckCircleIcon color="#10B981" />} sparkVariant="green" />
            <MetricCard title="Closed" value="01" iconBg="#F5F3FF" iconBorderColor="#DDD6FE" icon={<HourglassIcon color="#8B5CF6" />} sparkVariant="purple" />
        </div>

        <FilterBar searchPlaceholder="Search by Name,Code,Office" />

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
                    <thead>
                        <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                            <TH>Claim No</TH><TH>Policy No</TH><TH>Insured Name</TH>
                            <TH>Claim Handler</TH><TH>Sum Insured</TH><TH>Loss Date</TH>
                            <TH>Risk Rating</TH><TH>Status</TH><TH>Action</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i < ROWS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                <TD style={{ fontWeight: 600, color: '#111827', fontSize: 11 }}>{row.claimNo}</TD>
                                <TD style={{ fontSize: 11 }}>{row.policyNo}</TD>
                                <TD style={{ fontWeight: 600, color: '#111827' }}>{row.insuredName}</TD>
                                <TD>{row.claimHandler}</TD>
                                <TD style={{ fontWeight: 600 }}>₹ {row.sumInsured}</TD>
                                <TD>{row.lossDate}</TD>
                                <TD>{row.riskRating}</TD>
                                <TD>{row.status}</TD>
                                <TD>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <ActionBtn title="View"><EyeIcon /></ActionBtn>
                                        <ActionBtn title="Edit"><EditIcon /></ActionBtn>
                                        <ActionBtn title="Delete"><TrashIcon /></ActionBtn>
                                    </div>
                                </TD>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
);

export default ClaimDetailsPage;
