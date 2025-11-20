import apiClient from '@/lib/axios';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface ApiLog {
  id: string;
  method: HttpMethod;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  requestBody?: any;
  responseBody?: any;
  error?: string;
  createdAt: string;
}

export interface ApiMetrics {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  errorRate: number;
  slowestEndpoints: Array<{ endpoint: string; avgTime: number }>;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  database: boolean;
  cache: boolean;
  queue: boolean;
  timestamp: string;
}

export interface ApiLogQuery {
  method?: HttpMethod;
  endpoint?: string;
  statusCode?: number;
  userId?: string;
  startDate?: string;
  endDate?: string;
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

export const apiMonitoringApi = {
  // Get API logs
  getLogs: (params?: ApiLogQuery) =>
    apiClient.get<PaginatedResponse<ApiLog>>('/api-monitoring/logs', {
      params,
    }),

  // Get log by ID
  getLogById: (id: string) =>
    apiClient.get<ApiResponse<ApiLog>>(`/api-monitoring/logs/${id}`),

  // Get metrics
  getMetrics: (startDate?: string, endDate?: string) =>
    apiClient.get<ApiResponse<ApiMetrics>>('/api-monitoring/metrics', {
      params: { startDate, endDate },
    }),

  // Get health status
  getHealth: () =>
    apiClient.get<ApiResponse<HealthStatus>>('/api-monitoring/health'),

  // Get error logs
  getErrors: (params?: ApiLogQuery) =>
    apiClient.get<PaginatedResponse<ApiLog>>('/api-monitoring/errors', {
      params,
    }),

  // Get slow requests
  getSlowRequests: (threshold?: number, limit?: number) =>
    apiClient.get<ApiResponse<ApiLog[]>>('/api-monitoring/slow-requests', {
      params: { threshold, limit },
    }),

  // Clear logs
  clearLogs: (beforeDate?: string) =>
    apiClient.delete('/api-monitoring/logs', { params: { beforeDate } }),

  // Get statistics by endpoint
  getEndpointStats: (endpoint: string) =>
    apiClient.get<ApiResponse<any>>(`/api-monitoring/endpoint/${endpoint}`),

  // Get statistics by user
  getUserStats: (userId: string) =>
    apiClient.get<ApiResponse<any>>(`/api-monitoring/user/${userId}`),
};