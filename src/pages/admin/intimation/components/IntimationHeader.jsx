import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const BellIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const HeadphonesIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1v-7H3z" />
    </svg>
);
const UserIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconBtn = ({ children, onClick }) => (
    <button onClick={onClick} style={{
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F1F5F9', border: '1px solid #E2E8F0',
        borderRadius: '50%', cursor: 'pointer',
    }}>
        {children}
    </button>
);

const IntimationHeader = () => {
    const navigate = useNavigate();
    return (
        <header style={{
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            gap: 10,
            background: '#fff',
            borderBottom: '1px solid #E5E7EB',
        }}>
            <IconBtn><BellIcon /></IconBtn>
            <IconBtn><HeadphonesIcon /></IconBtn>
            <IconBtn onClick={() => navigate(ROUTES.ADMIN.SELECT)}><UserIcon /></IconBtn>
        </header>
    );
};

export default IntimationHeader;
