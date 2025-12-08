/**
 * Extracted card initialization logic
 * Handles grid positioning and initial card setup
 */

import { useEffect, useRef, useCallback } from 'react';
import { CARD_CONSTANTS } from '../utils/cardConstants';
import { logger } from '@/utils/logger';

// Import cardsPerRow from constants
const cardsPerRow = CARD_CONSTANTS.GRID.CARDS_PER_ROW;

interface UseCardInitializationProps {
  isLoadingLayout: boolean;
  cards: Record<string, any>;
  localUpdateCardSize: (cardId: string, width: number, height: number) => void;
  localUpdateCardPosition: (cardId: string, x: number, y: number) => void;
  serverUpdateCardSize: (cardId: string, width: number, height: number, position?: { x: number; y: number }) => void;
  serverUpdateCardPosition: (cardId: string, x: number, y: number) => void;
}

export const useCardInitialization = ({
  isLoadingLayout,
  cards,
  localUpdateCardSize,
  localUpdateCardPosition,
  serverUpdateCardSize,
  serverUpdateCardPosition,
}: UseCardInitializationProps) => {
  const occupiedGridPositionsRef = useRef<Map<string, { row: number; col: number }>>(new Map());
  const hasInitialized = useRef(false);

  // Helper to check if a position is a valid grid position
  const isValidGridPosition = useCallback((x: number, y: number): { row: number; col: number } | null => {
    const { GRID } = CARD_CONSTANTS;
    const col = Math.round((x - GRID.START_X) / GRID.HORIZONTAL_SPACING);
    const row = Math.round((y - GRID.START_Y) / GRID.VERTICAL_SPACING);
    const expectedX = GRID.START_X + (col * GRID.HORIZONTAL_SPACING);
    const expectedY = GRID.START_Y + (row * GRID.VERTICAL_SPACING);
    
    if (
      Math.abs(x - expectedX) < GRID.TOLERANCE &&
      Math.abs(y - expectedY) < GRID.TOLERANCE &&
      col >= 0 &&
      row >= 0
    ) {
      return { row, col };
    }
    return null;
  }, []);

  // Initialize grid positions for minimized cards
  useEffect(() => {
    if (hasInitialized.current) return;
    if (isLoadingLayout || Object.keys(cards).length === 0) {
      return;
    }

    // Small delay to ensure all cards are fully loaded
    const timeoutId = setTimeout(() => {
      if (hasInitialized.current) return;
      
      hasInitialized.current = true;
      logger.debug('Initializing grid from existing cards', { cardCount: Object.keys(cards).length });

      const allCards = Object.values(cards);
      const occupiedPositions = occupiedGridPositionsRef.current;
      const { GRID, MINIMIZED } = CARD_CONSTANTS;
      
      // Collect all minimized cards
      const minimizedCards = allCards.filter((card: any) => 
        card.width <= MINIMIZED.WIDTH && card.height <= MINIMIZED.HEIGHT
      );
      
      logger.debug('Found minimized cards', { count: minimizedCards.length });

      // Sort by card ID for consistent order across refreshes
      minimizedCards.sort((a, b) => a.id.localeCompare(b.id));

      // Reassign ALL minimized cards to sequential grid positions
      minimizedCards.forEach((card, index) => {
        const targetRow = Math.floor(index / cardsPerRow);
        const targetCol = index % cardsPerRow;
        
        const targetX = GRID.START_X + (targetCol * GRID.HORIZONTAL_SPACING);
        const targetY = GRID.START_Y + (targetRow * GRID.VERTICAL_SPACING);
        
        // Check if card is already in correct position
        const isCorrectSize = 
          Math.abs(card.width - MINIMIZED.WIDTH) < GRID.TOLERANCE &&
          Math.abs(card.height - MINIMIZED.HEIGHT) < GRID.TOLERANCE;
        const isCorrectPosition = 
          Math.abs(card.x - targetX) < GRID.TOLERANCE &&
          Math.abs(card.y - targetY) < GRID.TOLERANCE;
        
        // Check if card is in ANY valid grid position
        const currentGridPos = isValidGridPosition(card.x, card.y);
        const isInValidGridPos = currentGridPos !== null;
        
        if (isCorrectSize && isCorrectPosition) {
          logger.debug('Card already in correct position', { cardId: card.id, row: targetRow, col: targetCol });
          occupiedPositions.set(card.id, { row: targetRow, col: targetCol });
          return;
        }
        
        // If card is in a valid grid position but wrong one, check if that position is already taken
        if (isCorrectSize && isInValidGridPos && currentGridPos) {
          const isPositionTaken = Array.from(occupiedPositions.values()).some(
            pos => pos.row === currentGridPos.row && pos.col === currentGridPos.col
          );
          
          if (!isPositionTaken) {
            logger.debug('Card in valid grid position, keeping it', { 
              cardId: card.id, 
              row: currentGridPos.row, 
              col: currentGridPos.col 
            });
            occupiedPositions.set(card.id, currentGridPos);
            return;
          }
        }
        
        logger.debug('Repositioning card', {
          cardId: card.id,
          from: { x: card.x, y: card.y, width: card.width, height: card.height },
          to: { x: targetX, y: targetY, width: MINIMIZED.WIDTH, height: MINIMIZED.HEIGHT },
          grid: { row: targetRow, col: targetCol }
        });
        
        // Update local state
        localUpdateCardSize(card.id, MINIMIZED.WIDTH, MINIMIZED.HEIGHT);
        localUpdateCardPosition(card.id, targetX, targetY);
        
        // Persist to server
        serverUpdateCardSize(card.id, MINIMIZED.WIDTH, MINIMIZED.HEIGHT, { x: targetX, y: targetY });
        serverUpdateCardPosition(card.id, targetX, targetY);
        
        // Add to Map
        occupiedPositions.set(card.id, { row: targetRow, col: targetCol });
      });
      
      logger.info('Grid initialized', { 
        minimizedCards: occupiedPositions.size,
        totalCards: allCards.length 
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [
    isLoadingLayout,
    cards,
    localUpdateCardSize,
    localUpdateCardPosition,
    serverUpdateCardSize,
    serverUpdateCardPosition,
    isValidGridPosition,
  ]);

  return {
    occupiedGridPositionsRef,
    isValidGridPosition,
  };
};

