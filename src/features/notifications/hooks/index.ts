import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api';

export const useNotifications = (params?: any) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationsApi.getAll(params);
      return response.data.data.data;
    },
  });
};

export const useUnreadCount = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count', userId],
    queryFn: async () => {
      const response = await notificationsApi.getUnreadCount(userId);
      return response.data.data;
    },
    refetchInterval: 30000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
