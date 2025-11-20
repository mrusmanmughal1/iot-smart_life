import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/util';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Devices', href: '/devices' },
  { label: 'Assets', href: '/assets' },
  { label: 'Alarms', href: '/alarms' },
  { label: 'Analytics', href: '/analytics' },
];

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className={cn('flex items-center gap-1 px-6 bg-background border-b border-border', className)}>
      {navItems.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant="ghost"
            className={cn(
              'relative',
              isActive(item.href) && 'text-primary font-medium'
            )}
          >
            {item.label}
            {isActive(item.href) && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Button>
        </Link>
      ))}
    </nav>
  );
};