import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/services/api/customers.api.ts';
import type { CreateCustomerData, CustomerQuery } from '../types';

/**
 * Hook to fetch all customers
 */
export const useCustomers = (params?: CustomerQuery) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const res = await customersApi.getAll(params);
      return res.data.data;
    },
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useCustomer = (customerId: string | undefined) => {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: async () => {
      const res = await customersApi.getById(customerId!);
      return res.data.data;
    },
    enabled: !!customerId,

  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Partial<CreateCustomerData>;
    }) => customersApi.update(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => customersApi.delete(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

