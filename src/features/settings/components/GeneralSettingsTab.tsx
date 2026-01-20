import { Globe, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { languages } from '@/i18n/languages';
import { useThemeStore } from '@/stores/useThemeStore';
import type { GeneralSettings } from '../types/settings.types';

export function GeneralSettingsTab({ settings, isLoading, handleLanguageChange, handleAutoRefreshToggle, handleCompactModeToggle, handleSaveAll, isSaving }
  : { settings: any, isLoading: boolean, handleLanguageChange: (locale: string) => void, handleAutoRefreshToggle: (enabled: boolean) => void, handleCompactModeToggle: (enabled: boolean) => void, handleSaveAll: (settings: Partial<GeneralSettings>) => void, isSaving: boolean }) {
  const { t } = useTranslation();

  const currentLanguage = settings?.language;
  const autoRefresh = settings?.autoRefreshDashboard ?? settings?.autoRefresh;
  const compactMode = settings?.compactMode ?? false;
  const { theme, setTheme } = useThemeStore();
  // Handle theme change with API sync
  const handleThemeChange = (value: string) => {
    const newTheme = value as 'light' | 'dark' | 'system';
    setTheme(newTheme);
    handleSaveAll({ theme: newTheme });
  };
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage your general application settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="language"
            className="flex text-gray-600 dark:text-white items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {t('settings.language')}
          </Label>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} >
                  {lang.flag} {lang.name} ({lang.nativeName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="theme"
            className="flex text-gray-600 dark:text-white items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            {t('settings.theme')}
          </Label>
          <Select
            value={settings?.theme || theme}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" >Light</SelectItem>
              <SelectItem value="dark" >Dark</SelectItem>
              <SelectItem value="system" >System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-gray-600 dark:text-white">Auto-refresh Dashboard</Label>
            <p className="text-sm text-slate-500">
              Automatically refresh dashboard data
            </p>
          </div>
          <Switch
            checked={autoRefresh}
            onCheckedChange={handleAutoRefreshToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-gray-600 dark:text-white">Compact Mode</Label>
            <p className="text-sm text-slate-500">
              Display more information in less space
            </p>
          </div>
          <Switch
            checked={compactMode}
            onCheckedChange={handleCompactModeToggle}
          />
        </div>

        <Separator />

      </CardContent>
    </Card>
  );
}
