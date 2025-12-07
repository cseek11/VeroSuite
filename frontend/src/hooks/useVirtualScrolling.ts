import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

interface VirtualScrollingOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

interface VirtualScrollingState {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  isVirtualScrolling: boolean;
}

interface VirtualScrollingReturn extends VirtualScrollingState {
  enableVirtualScrolling: (itemCount: number) => void;
  disableVirtualScrolling: () => void;
  updateContainerHeight: (height: number) => void;
  scrollToIndex: (index: number) => void;
  getVisibleItems: <T>(items: T[]) => T[];
  getItemStyle: (index: number) => React.CSSProperties;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualScrolling(options: VirtualScrollingOptions): VirtualScrollingReturn {
  const { itemHeight, containerHeight, overscan = 5, threshold = 100 } = options;
  
  const [scrollTop, setScrollTop] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [containerHeightState, setContainerHeightState] = useState(containerHeight);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate virtual scrolling state
  const virtualState = useMemo((): VirtualScrollingState => {
    if (!isEnabled || itemCount === 0) {
      return {
        startIndex: 0,
        endIndex: itemCount - 1,
        totalHeight: itemCount * itemHeight,
        offsetY: 0,
        isVirtualScrolling: false
      };
    }

    const visibleCount = Math.ceil(containerHeightState / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
    const totalHeight = itemCount * itemHeight;
    const offsetY = startIndex * itemHeight;

    return {
      startIndex,
      endIndex,
      totalHeight,
      offsetY,
      isVirtualScrolling: itemCount > threshold
    };
  }, [isEnabled, itemCount, itemHeight, containerHeightState, scrollTop, overscan, threshold]);

  // Enable virtual scrolling when item count exceeds threshold
  const enableVirtualScrolling = useCallback((count: number) => {
    setItemCount(count);
    setIsEnabled(count > threshold);
  }, [threshold]);

  // Disable virtual scrolling
  const disableVirtualScrolling = useCallback(() => {
    setIsEnabled(false);
    setItemCount(0);
  }, []);

  // Update container height
  const updateContainerHeight = useCallback((height: number) => {
    setContainerHeightState(height);
  }, []);

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [itemHeight]);

  // Get visible items for rendering
  const getVisibleItems = useCallback(<T>(items: T[]): T[] => {
    if (!virtualState.isVirtualScrolling) {
      return items;
    }
    return items.slice(virtualState.startIndex, virtualState.endIndex + 1);
  }, [virtualState]);

  // Get style for individual items
  const getItemStyle = useCallback((index: number): React.CSSProperties => {
    if (!virtualState.isVirtualScrolling) {
      return {};
    }
    
    const adjustedIndex = index - virtualState.startIndex;
    return {
      position: 'absolute' as const,
      top: adjustedIndex * itemHeight,
      height: itemHeight,
      width: '100%'
    };
  }, [virtualState, itemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll as EventListener);
      return () => container.removeEventListener('scroll', handleScroll as EventListener);
    }
    return undefined;
  }, [handleScroll]);

  return {
    ...virtualState,
    enableVirtualScrolling,
    disableVirtualScrolling,
    updateContainerHeight,
    scrollToIndex,
    getVisibleItems,
    getItemStyle,
    // Expose container ref for external use
    containerRef
  };
}
