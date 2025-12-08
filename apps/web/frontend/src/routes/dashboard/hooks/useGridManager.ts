/**
 * Grid management for minimized cards
 * Handles position allocation and tracking
 */

import { useRef, useCallback } from 'react';
import { CARD_CONSTANTS } from '../utils/cardConstants';
import { logger } from '@/utils/logger';

export const useGridManager = () => {
  const occupiedGridPositionsRef = useRef<Map<string, { row: number; col: number }>>(new Map());
  const { GRID, MINIMIZED: _MINIMIZED } = CARD_CONSTANTS;

  /**
   * Find the next available grid position
   */
  const findNextAvailablePosition = useCallback((): { row: number; col: number } | null => {
    const occupiedPositions = occupiedGridPositionsRef.current;
    const positions = Array.from(occupiedPositions.values());
    
    // Find first available position
    for (let row = 0; row < 100; row++) { // Max 100 rows
      for (let col = 0; col < GRID.CARDS_PER_ROW; col++) {
        const isOccupied = positions.some(pos => pos.row === row && pos.col === col);
        if (!isOccupied) {
          return { row, col };
        }
      }
    }
    
    logger.warn('No available grid position found', { occupiedCount: occupiedPositions.size });
    return null;
  }, []);

  /**
   * Reserve a grid position for a card
   */
  const reservePosition = useCallback((cardId: string, row: number, col: number): boolean => {
    const occupiedPositions = occupiedGridPositionsRef.current;
    
    // Check if position is already taken
    const isTaken = Array.from(occupiedPositions.values()).some(
      pos => pos.row === row && pos.col === col
    );
    
    if (isTaken) {
      logger.warn('Position already taken', { cardId, row, col });
      return false;
    }
    
    occupiedPositions.set(cardId, { row, col });
    logger.debug('Position reserved', { cardId, row, col, totalOccupied: occupiedPositions.size });
    return true;
  }, []);

  /**
   * Release a grid position
   */
  const releasePosition = useCallback((cardId: string): void => {
    const occupiedPositions = occupiedGridPositionsRef.current;
    const wasOccupied = occupiedPositions.delete(cardId);
    
    if (wasOccupied) {
      logger.debug('Position released', { cardId, remainingOccupied: occupiedPositions.size });
    }
  }, []);

  /**
   * Get pixel coordinates for a grid position
   */
  const getPixelPosition = useCallback((row: number, col: number): { x: number; y: number } => {
    const x = GRID.START_X + (col * GRID.HORIZONTAL_SPACING);
    const y = GRID.START_Y + (row * GRID.VERTICAL_SPACING);
    return { x, y };
  }, []);

  /**
   * Check if a position is valid grid position
   */
  const isValidGridPosition = useCallback((x: number, y: number): { row: number; col: number } | null => {
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

  /**
   * Minimize a card to grid
   */
  const minimizeToGrid = useCallback((cardId: string): { 
    position: { x: number; y: number } | null;
    gridPosition: { row: number; col: number } | null;
  } => {
    const gridPos = findNextAvailablePosition();
    if (!gridPos) {
      return { position: null, gridPosition: null };
    }
    
    const pixelPos = getPixelPosition(gridPos.row, gridPos.col);
    const reserved = reservePosition(cardId, gridPos.row, gridPos.col);
    
    if (!reserved) {
      return { position: null, gridPosition: null };
    }
    
    return { position: pixelPos, gridPosition: gridPos };
  }, [findNextAvailablePosition, getPixelPosition, reservePosition]);

  return {
    occupiedGridPositionsRef,
    findNextAvailablePosition,
    reservePosition,
    releasePosition,
    getPixelPosition,
    isValidGridPosition,
    minimizeToGrid,
  };
};







