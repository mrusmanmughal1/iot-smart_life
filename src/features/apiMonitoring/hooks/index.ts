import { useQuery } from '@tanstack/react-query';
import { ApiLogQuery, apiMonitoringApi } from '../services/api-monitoring.api';

export const useGetAPiperfomance = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['api-performance'],
    queryFn: async () => {
      const res = await apiMonitoringApi.getAPiperfomance();
      return res.data.data;
    },
  });
  return { data, isLoading, isError };
};

// get the errors
export const useGetAPIerrors = (params?: ApiLogQuery) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['api-errors', params],
    queryFn: async () => {
      const res = await apiMonitoringApi.getErrors(params);
      return res.data;
    },
  });
  return { data, isLoading, isError };
};
