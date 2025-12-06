import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | undefined;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;

  return (
    <div className={`crm-field ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="crm-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`crm-textarea ${error ? 'crm-input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
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
});

Textarea.displayName = 'Textarea';

export default Textarea;

