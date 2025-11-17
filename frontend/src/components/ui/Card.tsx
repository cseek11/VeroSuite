import React from 'react';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  actions = [],
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {(title || actions.length > 0) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {actions.length > 0 && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: `calc(var(--space-4, 16px) * var(--density-scale, 1))` }}>{children}</div>
    </div>
  );
};

export default Card;
