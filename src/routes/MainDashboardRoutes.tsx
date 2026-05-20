import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';

// Import dashboard page components lazily
const DashboardPage = Loadable(
  lazy(() =>
    import('@/pages/DashboardPage.tsx').then((module) => ({
      default: module.DashboardPage,
    }))
  )
);
const AlarmsPage = Loadable(lazy(() => import('@/pages/AlarmsPage.tsx')));
const AlertAnalyticsPage = Loadable(
  lazy(() => import('@/pages/AlertAnalyticsPage.tsx'))
);
const AlertRulesPage = Loadable(
  lazy(() => import('@/pages/AlertRulesPage.tsx'))
);
const AlertsNotificationPage = Loadable(
  lazy(() => import('@/pages/AlertsNotificationPage.tsx'))
);
const NotificationsPage = Loadable(
  lazy(() => import('@/pages/NotificationsPage.tsx'))
);
const DeviceAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DeviceAnalyticsPage.tsx'))
);
const AnalyticsPage = Loadable(lazy(() => import('@/pages/AnalyticsPage.tsx')));
const DevicesAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DevicesAnalyticsPage.tsx'))
);
const SystemPerformanceAnalyticsPage = Loadable(
  lazy(() => import('@/pages/SystemPerformanceAnalyticsPage.tsx'))
);
const DataConsumptionAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DataConsumptionAnalyticsPage.tsx'))
);
const DashboardsAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DashboardsAnalyticsPage'))
);
const GeoAnalyticsPage = Loadable(
  lazy(() => import('@/pages/GeoAnalyticsPage.tsx'))
);
const IndividualDeviceAnalyticsPage = Loadable(
  lazy(() => import('@/pages/IndividualDeviceAnalyticsPage.tsx'))
);
const DeviceAnalyticsMainPage = Loadable(
  lazy(() => import('@/pages/DeviceAnalyticsMainPage.tsx'))
);
const DeviceanalyticsDetailsPage = Loadable(
  lazy(() => import('@/pages/DeviceanalyticsDetailsPage.tsx'))
);
const AnalyticsDashboardDetailsPage = Loadable(
  lazy(() => import('@/pages/AnalyticsDashboardDetailsPage.tsx'))
);
const DashboardAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DashboardsAnalyticsPage'))
);
const ProductionOverviewPage = Loadable(
  lazy(() => import('@/pages/ProductionOverviewPage.tsx'))
);
const Overview2Page = Loadable(lazy(() => import('@/pages/Overview2Page.tsx')));
const SettingsPage = Loadable(lazy(() => import('@/pages/SettingsPage.tsx')));
const GeneralSettingsTab = Loadable(
  lazy(() =>
    import('@/features/settings/components/GeneralSettingsTab').then(
      (module) => ({ default: module.GeneralSettingsTab })
    )
  )
);
const NotificationsTab = Loadable(
  lazy(() =>
    import('@/features/settings/components/NotificationsTab').then(
      (module) => ({ default: module.NotificationsTab })
    )
  )
);
const SecurityTab = Loadable(
  lazy(() =>
    import('@/features/settings/components/SecurityTab').then((module) => ({
      default: module.SecurityTab,
    }))
  )
);
const AccountTab = Loadable(
  lazy(() =>
    import('@/features/settings/components/AccountTab').then((module) => ({
      default: module.AccountTab,
    }))
  )
);

export const mainDashboardRoutes = [
  {
    path: '/dashboard',
    element: <FeatureRoute feature="overview" />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'overview-2',
        element: <Overview2Page />,
      },
    ],
  },
  {
    path: '/alarms',
    element: <FeatureRoute feature="alerts" />,
    children: [
      {
        index: true,
        element: <AlarmsPage />,
      },
      {
        path: 'rules',
        element: <AlertRulesPage />,
      },
      {
        path: 'notifications',
        element: <AlertsNotificationPage />,
      },
      {
        path: 'analytics',
        element: <AlertAnalyticsPage />,
      },
    ],
  },
  {
    path: '/notifications',
    element: <FeatureRoute feature="notifications" />,
    children: [
      {
        index: true,
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: '/analytics',
    element: <FeatureRoute feature="analytics" />,
    children: [
      {
        path: 'devices',
        element: <DeviceAnalyticsMainPage />,
      },
      {
        path: 'devices/:id',
        element: <DeviceanalyticsDetailsPage />,
      },
      {
        path: 'device-analytics/:id',
        element: <IndividualDeviceAnalyticsPage />,
      },

      {
        path: 'dashboard-analytics',
        element: <DashboardAnalyticsPage />,
      },
      {
        path: 'dashboard-analyticss',
        element: <AnalyticsDashboardDetailsPage />,
      },
      {
        path: 'dashboard/:id',
        element: <DevicesAnalyticsPage />,
      },
      {
        path: 'data-consumption',
        element: <DataConsumptionAnalyticsPage />,
      },
      {
        path: 'system',
        element: <SystemPerformanceAnalyticsPage />,
      },
      {
        path: 'geo-analytics',
        element: <GeoAnalyticsPage />,
      },
      {
        path: 'reports',
        element: <AnalyticsPage />,
      },
      {
        path: 'device-analytics',
        element: <AnalyticsPage />,
      },

      // {
      //   path: 'dashboard-analytics',
      //   element: <DashboardsAnalyticsPage />,
      // },
      {
        path: 'product-overview',
        element: <ProductionOverviewPage />,
      },
      {
        path: 'geo-analytics',
        element: <GeoAnalyticsPage />,
      },
    ],
  },
  {
    path: '/settings',
    element: <FeatureRoute feature="settings" />,
    children: [
      {
        path: '',
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          { path: 'general', element: <GeneralSettingsTab /> },
          { path: 'notifications', element: <NotificationsTab /> },
          { path: 'security', element: <SecurityTab /> },
          { path: 'account', element: <AccountTab /> },
        ],
      },
    ],
  },
];
