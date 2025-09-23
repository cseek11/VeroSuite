import { useEffect, useCallback, useRef, useState } from 'react';

export interface NavigationCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  element?: HTMLElement;
}

interface UseKeyboardNavigationProps {
  cards: Record<string, any>;
  selectedCards: Set<string>;
  onSelectCard: (cardId: string, addToSelection?: boolean) => void;
  onDeselectAll: () => void;
  onFocusCard: (cardId: string) => void;
  onActivateCard: (cardId: string) => void;
  onMoveCard?: (cardId: string, deltaX: number, deltaY: number) => void;
  onResizeCard?: (cardId: string, deltaWidth: number, deltaHeight: number) => void;
  gridSize?: number; // Grid snap size for arrow key movement
  enableScreenReader?: boolean;
}

export function useKeyboardNavigation({
  cards,
  selectedCards,
  onSelectCard,
  onDeselectAll,
  onFocusCard,
  onActivateCard,
  onMoveCard,
  onResizeCard,
  gridSize = 20,
  enableScreenReader = true
}: UseKeyboardNavigationProps) {
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [navigationMode, setNavigationMode] = useState<'select' | 'move' | 'resize'>('select');
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert cards to navigation-friendly format
  const navigationCards: NavigationCard[] = Object.entries(cards || {}).map(([id, card]) => ({
    id,
    x: card.x,
    y: card.y,
    width: card.width,
    height: card.height,
    type: card.type,
    element: document.querySelector(`[data-card-id="${id}"]`) as HTMLElement
  }));

  // Sort cards by position for navigation order
  const sortedCards = navigationCards.sort((a, b) => {
    // Sort by row first (y position), then by column (x position)
    const rowDiff = Math.floor(a.y / 100) - Math.floor(b.y / 100);
    if (rowDiff !== 0) return rowDiff;
    return a.x - b.x;
  });

  // Find the currently focused card index
  const focusedIndex = focusedCardId ? sortedCards.findIndex(card => card.id === focusedCardId) : -1;

  // Navigation helper functions
  const findNearestCard = useCallback((direction: 'up' | 'down' | 'left' | 'right', fromCard?: NavigationCard): NavigationCard | null => {
    const referenceCard = fromCard || (focusedCardId ? navigationCards.find(c => c.id === focusedCardId) : null);
    if (!referenceCard) return null;

    const threshold = 50; // Minimum distance to consider for navigation
    let nearestCard: NavigationCard | null = null;
    let minDistance = Infinity;

    navigationCards.forEach(card => {
      if (card.id === referenceCard.id) return;

      let shouldConsider = false;
      let distance = 0;

      switch (direction) {
        case 'up':
          shouldConsider = card.y < referenceCard.y - threshold;
          distance = Math.abs(card.x - referenceCard.x) + (referenceCard.y - card.y);
          break;
        case 'down':
          shouldConsider = card.y > referenceCard.y + referenceCard.height + threshold;
          distance = Math.abs(card.x - referenceCard.x) + (card.y - (referenceCard.y + referenceCard.height));
          break;
        case 'left':
          shouldConsider = card.x < referenceCard.x - threshold;
          distance = Math.abs(card.y - referenceCard.y) + (referenceCard.x - card.x);
          break;
        case 'right':
          shouldConsider = card.x > referenceCard.x + referenceCard.width + threshold;
          distance = Math.abs(card.y - referenceCard.y) + (card.x - (referenceCard.x + referenceCard.width));
          break;
      }

      if (shouldConsider && distance < minDistance) {
        minDistance = distance;
        nearestCard = card;
      }
    });

    return nearestCard;
  }, [navigationCards, focusedCardId]);

  // Navigation actions
  const navigateToCard = useCallback((cardId: string, addToSelection = false) => {
    setFocusedCardId(cardId);
    onFocusCard(cardId);
    
    if (addToSelection) {
      onSelectCard(cardId, true);
    } else {
      onSelectCard(cardId, false);
    }

    // Scroll card into view
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      cardElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center', 
        inline: 'center' 
      });
    }

    // Set focus for screen readers
    if (enableScreenReader) {
      cardElement?.setAttribute('tabindex', '0');
      (cardElement as HTMLElement)?.focus();
    }
  }, [onFocusCard, onSelectCard, enableScreenReader]);

  const navigateInDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const nearestCard = findNearestCard(direction);
    if (nearestCard && nearestCard.id) {
      navigateToCard(nearestCard.id);
    }
  }, [findNearestCard, navigateToCard]);

  const navigateSequentially = useCallback((direction: 'next' | 'prev') => {
    if (sortedCards.length === 0) return;

    let newIndex: number;
    if (focusedIndex === -1) {
      newIndex = direction === 'next' ? 0 : sortedCards.length - 1;
    } else {
      newIndex = direction === 'next' 
        ? (focusedIndex + 1) % sortedCards.length
        : (focusedIndex - 1 + sortedCards.length) % sortedCards.length;
    }

    const targetCard = sortedCards[newIndex];
    if (targetCard) {
      navigateToCard(targetCard.id);
    }
  }, [sortedCards, focusedIndex, navigateToCard]);

  // Move card with arrow keys
  const moveCard = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!focusedCardId || !onMoveCard) return;

    const delta = gridSize;
    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'up':
        deltaY = -delta;
        break;
      case 'down':
        deltaY = delta;
        break;
      case 'left':
        deltaX = -delta;
        break;
      case 'right':
        deltaX = delta;
        break;
    }

    onMoveCard(focusedCardId, deltaX, deltaY);
  }, [focusedCardId, onMoveCard, gridSize]);

  // Resize card with arrow keys
  const resizeCard = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!focusedCardId || !onResizeCard) return;

    const delta = gridSize;
    let deltaWidth = 0;
    let deltaHeight = 0;

    switch (direction) {
      case 'up':
        deltaHeight = -delta;
        break;
      case 'down':
        deltaHeight = delta;
        break;
      case 'left':
        deltaWidth = -delta;
        break;
      case 'right':
        deltaWidth = delta;
        break;
    }

    onResizeCard(focusedCardId, deltaWidth, deltaHeight);
  }, [focusedCardId, onResizeCard, gridSize]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger navigation when typing in input fields
    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true' ||
                        target.closest('[contenteditable="true"]');
    
    if (isInputField) return;

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    setIsNavigating(true);

    // Set timeout to reset navigation state
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 150);

    // Mode switching
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      setNavigationMode('select');
      navigateSequentially('next');
      return;
    }

    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      setNavigationMode('select');
      navigateSequentially('prev');
        return;
    }

    // WASD navigation (replacing arrow keys)
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      
      // Map WASD to directions
      const keyToDirection: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        'w': 'up',
        's': 'down', 
        'a': 'left',
        'd': 'right'
      };
      
      const direction = keyToDirection[e.key.toLowerCase()];
      if (!direction) return;
      
      // Hold Shift for multi-selection
      const addToSelection = e.shiftKey;
      
      // Default: navigate between cards
      setNavigationMode('select');
      navigateInDirection(direction);
      
      if (addToSelection && focusedCardId) {
        onSelectCard(focusedCardId, true);
      }
      
      return;
    }

    // Ctrl+Shift+WASD for card movement
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      
      const keyToDirection: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        'w': 'up',
        's': 'down',
        'a': 'left', 
        'd': 'right'
      };
      
      const direction = keyToDirection[e.key.toLowerCase()];
      if (!direction) return;
      setNavigationMode('move');
      moveCard(direction);
      return;
    }

    // Alt+WASD for card resizing
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      
      const keyToDirection: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
      };
      
      const direction = keyToDirection[e.key.toLowerCase()];
      if (!direction) return;
      setNavigationMode('resize');
      resizeCard(direction);
      return;
    }

    // Space/Enter for activation
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (focusedCardId) {
        onActivateCard(focusedCardId);
      }
      return;
    }

    // Escape to deselect and exit navigation
    if (e.key === 'Escape') {
      e.preventDefault();
      setFocusedCardId(null);
      onDeselectAll();
      setNavigationMode('select');
      
      // Remove focus from any focused card
      document.querySelectorAll('[data-card-id]').forEach(card => {
        card.removeAttribute('tabindex');
      });
        return;
    }

    // Home/End for first/last card
    if (e.key === 'Home') {
      e.preventDefault();
      if (sortedCards.length > 0) {
        const firstCard = sortedCards[0];
        if (firstCard) {
          navigateToCard(firstCard.id);
        }
      }
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      if (sortedCards.length > 0) {
        const lastCard = sortedCards[sortedCards.length - 1];
        if (lastCard) {
          navigateToCard(lastCard.id);
        }
      }
      return;
    }

  }, [
    navigateSequentially,
    navigateInDirection,
    moveCard,
    resizeCard,
    focusedCardId,
    onSelectCard,
    onActivateCard,
    onDeselectAll,
    sortedCards,
    navigateToCard
  ]);

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Screen reader announcements
  useEffect(() => {
    if (enableScreenReader && focusedCardId) {
      const card = navigationCards.find(c => c.id === focusedCardId);
      if (card) {
        const announcement = `Focused on ${card.type} card, ${selectedCards.has(focusedCardId) ? 'selected' : 'not selected'}`;
        
        // Create or update live region for screen reader announcements
        let liveRegion = document.getElementById('keyboard-navigation-announcements');
        if (!liveRegion) {
          liveRegion = document.createElement('div');
          liveRegion.id = 'keyboard-navigation-announcements';
          liveRegion.setAttribute('aria-live', 'polite');
          liveRegion.setAttribute('aria-atomic', 'true');
          liveRegion.style.position = 'absolute';
          liveRegion.style.left = '-10000px';
          liveRegion.style.width = '1px';
          liveRegion.style.height = '1px';
          liveRegion.style.overflow = 'hidden';
          document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = announcement;
      }
    }
  }, [focusedCardId, enableScreenReader, navigationCards, selectedCards]);

  return {
    focusedCardId,
    navigationMode,
    isNavigating,
    navigateToCard,
    navigateInDirection,
    navigateSequentially,
    moveCard,
    resizeCard,
    setFocusedCardId,
    setNavigationMode
  };
}