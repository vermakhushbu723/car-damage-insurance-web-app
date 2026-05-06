import React from 'react';
import { COLORS } from '../../constants/theme';
import BottomButton from '../common/BottomButton';

/**
 * Location Permission Modal
 */
const LocationModal = ({ visible, onAllow }) => {
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
                    style={{ background: '#FF960940', border: '1px solid #FF9609' }}
                >
                    <span style={{ fontSize: 42 }}>
                        <img src="/public/images/icons/location.svg" alt="location" srcset="" />
                    </span>
                </div>

                <h3 className="font-bold text-xl mb-3" style={{ color: COLORS.locationAccent }}>
                    Location
                </h3>

                <p className="text-sm leading-relaxed mb-6">
                    Allow Maps To Access Your Location While You Use The App
                </p>

                <BottomButton
                    label='Allow'
                    onClick={onAllow}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ background: COLORS.btnPrimary }}
                />
            </div>
        </div>
    );
};

export default LocationModal;
