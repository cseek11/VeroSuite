import React from 'react';
import { X, MoreVertical } from 'lucide-react';

interface EnhancedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode[];
  glass?: boolean;
  onClose?: () => void;
  headerActions?: React.ReactNode[];
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  children,
  className = '',
  actions,
  glass = false,
  onClose,
  headerActions,
  footer,
  variant = 'default',
  size = 'md'
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border-gray-200 shadow-lg hover:shadow-xl',
    outlined: 'bg-white border-gray-300 shadow-none',
    glass: 'bg-white bg-opacity-20 backdrop-blur-lg border-white border-opacity-20 shadow-lg'
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

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Header */}
      {(title || actions || onClose || headerActions) && (
        <div className={`${headerSizeClasses[size]} border-b border-gray-200 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {title && (
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            )}
            {headerActions && (
              <div className="flex space-x-2">
                {headerActions}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actions && (
              <div className="flex space-x-2">
                {actions}
              </div>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
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
        <div className={`${headerSizeClasses[size]} border-t border-gray-200 bg-gray-50`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default EnhancedCard;
