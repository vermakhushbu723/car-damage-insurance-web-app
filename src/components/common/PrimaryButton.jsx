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
                width: '100%',
                maxWidth: '406px',
                height: '52px',
                borderRadius: '7px',
                padding: '10px',
                gap: '10px',
                background: disabled ? '#9DB4D4' : '#2770CE',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: disabled ? 0.7 : 1,
                ...style,
            }}
        >
            {label}
        </button>
    );
};

export default PrimaryButton;
