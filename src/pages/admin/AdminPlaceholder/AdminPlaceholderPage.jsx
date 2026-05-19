import React from 'react';
import { PALETTE } from '../adminTheme';

const AdminPlaceholderPage = ({ title }) => {
    return (
        <main className="admin-page">
            <h1 style={{ margin: '0 0 16px', color: PALETTE.primaryBlue, fontSize: 28, fontWeight: 800 }}>{title}</h1>

            <div
                style={{
                    background: '#FFFFFF',
                    border: `1px solid ${PALETTE.borderLight}`,
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                    padding: '32px 28px',
                    maxWidth: 720,
                }}
            >
                <h2 style={{ margin: 0, color: '#111827', fontSize: 18, fontWeight: 700 }}>Page in progress</h2>
                <p style={{ margin: '10px 0 0', color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
                    {title} section ka structure ready hai. Agar chaho to next prompt me isi design language me is page ka full UI bhi same-to-same build kar deta hoon.
                </p>
            </div>
        </main>
    );
};

export default AdminPlaceholderPage;