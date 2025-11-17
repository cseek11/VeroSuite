import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  onChange,
  className = '',
  id,
  checked,
  disabled,
  indeterminate,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const helperId = helperText ? `${checkboxId}-helper` : undefined;
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  // Handle indeterminate state
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate === true;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <div className={`crm-field ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="crm-checkbox"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={checkboxId} className="crm-label !mb-0">
              {label}
            </label>
          </div>
        )}
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

export default Checkbox;

