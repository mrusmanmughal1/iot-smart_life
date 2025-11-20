import apiClient from '@/lib/axios.ts';

export interface TimeSeriesData {
  timestamp: number;
  value: number | string | boolean;
}

export interface AnalyticsQuery {
  entityId: string;
  entityType: 'DEVICE' | 'ASSET';
  keys: string[];
  startTime: number;
  endTime: number;
  interval?: number;
  aggregation?: 'AVG' | 'SUM' | 'MIN' | 'MAX' | 'COUNT';
  limit?: number;
}

export interface DeviceAnalytics {
  deviceId: string;
  deviceName: string;
  totalMessages: number;
  activeTime: number;
  lastActivityTime?: string;
  telemetryStats: Record<string, {
    min: number;
    max: number;
    avg: number;
    count: number;
  }>;
}

export interface SystemAnalytics {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  totalAssets: number;
  totalAlarms: number;
  activeAlarms: number;
  totalMessages: number;
  messagesPerHour: number;
  topDevicesByActivity: Array<{
    deviceId: string;
    deviceName: string;
    messageCount: number;
  }>;
  alarmsBySeverity: Record<string, number>;
  devicesByType: Record<string, number>;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const analyticsApi = {
  // Get time series data
  getTimeSeries: (query: AnalyticsQuery) =>
    apiClient.post<ApiResponse<Record<string, TimeSeriesData[]>>>('/analytics/timeseries', query),

  // Get device analytics
  getDeviceAnalytics: (deviceId: string, startTime: number, endTime: number) =>
    apiClient.get<ApiResponse<DeviceAnalytics>>(`/analytics/device/${deviceId}`, {
      params: { startTime, endTime },
    }),

  // Get system analytics
  getSystemAnalytics: () =>
    apiClient.get<ApiResponse<SystemAnalytics>>('/analytics/system'),

  // Get telemetry statistics
  getTelemetryStats: (entityId: string, key: string, startTime: number, endTime: number) =>
    apiClient.get<ApiResponse<any>>('/analytics/telemetry/stats', {
      params: { entityId, key, startTime, endTime },
    }),

  // Get device activity report
  getDeviceActivityReport: (startTime: number, endTime: number) =>
    apiClient.get<ApiResponse<any[]>>('/analytics/reports/device-activity', {
      params: { startTime, endTime },
    }),

  // Get alarm analytics
  getAlarmAnalytics: (startTime: number, endTime: number) =>
    apiClient.get<ApiResponse<any>>('/analytics/alarms', {
      params: { startTime, endTime },
    }),

  // Get usage analytics
  getUsageAnalytics: (startTime: number, endTime: number) =>
    apiClient.get<ApiResponse<any>>('/analytics/usage', {
      params: { startTime, endTime },
    }),

  // Generate custom report
  generateReport: (config: {
    name: string;
    type: string;
    startTime: number;
    endTime: number;
    filters?: Record<string, any>;
  }) =>
    apiClient.post<ApiResponse<any>>('/analytics/reports/generate', config),

  // Export analytics data
  exportData: (query: AnalyticsQuery, format: 'CSV' | 'JSON' | 'EXCEL') =>
    apiClient.post<Blob>('/analytics/export', { query, format }, {
      responseType: 'blob',
    }),

  // Get real-time statistics
  getRealTimeStats: () =>
    apiClient.get<ApiResponse<any>>('/analytics/realtime'),

  // Get aggregated data
  getAggregatedData: (
    entityId: string,
    keys: string[],
    startTime: number,
    endTime: number,
    aggregation: 'AVG' | 'SUM' | 'MIN' | 'MAX',
    interval: number
  ) =>
    apiClient.get<ApiResponse<any>>('/analytics/aggregate', {
      params: { entityId, keys: keys.join(','), startTime, endTime, aggregation, interval },
    }),
};