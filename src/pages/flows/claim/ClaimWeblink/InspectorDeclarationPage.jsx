import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../../components/common/AppHeader';
import { COLORS } from '../../../../constants/theme';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { ROUTES } from './routes';

const InspectorDeclarationPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
            <div style={{ padding: '40px 20px' }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827', textAlign: 'center', letterSpacing: '0.06em', marginBottom: 32 }}>
                    INSPECTOR DECLARATION
                </h1>
                <p
                    style={{
                        fontSize: 15,
                        lineHeight: 1.8,
                        color: '#1F2937',
                        textAlign: 'left',
                        margin: 0,
                    }}
                >
                    I hereby confirm that I have conducted the pre-inspection of the vehicle and personally captured the submitted photos/videos. The images/videos are genuine, captured at the stated location and time, and accurately represent the current condition concealed, altered, or misrepresented any visible damages. I understand that any false declaration or manipulation may lead to rejection of the inspection, blacklisting, and/or legal action.
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 14, color: '#374151' }}>I Agree</span>
                </label>
                <button
                    type="button"
                    onClick={() => { try { sessionStorage.setItem('decl_inspector', '1'); } catch { /* ignore */ } navigate(ROUTES.VEHICLE_INFORMATION); }}
                    disabled={!agreed}
                    style={{
                        marginTop: 32,
                        width: '100%',
                        padding: '14px 0',
                        background: agreed ? '#0EA5E9' : '#93C5FD',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: agreed ? 'pointer' : 'not-allowed',
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default InspectorDeclarationPage;
