import React from 'react';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button' as const,
  ...props
}) => {
  // Map variants to Tailwind button classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-50 text-gray-700';
      case 'ghost':
        return 'hover:bg-gray-100 text-gray-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-900 hover:bg-gray-800 text-white';
    }
  };

  // Map sizes to Tailwind button classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
