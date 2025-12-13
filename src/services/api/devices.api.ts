import apiClient from '@/lib/axios';

export enum DeviceType {
  SENSOR = 'sensor',
  GATEWAY = 'gateway',
  CONTROLLER = 'controller',
  ACTUATOR = 'actuator',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  IDLE = 'idle',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

export interface Device {
  connectionType: string;
  additionalInfo: any;
  attributes: any;
  deviceProfileId: any;
  label: any;
  lastActivityTime: any;
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  model?: string;
  manufacturer?: string;
  firmwareVersion?: string;
  location?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  userId: string;
  tenantId?: string;
  createdBy: string;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceQuery {
  search?: string;
  type?: DeviceType;
  status?: DeviceStatus;
  tags?: string[];
  location?: string;
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

export interface DeviceStatistics {
  total: number;
  online: number;
  offline: number;
  byType: Record<DeviceType, number>;
  byStatus: Record<DeviceStatus, number>;
}

export const devicesApi = {
  // Get all devices
  getAll: (params?: DeviceQuery) =>
    apiClient.get<PaginatedResponse<Device>>('/devices', { params }),

  // Get device by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Device>>(`/devices/${id}`),

  // Create device
  create: (data: Partial<Device>) =>
    apiClient.post<ApiResponse<Device>>('/devices', data),

  // Update device
  update: (id: string, data: Partial<Device>) =>
    apiClient.patch<ApiResponse<Device>>(`/devices/${id}`, data),

  // Delete device
  delete: (id: string) => apiClient.delete(`/devices/${id}`),

  // Get device statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<DeviceStatistics>>('/devices/statistics'),

  // Get device telemetry
  getTelemetry: (id: string, keys?: string[], startTs?: number, endTs?: number) =>
    apiClient.get<ApiResponse<any>>(`/devices/${id}/telemetry`, {
      params: { keys: keys?.join(','), startTs, endTs },
    }),

  // Get device attributes
  getAttributes: (id: string, scope?: string) =>
    apiClient.get<ApiResponse<any>>(`/devices/${id}/attributes`, {
      params: { scope },
    }),

  // Send command to device
  sendCommand: (id: string, command: string, params?: any) =>
    apiClient.post<ApiResponse<any>>(`/devices/${id}/command`, {
      command,
      params,
    }),

  // Get device alarms
  getAlarms: (id: string) =>
    apiClient.get<ApiResponse<any[]>>(`/devices/${id}/alarms`),

  // Get device events
  getEvents: (id: string, page?: number, limit?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/devices/${id}/events`, {
      params: { page, limit },
    }),

  // Update device status
  updateStatus: (id: string, status: DeviceStatus) =>
    apiClient.patch<ApiResponse<Device>>(`/devices/${id}/status`, { status }),

  // Bulk delete
  bulkDelete: (ids: string[]) =>
    apiClient.post<ApiResponse<any>>('/devices/bulk/delete', { ids }),

  // Bulk update
  bulkUpdate: (ids: string[], data: Partial<Device>) =>
    apiClient.patch<ApiResponse<any>>('/devices/bulk/update', { ids, data }),

  // Get devices by type
  getByType: (type: DeviceType) =>
    apiClient.get<ApiResponse<Device[]>>(`/devices/type/${type}`),

  // Get devices by status
  getByStatus: (status: DeviceStatus) =>
    apiClient.get<ApiResponse<Device[]>>(`/devices/status/${status}`),

  // Get devices by location
  getByLocation: (location: string) =>
    apiClient.get<ApiResponse<Device[]>>(`/devices/location/${location}`),

  // Clone device
  clone: (id: string, newName: string) =>
    apiClient.post<ApiResponse<Device>>(`/devices/${id}/clone`, {
      name: newName,
    }),

  // Export devices
  export: (format: 'csv' | 'json' | 'xlsx') =>
    apiClient.get(`/devices/export`, {
      params: { format },
      responseType: 'blob',
    }),

  // Import devices
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<{ imported: number; failed: number }>>(
      '/devices/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};