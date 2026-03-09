import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import WidgetsBundle from '@/pages/WidgetsBundle.tsx';
import Widgets from '@/pages/WidgetsPage.tsx';
import ImageLibrary from '@/pages/ImageLibraryPage.tsx';
import ScriptLibrary from '@/pages/ScriptLibrary.tsx';

export const resourceRoutes = [
  {
    path: '/widgets-bundle',
    element: <FeatureRoute feature="widgets" />,
    children: [
      {
        index: true,
        element: <WidgetsBundle />,
      },
    ],
  },
  {
    path: '/widgets',
    element: <FeatureRoute feature="widgets" />,
    children: [
      {
        index: true,
        element: <Widgets />,
      },
    ],
  },
  {
    path: '/images',
    element: <FeatureRoute feature="imageLibrary" />,
    children: [
      {
        index: true,
        element: <ImageLibrary />,
      },
    ],
  },
  {
    path: '/javascript-library',
    element: <FeatureRoute feature="scriptLibrary" />,
    children: [
      {
        index: true,
        element: <ScriptLibrary />,
      },
    ],
  },
];
