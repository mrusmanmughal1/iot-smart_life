import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/util';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-background border-t border-border py-6 px-6', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} Smart Life IoT Platform. All rights reserved.
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
            <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-xs text-center text-muted-foreground mt-4">
          Built with ❤️ using React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </footer>
  );
};