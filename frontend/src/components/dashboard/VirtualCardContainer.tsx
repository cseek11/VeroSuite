import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as ReactWindow from 'react-window';
const { FixedSizeGrid: Grid } = ReactWindow;
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
  onScroll?: (scrollTop: number) => void;
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
  onScroll,
  overscan = 5,
  threshold = 100
}) => {
  const gridRef = useRef<Grid>(null);
  
  // Calculate grid dimensions
  const columnCount = Math.floor(containerWidth / cardWidth) || 1;
  const rowCount = Math.ceil(cards.length / columnCount);
  
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

  // Handle scroll events
  const handleScroll = useCallback((scrollTop: number) => {
    onScroll?.(scrollTop);
  }, [onScroll]);

  // Grid item renderer
  const GridItem = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const cardIndex = rowIndex * columnCount + columnIndex;
    const card = cards[cardIndex];
    
    if (!card) {
      return null;
    }

    return (
      <div style={style}>
        {renderCard(card, cardIndex)}
      </div>
    );
  }, [cards, columnCount, renderCard]);

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

  return (
    <div className="virtual-card-container">
      <Grid
        ref={gridRef}
        columnCount={columnCount}
        columnWidth={cardWidth + 20} // Add gap
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={cardHeight + 20} // Add gap
        width={containerWidth}
        overscanRowCount={overscan}
        onScroll={({ scrollTop }) => handleScroll(scrollTop)}
        className="virtual-grid"
      >
        {GridItem}
      </Grid>
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
