import { useState, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';

export interface KPIField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'date' | 'boolean';
  table: string;
  column: string;
  aggregation?: 'sum' | 'count' | 'avg' | 'min' | 'max';
}

export interface KPIFormula {
  id: string;
  name: string;
  expression: string;
  fields: string[]; // Field IDs used in the formula
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

export interface KPIThreshold {
  green: number;
  yellow: number;
  red: number;
  unit: string;
}

export interface KPIChartConfig {
  type: 'line' | 'bar' | 'pie' | 'gauge' | 'number';
  xAxis?: string;
  yAxis?: string;
  colorScheme?: string[];
  showLegend?: boolean;
  showTrend?: boolean;
}

export interface CustomKPI {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'customer' | 'compliance';
  formula: KPIFormula;
  threshold: KPIThreshold;
  chart: KPIChartConfig;
  dataSource: {
    table: string;
    filters?: Record<string, any>;
    timeRange?: {
      field: string;
      start: Date;
      end: Date;
    };
  };
  isRealTime: boolean;
  refreshInterval?: number; // in seconds
  templateId?: string; // Track which template was used (if any)
  createdAt: Date;
  updatedAt: Date;
}

interface UseKPIBuilderProps {
  availableFields?: KPIField[];
  onSave?: (kpi: CustomKPI) => void;
  onTest?: (kpi: CustomKPI) => Promise<any>;
}

export function useKPIBuilder({
  availableFields = [],
  onSave,
  onTest
}: UseKPIBuilderProps) {
  const [currentKPI, setCurrentKPI] = useState<Partial<CustomKPI>>({
    category: 'operational',
    formula: {
      id: 'formula-1',
      name: 'Custom Formula',
      expression: '',
      fields: [],
      validation: {
        isValid: false,
        errors: []
      }
    },
    threshold: {
      green: 80,
      yellow: 60,
      red: 40,
      unit: '%'
    },
    chart: {
      type: 'number',
      showTrend: true
    },
    dataSource: {
      table: 'jobs'
    },
    isRealTime: false
  });

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedItem: any;
    dragOverTarget: string | null;
  }>({
    isDragging: false,
    draggedItem: null,
    dragOverTarget: null
  });

  // Available data sources
  const dataSources = useMemo(() => [
    { id: 'jobs', name: 'Jobs', description: 'Service jobs and appointments' },
    { id: 'customers', name: 'Customers', description: 'Customer information' },
    { id: 'service_history', name: 'Service History', description: 'Historical service records' },
    { id: 'accounts', name: 'Accounts', description: 'Account and billing information' },
    { id: 'technicians', name: 'Technicians', description: 'Technician data and schedules' },
    { id: 'inventory', name: 'Inventory', description: 'Equipment and inventory items' }
  ], []);

  // Get fields for a specific table
  const getFieldsForTable = useCallback((tableId: string) => {
    return availableFields.filter(field => field.table === tableId);
  }, [availableFields]);

