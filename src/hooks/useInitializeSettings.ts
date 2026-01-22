import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { settingsService } from '@/features/settings/services/settingsService';
import { useThemeStore } from '@/stores/useThemeStore';
import { useTranslation } from 'react-i18next';
import type { GeneralSettings } from '@/features/settings/types/settings.types';

/**
 * Hook to initialize user settings from API after login
 * Fetches settings and syncs theme and language to theme store before UI renders
 */
export const useInitializeSettings = () => {
  const { isAuthenticated } = useAppStore();
  const { syncFromApi } = useThemeStore();
  const { i18n } = useTranslation();

  const { data: settings, isLoading } = useQuery<GeneralSettings>({
    queryKey: ['generalSettings', 'initialize'],
    queryFn: settingsService.getGeneralSettings,
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  useEffect(() => {
    if (settings && isAuthenticated) {
      // Sync theme from API (map 'system' to 'auto')
      if (settings.theme) {
        const themeForStore =  settings.theme;
        syncFromApi({ theme: themeForStore });
      }

      // Sync language from API
      if (settings.language) {
        syncFromApi({ language: settings.language });
        // Update i18n language immediately
        i18n.changeLanguage(settings.language);
      }
    }
  }, [settings, isAuthenticated, syncFromApi, i18n]);

  return { isLoading };
};
