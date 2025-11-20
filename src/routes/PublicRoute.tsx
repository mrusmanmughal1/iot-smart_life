import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/utils/constants/routes';

export const PublicRoute = () => {
  const { isAuthenticated } = useAppStore();

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    return <Navigate to={ROUTES.OVERVIEW} replace />;
  }

  return <Outlet />;
};