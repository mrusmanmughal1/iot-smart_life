import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerUsersApi, User } from '../services/customerUser.api';

export const useCreateCustomerUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userData }: { userData: Partial<User> }) =>
      customerUsersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      customerUsersApi.update(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-users'] });
    },
  });
};
