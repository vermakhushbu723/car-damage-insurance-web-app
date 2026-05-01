import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/theme';

/**
 * Page title bar with back arrow (blue bar below header)
 */
const PageTitleBar = ({ title, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <div
            className="w-full flex items-center gap-3 px-4 py-3"
            style={{ background: COLORS.bgPageTitle }}
        >
            <button onClick={handleBack} className="text-white">
                <ArrowLeftOutlined style={{ fontSize: 18 }} />
            </button>
            <span className="text-white font-bold text-lg">{title}</span>
        </div>
    );
};

export default PageTitleBar;
