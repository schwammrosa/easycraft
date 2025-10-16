import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'gold' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  className = '', 
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-primary-medium text-text-primary',
    success: 'bg-accent-green/20 text-accent-green border border-accent-green/50',
    error: 'bg-accent-red/20 text-accent-red border border-accent-red/50',
    warning: 'bg-accent-gold/20 text-accent-gold border border-accent-gold/50',
    info: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50',
    gold: 'bg-accent-gold text-white font-bold shadow-glow-sm',
    purple: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
