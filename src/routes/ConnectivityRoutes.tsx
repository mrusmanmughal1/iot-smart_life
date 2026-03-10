import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import Automation from '@/pages/AutomationPage.tsx';
import Integrations from '@/pages/IntegrationsPage.tsx';
import IntegrationDetailsPage from '@/pages/IntegrationDetailsPage.tsx';
import AddIntegrationPage from '@/pages/AddIntegrationPage.tsx';
import EdgeManagement from '@/pages/EdgeManagementPage.tsx';
import ScheduleManagement from '@/pages/ScheduleManagementPage.tsx';
import SharingCenter from '@/pages/SharingCenterPage.tsx';

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
