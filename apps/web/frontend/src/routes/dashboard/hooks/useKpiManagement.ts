import { useState, useEffect, useRef } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { KPI_DATA_STORAGE_KEY } from '../utils/constants';
import { logger } from '@/utils/logger';

export const useKpiManagement = () => {
  const [kpiData, setKpiData] = useState<Record<string, any>>({});
  const processedKpisRef = useRef<Set<string>>(new Set());

  // Persist KPI data changes
  useEffect(() => {
    try {
      localStorage.setItem(KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData));
    } catch (_e) {}
  }, [kpiData]);

  // Test KPI templates loading with proper error handling
  useEffect(() => {
    const testKpiTemplates = async () => {
      try {
        logger.debug('Testing KPI templates loading');
        const templates = await enhancedApi.kpiTemplates.list();
        logger.info('KPI templates test successful', { count: templates?.length || 0 });
      } catch (error) {
        logger.error('KPI templates test failed', error, 'KpiManagement');
        // Don't throw - let the component handle the error state
      }
    };
    testKpiTemplates();
  }, []);

  const loadServerLayoutData = async (
    layoutId: string,
    loadLayoutFromData: (layout: any) => void,
    setCurrentLayoutId: (id: string) => void,
    setServerLoadSucceeded: (success: boolean) => void
  ) => {
    // Load cards for this layout
    const cards = await enhancedApi.dashboardLayouts.listCards(layoutId);

    // Reconstruct layout.cards from server data
    const serverCards: Record<string, any> = {};
    const serverKpiData: Record<string, any> = {};

    // Build serverCards and collect KPI cards/template/userKPI IDs first
    const kpiCards: any[] = [];
    const templateIds: Set<string> = new Set();
    const userKpiIds: Set<string> = new Set();
    
    cards.forEach((card: any) => {
      serverCards[card.card_uid] = {
        id: card.card_uid,
        type: card.type,
        x: card.x,
        y: card.y,
        width: card.width,
        height: card.height
      };
      if (card.type === 'kpi-display' && (card.user_kpi_id || card.template_id)) {
        kpiCards.push(card);
        if (card.template_id) templateIds.add(card.template_id);
        if (card.user_kpi_id) userKpiIds.add(card.user_kpi_id);
      }
    });

    // Fetch templates and user KPIs if needed
    let templateMap: Record<string, any> = {};
    if (templateIds.size > 0) {
      try {
        const templates: any[] = await enhancedApi.kpiTemplates.list();
        templateMap = Object.fromEntries(
          (templates || [])
            .filter((t: any) => templateIds.has(t.id))
            .map((t: any) => [t.id, t])
        );
      } catch (_e) {}
    }

    let userKpiMap: Record<string, any> = {};
    if (userKpiIds.size > 0) {
      try {
        const userKpisList: any[] = await enhancedApi.userKpis.list();
        userKpiMap = Object.fromEntries(
          (userKpisList || [])
            .filter((u: any) => userKpiIds.has(u.id))
            .map((u: any) => [u.id, u])
        );
      } catch (_e) {}
    }

    // Build KPI display data
    kpiCards.forEach((card: any) => {
      const cfg = (card.config || {}) as any;
      const tpl = card.template_id ? templateMap[card.template_id] : undefined;
      const userKpi = card.user_kpi_id ? userKpiMap[card.user_kpi_id] : undefined;

      const threshold = cfg.threshold || userKpi?.threshold_config || tpl?.threshold_config || 
        { green: 80, yellow: 60, unit: '%' };
      const chart = cfg.chart || userKpi?.chart_config || tpl?.chart_config || { type: 'line' };
      const name = cfg.name || userKpi?.name || tpl?.name || 'KPI Display';
      const description = cfg.description || userKpi?.description || tpl?.description || '';

      const kpiDisplayData = {
        id: card.user_kpi_id || card.template_id,
        template_id: card.template_id,
        user_kpi_id: card.user_kpi_id,
        name,
        description,
        enabled: true,
        realTime: false,
        threshold,
        chart,
        config: cfg
      };

      serverKpiData[card.card_uid] = kpiDisplayData;
    });

    // Merge server cards with localStorage data (prioritize localStorage for page cards)
    const mergedCards = { ...serverCards };
    
    // Load localStorage data and merge page cards
    try {
      const saved = localStorage.getItem('verocards-v2-layout');
      if (saved) {
        const localLayout = JSON.parse(saved);
        if (localLayout.cards) {
          // Keep page cards from localStorage (they have updated sizes/positions)
          Object.keys(localLayout.cards).forEach(cardId => {
            if (cardId.includes('-page') || localLayout.cards[cardId].type.includes('-page')) {
              mergedCards[cardId] = localLayout.cards[cardId];
            }
          });
        }
      }
    } catch (error) {
      logger.warn('Failed to merge localStorage layout data', undefined, 'KpiManagement');
    }
    
    // Update layout with merged cards
    if (Object.keys(mergedCards).length > 0) {
      loadLayoutFromData({
        cards: mergedCards,
        canvasHeight: 600,
        theme: 'light'
      });
    }

    // Update KPI data
    if (Object.keys(serverKpiData).length > 0) {
      setKpiData(serverKpiData);
    }

    setCurrentLayoutId(layoutId);
    setServerLoadSucceeded(true);

    // If no server cards, ensure layout is empty
    if (Object.keys(serverCards).length === 0) {
      loadLayoutFromData({ cards: {}, canvasHeight: 600, theme: 'light' });
    }
  };

  return {
    kpiData,
    setKpiData,
    processedKpisRef,
    loadServerLayoutData
  };
};
