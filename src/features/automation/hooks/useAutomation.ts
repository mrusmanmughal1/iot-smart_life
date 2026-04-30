import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { automationApi } from '@/services/api/automation.api';

// Get automation stats
export const useAutomationStats = () => {
  return useQuery({
    queryKey: ['automation-statistics'],
    queryFn: async () => {
      const response = await automationApi.getStatistics();
      return response.data.data;
    },
  });
};
// get all automation
export const useAutomations = (params?: any) => {
  return useQuery({
    queryKey: ['automations', params],
    queryFn: async () => {
      const response = await automationApi.getAll(params);
      return response.data;
    },
  });
};
// create automation hook
export const useCreateAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await automationApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
};

// delete automation
export const useDeleteAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await automationApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
};
