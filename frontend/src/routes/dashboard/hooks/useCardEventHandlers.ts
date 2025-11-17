/**
 * useCardEventHandlers Hook
 * 
 * Handles all custom events for card operations (add, expand, minimize, restore, close).
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */

import { useEffect } from 'react';
import { logger } from '@/utils/logger';
import { CARD_CONSTANTS } from '../utils/constants';

interface UseCardEventHandlersProps {
  serverPersistence: {
    addCard: (type: string, position?: { x: number; y: number }) => Promise<string>;
    updateCardSize: (cardId: string, width: number, height: number, position?: { x: number; y: number }) => Promise<void>;
    updateCardPosition: (cardId: string, x: number, y: number) => Promise<void>;
  };
  localUpdateCardSize: (cardId: string, width: number, height: number) => void;
  localUpdateCardPosition: (cardId: string, x: number, y: number) => void;
  localRemoveCard: (cardId: string) => void;
  layout: {
    cards: Record<string, any>;
  };
  gridManager: {
    minimizeToGrid: (cardId: string) => { position?: { x: number; y: number }; gridPosition?: { row: number; col: number } } | null;
    releasePosition: (cardId: string) => void;
  };
  errorHandling: {
    showError: (message: string, operation: string, retryable: boolean, retryOperation?: () => Promise<void>) => string;
  };
  syncStatus: {
    startSync: () => void;
    completeSync: () => void;
    setError: (message: string) => void;
  };
  toggleCardLock: (cardId: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useCardEventHandlers({
  serverPersistence,
  localUpdateCardSize,
  localUpdateCardPosition,
  localRemoveCard,
  layout,
  gridManager,
  errorHandling,
  syncStatus,
  toggleCardLock,
  containerRef
}: UseCardEventHandlersProps) {
  useEffect(() => {
    const handleAddCanvasCard = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, position } = customEvent.detail;
      logger.debug('Received addCanvasCard event', { type, position });
      
      try {
        const cardId = await serverPersistence.addCard(type, position);
        logger.info('Successfully added card to canvas', { cardId, type });
        
        // Auto-lock page cards
        if (type.includes('-page') || type === 'customers-page') {
          toggleCardLock(cardId);
          logger.debug('Auto-locked page card', { cardId });
        }
      } catch (error) {
        logger.error('Failed to add card to canvas', error, 'CardSystem');
        errorHandling.showError(
          `Failed to add ${type} card. Please try again.`,
          'addCard',
          true
        );
      }
    };

    const handleExpandCard = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId } = customEvent.detail;
      logger.debug('Received expandCard event', { cardId });
      
      // Expand card to reasonable maximum size (not full canvas)
      const canvasContainer = containerRef.current;
      if (canvasContainer) {
        const rect = canvasContainer.getBoundingClientRect();
        // Use viewport dimensions with reasonable constraints
        const maxWidth = Math.min(rect.width * 0.95, 1600); // 95% of canvas or max 1600px
        const maxHeight = Math.min(rect.height * 0.9, 1000); // 90% of canvas or max 1000px
        const padding = 20;
        
        serverPersistence.updateCardSize(cardId, maxWidth - padding, maxHeight - padding);
        serverPersistence.updateCardPosition(cardId, padding / 2, padding / 2);
      }
      
      // Dispatch specific card event to trigger expanded display
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(`expandCard-${cardId}`));
      }, 100);
    };

    const handleMinimizeCard = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId, cardType: _cardType } = customEvent.detail;
      
      // Save current size/position before minimizing
      const card = layout.cards[cardId];
      if (!card) {
        logger.error('Card not found in layout', new Error(`Card ${cardId} not found`), 'CardSystem');
        return;
      }
      
      localStorage.setItem(`card-state-${cardId}`, JSON.stringify({
        originalSize: { width: card.width, height: card.height },
        originalPosition: { x: card.x, y: card.y }
      }));
      
      // Use constants and grid manager
      const { MINIMIZED } = CARD_CONSTANTS;
      
      // Find next available grid position using grid manager
      const result = gridManager.minimizeToGrid(cardId);
      
      if (!result.position || !result.gridPosition) {
        const _errorId = errorHandling.showError(
          'No available grid position found. Please restore some cards first.',
          'minimize',
          false
        );
        logger.error('Failed to minimize card - no grid position available', { cardId });
        return;
      }
      
      const { position, gridPosition } = result;
      
      logger.debug('Minimizing card', {
        cardId,
        from: { x: card.x, y: card.y, width: card.width, height: card.height },
        to: { ...position, width: MINIMIZED.WIDTH, height: MINIMIZED.HEIGHT },
        grid: gridPosition
      });
      
      // Update local state immediately
      localUpdateCardSize(cardId, MINIMIZED.WIDTH, MINIMIZED.HEIGHT);
      localUpdateCardPosition(cardId, position.x, position.y);
      
      // Persist to server with error handling
      syncStatus.startSync();
      const persistOperation = async () => {
        await serverPersistence.updateCardSize(cardId, MINIMIZED.WIDTH, MINIMIZED.HEIGHT, position);
        await serverPersistence.updateCardPosition(cardId, position.x, position.y);
      };
      
      try {
        await persistOperation();
        syncStatus.completeSync();
        logger.info('Card minimized successfully', { cardId });
      } catch (error) {
        // Only show error if it's a critical failure (5xx server errors, network failures)
        // Suppress 400 (Bad Request) errors since local operations work fine
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isHttp400 = /HTTP\s+400|400\s+Bad\s+Request/i.test(errorMessage);
        const isHttp5xx = /HTTP\s+5\d{2}/i.test(errorMessage);
        const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED');
        
        if (isHttp400) {
          // HTTP 400 is usually a validation error - local operation works, so suppress
          logger.debug('Card minimized locally (server validation error suppressed)', { cardId, reason: errorMessage });
          syncStatus.completeSync(); // Mark as successful since local operation worked
        } else if (isHttp5xx || isNetworkError) {
          // Critical errors - show to user
          syncStatus.setError('Failed to save minimized position');
          const _errorId = errorHandling.showError(
            'Failed to save minimized position. Changes are saved locally.',
            'minimize',
            true,
            persistOperation
          );
          logger.error('Failed to persist minimized card', error, 'CardSystem');
        } else {
          // Other non-critical errors - just log
          logger.debug('Card minimized locally (server persistence skipped)', { cardId, reason: errorMessage });
          syncStatus.completeSync(); // Still mark as successful since local operation worked
        }
      }
      
      // Dispatch event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(`minimizeCard-${cardId}`));
      }, 50);
    };

    const handleRestoreCard = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId, originalSize, originalPosition } = customEvent.detail;
      
      logger.debug('Restoring card', {
        cardId,
        size: originalSize,
        position: originalPosition
      });
      
      // Remove from occupied positions Map
      gridManager.releasePosition(cardId);
      
      // Restore to original size and position
      localUpdateCardSize(cardId, originalSize.width, originalSize.height);
      localUpdateCardPosition(cardId, originalPosition.x, originalPosition.y);
      
      // Persist to server with error handling
      syncStatus.startSync();
      const persistOperation = async () => {
        await serverPersistence.updateCardSize(cardId, originalSize.width, originalSize.height);
        await serverPersistence.updateCardPosition(cardId, originalPosition.x, originalPosition.y);
      };
      
      try {
        await persistOperation();
        syncStatus.completeSync();
        logger.info('Card restored successfully', { cardId });
      } catch (error) {
        // Only show error if it's a critical failure (5xx server errors, network failures)
        // Suppress 400 (Bad Request) errors since local operations work fine
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isHttp400 = /HTTP\s+400|400\s+Bad\s+Request/i.test(errorMessage);
        const isHttp5xx = /HTTP\s+5\d{2}/i.test(errorMessage);
        const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED');
        
        if (isHttp400) {
          // HTTP 400 is usually a validation error - local operation works, so suppress
          logger.debug('Card restored locally (server validation error suppressed)', { cardId, reason: errorMessage });
          syncStatus.completeSync(); // Mark as successful since local operation worked
        } else if (isHttp5xx || isNetworkError) {
          // Critical errors - show to user
          syncStatus.setError('Failed to save restored position');
          const _errorId = errorHandling.showError(
            'Failed to save restored position. Changes are saved locally.',
            'restore',
            true,
            persistOperation
          );
          logger.error('Failed to persist restored card', error, 'CardSystem');
        } else {
          // Other non-critical errors - just log
          logger.debug('Card restored locally (server persistence skipped)', { cardId, reason: errorMessage });
          syncStatus.completeSync(); // Still mark as successful since local operation worked
        }
      }
      
      // Dispatch specific card event to trigger normal display
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(`restoreCard-${cardId}`));
      }, 100);
    };

    const handleHalfScreenCard = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId } = customEvent.detail;
      logger.debug('Setting card to half-screen mode', { cardId });
      
      const card = layout.cards[cardId];
      if (!card) {
        logger.error('Card not found in layout', new Error(`Card ${cardId} not found`), 'CardSystem');
        return;
      }

      // Save current state before changing to half-screen
      localStorage.setItem(`card-state-${cardId}`, JSON.stringify({
        originalSize: { width: card.width, height: card.height },
        originalPosition: { x: card.x, y: card.y }
      }));

      const canvasContainer = containerRef.current;
      if (!canvasContainer) return;

      const rect = canvasContainer.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;
      
      // Calculate half-screen dimensions
      const halfWidth = Math.floor(canvasWidth * 0.48); // 48% to leave some gap
      const halfHeight = Math.min(canvasHeight * 0.9, 800); // 90% of canvas or max 800px
      const gap = canvasWidth * 0.02; // 2% gap between cards
      
      // Find if there's already a card in half-screen mode
      const allCards = Object.values(layout.cards);
      const halfScreenCards = allCards.filter((c: any) => {
        // Check if card is approximately half-screen width
        const isHalfWidth = Math.abs(c.width - halfWidth) < 50;
        const isOnLeft = c.x < canvasWidth * 0.5;
        const isOnRight = c.x >= canvasWidth * 0.5;
        return isHalfWidth && (isOnLeft || isOnRight);
      });

      let newX: number;
      const newY = 20; // Top padding

      if (halfScreenCards.length === 0) {
        // No other half-screen cards, place on left
        newX = gap;
      } else if (halfScreenCards.length === 1) {
        // One card already in half-screen, place on opposite side
        const existingCard = halfScreenCards[0] as any;
        const isExistingOnLeft = existingCard.x < canvasWidth * 0.5;
        newX = isExistingOnLeft ? canvasWidth - halfWidth - gap : gap;
      } else {
        // Multiple half-screen cards, place on right side
        newX = canvasWidth - halfWidth - gap;
      }

      // Update card size and position
      localUpdateCardSize(cardId, halfWidth, halfHeight);
      localUpdateCardPosition(cardId, newX, newY);

      // Persist to server
      syncStatus.startSync();
      const persistOperation = async () => {
        await serverPersistence.updateCardSize(cardId, halfWidth, halfHeight);
        await serverPersistence.updateCardPosition(cardId, newX, newY);
      };

      persistOperation().then(() => {
        syncStatus.completeSync();
        logger.info('Card set to half-screen mode', { cardId });
      }).catch((error) => {
        logger.error('Failed to persist half-screen card', error, 'CardSystem');
        syncStatus.completeSync(); // Still mark as complete since local update worked
      });

      // Dispatch event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(`halfScreenCard-${cardId}`));
      }, 100);
    };

    const handleCloseCard = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId } = customEvent.detail;
      logger.debug('Closing card', { cardId });
      
      // Remove from occupied positions Map
      gridManager.releasePosition(cardId);
      
      // Remove card from canvas
      localRemoveCard(cardId);
      
      logger.info('Card closed', { cardId });
    };

    window.addEventListener('addCanvasCard', handleAddCanvasCard);
    window.addEventListener('expandCard', handleExpandCard);
    window.addEventListener('minimizeCard', handleMinimizeCard);
    window.addEventListener('restoreCard', handleRestoreCard);
    window.addEventListener('halfScreenCard', handleHalfScreenCard);
    window.addEventListener('closeCard', handleCloseCard);
    
    return () => {
      window.removeEventListener('addCanvasCard', handleAddCanvasCard);
      window.removeEventListener('expandCard', handleExpandCard);
      window.removeEventListener('minimizeCard', handleMinimizeCard);
      window.removeEventListener('restoreCard', handleRestoreCard);
      window.removeEventListener('halfScreenCard', handleHalfScreenCard);
      window.removeEventListener('closeCard', handleCloseCard);
    };
  }, [serverPersistence, layout.cards, gridManager, errorHandling, syncStatus, toggleCardLock, containerRef, localUpdateCardSize, localUpdateCardPosition, localRemoveCard]);
}

