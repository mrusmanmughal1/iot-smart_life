import apiClient from '@/lib/axios';

export enum IntegrationType {
  WEBHOOK = 'webhook',
  MQTT = 'mqtt',
  HTTP = 'http',
  KAFKA = 'kafka',
  AWS_IOT = 'aws_iot',
  AZURE_IOT = 'azure_iot',
  GOOGLE_CLOUD = 'google_cloud',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  TESTING = 'testing',
}

export interface IntegrationConfig {
  url?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  certificate?: string;
  headers?: Record<string, string>;
  [key: string]: any;
}

export interface Integration {
  id: string;
  name: string;
  description?: string;
  type: IntegrationType;
  config: IntegrationConfig;
  status: IntegrationStatus;
  enabled: boolean;
  lastSync?: string;
  errorMessage?: string;
  userId: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationQuery {
  search?: string;
  type?: IntegrationType;
  status?: IntegrationStatus;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const integrationsApi = {
  // Get all integrations
  getAll: (params?: IntegrationQuery) =>
    apiClient.get<PaginatedResponse<Integration>>('/integrations', { params }),

  // Get integration by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Integration>>(`/integrations/${id}`),

  // Create integration
  create: (data: Partial<Integration>) =>
    apiClient.post<ApiResponse<Integration>>('/integrations', data),

  // Update integration
  update: (id: string, data: Partial<Integration>) =>
    apiClient.patch<ApiResponse<Integration>>(`/integrations/${id}`, data),

  // Delete integration
  delete: (id: string) => apiClient.delete(`/integrations/${id}`),

  // Toggle integration
  toggle: (id: string) =>
    apiClient.post<ApiResponse<Integration>>(`/integrations/${id}/toggle`),

  // Test integration
  test: (id: string) =>
    apiClient.post<ApiResponse<{ success: boolean; message?: string }>>(
      `/integrations/${id}/test`
    ),

  // Sync integration
  sync: (id: string) =>
    apiClient.post<ApiResponse<any>>(`/integrations/${id}/sync`),

  // Get integration logs
  getLogs: (id: string, page?: number, limit?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/integrations/${id}/logs`, {
      params: { page, limit },
    }),

  // Get statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<any>>('/integrations/statistics'),

  // Get by type
  getByType: (type: IntegrationType) =>
    apiClient.get<ApiResponse<Integration[]>>(`/integrations/type/${type}`),
};