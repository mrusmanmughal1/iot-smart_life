import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GeneralSettings } from '../types/settings.types';

export function NotificationsTab({ 
  handleSaveNotificationSettings, 
  settings, 
  isLoading, 
  isSaving 
}: { 
  handleSaveNotificationSettings: (settings: Partial<GeneralSettings>) => void;
  settings: GeneralSettings | undefined;
  isLoading: boolean;
  isSaving: boolean;
}) {
  // Local state for notification settings
  const [localSettings, setLocalSettings] = useState <Partial<GeneralSettings>>({
    emailNotifications: false,
    alarmNotifications: false,
    deviceStatusNotifications: false,
    weeklyReports: false,
    pushNotifications: false,
  });

  // Sync local state when settings prop changes
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        emailNotifications: settings.emailNotifications ?? true,
        alarmNotifications: settings.alarmNotifications ?? true,
        deviceStatusNotifications: settings.deviceStatusNotifications ?? true,
        weeklyReports: settings.weeklyReports ?? false,
        pushNotifications: settings.pushNotifications ?? true,
      });
    }
  }, [settings]);

  // Update local state when toggles change
  const handleToggle = (key: keyof GeneralSettings, value: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save to API only when save button is clicked
  const handleSave = () => {
    handleSaveNotificationSettings(localSettings);
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
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-slate-500">Receive notifications via email</p>
          </div>
          <Switch
            checked={localSettings.emailNotifications}
            onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Alarm Notifications</Label>
            <p className="text-sm text-slate-500">Get notified about new alarms</p>
          </div>
          <Switch
            checked={localSettings.alarmNotifications}
            onCheckedChange={(checked) => handleToggle('alarmNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Device Status Changes</Label>
            <p className="text-sm text-slate-500">Notify when devices go online/offline</p>
          </div>
          <Switch
            checked={localSettings.deviceStatusNotifications}
            onCheckedChange={(checked) => handleToggle('deviceStatusNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Reports</Label>
            <p className="text-sm text-slate-500">Receive weekly summary reports</p>
          </div>
          <Switch
            checked={localSettings.weeklyReports}
            onCheckedChange={(checked) => handleToggle('weeklyReports', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-slate-500">Receive push notifications</p>
          </div>
          <Switch
            checked={localSettings.pushNotifications}
            onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
          />
        </div>

        <Separator />

        <Button onClick={handleSave} disabled={isSaving} isLoading={isSaving}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

