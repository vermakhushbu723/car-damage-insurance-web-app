import React from 'react';

/**
 * Secondary Button Component
 * Outlined button for secondary actions
 */
const SecondaryButton = ({ label = 'Cancel', onClick, disabled = false, style = {} }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                borderRadius: '7px',
                // paddingTop: '10px',
                // paddingBottom: '10px',
                gap: '10px',
                background: 'transparent',
                border: '2px solid #01A0FE',
                color: '#01A0FE',
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

export default SecondaryButton;
