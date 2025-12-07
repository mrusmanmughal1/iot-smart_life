import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { settingsService } from '../services/settingsService';
import type { GeneralSettings } from '../types/settings.types';

export const useGeneralSettings = () => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: settingsService.getGeneralSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: settingsService.updateGeneralSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['generalSettings'], data);
      toast.success('General settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save general settings');
    },
  });

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    updateMutation.mutate({ language: locale });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateMutation.mutate({ theme });
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    updateMutation.mutate({ autoRefresh: enabled });
  };

  const handleCompactModeToggle = (enabled: boolean) => {
    updateMutation.mutate({ compactMode: enabled });
  };

  const handleSaveAll = (settings: Partial<GeneralSettings>) => {
    updateMutation.mutate(settings);
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

