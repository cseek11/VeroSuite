import { useState, useCallback } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { getDefaultCardSize } from '../utils/cardHelpers';
import { logger } from '@/utils/logger';

export const useServerPersistence = (
  localUpdateCardPosition: (cardId: string, x: number, y: number) => void,
  localUpdateCardSize: (cardId: string, width: number, height: number) => void,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  localRemoveCard: (cardId: string) => void,
  localUpdateMultipleCardPositions: (updates: Array<{ cardId: string; x: number; y: number }>) => void,
  loadLayoutFromData: (layout: any) => void,
  layout: any,
  kpiData: Record<string, any>,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  KPI_DATA_STORAGE_KEY: string
) => {
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [serverLoadSucceeded, setServerLoadSucceeded] = useState(false);

  const updateCardPosition = useCallback(async (cardId: string, x: number, y: number) => {
    localUpdateCardPosition(cardId, x, y);
    
    // Only attempt server persistence if we have a layout ID
    // If no layout ID, operation succeeds locally (no error)
    if (!currentLayoutId) {
      logger.debug('No layout ID, skipping server persistence for card position', { cardId });
      return; // Success - local update only
    }
    
    try {
      const card = layout.cards[cardId];
      if (!card) {
        logger.warn('Card not found in layout, skipping server persistence', { cardId });
        return; // Not an error - card might not be in layout yet
      }
      
      const kd = kpiData[cardId] || {};
      const linkage: any = {};
      // Only include user_kpi_id if it's a valid UUID
      if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
        linkage.user_kpi_id = kd.user_kpi_id;
      }
      // Only include template_id if it's a valid UUID or valid string
      if (kd.template_id && typeof kd.template_id === 'string') {
        // Check if it's a valid UUID format
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
          linkage.template_id = kd.template_id;
        }
      }
      await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
        card_uid: cardId,
        type: card.type,
        x: x,  // Use the new x parameter
        y: y,  // Use the new y parameter
        width: card.width,
        height: card.height,
        ...linkage
      });
      logger.debug('Card position updated on server successfully', { cardId });
    } catch (error) {
      logger.error('Failed to update card position on server', error, 'ServerPersistence');
      // Re-throw only actual errors (network failures, API errors, etc.)
      throw error;
    }
  }, [localUpdateCardPosition, currentLayoutId, layout.cards, kpiData]);

  const updateCardSize = useCallback(async (cardId: string, width: number, height: number, position?: { x: number; y: number }) => {
    localUpdateCardSize(cardId, width, height);
    
    // Only attempt server persistence if we have a layout ID
    // If no layout ID, operation succeeds locally (no error)
    if (!currentLayoutId) {
      logger.debug('No layout ID, skipping server persistence for card size', { cardId });
      return; // Success - local update only
    }
    
    try {
      const card = layout.cards[cardId];
      if (!card) {
        logger.warn('Card not found in layout, skipping server persistence', { cardId });
        return; // Not an error - card might not be in layout yet
      }
      
      const kd = kpiData[cardId] || {};
      const linkage: any = {};
      // Only include user_kpi_id if it's a valid UUID
      if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
        linkage.user_kpi_id = kd.user_kpi_id;
      }
      // Only include template_id if it's a valid UUID or valid string
      if (kd.template_id && typeof kd.template_id === 'string') {
        // Check if it's a valid UUID format
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
          linkage.template_id = kd.template_id;
        }
      }
      // Use provided position if available, otherwise use current card position
      const x = position?.x ?? card.x;
      const y = position?.y ?? card.y;
      await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
        card_uid: cardId,
        type: card.type,
        x: x,
        y: y,
        width: width,  // Use the new width parameter
        height: height, // Use the new height parameter
        ...linkage
      });
      logger.debug('Card size updated on server successfully', { cardId });
    } catch (error) {
      logger.error('Failed to update card size on server', error, 'ServerPersistence');
      // Re-throw only actual errors (network failures, API errors, etc.)
      throw error;
    }
  }, [localUpdateCardSize, currentLayoutId, layout.cards, kpiData]);

  const addCard = useCallback(async (type: string, position?: { x: number; y: number }) => {
    const cardId = localAddCard(type, position);

    if (currentLayoutId) {
      try {
        const pos = position || { x: 0, y: 0 };
        const defaultSize = getDefaultCardSize(type);
        const kd = kpiData[cardId] || {};
        const linkage: any = {};
        // Only include user_kpi_id if it's a valid UUID
        if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
          linkage.user_kpi_id = kd.user_kpi_id;
        }
        // Only include template_id if it's a valid UUID
        if (kd.template_id && typeof kd.template_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
          linkage.template_id = kd.template_id;
        }
        await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
          card_uid: cardId,
          type,
          x: pos.x,
          y: pos.y,
          width: defaultSize.width,
          height: defaultSize.height,
          ...linkage
        });
      } catch (error) {
        logger.error('Failed to add card on server', error, 'ServerPersistence');
        throw error; // Re-throw for error handling system
      }
    }

    return cardId;
  }, [localAddCard, currentLayoutId, kpiData]);

  const removeCard = useCallback(async (cardId: string) => {
    localRemoveCard(cardId);
    setKpiData(prev => {
      if (!prev[cardId]) return prev;
      const next = { ...prev } as Record<string, any>;
      delete next[cardId];
      return next;
    });
    try { localStorage.setItem(KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData)); } catch {}

    if (currentLayoutId) {
      try {
        const cards = await enhancedApi.dashboardLayouts.listCards(currentLayoutId);
        const serverCard = cards.find((c: any) => c.card_uid === cardId);
        if (serverCard) {
          await enhancedApi.dashboardLayouts.deleteCard(serverCard.id);
        }
      } catch (error) {
        logger.error('Failed to remove card on server', error, 'ServerPersistence');
        // Don't throw - card is already removed locally
      }
    }
  }, [localRemoveCard, currentLayoutId, KPI_DATA_STORAGE_KEY, kpiData, setKpiData]);

  const updateMultipleCardPositions = useCallback(async (updates: Array<{ cardId: string; x: number; y: number }>) => {
    localUpdateMultipleCardPositions(updates);
    
    if (currentLayoutId) {
      try {
        for (const update of updates) {
          const card = layout.cards[update.cardId];
          if (card) {
            const kd = kpiData[update.cardId] || {};
            const linkage: any = {};
            // Only include user_kpi_id if it's a valid UUID
            if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
              linkage.user_kpi_id = kd.user_kpi_id;
            }
            // Only include template_id if it's a valid UUID
            if (kd.template_id && typeof kd.template_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
              linkage.template_id = kd.template_id;
            }
            await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
              card_uid: update.cardId,
              type: card.type,
              x: card.x,
              y: card.y,
              width: card.width,
              height: card.height,
              ...linkage
            });
          }
        }
      } catch (error) {
        logger.error('Failed to update multiple card positions on server', error, 'ServerPersistence');
        throw error; // Re-throw for error handling system
      }
    }
  }, [localUpdateMultipleCardPositions, currentLayoutId, layout.cards, kpiData]);

  return {
    currentLayoutId,
    setCurrentLayoutId,
    isLoadingLayout,
    setIsLoadingLayout,
    serverLoadSucceeded,
    setServerLoadSucceeded,
    updateCardPosition,
    updateCardSize,
    addCard,
    removeCard,
    updateMultipleCardPositions
  };
};
