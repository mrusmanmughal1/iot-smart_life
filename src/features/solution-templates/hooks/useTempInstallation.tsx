import { useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionTemplatesApi } from '../services/solution-templates.api';

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
      queryClient.invalidateQueries({ queryKey: ['solution-templates'] });
    },
  });
};
