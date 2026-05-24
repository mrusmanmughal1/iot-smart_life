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
  lazy(() => import('@/features/Edge-managment/page/EdgeManagementPage'))
);
const ScheduleManagement = Loadable(
  lazy(() => import('@/pages/ScheduleManagementPage.tsx'))
);
const SharingCenter = Loadable(
  lazy(() => import('@/pages/SharingCenterPage.tsx'))
);
const CreateRuleChainTemplate = Loadable(
  lazy(() => import('@/pages/CreateRuleChainTemplatePage.tsx'))
);
const MQTTTemplatePage = Loadable(
  lazy(() => import('@/pages/MQTTTemplatePage.tsx'))
);
const RuleChainTemplates = Loadable(
  lazy(() => import('@/pages/RuleChainTemplatesPage.tsx'))
);
const CreateConverterTemplate = Loadable(
  lazy(() => import('@/pages/CreateConverterTemplatePage.tsx'))
);
const JsonUplinkConverterConfig = Loadable(
  lazy(() => import('@/pages/JsonUplinkConverterConfigPage.tsx'))
);
const ConverterTemplates = Loadable(
  lazy(() => import('@/pages/ConverterTemplatesPage.tsx'))
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
      {
        path: 'create-rule-chain',
        element: <CreateRuleChainTemplate />,
      },
      {
        path: 'rule-chain-templates',
        element: <RuleChainTemplates />,
      },
      {
        path: 'mqtt-template/:id',
        element: <MQTTTemplatePage />,
      },
      {
        path: 'create-converter-template',
        element: <CreateConverterTemplate />,
      },
      {
        path: 'converter-config/:id',
        element: <JsonUplinkConverterConfig />,
      },
      {
        path: 'converter-templates',
        element: <ConverterTemplates />,
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
