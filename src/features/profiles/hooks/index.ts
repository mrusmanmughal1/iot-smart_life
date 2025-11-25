// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { deviceProfilesApi, assetProfilesApi } from '@/services/api';

// export const useDeviceProfiles = (params?: any) => {
//   return useQuery({
//     queryKey: ['profiles', 'device', params],
//     queryFn: () => deviceProfilesApi.getAll(params),
//   });
// };

// export const useAssetProfiles = (params?: any) => {
//   return useQuery({
//     queryKey: ['profiles', 'asset', params],
//     queryFn: () => assetProfilesApi.getAll(params),
//   });
// };

// export const useDeviceProfile = (profileId: string) => {
//   return useQuery({
//     queryKey: ['profiles', 'device', profileId],
//     queryFn: () => deviceProfilesApi.getById(profileId),
//     enabled: !!profileId,
//   });
// };

// export const useAssetProfile = (profileId: string) => {
//   return useQuery({
//     queryKey: ['profiles', 'asset', profileId],
//     queryFn: () => assetProfilesApi.getById(profileId),
//     enabled: !!profileId,
//   });
// };