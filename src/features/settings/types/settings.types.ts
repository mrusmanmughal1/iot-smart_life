export type TwoFactorMethod = 'email' | 'sms' | 'authenticator' | 'none';

export interface GeneralSettings {
  id?: string;
  userId?: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  autoRefreshDashboard: boolean;
  dashboardRefreshInterval?: number;
  compactMode: boolean;
  // Legacy support
  autoRefresh?: boolean;
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

