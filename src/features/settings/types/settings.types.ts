export type TwoFactorMethod = 'email' | 'sms' | 'authenticator' | 'none';

export interface GeneralSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  compactMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  alarmNotifications: boolean;
  deviceStatusChanges: boolean;
  weeklyReports: boolean;
}

export interface SecuritySettings {
  isEnabled: boolean;
  method: TwoFactorMethod;
  phoneNumber: string | null;
  phoneVerified: boolean;
  hasBackupCodes: boolean;
  sessionTimeout?: string;
}

export interface AccountSettings {
  accountType: string;
  storageUsed: number;
  storageTotal: number;
}

