import { defaultCardSizes } from './constants';

export const getDefaultCardSize = (type: string) => {
  return defaultCardSizes[type] || { width: 280, height: 180 };
};

export const normalizeKpiForDisplay = (kpi: any) => ({
  id: kpi.id,
  name: kpi.name,
  description: kpi.description || 'User-defined KPI',
  category: kpi.category || 'operational',
  formula_expression: kpi.formula_expression || kpi.formulaExpression,
  formula_fields: kpi.formula_fields || kpi.formulaFields || [],
  threshold_config: kpi.threshold_config || kpi.threshold || {},
  chart_config: kpi.chart_config || kpi.chart || { type: 'number' },
  data_source_config: kpi.data_source_config || {},
  tags: kpi.tags || [],
  is_active: kpi.is_active !== false && (kpi.enabled !== false),
  created_at: kpi.created_at,
  template_id: kpi.template_id || kpi.templateId,
  user_id: kpi.user_id,
  tenant_id: kpi.tenant_id,
  enabled: kpi.is_active !== false && (kpi.enabled !== false),
  realTime: kpi.realTime || false,
  threshold: (kpi.threshold_config || kpi.threshold) || {
    green: 80,
    yellow: 60,
    unit: '%'
  },
  chart: kpi.chart_config || kpi.chart || { type: 'line' }
});

export const isUserTemplate = (template: any): boolean => {
  const t = template;
  return (
    t?.template_type === 'user' ||
    t?.source === 'user' ||
    t?.source === 'user_kpis' ||
    !!t?.user_id ||
    typeof t?.is_active !== 'undefined' ||
    t?.created_by_user === true ||
    t?.is_custom === true ||
    t?.category === 'custom' ||
    t?.category === 'user_created' ||
    (t?.formula && typeof t.formula === 'object' && t.formula.user_defined) ||
    (t?.threshold && typeof t.threshold === 'object' && t.threshold.user_customized) ||
    t?.metadata?.user_created ||
    t?.tags?.includes('user-created') ||
    t?.tags?.includes('custom')
  );
};











