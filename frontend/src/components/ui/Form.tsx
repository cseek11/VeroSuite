import React from 'react';

interface FormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

interface FormColProps {
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ children, className = '', onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

const FormRow: React.FC<FormRowProps> = ({ children, className = '' }) => {
  return (
    <div className={`crm-field-row ${className}`}>
      {children}
    </div>
  );
};

const FormCol: React.FC<FormColProps> = ({ children, className = '' }) => {
  return (
    <div className={`crm-field-col ${className}`}>
      {children}
    </div>
  );
};

export { Form, FormRow, FormCol };
