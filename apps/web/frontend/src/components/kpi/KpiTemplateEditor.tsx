import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateKpiTemplate, useUpdateKpiTemplate, useKpiTemplate } from '@/hooks/useKpiTemplates';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
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
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

// KPI Template Form Schema
const kpiTemplateFieldSchema = z.object({
  field_name: z.string().min(1, 'Field name is required'),
  field_type: z.enum(['number', 'text', 'date', 'boolean']),
  table_name: z.string().min(1, 'Table name is required'),
  column_name: z.string().min(1, 'Column name is required'),
  aggregation_type: z.enum(['sum', 'count', 'avg', 'min', 'max']).optional(),
  display_name: z.string().optional(),
  description: z.string().optional(),
  is_required: z.boolean().optional(),
  sort_order: z.number().optional(),
});

const kpiTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  category: z.enum(['financial', 'operational', 'customer', 'compliance', 'user']).default('financial'),
  template_type: z.enum(['system', 'user', 'shared']).default('user'),
  formula_expression: z.string().min(1, 'Formula expression is required'),
  formula_fields: z.array(kpiTemplateFieldSchema).default([]),
  threshold_config: z.object({
    green: z.number().min(0),
    yellow: z.number().min(0),
    red: z.number().min(0),
    unit: z.string().optional(),
  }).default({
    green: 80,
    yellow: 60,
    red: 40,
    unit: '%'
  }),
  chart_config: z.object({
    type: z.string().default('gauge'),
    colorScheme: z.array(z.string()).default(['#ef4444', '#f59e0b', '#10b981']),
  }).default({
    type: 'gauge',
    colorScheme: ['#ef4444', '#f59e0b', '#10b981']
  }),
  data_source_config: z.object({
    table: z.string().default(''),
    timeRange: z.string().default('monthly'),
  }).default({
    table: '',
    timeRange: 'monthly'
  }),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

type KpiTemplateFormData = z.infer<typeof kpiTemplateSchema>;

interface KpiTemplateEditorProps {
  templateId?: string | null; // If provided, edit existing template
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
  const { data: existingTemplate, isLoading: _isLoading } = useKpiTemplate(templateId || '');
  const createMutation = useCreateKpiTemplate();
  const updateMutation = useUpdateKpiTemplate();

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<KpiTemplateFormData>({
    resolver: zodResolver(kpiTemplateSchema),
    defaultValues: {
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
    },
  });

  const formData = watch();

