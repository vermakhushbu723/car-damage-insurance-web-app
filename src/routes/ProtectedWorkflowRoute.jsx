import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsRouteAllowed } from '../store/workflowSlice';

const ProtectedWorkflowRoute = ({ element }) => {
    const location = useLocation();
    // Selector is built per-render with the current pathname; the
    // resulting boolean is a primitive so re-renders only happen when
    // it actually flips, not on every store update.
    const allowed = useSelector(selectIsRouteAllowed(location.pathname));

    if (!allowed) {
        console.warn(`Access denied to route: ${location.pathname}`);
        return <Navigate to="/dashboard" replace />;
    }

    return element;
};

export default ProtectedWorkflowRoute;
