/**
 * Utility functions for transforming KPI template data
 */

export interface KpiTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formula_expression?: string;
  formula_fields?: Array<{ id: string }>;
  threshold_config?: {
    green?: number;
    yellow?: number;
    red?: number;
    unit?: string;
  };
  chart_config?: {
    type?: string;
  };
  data_source_config?: {
    table?: string;
    isRealTime?: boolean;
    refreshInterval?: number;
  };
}

export interface KpiDisplayData {
  id: string;
  name: string;
  description: string;
  category: string;
  formula: {
    id: string;
    name: string;
    expression: string;
    fields: string[];
    validation: {
      isValid: boolean;
      errors: any[];
    };
  };
  threshold: {
    green: number;
    yellow: number;
    red: number;
    unit: string;
  };
  chart: {
    type: 'number' | 'line' | 'bar' | 'pie' | 'gauge';
    colorScheme: string[];
  };
  dataSource: {
    table: string;
    timeRange: {
      field: string;
      start: Date;
      end: Date;
    };
  };
  enabled: boolean;
  realTime: boolean;
}

/**
 * Transforms a KPI template into KPI display data format
 */
export const transformTemplateToKpiData = (template: KpiTemplate, cardId: string): KpiDisplayData => {
  return {
    id: cardId,
    name: template.name,
    description: template.description,
    category: template.category === 'user' ? 'operational' : template.category,
    formula: {
      id: `formula-${Date.now()}`,
      name: `${template.name} Formula`,
      expression: template.formula_expression || '',
      fields: template.formula_fields?.map((field: any) => field.id) || [],
      validation: {
        isValid: true,
        errors: []
      }
    },
    threshold: {
      green: template.threshold_config?.green || 80,
      yellow: template.threshold_config?.yellow || 60,
      red: template.threshold_config?.red || 40,
      unit: template.threshold_config?.unit || '%'
    },
    chart: {
      type: (template.chart_config?.type as 'number' | 'line' | 'bar' | 'pie' | 'gauge') || 'number',
      colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
    },
    dataSource: {
      table: template.data_source_config?.table || '',
      timeRange: { 
        field: 'created_at', 
        start: new Date(), 
        end: new Date() 
      }
    },
    enabled: true,  // Templates are always enabled/active
    realTime: template.data_source_config?.isRealTime || false  // Only live view if real-time is enabled
  };
};
