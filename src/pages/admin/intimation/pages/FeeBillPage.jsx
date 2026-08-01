import React from 'react';
import { PALETTE } from '../../adminTheme';

// No Figma frame was provided for this screen yet (only the sidebar nav
// item) — minimal placeholder until that design is shared.
const FeeBillPage = () => (
    <main style={{ padding: '20px 24px' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: PALETTE.primaryBlue }}>Fee Bill</h1>
        <p style={{ margin: 0, fontSize: 13, color: PALETTE.muted }}>
            Design for this screen hasn't been shared yet — let me know what it should show and I'll build it.
        </p>
    </main>
);

export default FeeBillPage;
