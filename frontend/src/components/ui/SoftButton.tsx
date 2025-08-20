import React from 'react';
import { Loader2 } from 'lucide-react';

interface SoftButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  rounded?: boolean;
}

const SoftButton: React.FC<SoftButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  rounded = false
}) => {
  const baseClasses = 'inline-block font-bold text-center uppercase align-middle transition-all rounded-lg cursor-pointer shadow-md hover:scale-105 active:opacity-85 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0';
  
  const variantClasses = {
    primary: 'bg-gradient-to-tl from-blue-500 to-violet-500 text-white',
    secondary: 'bg-gradient-to-tl from-slate-600 to-slate-400 text-white',
    info: 'bg-gradient-to-tl from-blue-500 to-cyan-400 text-white',
    success: 'bg-gradient-to-tl from-emerald-500 to-teal-400 text-white',
    warning: 'bg-gradient-to-tl from-orange-500 to-yellow-500 text-white',
    error: 'bg-gradient-to-tl from-red-500 to-pink-500 text-white',
    dark: 'bg-gradient-to-tl from-slate-800 to-slate-600 text-white',
    light: 'bg-gradient-to-tl from-gray-100 to-gray-200 text-slate-700',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    ghost: 'bg-transparent text-slate-700 hover:bg-gray-100'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm'
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
  const widthClasses = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${widthClasses} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <Loader2 className="animate-spin w-4 h-4" />}
        {!loading && Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default SoftButton;
