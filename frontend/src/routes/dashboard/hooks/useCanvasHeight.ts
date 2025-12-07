import { useState, useEffect, useCallback, useRef } from 'react';
import { CARD_CONSTANTS } from '../utils/cardConstants';

interface UseCanvasHeightProps {
  cards: Record<string, any>;
  minHeight?: number;
  padding?: number;
  autoExpandThreshold?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  enableAutoScroll?: boolean;
  isDragging?: boolean; // Skip updates during drag to prevent bouncing
}

export const useCanvasHeight = ({
  cards,
  minHeight = CARD_CONSTANTS.CANVAS.MIN_HEIGHT,
  padding = CARD_CONSTANTS.CANVAS.PADDING,
  autoExpandThreshold = CARD_CONSTANTS.CANVAS.AUTO_EXPAND_THRESHOLD,
  containerRef,
  enableAutoScroll = true,
  isDragging = false
}: UseCanvasHeightProps) => {
  const [canvasHeight, setCanvasHeight] = useState(minHeight);
  const [previousHeight, setPreviousHeight] = useState(minHeight);
  const isExpanding = useRef(false);

  // Calculate the required canvas height based on card positions
  const calculateCanvasHeight = useCallback(() => {
    if (!cards || Object.keys(cards).length === 0) {
      return minHeight;
    }

    // Find the bottom-most position of all cards
    const maxBottom = Math.max(
      ...Object.values(cards).map((card: any) => {
        if (!card || typeof card.y !== 'number' || typeof card.height !== 'number') {
          return 0;
        }
        return card.y + card.height;
      }),
      minHeight
    );

    // Add padding and threshold for comfortable viewing
    const newHeight = maxBottom + padding + autoExpandThreshold;
    return Math.max(newHeight, minHeight);
  }, [cards, minHeight, padding, autoExpandThreshold]);

  // Auto-scroll to keep cards in view when canvas expands
  const autoScrollToCard = useCallback((cardId: string) => {
    if (!enableAutoScroll || !containerRef?.current) return;
    
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [enableAutoScroll, containerRef]);

  // Update canvas height when cards change (but skip during drag to prevent bouncing)
  useEffect(() => {
    // Skip canvas height updates during drag - will update after drag ends
    if (isDragging) {
      return;
    }
    
    const newHeight = calculateCanvasHeight();
    const heightDifference = newHeight - previousHeight;
    
    // Auto-scroll if there's any height increase (more than 50px)
    if (newHeight > previousHeight && heightDifference > 50) {
      isExpanding.current = true;
      
      // Find the card that caused the expansion (bottom-most card)
      const bottomMostCard = Object.values(cards).reduce((bottomCard: any, card: any) => {
        if (!card || typeof card.y !== 'number' || typeof card.height !== 'number') {
          return bottomCard;
        }
        const cardBottom = card.y + card.height;
        const bottomCardBottom = bottomCard ? bottomCard.y + bottomCard.height : 0;
        return cardBottom > bottomCardBottom ? card : bottomCard;
      }, null);
      
      // Auto-scroll to the card that caused expansion only if it's significantly below current view
      if (bottomMostCard && enableAutoScroll && containerRef?.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const cardElement = document.querySelector(`[data-card-id="${bottomMostCard.id}"]`) as HTMLElement;
        
        if (cardElement) {
          const cardRect = cardElement.getBoundingClientRect();
          const isCardBelowView = cardRect.top > containerRect.bottom - 50; // 50px buffer
          
          // Only scroll if the card is actually below the visible area
          if (isCardBelowView) {
            setTimeout(() => {
              autoScrollToCard(bottomMostCard.id);
            }, 100); // Faster response for better UX
          }
        }
      }
    } else {
      isExpanding.current = false;
    }
    
    setCanvasHeight(newHeight);
    setPreviousHeight(newHeight);
  }, [calculateCanvasHeight, previousHeight, cards, autoScrollToCard, enableAutoScroll, containerRef, isDragging]);

  // Function to manually update canvas height (useful for external triggers)
  const updateCanvasHeight = useCallback(() => {
    const newHeight = calculateCanvasHeight();
    setCanvasHeight(newHeight);
  }, [calculateCanvasHeight]);

  // Function to auto-scroll to a specific card (useful during drag operations)
  const scrollToCard = useCallback((cardId: string) => {
    autoScrollToCard(cardId);
  }, [autoScrollToCard]);

  return {
    canvasHeight,
    updateCanvasHeight,
    scrollToCard
  };
};
