import { useState, useCallback, useEffect, useRef } from 'react';
import { CARD_CONSTANTS } from '../routes/dashboard/utils/cardConstants';

interface ResizeState {
  isResizing: boolean;
  resizingCardId: string | null;
  resizeHandle: string | null;
  startPosition: { x: number; y: number };
  startSize: { width: number; height: number };
  startCardPosition: { x: number; y: number };
}

interface UseCardResizeProps {
  onUpdateSize: (cardId: string, width: number, height: number) => void;
  cards: Record<string, any>;
  onResizeEnd?: () => void;
  getCardGroup?: (cardId: string) => any;
  updateGroupBounds?: (groupId: string, cards: Record<string, any>) => void;
  getCardType?: (cardId: string) => string;
  onUpdatePosition?: (cardId: string, x: number, y: number) => void;
}

export function useCardResize({ onUpdateSize, cards, onResizeEnd, getCardGroup, updateGroupBounds, getCardType, onUpdatePosition }: UseCardResizeProps) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizingCardId: null,
    resizeHandle: null,
    startPosition: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startCardPosition: { x: 0, y: 0 }
  });

  // Start resizing
  const handleResizeStart = useCallback((cardId: string, handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const card = cards[cardId];
    if (!card) return;

    setResizeState({
      isResizing: true,
      resizingCardId: cardId,
      resizeHandle: handle,
      startPosition: { x: e.clientX, y: e.clientY },
      startSize: { width: card.width, height: card.height },
      startCardPosition: { x: card.x, y: card.y }
    });

    // Set global styles
    document.body.style.cursor = `${handle}-resize`;
    document.body.style.userSelect = 'none';
  }, [cards]);

  // Use ref to store current resize state to avoid stale closures
  const resizeStateRef = useRef(resizeState);
  useEffect(() => {
    resizeStateRef.current = resizeState;
  }, [resizeState]);

  // Handle resize move with immediate DOM updates for smooth performance
  const handleResizeMove = useCallback((e: MouseEvent) => {
    const currentState = resizeStateRef.current;
    if (!currentState.isResizing || !currentState.resizingCardId) return;

    // Use requestAnimationFrame for smooth 60fps updates
    requestAnimationFrame(() => {
      const state = resizeStateRef.current;
      if (!state.isResizing || !state.resizingCardId) return;

      const deltaX = e.clientX - state.startPosition.x;
      const deltaY = e.clientY - state.startPosition.y;

      let newWidth = state.startSize.width;
      let newHeight = state.startSize.height;

      // Calculate new dimensions based on resize handle
      switch (state.resizeHandle) {
        case 'se': // Southeast (bottom-right)
          newWidth = state.startSize.width + deltaX;
          newHeight = state.startSize.height + deltaY;
          break;
        case 'sw': // Southwest (bottom-left)
          newWidth = state.startSize.width - deltaX;
          newHeight = state.startSize.height + deltaY;
          break;
        case 'ne': // Northeast (top-right)
          newWidth = state.startSize.width + deltaX;
          newHeight = state.startSize.height - deltaY;
          break;
        case 'nw': // Northwest (top-left)
          newWidth = state.startSize.width - deltaX;
          newHeight = state.startSize.height - deltaY;
          break;
        case 'e': // East (right edge)
          newWidth = state.startSize.width + deltaX;
          break;
        case 'w': // West (left edge)
          newWidth = state.startSize.width - deltaX;
          break;
        case 's': // South (bottom edge)
          newHeight = state.startSize.height + deltaY;
          break;
        case 'n': // North (top edge)
          newHeight = state.startSize.height - deltaY;
          break;
        default:
          return;
      }

      // Apply constraints - larger limits for Smart KPIs cards
      const minWidth = CARD_CONSTANTS.RESIZE.MIN_WIDTH;
      const minHeight = CARD_CONSTANTS.RESIZE.MIN_HEIGHT;
      
      // Check card type for appropriate max dimensions
      const cardType = getCardType?.(state.resizingCardId);
      const isSmartKPIsCard = cardType === 'smart-kpis' || cardType === 'smart-kpis-test' || cardType === 'smart-kpis-debug';
      const isPageCard = cardType?.includes('-page') || cardType === 'customers-page';
      
      let maxWidth, maxHeight;
      if (isPageCard) {
        maxWidth = CARD_CONSTANTS.RESIZE.MAX_WIDTH;  // Allow larger size for page cards
        maxHeight = CARD_CONSTANTS.RESIZE.MAX_HEIGHT;
      } else if (isSmartKPIsCard) {
        maxWidth = CARD_CONSTANTS.RESIZE.MAX_WIDTH_SMART_KPI;
        maxHeight = CARD_CONSTANTS.RESIZE.MAX_HEIGHT_SMART_KPI;
      } else {
        maxWidth = CARD_CONSTANTS.RESIZE.MAX_WIDTH_STANDARD;
        maxHeight = CARD_CONSTANTS.RESIZE.MAX_HEIGHT_STANDARD;
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Calculate new position for left/top edge resizing
      let newX = state.startCardPosition.x;
      let newY = state.startCardPosition.y;

      if (state.resizeHandle === 'w' || state.resizeHandle === 'nw' || state.resizeHandle === 'sw') {
        // Resizing from left edge - adjust X position
        newX = state.startCardPosition.x + (state.startSize.width - newWidth);
      }

      if (state.resizeHandle === 'n' || state.resizeHandle === 'nw' || state.resizeHandle === 'ne') {
        // Resizing from top edge - adjust Y position
        newY = state.startCardPosition.y + (state.startSize.height - newHeight);
      }

      // Immediate DOM update for visual feedback
      const cardElement = document.querySelector(`[data-card-id="${state.resizingCardId}"]`) as HTMLElement;
      if (cardElement) {
        cardElement.style.width = `${newWidth}px`;
        cardElement.style.height = `${newHeight}px`;
        cardElement.style.left = `${newX}px`;
        cardElement.style.top = `${newY}px`;
        cardElement.style.transition = 'none'; // Disable transitions during resize
      }
    });
  }, [getCardType]);

  // End resizing
  const handleResizeEnd = useCallback(() => {
    if (resizeState.isResizing) {
      // Final state update with current visual size
      const cardElement = document.querySelector(`[data-card-id="${resizeState.resizingCardId}"]`) as HTMLElement;
      if (cardElement) {
        const finalWidth = parseInt(cardElement.style.width) || resizeState.startSize.width;
        const finalHeight = parseInt(cardElement.style.height) || resizeState.startSize.height;
        const finalX = parseInt(cardElement.style.left) || resizeState.startCardPosition.x;
        const finalY = parseInt(cardElement.style.top) || resizeState.startCardPosition.y;
        
        // Re-enable transitions
        cardElement.style.transition = '';
        
        // Final state update
        onUpdateSize(resizeState.resizingCardId!, finalWidth, finalHeight);
        
        // Update position if it changed (for left/top edge resizing)
        if (onUpdatePosition && (finalX !== resizeState.startCardPosition.x || finalY !== resizeState.startCardPosition.y)) {
          onUpdatePosition(resizeState.resizingCardId!, finalX, finalY);
        }
        
        // Update group bounds if card is in a group
        if (getCardGroup && updateGroupBounds) {
          const cardGroup = getCardGroup(resizeState.resizingCardId!);
          if (cardGroup) {
            // Update the cards object with the new size for group bounds calculation
            const updatedCards = {
              ...cards,
              [resizeState.resizingCardId!]: {
                ...cards[resizeState.resizingCardId!],
                width: finalWidth,
                height: finalHeight,
                x: finalX,
                y: finalY
              }
            };
            updateGroupBounds(cardGroup.id, updatedCards);
          }
        }
        
        // Save to history after resize (meaningful action)
        if (onResizeEnd) {
          setTimeout(() => onResizeEnd(), 100);
        }
      }

      // Reset global styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      setResizeState({
        isResizing: false,
        resizingCardId: null,
        resizeHandle: null,
        startPosition: { x: 0, y: 0 },
        startSize: { width: 0, height: 0 },
        startCardPosition: { x: 0, y: 0 }
      });
    }
  }, [resizeState, onUpdateSize, onResizeEnd, onUpdatePosition, getCardGroup, updateGroupBounds, cards]);

  // Add global resize event listeners
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd]);

  return {
    resizeState,
    handleResizeStart,
    isResizing: resizeState.isResizing,
    resizingCardId: resizeState.resizingCardId
  };
}
