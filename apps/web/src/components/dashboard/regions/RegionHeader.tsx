import React from 'react';
import { Settings, ChevronDown, ChevronUp, Lock, Unlock, X } from 'lucide-react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';

interface RegionHeaderProps {
  region: DashboardRegion;
  onToggleCollapse?: () => void;
  onToggleLock?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
}

export const RegionHeader: React.FC<RegionHeaderProps> = ({
  region,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onSettings
}) => {
  const displayTitle = region.config?.title || region.region_type.replace('-', ' ');

  return (
    <div className="region-header flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {displayTitle}
        </h3>
        {region.is_locked && (
          <Lock className="w-4 h-4 text-gray-500" aria-label="Locked" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Region settings"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label={region.is_collapsed ? 'Expand region' : 'Collapse region'}
          title={region.is_collapsed ? 'Expand' : 'Collapse'}
        >
          {region.is_collapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <button
          onClick={onToggleLock}
          className={`p-1.5 rounded-lg hover:bg-gray-200 transition-colors ${region.is_locked ? 'text-blue-600' : ''}`}
          aria-label={region.is_locked ? 'Unlock region' : 'Lock region'}
          title={region.is_locked ? 'Unlock' : 'Lock'}
        >
          {region.is_locked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
          aria-label="Delete region"
          title="Delete"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

