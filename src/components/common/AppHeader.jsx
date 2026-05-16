import React from 'react';
import { COLORS } from '../../constants/theme';
import Logo from '../../assets/logo.png';

const AppHeader = () => {
    return (
        <div
            className="w-full flex items-center justify-center px-4 py-6"
            style={{ background: COLORS.bgApp }}
        >
            {/* Left Logo - New India Assurance */}
            <img
                src={Logo}
                alt="New India Assurance"
                className="h-18 w-auto object-contain mt-4"
            />
        </div>
    );
};

export default AppHeader;
