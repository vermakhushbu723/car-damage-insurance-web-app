import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';

const SubmittedPage = () => {
    usePageLoading();
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                background: COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 20,
                    padding: '40px 28px 32px',
                    width: '100%',
                    maxWidth: 340,
                    textAlign: 'center',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                }}
            >
                {/* Green checkmark circle */}
                <div
                    style={{
                        width: 72, height: 72,
                        borderRadius: '50%',
                        background: '#22C55E',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
                    }}
                >
                    <FaCheck style={{ color: '#fff', fontSize: 32, lineHeight: 1 }} />
                </div>

                {/* Title */}
                <h2 style={{ fontWeight: 900, fontSize: 26, color: COLORS.textPrimary, marginBottom: 16, letterSpacing: 1 }}>
                    SUBMITTED
                </h2>

                {/* Message */}
                <p style={{ fontSize: 15, color: COLORS.textPrimary, lineHeight: 1.7, marginBottom: 28 }}>
                    This survey Already has<br />
                    Do you want to submit<br />
                    during repair &amp; reinspection<br />
                    Photos &amp; Repair bills
                </p>

                {/* Continue button */}
                <button
                    onClick={() => navigate('/claim-workshop/reinspection-photos')}
                    style={{
                        width: '100%',
                        padding: '15px 0',
                        background: COLORS.btnPrimary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: 0.3,
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SubmittedPage;
