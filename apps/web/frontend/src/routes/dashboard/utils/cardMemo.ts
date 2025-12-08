/**
 * Memoization utilities for card rendering optimization
 */

import React from 'react';

/**
 * Memoized card component wrapper
 * Prevents re-renders when card props haven't changed
 */
export const memoizeCard = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

/**
 * Default card comparison function
 * Only re-renders if position, size, or selection state changes
 */
export const defaultCardComparison = <T extends { id: string; x: number; y: number; width: number; height: number }>(
  prevCard: T,
  nextCard: T,
  prevSelected: boolean,
  nextSelected: boolean,
  prevDragging: boolean,
  nextDragging: boolean
): boolean => {
  return (
    prevCard.x === nextCard.x &&
    prevCard.y === nextCard.y &&
    prevCard.width === nextCard.width &&
    prevCard.height === nextCard.height &&
    prevCard.id === nextCard.id &&
    prevSelected === nextSelected &&
    prevDragging === nextDragging
  );
};








