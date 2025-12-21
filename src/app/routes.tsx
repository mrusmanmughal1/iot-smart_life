import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute.tsx';
import { PublicRoute } from '@/routes/PublicRoute.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { RegisterPage } from '../pages/RegisterPage.tsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.tsx';
import { CheckEmailPage } from '../pages/CheckEmailPage.tsx';
import { ResetPasswordPage } from '../pages/ResetPasswordPage.tsx';
import { AccountBlockedPage } from '../pages/AccountBlockedPage.tsx';
import { VerifyAccountPage } from '../pages/VerifyAccountPage.tsx';
import { PinCodeVerificationPage } from '../pages/PinCodeVerificationPage.tsx';
import { SelectRolePage } from '../pages/SelectRolePage.tsx';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage.tsx';
import { DashboardPage } from '../pages/DashboardPage.tsx';
import MainDashboardPage from '@/pages/MainDashboardPage.tsx';
import MainControlPanelPage from '@/pages/MainControlPanelPage.tsx';
import DevicesPage from '@/pages/DevicesPage.tsx';
import DeviceDetailsPage from '@/pages/DeviceDetailsPage.tsx';
import AssetsPage from '@/pages/AssetsPage.tsx';
import AlarmsPage from '@/pages/AlarmsPage.tsx';
import UsersPage from '@/pages/UsersPage.tsx';
import NotificationsPage from '@/pages/NotificationsPage.tsx';
import AnalyticsPage from '@/pages/AnalyticsPage.tsx';
import SettingsPage from '@/pages/SettingsPage.tsx';
import DashboardsPage from '@/pages/DashboardsPage.tsx';
import CreateDashboardPage from '@/pages/CreateDashboardPage.tsx';
import CreateGroupPage from '@/pages/CreateGroupPage.tsx';
import AuditPage from '@/pages/AuditPage.tsx';
import PublicNotFoundPage from '@/pages/PublicNotFoundPage.tsx';
import PrivateNotFoundPage from '@/pages/PrivateNotFoundPage.tsx';
import AppLayout from '@/components/layout/AppLayout.tsx';
import SolutionTemplates from '@/pages/SolutionTemplatesPage.tsx';
import CreateTemplatePage from '@/pages/CreateTemplatePage.tsx';
import TemplatePreviewPage from '@/pages/TemplatePreviewPage.tsx';
import SubscriptionPlans from '@/pages/SubscriptionPlans.tsx';
import SharingCenter from '@/pages/SharingCenterPage.tsx';
import APIMonitoring from '@/pages/APIMonitoringPage.tsx';
import AssetProfiles from '@/pages/AssetProfilesPage.tsx';
import DeviceProfiles from '@/pages/DeviceProfilesPage.tsx';
import Automation from '@/pages/AutomationPage.tsx';
import Integrations from '@/pages/IntegrationsPage.tsx';
import EdgeManagement from '@/pages/EdgeManagementPage.tsx';
import WidgetsBundle from '@/pages/WidgetsBundle.tsx';
import Widgets from '@/pages/WidgetsPage.tsx';
import WidgetConfigurationPage from '@/pages/WidgetConfigurationPage.tsx';
import ImageLibrary from '@/pages/ImageLibraryPage.tsx';
import ScriptLibrary from '@/pages/ScriptLibrary.tsx';
import ScheduleManagement from '@/pages/ScheduleManagementPage.tsx';
import FloorPlans from '@/pages/FloorPlanPage.tsx';
import FloorMapCreatePage from '@/pages/FloorMapCreatePage.tsx';
import MultiFloorBuildingViewPage from '@/pages/MultiFloorBuildingViewPage.tsx';
import FloorMapSettingsPage from '@/pages/FloorMapSettingsPage.tsx';
import WidgetEditorPage from '@/pages/WidgetEditorPage.tsx';
import { RouteErrorPage } from '@/pages/RouteErrorPage.tsx';
import AssetDetailsPage from '@/pages/AssetDetailsPage.tsx';
import AssetProfileDetails from '@/pages/AssetProfileDetails.tsx';
import DeviceProfileDetails from '@/pages/DeviceProfileDetails.tsx';
import EmailVerification from '@/pages/EmailVerification.tsx';
import { PaymentSuccess } from '@/components/common/PaymentSuccess/PaymentSuccess.tsx';
export const router = createBrowserRouter([

  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  //  --------------------public routes--------------------

  {
    element: <PublicRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/check-email',
        element: <CheckEmailPage />,
      },
      {
        path: '/verify-email',
        element: <EmailVerification />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/account-blocked',
        element: <AccountBlockedPage />,
      },
      {
        path: '/verify-account',
        element: <VerifyAccountPage />,
      },
      {
        path: '/verify-pin',
        element: <PinCodeVerificationPage />,
      },
      {
        path: '/select-role',
        element: <SelectRolePage />,
      },
      {
        path: '/auth/callback',
        element: <OAuthCallbackPage />,
      },
      {
        path: '*',
        element: <PublicNotFoundPage />,
      },
    ],
  },

  //  --------------------protected routes--------------------

  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/devices',
        element: <DevicesPage />,
      },
      {
        path: '/devices/:id',
        element: <DeviceDetailsPage />,
      },
      {
        path: '/alarms',
        element: <AlarmsPage />,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      //  ----------------------- routes for assets -----------------------
      {
        path: '/assets',
        element: (
          <AppLayout>
            <Outlet />
          </AppLayout>
        ),
        children: [
          {
            index: true,
            element: <AssetsPage />,
          },
          {
            path: ':id',
            element: <AssetDetailsPage />,
          },
        ],
      },

      // ------------------ assets-profiles routes ------------------
      {
        path: '/asset-profiles',
        element: (
          <AppLayout>
            <AssetProfiles />
          </AppLayout>
        ),
      },
      {
        path: '/asset-profiles/:id',
        element: (
          <AppLayout>
            <AssetProfileDetails />
          </AppLayout>
        ),
      },
      // ------------------ Device-profiles routes ------------------
      {
        path: '/device-profiles',
        element: (
          <AppLayout>
            <DeviceProfiles />
          </AppLayout>
        ),
      },
      {
        path: '/device-profiles/:id',
        element: (
          <AppLayout>
            <DeviceProfileDetails />
          </AppLayout>
        ),
      },

      // --------------------Solutions dashboards Routes --------------------
      {
        path: '/solution-dashboards',
        element: (
          <AppLayout>
            <Outlet />
          </AppLayout>
        ),
        children: [
          {
            index: true,
            element: <DashboardsPage />,
          },
          {
            path: 'create',
            element: <CreateDashboardPage />,
          },
          {
            path: 'groups/create',
            element: <CreateGroupPage />,
          },
          {
            path: 'widgets/configure',
            element: <WidgetConfigurationPage />,
          },
          {
            path: ':id',
            element: <WidgetEditorPage />,
          },
          {
            path: 'main-dashboard',
            element: <MainDashboardPage />,
          },
          {
            path: 'main-control-panel',
            element: <MainControlPanelPage />,
          },
        ],
      },
      // --------------------Solutions templates Routes --------------------
      {
        path: '/solution-templates',
        element: (
          <AppLayout>
            <Outlet />
          </AppLayout>
        ),
        children: [
          {
            index: true,
            element: <SolutionTemplates />,
          },
          {
            path: 'preview/:id',
            element: <TemplatePreviewPage />,
          },
          {
            path: 'create',
            element: <CreateTemplatePage />,
          },
        ],
      },

      {
        path: '/audit',
        element: <AuditPage />,
      },
      // --------------------- protected routes ---------------------

      // ----------------------- floor plans ------------------------
      {
        path: '/floor-plans',
        element: (
          <AppLayout>
            <Outlet />
          </AppLayout>
        ),
        children: [
          {
            index: true,
            element: <FloorPlans />,
          },
          {
            path: 'create',
            element: <FloorMapCreatePage />,
          },
          {
            path: 'multifloor',
            element: <MultiFloorBuildingViewPage />,
          },
          {
            path: 'settings',
            element: <FloorMapSettingsPage />,
          },
        ],
      },

      {
        path: '/automation',
        element: (
          <AppLayout>
            <Automation />
          </AppLayout>
        ),
      },
      {
        path: '/subscription-plans',
        element: <SubscriptionPlans />,
      },

      {
        path: '/integrations',
        element: (
          <AppLayout>
            <Integrations />
          </AppLayout>
        ),
      },
      {
        path: '/edge-management',
        element: (
          <AppLayout>
            <EdgeManagement />
          </AppLayout>
        ),
      },
      {
        path: '/schedule-management',
        element: (
          <AppLayout>
            <ScheduleManagement />
          </AppLayout>
        ),
      },
      {
        path: '/widgets-bundle',
        element: (
          <AppLayout>
            <WidgetsBundle />
          </AppLayout>
        ),
      },
      {
        path: '/widgets',
        element: (
          <AppLayout>
            <Widgets />
          </AppLayout>
        ),
      },

      {
        path: '/images',
        element: (
          <AppLayout>
            <ImageLibrary />
          </AppLayout>
        ),
      },
      {
        path: '/javascript-library',
        element: (
          <AppLayout>
            <ScriptLibrary />
          </AppLayout>
        ),
      },
      {
        path: '/sharing-center',
        element: (
          <AppLayout>
            <SharingCenter />
          </AppLayout>
        ),
      },
      {
        path: '/api-monitoring',
        element: (
          <AppLayout>
            <APIMonitoring />
          </AppLayout>
        ),
      },
      {
        path: '/subscription-plans',
        element: (
          <AppLayout>
            <SubscriptionPlans />
          </AppLayout>
        ),
      },
      {
        path: '/dashboards/:id',
        element: <WidgetEditorPage />,
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: '*',
        element: (
          <AppLayout>
            <PrivateNotFoundPage />
          </AppLayout>
        ),
      },
    ],
  },
]);
