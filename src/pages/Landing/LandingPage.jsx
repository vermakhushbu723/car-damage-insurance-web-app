import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

const menuItems = [
    {
        label: 'CLAIM-WORKSHOP LOGIN',
        route: ROUTES.CLAIM_WORKSHOP_LOGIN,
        bg: 'linear-gradient(135deg, #E07B39 0%, #c95f1e 100%)',
        shadow: 'rgba(224,123,57,0.45)',
        icon: '🔧',
        available: true,
    },
    {
        label: 'CLAIM-SURVEYOR LOGIN',
        route: ROUTES.CLAIM_SURVEYOR_LOGIN,
        bg: 'linear-gradient(135deg, #01A0FE 0%, #0077cc 100%)',
        shadow: 'rgba(1,160,254,0.45)',
        icon: '🔍',
        available: false,
    },
    {
        label: 'CLAIM-WEBLINK',
        route: ROUTES.CLAIM_WEBLINK,
        bg: 'linear-gradient(135deg, #22C55E 0%, #15803d 100%)',
        shadow: 'rgba(34,197,94,0.45)',
        icon: '🔗',
        available: false,
    },
    {
        label: 'PREINSPECTION-AGENT LOGIN',
        route: ROUTES.PREINSPECTION_AGENT_LOGIN,
        bg: 'linear-gradient(135deg, #4F46E5 0%, #3730a3 100%)',
        shadow: 'rgba(79,70,229,0.45)',
        icon: '👤',
        available: false,
    },
    {
        label: 'PREINSPECTION-SURVEYOR LOGIN WORKSHOP',
        route: ROUTES.PREINSPECTION_SURVEYOR_LOGIN,
        bg: 'linear-gradient(135deg, #A855F7 0%, #7e22ce 100%)',
        shadow: 'rgba(168,85,247,0.45)',
        icon: '🏢',
        available: false,
    },
    {
        label: 'PREINSPECTION-WEBLINK',
        route: ROUTES.PREINSPECTION_WEBLINK,
        bg: 'linear-gradient(135deg, #F59E0B 0%, #b45309 100%)',
        shadow: 'rgba(245,158,11,0.45)',
        icon: '🌐',
        available: false,
    },
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: COLORS.bgApp }}
        >
            <AppHeader />

            {/* Title */}
            <div className="flex flex-col items-center mt-8 mb-6 px-4">
                <h1
                    className="text-white font-bold text-2xl text-center tracking-wide drop-shadow"
                    style={{ letterSpacing: '0.04em' }}
                >
                    Insurance Portal
                </h1>
                <p className="text-white text-sm opacity-80 mt-1 text-center">
                    Select your login type to continue
                </p>
            </div>

            {/* Buttons Grid */}
            <div className="flex-1 flex flex-col items-center px-5 gap-4 pb-10">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => item.available && navigate(item.route)}
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            minHeight: '64px',
                            borderRadius: '14px',
                            background: item.bg,
                            boxShadow: `0 6px 20px ${item.shadow}`,
                            border: 'none',
                            cursor: item.available ? 'pointer' : 'default',
                            position: 'relative',
                            opacity: item.available ? 1 : 0.75,
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseDown={e => item.available && (e.currentTarget.style.transform = 'scale(0.97)')}
                        onMouseUp={e => item.available && (e.currentTarget.style.transform = 'scale(1)')}
                        onTouchStart={e => item.available && (e.currentTarget.style.transform = 'scale(0.97)')}
                        onTouchEnd={e => item.available && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <div className="flex items-center justify-between px-5 w-full">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span
                                    className="text-white font-bold text-left"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.03em' }}
                                >
                                    {item.label}
                                </span>
                            </div>
                            <span className="text-white text-xl opacity-80">›</span>
                        </div>
                        {!item.available && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '12px',
                                    background: 'rgba(0,0,0,0.35)',
                                    color: '#fff',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    borderRadius: '6px',
                                    padding: '2px 7px',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                COMING SOON
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
