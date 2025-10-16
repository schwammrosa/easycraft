import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-semantic-success/90 text-white shadow-lg',
    error: 'bg-semantic-error/90 text-white shadow-lg',
    warning: 'bg-semantic-warning/90 text-white shadow-lg',
    info: 'bg-semantic-info/90 text-white shadow-lg',
  };

  return (
    <div 
      className={`
        fixed top-4 right-4 z-[100] max-w-md
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl
        animate-in slide-in-from-right duration-300
        ${styles[type]}
      `}
    >
      {icons[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="hover:bg-black/20 rounded p-1 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
