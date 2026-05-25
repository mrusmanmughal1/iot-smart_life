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
  telemetryStats: Record<
    string,
    {
      min: number;
      max: number;
      avg: number;
      count: number;
    }
  >;
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
// types/systemOverview.ts

export interface SystemOverviewResponse {
  message: string;
  data: SystemOverviewData;
}

export interface SystemOverviewData {
  devices: DeviceStats;
  users: UserStats;
  alarms: AnalyticsAlarmStats;
  telemetry: TelemetryStats;
  timestamp: string; // ISO date string
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
}

export interface UserStats {
  total: number;
}

export interface AnalyticsAlarmStats {
  active: number;
}

export interface TelemetryStats {
  today: number;
}
export const TimeRangeType = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
};
export type TimeRangeType = (typeof TimeRangeType)[keyof typeof TimeRangeType];

export interface DeviesAnaltyisParams {
  period?: TimeRangeType;
  deviceType?: string;
  status?: string;
}

export interface GeoAnalyticsResponse {
  message: string;
  data: GeoAnalyticsData;
}

export interface GeoAnalyticsData {
  regionalStats: GeoStat[];
  locationPerformance: PerformanceMetric[];
  deviceDistribution: DeviceDistribution[];
}

export interface DeviceDistribution {
  lat: number;
  lng: number;
  deviceCount: number;
  dataGB: number;
  region?: string;
}

export interface GeoStat {
  region: string;
  dataGB: number;
  deviceCount: number;
  growthPercent: number;
}

export interface PerformanceMetric {
  region: string;
  alertRate: number;
  avgResponseMs: number;
  dataQualityPercent: number;
  uptimePercent: number;
  status: string;
}

export const analyticsApi = {
  //get analytics overview
  getAnalyticsOverview: () =>
    apiClient.get<ApiResponse<SystemOverviewResponse>>('/analytics/overview'),
  // Get time series data
  getTimeSeries: (query: AnalyticsQuery) =>
    apiClient.post<ApiResponse<Record<string, TimeSeriesData[]>>>(
      '/analytics/timeseries',
      query
    ),

  getDevicesAnalytics: (params: DeviesAnaltyisParams = {}) =>
    apiClient.get<ApiResponse<DeviceAnalytics[]>>('/analytics/devices', {
      params,
    }),

  // Get device analytics
  getDeviceAnalytics: (deviceId: string) =>
    apiClient.get<ApiResponse<DeviceAnalytics>>(
      `/analytics/devices/${deviceId}`
    ),

  // Get system analytics
  getSystemAnalytics: () =>
    apiClient.get<ApiResponse<SystemAnalytics>>('/analytics/system-performance'),

  // Get telemetry statistics
  getTelemetryStats: (
    entityId: string,
    key: string,
    startTime: number,
    endTime: number
  ) =>
    apiClient.get<ApiResponse<any>>('/analytics/telemetry/stats', {
      params: { entityId, key, startTime, endTime },
    }),
  // get details based on the geo
  getgeoDetails: (region?: string) =>
    apiClient.get<ApiResponse<GeoAnalyticsResponse>>('/analytics/geo', {
      params: { region },
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
  }) => apiClient.post<ApiResponse<any>>('/analytics/reports/generate', config),

  // Export analytics data
  exportData: (query: AnalyticsQuery, format: 'CSV' | 'JSON' | 'EXCEL') =>
    apiClient.post<Blob>(
      '/analytics/export',
      { query, format },
      {
        responseType: 'blob',
      }
    ),

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
      params: {
        entityId,
        keys: keys.join(','),
        startTime,
        endTime,
        aggregation,
        interval,
      },
    }),
};