  // Load existing template data
  useEffect(() => {
    if (existingTemplate) {
      reset({
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
  }, [existingTemplate, reset]);

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

  const onSubmit = async (data: KpiTemplateFormData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (templateId) {
        result = await updateMutation.mutateAsync({
          id: templateId,
          data: data as CreateKpiTemplateDto
        });
      } else {
        result = await createMutation.mutateAsync(data as CreateKpiTemplateDto);
      }
      
      onSave?.(result);
      onClose();
    } catch (error) {
      logger.error('Failed to save template', error, 'KpiTemplateEditor');
      toast.error('Failed to save template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setValue('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addField = () => {
    if (newField.field_name && newField.table_name && newField.column_name) {
      setValue('formula_fields', [...formData.formula_fields, {
        ...newField,
        sort_order: formData.formula_fields.length
      } as KpiTemplateField]);
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
    setValue('formula_fields', formData.formula_fields.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
              onClick={() => setActiveTab(tab.id as 'basic' | 'formula' | 'fields' | 'threshold' | 'chart' | 'preview')}
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Template Name *"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter template name..."
                    {...(errors.name?.message ? { error: errors.name.message } : {})}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Description"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Describe what this template measures..."
                    rows={3}
                    {...(errors.description?.message ? { error: errors.description.message } : {})}
                  />
                )}
              />

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
                        type="button"
                        onClick={() => setValue('category', category.id as 'financial' | 'operational' | 'customer' | 'compliance' | 'user')}
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

              <Controller
                name="template_type"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Template Type"
                    value={field.value}
                    onChange={(value) => field.onChange(value as 'system' | 'user' | 'shared')}
                    options={[
                      { value: 'user', label: 'User Template' },
                      { value: 'shared', label: 'Shared Template' },
                      { value: 'system', label: 'System Template' },
                    ]}
                    {...(errors.template_type?.message ? { error: errors.template_type.message } : {})}
                  />
                )}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} className="bg-purple-100 text-purple-800">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
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
                <Controller
                  name="is_public"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                      />
                      <label className="text-sm text-gray-700">Make this template public</label>
                    </div>
                  )}
                />
                <Controller
                  name="is_featured"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                      />
                      <label className="text-sm text-gray-700">Feature this template</label>
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-6">
              <Controller
                name="formula_expression"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      label="Formula Expression *"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Enter the formula expression (e.g., COUNT(jobs), AVG(revenue), etc.)"
                      rows={4}
                      className="font-mono"
                      {...(errors.formula_expression?.message ? { error: errors.formula_expression.message } : {})}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use field names from the Fields tab in your formula (e.g., {`{field_name}`})
                    </p>
                  </div>
                )}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Source Configuration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="data_source_config.table"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Primary Table"
                        value={field.value}
                        onChange={(e) => {
                          setValue('data_source_config', {
                            ...formData.data_source_config,
                            table: e.target.value
                          });
                        }}
                        placeholder="e.g., jobs, invoices"
                      />
                    )}
                  />
                  <Controller
                    name="data_source_config.timeRange"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Time Range"
                        value={field.value}
                        onChange={(value) => {
                          setValue('data_source_config', {
                            ...formData.data_source_config,
                            timeRange: value
                          });
                        }}
                        options={[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'quarterly', label: 'Quarterly' },
                          { value: 'annually', label: 'Annually' },
                        ]}
                      />
                    )}
                  />
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
                      <Select
                        label="Field Type"
                        value={newField.field_type || 'number'}
                        onChange={(value) => setNewField(prev => ({ ...prev, field_type: value as 'number' | 'text' | 'date' | 'boolean' }))}
                        options={fieldTypes.map(type => ({ value: type, label: type }))}
                      />
                      <Select
                        label="Aggregation Type"
                        value={newField.aggregation_type || ''}
                        onChange={(value) =>
                          setNewField((prev) => {
                            const next = { ...prev };
                            if (value) {
                              next.aggregation_type = value as 'sum' | 'count' | 'avg' | 'min' | 'max';
                            } else {
                              delete next.aggregation_type;
                            }
                            return next;
                          })
                        }
                        options={[
                          { value: '', label: 'No aggregation' },
                          ...aggregationTypes.map(type => ({ value: type, label: type })),
                        ]}
                      />
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
                      onChange={(e) =>
                        setValue('threshold_config', {
                          ...formData.threshold_config,
                          green: Number(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yellow Threshold (Warning)
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold_config.yellow}
                      onChange={(e) =>
                        setValue('threshold_config', {
                          ...formData.threshold_config,
                          yellow: Number(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Red Threshold (Critical)
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold_config.red}
                      onChange={(e) =>
                        setValue('threshold_config', {
                          ...formData.threshold_config,
                          red: Number(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <Input
                      value={formData.threshold_config.unit || ''}
                      onChange={(e) =>
                        setValue('threshold_config', {
                          ...formData.threshold_config,
                          unit: e.target.value
                        })
                      }
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
                        onClick={() =>
                          setValue('chart_config', {
                            ...formData.chart_config,
                            type: chart.id
                          })
                        }
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
                <Card title={formData.name || 'Untitled Template'}>
                    <p className="text-gray-600 mb-4">{formData.description || 'No description provided'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${categories.find(c => c.id === formData.category)?.color}`}>
                        {categories.find(c => c.id === formData.category)?.name}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {formData.template_type}
                      </Badge>
                      {formData.tags.map(tag => (
                        <Badge key={tag} className="bg-gray-100 text-gray-600">
                          {tag}
                        </Badge>
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
            <Badge className="bg-gray-100 text-gray-800">
              {formData.status}
            </Badge>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !formData.name || !formData.formula_expression}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : templateId ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
