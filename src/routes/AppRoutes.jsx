import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ClaimStartPage from '../pages/ClaimStart/ClaimStartPage';
import OwnerVehicleDetailsPage from '../pages/OwnerVehicleDetails/OwnerVehicleDetailsPage';
import DocumentUploadPage from '../pages/DocumentUpload/DocumentUploadPage';
import InspectionDetailsPage from '../pages/InspectionDetails/InspectionDetailsPage';
import PhotoCaptureSelectionPage from '../pages/PhotoCaptureSelection/PhotoCaptureSelectionPage';
import CameraCapturePage from '../pages/CameraCapture/CameraCapturePage';
import WalkAroundVideoPage from '../pages/WalkAroundVideo/WalkAroundVideoPage';
import AddDamagePhotosPage from '../pages/AddDamagePhotos/AddDamagePhotosPage';
import DamageReviewPage from '../pages/DamageReview/DamageReviewPage';
import SubmittedPage from '../pages/Submitted/SubmittedPage';
import ReinspectionPhotosPage from '../pages/ReinspectionPhotos/ReinspectionPhotosPage';
import VehicleInformationPage from '../pages/VehicleInformation/VehicleInformationPage';
import AdminLoginPage from '../pages/admin/AdminLogin/AdminLoginPage';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboard/AdminDashboardPage';
import ProtectedCameraRoute from './ProtectedCameraRoute';
import ProtectedWorkflowRoute from './ProtectedWorkflowRoute';

// Routes that don't need workflow protection
const publicRoutes = [
    { path: ROUTES.LANDING, element: <LandingPage /> },
    { path: ROUTES.CLAIM_WORKSHOP_LOGIN, element: <LoginPage /> },
    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
    { path: ROUTES.CLAIM_START, element: <ClaimStartPage /> },
    { path: ROUTES.OWNER_VEHICLE_DETAILS, element: <OwnerVehicleDetailsPage /> },
    { path: ROUTES.DOCUMENT_UPLOAD, element: <DocumentUploadPage /> },
    { path: ROUTES.INSPECTION_DETAILS, element: <InspectionDetailsPage /> },
    { path: ROUTES.PHOTO_CAPTURE_SELECTION, element: <PhotoCaptureSelectionPage /> },
    { path: ROUTES.CAMERA_CAPTURE, element: <ProtectedCameraRoute element={<CameraCapturePage />} /> },
    { path: ROUTES.WALK_AROUND_VIDEO, element: <WalkAroundVideoPage /> },
    { path: ROUTES.ADD_DAMAGE_PHOTOS, element: <AddDamagePhotosPage /> },
];

// Routes that need workflow protection (Option Group 1)
const workflowGroup1Routes = [
    { path: ROUTES.DAMAGE_REVIEW, element: <DamageReviewPage /> },
    { path: ROUTES.SUBMITTED, element: <SubmittedPage /> },
    { path: ROUTES.REINSPECTION_PHOTOS, element: <ReinspectionPhotosPage /> },
];

// Routes that need workflow protection (Option Group 2)
const workflowGroup2Routes = [
    { path: ROUTES.VEHICLE_INFORMATION, element: <VehicleInformationPage /> },
];

// ── Admin panel routes ─────────────────────────────────────────────────
// ROUTES.ADMIN.DASHBOARD = "/admin/dashboard" is rendered as the child
const adminLayoutChildren = [
    { path: 'dashboard', element: <AdminDashboardPage /> },
];

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Protected workflow routes - Group 1 */}
            {workflowGroup1Routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedWorkflowRoute element={route.element} />}
                />
            ))}

            {/* Protected workflow routes - Group 2 */}
            {workflowGroup2Routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedWorkflowRoute element={route.element} />}
                />
            ))}

            {/* Admin login — kept outside AdminLayout so it can use its
                own full-bleed layout. */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

            {/* Admin panel routes (/admin/*) — shared sidebar + top bar
                via AdminLayout's <Outlet />. */}
            <Route path="/admin" element={<AdminLayout />}>
                {adminLayoutChildren.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
        </Routes>
    );
};

export default AppRoutes;
