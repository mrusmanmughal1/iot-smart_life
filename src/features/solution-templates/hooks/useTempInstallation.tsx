import { useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionTemplatesApi } from '../services/solution-templates.api';
import toast from 'react-hot-toast';

export const useTempInstallation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      installationName,
    }: {
      id: string;
      installationName?: string;
    }) => solutionTemplatesApi.install(id, installationName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['solution-templates'],
      });
      queryClient.invalidateQueries({
        queryKey: ['dashboards'],
      });
      toast.success('Solution template installed successfully');
    },
    onError: () => {
      toast.error('Failed to install solution template');
    },
  });
};
