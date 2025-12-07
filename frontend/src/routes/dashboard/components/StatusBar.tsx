import React from 'react';
import { WebSocketStatus } from '@/components/dashboard/WebSocketStatus';
import { VirtualCardPerformance } from '@/components/dashboard/VirtualCardContainer';
import { SyncStatus, SyncStatus as SyncStatusType } from './SyncStatus';

interface StatusBarProps {
  searchTerm: string;
  filteredCardsLength: number;
  totalCardsLength: number;
  isVirtualScrolling: boolean;
  virtualScrollingThreshold: number;
  currentLayout: string;
  applyTemplate: (template: string) => void;
  syncStatus?: SyncStatusType;
  lastSynced?: Date | null;
  syncErrorMessage?: string | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  searchTerm,
  filteredCardsLength,
  totalCardsLength,
  isVirtualScrolling,
  virtualScrollingThreshold,
  currentLayout,
  applyTemplate,
  syncStatus = 'idle',
  lastSynced = null,
  syncErrorMessage = null
}) => {
  return (
    <div className="mt-6 px-4 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <div>
          {searchTerm ? (
            `${filteredCardsLength} of ${totalCardsLength} cards found • Search: "${searchTerm}"`
          ) : (
            `${totalCardsLength} cards • Press ? for keyboard shortcuts`
          )}
          {isVirtualScrolling && (
            <span className="ml-2 text-purple-600 font-medium">
              • Virtual Scrolling ON (threshold: {virtualScrollingThreshold})
            </span>
          )}
        </div>
        
        {/* Layout Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Layout:</span>
          <div className="flex gap-1">
            {['grid', 'dashboard', 'sidebar'].map((layoutType) => (
              <button
                key={layoutType}
                onClick={() => applyTemplate(layoutType)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  currentLayout === layoutType
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}
              </button>
            ))}
            {currentLayout === 'custom' && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                Custom
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <SyncStatus
          status={syncStatus}
          {...(lastSynced ? { lastSynced } : {})}
          {...(syncErrorMessage ? { errorMessage: syncErrorMessage } : {})}
        />
        <WebSocketStatus showStats={true} />
        <VirtualCardPerformance
          cardCount={totalCardsLength}
          isVirtualScrolling={isVirtualScrolling}
        />
      </div>
    </div>
  );
};