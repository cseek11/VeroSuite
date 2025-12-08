import React from 'react';
import InputMask from 'react-input-mask';

interface MaskedInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mask: string;
  error?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const MaskedInput: React.FC<MaskedInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  mask, 
  error, 
  className = '', 
  icon: Icon 
}) => {
  return (
    <div className={`crm-field ${className}`}>
      {label && <label className="crm-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-500" />
          </div>
        )}
        <InputMask
          mask={mask}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`crm-input ${Icon ? 'pl-10' : ''} ${error ? 'crm-input-error' : ''}`}
                           style={{
                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
                   borderColor: 'rgba(255, 255, 255, 0.2)',
                   color: 'rgb(30, 41, 59)',
                   backdropFilter: 'blur(4px)',
                   WebkitAppearance: 'none',
                   MozAppearance: 'none',
                   appearance: 'none'
                 }}
                 onFocus={(e) => {
                   e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.3)';
                   e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                 }}
                 onBlur={(e) => {
                   e.target.style.boxShadow = 'none';
                   e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                 }}
        />
      </div>
      {error && <p className="crm-error">{error}</p>}
    </div>
  );
};

export default MaskedInput;
