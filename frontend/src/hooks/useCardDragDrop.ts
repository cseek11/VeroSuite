import { useState, useCallback, useEffect, useRef } from 'react';

// Throttle function for performance optimization
function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

interface UseCardDragDropProps {
  onUpdatePosition: (cardId: string, x: number, y: number) => void;
  onUpdateMultiplePositions: (updates: Array<{ cardId: string; x: number; y: number }>) => void;
  cards: Record<string, any>;
  selectedCards: Set<string>;
  isCardLocked?: (cardId: string) => boolean;
  getCardGroup?: (cardId: string) => any;
  onDragEnd?: () => void;
  zoom?: number;
  canvasHeight?: number;
}

export function useCardDragDrop({ onUpdatePosition, onUpdateMultiplePositions, cards, selectedCards, isCardLocked, getCardGroup, onDragEnd, zoom = 1, canvasHeight = 600 }: UseCardDragDropProps) {
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialCardPosition, setInitialCardPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialMultiCardPositions, setInitialMultiCardPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isDraggingMultiple, setIsDraggingMultiple] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  

  // Start dragging
  const handleDragStart = useCallback((cardId: string, e: React.MouseEvent) => {
    // Check if card is locked
    if (isCardLocked && isCardLocked(cardId)) {
      return; // Don't allow dragging locked cards
    }

    // Check if card is in a locked group
    if (getCardGroup) {
      const cardGroup = getCardGroup(cardId);
      if (cardGroup && cardGroup.locked) {
        return; // Don't allow dragging cards in locked groups
      }
    }

    // Only allow dragging from the card header area (top ~60px of the card)
    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();
    const clickY = e.clientY - cardRect.top;
    const headerHeight = 60; // Height of the header area
    
    if (clickY > headerHeight) {
      return; // Click is below the header area, don't start dragging
    }

    e.preventDefault();
    e.stopPropagation();

    // Calculate offset from where user clicked on the card
    const clickOffsetX = e.clientX - cardRect.left;
    const clickOffsetY = e.clientY - cardRect.top;
    
    const card = cards[cardId];
    if (!card) return;

    // Check if dragging multiple cards
    const isMultiDrag = selectedCards.has(cardId) && selectedCards.size > 1;
    
    setDraggingCard(cardId);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setIsDraggingMultiple(isMultiDrag);
    
    if (isMultiDrag) {
      // Store initial positions for all selected cards (excluding locked ones)
      const multiPositions: Record<string, { x: number; y: number }> = {};
      selectedCards.forEach(selectedCardId => {
        const selectedCard = cards[selectedCardId];
        if (selectedCard && (!isCardLocked || !isCardLocked(selectedCardId))) {
          multiPositions[selectedCardId] = { x: selectedCard.x, y: selectedCard.y };
        }
      });
      setInitialMultiCardPositions(multiPositions);
    } else {
      setInitialCardPosition({ x: card.x, y: card.y });
    }
    
    // Store the click offset for accurate dragging
    setDragOffset({ x: clickOffsetX, y: clickOffsetY });

    // Add dragging styles with hardware acceleration
    cardElement.style.cursor = 'grabbing';
    cardElement.style.zIndex = '9999';
    cardElement.style.transition = 'none';
    cardElement.style.willChange = 'transform';
    
    // Set global styles
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Immediately change header cursor to grabbing
    const headerElement = cardElement.querySelector('.card-header') as HTMLElement;
    if (headerElement) {
      headerElement.style.cursor = 'grabbing';
    }
  }, [cards, selectedCards, isCardLocked, getCardGroup]);

  // Calculate alignment guides for snap-to-align functionality
  const calculateAlignmentGuides = useCallback((draggedCardId: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    const snapDistance = 10;
    const draggedCard = {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height,
      centerX: position.x + size.width / 2,
      centerY: position.y + size.height / 2
    };

    const guides: { x?: number; y?: number }[] = [];

    Object.keys(cards).forEach(cardId => {
      if (cardId === draggedCardId) return;

      const card = cards[cardId];
      if (!card) return;

      const cardBounds = {
        left: card.x,
        right: card.x + card.width,
        top: card.y,
        bottom: card.y + card.height,
        centerX: card.x + card.width / 2,
        centerY: card.y + card.height / 2
      };

      // Horizontal alignment guides
      if (Math.abs(draggedCard.left - cardBounds.left) < snapDistance) guides.push({ x: cardBounds.left });
      if (Math.abs(draggedCard.right - cardBounds.right) < snapDistance) guides.push({ x: cardBounds.right });
      if (Math.abs(draggedCard.centerX - cardBounds.centerX) < snapDistance) guides.push({ x: cardBounds.centerX });

      // Vertical alignment guides
      if (Math.abs(draggedCard.top - cardBounds.top) < snapDistance) guides.push({ y: cardBounds.top });
      if (Math.abs(draggedCard.bottom - cardBounds.bottom) < snapDistance) guides.push({ y: cardBounds.bottom });
      if (Math.abs(draggedCard.centerY - cardBounds.centerY) < snapDistance) guides.push({ y: cardBounds.centerY });
    });

    return guides;
  }, [cards]);

  // Apply snap and alignment
  const applySnapAndAlignment = useCallback((position: { x: number; y: number }, draggedCardId: string, size: { width: number; height: number }) => {
    const guides = calculateAlignmentGuides(draggedCardId, position, size);
    let snappedPosition = { ...position };
    const snapDistance = 10;

    guides.forEach(guide => {
      if (guide.x !== undefined) {
        const draggedCard = {
          left: position.x,
          right: position.x + size.width,
          centerX: position.x + size.width / 2
        };

        if (Math.abs(draggedCard.left - guide.x) < snapDistance) {
          snappedPosition.x = guide.x;
        } else if (Math.abs(draggedCard.right - guide.x) < snapDistance) {
          snappedPosition.x = guide.x - size.width;
        } else if (Math.abs(draggedCard.centerX - guide.x) < snapDistance) {
          snappedPosition.x = guide.x - size.width / 2;
        }
      }

      if (guide.y !== undefined) {
        const draggedCard = {
          top: position.y,
          bottom: position.y + size.height,
          centerY: position.y + size.height / 2
        };

        if (Math.abs(draggedCard.top - guide.y) < snapDistance) {
          snappedPosition.y = guide.y;
        } else if (Math.abs(draggedCard.bottom - guide.y) < snapDistance) {
          snappedPosition.y = guide.y - size.height;
        } else if (Math.abs(draggedCard.centerY - guide.y) < snapDistance) {
          snappedPosition.y = guide.y - size.height / 2;
        }
      }
    });

    return snappedPosition;
  }, [calculateAlignmentGuides]);

  // Handle card drag move with perfect cursor tracking and throttling
  const handleCardDragMoveCore = useCallback((e: MouseEvent) => {
    if (!draggingCard || !dragStartPosition) return;

    // Get canvas bounds for boundary calculations
    const canvas = document.querySelector('.dashboard-canvas') as HTMLElement;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate mouse position relative to canvas, accounting for zoom and pan
    const mouseX = (e.clientX - canvasRect.left) / zoom;
    const mouseY = (e.clientY - canvasRect.top) / zoom;

    if (isDraggingMultiple) {
      // Handle multiple card dragging
      const updates: Array<{ cardId: string; x: number; y: number }> = [];
      
      Object.keys(initialMultiCardPositions).forEach(cardId => {
        const card = cards[cardId];
        const initialPos = initialMultiCardPositions[cardId];
        if (!card || !initialPos) return;

        // Calculate the offset from where the user initially clicked on this card
        const cardOffset = cardId === draggingCard ? dragOffset : { x: 0, y: 0 };
        
        // Perfect cursor tracking: position card so the clicked point follows the mouse
        const rawPosition = {
          x: mouseX - cardOffset.x,
          y: mouseY - cardOffset.y
        };

        // Fast boundary constraints with group support
        const effectiveCanvasWidth = canvasRect.width / zoom;
        const effectiveCanvasHeight = Math.max(canvasHeight, canvasRect.height) / zoom;
        
        let minX = 8;
        let minY = 8;
        let maxX = effectiveCanvasWidth - card.width - 16;
        let maxY = effectiveCanvasHeight - card.height - 8;
        
        // Check if card is in a group and constrain to group boundaries
        if (getCardGroup) {
          const cardGroup = getCardGroup(cardId);
          if (cardGroup && !cardGroup.locked) {
            // Only apply group constraints if the card is actually in a group
            minX = Math.max(minX, cardGroup.x + 5);
            minY = Math.max(minY, cardGroup.y + 5);
            maxX = Math.min(maxX, cardGroup.x + cardGroup.width - card.width - 5);
            maxY = Math.min(maxY, cardGroup.y + cardGroup.height - card.height - 5);
          }
          // If cardGroup is null/undefined, card is not in a group - only canvas constraints apply
        }
        
        const constrainedX = Math.max(minX, Math.min(maxX, rawPosition.x));
        const constrainedY = Math.max(minY, Math.min(maxY, rawPosition.y));

        updates.push({ cardId, x: constrainedX, y: constrainedY });
      });

      // Direct update for responsive tracking - RAF was causing flashing
      onUpdateMultiplePositions(updates);
    } else {
      // Handle single card dragging with perfect cursor tracking
      const card = cards[draggingCard];
      if (!card) return;

      // Perfect cursor tracking: position card so the clicked point follows the mouse exactly
      const rawPosition = {
        x: mouseX - dragOffset.x,
        y: mouseY - dragOffset.y
      };

      // Fast boundary constraints with group support
      const effectiveCanvasWidth = canvasRect.width / zoom;
      const effectiveCanvasHeight = Math.max(canvasHeight, canvasRect.height) / zoom;
      
      let minX = 8;
      let minY = 8;
      let maxX = effectiveCanvasWidth - card.width - 16;
      let maxY = effectiveCanvasHeight - card.height - 8;
      
      // Check if card is in a group and constrain to group boundaries
      if (getCardGroup) {
        const cardGroup = getCardGroup(draggingCard);
        if (cardGroup && !cardGroup.locked) {
          // Only apply group constraints if the card is actually in a group
          minX = Math.max(minX, cardGroup.x + 5);
          minY = Math.max(minY, cardGroup.y + 5);
          maxX = Math.min(maxX, cardGroup.x + cardGroup.width - card.width - 5);
          maxY = Math.min(maxY, cardGroup.y + cardGroup.height - card.height - 5);
        }
        // If cardGroup is null/undefined, card is not in a group - only canvas constraints apply
      }
      
      const constrainedX = Math.max(minX, Math.min(maxX, rawPosition.x));
      const constrainedY = Math.max(minY, Math.min(maxY, rawPosition.y));

      // Direct update for responsive tracking - RAF was causing flashing
      onUpdatePosition(draggingCard, constrainedX, constrainedY);
    }
  }, [draggingCard, dragStartPosition, initialCardPosition, initialMultiCardPositions, isDraggingMultiple, cards, onUpdatePosition, onUpdateMultiplePositions, applySnapAndAlignment, zoom, canvasHeight, dragOffset, getCardGroup]);

  // Throttled drag move handler for better performance
  const handleCardDragMove = useCallback(
    throttle(handleCardDragMoveCore, 4), // 4ms throttle for ~240fps - smoother movement
    [handleCardDragMoveCore]
  );

  // Handle card drag end
  const handleCardDragEnd = useCallback(() => {
    if (draggingCard) {
      // Reset all dragging styles
      const cardElement = document.querySelector(`[data-card-id="${draggingCard}"]`) as HTMLElement;
      if (cardElement) {
        cardElement.style.cursor = '';
        cardElement.style.zIndex = '';
        cardElement.style.transition = '';
        cardElement.style.willChange = '';
      }

      // Reset global styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Reset dragging state
      setDraggingCard(null);
      setDragStartPosition(null);
      setDragOffset({ x: 0, y: 0 });
      setInitialCardPosition({ x: 0, y: 0 });
      setInitialMultiCardPositions({});
      setIsDraggingMultiple(false);

      // Save to history after drag ends (meaningful action)
      if (onDragEnd) {
        onDragEnd();
      }
    }
  }, [draggingCard, onDragEnd]);

  // Add global drag event listeners
  useEffect(() => {
    if (draggingCard) {
      document.addEventListener('mousemove', handleCardDragMove);
      document.addEventListener('mouseup', handleCardDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleCardDragMove);
        document.removeEventListener('mouseup', handleCardDragEnd);
      };
    }
    return undefined; // Explicit return for when draggingCard is falsy
  }, [draggingCard, handleCardDragMove, handleCardDragEnd]);

  return {
    dragState: {
      isDragging: !!draggingCard,
      draggedCardId: draggingCard,
      dragOffset,
      startPosition: dragStartPosition || { x: 0, y: 0 }
    },
    handleDragStart,
    isDragging: !!draggingCard,
    draggedCardId: draggingCard,
    isDraggingMultiple
  };
}
