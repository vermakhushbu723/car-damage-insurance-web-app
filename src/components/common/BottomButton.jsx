import React from 'react';
import { COLORS } from '../../constants/theme';

/**
 * Reusable full-width bottom action button
 */
const BottomButton = ({ label = 'Next', onClick, disabled = false, style = {} }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-4 text-white font-semibold text-base rounded-xl transition-opacity"
            style={{
                background: disabled ? '#93C5FD' : COLORS.btnPrimary,
                opacity: disabled ? 0.7 : 1,
                ...style,
            }}
        >
            {label}
        </button>
    );
};

export default BottomButton;
