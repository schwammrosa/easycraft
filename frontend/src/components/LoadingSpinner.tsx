interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullscreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  message,
  fullscreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const spinner = (
    <>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-primary-light rounded-full opacity-25"></div>
        <div className="absolute inset-0 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-text-secondary text-center animate-pulse">
          {message}
        </p>
      )}
    </>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-bg-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {spinner}
    </div>
  );
}
