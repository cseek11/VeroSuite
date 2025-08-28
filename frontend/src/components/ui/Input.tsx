import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={`crm-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="crm-label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-purple-500" />
          </div>
        )}
        <input
          id={inputId}
          className={`crm-input ${Icon ? 'pl-10' : ''} ${error ? 'crm-input-error' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="crm-error">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="crm-help">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
