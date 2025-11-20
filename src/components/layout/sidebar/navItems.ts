import {
  LayoutDashboard,
  Smartphone,
  Box,
  Bell,
  BarChart3,
  Users,
  Gauge,
  Layout,
  Package,
  ClipboardList,
  Settings,
  Database,
  LucideIcon,
} from 'lucide-react';

export interface SubMenuItem {
  nameKey: string;
  path: string;
  icon?: LucideIcon;
}

export interface NavItem {
  nameKey: string;
  path?: string;
  icon: LucideIcon;
  subItems?: SubMenuItem[];
  badge?: string;
}

export const getNavItems = (): NavItem[] => [
  { 
    nameKey: 'nav.dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard 
  },
  {
    nameKey: 'nav.objects',
    icon: Database,
    subItems: [
      { nameKey: 'nav.devices', path: '/devices', icon: Smartphone },
      { nameKey: 'nav.assets', path: '/assets', icon: Box },
    ],
  },
  {
    nameKey: 'nav.profiles',
    icon: Gauge,
    subItems: [
      { nameKey: 'nav.deviceProfiles', path: '/profiles/device', icon: Smartphone },
      { nameKey: 'nav.assetProfiles', path: '/profiles/asset', icon: Box },
    ],
  },
  { 
    nameKey: 'nav.dashboards', 
    path: '/dashboards', 
    icon: Layout 
  },
  {
    nameKey: 'nav.widgets',
    icon: Package,
    subItems: [
      { nameKey: 'nav.widgetTypes', path: '/widgets/types' },
      { nameKey: 'nav.widgetsBundle', path: '/widgets/bundles' },
    ],
  },
  { 
    nameKey: 'nav.alarms', 
    path: '/alarms', 
    icon: Bell,
  },
  { 
    nameKey: 'nav.notifications', 
    path: '/notifications', 
    icon: Bell 
  },
  { 
    nameKey: 'nav.analytics', 
    path: '/analytics', 
    icon: BarChart3 
  },
  {
    nameKey: 'nav.audit',
    icon: ClipboardList,
    subItems: [
      { nameKey: 'nav.auditLogs', path: '/audit' },
      { nameKey: 'nav.activity', path: '/audit/activity' },
    ],
  },
  { 
    nameKey: 'nav.usersAndRoles', 
    path: '/users', 
    icon: Users 
  },
  { 
    nameKey: 'nav.settings', 
    path: '/settings', 
    icon: Settings 
  },
];