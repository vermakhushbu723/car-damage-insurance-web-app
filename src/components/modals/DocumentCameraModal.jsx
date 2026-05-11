import React, { useState } from 'react';
import { CheckCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { COLORS } from '../../constants/theme';
import cameraIcon from '../../assets/icons/camera.svg';

/**
 * Document Camera/Gallery picker modal
 * Shows "Front Side" and "Back Side" camera capture options
 */
const DocumentCameraModal = ({ visible, docName, onClose, onCapture }) => {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: COLORS.overlay }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-6 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title Row */}
                <div className="flex items-center justify-between pb-3">
                    <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
                        {docName || 'Document Name'}
                    </span>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border flex items-center justify-center"
                        style={{ borderColor: COLORS.borderLight, }}
                    >
                        <span style={{ color: COLORS.textPrimary, fontSize: 14 }}>✕</span>
                    </button>
                </div>

                {/* Front / Back */}
                <div className="flex gap-10 justify-center items-center">
                    {['Front Side', 'Back Side'].map((side, index) => (
                        <div key={side} className="flex items-center gap-10">
                            <button
                                onClick={() => onCapture && onCapture(side)}
                                className="flex flex-col items-center gap-2"
                            >
                                <div
                                    className="w-20 h-20 rounded-md border-2 flex items-center justify-center"
                                >
                                    <span style={{ fontSize: 32 }}>
                                        <img src={cameraIcon} alt="" className="src" />
                                    </span>
                                </div>
                                <span className="text-md">{side}</span>
                            </button>
                            {index === 0 && (
                                <div style={{ width: '1px', height: '150px', background: COLORS.borderLight }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentCameraModal;
