import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/api';

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

export const useDeviceAnalytics = (deviceId: string, startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['analytics', 'device', deviceId, startTime, endTime],
    queryFn: () => analyticsApi.getDeviceAnalytics(deviceId, startTime, endTime),
    enabled: !!deviceId,
  });
};