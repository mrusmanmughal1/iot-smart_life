// src/components/layout/Header.tsx - COMPLETE WITH EVERYTHING
import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, Menu, Settings, LogOut, Sun, Moon, Monitor, Globe, Languages } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useThemeStore } from '@/stores/useThemeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useAppStore } from '@/stores/useAppStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { cn } from '@/lib/util';
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { theme, setTheme, effectiveTheme } = useThemeStore();
  const { language, setLanguage, direction } = useLanguageStore();
  const { user, logout } = useAppStore();
  const { notifications } = useNotificationStore();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsThemeOpen(false);
    setIsLanguageOpen(false);
  };
 

  return (
    <header className={cn(
      "h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
      "flex items-center justify-between px-10 sticky top-0 z-30 transition-colors",
      direction === 'rtl' && "flex-row-reverse"
    )}>
      {/* Left Section */}
      <div className={cn(
        "flex items-center gap-4",
        direction === 'rtl' && "flex-row-reverse"
      )}>
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 dark:text-white" />
        </button>
         <div className=" hidden md:block">
          <p className="text-sm font-medium  text-success">Current Subscription</p>
          <p className="text-sm font-medium   ">Smart City Trial</p>
         </div>
      </div>

      {/* Right Section */}
      <div className={cn(
        "flex items-center gap-3",
        direction === 'rtl' && "flex-row-reverse"
      )}>
        {/* Language Switcher */}
         <LanguageSwitcher/>

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
            <div className={cn(
              "absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200",
              "dark:border-gray-700 shadow-lg rounded-xl py-2 z-50 animate-fade-in",
              direction === 'rtl' ? "left-0" : "right-0"
            )}>
              <p className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Theme
              </p>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50",
                  "dark:hover:bg-gray-700 transition-colors",
                  direction === 'rtl' && "flex-row-reverse text-right",
                  theme === 'light' && "bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
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
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50",
                  "dark:hover:bg-gray-700 transition-colors",
                  direction === 'rtl' && "flex-row-reverse text-right",
                  theme === 'dark' && "bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
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
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50",
                  "dark:hover:bg-gray-700 transition-colors",
                  direction === 'rtl' && "flex-row-reverse text-right",
                  theme === 'system' && "bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
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
            <div className={cn(
              "absolute mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg border border-gray-100",
              "dark:border-gray-700 rounded-xl py-2 z-50 animate-fade-in max-h-96 overflow-y-auto",
              direction === 'rtl' ? "left-0" : "right-0"
            )}>
              <p className={cn(
                "px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700",
                direction === 'rtl' && "text-right"
              )}>
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
                        "px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer",
                        "border-b border-gray-100 dark:border-gray-700 last:border-0",
                        direction === 'rtl' && "text-right"
                      )}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{notif.title}</p>
                      {notif.message && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{notif.message}</p>
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
              "flex items-center gap-2 cursor-pointer hover:bg-gray-100",
              "dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors",
              direction === 'rtl' && "flex-row-reverse"
            )}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className={cn("hidden sm:block", direction === 'rtl' && "text-right")}>
              <span className="text-sm font-medium dark:text-white block">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </span>
              {user?.role && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
              )}
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className={cn(
              "absolute mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100",
              "dark:border-gray-700 shadow-lg rounded-xl py-2 z-50 animate-fade-in",
              direction === 'rtl' ? "left-0 text-right" : "right-0"
            )}>
              {user && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                    {user.role}
                  </span>
                </div>
              )}
              
              <Link to="/settings">
                <button className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700",
                  "dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  direction === 'rtl' && "flex-row-reverse"
                )}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600",
                  "dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  direction === 'rtl' && "flex-row-reverse"
                )}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};