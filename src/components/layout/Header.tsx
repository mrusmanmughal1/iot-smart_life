// src/components/layout/Header.tsx - COMPLETE WITH EVERYTHING
import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  User,
  Menu,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/stores/useThemeStore';
import { useRTL } from '@/hooks/useRTL';
import { useAppStore } from '@/stores/useAppStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { cn } from '@/lib/util';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '@/services/api/subscriptions.api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface SubscriptionResponse {
  id: string;
  plan: string;
  status: string;
  billingPeriod: string;
  price: string;
  nextBillingDate: string;
  limits: {
    users: number;
    devices: number;
    storage: number;
    apiCalls: number;
    dataRetention: number;
  };
  usage?: {
    users: number;
    devices: number;
    storage: number;
    apiCalls: number;
  };
  features: {
    support: string;
    analytics: boolean;
    automation: boolean;
    whiteLabel: boolean;
    integrations: boolean;
  };
}

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, effectiveTheme } = useThemeStore();
  const { direction } = useRTL();
  const { user } = useAppStore();
  const { notifications } = useNotificationStore();
  const { mutate: logout } = useLogout();
  const { t } = useTranslation();
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsThemeOpen(false);
  };

  const { data: currentSubscription } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: async () => {
      const response = await subscriptionsApi.getCurrent();
      // Handle nested API response structure: { data: { data: {...} } }
      const apiResponse = response.data as unknown as
        | { data?: SubscriptionResponse }
        | undefined;
      return apiResponse?.data;
    },
    staleTime: Infinity, // Data never becomes stale - only refetch when explicitly invalidated
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 24 hours
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
    refetchInterval: false, // Don't refetch on interval
  });

  // Format plan name for display

  const getPlanDisplayName = (plan?: string): string => {
    if (!plan) return 'No Plan';
    return plan
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format next billing date

  const getNextBillingDate = (): string => {
    if (!currentSubscription?.nextBillingDate) return 'N/A';
    try {
      return format(
        new Date(currentSubscription.nextBillingDate),
        'MMM dd, yyyy'
      );
    } catch {
      return 'N/A';
    }
  };

  return (
    <header
      className={cn(
        'h-20 border-b transition-colors',
        'flex items-center justify-between px-10 sticky top-0 z-30',
        direction === 'rtl' && 'flex-row',
        // Light mode
        effectiveTheme === 'light' && 'bg-white border-gray-200',
        // Dark mode
        effectiveTheme === 'dark' && 'bg-gray-900 border-gray-800',
        // Fallback for Tailwind dark: classes
        'dark:bg-gray-900 dark:border-gray-800 '
      )}
    >
      {/* Left Section */}
      <div
        className={cn(
          'flex items-center gap-4',
          direction === 'rtl' && 'flex-row-reverse '
        )}
      >
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 dark:text-white" />
        </button>
        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('common.currentPlan')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentSubscription
                  ? getPlanDisplayName(currentSubscription.plan)
                  : 'Loading...'}
              </p>
            </div>
            {currentSubscription && (
              <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('common.nextBilling')}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getNextBillingDate()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div
        className={cn(
          'flex items-center gap-3',
          direction === 'rtl' && 'flex-row'
        )}
      >
        {/* Language Switcher */}
        <LanguageSwitcher />
        {/* Theme Switcher */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => {
              setIsThemeOpen(!isThemeOpen);
              closeAllDropdowns();
              setIsThemeOpen(true);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Change theme"
          >
            {effectiveTheme === 'dark' ? (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          {/* Theme Menu */}
          {isThemeOpen && (
            <div
              className={cn(
                'absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200',
                'dark:border-gray-700 shadow-lg rounded-xl py-2 z-50 animate-fade-in',
                direction === 'rtl' ? 'left-0' : 'right-0'
              )}
            >
              <p className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Theme
              </p>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50',
                  'dark:hover:bg-gray-700 transition-colors',
                  direction === 'rtl' && 'flex-row-reverse text-right',
                  theme === 'light' &&
                    'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium'
                )}
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50',
                  'dark:hover:bg-gray-700 transition-colors',
                  direction === 'rtl' && 'flex-row-reverse text-right',
                  theme === 'dark' &&
                    'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium'
                )}
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50',
                  'dark:hover:bg-gray-700 transition-colors',
                  direction === 'rtl' && 'flex-row-reverse text-right',
                  theme === 'system' &&
                    'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium'
                )}
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              closeAllDropdowns();
              setIsNotifOpen(true);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative transition-colors"
          >
            <Bell className="h-5 w-5 dark:text-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div
              className={cn(
                'absolute mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg border border-gray-100',
                'dark:border-gray-700 rounded-xl py-2 z-50 animate-fade-in max-h-96 overflow-y-auto',
                direction === 'rtl' ? 'left-0' : 'right-0'
              )}
            >
              <p
                className={cn(
                  'px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700',
                  direction === 'rtl' && 'text-right'
                )}
              >
                Notifications ({notifications.length})
              </p>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                        'border-b border-gray-100 dark:border-gray-700 last:border-0',
                        direction === 'rtl' && 'text-right'
                      )}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {notif.title}
                      </p>
                      {notif.message && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          {notif.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <button className="block text-center w-full text-xs text-indigo-600 dark:text-indigo-400 py-2 border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  View all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              closeAllDropdowns();
              setIsProfileOpen(true);
            }}
            className={cn(
              'flex items-center gap-2 cursor-pointer hover:bg-gray-100',
              'dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors',
              direction === 'rtl' && 'flex-row-reverse'
            )}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div
              className={cn(
                'hidden sm:block',
                direction === 'rtl' && 'text-right'
              )}
            >
              <span className="text-sm font-medium dark:text-white block">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </span>
              {user?.role && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              className={cn(
                'absolute mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100',
                'dark:border-gray-700 shadow-lg rounded-xl py-2 z-50 animate-fade-in',
                direction === 'rtl' ? 'left-0 text-right' : 'right-0'
              )}
            >
              {user && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                    {user.role}
                  </span>
                </div>
              )}

              <Link to="/settings">
                <button
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700',
                    'dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    direction === 'rtl' && 'flex-row-reverse justify-end'
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('common.settings')}</span>
                </button>
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <button
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600',
                  'dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                  direction === 'rtl' && 'flex-row-reverse justify-end'
                )}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('common.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
