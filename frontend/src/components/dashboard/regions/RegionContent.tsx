import React, { ReactNode } from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';

interface RegionContentProps {
  region: DashboardRegion;
  children?: ReactNode;
}

export const RegionContent: React.FC<RegionContentProps> = ({
  region,
  children
}) => {
  return (
    <div
      className="region-content flex-1 overflow-auto p-4 h-full"
      style={{
        minHeight: `${region.min_height}px`
      }}
    >
      {children || (
        <div className="text-center text-gray-500 py-8">
          <p>No content configured for this region</p>
          <p className="text-sm mt-2">Widget type: {region.widget_type || 'None'}</p>
        </div>
      )}
    </div>
  );
};

