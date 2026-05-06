import React from 'react';

/**
 * Primary Button Component
 * Full-width button for main actions
 */
const PrimaryButton = ({ label = 'Submit', onClick, disabled = false, style = {} }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                // width: '181px',
                // height: '37px',
                borderRadius: '7px',
                // paddingTop: '10px',
                // paddingBottom: '10px',
                gap: '10px',
                background: '#01A0FE',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: 1,
                ...style,
            }}
        >
            {label}
        </button>
    );
};

export default PrimaryButton;
