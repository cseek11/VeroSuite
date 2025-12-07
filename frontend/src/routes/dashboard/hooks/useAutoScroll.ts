import { useCallback, useRef, useEffect } from 'react';

interface UseAutoScrollProps {
  containerRef: React.RefObject<HTMLDivElement>;
  scrollToCard: (cardId: string) => void;
  enableAutoScroll?: boolean;
  scrollSpeed?: number;
  boundaryZone?: number;
}

export const useAutoScroll = ({
  containerRef,
  scrollToCard,
  enableAutoScroll = true,
  scrollSpeed = 15, // Pixels to scroll per frame
  boundaryZone = 80 // Distance from edge to trigger scroll
}: UseAutoScrollProps) => {
  const scrollFrameRef = useRef<number | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const isScrollingRef = useRef(false);

  // Stop auto-scrolling
  const stopAutoScroll = useCallback(() => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
    }
    isScrollingRef.current = false;
  }, []);

  // Find the actual scrollable container (might be the container or a parent)
  const getScrollableContainer = useCallback(() => {
    if (!containerRef.current) return null;
    
    let element: HTMLElement | null = containerRef.current;
    
    // Check if the container itself is scrollable
    const style = window.getComputedStyle(element);
    const isScrollable = 
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight;
    
    if (isScrollable) {
      return element;
    }
    
    // If not, find the scrollable parent
    element = element.parentElement;
    while (element) {
      const parentStyle = window.getComputedStyle(element);
      const parentIsScrollable = 
        (parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') &&
        element.scrollHeight > element.clientHeight;
      
      if (parentIsScrollable) {
        return element;
      }
      
      element = element.parentElement;
    }
    
    // Fallback to the original container
    return containerRef.current;
  }, [containerRef]);

  // Continuous smooth scrolling animation
  const performScroll = useCallback(() => {
    const container = getScrollableContainer();
    if (!container || !lastMousePosition.current) {
      stopAutoScroll();
      return;
    }

    const rect = container.getBoundingClientRect();
    const mouseY = lastMousePosition.current.y;
    const threshold = boundaryZone;
    
    // Calculate distance from edges of the scrollable container
    const distanceFromTop = mouseY - rect.top;
    const distanceFromBottom = rect.bottom - mouseY;
    
    // Determine scroll direction and speed based on proximity to edge
    let scrollDelta = 0;
    
    if (distanceFromTop < threshold && distanceFromTop > 0) {
      // Near top edge - scroll up
      const proximity = Math.max(0, threshold - distanceFromTop);
      const speedMultiplier = 1 - (proximity / threshold); // Faster when closer to edge (0 to 1)
      scrollDelta = -scrollSpeed * (1 + speedMultiplier * 2); // Base speed + up to 2x multiplier
    } else if (distanceFromBottom < threshold && distanceFromBottom > 0) {
      // Near bottom edge - scroll down
      const proximity = Math.max(0, threshold - distanceFromBottom);
      const speedMultiplier = 1 - (proximity / threshold);
      scrollDelta = scrollSpeed * (1 + speedMultiplier * 2);
    }
    
    // Apply scroll if needed
    if (scrollDelta !== 0) {
      const currentScrollTop = container.scrollTop;
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const newScrollTop = Math.max(0, Math.min(maxScrollTop, currentScrollTop + scrollDelta));
      
      if (newScrollTop !== currentScrollTop) {
        // Direct scroll assignment for immediate response
        container.scrollTop = newScrollTop;
        isScrollingRef.current = true;
        // Continue scrolling on next frame
        scrollFrameRef.current = requestAnimationFrame(performScroll);
      } else {
        // Reached scroll limit - stop scrolling
        stopAutoScroll();
      }
    } else {
      // Mouse moved away from edge - stop scrolling
      stopAutoScroll();
    }
  }, [getScrollableContainer, boundaryZone, scrollSpeed, stopAutoScroll]);

  // Auto-scroll during drag operations - smooth continuous scrolling
  const handleAutoScroll = useCallback((_cardId: string, mouseY: number) => {
    if (!enableAutoScroll) {
      stopAutoScroll();
      return;
    }

    // Always update mouse position (called on every mouse move during drag)
    // mouseY is in screen coordinates (clientY)
    lastMousePosition.current = { x: 0, y: mouseY };

    const container = getScrollableContainer();
    if (!container) {
      stopAutoScroll();
      return;
    }

    const rect = container.getBoundingClientRect();
    const threshold = boundaryZone;
    
    // Check if mouse is near edges of the scrollable container
    const distanceFromTop = mouseY - rect.top;
    const distanceFromBottom = rect.bottom - mouseY;
    const isNearEdge = (distanceFromTop < threshold && distanceFromTop > 0) || 
                       (distanceFromBottom < threshold && distanceFromBottom > 0);
    
    if (isNearEdge) {
      // Start or continue scrolling
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        scrollFrameRef.current = requestAnimationFrame(performScroll);
      }
      // If already scrolling, performScroll will pick up the updated mouse position on next frame
    } else {
      // Stop scrolling if mouse moved away from edge
      stopAutoScroll();
    }
  }, [enableAutoScroll, getScrollableContainer, boundaryZone, stopAutoScroll, performScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  return {
    handleAutoScroll,
    scrollToCard,
    stopAutoScroll
  };
};
