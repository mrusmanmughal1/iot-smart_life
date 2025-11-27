import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardsApi } from '@/services/api';
import { dashboardService } from '../services/dashboardService';

export const useDashboards = (params?: any) => {
  return useQuery({
    queryKey: ['dashboards', params],
    queryFn: () => dashboardsApi.getAll(params),
  });
};

export const useDashboard = (dashboardId: string) => {
  return useQuery({
    queryKey: ['dashboards', dashboardId],
    queryFn: () => dashboardService.loadDashboard(dashboardId),
    enabled: !!dashboardId,
  });
};

export const useSystemOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getSystemOverview(),
    refetchInterval: 30000,
  });
};

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => dashboardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export { useDashboardsPage } from './useDashboardsPage';