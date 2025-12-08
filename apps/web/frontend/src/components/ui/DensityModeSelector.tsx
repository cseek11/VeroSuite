import React from 'react';
import { useDensityMode, DensityMode } from '@/context/DensityModeContext';
import { LayoutGrid, Maximize2, Minimize2 } from 'lucide-react';

interface DensityModeOption {
  value: DensityMode;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const densityOptions: DensityModeOption[] = [
  {
    value: 'compact',
    label: 'Compact',
    description: 'Maximum density, ideal for data-heavy views',
    icon: Minimize2
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Balanced comfort and productivity',
    icon: LayoutGrid
  },
  {
    value: 'comfortable',
    label: 'Comfortable',
    description: 'More breathing room for analysis',
    icon: Maximize2
  }
];

export const DensityModeSelector: React.FC = () => {
  const { densityMode, setDensityMode } = useDensityMode();

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Choose your preferred display density. This affects spacing, font sizes, and row heights throughout the application.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {densityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = densityMode === option.value;
          
          return (
            <label
              key={option.value}
              className={`flex items-start p-3 bg-white rounded-md border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="densityMode"
                value={option.value}
                checked={isSelected}
                onChange={(e) => setDensityMode(e.target.value as DensityMode)}
                className="sr-only"
              />
              <div className="flex items-start gap-3 w-full">
                <div className={`p-1.5 rounded-md ${
                  isSelected ? 'bg-indigo-100' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isSelected ? 'text-indigo-600' : 'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${
                    isSelected ? 'text-indigo-900' : 'text-slate-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${
                    isSelected ? 'text-indigo-700' : 'text-slate-600'
                  }`}>
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};





