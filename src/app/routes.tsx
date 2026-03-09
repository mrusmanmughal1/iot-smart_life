import { createBrowserRouter } from 'react-router-dom';
import {
  ProtectedRoute,
  protectedRoutes,
} from '@/routes/RouteGuards/ProtectedRoute';
import { PublicRoute, publicRoutes } from '@/routes/RouteGuards/PublicRoute';
import { RouteErrorPage } from '@/pages/RouteErrorPage.tsx';

export const router = createBrowserRouter([
  //  --------------------public routes--------------------
  {
    element: <PublicRoute />,
    errorElement: <RouteErrorPage />,
    children: publicRoutes,
  },
  //  --------------------protected routes--------------------

  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: protectedRoutes,
  },
]);
