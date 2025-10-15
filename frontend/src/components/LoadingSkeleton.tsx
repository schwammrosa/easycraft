interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function LoadingSkeleton({ 
  className = '', 
  count = 1, 
  variant = 'text' 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-bg-panel via-primary-dark to-bg-panel bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    avatar: 'h-16 w-16 rounded-full',
    button: 'h-10 rounded-lg',
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={skeletonClass} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-bg-panel rounded-lg p-6 border border-primary-medium">
      <div className="flex items-start gap-4">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="w-3/4" />
          <LoadingSkeleton className="w-1/2" />
          <LoadingSkeleton variant="text" count={2} />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton className="w-1/4" />
          <LoadingSkeleton className="w-1/2" />
          <LoadingSkeleton className="w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
