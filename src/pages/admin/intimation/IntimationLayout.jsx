import React from 'react';
import { Outlet } from 'react-router-dom';
import IntimationSidebar from './components/IntimationSidebar';
import IntimationHeader from './components/IntimationHeader';
import '../admin.css';

const IntimationLayout = () => (
    <div
        className="admin-root"
        style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFD' }}
    >
        <IntimationSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
            <div style={{ flexShrink: 0 }}>
                <IntimationHeader />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <Outlet />
            </div>
        </div>
    </div>
);

export default IntimationLayout;
