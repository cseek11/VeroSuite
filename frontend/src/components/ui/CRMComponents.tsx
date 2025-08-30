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

// ===== SWITCH COMPONENT =====
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-purple-600' : 'bg-gray-200',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
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

export const CRMSelect: React.FC<SelectProps> = ({
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
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantClasses = {
    default: 'inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800',
    secondary: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
    outline: 'inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700',
    destructive: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
    success: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
    warning: 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
    error: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
    info: 'inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800',
    neutral: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
  return <hr className={cn('border-slate-200 my-6', className)} />;
};

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', className }) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-px h-full bg-gray-200', className)} />;
  }
  return <div className={cn('h-px w-full bg-gray-200', className)} />;
};

// ===== TABS COMPONENTS =====
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value = '', onValueChange = () => {}, children, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('tabs-container', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={cn('flex border-b border-gray-200', className)} role="tablist">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: currentValue, onValueChange } = context;
  const isActive = currentValue === value;

  const handleClick = () => {
    onValueChange(value);
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
      className={cn(
        'px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-800 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200',
        isActive && 'text-purple-600 border-purple-500 bg-purple-50',
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: currentValue } = context;
  const isActive = currentValue === value;

  if (!isActive) return null;

  return (
    <div 
      role="tabpanel"
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  );
};

// ===== DIALOG COMPONENTS =====
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange?.(false)} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  );
};

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  return <>{children}</>;
};

// ===== SELECT COMPOUND COMPONENTS =====
interface SelectCompoundProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectCompoundProps> = ({ value, onValueChange, children }) => {
  return <>{children}</>;
};

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return (
    <button className={cn('flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50', className)}>
      {children}
    </button>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  return (
    <div className={cn('absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg', className)}>
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  return (
    <div className={cn('px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer', className)}>
      {children}
    </div>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <span>{placeholder}</span>;
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
