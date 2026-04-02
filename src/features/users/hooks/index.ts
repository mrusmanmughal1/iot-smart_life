import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, rolesApi, devicesApi } from '@/services/api';
import { userService } from '../services/usersService';
import type { User, UserQuery } from '@/services/api/users.api';

type RoleQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tenantId?: string;
};

export const useUsers = (params?: UserQuery) => {
  // only allow the params with value to be passed
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );
  return useQuery({
    queryKey: ['users', filteredParams],
    queryFn: async () => {
      const response = await usersApi.getAll(filteredParams);
      return response.data.data;
    },
  });
};
//search users
export const useSearchUsers = (
  query: string,
  page?: number,
  limit?: number
) => {
  return useQuery({
    queryKey: ['users', 'search', query, page, limit],
    queryFn: async () => {
      const response = await usersApi.search(query, page, limit);
      return response.data.data;
    },
  });
};
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.getCurrentUser(),
  });
};

export const useRoles = (params?: RoleQuery) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const response = await rolesApi.getAll(params);
      return response.data.data;
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => rolesApi.delete(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userData,
      roleId,
    }: {
      userData: Partial<User>;
      roleId: string;
    }) => userService.createUserWithRole(userData, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useBulkUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userIds, status }: { userIds: string[]; status: string }) =>
      usersApi.bulkUpdateStatus(userIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      usersApi.updateStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
//get devices by customer id
export const useDevicesByCustomerId = (customerId: string) => {
  return useQuery({
    queryKey: ['devices', 'customer', customerId],
    queryFn: async () => {
      const response = await devicesApi.getByCustomerId(customerId);
      return response.data.data;
    },
  });
};
