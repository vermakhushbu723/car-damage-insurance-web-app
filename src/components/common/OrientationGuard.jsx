import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMobileAlt, FaSyncAlt } from 'react-icons/fa';

/**
 * Route-aware orientation guard.
 *
 *   • Camera flows (full-screen capture) must run in LANDSCAPE.
 *   • Every other page is used in PORTRAIT.
 *
 * When the device orientation doesn't match the current route, a "rotate
 * device" prompt is shown instead of the page. Enforcement kicks in on ALL
 * TOUCH DEVICES — phones, tablets and touch laptops. Only non-touch desktops
 * (mouse only) are left unrestricted so dev/testing isn't blocked. Admin
 * dashboards are never gated.
 */

// A route needs landscape when its path contains one of these segments.
const LANDSCAPE_HINTS = ['camera-capture', 'photo-capture-selection', 'walk-around-video'];

// Any touch-capable device: phones, tablets and touch laptops. `any-pointer:
// coarse` also matches touch laptops (whose primary pointer is a mouse but
// which still have a touchscreen). Non-touch desktops return false.
const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
        (window.matchMedia && window.matchMedia('(any-pointer: coarse)').matches) ||
        'ontouchstart' in window ||
        (navigator.maxTouchPoints || 0) > 0
    );
};

const RotatePrompt = ({ toLandscape }) => (
    <div
        style={{
            position: 'fixed', inset: 0, zIndex: 99999, background: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
    >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 24, color: '#fff' }}>
            <FaMobileAlt style={{ fontSize: 64, marginBottom: 24, transform: toLandscape ? 'rotate(90deg)' : 'none' }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Rotate Device</h2>
            <p style={{ fontSize: 16, marginBottom: 28, maxWidth: 320, lineHeight: 1.5 }}>
                Please rotate your device to {toLandscape ? 'landscape' : 'portrait'} mode to continue.
            </p>
            <FaSyncAlt className="animate-spin" style={{ fontSize: 44 }} />
        </div>
    </div>
);

const OrientationGuard = ({ children }) => {
    const { pathname } = useLocation();
    const [isPortrait, setIsPortrait] = useState(
        typeof window === 'undefined' ? true : window.innerHeight >= window.innerWidth
    );
    const [touchDevice] = useState(isTouchDevice);

    useEffect(() => {
        const check = () => setIsPortrait(window.innerHeight >= window.innerWidth);
        check();
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        return () => {
            window.removeEventListener('resize', check);
            window.removeEventListener('orientationchange', check);
        };
    }, []);

    const isAdmin = pathname.startsWith('/admin');
    const needsLandscape = LANDSCAPE_HINTS.some((h) => pathname.includes(h));

    if (touchDevice && !isAdmin) {
        if (needsLandscape && isPortrait) return <RotatePrompt toLandscape />;
        if (!needsLandscape && !isPortrait) return <RotatePrompt toLandscape={false} />;
    }

    return children;
};

export default OrientationGuard;
