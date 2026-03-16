import React, { lazy } from 'react';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';

// Import utility page components lazily
const PaymentSuccess = Loadable(
  lazy(() =>
    import('@/components/common/PaymentSuccess/PaymentSuccess.tsx').then(
      (module) => ({ default: module.PaymentSuccess })
    )
  )
);
const WidgetEditorPage = Loadable(
  lazy(() => import('@/pages/WidgetEditorPage.tsx'))
);
const PrivateNotFoundPage = Loadable(
  lazy(() => import('@/pages/PrivateNotFoundPage.tsx'))
);

export const utilityRoutes = [
  {
    path: '/dashboards/:id',
    element: <FeatureRoute feature="widgetEditor" />,
    children: [
      {
        index: true,
        element: <WidgetEditorPage />,
      },
    ],
  },

  {
    path: '*',
    element: <PrivateNotFoundPage />,
  },
];
