import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'page' | 'kpi' | 'template';
  size?: 'small' | 'medium' | 'large' | 'auto';
}

export const CardContainer = forwardRef<HTMLDivElement, CardContainerProps>(
  ({ children, className = '', variant = 'default', size = 'auto', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card-container',
          'h-full w-full flex flex-col overflow-hidden',
          'transition-all duration-200',
          {
            // Variant styles
            ...(variant === 'default' && { 'bg-white rounded-lg shadow-lg border': true }),
            ...(variant === 'page' && { 'bg-blue-50/30 border-blue-400': true }),
            ...(variant === 'kpi' && { 'bg-white rounded-lg shadow-lg border': true }),
            ...(variant === 'template' && { 'bg-white rounded-lg shadow-lg border': true }),
            
            // Size styles
            ...(size === 'small' && { 'min-h-[300px] min-w-[400px]': true }),
            ...(size === 'medium' && { 'min-h-[400px] min-w-[500px]': true }),
            ...(size === 'large' && { 'min-h-[600px] min-w-[700px]': true }),
            ...(size === 'auto' && { 'min-h-[300px] min-w-[400px]': true }),
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContainer.displayName = 'CardContainer';
