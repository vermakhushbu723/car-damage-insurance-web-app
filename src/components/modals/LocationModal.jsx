import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../constants/theme';
import BottomButton from '../common/BottomButton';
import locationIcon from '../../assets/icons/location.svg';

/**
 * Location Permission Modal — mandatory.
 *
 * Flow:
 *   1. Modal opens → immediately checks the device's location.
 *   2. If GPS / Location Services is OFF → the user is asked to turn it ON
 *      first. Only after they turn it on and tap "I've Turned It On" does
 *      the check re-run and the user is allowed through.
 *   3. If browser permission is denied → user is asked to allow it.
 *   4. On success → `onAllow()` fires and the parent advances the flow.
 */
const LocationModal = ({ visible, onAllow }) => {
    // 'checking' | 'off' | 'denied' | 'unsupported'
    const [status, setStatus] = useState('checking');
    const [errorMsg, setErrorMsg] = useState('');

    const runCheck = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('unsupported');
            setErrorMsg('Geolocation is not supported on this device.');
            return;
        }
        setStatus('checking');
        setErrorMsg('');
        navigator.geolocation.getCurrentPosition(
            () => {
                onAllow && onAllow();
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus('denied');
                    setErrorMsg(
                        'Location permission is denied for this browser. Please allow location access in your browser/device settings and try again.'
                    );
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setStatus('off');
                    setErrorMsg(
                        "Your phone's Location (GPS) is OFF. Please turn it ON from your phone settings first."
                    );
                } else if (error.code === error.TIMEOUT) {
                    setStatus('off');
                    setErrorMsg(
                        "Couldn't get your location. Please make sure GPS / Location Services is turned ON and try again."
                    );
                } else {
                    setStatus('off');
                    setErrorMsg(
                        'Could not get your location. Please ensure GPS / Location Services is turned ON and try again.'
                    );
                }
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    }, [onAllow]);

    // Auto-check the moment the modal opens.
    useEffect(() => {
        if (visible) runCheck();
    }, [visible, runCheck]);

    if (!visible) return null;

    const isChecking = status === 'checking';
    const isOff = status === 'off';
    const isDenied = status === 'denied';
    const isError = isOff || isDenied || status === 'unsupported';

    let buttonLabel = 'Checking…';
    if (isOff) buttonLabel = "I've Turned It On";
    else if (isDenied) buttonLabel = 'Try Again';
    else if (status === 'unsupported') buttonLabel = 'Retry';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: COLORS.rotateBg }}
        >
            <div className="bg-white rounded-2xl mx-8 p-7 flex flex-col items-center text-center max-w-xs w-full">
                {/* Icon */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                        background: isError ? '#EF444426' : '#FF960940',
                        border: `1px solid ${isError ? COLORS.statusPending : '#FF9609'}`,
                    }}
                >
                    <span style={{ fontSize: 42 }}>
                        <img src={locationIcon} alt="location" />
                    </span>
                </div>

                <h3
                    className="font-bold text-xl mb-3"
                    style={{ color: isError ? COLORS.statusPending : COLORS.locationAccent }}
                >
                    {isOff
                        ? 'Turn On Location First'
                        : isDenied
                            ? 'Permission Required'
                            : status === 'unsupported'
                                ? 'Not Supported'
                                : 'Checking Location'}
                </h3>

                <p
                    className="text-sm leading-relaxed mb-2"
                    style={{ color: COLORS.textPrimary }}
                >
                    {isChecking
                        ? 'Please wait while we check your location…'
                        : errorMsg}
                </p>

                {isOff && (
                    <ul
                        className="text-sm leading-snug mb-4 text-left list-disc pl-5"
                        style={{ color: COLORS.textSecondary }}
                    >
                        <li>Open your phone Settings.</li>
                        <li>Turn ON Location / GPS.</li>
                        <li>Come back and tap "I've Turned It On".</li>
                    </ul>
                )}

                {isDenied && (
                    <ul
                        className="text-sm leading-snug mb-4 text-left list-disc pl-5"
                        style={{ color: COLORS.textSecondary }}
                    >
                        <li>Open this site's permissions in your browser.</li>
                        <li>Allow Location access for this site.</li>
                        <li>Tap "Try Again" below.</li>
                    </ul>
                )}

                {!isError && !isChecking && (
                    <p
                        className="text-sm leading-snug mb-4"
                        style={{ color: COLORS.textSecondary }}
                    >
                        Location is mandatory to verify inspection time and place.
                    </p>
                )}

                <BottomButton
                    label={buttonLabel}
                    onClick={runCheck}
                    disabled={isChecking}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ background: COLORS.btnPrimary }}
                />
            </div>
        </div>
    );
};

export default LocationModal;