  // Update KPI property
  const updateKPI = useCallback((updates: Partial<CustomKPI>) => {
    setCurrentKPI(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  // Update formula
  const updateFormula = useCallback((formula: Partial<KPIFormula>) => {
    setCurrentKPI(prev => ({
      ...prev,
      formula: {
        ...prev.formula!,
        ...formula,
        validation: validateFormula(formula.expression || prev.formula?.expression || '', formula.fields || prev.formula?.fields || [])
      }
    }));
  }, []);

  // Validate formula expression
  const validateFormula = useCallback((expression: string, fields: string[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!expression.trim()) {
      errors.push('Formula expression cannot be empty');
      return { isValid: false, errors };
    }

    // Check for valid field references
    const fieldReferences = expression.match(/\{[^}]+\}/g) || [];
    fieldReferences.forEach(ref => {
      const fieldId = ref.slice(1, -1); // Remove { and }
      if (!fields.includes(fieldId)) {
        errors.push(`Field ${fieldId} is not selected`);
      }
    });

    // Check for basic syntax
    try {
      // Simple validation - replace field references with numbers for testing
      let testExpression = expression;
      fieldReferences.forEach(ref => {
        testExpression = testExpression.replace(ref, '1');
      });
      
      // Try to evaluate the expression
      new Function('return ' + testExpression)();
    } catch (_error) {
      errors.push('Invalid formula syntax');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Add field to formula
  const addFieldToFormula = useCallback((fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (!field) return;

    setCurrentKPI(prev => {
      const currentFields = prev.formula?.fields || [];
      const newFields = [...currentFields, fieldId];
      
      return {
        ...prev,
        formula: {
          ...prev.formula!,
          fields: newFields,
          expression: prev.formula?.expression || ''
        }
      };
    });
  }, [availableFields]);

  // Remove field from formula
  const removeFieldFromFormula = useCallback((fieldId: string) => {
    setCurrentKPI(prev => {
      const currentFields = prev.formula?.fields || [];
      const newFields = currentFields.filter(id => id !== fieldId);
      
      // Remove field references from expression
      let newExpression = prev.formula?.expression || '';
      newExpression = newExpression.replace(new RegExp(`\\{${fieldId}\\}`, 'g'), '');

      return {
        ...prev,
        formula: {
          ...prev.formula!,
          fields: newFields,
          expression: newExpression,
          validation: validateFormula(newExpression, newFields)
        }
      };
    });
  }, [validateFormula]);

  // Insert field reference into expression
  const insertFieldReference = useCallback((fieldId: string, position?: number) => {
    const fieldReference = `{${fieldId}}`;
    
    setCurrentKPI(prev => {
      const currentExpression = prev.formula?.expression || '';
      let newExpression: string;

      if (position !== undefined) {
        newExpression = currentExpression.slice(0, position) + fieldReference + currentExpression.slice(position);
      } else {
        newExpression = currentExpression + fieldReference;
      }

      return {
        ...prev,
        formula: {
          ...prev.formula!,
          expression: newExpression,
          validation: validateFormula(newExpression, prev.formula?.fields || [])
        }
      };
    });
  }, [validateFormula]);

  // Add text to formula (for operations, functions, etc.)
  const addToFormula = useCallback((text: string, position?: number) => {
    setCurrentKPI(prev => {
      const currentExpression = prev.formula?.expression || '';
      let newExpression: string;

      if (position !== undefined) {
        newExpression = currentExpression.slice(0, position) + text + currentExpression.slice(position);
      } else {
        newExpression = currentExpression + text;
      }

      return {
        ...prev,
        formula: {
          ...prev.formula!,
          expression: newExpression,
          validation: validateFormula(newExpression, prev.formula?.fields || [])
        }
      };
    });
  }, [validateFormula]);

  // Drag and drop handlers
  const handleDragStart = useCallback((item: any) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOverTarget: null
    });
  }, []);

  const handleDragOver = useCallback((targetId: string) => {
    setDragState(prev => ({
      ...prev,
      dragOverTarget: targetId
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverTarget: null
    });
  }, []);

  const handleDrop = useCallback((targetId: string) => {
    const { draggedItem } = dragState;
    
    if (!draggedItem) return;

    switch (targetId) {
      case 'formula-builder':
        if (draggedItem.type === 'field') {
          insertFieldReference(draggedItem.id);
        }
        break;
      case 'field-list':
        if (draggedItem.type === 'field') {
          addFieldToFormula(draggedItem.id);
        }
        break;
    }

    handleDragEnd();
  }, [dragState, insertFieldReference, addFieldToFormula, handleDragEnd]);

  // Test KPI
  const testKPI = useCallback(async () => {
    if (!currentKPI.name || !currentKPI.formula?.expression || !onTest) {
      return;
    }

    const testKPI: CustomKPI = {
      id: `test-${Date.now()}`,
      name: currentKPI.name,
      description: currentKPI.description || '',
      category: currentKPI.category || 'operational',
      formula: currentKPI.formula,
      threshold: currentKPI.threshold!,
      chart: currentKPI.chart!,
      dataSource: currentKPI.dataSource!,
      isRealTime: currentKPI.isRealTime || false,
      refreshInterval: currentKPI.refreshInterval,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const result = await onTest(testKPI);
      return result;
    } catch (error: unknown) {
      logger.error('KPI test failed', error, 'useKPIBuilder');
      throw error;
    }
  }, [currentKPI, onTest]);

  // Save KPI
  const saveKPI = useCallback(() => {
    if (!currentKPI.name || !currentKPI.formula?.expression || !onSave) {
      return;
    }

    const customKPI: CustomKPI = {
      id: `kpi-${Date.now()}`,
      name: currentKPI.name,
      description: currentKPI.description || '',
      category: currentKPI.category || 'operational',
      formula: currentKPI.formula,
      threshold: currentKPI.threshold!,
      chart: currentKPI.chart!,
      dataSource: currentKPI.dataSource!,
      isRealTime: currentKPI.isRealTime || false,
      refreshInterval: currentKPI.refreshInterval,
      templateId: currentKPI.templateId, // Include template ID if available
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(customKPI);
  }, [currentKPI, onSave]);

  // Reset builder
  const resetBuilder = useCallback(() => {
    setCurrentKPI({
      category: 'operational',
      formula: {
        id: 'formula-1',
        name: 'Custom Formula',
        expression: '',
        fields: [],
        validation: {
          isValid: false,
          errors: []
        }
      },
      threshold: {
        green: 80,
        yellow: 60,
        red: 40,
        unit: '%'
      },
      chart: {
        type: 'number',
        showTrend: true
      },
      dataSource: {
        table: 'jobs'
      },
      isRealTime: false
    });
  }, []);

  // Load template
  const loadTemplate = useCallback((template: Partial<CustomKPI>, templateId?: string) => {
    setCurrentKPI(prev => ({
      ...prev,
      ...template,
      templateId: templateId, // Track which template was used
      updatedAt: new Date()
    }));
  }, []);

  // Get formula preview
  const getFormulaPreview = useCallback(() => {
    if (!currentKPI.formula?.expression) return '';

    let preview = currentKPI.formula.expression;
    
    // Replace field references with field names
    currentKPI.formula.fields.forEach(fieldId => {
      const field = availableFields.find(f => f.id === fieldId);
      if (field) {
        preview = preview.replace(new RegExp(`\\{${fieldId}\\}`, 'g'), field.name);
      }
    });

    return preview;
  }, [currentKPI.formula, availableFields]);

  // Check if KPI is valid for saving
  const isKPIValid = useMemo(() => {
    return !!(
      currentKPI.name &&
      currentKPI.formula?.expression &&
      currentKPI.formula?.validation?.isValid &&
      currentKPI.dataSource?.table
    );
  }, [currentKPI]);

  return {
    // State
    currentKPI,
    dragState,
    dataSources,
    availableFields,
    
    // Actions
    updateKPI,
    updateFormula,
    addFieldToFormula,
    removeFieldFromFormula,
    insertFieldReference,
    addToFormula,
    
    // Drag and drop
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    
    // Utilities
    getFieldsForTable,
    validateFormula,
    testKPI,
    saveKPI,
    resetBuilder,
    loadTemplate,
    getFormulaPreview,
    
    // Computed
    isKPIValid
  };
}
