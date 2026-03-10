import React, { lazy } from 'react';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';

// Import solution page components lazily
const DashboardsPage = Loadable(
  lazy(() => import('@/pages/DashboardsPage.tsx'))
);
const CreateDashboardPage = Loadable(
  lazy(() => import('@/pages/CreateDashboardPage.tsx'))
);
const CreateGroupPage = Loadable(
  lazy(() => import('@/pages/CreateGroupPage.tsx'))
);
const WidgetConfigurationPage = Loadable(
  lazy(() => import('@/pages/WidgetConfigurationPage.tsx'))
);
const WidgetEditorPage = Loadable(
  lazy(() => import('@/pages/WidgetEditorPage.tsx'))
);
const MainDashboardPage = Loadable(
  lazy(() => import('@/pages/MainDashboardPage.tsx'))
);
const MainControlPanelPage = Loadable(
  lazy(() => import('@/pages/MainControlPanelPage.tsx'))
);
const SolutionTemplates = Loadable(
  lazy(() => import('@/pages/SolutionTemplatesPage.tsx'))
);
const TemplatePreviewPage = Loadable(
  lazy(() => import('@/pages/TemplatePreviewPage.tsx'))
);
const CreateTemplatePage = Loadable(
  lazy(() => import('@/pages/CreateTemplatePage.tsx'))
);
const FloorPlans = Loadable(lazy(() => import('@/pages/FloorPlanPage.tsx')));
const FloorMapCreatePage = Loadable(
  lazy(() => import('@/pages/FloorMapCreatePage.tsx'))
);
const MultiFloorBuildingViewPage = Loadable(
  lazy(() => import('@/pages/MultiFloorBuildingViewPage.tsx'))
);
const FloorMapSettingsPage = Loadable(
  lazy(() => import('@/pages/FloorMapSettingsPage.tsx'))
);
const AnalyticsPage = Loadable(lazy(() => import('@/pages/AnalyticsPage.tsx')));
const BuildingHierarchyChartPage = Loadable(
  lazy(() => import('@/pages/BuildingHierarchyChartPage.tsx'))
);
const AlertConfigurationPage = Loadable(
  lazy(() => import('@/pages/AlertConfigurationPage.tsx'))
);
const FloorMapHistoryPage = Loadable(
  lazy(() => import('@/pages/FloorMapHistoryPage.tsx'))
);
const ReportTemplatesPage = Loadable(
  lazy(() => import('@/pages/ReportTemplatesPage.tsx'))
);

export const solutionRoutes = [
  // --------------------Solutions dashboards Routes --------------------
  {
    path: '/solution-dashboards',
    element: <FeatureRoute feature="solutionDashboards" />,
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
    element: <FeatureRoute feature="solutionTemplates" />,
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
  // ----------------------- floor plans ------------------------
  {
    path: '/floor-plans',
    element: <FeatureRoute feature="floorPlans" />,
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
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'hierarchy',
        element: <BuildingHierarchyChartPage />,
      },
      {
        path: 'alert-configuration',
        element: <AlertConfigurationPage />,
      },
      {
        path: 'history',
        element: <FloorMapHistoryPage />,
      },
      {
        path: 'report-templates',
        element: <ReportTemplatesPage />,
      },
    ],
  },
];
