import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { transformTemplateToKpiData } from '@/utils/kpiTemplateUtils';
import { isUserTemplate } from './cardHelpers';

export const handleKpiBuilderUseTemplate = async (
  template: any,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  currentLayoutId: string | null,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setShowKPIBuilder: (show: boolean) => void
) => {
  try {
    const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
    const kpiData = transformTemplateToKpiData(template, cardId);
    
    const linkage = isUserTemplate(template)
      ? { user_kpi_id: template.id }
      : { template_id: template.id };

    if (!linkage.user_kpi_id && !linkage.template_id) {
      throw new Error('No valid linkage found for template');
    }

    const cfg = {
      name: kpiData.name,
      description: kpiData.description,
      threshold: kpiData.threshold || { green: 80, yellow: 60, unit: '%' },
      chart: kpiData.chart || { type: 'line' }
    };

    const serverPayload = {
      card_uid: cardId,
      type: 'kpi-display',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      ...linkage,
      config: cfg
    };

    if (currentLayoutId) {
      let retryCount = 0;
      const maxRetries = 3;
      let lastError: any = null;

      while (retryCount < maxRetries) {
        try {
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
          break;
        } catch (err) {
          lastError = err;
          retryCount++;
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
      }

      if (retryCount >= maxRetries) {
        throw new Error(`KPI Builder server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
      }

      setKpiData(prev => ({
        ...prev,
        [cardId]: kpiData
      }));

    } else {
      throw new Error('No currentLayoutId available for KPI Builder atomic operation');
    }

    setShowKPIBuilder(false);

  } catch (error) {
    throw error;
  }
};

export const handleTemplateLibraryUseTemplate = async (
  template: any,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  currentLayoutId: string | null,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setShowTemplateLibrary: (show: boolean) => void
) => {
  try {
    const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
    const kpiData = transformTemplateToKpiData(template, cardId);
    
    const linkage = isUserTemplate(template)
      ? { user_kpi_id: template.id }
      : { template_id: template.id };

    if (!linkage.user_kpi_id && !linkage.template_id) {
      throw new Error('No valid linkage found for template');
    }

    const cfg = {
      name: kpiData.name,
      description: kpiData.description,
      threshold: kpiData.threshold || { green: 80, yellow: 60, unit: '%' },
      chart: kpiData.chart || { type: 'line' }
    };

    const serverPayload = {
      card_uid: cardId,
      type: 'kpi-display',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      ...linkage,
      config: cfg
    };

    if (currentLayoutId) {
      let retryCount = 0;
      const maxRetries = 3;
      let lastError: any = null;

      while (retryCount < maxRetries) {
        try {
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
          break;
        } catch (err) {
          lastError = err;
          retryCount++;
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
      }

      if (retryCount >= maxRetries) {
        throw new Error(`Server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
      }

      setKpiData(prev => ({
        ...prev,
        [cardId]: kpiData
      }));

    } else {
      throw new Error('No currentLayoutId available for atomic operation');
    }

    setShowTemplateLibrary(false);

  } catch (error) {
    throw error;
  }
};

export const handleKpiBuilderSave = async (
  kpi: any,
  addCard: (type: string, position?: { x: number; y: number }) => Promise<string>,
  currentLayoutId: string | null,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setShowKPIBuilder: (show: boolean) => void
) => {
  try {
    const trackingId = kpi.templateId || null;
    
    const userKpiData = {
      name: kpi.name,
      description: kpi.description,
      category: kpi.category || 'operational',
      threshold: kpi.threshold || {
        green: 80,
        yellow: 60,
        red: 40,
        unit: '%'
      },
      enabled: true,
      realTime: kpi.isRealTime || false,
      tags: [],
      templateId: trackingId,
      formulaExpression: kpi.formula?.expression || 'SUM(value)',
      formulaFields: (kpi.formula?.fields || []).filter((field: any) => field && typeof field === 'string')
    };

    const savedKpi = await enhancedApi.userKpis.create(userKpiData);

    let newCardId: string;
    try {
      newCardId = await addCard('kpi-display', { x: 0, y: 0 });
    } catch (error) {
      logger.error('Failed to add KPI display card', error, 'kpiHandlers');
      throw error;
    }

    setKpiData(prev => {
      const transformedKpiData = {
        id: savedKpi.id,
        name: savedKpi.name,
        description: savedKpi.description || 'User-defined KPI',
        category: savedKpi.category || 'operational',
        formula_expression: savedKpi.formula_expression,
        formula_fields: savedKpi.formula_fields || [],
        threshold_config: savedKpi.threshold_config || {},
        chart_config: savedKpi.chart_config || { type: 'number' },
        data_source_config: savedKpi.data_source_config || {},
        tags: savedKpi.tags || [],
        is_active: savedKpi.is_active,
        created_at: savedKpi.created_at,
        template_id: savedKpi.template_id,
        user_id: savedKpi.user_id,
        tenant_id: savedKpi.tenant_id,
        enabled: savedKpi.is_active !== false,
        realTime: savedKpi.realTime || false,
        threshold: savedKpi.threshold_config || {
          green: 80,
          yellow: 60,
          unit: '%'
        },
        chart: savedKpi.chart_config || { type: 'line' }
      };
      
      return {
        ...prev,
        [newCardId]: transformedKpiData
      };
    });

    if (currentLayoutId) {
      try {
        await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
          id: newCardId,
          type: 'kpi-display',
          x: 0,
          y: 0,
          width: 300,
          height: 200
        });
      } catch (error) {
        logger.error('Failed to persist KPI card to layout', error, 'kpiHandlers');
        throw error;
      }
    }

    setShowKPIBuilder(false);
  } catch (error) {
    logger.error('Failed to save KPI from builder', error, 'kpiHandlers');
    throw error;
  }
};
