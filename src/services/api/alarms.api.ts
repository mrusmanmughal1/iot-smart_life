import apiClient from '@/lib/axios.ts';

export enum AlarmSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  WARNING = 'WARNING',
  INDETERMINATE = 'INDETERMINATE',
}

export enum AlarmStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  CLEARED = 'CLEARED',
}

export interface Alarm {
  id: string;
  type: string;
  originatorId: string;
  originatorType: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW';
  severity: AlarmSeverity;
  status: AlarmStatus;
  startTime: string;
  endTime?: string;
  ackTime?: string;
  clearTime?: string;
  details?: Record<string, any>;
  propagate?: boolean;
  tenantId?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlarmQuery {
  search?: string;
  type?: string;
  severity?: AlarmSeverity;
  status?: AlarmStatus;
  originatorId?: string;
  originatorType?: 'DEVICE' | 'ASSET' | 'ENTITY_VIEW';
  tenantId?: string;
  customerId?: string;
  startTime?: string;
  endTime?: string;
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

export const alarmsApi = {
  // Get all alarms
  getAll: (params?: AlarmQuery) =>
    apiClient.get<PaginatedResponse<Alarm>>('/alarms', { params }),

  // Get alarm by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Alarm>>(`/alarms/${id}`),

  // Create alarm
  create: (data: Partial<Alarm>) =>
    apiClient.post<ApiResponse<Alarm>>('/alarms', data),

  // Update alarm
  update: (id: string, data: Partial<Alarm>) =>
    apiClient.patch<ApiResponse<Alarm>>(`/alarms/${id}`, data),

  // Delete alarm
  delete: (id: string) =>
    apiClient.delete(`/alarms/${id}`),

  // Acknowledge alarm
  acknowledge: (id: string) =>
    apiClient.post<ApiResponse<Alarm>>(`/alarms/${id}/acknowledge`),

  // Clear alarm
  clear: (id: string) =>
    apiClient.post<ApiResponse<Alarm>>(`/alarms/${id}/clear`),

  // Bulk acknowledge
  bulkAcknowledge: (alarmIds: string[]) =>
    apiClient.post<ApiResponse<any>>('/alarms/bulk/acknowledge', { alarmIds }),

  // Bulk clear
  bulkClear: (alarmIds: string[]) =>
    apiClient.post<ApiResponse<any>>('/alarms/bulk/clear', { alarmIds }),

  // Get statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<any>>('/alarms/statistics'),

  // Get alarm history
  getHistory: (id: string) =>
    apiClient.get<ApiResponse<any[]>>(`/alarms/${id}/history`),

  // Get alarms by device
  getByDevice: (deviceId: string) =>
    apiClient.get<ApiResponse<Alarm[]>>(`/alarms/device/${deviceId}`),

  // Get alarms by asset
  getByAsset: (assetId: string) =>
    apiClient.get<ApiResponse<Alarm[]>>(`/alarms/asset/${assetId}`),

  // Get active alarms count
  getActiveCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/alarms/active/count'),

  // Get alarms by severity
  getBySeverity: (severity: AlarmSeverity) =>
    apiClient.get<ApiResponse<Alarm[]>>(`/alarms/severity/${severity}`),
};