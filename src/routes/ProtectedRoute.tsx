import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/utils/constants/routes';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};