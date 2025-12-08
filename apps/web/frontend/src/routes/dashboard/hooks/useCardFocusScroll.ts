import { useCallback, useEffect, useRef } from 'react';

interface UseCardFocusScrollProps {
  selectedCards: Set<string>;
  containerRef: React.RefObject<HTMLDivElement>;
  enableAutoScroll?: boolean;
  scrollDelay?: number;
}

export const useCardFocusScroll = ({
  selectedCards,
  containerRef,
  enableAutoScroll = true,
  scrollDelay = 200
}: UseCardFocusScrollProps) => {
  const lastSelectedCard = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to selected card
  const scrollToSelectedCard = useCallback((cardId: string) => {
    if (!enableAutoScroll || !containerRef.current) return;

    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
    if (cardElement) {
      // Check if card is already in view
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const cardRect = cardElement.getBoundingClientRect();
      
      const isCardInView = 
        cardRect.top >= containerRect.top - 50 && 
        cardRect.bottom <= containerRect.bottom + 50;
      
      // Only scroll if card is not in view
      if (!isCardInView) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [enableAutoScroll, containerRef]);

  // Handle selection changes
  useEffect(() => {
    if (selectedCards.size === 1) {
      const selectedCardId = Array.from(selectedCards)[0];
      if (!selectedCardId) return;
      
      // Only scroll if it's a new selection (not the same card)
      if (selectedCardId !== lastSelectedCard.current) {
        lastSelectedCard.current = selectedCardId;
        
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Scroll to the selected card with delay
        scrollTimeoutRef.current = setTimeout(() => {
          scrollToSelectedCard(selectedCardId);
        }, scrollDelay);
      }
    } else if (selectedCards.size === 0) {
      // Reset when no cards are selected
      lastSelectedCard.current = null;
    }
  }, [selectedCards, scrollToSelectedCard, scrollDelay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Manual scroll function for external use
  const scrollToCard = useCallback((cardId: string) => {
    scrollToSelectedCard(cardId);
  }, [scrollToSelectedCard]);

  return {
    scrollToCard
  };
};











