import { ReactNode } from 'react';
import { Button } from './ui/Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-6xl opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} icon={action.icon}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
