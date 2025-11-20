import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/services/api';
import { auditService } from '../services/auditServices';

export const useAuditLogs = (params?: any) => {
  return useQuery({
    queryKey: ['audit', 'logs', params],
    queryFn: () => auditApi.getAll(params),
  });
};

export const useUserActivity = (userId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['audit', 'user-activity', userId, days],
    queryFn: () => auditService.getUserActivityReport(userId, days),
    enabled: !!userId,
  });
};

export const useSecurityAudit = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['audit', 'security', startDate, endDate],
    queryFn: () => auditService.getSecurityAuditReport(startDate, endDate),
  });
};