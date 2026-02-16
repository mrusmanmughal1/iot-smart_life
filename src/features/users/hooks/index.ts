import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, rolesApi } from '@/services/api';
import { userService } from '../services/usersService';

export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await usersApi.getAll(params);
      return response.data.data.data;
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

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await rolesApi.getAll();
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
    mutationFn: ({ userData, roleId }: { userData: any; roleId: string }) =>
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