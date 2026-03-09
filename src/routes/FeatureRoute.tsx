import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { SubscriptionFeatures } from '@/types/authentication';
import { DASHBOARD_ROUTES } from '@/utils/constants/routes';

interface FeatureRouteProps {
  feature: keyof SubscriptionFeatures;
}

/**
 * FeatureRoute component to restrict access to routes based on subscription features.
 * If the user has the required feature enabled, it renders the child routes (Outlet).
 * Otherwise, it redirects to the dashboard.
 */
export const FeatureRoute: React.FC<FeatureRouteProps> = ({ feature }) => {
  const { features } = useAppStore();

  if (!features || features[feature] !== true) {
    // If feature is disabled or features object is not available, redirect to dashboard
    return <Navigate to={DASHBOARD_ROUTES.OVERVIEW} replace />;
  }

  return <Outlet />;
};
