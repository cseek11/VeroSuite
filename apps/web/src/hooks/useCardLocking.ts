import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/utils/logger';

const LOCKED_CARDS_STORAGE_KEY = 'verocards-v2-locked-cards';

export function useCardLocking() {
  const [lockedCards, setLockedCards] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(LOCKED_CARDS_STORAGE_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (error: unknown) {
        logger.warn('Failed to parse saved locked cards', { error }, 'useCardLocking');
      }
    }
    return new Set();
  });

  // Save locked cards to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCKED_CARDS_STORAGE_KEY, JSON.stringify(Array.from(lockedCards)));
    } catch (error: unknown) {
      logger.error('Failed to save locked cards', error, 'useCardLocking');
    }
  }, [lockedCards]);

  // Toggle card lock status
  const toggleCardLock = useCallback((cardId: string) => {
    setLockedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  // Lock multiple cards
  const lockCards = useCallback((cardIds: string[]) => {
    setLockedCards(prev => {
      const newSet = new Set(prev);
      cardIds.forEach(id => newSet.add(id));
      return newSet;
    });
  }, []);

  // Unlock multiple cards
  const unlockCards = useCallback((cardIds: string[]) => {
    setLockedCards(prev => {
      const newSet = new Set(prev);
      cardIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  }, []);

  // Check if card is locked
  const isCardLocked = useCallback((cardId: string) => {
    // Page cards can be locked/unlocked like regular cards
    return lockedCards.has(cardId);
  }, [lockedCards]);

  // Lock all cards
  const lockAllCards = useCallback((cardIds: string[]) => {
    setLockedCards(new Set(cardIds));
  }, []);

  // Unlock all cards
  const unlockAllCards = useCallback(() => {
    setLockedCards(new Set());
  }, []);

  return {
    lockedCards,
    toggleCardLock,
    lockCards,
    unlockCards,
    isCardLocked,
    lockAllCards,
    unlockAllCards
  };
}
