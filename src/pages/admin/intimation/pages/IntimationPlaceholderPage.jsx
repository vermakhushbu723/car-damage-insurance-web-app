import React from 'react';

/** Generic placeholder for ILA, Settlement, FLA, Recommendation, DMS pages */
const IntimationPlaceholderPage = ({ title, subtitle }) => (
    <main style={{ padding: '20px 24px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#111827' }}>{title}</h1>
        {subtitle && <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6B7280' }}>{subtitle}</p>}
        <div style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
            padding: '36px 28px', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        }}>
            <h2 style={{ margin: 0, color: '#111827', fontSize: 18, fontWeight: 700 }}>Page in progress</h2>
            <p style={{ margin: '10px 0 0', color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                {title} section ka structure ready hai. Next step me full UI same design language me build kar dete hain.
            </p>
        </div>
    </main>
);

export default IntimationPlaceholderPage;
