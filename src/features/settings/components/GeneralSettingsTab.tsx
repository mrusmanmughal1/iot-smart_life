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
import type { GeneralSettings } from '../types/settings.types';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';


export function GeneralSettingsTab({ settings, isLoading, handleSaveAll, isSaving }
  : { settings: GeneralSettings | undefined, isLoading: boolean, handleSaveAll: (settings: Partial<GeneralSettings>) => void, isSaving: boolean }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();


  const [localSettings, setLocalSettings] = useState<Partial<GeneralSettings>>({
    language: settings?.language ?? '',
    theme: settings?.theme ?? theme,
    autoRefreshDashboard: settings?.autoRefreshDashboard ?? false,
    compactMode: settings?.compactMode ?? false,
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        language: settings.language ?? '',
        theme: settings.theme ?? theme,
        autoRefreshDashboard: settings.autoRefreshDashboard ?? false,
        compactMode: settings.compactMode ?? false,
      });
      // Update theme store if settings have theme
      if (settings.theme) {
        setTheme(settings.theme);
      }
    }
  }, [settings, setTheme, theme]);

  // Handle language change - update UI immediately but don't call API
  const handleLanguageChange = (value: string) => {
    setLocalSettings({ ...localSettings, language: value });
    // Update i18n language immediately for display
    i18n.changeLanguage(value);
  };

  // Handle theme change - update UI immediately but don't call API
  const handleThemeChange = (value: string) => {
    const themeValue = value as 'light' | 'dark' | 'auto';
    setLocalSettings({ ...localSettings, theme: themeValue });
    // Update theme store immediately for display
    setTheme(themeValue);
  };

  // Only call API when save button is clicked
  const handleAllSettingsSave = () => {
    handleSaveAll(localSettings);
  };
  if (isLoading || !settings) {
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
          <Select value={localSettings.language || 'en'} onValueChange={handleLanguageChange}>
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
            value={localSettings.theme || theme || 'light'}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" >Light</SelectItem>
              <SelectItem value="dark" >Dark</SelectItem>
              <SelectItem value="auto" >Auto</SelectItem>
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
            checked={localSettings.autoRefreshDashboard ?? false}
            onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoRefreshDashboard: checked })}
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
            checked={localSettings.compactMode ?? false}
            onCheckedChange={(checked) => setLocalSettings({ ...localSettings, compactMode: checked })}
          />
        </div>

        <Separator />
        <Button onClick={handleAllSettingsSave} disabled={isSaving} isLoading={isSaving}>
          Apply &  Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
