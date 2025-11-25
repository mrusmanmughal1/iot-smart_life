// import { useQuery } from '@tanstack/react-query';
// import { devicesApi } from '@/services/api/index.ts';

// export const useDeviceTelemetry = (deviceId: string, keys?: string[]) => {
//   return useQuery({
//     queryKey: ['devices', deviceId, 'telemetry', keys],
//     queryFn: () => devicesApi.getTelemetry(deviceId, keys),
//     enabled: !!deviceId,
//     refetchInterval: 5000, // Refresh every 5 seconds for real-time data
//   });
// };

// export const useDeviceAttributes = (deviceId: string) => {
//   return useQuery({
//     queryKey: ['devices', deviceId, 'attributes'],
//     queryFn: () => devicesApi.getAttributes(deviceId),
//     enabled: !!deviceId,
//   });
// };

// export const useDeviceLatestTelemetry = (deviceId: string) => {
//   return useQuery({
//     queryKey: ['devices', deviceId, 'telemetry', 'latest'],
//     queryFn: () => devicesApi.getTelemetry(deviceId),
//     enabled: !!deviceId,
//     refetchInterval: 3000, // Refresh every 3 seconds
//   });
// };