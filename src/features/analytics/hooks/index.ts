import { useQuery } from '@tanstack/react-query';
import { analyticsApi, DeviesAnaltyisParams } from '@/services/api';

export const useSystemAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'system'],
    queryFn: () => analyticsApi.getSystemAnalytics(),
  });
};

export const useTimeSeries = (query: any) => {
  return useQuery({
    queryKey: ['analytics', 'timeseries', query],
    queryFn: () => analyticsApi.getTimeSeries(query),
    enabled: !!query.entityId,
  });
};
export const useDevicesAnalytics = (params: DeviesAnaltyisParams) => {
  return useQuery({
    queryKey: ['analytics', 'devices', params],
    queryFn: async () => {
      const ApiResponse = await analyticsApi.getDevicesAnalytics(params);
      return ApiResponse.data.data;
    },
  });
};
// get device details by id
export const useDeviceDetails = (deviceId: string) => {
  return useQuery({
    queryKey: ['analytics', 'device', deviceId],
    queryFn: () => analyticsApi.getDeviceAnalytics(deviceId),
    enabled: !!deviceId,
  });
};
export const useDeviceAnalytics = (
  deviceId: string,
  startTime: number,
  endTime: number
) => {
  return useQuery({
    queryKey: ['analytics', 'device', deviceId, startTime, endTime],
    queryFn: () => analyticsApi.getDeviceAnalytics(deviceId),
    enabled: !!deviceId,
  });
};

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const ApiResponse = await analyticsApi.getAnalyticsOverview();
      return ApiResponse.data.data;
    },
  });
};
