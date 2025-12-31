// Sidebar.tsx - INTEGRATED WITH ROUTES
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/util';
import { useRTL } from '@/hooks/useRTL';
import Image from '@/assets/images/smartlife-text-white.png';
import {
  LayoutDashboard,
  Smartphone,
  Box,
  Bell,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  Share2,
  Activity,
  Layers,
  Calendar,
  CreditCard,
  PiIcon,
  BotIcon,
  TvIcon,
  FlowerIcon,
  DamIcon,
  PiSquare,
  FanIcon,
  ImageIcon,
  SuperscriptIcon,
  FolderKanbanIcon,
  History,
} from 'lucide-react';

interface NavItem {
  titleKey: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const getNavItems = (): NavItem[] => [
  {
    titleKey: 'nav.overview',
    href: '/dashboard',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.solutionTemplates',
    href: '/solution-templates',
    icon: <DamIcon className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.solutionDashboards',
    href: '/solution-dashboards',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.profiles',
    icon: <PiSquare className="h-5 w-5" />,
    children: [
      {
        titleKey: 'nav.deviceProfiles',
        href: '/device-profiles',
        icon: <Smartphone className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.assetProfiles',
        href: '/asset-profiles',
        icon: <Box className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: 'nav.objects',
    icon: <Box className="h-5 w-5" />,
    children: [
      {
        titleKey: 'nav.devices',
        href: '/devices',
        icon: <Smartphone className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.assets',
        href: '/assets',
        icon: <Box className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: 'nav.floorPlans',
    icon: <FlowerIcon className="h-5 w-5" />,
    children: [
      {
        titleKey: 'nav.viewFloorPlans',
        href: '/floor-plans',
        icon: <Box className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.analytics',
        icon: <BarChart3 className="h-4 w-4" />,
        children: [
          {
            titleKey: 'nav.deviceAnalytics',
            href: '/floor-plans/analytics',
            icon: <BarChart3 className="h-4 w-4" />,
          },
          {
            titleKey: 'nav.hierarchyChart',
            href: '/floor-plans/hierarchy',
            icon: <Layers className="h-4 w-4" />,
          },
          {
            titleKey: 'nav.alertConfiguration',
            href: '/floor-plans/alert-configuration',
            icon: <Bell className="h-4 w-4" />,
          },
          {
            titleKey: 'nav.history',
            href: '/floor-plans/history',
            icon: <History className="h-4 w-4" />,
          },
        ],
      },
      {
        titleKey: 'nav.settings',
        href: '/floor-plans/settings',
        icon: <Settings className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.reportTemplates',
        href: '/floor-plans/report-templates',
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: 'nav.alerts',
    href: '/alarms',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.usersAndRoles',
    icon: <Users className="h-5 w-5" />,
    children: [
      {
        titleKey: 'nav.usersAndRoles',
        href: '/users-management',
        icon: <Users className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.customerUserAssociation',
        href: '/users-management/customer-user-association',
        icon: <Users className="h-4 w-4" />,
      },
      
      {
        titleKey: 'nav.customerAdministrator',
        href: '/users-management/customer-administrator',
        icon: <Users className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.rolePermissionManagement',
        href: '/users-management/role-permission-management',
        icon: <Users className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.assignPermissions',
        href: '/users-management/assign-permissions',
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: 'nav.automation',
    href: '/automation',
    icon: <PiIcon className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.integrations',
    href: '/integrations',
    icon: <BotIcon className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.edgeManagementCenter',
    href: '/edge-management',
    icon: <TvIcon className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.scheduleManagement',
    href: '/schedule-management',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    titleKey: 'nav.resources',
    children: [
      {
        titleKey: 'nav.widgetsBundle',
        href: '/widgets-bundle',
        icon: <FolderKanbanIcon className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.widgets',
        href: '/widgets',
        icon: <FanIcon className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.imageLibrary',
        href: '/images',
        icon: <ImageIcon className="h-4 w-4" />,
      },
      {
        titleKey: 'nav.javascriptLibrary',
        href: '/javascript-library',
        icon: <SuperscriptIcon className="h-4 w-4" />,
      },
    ],
    icon: <Layers className="h-4 w-4" />,
  },
  {
    titleKey: 'nav.notifications',
    href: '/notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.sharingCenter',
    href: '/sharing-center',
    icon: <Share2 className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.apiMonitoring',
    href: '/api-monitoring',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.auditLogs',
    href: '/audit',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.subscriptionPlans',
    href: '/subscription-plans',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    titleKey: 'nav.settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { direction } = useRTL();
  const location = useLocation();
  const navItems = getNavItems();
  const isRTL = direction === 'rtl';

  const isActive = (href: string) => location.pathname === href;

  const isParentActive = (children?: NavItem[]): boolean => {
    if (!children) return false;
    return children.some((child) => {
      if (child.href && location.pathname === child.href) return true;
      if (child.children) return isParentActive(child.children);
      return false;
    });
  };

  // Recursive function to find all active parent keys
  const findActiveParents = (
    items: NavItem[],
    parentKey?: string
  ): string[] => {
    const activeKeys: string[] = [];

    items.forEach((item) => {
      const currentKey = parentKey
        ? `${parentKey}.${item.titleKey}`
        : item.titleKey;

      if (item.children) {
        const hasActiveChild = item.children.some((child) => {
          if (child.href && location.pathname === child.href) return true;
          if (child.children) {
            const nestedActive = findActiveParents([child], currentKey);
            return nestedActive.length > 0;
          }
          return false;
        });

        if (hasActiveChild) {
          activeKeys.push(item.titleKey);
          if (parentKey) {
            activeKeys.push(parentKey);
          }
        }

        // Recursively check nested children
        const nestedKeys = findActiveParents(item.children, item.titleKey);
        activeKeys.push(...nestedKeys);
      }
    });

    return [...new Set(activeKeys)]; // Remove duplicates
  };

  // Initialize expanded items based on active children
  const getActiveParents = () => {
    return findActiveParents(navItems);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    getActiveParents()
  );

  // Update expanded items when location changes
  useEffect(() => {
    const activeParents = getActiveParents();
    setExpandedItems(activeParents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleExpand = (titleKey: string) => {
    setExpandedItems((prev: string[]) =>
      prev.includes(titleKey)
        ? prev.filter((item: string) => item !== titleKey)
        : [...prev, titleKey]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 z-50 h-screen w-64 bg-primary flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          isRTL ? 'right-0' : 'left-0',
          'lg:translate-x-0',
          isOpen
            ? 'translate-x-0'
            : isRTL
            ? 'translate-x-full'
            : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className=" p-5 flex items-center justify-between px-4   border-white/10 flex-shrink-0">
          <img
            src={Image}
            alt="Smart Life"
            className="h-16 w-auto object-contain mx-auto "
          />
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto sidebar-scroll py-4 px-3',
            'transition-all duration-200 ease-in-out',
            '[&::-webkit-scrollbar]:hidden',
            '[scrollbar-width:none]'
          )}
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.titleKey}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.titleKey)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all',
                        isParentActive(item.children)
                          ? 'bg-white/20 text-white'
                          : 'text-white/90 hover:bg-white/10'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-sm font-medium">
                          {t(item.titleKey)}
                        </span>
                      </div>
                      {expandedItems.includes(item.titleKey) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedItems.includes(item.titleKey) && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.children.map((child) => (
                          <div key={child.titleKey}>
                            {child.children ? (
                              <>
                                <button
                                  onClick={() => toggleExpand(child.titleKey)}
                                  className={cn(
                                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all',
                                    isParentActive(child.children)
                                      ? 'bg-white/20 text-white'
                                      : 'text-white/80 hover:bg-white/10'
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    {child.icon}
                                    <span>{t(child.titleKey)}</span>
                                  </div>
                                  {expandedItems.includes(child.titleKey) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </button>
                                {expandedItems.includes(child.titleKey) && (
                                  <div className="mt-1 ml-4 space-y-1">
                                    {child.children.map((subChild) => (
                                      <Link
                                        key={subChild.titleKey}
                                        to={subChild.href!}
                                        onClick={onClose}
                                        className={cn(
                                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all',
                                          isActive(subChild.href!)
                                            ? 'bg-white/20 text-white font-medium'
                                            : 'text-white/70 hover:bg-white/10'
                                        )}
                                      >
                                        {subChild.icon}
                                        <span>{t(subChild.titleKey)}</span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                to={child.href!}
                                onClick={onClose}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                                  isActive(child.href!)
                                    ? 'bg-white/20 text-white font-medium'
                                    : 'text-white/80 hover:bg-white/10'
                                )}
                              >
                                {child.icon}
                                <span>{t(child.titleKey)}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={onClose}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive(item.href!)
                        ? 'bg-white/20 text-white font-medium'
                        : 'text-white/90 hover:bg-white/10'
                    )}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">
                      {t(item.titleKey)}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="h-16 border-t border-white/10 flex items-center justify-center flex-shrink-0">
          <div className="text-center">
            <p className="text-white/80 text-xs font-medium">
              {t('nav.smartLifeIoTPlatform')}
            </p>
            <p className="text-white/50 text-xs">{t('nav.version')}</p>
          </div>
        </div>
      </aside>
    </>
  );
};
