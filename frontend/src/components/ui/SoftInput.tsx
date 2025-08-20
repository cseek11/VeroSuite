import React, { forwardRef } from 'react';

interface SoftInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

const SoftInput = forwardRef<HTMLInputElement, SoftInputProps>(({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  type = 'text',
  size = 'md',
  variant = 'default',
  className = '',
  id,
  name,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  maxLength,
  minLength,
  pattern,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'block w-full text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-600',
    outlined: 'border-2 border-gray-300 focus:border-blue-600',
    filled: 'border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-600'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
  const iconClasses = Icon ? 'pl-10' : '';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="inline-block mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${errorClasses} ${iconClasses}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-1 text-xs text-red-500"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-1 text-xs text-slate-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

SoftInput.displayName = 'SoftInput';

export default SoftInput;
