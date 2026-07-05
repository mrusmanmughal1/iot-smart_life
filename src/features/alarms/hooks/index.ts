import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alarmsApi } from '@/services/api';
import { alarmService } from '../services/alarmService';
import type { AlarmQuery } from '@/services/api/alarms.api';

export const useAlarms = (params?: AlarmQuery) => {
  return useQuery({
    queryKey: ['alarms', params],
    queryFn: () => alarmsApi.getAll(params),
  });
};

export const useAlarm = (alarmId: string) => {
  return useQuery({
    queryKey: ['alarm', alarmId],
    queryFn: () => alarmsApi.getById(alarmId),
    enabled: !!alarmId,
  });
};

export const useAcknowledgeAlarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ alarmId, comment }: { alarmId: string; comment?: string }) =>
      alarmService.acknowledgeAlarm(alarmId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
  });
};

export const useClearAlarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alarmId,
      resolution,
    }: {
      alarmId: string;
      resolution?: string;
    }) => alarmService.clearAlarm(alarmId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
  });
};

// get alarms statistics
export const useGetStatsAlaram = () => {
  return useQuery({
    queryKey: ['alaramStats'],
    queryFn: async () => {
      const apiresponse = await alarmsApi.getStatistics();
      return apiresponse.data.data;
    },
  });
};
