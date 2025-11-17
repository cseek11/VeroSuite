/**
 * useDashboardKeyboardShortcuts Hook
 * 
 * Configures keyboard shortcuts for the dashboard.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */

import { useCallback } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getDefaultCardSize } from '../utils/cardHelpers';

interface UseDashboardKeyboardShortcutsProps {
  serverPersistence: {
    addCard: (type: string, position?: { x: number; y: number }) => Promise<string>;
    removeCard: (cardId: string) => void;
    updateCardSize: (cardId: string, width: number, height: number) => void;
  };
  dashboardState: {
    setSelectedCards: (cards: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
    handleSelectAll: (cardIds: string[]) => void;
    handleDeselectAll: () => void;
    setShowKeyboardHelp: (show: boolean) => void;
    selectedCards: Set<string>;
  };
  layout: {
    cards: Record<string, any>;
  };
  autoArrange: (type: 'grid' | 'list' | 'compact') => void;
  undo: () => void;
  redo: () => void;
}

export function useDashboardKeyboardShortcuts({
  serverPersistence,
  dashboardState,
  layout,
  autoArrange,
  undo,
  redo
}: UseDashboardKeyboardShortcutsProps) {
  return useKeyboardShortcuts({
    onAddCard: useCallback((type: string) => {
      serverPersistence.addCard(type).then(cardId => {
        dashboardState.setSelectedCards(new Set([cardId]));
      });
    }, [serverPersistence, dashboardState]),
    onDuplicateCards: useCallback((cardIds: string[]) => {
      cardIds.forEach(cardId => {
        const originalCard = layout.cards[cardId];
        if (originalCard) {
          serverPersistence.addCard(originalCard.type, { x: originalCard.x + 20, y: originalCard.y + 20 });
        }
      });
    }, [layout.cards, serverPersistence]),
    onDeleteCards: useCallback((cardIds: string[]) => {
      cardIds.forEach(serverPersistence.removeCard);
      dashboardState.setSelectedCards(new Set());
    }, [serverPersistence, dashboardState]),
    onAutoArrange: autoArrange,
    onResetCards: useCallback((cardIds: string[]) => {
      cardIds.forEach(cardId => {
        const card = layout.cards[cardId];
        if (card) {
          const defaultSize = getDefaultCardSize(card.type);
          serverPersistence.updateCardSize(cardId, defaultSize.width, defaultSize.height);
        }
      });
    }, [layout.cards, serverPersistence]),
    onSelectAll: () => dashboardState.handleSelectAll(Object.keys(layout.cards)),
    onDeselectAll: dashboardState.handleDeselectAll,
    onShowHelp: () => dashboardState.setShowKeyboardHelp(true),
    onUndo: undo,
    onRedo: redo,
    selectedCards: dashboardState.selectedCards
  });
}






