import React from 'react';
import { useTranslation } from 'react-i18next';

export const SidebarFooter: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-16 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-transparent flex items-center justify-center">
      <div className="text-xs text-white/70 text-center space-y-0.5">
        <p className="font-medium">{t('nav.smartLifeIoTPlatform')}</p>
        <p className="text-white/50">{t('nav.version')}</p>
      </div>
    </div>
  );
};