import React, { useState } from 'react';
import { CheckCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { COLORS } from '../../constants/theme';

/**
 * Document Camera/Gallery picker modal
 * Shows "Front Side" and "Back Side" camera capture options
 */
const DocumentCameraModal = ({ visible, docName, onClose, onCapture }) => {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: COLORS.overlay }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm mx-auto mb-16 rounded-2xl p-6 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title Row */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: COLORS.borderLight }}>
                    <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
                        {docName || 'Document Name'}
                    </span>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border flex items-center justify-center"
                        style={{ borderColor: COLORS.borderInput }}
                    >
                        <span style={{ color: COLORS.textSecondary, fontSize: 14 }}>✕</span>
                    </button>
                </div>

                {/* Front / Back */}
                <div className="flex gap-6 justify-center">
                    {['Front Side', 'Back Side'].map((side) => (
                        <button
                            key={side}
                            onClick={() => onCapture && onCapture(side)}
                            className="flex flex-col items-center gap-2"
                        >
                            <div
                                className="w-20 h-20 rounded-xl border-2 flex items-center justify-center"
                                style={{ borderColor: COLORS.borderInput }}
                            >
                                <span style={{ fontSize: 32 }}>📷</span>
                            </div>
                            <span className="text-sm" style={{ color: COLORS.textPrimary }}>{side}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentCameraModal;
