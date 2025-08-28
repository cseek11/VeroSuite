import React from 'react';
import { cn } from '@/lib/utils';

// ===== CARD COMPONENTS =====
interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, header, footer }) => {
  return (
    <div className={cn('crm-card', className)}>
      {header && <div className="crm-card-header">{header}</div>}
      <div className="crm-card-body">{children}</div>
      {footer && <div className="crm-card-footer">{footer}</div>}
    </div>
  );
};

// ===== BUTTON COMPONENTS =====
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'crm-btn crm-btn-primary',
    secondary: 'crm-btn crm-btn-secondary',
    success: 'crm-btn crm-btn-success',
    danger: 'crm-btn crm-btn-danger',
  };

  const sizeClasses = {
    sm: 'crm-btn-sm',
    md: '',
    lg: 'crm-btn-lg',
  };

  return (
    <button
      type={type}
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ===== FORM COMPONENTS =====
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled,
  error,
  className,
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="crm-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('crm-input', error && 'border-red-500', className)}
      />
      {error && <p className="crm-text-small text-red-600">{error}</p>}
    </div>
  );
};

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled,
  error,
  className,
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="crm-label">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn('crm-textarea', error && 'border-red-500', className)}
      />
      {error && <p className="crm-text-small text-red-600">{error}</p>}
    </div>
  );
};

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
  error,
  className,
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="crm-label">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn('crm-select', error && 'border-red-500', className)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="crm-text-small text-red-600">{error}</p>}
    </div>
  );
};

// ===== STATUS COMPONENTS =====
interface StatusProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const Status: React.FC<StatusProps> = ({ children, variant, className }) => {
  const variantClasses = {
    success: 'crm-status crm-status-success',
    warning: 'crm-status crm-status-warning',
    error: 'crm-status crm-status-error',
    info: 'crm-status crm-status-info',
    neutral: 'crm-status crm-status-neutral',
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};

// ===== LAYOUT COMPONENTS =====
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn('crm-container', className)}>{children}</div>;
};

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, cols = 1, className }) => {
  const gridClasses = {
    1: 'crm-grid',
    2: 'crm-grid-2',
    3: 'crm-grid-3',
    4: 'crm-grid-4',
  };

  return <div className={cn(gridClasses[cols], className)}>{children}</div>;
};

// ===== TYPOGRAPHY COMPONENTS =====
interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, level, className }) => {
  const headingClasses = {
    1: 'crm-heading-1',
    2: 'crm-heading-2',
    3: 'crm-heading-3',
    4: 'crm-heading-4',
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag className={cn(headingClasses[level], className)}>{children}</Tag>;
};

interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'secondary' | 'small';
  className?: string;
}

export const Text: React.FC<TextProps> = ({ children, variant = 'body', className }) => {
  const textClasses = {
    body: 'crm-text-body',
    secondary: 'crm-text-secondary',
    small: 'crm-text-small',
  };

  return <p className={cn(textClasses[variant], className)}>{children}</p>;
};

// ===== UTILITY COMPONENTS =====
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  return <Status variant={variant} className={className}>{children}</Status>;
};

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
  return <hr className={cn('border-slate-200 my-6', className)} />;
};

// ===== LOADING COMPONENTS =====
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-slate-300 border-t-purple-600', sizeClasses[size], className)} />
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={cn('animate-pulse bg-slate-200 rounded', className)} />;
};

// All components are exported individually above
