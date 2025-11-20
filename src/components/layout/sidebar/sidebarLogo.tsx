import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const SidebarLogo: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-16 flex items-center px-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg border-2 border-purple-800" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Smart Life</h1>
          <p className="text-xs text-purple-200">{t('nav.smartLifeIoTPlatform')}</p>
        </div>
      </Link>
    </div>
  );
};