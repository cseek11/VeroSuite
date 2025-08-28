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
  // Map variants to CRM button classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'crm-btn crm-btn-primary';
      case 'secondary':
        return 'crm-btn crm-btn-secondary';
      case 'outline':
        return 'crm-btn crm-btn-outline';
      case 'ghost':
        return 'crm-btn crm-btn-ghost';
      case 'danger':
        return 'crm-btn crm-btn-danger';
      case 'success':
        return 'crm-btn crm-btn-success';
      default:
        return 'crm-btn crm-btn-default';
    }
  };

  // Map sizes to CRM button classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'crm-btn-sm';
      case 'lg':
        return 'crm-btn-lg';
      default:
        return 'crm-btn-md';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}
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
