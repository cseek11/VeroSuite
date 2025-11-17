import { useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

export interface BulkOperation {
  id: string;
  type: 'delete' | 'group' | 'resize' | 'move' | 'lock' | 'unlock' | 'duplicate';
  cardIds: string[];
  data?: any;
  timestamp: Date;
}

interface UseBulkOperationsProps {
  cards: Record<string, any>;
  selectedCards: Set<string>;
  onDeleteCards: (cardIds: string[]) => void;
  onGroupCards: (cardIds: string[], groupName?: string) => void;
  onUngroupCards: (cardIds: string[]) => void;
  onMoveCards: (cardIds: string[], deltaX: number, deltaY: number) => void;
  onResizeCards: (cardIds: string[], deltaWidth: number, deltaHeight: number) => void;
  onLockCards: (cardIds: string[]) => void;
  onUnlockCards: (cardIds: string[]) => void;
  onDuplicateCards: (cardIds: string[]) => void;
  onUpdateCardPosition: (cardId: string, x: number, y: number) => void;
  onUpdateCardSize: (cardId: string, width: number, height: number) => void;
  maxHistorySize?: number;
}

export function useBulkOperations({
  cards,
  selectedCards,
  onDeleteCards,
  onGroupCards,
  onUngroupCards,
  onMoveCards,
  onResizeCards,
  onLockCards,
  onUnlockCards,
  onDuplicateCards,
  onUpdateCardPosition,
  onUpdateCardSize,
  maxHistorySize = 50
}: UseBulkOperationsProps) {
  const [operationHistory, setOperationHistory] = useState<BulkOperation[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isActive: boolean;
  }>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isActive: false
  });

  const _selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add operation to history
  const addToHistory = useCallback((operation: BulkOperation) => {
    setOperationHistory(prev => {
      const newHistory = [operation, ...prev].slice(0, maxHistorySize);
      return newHistory;
    });
  }, [maxHistorySize]);

  // Bulk delete cards
  const bulkDelete = useCallback((cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `delete-${Date.now()}`,
      type: 'delete',
      cardIds: targetCards,
      timestamp: new Date()
    };

    onDeleteCards(targetCards);
    addToHistory(operation);
  }, [selectedCards, onDeleteCards, addToHistory]);

  // Bulk group cards
  const bulkGroup = useCallback((cardIds?: string[], groupName?: string) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length < 2) return;

    const operation: BulkOperation = {
      id: `group-${Date.now()}`,
      type: 'group',
      cardIds: targetCards,
      data: { groupName: groupName || `Group ${Date.now()}` },
      timestamp: new Date()
    };

    onGroupCards(targetCards, groupName);
    addToHistory(operation);
  }, [selectedCards, onGroupCards, addToHistory]);

  // Bulk ungroup cards
  const bulkUngroup = useCallback((cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `ungroup-${Date.now()}`,
      type: 'group',
      cardIds: targetCards,
      data: { action: 'ungroup' },
      timestamp: new Date()
    };

    onUngroupCards(targetCards);
    addToHistory(operation);
  }, [selectedCards, onUngroupCards, addToHistory]);

  // Bulk move cards
  const bulkMove = useCallback((deltaX: number, deltaY: number, cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `move-${Date.now()}`,
      type: 'move',
      cardIds: targetCards,
      data: { deltaX, deltaY },
      timestamp: new Date()
    };

    onMoveCards(targetCards, deltaX, deltaY);
    addToHistory(operation);
  }, [selectedCards, onMoveCards, addToHistory]);

  // Bulk resize cards
  const bulkResize = useCallback((deltaWidth: number, deltaHeight: number, cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `resize-${Date.now()}`,
      type: 'resize',
      cardIds: targetCards,
      data: { deltaWidth, deltaHeight },
      timestamp: new Date()
    };

    onResizeCards(targetCards, deltaWidth, deltaHeight);
    addToHistory(operation);
  }, [selectedCards, onResizeCards, addToHistory]);

  // Bulk lock cards
  const bulkLock = useCallback((cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `lock-${Date.now()}`,
      type: 'lock',
      cardIds: targetCards,
      timestamp: new Date()
    };

    onLockCards(targetCards);
    addToHistory(operation);
  }, [selectedCards, onLockCards, addToHistory]);

  // Bulk unlock cards
  const bulkUnlock = useCallback((cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `unlock-${Date.now()}`,
      type: 'unlock',
      cardIds: targetCards,
      timestamp: new Date()
    };

    onUnlockCards(targetCards);
    addToHistory(operation);
  }, [selectedCards, onUnlockCards, addToHistory]);

  // Bulk duplicate cards
  const bulkDuplicate = useCallback((cardIds?: string[]) => {
    const targetCards = cardIds || Array.from(selectedCards);
    if (targetCards.length === 0) return;

    const operation: BulkOperation = {
      id: `duplicate-${Date.now()}`,
      type: 'duplicate',
      cardIds: targetCards,
      timestamp: new Date()
    };

    onDuplicateCards(targetCards);
    addToHistory(operation);
  }, [selectedCards, onDuplicateCards, addToHistory]);

  // Selection box operations
  const startSelectionBox = useCallback((startX: number, startY: number) => {
    setSelectionBox({
      startX,
      startY,
      endX: startX,
      endY: startY,
      isActive: true
    });
  }, []);

  const updateSelectionBox = useCallback((endX: number, endY: number) => {
    setSelectionBox(prev => ({
      ...prev,
      endX,
      endY
    }));
  }, []);

  const endSelectionBox = useCallback(() => {
    setSelectionBox(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  // Get cards within selection box
  const getCardsInSelectionBox = useCallback(() => {
    if (!selectionBox.isActive) return [];

    const minX = Math.min(selectionBox.startX, selectionBox.endX);
    const maxX = Math.max(selectionBox.startX, selectionBox.endX);
    const minY = Math.min(selectionBox.startY, selectionBox.endY);
    const maxY = Math.max(selectionBox.startY, selectionBox.endY);

    return Object.entries(cards || {}).filter(([_, card]) => {
      const cardRight = card.x + card.width;
      const cardBottom = card.y + card.height;

      return (
        card.x < maxX &&
        cardRight > minX &&
        card.y < maxY &&
        cardBottom > minY
      );
    }).map(([cardId]) => cardId);
  }, [selectionBox, cards]);

  // Smart selection based on card relationships
  const smartSelect = useCallback((cardId: string, selectionType: 'similar' | 'nearby' | 'same-type' | 'same-group') => {
    const card = cards[cardId];
    if (!card) return [];

    let selectedCardIds: string[] = [];

    switch (selectionType) {
      case 'similar': {
        // Select cards with similar size and type
        selectedCardIds = Object.entries(cards || {})
          .filter(([id, c]) => {
            const sizeDiff = Math.abs(c.width - card.width) + Math.abs(c.height - card.height);
            return id !== cardId && c.type === card.type && sizeDiff < 100;
          })
          .map(([id]) => id);
        break;
      }

      case 'nearby': {
        // Select cards within a certain radius
        const radius = 200;
        selectedCardIds = Object.entries(cards || {})
          .filter(([id, c]) => {
            const distance = Math.sqrt(
              Math.pow(c.x - card.x, 2) + Math.pow(c.y - card.y, 2)
            );
            return id !== cardId && distance < radius;
          })
          .map(([id]) => id);
        break;
      }

      case 'same-type': {
        // Select all cards of the same type
        selectedCardIds = Object.entries(cards || {})
          .filter(([id, c]) => id !== cardId && c.type === card.type)
          .map(([id]) => id);
        break;
      }

      case 'same-group': {
        // Select cards in the same group (if grouping is implemented)
        // This would need to be implemented based on your grouping system
        selectedCardIds = [];
        break;
      }
    }

    return selectedCardIds;
  }, [cards]);

  // Undo last operation
  const undoLastOperation = useCallback(() => {
    if (operationHistory.length === 0) return false;

    const lastOperation = operationHistory[0];
    
    switch (lastOperation.type) {
      case 'delete': {
        // This would require storing the deleted card data to restore
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Cannot undo delete operation without card data', {}, 'useBulkOperations');
        }
        break;
      }
      case 'group': {
        if (lastOperation.data?.action === 'ungroup') {
          onGroupCards(lastOperation.cardIds, lastOperation.data.groupName);
        } else {
          onUngroupCards(lastOperation.cardIds);
        }
        break;
      }
      case 'move': {
        const { deltaX, deltaY } = lastOperation.data;
        lastOperation.cardIds.forEach(cardId => {
          const card = cards[cardId];
          if (card) {
            onUpdateCardPosition(cardId, card.x - deltaX, card.y - deltaY);
          }
        });
        break;
      }
      case 'resize': {
        const { deltaWidth, deltaHeight } = lastOperation.data;
        lastOperation.cardIds.forEach(cardId => {
          const card = cards[cardId];
          if (card) {
            onUpdateCardSize(cardId, card.width - deltaWidth, card.height - deltaHeight);
          }
        });
        break;
      }
      case 'lock': {
        onUnlockCards(lastOperation.cardIds);
        break;
      }
      case 'unlock': {
        onLockCards(lastOperation.cardIds);
        break;
      }
      case 'duplicate': {
        // This would require tracking which cards were duplicated
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Cannot undo duplicate operation', {}, 'useBulkOperations');
        }
        break;
      }
    }

    setOperationHistory(prev => prev.slice(1));
    return true;
  }, [operationHistory, cards, onGroupCards, onUngroupCards, onUpdateCardPosition, onUpdateCardSize, onLockCards, onUnlockCards]);

  // Clear operation history
  const clearHistory = useCallback(() => {
    setOperationHistory([]);
  }, []);

  // Get operation statistics
  const getOperationStats = useCallback(() => {
    const stats = {
      totalOperations: operationHistory.length,
      operationsByType: {} as Record<string, number>,
      lastOperation: operationHistory[0] || null,
      canUndo: operationHistory.length > 0
    };

    operationHistory.forEach(op => {
      stats.operationsByType[op.type] = (stats.operationsByType[op.type] || 0) + 1;
    });

    return stats;
  }, [operationHistory]);

  return {
    // State
    operationHistory,
    isBulkMode,
    selectionBox,
    
    // Actions
    bulkDelete,
    bulkGroup,
    bulkUngroup,
    bulkMove,
    bulkResize,
    bulkLock,
    bulkUnlock,
    bulkDuplicate,
    
    // Selection box
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox,
    getCardsInSelectionBox,
    
    // Smart selection
    smartSelect,
    
    // History management
    undoLastOperation,
    clearHistory,
    getOperationStats,
    
    // Mode management
    setIsBulkMode,
    
    // Utilities
    addToHistory
  };
}
