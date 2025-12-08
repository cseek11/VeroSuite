import React, { useEffect, useMemo } from 'react';
import { useVirtualScrolling } from '@/hooks/useVirtualScrolling';

interface Card {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VirtualCardContainerProps {
  cards: Card[];
  cardWidth: number;
  cardHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderCard: (card: Card, index: number) => React.ReactNode;
  overscan?: number;
  threshold?: number;
}

export const VirtualCardContainer: React.FC<VirtualCardContainerProps> = ({
  cards,
  cardWidth,
  cardHeight,
  containerWidth,
  containerHeight,
  renderCard,
  overscan = 5,
  threshold = 100
}) => {
  // Virtual scrolling hook
  const virtualScrolling = useVirtualScrolling({
    itemHeight: cardHeight + 20, // Add gap between cards
    containerHeight,
    overscan,
    threshold
  });

  // Enable virtual scrolling when card count exceeds threshold
  useEffect(() => {
    virtualScrolling.enableVirtualScrolling(cards.length);
  }, [cards.length, virtualScrolling]);

  // Update container height when it changes
  useEffect(() => {
    virtualScrolling.updateContainerHeight(containerHeight);
  }, [containerHeight, virtualScrolling]);

  // If virtual scrolling is not needed, render cards normally
  if (!virtualScrolling.isVirtualScrolling) {
    return (
      <div 
        className="virtual-card-container"
        style={{ 
          width: containerWidth, 
          height: containerHeight,
          overflow: 'auto'
        }}
      >
        <div className="card-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {cards.map((card, index) => (
            <div key={card.id} style={{ width: cardWidth, height: cardHeight }}>
              {renderCard(card, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // TODO: Re-enable Grid when react-window is installed
  // For now, fallback to normal rendering
  return (
    <div 
      className="virtual-card-container"
      style={{ 
        width: containerWidth, 
        height: containerHeight,
        overflow: 'auto'
      }}
    >
      <div className="card-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {cards.map((card, index) => (
          <div key={card.id} style={{ width: cardWidth, height: cardHeight }}>
            {renderCard(card, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading component for virtual scrolling
export const VirtualCardLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading cards..." 
}) => (
  <div className="flex items-center justify-center h-32 text-gray-500">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
    {message}
  </div>
);

// Performance monitoring component
export const VirtualCardPerformance: React.FC<{
  cardCount: number;
  isVirtualScrolling: boolean;
  renderTime?: number;
}> = ({ cardCount, isVirtualScrolling, renderTime }) => {
  const performanceInfo = useMemo(() => ({
    memoryUsage: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0,
    renderTime: renderTime || 0
  }), [renderTime]);

  return (
    <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
      <div>Cards: {cardCount} | Virtual: {isVirtualScrolling ? 'ON' : 'OFF'}</div>
      <div>Memory: {performanceInfo.memoryUsage}MB | Render: {performanceInfo.renderTime}ms</div>
    </div>
  );
};
