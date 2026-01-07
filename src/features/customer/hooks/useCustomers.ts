import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/services/api/customers.api.ts';
import type { CustomerQuery } from '../types';

/**
 * Hook to fetch all customers
 */
export const useCustomers = (params?: CustomerQuery) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.getAll(params),
    retry: 2,
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useCustomer = (customerId: string | undefined) => {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => customersApi.getById(customerId!),
    enabled: !!customerId,
    retry: 2,
  });
};

