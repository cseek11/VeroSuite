import React, { useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
  autoDismiss?: number; // milliseconds
  icon?: React.ComponentType<{ className?: string }>;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
  dismissible = false,
  autoDismiss,
  icon: CustomIcon
}) => {
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, visible, onClose]);

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle
  };

  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    danger: 'bg-red-50 text-red-800 border-red-200'
  };

  const Icon = CustomIcon || icons[type];

  if (!visible) return null;

  return (
    <div className={`p-4 rounded-xl border ${colors[type]} ${className} transition-all duration-300`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {(dismissible || onClose) && (
          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="ml-3 p-1 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
