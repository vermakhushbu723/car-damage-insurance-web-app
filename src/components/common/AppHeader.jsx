import React from 'react';
import { COLORS } from '../../constants/theme';
import leftLogo from '../../assets/leftlogo.png';
import rightLogo from '../../assets/rightlogo.svg';

const AppHeader = () => {
    return (
        <div
            className="w-full flex items-center justify-between px-4 py-3"
            style={{ background: COLORS.bgApp }}
        >
            {/* Left Logo - New India Assurance */}
            <img
                src={leftLogo}
                alt="New India Assurance"
                className="h-18 w-auto object-contain"
            />

            {/* Right Logo - IBima Assist */}
            <img
                src={rightLogo}
                alt="IBima Assist"
                className="h-[70px] w-auto object-contain border"
            />
        </div>
    );
};

export default AppHeader;
