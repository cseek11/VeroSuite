import { useState, useEffect, useRef } from 'react';

interface UseCardResponsiveProps {
  cardId: string;
  threshold?: number; // Percentage threshold for mobile mode (default 50%)
}

interface ResponsiveState {
  isMobile: boolean;
  cardWidth: number;
  viewportWidth: number;
  percentage: number;
}

export function useCardResponsive({ 
  cardId, 
  threshold = 50 
}: UseCardResponsiveProps): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    cardWidth: 0,
    viewportWidth: 0,
    percentage: 0
  });
  
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
    if (!cardElement) return;

    const updateResponsiveState = () => {
      const cardRect = cardElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const cardWidth = cardRect.width;
      const percentage = (cardWidth / viewportWidth) * 100;
      const isMobile = percentage < threshold;

      setState({
        isMobile,
        cardWidth,
        viewportWidth,
        percentage
      });

      // Add/remove mobile class for CSS targeting
      if (isMobile) {
        cardElement.classList.add('card-mobile-mode');
      } else {
        cardElement.classList.remove('card-mobile-mode');
      }
    };

    // Initial check
    updateResponsiveState();

    // Set up ResizeObserver to watch card size changes
    observerRef.current = new ResizeObserver(() => {
      updateResponsiveState();
    });

    observerRef.current.observe(cardElement);

    // Also listen for window resize
    const handleWindowResize = () => {
      updateResponsiveState();
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [cardId, threshold]);

  return state;
}











