import React from 'react';
import { Plus } from 'lucide-react';
import CardGroup from '@/components/dashboard/CardGroup';
import { VirtualCardContainer } from '@/components/dashboard/VirtualCardContainer';

interface DashboardCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasHeight: number;
  handleDeselectAll: () => void;
  handlePanStart: (e: React.MouseEvent) => void;
  getTransformStyle: () => React.CSSProperties;
  groups: Record<string, any>;
  updateGroup: (groupId: string, updates: any) => void;
  deleteGroup: (groupId: string) => void;
  ungroupCards: (groupId: string) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  handleGroupDragStart: (groupId: string, e: React.MouseEvent) => void;
  handleGroupDeleteRequest: (groupId: string) => void;
  isVirtualScrolling: boolean;
  filteredCards: any[];
  renderVirtualCard: (card: any, index: number) => React.ReactNode;
  virtualScrollingThreshold: number;
  cardsLength: number;
  setShowCardSelector: (show: boolean) => void;
}

export const DashboardCanvas: React.FC<DashboardCanvasProps> = ({
  containerRef,
  canvasHeight,
  handleDeselectAll,
  handlePanStart,
  getTransformStyle,
  groups,
  updateGroup,
  deleteGroup,
  ungroupCards,
  selectedGroupId,
  setSelectedGroupId,
  handleGroupDragStart,
  handleGroupDeleteRequest,
  isVirtualScrolling,
  filteredCards,
  renderVirtualCard,
  virtualScrollingThreshold,
  cardsLength,
  setShowCardSelector
}) => {
  return (
    <div 
      ref={containerRef}
      className="dashboard-canvas relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-200 min-h-[600px] overflow-hidden cursor-grab"
      style={{ height: `${Math.max(600, canvasHeight)}px` }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDeselectAll();
        }
      }}
      onMouseDown={handlePanStart}
    >
      {/* Zoom/Pan Container */}
      <div style={getTransformStyle()}>
        {/* Groups */}
        {Object.values(groups).map((group) => (
          <CardGroup
            key={group.id}
            group={group}
            onUpdateGroup={updateGroup}
            onDeleteGroup={deleteGroup}
            onUngroupCards={ungroupCards}
            isSelected={selectedGroupId === group.id}
            onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
            onGroupDragStart={handleGroupDragStart}
            onRequestDelete={handleGroupDeleteRequest}
          />
        ))}

        {/* Cards - Virtual Scrolling Implementation */}
        {isVirtualScrolling ? (
          <VirtualCardContainer
            cards={filteredCards}
            cardWidth={300}
            cardHeight={200}
            containerWidth={1200}
            containerHeight={canvasHeight}
            renderCard={renderVirtualCard}
            overscan={5}
            threshold={virtualScrollingThreshold}
          />
        ) : (
          // Fallback to normal rendering for small card sets
          filteredCards.map((card: any) => renderVirtualCard(card, 0))
        )}
      </div>

      {/* Empty State */}
      {cardsLength === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-lg font-medium mb-2">
              Your Customizable Dashboard
            </div>
            <div className="text-gray-500 text-sm mb-4">
              Add cards to create your personalized workspace
            </div>
            <button
              onClick={() => setShowCardSelector(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};