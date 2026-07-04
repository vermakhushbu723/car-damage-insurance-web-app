import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import OrientationGuard from '../components/common/OrientationGuard';
import LandingPage from '../pages/Landing/LandingPage';
import AdminLoginPage from '../pages/admin/AdminLogin/AdminLoginPage';
import AdminSelectPage from '../pages/admin/AdminSelect/AdminSelectPage';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboard/AdminDashboardPage';
import AdminClaimPage from '../pages/admin/AdminClaim/AdminClaimPage';
import AdminPlaceholderPage from '../pages/admin/AdminPlaceholder/AdminPlaceholderPage';
import AdminUserCreationPage from '../pages/admin/AdminUserCreation/AdminUserCreationPage';
import InsurerPage from '../pages/admin/Insurer/InsurerPage';
import BrokerPage from '../pages/admin/Broker/BrokerPage';
import SurveyorPage from '../pages/admin/Surveyor/SurveyorPage';
import IntimationLayout from '../pages/admin/intimation/IntimationLayout';
import IntimationPage from '../pages/admin/intimation/pages/IntimationPage';
import ClaimHandlerPage from '../pages/admin/intimation/pages/ClaimHandlerPage';
import SurveyorAppointmentPage from '../pages/admin/intimation/pages/SurveyorAppointmentPage';
import ClaimDetailsPage from '../pages/admin/intimation/pages/ClaimDetailsPage';
import ILAPage from '../pages/admin/intimation/pages/ILAPage';
import SettlementPage from '../pages/admin/intimation/pages/SettlementPage';
import FLAPage from '../pages/admin/intimation/pages/FLAPage';
import RecommendationPage from '../pages/admin/intimation/pages/RecommendationPage';
import DmsSurveyorPage from '../pages/admin/intimation/pages/DmsSurveyorPage';
import DmsPreInspectionPage from '../pages/admin/intimation/pages/DmsPreInspectionPage';

// ── Self-contained per-flow route configs ──────────────────────────────
// Each flow owns a prefixed set of routes (e.g. /claim-workshop/*,
// /preinspection-agent/*) and its own page components, so flows never
// collide. The 3 claim flows reuse the shared page UI; the 3 preinspection
// flows have their own components with preinspection-specific content.
import claimWorkshopRoutes from '../pages/flows/claim/ClaimWorkshop/routesConfig';
import claimSurveyorRoutes from '../pages/flows/claim/ClaimSurveyor/routesConfig';
import claimWeblinkRoutes from '../pages/flows/claim/ClaimWeblink/routesConfig';
import preinspectionAgentRoutes from '../pages/flows/preinspection/PreinspectionAgent/routesConfig';
import preinspectionSurveyorRoutes from '../pages/flows/preinspection/PreinspectionSurveyor/routesConfig';
import preinspectionWeblinkRoutes from '../pages/flows/preinspection/PreinspectionWeblink/routesConfig';

// All six flows' routes flattened into a single list. Every path is unique
// because of its flow prefix, so they can be rendered side-by-side.
const flowRoutes = [
    ...claimWorkshopRoutes,
    ...claimSurveyorRoutes,
    ...claimWeblinkRoutes,
    ...preinspectionAgentRoutes,
    ...preinspectionSurveyorRoutes,
    ...preinspectionWeblinkRoutes,
];

// ── Admin panel routes ─────────────────────────────────────────────────
// ROUTES.ADMIN.DASHBOARD = "/admin/dashboard" is rendered as the child
const adminLayoutChildren = [
    { path: 'dashboard', element: <AdminDashboardPage /> },
    { path: 'claim', element: <AdminClaimPage /> },
    { path: 'preinspection', element: <AdminPlaceholderPage title="Preinspection" /> },
    { path: 'settings', element: <AdminPlaceholderPage title="Settings" /> },
    { path: 'support', element: <AdminPlaceholderPage title="Support" /> },
    { path: 'user-creation', element: <AdminUserCreationPage /> },
    { path: 'insurer', element: <InsurerPage /> },
    { path: 'broker', element: <BrokerPage /> },
    { path: 'surveyor', element: <SurveyorPage /> },
    { path: 'workshop', element: <AdminPlaceholderPage title="Workshop" /> },
];

const AppRoutes = () => {
    return (
        <OrientationGuard>
        <Routes>
            {/* Landing — login-type selection screen */}
            <Route path={ROUTES.LANDING} element={<LandingPage />} />

            {/* Per-flow routes (claim/* and preinspection/* prefixes) */}
            {flowRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Super-Admin portal selection — shown at /admin before login */}
            <Route path={ROUTES.ADMIN.SELECT} element={<AdminSelectPage />} />

            {/* Admin login — kept outside AdminLayout so it can use its
                own full-bleed layout. */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

            {/* Admin panel routes (/admin/*) — shared sidebar + top bar
                via AdminLayout's <Outlet />. */}
            <Route path="/admin" element={<AdminLayout />}>
                {adminLayoutChildren.map((route) => (
                    <Route
                        key={route.path || 'admin-index'}
                        index={route.index}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Route>

            {/* Intimation Management System (/admin/intimation/*) */}
            <Route path="/admin/intimation" element={<IntimationLayout />}>
                <Route index element={<IntimationPage />} />
                <Route path="claim-handler" element={<ClaimHandlerPage />} />
                <Route path="surveyor-appointment" element={<SurveyorAppointmentPage />} />
                <Route path="claim-details" element={<ClaimDetailsPage />} />
                <Route path="ila" element={<ILAPage />} />
                <Route path="settlement" element={<SettlementPage />} />
                <Route path="fla" element={<FLAPage />} />
                <Route path="recommendation" element={<RecommendationPage />} />
                <Route path="dms-surveyor" element={<DmsSurveyorPage />} />
                <Route path="dms-preinspection" element={<DmsPreInspectionPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
        </Routes>
        </OrientationGuard>
    );
};

export default AppRoutes;
