import { useTranslation } from 'react-i18next';
import { Settings, Bell, Shield, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import {
  GeneralSettingsTab,
  NotificationsTab,
  SecurityTab,
  AccountTab,
} from '@/features/settings/components';
import { useGeneralSettings } from '@/features/settings/hooks';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    settings,
    isLoading,
    isSaving,
    handleGeneralSettingsSave,
    handleSaveNotificationSettings,
    isSavingNotifications,
    isError
  } = useGeneralSettings();

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <ErrorMessage title="Failed to load settings" onRetry={() => window.location.reload()} />;
  }
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="text-slate-500 mt-2 dark:text-white">
            {t('settings.description')}
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="dark:bg-gray-800 dark:text-white">
            <TabsTrigger value="general" className="dark:text-white">
              <Settings className="h-4 w-4 mr-2" />
              {t('settings.tabs.general')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="dark:text-white">
              <Bell className="h-4 w-4 mr-2" />
              {t('settings.tabs.notifications')}
            </TabsTrigger>
            <TabsTrigger value="security" className="dark:text-white">
              <Shield className="h-4 w-4 mr-2" />
              {t('settings.tabs.security')}
            </TabsTrigger>
            <TabsTrigger value="account" className="dark:text-white">
              <User className="h-4 w-4 mr-2" />
              {t('settings.tabs.account')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettingsTab
              settings={settings}
              isLoading={isLoading}
              isSaving={isSaving}
              handleSaveAll={handleGeneralSettingsSave}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab
              settings={settings}
              isLoading={isLoading}
              handleSaveNotificationSettings={handleSaveNotificationSettings}
              isSaving={isSavingNotifications}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
