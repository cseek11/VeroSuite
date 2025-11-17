import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  GripVertical,
  BarChart3,
  PieChart,
  TrendingUp,
  Gauge,
  Hash,
  Eye,
  AlertCircle,
  CheckCircle,
  Info as Help,
  Star,
  Search,
} from 'lucide-react';
import { useKPIBuilder, KPIField, CustomKPI } from '@/hooks/useKPIBuilder';
import { useKpiTemplates, useCreateKpiTemplate } from '@/hooks/useKpiTemplates';
import KpiTemplateLibrary from './KpiTemplateLibrary';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface KPIBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (kpi: CustomKPI) => void;
  onTest?: (kpi: CustomKPI) => Promise<any>;
  onUseTemplate?: (template: any) => void;
  availableFields?: KPIField[];
  initialKPI?: Partial<CustomKPI>;
  isEditingTemplate?: boolean;
  onSaveTemplate?: (template: any) => void;
}

const KPIBuilder: React.FC<KPIBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  onTest,
  onUseTemplate,
  availableFields = [],
  initialKPI,
  isEditingTemplate = false,
  onSaveTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'basic' | 'formula' | 'threshold' | 'chart' | 'preview' | 'help'>('basic');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');

  // Fetch templates from database
  const { data: templates, isLoading: templatesLoading } = useKpiTemplates();
  
  // Template creation hook
  const createTemplateMutation = useCreateKpiTemplate();

  // Filter templates based on search term
  const filteredTemplates = React.useMemo(() => {
    if (!templates || !Array.isArray(templates)) return [];
    
    if (!templateSearchTerm.trim()) return templates;
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(templateSearchTerm.toLowerCase())
    );
  }, [templates, templateSearchTerm]);

  // Separate system and user templates
  const systemTemplates = filteredTemplates.filter(template => template.category !== 'user');
  const userTemplates = filteredTemplates.filter(template => template.category === 'user');

  const kpiBuilder = useKPIBuilder({
    availableFields,
    onSave: onSave || (() => {}),
    onTest: async (kpi) => {
      setIsTesting(true);
      try {
        const result = await onTest?.(kpi);
        setTestResult(result);
        return result;
      } finally {
        setIsTesting(false);
      }
    }
  });

  // Load initial KPI if provided
  React.useEffect(() => {
    if (initialKPI && isOpen) {
      kpiBuilder.loadTemplate(initialKPI);
    }
  }, [initialKPI, isOpen]);

  const chartTypes = [
    { id: 'number', name: 'Number', icon: Hash, description: 'Simple numeric display' },
    { id: 'gauge', name: 'Gauge', icon: Gauge, description: 'Circular gauge with thresholds' },
    { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Trend over time' },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Category comparison' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Proportion breakdown' }
  ];

  const categories = [
    { id: 'financial', name: 'Financial', color: 'text-green-600 bg-green-100' },
    { id: 'operational', name: 'Operational', color: 'text-blue-600 bg-blue-100' },
    { id: 'customer', name: 'Customer', color: 'text-purple-600 bg-purple-100' },
    { id: 'compliance', name: 'Compliance', color: 'text-orange-600 bg-orange-100' }
  ];

  const handleSave = async () => {
    if (!kpiBuilder.isKPIValid) return;

    if (isEditingTemplate && onSaveTemplate) {
      // Save as template
      const templateData = {
        name: kpiBuilder.currentKPI.name!,
        description: kpiBuilder.currentKPI.description || '',
        category: kpiBuilder.currentKPI.category || 'operational',
        template_type: 'user' as const,
        formula_expression: kpiBuilder.currentKPI.formula?.expression || '',
        formula_fields: kpiBuilder.currentKPI.formula?.fields.map(fieldId => {
          const field = availableFields.find(f => f.id === fieldId);
          return {
            field_name: field?.name || fieldId,
            field_type: field?.type || 'number',
            table_name: field?.table || '',
            column_name: field?.column || fieldId,
            display_name: field?.name || fieldId,
            description: `${field?.name || fieldId} field from ${field?.table || 'unknown'} table`
          };
        }) || [],
        threshold_config: kpiBuilder.currentKPI.threshold || {
          green: 80,
          yellow: 60,
          red: 40,
          unit: '%'
        },
        chart_config: {
          type: kpiBuilder.currentKPI.chart?.type || 'number',
          colorScheme: kpiBuilder.currentKPI.chart?.colorScheme || ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
        },
        data_source_config: {
          table: kpiBuilder.currentKPI.dataSource?.table || '',
          timeRange: 'created_at',
          isRealTime: kpiBuilder.currentKPI.isRealTime || false,
          refreshInterval: kpiBuilder.currentKPI.refreshInterval
        },
        is_public: false,
        is_featured: false,
        status: 'published' as const
      };

      try {
        const savedTemplate = await createTemplateMutation.mutateAsync(templateData);
        logger.debug('Saved template', { templateId: savedTemplate?.id }, 'KPIBuilder');
        onSaveTemplate?.(savedTemplate);
        onClose();
      } catch (error) {
        logger.error('Failed to save template', error, 'KPIBuilder');
      }
    } else {
      // Save as regular KPI
      kpiBuilder.saveKPI();
      onClose();
    }
  };


  const handleTest = async () => {
    try {
      await kpiBuilder.testKPI();
    } catch (error) {
      logger.error('KPI test failed', error, 'KPIBuilder');
    }
  };

  const getFieldDisplayName = (field: KPIField) => {
    return `${field.table}.${field.column}${field.aggregation ? ` (${field.aggregation})` : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Custom KPI Builder</h2>
            <p className="text-sm text-gray-500">Create and configure custom KPIs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'basic', name: 'Basic Info', icon: null },
            { id: 'formula', name: 'Formula', icon: null },
            { id: 'threshold', name: 'Thresholds', icon: null },
            { id: 'chart', name: 'Visualization', icon: null },
            { id: 'preview', name: 'Preview', icon: Eye },
            { id: 'templates', name: 'Templates', icon: Star },
            { id: 'help', name: 'Help & Tutorial', icon: Help }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'templates' && (
                  <KpiTemplateLibrary
                    onTemplateSelect={(template) => {
                      // Load template data into the KPI builder with template ID tracking
                      kpiBuilder.loadTemplate({
                        name: template.name,
                        description: template.description || '',
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
                          timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                        }
                      }, template.id); // Pass template ID for tracking
                      
                      // Switch to basic tab to show the loaded data
                      setActiveTab('basic');
                    }}
                    onUseTemplate={(template) => {
                      // Use template to create a template card instead of loading into builder
                      if (onUseTemplate) {
                        onUseTemplate(template);
                        onClose();
                      } else {
                        // Fallback to loading into builder if no callback provided
                        kpiBuilder.updateKPI({
                          name: template.name,
                          description: template.description || '',
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
                            timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                          }
                        });
                        
                        // Switch to basic tab to show the loaded data
                        setActiveTab('basic');
                      }
                    }}
                    showCreateButton={false}
                    className="w-full"
                  />
            )}
            
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KPI Name *
                  </label>
                  <input
                    type="text"
                    value={kpiBuilder.currentKPI.name || ''}
                    onChange={(e) => kpiBuilder.updateKPI({ name: e.target.value })}
                    placeholder="Enter KPI name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={kpiBuilder.currentKPI.description || ''}
                    onChange={(e) => kpiBuilder.updateKPI({ description: e.target.value })}
                    placeholder="Describe what this KPI measures..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => kpiBuilder.updateKPI({ category: category.id as any })}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors",
                          kpiBuilder.currentKPI.category === category.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2", category.color)}>
                          {category.name}
                        </div>
                        <p className="text-sm text-gray-600">{category.name} metrics and indicators</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Source *
                  </label>
                  <select
                    value={kpiBuilder.currentKPI.dataSource?.table || ''}
                    onChange={(e) => kpiBuilder.updateKPI({ 
                      dataSource: { ...kpiBuilder.currentKPI.dataSource!, table: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select data source...</option>
                    {kpiBuilder.dataSources.map(source => (
                      <option key={source.id} value={source.id}>
                        {source.name} - {source.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={kpiBuilder.currentKPI.isRealTime || false}
                      onChange={(e) => kpiBuilder.updateKPI({ isRealTime: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Real-time updates</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'formula' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formula Expression *
                  </label>
                  
                  {/* Operation Buttons */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Operations</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => kpiBuilder.addToFormula('SUM(')}
                        className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        SUM()
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula('COUNT(')}
                        className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        COUNT()
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula('AVG(')}
                        className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        AVG()
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula('MAX(')}
                        className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        MAX()
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula('MIN(')}
                        className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        MIN()
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula(' + ')}
                        className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula(' - ')}
                        className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula(' * ')}
                        className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        ×
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula(' / ')}
                        className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        ÷
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula(' * 100')}
                        className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                      >
                        × 100
                      </button>
                      <button
                        onClick={() => kpiBuilder.addToFormula('( )')}
                        className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        ( )
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={kpiBuilder.currentKPI.formula?.expression || ''}
                      onChange={(e) => kpiBuilder.updateFormula({ expression: e.target.value })}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fieldId = e.dataTransfer.getData('fieldId');
                        if (fieldId) {
                          kpiBuilder.insertFieldReference(fieldId);
                          kpiBuilder.addFieldToFormula(fieldId);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                      }}
                      placeholder="Enter formula (e.g., SUM(revenue_total) / COUNT(customers) * 100)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono transition-colors"
                    />
                    <div className="absolute top-2 right-2 text-xs text-gray-400">
                      Drag fields here or use buttons above
                    </div>
                  </div>
                  
                  {/* Formula validation */}
                  {kpiBuilder.currentKPI.formula?.validation && (
                    <div className="mt-2">
                      {kpiBuilder.currentKPI.formula.validation.isValid ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Formula is valid</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {kpiBuilder.currentKPI.formula.validation.errors.map((error, index) => (
                            <div key={index} className="flex items-center text-red-600">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm">{error}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formula Preview
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    {kpiBuilder.getFormulaPreview() || 'No formula defined'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Fields
                  </label>
                  <div className="space-y-2">
                    {kpiBuilder.currentKPI.formula?.fields.map(fieldId => {
                      const field = availableFields.find(f => f.id === fieldId);
                      if (!field) return null;
                      
                      return (
                        <div key={fieldId} className="flex items-center justify-between p-2 bg-purple-50 rounded-md">
                          <div>
                            <span className="font-medium">{field.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {getFieldDisplayName(field)}
                            </span>
                          </div>
                          <button
                            onClick={() => kpiBuilder.removeFieldFromFormula(fieldId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    {(!kpiBuilder.currentKPI.formula?.fields || kpiBuilder.currentKPI.formula.fields.length === 0) && (
                      <p className="text-gray-500 text-sm">No fields selected</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'threshold' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={kpiBuilder.currentKPI.threshold?.unit || ''}
                    onChange={(e) => kpiBuilder.updateKPI({ 
                      threshold: { ...kpiBuilder.currentKPI.threshold!, unit: e.target.value }
                    })}
                    placeholder="e.g., %, $, count, hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                        Good
                      </span>
                      Threshold
                    </label>
                    <input
                      type="number"
                      value={kpiBuilder.currentKPI.threshold?.green || 0}
                      onChange={(e) => kpiBuilder.updateKPI({ 
                        threshold: { ...kpiBuilder.currentKPI.threshold!, green: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                        Warning
                      </span>
                      Threshold
                    </label>
                    <input
                      type="number"
                      value={kpiBuilder.currentKPI.threshold?.yellow || 0}
                      onChange={(e) => kpiBuilder.updateKPI({ 
                        threshold: { ...kpiBuilder.currentKPI.threshold!, yellow: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        Critical
                      </span>
                      Threshold
                    </label>
                    <input
                      type="number"
                      value={kpiBuilder.currentKPI.threshold?.red || 0}
                      onChange={(e) => kpiBuilder.updateKPI({ 
                        threshold: { ...kpiBuilder.currentKPI.threshold!, red: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Threshold Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Good: Values above this threshold indicate positive performance</li>
                    <li>• Warning: Values between warning and critical need attention</li>
                    <li>• Critical: Values below this threshold require immediate action</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTypes.map(chartType => (
                      <button
                        key={chartType.id}
                        onClick={() => kpiBuilder.updateKPI({ 
                          chart: { ...kpiBuilder.currentKPI.chart!, type: chartType.id as any }
                        })}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-colors text-left",
                          kpiBuilder.currentKPI.chart?.type === chartType.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <chartType.icon className="w-6 h-6 mb-2 text-gray-600" />
                        <div className="font-medium">{chartType.name}</div>
                        <div className="text-sm text-gray-500">{chartType.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={kpiBuilder.currentKPI.chart?.showTrend || false}
                      onChange={(e) => kpiBuilder.updateKPI({ 
                        chart: { ...kpiBuilder.currentKPI.chart!, showTrend: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show trend indicator</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">KPI Configuration</h4>
                    <div className="space-y-3 text-sm">
                      <div><strong>Name:</strong> {kpiBuilder.currentKPI.name || 'Unnamed KPI'}</div>
                      <div><strong>Category:</strong> {kpiBuilder.currentKPI.category}</div>
                      <div><strong>Data Source:</strong> {kpiBuilder.currentKPI.dataSource?.table}</div>
                      <div><strong>Chart Type:</strong> {kpiBuilder.currentKPI.chart?.type}</div>
                      <div><strong>Real-time:</strong> {kpiBuilder.currentKPI.isRealTime ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Formula</h4>
                    <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                      {kpiBuilder.getFormulaPreview() || 'No formula defined'}
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {testResult && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Test Results</h4>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center text-green-800 mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Test Successful</span>
                      </div>
                      <div className="text-sm text-green-700">
                        <div>Result: {testResult.value}</div>
                        <div>Status: {testResult.status}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Help className="w-5 h-5 mr-2" />
                    KPI Builder Tutorial & Help Center
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Welcome to the Custom KPI Builder! This comprehensive guide will walk you through creating powerful, data-driven KPIs for your dashboard.
                  </p>
          </div>

                {/* Quick Start Guide */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                    Quick Start Guide
                  </h4>
                  <div className="space-y-3 text-sm text-green-800">
                    <p><strong>Step 1:</strong> Fill in Basic Info (KPI name, description, category)</p>
                    <p><strong>Step 2:</strong> Create your formula using available fields</p>
                    <p><strong>Step 3:</strong> Set performance thresholds (good/warning/critical)</p>
                    <p><strong>Step 4:</strong> Choose visualization type</p>
                    <p><strong>Step 5:</strong> Test and save your KPI</p>
                  </div>
                </div>

                {/* Basic Info Tutorial */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Hash className="w-5 h-5 mr-2 text-purple-600" />
                    Basic Info Tab
                  </h4>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p><strong>KPI Name:</strong> Choose a clear, descriptive name (e.g., "Monthly Revenue Growth")</p>
                    </div>
                    <div>
                      <p><strong>Description:</strong> Explain what this KPI measures and why it's important</p>
                    </div>
                    <div>
                      <p><strong>Category:</strong> Organize your KPIs into logical groups:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><span className="text-green-600 font-medium">Financial:</span> Revenue, costs, profit margins</li>
                        <li><span className="text-blue-600 font-medium">Operational:</span> Job completion rates, efficiency metrics</li>
                        <li><span className="text-purple-600 font-medium">Customer:</span> Satisfaction, retention, acquisition</li>
                        <li><span className="text-orange-600 font-medium">Compliance:</span> Safety records, regulatory metrics</li>
                      </ul>
                    </div>
                    <div>
                      <p><strong>Data Source:</strong> Select which database table contains your data</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><strong>Jobs:</strong> Service completion data</li>
                        <li><strong>Invoices:</strong> Financial transaction data</li>
                        <li><strong>Customers:</strong> Client information</li>
                        <li><strong>Reviews:</strong> Customer feedback data</li>
                      </ul>
                    </div>
                    <div>
                      <p><strong>Real-time Updates:</strong> Enable for KPIs that need live data (revenue, active jobs)</p>
                    </div>
                  </div>
                </div>

                {/* Formula Tutorial */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Formula Tab - Building Your KPI Logic
                  </h4>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <p><strong>💡 Pro Tip:</strong> Drag fields from the sidebar or click them to add to your formula</p>
                    </div>
                    
                    <div>
                      <p><strong>Formula Expression:</strong> Write mathematical expressions using available fields</p>
                      <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs">
                        <p>Examples:</p>
                        <p>• <span className="text-blue-600">SUM(revenue_total)</span> - Total revenue</p>
                        <p>• <span className="text-blue-600">COUNT(jobs_completed) / COUNT(jobs_total) * 100</span> - Completion percentage</p>
                        <p>• <span className="text-blue-600">AVG(avg_rating)</span> - Average customer rating</p>
                      </div>
                    </div>

                    <div>
                      <p><strong>Supported Operations:</strong></p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><strong>SUM():</strong> Add up all values</li>
                        <li><strong>COUNT():</strong> Count number of records</li>
                        <li><strong>AVG():</strong> Calculate average</li>
                        <li><strong>MIN() / MAX():</strong> Find minimum/maximum values</li>
                        <li><strong>+ - * /:</strong> Basic arithmetic operations</li>
                      </ul>
                    </div>

                    <div>
                      <p><strong>Field Types:</strong></p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><strong>Number:</strong> Numeric data for calculations</li>
                        <li><strong>Count:</strong> Number of records (jobs, customers)</li>
                        <li><strong>Sum:</strong> Total amounts (revenue, costs)</li>
                        <li><strong>Average:</strong> Mean values (ratings, scores)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Thresholds Tutorial */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-purple-600" />
                    Thresholds Tab - Setting Performance Levels
                  </h4>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p><strong>Why Set Thresholds?</strong> Thresholds help you quickly identify when performance is good, needs attention, or requires immediate action.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h5 className="font-medium text-green-800 mb-2">✅ Good Threshold</h5>
                        <p className="text-green-700 text-xs">Values above this indicate excellent performance</p>
                        <p className="text-green-600 font-mono text-xs mt-1">Example: &gt; 90%</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                        <h5 className="font-medium text-yellow-800 mb-2">⚠️ Warning Threshold</h5>
                        <p className="text-yellow-700 text-xs">Values between good and critical need attention</p>
                        <p className="text-yellow-600 font-mono text-xs mt-1">Example: 70-90%</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-4">
                        <h5 className="font-medium text-red-800 mb-2">🚨 Critical Threshold</h5>
                        <p className="text-red-700 text-xs">Values below this require immediate action</p>
                        <p className="text-red-600 font-mono text-xs mt-1">Example: &lt; 70%</p>
                      </div>
                    </div>

                    <div>
                      <p><strong>Threshold Examples:</strong></p>
                      <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs">
                        <p><strong>Revenue Growth:</strong></p>
                        <p>Good: &gt; 15% | Warning: 5-15% | Critical: &lt; 5%</p>
                        <p className="mt-2"><strong>Job Completion Rate:</strong></p>
                        <p>Good: &gt; 95% | Warning: 85-95% | Critical: &lt; 85%</p>
                        <p className="mt-2"><strong>Customer Satisfaction:</strong></p>
                        <p>Good: &gt; 4.5 | Warning: 3.5-4.5 | Critical: &lt; 3.5</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Tutorial */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    Visualization Tab - Choosing the Right Chart
                  </h4>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded p-4">
                        <div className="flex items-center mb-2">
                          <Hash className="w-4 h-4 mr-2 text-gray-600" />
                          <h5 className="font-medium">Number Display</h5>
                        </div>
                        <p className="text-xs text-gray-600">Best for: Single values, totals, percentages</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: Total Revenue, Count of Jobs</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <div className="flex items-center mb-2">
                          <Gauge className="w-4 h-4 mr-2 text-gray-600" />
                          <h5 className="font-medium">Gauge</h5>
                        </div>
                        <p className="text-xs text-gray-600">Best for: Performance against targets</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: Completion Rate, Efficiency Score</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
                          <h5 className="font-medium">Line Chart</h5>
                        </div>
                        <p className="text-xs text-gray-600">Best for: Trends over time</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: Revenue Growth, Customer Count</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="w-4 h-4 mr-2 text-gray-600" />
                          <h5 className="font-medium">Bar Chart</h5>
                        </div>
                        <p className="text-xs text-gray-600">Best for: Comparing categories</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: Revenue by Service Type</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <div className="flex items-center mb-2">
                          <PieChart className="w-4 h-4 mr-2 text-gray-600" />
                          <h5 className="font-medium">Pie Chart</h5>
                        </div>
                        <p className="text-xs text-gray-600">Best for: Showing proportions</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: Market Share, Service Distribution</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testing & Best Practices */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-purple-600" />
                    Testing & Best Practices
                  </h4>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <h5 className="font-medium text-blue-900 mb-2">🧪 Always Test Your KPI</h5>
                      <p className="text-blue-800">Use the "Test KPI" button to verify your formula works correctly before saving. Check that the result makes sense for your business.</p>
                    </div>
                    
                    <div>
                      <p><strong>Best Practices:</strong></p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Start simple - build basic KPIs before complex ones</li>
                        <li>Use clear, descriptive names that anyone can understand</li>
                        <li>Set realistic thresholds based on historical data</li>
                        <li>Group related KPIs in the same category</li>
                        <li>Test formulas with sample data to ensure accuracy</li>
                        <li>Enable real-time updates only when necessary (performance impact)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p><strong>Common Formula Patterns:</strong></p>
                      <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs">
                        <p><strong>Growth Rate:</strong> (current - previous) / previous * 100</p>
                        <p><strong>Completion Rate:</strong> completed_jobs / total_jobs * 100</p>
                        <p><strong>Average Score:</strong> AVG(customer_rating)</p>
                        <p><strong>Revenue per Customer:</strong> SUM(revenue) / COUNT(customers)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Troubleshooting
                  </h4>
                  <div className="space-y-3 text-sm text-red-800">
                    <div>
                      <p><strong>Formula not working?</strong></p>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>Check that all field names are spelled correctly</li>
                        <li>Ensure you're using supported functions (SUM, COUNT, AVG)</li>
                        <li>Verify your data source has the fields you're referencing</li>
                        <li>Use the Test button to see specific error messages</li>
                      </ul>
                    </div>
                    <div>
                      <p><strong>KPI showing unexpected values?</strong></p>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>Check if your thresholds are set correctly</li>
                        <li>Verify the data source contains the expected data</li>
                        <li>Test with a simple formula first, then add complexity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Available Templates or Help (hidden on templates tab) */}
          {activeTab !== 'templates' && (
            <div className="w-80 border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0">
            {activeTab === 'help' ? (
              <>
                <h3 className="font-medium text-gray-900 mb-4">Quick Reference</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
                    <ul className="space-y-1 text-blue-800">
                      <li>• Start with simple formulas</li>
                      <li>• Test before saving</li>
                      <li>• Use descriptive names</li>
                      <li>• Set realistic thresholds</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <h4 className="font-medium text-green-900 mb-2">🎯 Common KPIs</h4>
                    <ul className="space-y-1 text-green-800">
                      <li>• Revenue Growth</li>
                      <li>• Job Completion Rate</li>
                      <li>• Customer Satisfaction</li>
                      <li>• Response Time</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded p-3">
                    <h4 className="font-medium text-purple-900 mb-2">🔧 Formula Help</h4>
                    <div className="text-purple-800 font-mono text-xs">
                      <p><strong>SUM(field)</strong> - Add values</p>
                      <p><strong>COUNT(field)</strong> - Count records</p>
                      <p><strong>AVG(field)</strong> - Average value</p>
                      <p><strong>+ - * /</strong> - Math operations</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-medium text-gray-900 mb-4">Available Templates</h3>
                
                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={templateSearchTerm}
                      onChange={(e) => setTemplateSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>
            
                <div className="space-y-3">
              {templatesLoading ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <div className="animate-spin w-6 h-6 mx-auto mb-2 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <p>Loading templates...</p>
                </div>
              ) : (
                <>
                  {/* User Templates */}
                  {userTemplates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Your Templates</h4>
                      <div className="space-y-2">
                        {userTemplates.map((template) => (
                          <div
                            key={template.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('templateId', template.id);
                              e.dataTransfer.setData('templateType', 'user');
                              e.currentTarget.classList.add('opacity-50', 'scale-95');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('opacity-50', 'scale-95');
                            }}
                            onClick={() => {
                              kpiBuilder.updateKPI({
                                name: template.name,
                                description: template.description || '',
                                category: template.category === 'user' ? 'operational' : template.category,
                                formula: {
                                  id: `formula-${Date.now()}`,
                                  name: `${template.name} Formula`,
                                  expression: template.formula_expression || '',
                                  fields: template.formula_fields?.map((field: any) => field.id) || [],
                                  validation: { isValid: true, errors: [] }
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
                                  timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                }
                              });
                            }}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                              <div className="flex gap-1 mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Custom
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {template.chart_config?.type || 'number'}
                                </span>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-purple-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* System Templates */}
                  {systemTemplates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">System Templates</h4>
                      <div className="space-y-2">
                        {systemTemplates.map((template) => (
                          <div
                            key={template.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('templateId', template.id);
                              e.dataTransfer.setData('templateType', 'system');
                              e.currentTarget.classList.add('opacity-50', 'scale-95');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('opacity-50', 'scale-95');
                            }}
                            onClick={() => {
                              kpiBuilder.updateKPI({
                                name: template.name,
                                description: template.description || '',
                                category: template.category === 'user' ? 'operational' : template.category,
                                formula: {
                                  id: `formula-${Date.now()}`,
                                  name: `${template.name} Formula`,
                                  expression: template.formula_expression || '',
                                  fields: template.formula_fields?.map((field: any) => field.id) || [],
                                  validation: { isValid: true, errors: [] }
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
                                  timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                }
                              });
                            }}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                              <div className="flex gap-1 mt-1">
                                <span className={cn(
                                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                  template.category === 'financial' ? 'bg-green-100 text-green-800' :
                                  template.category === 'operational' ? 'bg-blue-100 text-blue-800' :
                                  template.category === 'customer' ? 'bg-purple-100 text-purple-800' :
                                  template.category === 'compliance' ? 'bg-orange-100 text-orange-800' :
                                  'bg-gray-100 text-gray-800'
                                )}>
                                  {template.category}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {template.chart_config?.type || 'number'}
                                </span>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-purple-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No templates found */}
                  {filteredTemplates.length === 0 && !templatesLoading && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p>{templateSearchTerm ? 'No templates found' : 'No templates available'}</p>
                      {templateSearchTerm && (
                        <button
                          onClick={() => setTemplateSearchTerm('')}
                          className="text-purple-600 hover:text-purple-800 text-xs mt-1"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
              
              {/* Legacy mock data - remove this section */}
              <div className="mb-4" style={{ display: 'none' }}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">System Templates</h4>
                <div className="space-y-2">
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('templateId', 'revenue-growth');
                      e.dataTransfer.setData('templateType', 'system');
                      e.currentTarget.classList.add('opacity-50', 'scale-95');
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-50', 'scale-95');
                    }}
                    onClick={() => {
                      // Load revenue growth template
                      kpiBuilder.updateKPI({
                        name: 'Revenue Growth',
                        description: 'Monthly revenue growth percentage',
                        category: 'financial',
                        formula: {
                          id: `formula-${Date.now()}`,
                          name: 'Revenue Growth Formula',
                          expression: 'SUM(revenue_current) / SUM(revenue_previous) * 100',
                          fields: [],
                          validation: { isValid: true, errors: [] }
                        },
                        threshold: { green: 15, yellow: 5, red: 0, unit: '%' },
                        chart: { type: 'line' as const, colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                        dataSource: { table: 'revenue', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                      });
                    }}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Revenue Growth</div>
                      <div className="text-xs text-gray-500">Monthly revenue growth percentage</div>
                    </div>
                    <Plus className="w-4 h-4 text-purple-600" />
                  </div>

                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('templateId', 'customer-satisfaction');
                      e.dataTransfer.setData('templateType', 'system');
                      e.currentTarget.classList.add('opacity-50', 'scale-95');
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-50', 'scale-95');
                    }}
                    onClick={() => {
                      // Load customer satisfaction template
                      kpiBuilder.updateKPI({
                        name: 'Customer Satisfaction',
                        description: 'Average customer rating',
                        category: 'customer',
                        formula: {
                          id: `formula-${Date.now()}`,
                          name: 'Customer Satisfaction Formula',
                          expression: 'AVG(customer_rating)',
                          fields: [],
                          validation: { isValid: true, errors: [] }
                        },
                        threshold: { green: 4.5, yellow: 3.5, red: 3.0, unit: 'stars' },
                        chart: { type: 'gauge' as const, colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                        dataSource: { table: 'reviews', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                      });
                    }}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Customer Satisfaction</div>
                      <div className="text-xs text-gray-500">Average customer rating</div>
              </div>
                    <Plus className="w-4 h-4 text-purple-600" />
                  </div>

                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('templateId', 'job-completion');
                      e.dataTransfer.setData('templateType', 'system');
                      e.currentTarget.classList.add('opacity-50', 'scale-95');
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-50', 'scale-95');
                    }}
                    onClick={() => {
                      // Load job completion template
                      kpiBuilder.updateKPI({
                        name: 'Job Completion Rate',
                        description: 'Percentage of completed jobs',
                        category: 'operational',
                        formula: {
                          id: `formula-${Date.now()}`,
                          name: 'Job Completion Formula',
                          expression: 'COUNT(completed_jobs) / COUNT(total_jobs) * 100',
                          fields: [],
                          validation: { isValid: true, errors: [] }
                        },
                        threshold: { green: 95, yellow: 85, red: 75, unit: '%' },
                        chart: { type: 'number' as const, colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                        dataSource: { table: 'jobs', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                      });
                    }}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Job Completion Rate</div>
                      <div className="text-xs text-gray-500">Percentage of completed jobs</div>
                    </div>
                    <Plus className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* User Templates */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Templates</h4>
                <div className="space-y-2">
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p>No custom templates yet</p>
                    <p className="text-xs">Create templates from your KPIs</p>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={kpiBuilder.resetBuilder}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handleTest}
              disabled={!kpiBuilder.currentKPI.formula?.expression || isTesting}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                kpiBuilder.currentKPI.formula?.expression && !isTesting
                  ? "text-blue-600 hover:bg-blue-100"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              <Play className="w-4 h-4" />
              <span>{isTesting ? 'Testing...' : 'Test KPI'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!kpiBuilder.isKPIValid || createTemplateMutation.isPending}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                kpiBuilder.isKPIValid && !createTemplateMutation.isPending
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              <Save className="w-4 h-4" />
              <span>
                {createTemplateMutation.isPending 
                  ? "Saving..." 
                  : isEditingTemplate 
                    ? "Save Template" 
                    : "Save KPI"
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIBuilder;
