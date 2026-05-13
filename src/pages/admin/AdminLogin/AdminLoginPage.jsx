import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leftLogo from '../../../assets/png/leftlogo.png';
import rightLogo from '../../../assets/rightlogo.svg';
import loginImage from '../../../assets/png/loginImage.jpg';
import { ROUTES } from '../../../constants/routes';

/**
 * Admin Panel — Login page.
 *
 * Split-screen layout (mirrors the supplied design):
 *   ┌──────────────┬──────────────────────────────┐
 *   │              │      [logo] [logo]           │
 *   │   left side  │     Motor insurance System   │
 *   │   image /    │     Signin To Your Account   │
 *   │   gradient   │                              │
 *   │              │  EMAIL ADDRESS [_________]   │
 *   │              │  PASSWORD       Forget Pwd?  │
 *   │              │                 [_________]  │
 *   │              │  captcha ↻      [_________]  │
 *   │              │       [   Sign In   ]        │
 *   │              │                              │
 *   │              │  Powered by ... Insurance is │
 *   │              │  the subject matter of solic.│
 *   └──────────────┴──────────────────────────────┘
 *
 * On screens narrower than `md` (768px) the left panel collapses and
 * only the form is shown.
 */

// Captcha alphabet — we drop visually-confusing characters (I, l, O, 0)
// so users don't have to second-guess what they're seeing.
const CAPTCHA_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';

const generateCaptcha = (length = 5) => {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += CAPTCHA_ALPHABET[Math.floor(Math.random() * CAPTCHA_ALPHABET.length)];
    }
    return out;
};

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState(() => generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const [error, setError] = useState('');

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password) { setError('Please enter your password.'); return; }
        if (captchaInput.trim() !== captcha) {
            setError('Captcha does not match. Please try again.');
            refreshCaptcha();
            return;
        }
        // TODO: wire up to real admin auth API. For now route to the
        // placeholder dashboard so the flow is testable end-to-end.
        navigate(ROUTES.ADMIN.DASHBOARD);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* ── Left panel — hero image ──────────────────────────────
                Full-bleed photograph from src/assets/png/loginImage.jpg.
                Hidden below `md` (768px) so mobile gets the form alone. */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <img
                    src={loginImage}
                    alt="Motor insurance"
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>

            {/* ── Right panel — login form ─────────────────────────── */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8 md:px-12">
                <div className="w-full max-w-md">
                    {/* Logos row */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="px-3 py-1.5 flex items-center">
                            <img
                                src={leftLogo}
                                alt="New India Assurance"
                                style={{ height: 56, width: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                        <div className="px-3 py-1.5 flex items-center">
                            <img
                                src={rightLogo}
                                alt="IBima Assist"
                                style={{ height: 56, width: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-center font-bold text-black" style={{ fontSize: 32, lineHeight: 1.15 }}>
                        Motor insurance<br />System
                    </h1>
                    <p className="text-center text-gray-500 text-base mt-3 mb-7">
                        Signin To Your Account
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <label
                            htmlFor="admin-email"
                            className="block font-semibold text-black mb-1.5"
                            style={{ fontSize: 13, letterSpacing: '0.04em' }}
                        >
                            EMAIL ADDRESS
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: '#EEEEEE',
                                border: '1px solid transparent',
                                borderRadius: 6,
                                fontSize: 15,
                                color: '#1f2937',
                                outline: 'none',
                                marginBottom: 16,
                            }}
                        />

                        {/* Password row */}
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="admin-password"
                                className="font-semibold text-black"
                                style={{ fontSize: 13, letterSpacing: '0.04em' }}
                            >
                                PASSWORD
                            </label>
                            <button
                                type="button"
                                onClick={() => alert('Forgot-password flow not implemented yet.')}
                                className="text-xs font-semibold"
                                style={{ color: '#000', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Forget Password?
                            </button>
                        </div>
                        <input
                            id="admin-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: '#EEEEEE',
                                border: '1px solid transparent',
                                borderRadius: 6,
                                fontSize: 15,
                                color: '#1f2937',
                                outline: 'none',
                                marginBottom: 18,
                            }}
                        />

                        {/* Captcha display + refresh */}
                        <div className="flex items-center gap-3 mb-2">
                            <span
                                aria-label="captcha text"
                                style={{
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    letterSpacing: '0.4em',
                                    color: '#374151',
                                    userSelect: 'none',
                                    // subtle skew + striped background hint
                                    background:
                                        'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.04) 6px 7px)',
                                    padding: '4px 10px',
                                    borderRadius: 4,
                                }}
                            >
                                {captcha.split('').join(' ')}
                            </span>
                            <button
                                type="button"
                                onClick={refreshCaptcha}
                                title="Refresh captcha"
                                aria-label="Refresh captcha"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#0EA5E9',
                                    fontSize: 22,
                                    lineHeight: 1,
                                    padding: 4,
                                }}
                            >
                                ↻
                            </button>
                        </div>

                        <input
                            type="text"
                            aria-label="Enter captcha"
                            autoComplete="off"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: '#fff',
                                border: '1.5px solid #d1d5db',
                                borderRadius: 6,
                                fontSize: 15,
                                color: '#1f2937',
                                outline: 'none',
                                marginBottom: 18,
                            }}
                        />

                        {error && (
                            <p
                                role="alert"
                                style={{ color: '#DC2626', fontSize: 13, marginBottom: 12, marginTop: -4 }}
                            >
                                {error}
                            </p>
                        )}

                        {/* Sign In */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: '#2563EB',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginBottom: 24,
                                boxShadow: '0 1px 2px rgba(37,99,235,0.4)',
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-black" style={{ fontSize: 11, lineHeight: 1.55 }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                            Powered By Vroomsync Expertise Private Limited. All Rights Reserved 2025. CIN: U62099CT2025PTC017274
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>
                            Insurance is the subject matter of solicitation.
                        </p>
                        <p style={{ marginTop: 12, marginBottom: 0, color: '#374151' }}>
                            Images used on this website and the models photographed in them are for representative purposes only and are not indicative of anyone's personal thoughts or ideas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
