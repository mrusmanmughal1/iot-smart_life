import React, { lazy } from 'react';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';

// Import inventory page components lazily
const AssetsPage = Loadable(lazy(() => import('@/pages/AssetsPage.tsx')));
const AnalyticsPage = Loadable(lazy(() => import('@/pages/AnalyticsPage.tsx')));
const DeviceAnalyticsPage = Loadable(
  lazy(() => import('@/pages/DeviceAnalyticsPage.tsx'))
);
const IndividualDeviceAnalyticsPage = Loadable(
  lazy(() => import('@/pages/IndividualDeviceAnalyticsPage.tsx'))
);
const AssetDetailsPage = Loadable(
  lazy(() => import('@/pages/AssetDetailsPage.tsx'))
);
const AssetProfiles = Loadable(
  lazy(() => import('@/pages/AssetProfilesPage.tsx'))
);
const AssetProfileDetails = Loadable(
  lazy(() => import('@/pages/AssetProfileDetails.tsx'))
);
const DeviceProfiles = Loadable(
  lazy(() => import('@/pages/DeviceProfilesPage.tsx'))
);
const DeviceProfileDetails = Loadable(
  lazy(() => import('@/pages/DeviceProfileDetails.tsx'))
);

export const inventoryRoutes = [
  //--------devices routes--------
  {
    index: true,
    element: <AnalyticsPage />,
  },
  {
    path: 'devices',
    element: <DeviceAnalyticsPage />,
  },
  {
    path: 'devices/:id',
    element: <IndividualDeviceAnalyticsPage />,
  },
  //  ----------------------- routes for assets -----------------------
  {
    path: '/assets',
    element: <FeatureRoute feature="assets" />,
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
    element: <FeatureRoute feature="profiles" />,
    children: [
      {
        index: true,
        element: <AssetProfiles />,
      },
      {
        path: ':id',
        element: <AssetProfileDetails />,
      },
    ],
  },
  // ------------------ Device-profiles routes ------------------
  {
    path: '/device-profiles',
    element: <FeatureRoute feature="profiles" />,
    children: [
      {
        index: true,
        element: <DeviceProfiles />,
      },
      {
        path: ':id',
        element: <DeviceProfileDetails />,
      },
    ],
  },
];
