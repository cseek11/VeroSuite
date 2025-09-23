import { useState, useCallback, useEffect } from 'react';

interface ResizeState {
  isResizing: boolean;
  resizingCardId: string | null;
  resizeHandle: string | null;
  startPosition: { x: number; y: number };
  startSize: { width: number; height: number };
}

interface UseCardResizeProps {
  onUpdateSize: (cardId: string, width: number, height: number) => void;
  cards: Record<string, any>;
  onResizeEnd?: () => void;
  getCardGroup?: (cardId: string) => any;
  updateGroupBounds?: (groupId: string, cards: Record<string, any>) => void;
  getCardType?: (cardId: string) => string;
}

export function useCardResize({ onUpdateSize, cards, onResizeEnd, getCardGroup, updateGroupBounds, getCardType }: UseCardResizeProps) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizingCardId: null,
    resizeHandle: null,
    startPosition: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 }
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
      startSize: { width: card.width, height: card.height }
    });

    // Set global styles
    document.body.style.cursor = `${handle}-resize`;
    document.body.style.userSelect = 'none';
  }, [cards]);

  // Handle resize move with immediate DOM updates for smooth performance
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeState.isResizing || !resizeState.resizingCardId) return;

    // Use requestAnimationFrame for smooth 60fps updates
    requestAnimationFrame(() => {
      const deltaX = e.clientX - resizeState.startPosition.x;
      const deltaY = e.clientY - resizeState.startPosition.y;

      let newWidth = resizeState.startSize.width;
      let newHeight = resizeState.startSize.height;

      // Calculate new dimensions based on resize handle
      switch (resizeState.resizeHandle) {
        case 'se': // Southeast (bottom-right)
          newWidth = resizeState.startSize.width + deltaX;
          newHeight = resizeState.startSize.height + deltaY;
          break;
        case 'e': // East (right edge)
          newWidth = resizeState.startSize.width + deltaX;
          break;
        case 's': // South (bottom edge)
          newHeight = resizeState.startSize.height + deltaY;
          break;
        default:
          return;
      }

      // Apply constraints - larger limits for Smart KPIs cards
      const minWidth = 200;
      const minHeight = 120;
      
      // Check if this is a Smart KPIs card for larger max dimensions
      const cardType = getCardType?.(resizeState.resizingCardId);
      const isSmartKPIsCard = cardType === 'smart-kpis' || cardType === 'smart-kpis-test' || cardType === 'smart-kpis-debug';
      
      const maxWidth = isSmartKPIsCard ? 800 : 500;
      const maxHeight = isSmartKPIsCard ? 600 : 350;

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Immediate DOM update for visual feedback
      const cardElement = document.querySelector(`[data-card-id="${resizeState.resizingCardId}"]`) as HTMLElement;
      if (cardElement) {
        cardElement.style.width = `${newWidth}px`;
        cardElement.style.height = `${newHeight}px`;
        cardElement.style.transition = 'none'; // Disable transitions during resize
      }
    });
  }, [resizeState]);

  // End resizing
  const handleResizeEnd = useCallback(() => {
    if (resizeState.isResizing) {
      // Final state update with current visual size
      const cardElement = document.querySelector(`[data-card-id="${resizeState.resizingCardId}"]`) as HTMLElement;
      if (cardElement) {
        const finalWidth = parseInt(cardElement.style.width) || resizeState.startSize.width;
        const finalHeight = parseInt(cardElement.style.height) || resizeState.startSize.height;
        
        // Re-enable transitions
        cardElement.style.transition = '';
        
        // Final state update
        onUpdateSize(resizeState.resizingCardId!, finalWidth, finalHeight);
        
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
                height: finalHeight
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
        startSize: { width: 0, height: 0 }
      });
    }
  }, [resizeState, onUpdateSize, onResizeEnd]);

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
