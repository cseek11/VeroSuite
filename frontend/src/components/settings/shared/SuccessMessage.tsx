import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  show: boolean;
  message?: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  show,
  message = 'Settings saved successfully!',
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 transform translate-x-0 opacity-100 ${className}`}>
      <CheckCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};
