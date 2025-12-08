import { useState, useCallback, useEffect } from 'react';
import { CardGroup } from './useCardGrouping';

interface UseGroupDragDropProps {
  groups: Record<string, CardGroup>;
  onUpdateGroup: (groupId: string, updates: Partial<CardGroup>) => void;
  onUpdateMultipleCardPositions: (updates: Array<{ cardId: string; x: number; y: number }>) => void;
  cards: Record<string, any>;
  zoom?: number;
  canvasHeight?: number;
  getCardGroup?: (cardId: string) => CardGroup | undefined;
}

export function useGroupDragDrop({ 
  groups, 
  onUpdateGroup, 
  onUpdateMultipleCardPositions, 
  cards, 
  zoom = 1, 
  canvasHeight = 600
}: UseGroupDragDropProps) {
  const [draggingGroup, setDraggingGroup] = useState<string | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialGroupPosition, setInitialGroupPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialCardPositions, setInitialCardPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Start dragging group
  const handleGroupDragStart = useCallback((groupId: string, e: React.MouseEvent) => {
    const group = groups[groupId];
    if (!group || group.locked) return;

    // Only allow dragging from the group boundary (not the header)
    const groupElement = e.currentTarget as HTMLElement;
    const groupRect = groupElement.getBoundingClientRect();
    const clickY = e.clientY - groupRect.top;
    const headerHeight = 30; // Height of the group header
    
    // Don't start drag if clicking on the header area
    if (clickY < headerHeight) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Store initial positions
    setDraggingGroup(groupId);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setInitialGroupPosition({ x: group.x, y: group.y });

    // Store initial positions of all cards in the group
    const cardPositions: Record<string, { x: number; y: number }> = {};
    group.cardIds.forEach(cardId => {
      const card = cards[cardId];
      if (card) {
        cardPositions[cardId] = { x: card.x, y: card.y };
      }
    });
    setInitialCardPositions(cardPositions);

    // Set dragging styles
    groupElement.style.cursor = 'grabbing';
    groupElement.style.zIndex = '9999';
    groupElement.style.transition = 'none';
    groupElement.style.willChange = 'transform';

    // Set global styles
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [groups, cards]);

  // Handle group drag move with smooth performance
  const handleGroupDragMove = useCallback((e: MouseEvent) => {
    if (!draggingGroup || !dragStartPosition || !initialGroupPosition) return;

    // Use requestAnimationFrame for smooth 60fps updates
    requestAnimationFrame(() => {
      const group = groups[draggingGroup];
      if (!group) return;

      const deltaX = e.clientX - dragStartPosition.x;
      const deltaY = e.clientY - dragStartPosition.y;

      // Calculate new group position
      const newGroupX = initialGroupPosition.x + deltaX;
      const newGroupY = initialGroupPosition.y + deltaY;

      // Get canvas bounds for boundary constraints
      const canvas = document.querySelector('.dashboard-canvas') as HTMLElement;
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const effectiveCanvasWidth = canvasRect.width / zoom;
      const effectiveCanvasHeight = Math.max(canvasHeight, canvasRect.height) / zoom;

      // Constrain group to canvas boundaries
      const constrainedGroupX = Math.max(8, Math.min(newGroupX, effectiveCanvasWidth - group.width - 16));
      const constrainedGroupY = Math.max(8, Math.min(newGroupY, effectiveCanvasHeight - group.height - 8));

      // Update group position
      onUpdateGroup(draggingGroup, {
        x: constrainedGroupX,
        y: constrainedGroupY
      });

      // Calculate delta for card positions using initial group position
      const groupDeltaX = constrainedGroupX - initialGroupPosition.x;
      const groupDeltaY = constrainedGroupY - initialGroupPosition.y;

      // Update all card positions relative to the group movement
      const cardUpdates: Array<{ cardId: string; x: number; y: number }> = [];
      group.cardIds.forEach(cardId => {
        const initialCardPos = initialCardPositions[cardId];
        if (initialCardPos) {
          const newCardX = initialCardPos.x + groupDeltaX;
          const newCardY = initialCardPos.y + groupDeltaY;

          // Constrain cards to group boundaries first, then canvas boundaries
          const card = cards[cardId];
          if (card) {
            // Group boundary constraints (with padding)
            const groupMinX = constrainedGroupX + 5;
            const groupMinY = constrainedGroupY + 5;
            const groupMaxX = constrainedGroupX + group.width - card.width - 5;
            const groupMaxY = constrainedGroupY + group.height - card.height - 5;
            
            // Canvas boundary constraints
            const canvasMinX = 8;
            const canvasMinY = 8;
            const canvasMaxX = effectiveCanvasWidth - card.width - 16;
            const canvasMaxY = effectiveCanvasHeight - card.height - 8;
            
            // Use the most restrictive boundaries
            const constrainedCardX = Math.max(
              Math.max(groupMinX, canvasMinX), 
              Math.min(Math.min(groupMaxX, canvasMaxX), newCardX)
            );
            const constrainedCardY = Math.max(
              Math.max(groupMinY, canvasMinY), 
              Math.min(Math.min(groupMaxY, canvasMaxY), newCardY)
            );
            
            cardUpdates.push({ 
              cardId, 
              x: constrainedCardX, 
              y: constrainedCardY 
            });
          }
        }
      });

      // Update all card positions at once
      if (cardUpdates.length > 0) {
        onUpdateMultipleCardPositions(cardUpdates);
      }
    });
  }, [draggingGroup, dragStartPosition, initialGroupPosition, initialCardPositions, groups, cards, onUpdateGroup, onUpdateMultipleCardPositions, zoom, canvasHeight]);

  // Handle group drag end
  const handleGroupDragEnd = useCallback(() => {
    if (draggingGroup) {
      // Reset all dragging styles
      const groupElement = document.querySelector(`[data-group-id="${draggingGroup}"]`) as HTMLElement;
      if (groupElement) {
        groupElement.style.cursor = '';
        groupElement.style.zIndex = '';
        groupElement.style.transition = '';
        groupElement.style.willChange = '';
      }

      // Reset global styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Reset dragging state
      setDraggingGroup(null);
      setDragStartPosition(null);
      setInitialGroupPosition(null);
      setInitialCardPositions({});
    }
  }, [draggingGroup]);

  // Add global drag event listeners
  useEffect(() => {
    if (draggingGroup) {
      document.addEventListener('mousemove', handleGroupDragMove);
      document.addEventListener('mouseup', handleGroupDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleGroupDragMove);
        document.removeEventListener('mouseup', handleGroupDragEnd);
      };
    }
    return undefined;
  }, [draggingGroup, handleGroupDragMove, handleGroupDragEnd]);

  return {
    draggingGroup,
    handleGroupDragStart,
    isDraggingGroup: !!draggingGroup
  };
}
