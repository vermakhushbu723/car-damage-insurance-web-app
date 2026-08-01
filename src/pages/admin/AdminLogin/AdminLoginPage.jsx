import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leftLogo from '../../../assets/png/leftLogo.png';
import rightLogo from '../../../assets/rightlogo.svg';
import loginImage from '../../../assets/png/loginImage.jpg';
import { ROUTES } from '../../../constants/routes';
// Shared admin typography (Instrument Sans). Login lives outside
// AdminLayout, so it imports the stylesheet directly.
import '../admin.css';

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
        if (!password) { setError('Please enter your password.'); return; }
        // Demo login — any email + password is accepted.
        navigate(ROUTES.ADMIN.DASHBOARD);
    };

    return (
        <div className="admin-root flex bg-white" style={{ height: '100vh', overflow: 'hidden' }}>
            {/* ── Left panel — hero image ────────────────────────────── */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <img
                    src={loginImage}
                    alt="Motor insurance"
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>

            {/* ── Right panel — login form ─────────────────────────── */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-10"
                style={{ overflowY: 'auto' }}>
                <div className="w-full max-w-md">
                    {/* Logos row */}
                    <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
                        <img
                            src={leftLogo}
                            alt="New India Assurance"
                            style={{ height: 42, width: 'auto', objectFit: 'contain' }}
                        />
                        <img
                            src={rightLogo}
                            alt="IBima Assist"
                            style={{ height: 42, width: 'auto', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-center font-bold text-black" style={{ fontSize: 24, lineHeight: 1.2, margin: 0 }}>
                        Motor insurance System
                    </h1>
                    <p className="text-center text-gray-500" style={{ fontSize: 14, marginTop: 6, marginBottom: 16 }}>
                        Signin To Your Account
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <label
                            htmlFor="admin-email"
                            className="block font-semibold text-black"
                            style={{ fontSize: 12, letterSpacing: '0.04em', marginBottom: 5 }}
                        >
                            EMAIL ADDRESS
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '9px 14px',
                                background: '#EEEEEE', border: '1px solid transparent',
                                borderRadius: 6, fontSize: 14, color: '#1f2937',
                                outline: 'none', marginBottom: 10, boxSizing: 'border-box',
                            }}
                        />

                        {/* Password row */}
                        <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                            <label
                                htmlFor="admin-password"
                                className="font-semibold text-black"
                                style={{ fontSize: 12, letterSpacing: '0.04em' }}
                            >
                                PASSWORD
                            </label>
                            <button
                                type="button"
                                onClick={() => alert('Forgot-password flow not implemented yet.')}
                                style={{ color: '#000', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
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
                                width: '100%', padding: '9px 14px',
                                background: '#EEEEEE', border: '1px solid transparent',
                                borderRadius: 6, fontSize: 14, color: '#1f2937',
                                outline: 'none', marginBottom: 10, boxSizing: 'border-box',
                            }}
                        />

                        {/* Captcha display + refresh */}
                        <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                            <span
                                aria-label="captcha text"
                                style={{
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: 18, fontWeight: 700,
                                    letterSpacing: '0.4em', color: '#374151',
                                    userSelect: 'none',
                                    background: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.04) 6px 7px)',
                                    padding: '3px 10px', borderRadius: 4,
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
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: '#0EA5E9', fontSize: 20, lineHeight: 1, padding: 2,
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
                                width: '100%', padding: '9px 14px',
                                background: '#fff', border: '1.5px solid #d1d5db',
                                borderRadius: 6, fontSize: 14, color: '#1f2937',
                                outline: 'none', marginBottom: 10, boxSizing: 'border-box',
                            }}
                        />

                        {error && (
                            <p role="alert" style={{ color: '#DC2626', fontSize: 12, marginBottom: 8, marginTop: -4 }}>
                                {error}
                            </p>
                        )}

                        {/* Sign In */}
                        <button
                            type="submit"
                            style={{
                                width: '100%', padding: '11px 16px',
                                background: '#2563EB', color: '#fff',
                                border: 'none', borderRadius: 6,
                                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                marginBottom: 14,
                                boxShadow: '0 1px 2px rgba(37,99,235,0.4)',
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-black" style={{ fontSize: 10.5, lineHeight: 1.5 }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                            Powered By Vroomsync Expertise Private Limited. All Rights Reserved 2025. CIN: U62099CT2025PTC017274
                        </p>
                        <p style={{ margin: '3px 0 0 0', fontWeight: 600 }}>
                            Insurance is the subject matter of solicitation.
                        </p>
                        <p style={{ marginTop: 8, marginBottom: 0, color: '#374151' }}>
                            Images used on this website and the models photographed in them are for representative purposes only and are not indicative of anyone's personal thoughts or ideas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
