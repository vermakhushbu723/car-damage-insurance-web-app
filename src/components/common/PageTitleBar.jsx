import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/theme';

/**
 * Page title bar with back arrow (blue bar below header)
 */
const PageTitleBar = ({ title, subtitle='', onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <>
            <div
                className="w-full flex items-center gap-3 px-4 pb-3"
                style={{ background: COLORS.bgPageTitle }}
            >
                <button onClick={handleBack} className="text-white">
                    <ArrowLeftOutlined style={{ fontSize: 18 }} />
                </button>
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-lg">{title}</span>
                    {subtitle && (
                        <p className=" text-sm font-medium py-1" style={{ color: COLORS.textWhite, background: COLORS.bgHeader }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PageTitleBar;
