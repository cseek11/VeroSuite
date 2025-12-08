import { useState, useCallback } from 'react';

export interface PageCard {
  id: string;
  title: string;
  icon?: React.ComponentType<any>;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  size: { width: number; height: number };
  position?: { x: number; y: number };
  isMaximized?: boolean;
}

interface UsePageCardsReturn {
  pageCards: PageCard[];
  openPageCard: (card: Omit<PageCard, 'id'>) => string;
  closePageCard: (id: string) => void;
  updatePageCard: (id: string, updates: Partial<PageCard>) => void;
  isPageCardOpen: (pageId: string) => boolean;
  getPageCard: (id: string) => PageCard | undefined;
}

export const usePageCards = (): UsePageCardsReturn => {
  const [pageCards, setPageCards] = useState<PageCard[]>([]);

  const openPageCard = useCallback((card: Omit<PageCard, 'id'>) => {
    const id = `${card.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newCard: PageCard = {
      ...card,
      id,
      size: card.size || { width: 800, height: 600 },
      position: card.position || { x: 0, y: 0 },
      isMaximized: false,
    };

    setPageCards(prev => {
      // Remove existing card with same title to prevent duplicates
      const filtered = prev.filter(c => c.title !== card.title);
      return [...filtered, newCard];
    });

    return id;
  }, []);

  const closePageCard = useCallback((id: string) => {
    setPageCards(prev => prev.filter(card => card.id !== id));
  }, []);

  const updatePageCard = useCallback((id: string, updates: Partial<PageCard>) => {
    setPageCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, ...updates } : card
      )
    );
  }, []);

  const isPageCardOpen = useCallback((pageId: string) => {
    return pageCards.some(card => card.title.toLowerCase().replace(/\s+/g, '-') === pageId);
  }, [pageCards]);

  const getPageCard = useCallback((id: string) => {
    return pageCards.find(card => card.id === id);
  }, [pageCards]);

  return {
    pageCards,
    openPageCard,
    closePageCard,
    updatePageCard,
    isPageCardOpen,
    getPageCard,
  };
};
