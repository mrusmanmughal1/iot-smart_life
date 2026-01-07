import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { customerService } from '../services/customerService';
import type { CreateCustomerData } from '../types';

/**
 * Hook for creating a new customer
 */
export const useCreateCustomer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
        console.log(data)
      return customerService.createCustomer(data);
    },
    onSuccess: () => {
      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      toast.success('Customer created successfully');
      
      // Navigate to customer management page
      navigate('/customer-management');
    },
    onError: (error: unknown) => {
      console.error('Failed to create customer:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to create customer';
      toast.error(errorMessage);
    },
  });
};

