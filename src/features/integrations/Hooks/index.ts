import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationsApi } from '@/services/api/integrations.api';
import type {
  IntegrationQuery,
  Integration,
  IntegrationType,
} from '@/services/api/integrations.api';

const INTEGRATIONS_QUERY_KEY = 'integrations';

// Get all integrations
export const useIntegrations = (params?: IntegrationQuery) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await integrationsApi.getAll(params);
      return response.data.data;
    },
  });
};
//get integration stats
export const useIntegrationStats = () => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, 'stats'],
    queryFn: async () => {
      const response = await integrationsApi.getStats();
      return response.data.data;
    },
  });
};

// Get integration by ID
export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await integrationsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create integration
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Integration>) => integrationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
    },
  });
};

// Update integration
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Integration> }) =>
      integrationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [INTEGRATIONS_QUERY_KEY, variables.id],
      });
    },
  });
};

// Delete integration
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
    },
  });
};

// Toggle integration
export const useToggleIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsApi.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY, id] });
    },
  });
};

// Test integration
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => integrationsApi.test(id),
  });
};

// Sync integration
export const useSyncIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => integrationsApi.sync(id),
  });
};

// Get integration logs
export const useIntegrationLogs = (
  id: string,
  page?: number,
  limit?: number
) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, id, 'logs', { page, limit }],
    queryFn: async () => {
      const response = await integrationsApi.getLogs(id, page, limit);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get statistics
export const useIntegrationStatistics = () => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, 'statistics'],
    queryFn: async () => {
      const response = await integrationsApi.getStatistics();
      return response.data.data;
    },
  });
};

// Get by type
export const useIntegrationsByType = (type: IntegrationType) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, 'type', type],
    queryFn: async () => {
      const response = await integrationsApi.getByType(type);
      return response.data.data;
    },
    enabled: !!type,
  });
};
