import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-main disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-accent-blue hover:bg-accent-blue-dark text-white focus:ring-accent-blue shadow-md hover:shadow-lg active:scale-95',
      secondary: 'bg-primary-medium hover:bg-primary-light text-text-primary focus:ring-primary-light',
      danger: 'bg-accent-red hover:bg-accent-red-dark text-white focus:ring-accent-red shadow-md hover:shadow-lg active:scale-95',
      success: 'bg-accent-green hover:bg-accent-green-dark text-white focus:ring-accent-green shadow-md hover:shadow-lg active:scale-95',
      warning: 'bg-accent-gold hover:bg-accent-gold-dark text-white focus:ring-accent-gold shadow-md hover:shadow-lg active:scale-95 font-bold',
      ghost: 'bg-transparent hover:bg-bg-hover text-text-primary focus:ring-primary-light',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
