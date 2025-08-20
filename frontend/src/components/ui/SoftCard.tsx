import React from 'react';

interface SoftCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  headerActions?: React.ReactNode[];
  footer?: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const SoftCard: React.FC<SoftCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  variant = 'default',
  color = 'primary',
  size = 'md',
  headerActions,
  footer,
  onClose,
  showCloseButton = false
}) => {
  const baseClasses = 'relative flex flex-col min-w-0 break-words bg-white bg-clip-border rounded-xl shadow-soft-xl shadow-soft-xl';
  
  const variantClasses = {
    default: 'bg-white border-0',
    gradient: `bg-gradient-to-tl from-${color}-500 to-${color === 'primary' ? 'violet' : color === 'secondary' ? 'slate' : color}-400 text-white`,
    glass: 'bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-20',
    elevated: 'bg-white border-0 shadow-soft-2xl'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const headerSizeClasses = {
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  };

  const colorClasses = {
    primary: 'from-blue-500 to-violet-500',
    secondary: 'from-slate-600 to-slate-400',
    info: 'from-blue-500 to-cyan-400',
    success: 'from-emerald-500 to-teal-400',
    warning: 'from-orange-500 to-yellow-500',
    error: 'from-red-500 to-pink-500',
    dark: 'from-slate-800 to-slate-600',
    light: 'from-gray-100 to-gray-200'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Header */}
      {(title || subtitle || headerActions || showCloseButton) && (
        <div className={`${headerSizeClasses[size]} border-b border-gray-200 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {title && (
              <div>
                <h3 className={`text-lg font-bold ${variant === 'gradient' ? 'text-white' : 'text-slate-700'}`}>
                  {title}
                </h3>
                {subtitle && (
                  <p className={`text-sm ${variant === 'gradient' ? 'text-white opacity-80' : 'text-slate-500'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {headerActions && (
              <div className="flex space-x-2">
                {headerActions}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  variant === 'gradient' 
                    ? 'hover:bg-white hover:bg-opacity-20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={sizeClasses[size]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`${headerSizeClasses[size]} border-t border-gray-200 bg-gray-50 rounded-b-xl`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default SoftCard;
