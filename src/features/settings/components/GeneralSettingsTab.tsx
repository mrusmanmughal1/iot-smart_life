import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { languages } from '@/i18n/languages';
import { useGeneralSettings } from '../hooks';

export function GeneralSettingsTab() {
  const { t, i18n } = useTranslation();
  const {
    settings,
    isLoading,
    handleLanguageChange,
    handleAutoRefreshToggle,
    handleCompactModeToggle,
    handleSaveAll,
    isSaving,
  } = useGeneralSettings();

  const currentLanguage = settings?.language || i18n.language;
  const currentTheme = settings?.theme || 'light';
  const autoRefresh = settings?.autoRefresh ?? true;
  const compactMode = settings?.compactMode ?? false;

  const handleSave = () => {
    handleSaveAll({
      language: currentLanguage,
      theme: currentTheme as 'light' | 'dark' | 'system',
      autoRefresh,
      compactMode,
    });
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
        <CardDescription>Manage your general application settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('settings.language')}
          </Label>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="theme">{t('settings.theme')}</Label>
          <Select value={currentTheme}  >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-refresh Dashboard</Label>
            <p className="text-sm text-slate-500">
              Automatically refresh dashboard data
            </p>
          </div>
          <Switch checked={autoRefresh} onCheckedChange={handleAutoRefreshToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact Mode</Label>
            <p className="text-sm text-slate-500">
              Display more information in less space
            </p>
          </div>
          <Switch checked={compactMode} onCheckedChange={handleCompactModeToggle} />
        </div>

        <Separator />

        <Button onClick={handleSave} disabled={isSaving} isLoading={isSaving}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

