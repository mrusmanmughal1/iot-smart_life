import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerUsersApi, User } from '../services/customerUser.api';
import toast from 'react-hot-toast';

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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => customerUsersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-users'] });
    },
  });
};
// hook to asign user to customer
export const useAssignUserToCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      customerId,
    }: {
      userId: string;
      customerId: string;
    }) => customerUsersApi.asignUserToCustomer(userId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-users'] });
      toast.success('User assigned to customer successfully', {
        id: 'user-assigned',
      });
    },
    onError: (error) => {
      console.error('Error assigning user to customer:', error);
      toast.error('Error assigning user to customer', {
        id: 'user-assign-error',
      });
    },
  });
};
