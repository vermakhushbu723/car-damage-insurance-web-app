import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/theme';
import captureRefresh from '../../assets/capturerefress.png';
import { ROUTES } from '../../constants/routes';
import BottomButton from '../../components/common/BottomButton';
import { usePageLoading } from '../../hooks/usePageLoading';

const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

const LoginPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('claim');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [captchaText, setCaptchaText] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const [errors, setErrors] = useState({});

    const refreshCaptcha = () => {
        setCaptchaText(generateCaptcha());
        setCaptchaInput('');
    };

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = 'Username is required';
        if (!password.trim()) newErrors.password = 'Password is required';
        if (!captchaInput.trim()) newErrors.captcha = 'Captcha is required';
        else if (captchaInput !== captchaText) newErrors.captcha = 'Captcha does not match';
        return newErrors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            refreshCaptcha();
            return;
        }
        setErrors({});
        navigate(ROUTES.DASHBOARD);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'rgba(218, 240, 254, 1)' }}>
            <AppHeader />
            {/* <div className="w-full" style={{ background: COLORS.primaryDark, height: '8px' }} /> */}
            <div class="login-card">
                <div className="flex gap-4 mt-4 mb-8 justify-center">
                    <button
                        onClick={() => setActiveTab('claim')}
                        className="font-bold text-white text-lg"
                        style={{
                            width: '193px',
                            height: '52px',
                            borderRadius: '7px',
                            padding: '10px',
                            background: '#DB6F37',
                            opacity: 1,
                            boxShadow: activeTab === 'claim' ? '0 4px 14px rgba(224,123,57,0.4)' : 'none',
                        }}
                    >
                        Claim
                    </button>
                    <button
                        onClick={() => setActiveTab('pre-inspection')}
                        className="font-bold text-white text-lg"
                        style={{
                            width: '193px',
                            height: '52px',
                            borderRadius: '7px',
                            padding: '10px',
                            background: '#4643F9',
                            opacity: 1,
                            boxShadow: activeTab === 'pre-inspection' ? '0 4px 14px rgba(79,70,229,0.4)' : 'none',
                        }}
                    >
                        Pre-Inspection
                    </button>
                </div>

                <div className="flex-1 flex flex-col px-5 gap-3 pb-2">
                    <div className="flex items-center gap-3 px-5" style={{ background: COLORS.bgCard, height: '53px', borderRadius: '7px', border: '1px solid #C5C5C5', opacity: 1 }}>
                        <UserOutlined style={{ color: COLORS.primary, fontSize: 22 }} />
                        <input
                            type="text"
                            placeholder="User Name"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                            className="flex-1 outline-none text-base bg-transparent"
                            style={{ color: COLORS.textPrimary }}
                        />
                    </div>
                    {errors.username && <p className="text-xs -mt-3" style={{ color: COLORS.textRed }}>{errors.username}</p>}

                    <div className="flex items-center gap-3 px-5" style={{ background: COLORS.bgCard, height: '53px', borderRadius: '7px', border: '1px solid #C5C5C5', opacity: 1 }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                            className="flex-1 outline-none text-base bg-transparent"
                            style={{ color: COLORS.textPrimary }}
                        />
                        <button onClick={() => setShowPassword(!showPassword)}>
                            {showPassword
                                ? <EyeOutlined style={{ color: COLORS.textSecondary, fontSize: 22 }} />
                                : <img src="/images/icons/passwordicon.png" alt="show password" style={{ width: 22, height: 22, objectFit: 'contain' }} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs -mt-3" style={{ color: COLORS.textRed }}>{errors.password}</p>}

                    <div className="flex items-center gap-4 px-3">
                        <div className="flex items-center gap-1">
                            {captchaText.split('').map((char, i) => (
                                <span key={i} className="font-bold text-2xl select-none" style={{ color: COLORS.textPrimary, fontFamily: 'monospace', letterSpacing: 6, display: 'inline-block', marginRight: 4 }}>
                                    {char}
                                </span>
                            ))}
                        </div>
                        <button onClick={refreshCaptcha} className="ml-2 shrink-0">
                            <img src={captureRefresh} alt="Refresh" className="w-9 h-9 object-contain" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-5" style={{ background: COLORS.bgCard, height: '53px', borderRadius: '7px', border: '1px solid #C5C5C5', opacity: 1 }}>
                        <input
                            type="text"
                            placeholder="Enter Captcha"
                            value={captchaInput}
                            onChange={(e) => { setCaptchaInput(e.target.value); setErrors(p => ({ ...p, captcha: '' })); }}
                            className="flex-1 outline-none text-base bg-transparent"
                            style={{ color: COLORS.textPrimary }}
                        />
                    </div>
                    {errors.captcha && <p className="text-xs -mt-3" style={{ color: COLORS.textRed }}>{errors.captcha}</p>}

                    <div className="mt-3">
                        <BottomButton label="Login" onClick={handleLogin} />
                    </div>
                </div>

                <div className="px-5 pt-2 pb-4 text-left" style={{ color: COLORS.textPrimary }}>
                    <p className="text-sm">Powered by <strong style={{ color: COLORS.textPrimary }}>VROOMSYNC EXPERTISE PRIVATE LIMITED</strong></p>
                    <p className="text-xs mt-1 leading-relaxed">All Rights Reserved 2025. CIN: U62099CT2025PTC017274</p>
                    <p className="text-xs mt-1 leading-relaxed">Insurance is subject matter of solicitation. Images used on the website and the mobile photographed, in them are for representative purpose only and are not indicative of anyone's thought.</p>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
