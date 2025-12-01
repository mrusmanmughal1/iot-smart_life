import { createBrowserRouter, Navigate } from 'react-router-dom';
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
// import { OverviewPage } from '../pages/OverviewPage.tsx';
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
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
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/main-dashboard',
        element: <MainDashboardPage />,
      },
      {
        path: '/main-control-panel',
        element: <MainControlPanelPage />,
      },

      {
        path: '/assets',
        element: <AssetsPage />,
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
      {
        path: '/dashboards',
        element: <DashboardsPage />,
      },
      {
        path: '/dashboards/create',
        element: <CreateDashboardPage />,
      },
      {
        path: '/groups/create',
        element: <CreateGroupPage />,
      },
      {
        path: '/audit',
        element: <AuditPage />,
      },
      // Add more protected routes here
      {
        path: '/solution-dashboards',
        element: <DashboardsPage />,
      },
      {
        path: '/solution-templates',
        element: (
          <AppLayout>
            <SolutionTemplates />
          </AppLayout>
        ),
      },
      {
        path: '/solution-templates/create',
        element: (
          <AppLayout>
            <CreateTemplatePage />
          </AppLayout>
        ),
      },
      {
        path: '/solution-templates/preview/:id',
        element: <TemplatePreviewPage />,
      },
      {
        path: '/floor-plans',
        element: (
          <AppLayout>
            <FloorPlans />
          </AppLayout>
        ),
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
        path: '/device-profiles',
        element: (
          <AppLayout>
            <DeviceProfiles />
          </AppLayout>
        ),
      },
      {
        path: '/asset-profiles',
        element: (
          <AppLayout>
            <AssetProfiles />
          </AppLayout>
        ),
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
        path: '/widgets/configure',
        element: <WidgetConfigurationPage />,
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
