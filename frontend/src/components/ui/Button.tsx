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
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:shadow-lg';
      case 'outline':
        return 'border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg';
      case 'ghost':
        return 'hover:bg-slate-100 text-slate-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl';
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
        return 'px-3 py-1.5 text-sm';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${getSizeClasses()} ${className}`}
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
