import React, { lazy } from 'react';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';

// Import connectivity page components lazily
const Automation = Loadable(lazy(() => import('@/pages/AutomationPage.tsx')));
const Integrations = Loadable(
  lazy(() => import('@/pages/IntegrationsPage.tsx'))
);
const IntegrationDetailsPage = Loadable(
  lazy(() => import('@/pages/IntegrationDetailsPage.tsx'))
);
const AddIntegrationPage = Loadable(
  lazy(() => import('@/pages/AddIntegrationPage.tsx'))
);
const EdgeManagement = Loadable(
  lazy(() => import('@/pages/EdgeManagementPage.tsx'))
);
const ScheduleManagement = Loadable(
  lazy(() => import('@/pages/ScheduleManagementPage.tsx'))
);
const SharingCenter = Loadable(
  lazy(() => import('@/pages/SharingCenterPage.tsx'))
);

export const connectivityRoutes = [
  // ------------------ automation ------------------------
  {
    path: '/automation',
    element: <FeatureRoute feature="automations" />,
    children: [
      {
        index: true,
        element: <Automation />,
      },
    ],
  },
  {
    path: '/integrations',
    element: <FeatureRoute feature="integration" />,
    children: [
      {
        index: true,
        element: <Integrations />,
      },
      {
        path: ':id',
        element: <IntegrationDetailsPage />,
      },
      {
        path: 'add-integration',
        element: <AddIntegrationPage />,
      },
    ],
  },
  {
    path: '/edge-management',
    element: <FeatureRoute feature="edge" />,
    children: [
      {
        index: true,
        element: <EdgeManagement />,
      },
    ],
  },
  {
    path: '/schedule-management',
    element: <FeatureRoute feature="scheduleManagement" />,
    children: [
      {
        index: true,
        element: <ScheduleManagement />,
      },
    ],
  },
  {
    path: '/sharing-center',
    element: <FeatureRoute feature="sharingCenter" />,
    children: [
      {
        index: true,
        element: <SharingCenter />,
      },
    ],
  },
];
