import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/util';
import { NavItem } from './navItems';

interface SidebarNavItemProps {
  item: NavItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onItemClick: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onItemClick,
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = item.subItems?.some(subItem => location.pathname === subItem.path);

  if (item.subItems) {
    return (
      <li>
        <button
          onClick={onToggleExpand}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
            isParentActive
              ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
              : 'text-white/90 hover:bg-white/10 hover:text-white'
          )}
        >
          <div className="flex items-center space-x-3">
            <item.icon 
              size={20} 
              className={cn(
                'transition-all duration-200',
                isParentActive ? 'scale-110' : 'group-hover:scale-110'
              )}
            />
            <span className="text-sm font-medium">{t(item.nameKey)}</span>
          </div>
          {isExpanded ? (
            <ChevronDown size={18} className="transition-transform duration-200" />
          ) : (
            <ChevronRight size={18} className="transition-transform duration-200" />
          )}
        </button>

        {isExpanded && (
          <ul className="mt-1 ml-4 space-y-1 animate-in slide-in-from-top-2">
            {item.subItems.map((subItem) => (
              <li key={subItem.path}>
                <Link
                  to={subItem.path}
                  onClick={onItemClick}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                    isActive(subItem.path)
                      ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-md border-l-4 border-purple-300'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  )}
                >
                  {subItem.icon ? (
                    <subItem.icon 
                      size={16} 
                      className={cn(
                        'transition-all duration-200',
                        isActive(subItem.path) ? 'scale-110 text-purple-200' : 'group-hover:scale-110'
                      )}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                  <span>{t(subItem.nameKey)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.path!}
        onClick={onItemClick}
        className={cn(
          'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
          isActive(item.path!)
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
            : 'text-white/90 hover:bg-white/10 hover:text-white hover:translate-x-1'
        )}
      >
        <div className="flex items-center space-x-3">
          <item.icon 
            size={20} 
            className={cn(
              'transition-all duration-200',
              isActive(item.path!) ? 'scale-110' : 'group-hover:scale-110'
            )}
          />
          <span className="text-sm font-medium">{t(item.nameKey)}</span>
        </div>
        {item.badge && (
          <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full font-semibold shadow-lg animate-pulse">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
};