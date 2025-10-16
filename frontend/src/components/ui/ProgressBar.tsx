import { HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max: number;
  variant?: 'default' | 'health' | 'experience' | 'mana';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: 'bg-accent-blue',
    health: percentage > 50 ? 'bg-accent-green' : percentage > 25 ? 'bg-accent-gold' : 'bg-accent-red',
    experience: 'bg-accent-purple',
    mana: 'bg-accent-blue',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={className} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="text-text-secondary">{label}</span>
          <span className="font-bold text-text-primary">
            {Math.floor(value)}/{Math.floor(max)}
          </span>
        </div>
      )}
      <div className={`w-full bg-bg-dark rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full transition-all duration-500 ${variants[variant]} ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
