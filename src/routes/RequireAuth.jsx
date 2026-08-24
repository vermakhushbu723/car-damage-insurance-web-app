import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '../utils/authSession';

/**
 * Route guard for one portal's authenticated screens -- mirrors
 * ProtectedCameraRoute's shape/pattern. Redirects to that portal's own
 * login page if there's no valid (unexpired) session for `role`.
 *
 * @param {'claim_workshop'|'claim_surveyor'|'preinspection_agent'|'preinspection_surveyor'} role
 * @param {string} loginPath - that flow's ROUTES.LOGIN
 */
const RequireAuth = ({ role, loginPath, children }) => {
    const location = useLocation();
    const session = getSession(role);

    if (!session) {
        return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default RequireAuth;
