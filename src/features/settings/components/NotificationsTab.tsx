import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotificationSettings } from '../hooks';

export function NotificationsTab() {
  const { settings, isLoading, handleToggle, handleSaveAll, isSaving } = useNotificationSettings();

  const emailNotifications = settings?.emailNotifications ?? true;
  const alarmNotifications = settings?.alarmNotifications ?? true;
  const deviceStatusChanges = settings?.deviceStatusChanges ?? true;
  const weeklyReports = settings?.weeklyReports ?? false;

  const handleSave = () => {
    handleSaveAll({
      emailNotifications,
      alarmNotifications,
      deviceStatusChanges,
      weeklyReports,
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
            checked={emailNotifications}
            onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Alarm Notifications</Label>
            <p className="text-sm text-slate-500">Get notified about new alarms</p>
          </div>
          <Switch
            checked={alarmNotifications}
            onCheckedChange={(checked) => handleToggle('alarmNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Device Status Changes</Label>
            <p className="text-sm text-slate-500">Notify when devices go online/offline</p>
          </div>
          <Switch
            checked={deviceStatusChanges}
            onCheckedChange={(checked) => handleToggle('deviceStatusChanges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Reports</Label>
            <p className="text-sm text-slate-500">Receive weekly summary reports</p>
          </div>
          <Switch
            checked={weeklyReports}
            onCheckedChange={(checked) => handleToggle('weeklyReports', checked)}
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

