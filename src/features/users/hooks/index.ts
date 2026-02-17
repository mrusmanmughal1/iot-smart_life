import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, rolesApi } from '@/services/api';
import { userService } from '../services/usersService';
import type { User, UserQuery } from '@/services/api/users.api';

type RoleQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tenantId?: string;
};

export const useUsers = (params?: UserQuery) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await usersApi.getAll(params);
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
    mutationFn: ({ userData, roleId }: { userData: Partial<User> & { password: string }; roleId: string }) =>
      userService.createUserWithRole(userData, roleId),
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
    mutationFn: ({ userIds, status }: { userIds: string[]; status: User['status'] }) =>
      usersApi.bulkUpdateStatus(userIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};