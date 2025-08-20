import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'purple' | 'blue' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'purple',
  size = 'md',
  showLabel = true,
  animated = false,
  striped = false,
  label,
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const stripedClass = striped ? 'bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent bg-[length:20px_100%] animate-pulse' : '';

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${stripedClass} ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${percentage}%`,
            backgroundImage: striped ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' : undefined,
            backgroundSize: striped ? '1rem 1rem' : undefined
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
