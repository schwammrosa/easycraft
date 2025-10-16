import { ReactNode } from 'react';
import { Navbar, NavbarProps } from './Navbar';

export interface PageLayoutProps extends NavbarProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  noPadding?: boolean;
}

export function PageLayout({
  children,
  maxWidth = '7xl',
  noPadding = false,
  ...navbarProps
}: PageLayoutProps) {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar {...navbarProps} />
      <main className={`${maxWidths[maxWidth]} mx-auto ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {children}
      </main>
    </div>
  );
}
