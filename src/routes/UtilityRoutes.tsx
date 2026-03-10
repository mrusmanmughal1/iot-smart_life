import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { PaymentSuccess } from '@/components/common/PaymentSuccess/PaymentSuccess.tsx';
import WidgetEditorPage from '@/pages/WidgetEditorPage.tsx';
import PrivateNotFoundPage from '@/pages/PrivateNotFoundPage.tsx';
import SubscriptionPlans from '@/pages/SubscriptionPlans';

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
    path: '/payment-status',
    element: <FeatureRoute feature="subscription" />,
    children: [
      {
        index: true,
        element: <PaymentSuccess />,
      },
    ],
  },

  {
    path: '/payment-status',
    element: <FeatureRoute feature="subscription" />,
    children: [
      {
        index: true,
        element: <PaymentSuccess />,
      },
    ],
  },
  {
    path: '*',
    element: <PrivateNotFoundPage />,
  },
];
