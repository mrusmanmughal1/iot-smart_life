import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { settingsService } from '../services/settingsService';
import type { GeneralSettings } from '../types/settings.types';
import { useThemeStore } from '@/stores/useThemeStore';

export const useGeneralSettings = () => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { setTheme, setLanguage, syncFromApi } = useThemeStore();

  const { data, isLoading } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: settingsService.getGeneralSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

   

  const updateMutation = useMutation({
    mutationFn: settingsService.updateGeneralSettings,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['generalSettings'], updatedData);
      // Sync updated settings to store
      if (updatedData.theme) {
        syncFromApi({ theme: updatedData.theme });
      }
      if (updatedData.language) {
        syncFromApi({ language: updatedData.language });
        i18n.changeLanguage(updatedData.language);
      }
      toast.success('General settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save general settings');
    },
  });

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    setLanguage(locale);
    updateMutation.mutate({ language: locale });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
    updateMutation.mutate({ theme });
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    updateMutation.mutate({ autoRefreshDashboard: enabled });
  };

  const handleCompactModeToggle = (enabled: boolean) => {
    updateMutation.mutate({ compactMode: enabled });
  };

  const handleSaveAll = (settings: Partial<GeneralSettings>) => {
    // Map legacy autoRefresh to autoRefreshDashboard if needed
    const updateData: Partial<GeneralSettings> = { ...settings };
    if ('autoRefresh' in updateData && !('autoRefreshDashboard' in updateData)) {
      updateData.autoRefreshDashboard = updateData.autoRefresh as boolean;
      delete updateData.autoRefresh;
    }
    updateMutation.mutate(updateData);
  };

  return {
    settings: data,
    isLoading,
    handleLanguageChange,
    handleThemeChange,
    handleAutoRefreshToggle,
    handleCompactModeToggle,
    handleSaveAll,
    isSaving: updateMutation.isPending,
  };
};

