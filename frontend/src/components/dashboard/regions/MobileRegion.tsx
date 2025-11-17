import React, { useState, ReactNode } from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionHeader } from './RegionHeader';

interface MobileRegionProps {
  region: DashboardRegion;
  children?: ReactNode;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFullScreen?: (id: string) => void;
}

export const MobileRegion: React.FC<MobileRegionProps> = ({
  region,
  children,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onFullScreen
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (onFullScreen) {
      onFullScreen(region.id);
    }
    setIsFullScreen(!isFullScreen);
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold capitalize">
              {region.region_type.replace('-', ' ')}
            </h2>
            <button
              onClick={handleFullScreen}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Exit full screen"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-region bg-white border border-gray-200 rounded-lg mb-4 shadow-sm">
      <RegionHeader
        region={region}
        onToggleCollapse={onToggleCollapse}
        onToggleLock={onToggleLock}
        onDelete={onDelete}
      />
      {!region.is_collapsed && (
        <>
          <div className="p-4">
            {children}
          </div>
          <div className="p-2 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleFullScreen}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              aria-label="View full screen"
            >
              Full Screen
            </button>
          </div>
        </>
      )}
    </div>
  );
};





