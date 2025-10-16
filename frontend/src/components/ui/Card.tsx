import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className = '', 
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-bg-panel border border-primary-medium',
    highlighted: 'bg-bg-panel border-2 border-accent-gold shadow-glow-sm',
    glass: 'bg-bg-panel/50 backdrop-blur-md border border-white/10',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-lg transition-all ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action, className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`} {...props}>
      <div className="flex-1">
        {title && <h3 className="text-xl font-bold text-accent-gold">{title}</h3>}
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export function CardBody({ className = '', children, ...props }: CardBodyProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-4 border-t border-primary-medium ${className}`} {...props}>
      {children}
    </div>
  );
}
