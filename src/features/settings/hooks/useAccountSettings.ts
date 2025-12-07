import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';

export const useAccountSettings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['accountSettings'],
    queryFn: settingsService.getAccountSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    settings: data,
    isLoading,
  };
};

