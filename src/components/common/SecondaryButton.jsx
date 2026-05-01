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
                width: '181px',
                height: '37px',
                borderRadius: '7px',
                padding: '10px',
                gap: '10px',
                borderWidth: '2px',
                border: '2px solid #01A0FE',
                background: 'white',
                color: '#01A0FE',
                fontSize: '14px',
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: disabled ? 0.6 : 1,
                ...style,
            }}
        >
            {label}
        </button>
    );
};

export default SecondaryButton;
