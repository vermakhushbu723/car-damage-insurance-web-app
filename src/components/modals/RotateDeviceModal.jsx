import React from 'react';
import { COLORS } from '../../constants/theme';

/**
 * Rotate Device Modal
 */
const RotateDeviceModal = ({ visible, onAllow }) => {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: COLORS.rotateBg }}
        >
            <div className="bg-white rounded-2xl mx-8 p-8 flex flex-col items-center text-center max-w-xs w-full">
                {/* Icon */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ background: '#EFF6FF' }}
                >
                    <span style={{ fontSize: 42 }}>🔄</span>
                </div>

                <h3 className="font-bold text-xl mb-3" style={{ color: COLORS.primary }}>
                    Rotate
                </h3>

                <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.textSecondary }}>
                    Please Rotate Your Device &amp; Turn On The Auto Rotation As The Photo Needs To Be Captured In Landscape Mode
                </p>

                <button
                    onClick={onAllow}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ background: COLORS.btnPrimary }}
                >
                    Allow
                </button>
            </div>
        </div>
    );
};

export default RotateDeviceModal;
