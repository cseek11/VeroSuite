import React, { useState, useEffect } from 'react';
import { useCreateKpiTemplate, useUpdateKpiTemplate, useKpiTemplate } from '@/hooks/useKpiTemplates';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/EnhancedUI';
import { Badge } from '@/components/ui/CRMComponents';
import { Chip } from '@/components/ui/EnhancedUI';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  GripVertical,
  BarChart3,
  PieChart,
  TrendingUp,
  Gauge,
  DollarSign,
  Users,
  Settings,
  Shield,
  Eye,
  Code,
  Palette
} from 'lucide-react';
import type { KpiTemplate, CreateKpiTemplateDto, KpiTemplateField } from '@/types/kpi-templates';

interface KpiTemplateEditorProps {
  templateId?: string; // If provided, edit existing template
  isOpen: boolean;
  onClose: () => void;
  onSave?: (template: KpiTemplate) => void;
}

export default function KpiTemplateEditor({ 
  templateId, 
  isOpen, 
  onClose, 
  onSave 
}: KpiTemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'formula' | 'fields' | 'threshold' | 'chart' | 'preview'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateKpiTemplateDto>({
    name: '',
    description: '',
    category: 'financial',
    template_type: 'user',
    formula_expression: '',
    formula_fields: [],
    threshold_config: {
      green: 80,
      yellow: 60,
      red: 40,
      unit: '%'
    },
    chart_config: {
      type: 'gauge',
      colorScheme: ['#ef4444', '#f59e0b', '#10b981']
    },
    data_source_config: {
      table: '',
      timeRange: 'monthly'
    },
    tags: [],
    is_public: false,
    is_featured: false,
    status: 'draft'
  });

  const [newTag, setNewTag] = useState('');
  const [newField, setNewField] = useState<Partial<KpiTemplateField>>({
    field_name: '',
    field_type: 'number',
    table_name: '',
    column_name: '',
    aggregation_type: 'count',
    display_name: '',
    description: '',
    is_required: false,
    sort_order: 0
  });

  // API hooks
  const { data: existingTemplate, isLoading } = useKpiTemplate(templateId || '');
  const createMutation = useCreateKpiTemplate();
  const updateMutation = useUpdateKpiTemplate();

  // Load existing template data
  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        description: existingTemplate.description || '',
        category: existingTemplate.category,
        template_type: existingTemplate.template_type,
        formula_expression: existingTemplate.formula_expression,
        formula_fields: existingTemplate.formula_fields || [],
        threshold_config: existingTemplate.threshold_config,
        chart_config: existingTemplate.chart_config,
        data_source_config: existingTemplate.data_source_config,
        tags: existingTemplate.tags || [],
        is_public: existingTemplate.is_public,
        is_featured: existingTemplate.is_featured,
        status: existingTemplate.status
      });
    }
  }, [existingTemplate]);

  const categories = [
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'bg-green-100 text-green-800' },
    { id: 'operational', name: 'Operational', icon: Settings, color: 'bg-blue-100 text-blue-800' },
    { id: 'customer', name: 'Customer', icon: Users, color: 'bg-purple-100 text-purple-800' },
    { id: 'compliance', name: 'Compliance', icon: Shield, color: 'bg-orange-100 text-orange-800' },
    { id: 'user', name: 'User Defined', icon: BarChart3, color: 'bg-gray-100 text-gray-800' }
  ];

  const chartTypes = [
    { id: 'gauge', name: 'Gauge', icon: Gauge, description: 'Circular progress indicator' },
    { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Trend over time' },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Comparative values' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Proportional breakdown' }
  ];

  const aggregationTypes = ['count', 'sum', 'avg', 'min', 'max'];
  const fieldTypes = ['number', 'text', 'date', 'boolean'];

  const handleSubmit = async () => {
    if (!formData.name || !formData.formula_expression) {
      alert('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (templateId) {
        result = await updateMutation.mutateAsync({
          id: templateId,
          data: formData
        });
      } else {
        result = await createMutation.mutateAsync(formData);
      }
      
      onSave?.(result);
      onClose();
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addField = () => {
    if (newField.field_name && newField.table_name && newField.column_name) {
      setFormData(prev => ({
        ...prev,
        formula_fields: [...prev.formula_fields, {
          ...newField,
          sort_order: prev.formula_fields.length
        } as KpiTemplateField]
      }));
      setNewField({
        field_name: '',
        field_type: 'number',
        table_name: '',
        column_name: '',
        aggregation_type: 'count',
        display_name: '',
        description: '',
        is_required: false,
        sort_order: 0
      });
    }
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      formula_fields: prev.formula_fields.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {templateId ? 'Edit KPI Template' : 'Create KPI Template'}
            </h2>
            <p className="text-sm text-gray-500">
              {templateId ? 'Modify template settings and configuration' : 'Create a new KPI template for reuse'}
            </p>
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
            { id: 'basic', name: 'Basic Info', icon: Eye },
            { id: 'formula', name: 'Formula', icon: Code },
            { id: 'fields', name: 'Fields', icon: GripVertical },
            { id: 'threshold', name: 'Thresholds', icon: Gauge },
            { id: 'chart', name: 'Chart', icon: Palette },
            { id: 'preview', name: 'Preview', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template measures..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id as any }))}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.category === category.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${category.color}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {category.name}
                        </div>
                        <p className="text-sm text-gray-600">{category.name} metrics and indicators</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Type
                </label>
                <select
                  value={formData.template_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="user">User Template</option>
                  <option value="shared">Shared Template</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Chip key={tag} className="bg-purple-100 text-purple-800">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Chip>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Make this template public</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Feature this template</span>
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
                <textarea
                  value={formData.formula_expression}
                  onChange={(e) => setFormData(prev => ({ ...prev, formula_expression: e.target.value }))}
                  placeholder="Enter the formula expression (e.g., COUNT(jobs), AVG(revenue), etc.)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use field names from the Fields tab in your formula (e.g., {`{field_name}`})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Source Configuration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primary Table</label>
                    <Input
                      value={formData.data_source_config.table}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        data_source_config: { ...prev.data_source_config, table: e.target.value }
                      }))}
                      placeholder="e.g., jobs, invoices"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time Range</label>
                    <select
                      value={formData.data_source_config.timeRange}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        data_source_config: { ...prev.data_source_config, timeRange: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Fields</h3>
                
                {/* Add New Field */}
                <Card title="Add New Field" className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Field Name"
                        value={newField.field_name}
                        onChange={(e) => setNewField(prev => ({ ...prev, field_name: e.target.value }))}
                      />
                      <Input
                        placeholder="Display Name"
                        value={newField.display_name}
                        onChange={(e) => setNewField(prev => ({ ...prev, display_name: e.target.value }))}
                      />
                      <Input
                        placeholder="Table Name"
                        value={newField.table_name}
                        onChange={(e) => setNewField(prev => ({ ...prev, table_name: e.target.value }))}
                      />
                      <Input
                        placeholder="Column Name"
                        value={newField.column_name}
                        onChange={(e) => setNewField(prev => ({ ...prev, column_name: e.target.value }))}
                      />
                      <select
                        value={newField.field_type}
                        onChange={(e) => setNewField(prev => ({ ...prev, field_type: e.target.value as any }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {fieldTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <select
                        value={newField.aggregation_type || ''}
                        onChange={(e) => setNewField(prev => ({ ...prev, aggregation_type: e.target.value as any }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">No aggregation</option>
                        {aggregationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={addField} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                </Card>

                {/* Existing Fields */}
                <div className="space-y-3">
                  {formData.formula_fields.map((field, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{field.field_name}</Badge>
                              <Badge variant="outline">{field.field_type}</Badge>
                              {field.aggregation_type && (
                                <Badge variant="secondary">{field.aggregation_type}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {field.table_name}.{field.column_name}
                            </p>
                            {field.description && (
                              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'threshold' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Threshold Configuration</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Green Threshold (Good)
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold_config.green}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        threshold_config: { ...prev.threshold_config, green: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yellow Threshold (Warning)
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold_config.yellow}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        threshold_config: { ...prev.threshold_config, yellow: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Red Threshold (Critical)
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold_config.red}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        threshold_config: { ...prev.threshold_config, red: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <Input
                      value={formData.threshold_config.unit || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        threshold_config: { ...prev.threshold_config, unit: e.target.value }
                      }))}
                      placeholder="e.g., %, $, count"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chart Configuration</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {chartTypes.map(chart => {
                    const Icon = chart.icon;
                    return (
                      <button
                        key={chart.id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          chart_config: { ...prev.chart_config, type: chart.id }
                        }))}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.chart_config.type === chart.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <h4 className="font-medium text-gray-900">{chart.name}</h4>
                        <p className="text-sm text-gray-600">{chart.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <div className="flex gap-2">
                  {formData.chart_config.colorScheme.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Template Preview</h3>
                <Card title={
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>{formData.name || 'Untitled Template'}</span>
                  </div>
                }>
                    <p className="text-gray-600 mb-4">{formData.description || 'No description provided'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Chip className={`${categories.find(c => c.id === formData.category)?.color}`}>
                        {categories.find(c => c.id === formData.category)?.name}
                      </Chip>
                      <Chip className="bg-blue-100 text-blue-800">
                        {formData.template_type}
                      </Chip>
                      {formData.tags.map(tag => (
                        <Chip key={tag} className="bg-gray-100 text-gray-600">
                          {tag}
                        </Chip>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Formula:</h4>
                        <code className="block bg-gray-100 p-2 rounded text-sm font-mono">
                          {formData.formula_expression || 'No formula defined'}
                        </code>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">Thresholds:</h4>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600">
                            Green: {formData.threshold_config.green}{formData.threshold_config.unit}
                          </span>
                          <span className="text-yellow-600">
                            Yellow: {formData.threshold_config.yellow}{formData.threshold_config.unit}
                          </span>
                          <span className="text-red-600">
                            Red: {formData.threshold_config.red}{formData.threshold_config.unit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">Chart Type:</h4>
                        <p className="text-sm text-gray-600">
                          {chartTypes.find(c => c.id === formData.chart_config.type)?.name}
                        </p>
                      </div>
                    </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Status:</span>
            <Chip className="bg-gray-100 text-gray-800">
              {formData.status}
            </Chip>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.formula_expression}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : templateId ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
