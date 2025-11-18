/**
 * InvoiceTemplates Component
 * 
 * Manages invoice templates for quick invoice creation.
 * Allows users to create, edit, delete, and apply invoice templates.
 * 
 * Features:
 * - Template CRUD operations
 * - Template preview
 * - Apply template to new invoice
 * - Template categories/tags
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Heading, Text } from '@/components/ui';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  Save,
  X,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { billing } from '@/lib/enhanced-api';
import InvoiceForm from './InvoiceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface InvoiceTemplateItem {
  service_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  items: InvoiceTemplateItem[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface InvoiceTemplatesProps {
  onApplyTemplate?: (template: InvoiceTemplate) => void;
}

export default function InvoiceTemplates({ onApplyTemplate }: InvoiceTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [templateToApply, setTemplateToApply] = useState<InvoiceTemplate | null>(null);

  const queryClient = useQueryClient();

  // Fetch templates from API
  const { data: templates = [], isLoading } = useQuery<InvoiceTemplate[]>({     
    queryKey: ['invoice-templates'],
    queryFn: async () => {
      try {
        const data = await billing.getInvoiceTemplates();
        return data.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          items: Array.isArray(template.items) ? template.items : [],
          tags: template.tags || [],
          created_at: template.created_at,
          updated_at: template.updated_at,
        }));
      } catch (error) {
        logger.error('Failed to fetch invoice templates', error, 'InvoiceTemplates');
        toast.error('Failed to load templates. Please try again.');
        return [];
      }
    },
  });

  // Extract unique tags from templates
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach(template => {
      template.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower) ||
        template.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(template =>
        template.tags?.includes(selectedTag)
      );
    }

    return filtered;
  }, [templates, searchTerm, selectedTag]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: InvoiceTemplate) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: { name: string; description?: string; items: InvoiceTemplateItem[]; tags?: string[] }) => {
      if (editingTemplate) {
        return await billing.updateInvoiceTemplate(editingTemplate.id, templateData);
      } else {
        return await billing.createInvoiceTemplate(templateData);
      }
    },
    onSuccess: () => {
      logger.debug('Template saved', {}, 'InvoiceTemplates');
      toast.success(editingTemplate ? 'Template updated successfully' : 'Template created successfully');
      queryClient.invalidateQueries({ queryKey: ['invoice-templates'] });
      setShowTemplateForm(false);
      setEditingTemplate(null);
    },
    onError: (error: unknown) => {
      logger.error('Failed to save template', error, 'InvoiceTemplates');
      toast.error('Failed to save template. Please try again.');
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await billing.deleteInvoiceTemplate(templateId);
    },
    onSuccess: () => {
      logger.debug('Template deleted', {}, 'InvoiceTemplates');
      toast.success('Template deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['invoice-templates'] });     
    },
    onError: (error: unknown) => {
      logger.error('Failed to delete template', error, 'InvoiceTemplates');   
      toast.error('Failed to delete template. Please try again.');
    },
  });

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    deleteTemplateMutation.mutate(templateId);
  };

  const handleApplyTemplate = (template: InvoiceTemplate) => {
    setTemplateToApply(template);
    setShowApplyDialog(true);
  };

  const handleConfirmApply = () => {
    if (templateToApply && onApplyTemplate) {
      onApplyTemplate(templateToApply);
      setShowApplyDialog(false);
      setTemplateToApply(null);
      toast.success(`Template "${templateToApply.name}" applied`);
    }
  };

  const calculateTotal = (items: InvoiceTemplateItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-600" />
                Invoice Templates
              </Heading>
              <Text variant="small" className="text-gray-600 mt-2">
                Create and manage invoice templates for quick invoice generation
              </Text>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateTemplate}
            >
              Create Template
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tag Filters */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Button>
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'primary' : 'outline'}
                    size="sm"
                    icon={Tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Templates List */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading templates...</span>
            </div>
          )}

          {!isLoading && filteredTemplates.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Text className="text-gray-600 font-medium">
                  {searchTerm || selectedTag ? 'No templates found' : 'No templates yet'}
                </Text>
                <Text variant="small" className="text-gray-500 mt-2">
                  {searchTerm || selectedTag
                    ? 'Try adjusting your search or filters'
                    : 'Create your first template to get started'}
                </Text>
              </div>
            </Card>
          )}

          {!isLoading && filteredTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="border-2 border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Heading level={4} className="font-semibold mb-1">
                          {template.name}
                        </Heading>
                        {template.description && (
                          <Text variant="small" className="text-gray-600">
                            {template.description}
                          </Text>
                        )}
                      </div>
                    </div>

                    {/* Template Items Preview */}
                    <div className="mb-3">
                      <Text variant="small" className="text-gray-500 mb-2">
                        {template.items.length} item{template.items.length !== 1 ? 's' : ''}
                      </Text>
                      <div className="space-y-1">
                        {template.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            {item.description} - {formatCurrency(item.unit_price)} × {item.quantity}
                          </div>
                        ))}
                        {template.items.length > 2 && (
                          <Text variant="small" className="text-gray-500">
                            +{template.items.length - 2} more item{template.items.length - 2 !== 1 ? 's' : ''}
                          </Text>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <Text variant="body" className="font-semibold">
                          Total: {formatCurrency(calculateTotal(template.items))}
                        </Text>
                      </div>
                    </div>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Copy}
                        onClick={() => handleApplyTemplate(template)}
                        className="flex-1"
                      >
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEditTemplate(template)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteTemplate(template.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Apply Template Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {templateToApply && (
              <div>
                <Text className="mb-4">
                  Apply template &quot;{templateToApply.name}&quot; to create a new invoice?
                </Text>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Text variant="small" className="font-medium mb-2">Template Preview:</Text>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {templateToApply.items.map((item, index) => (
                      <li key={index}>
                        {item.description} - {formatCurrency(item.unit_price)} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <Text variant="body" className="font-semibold">
                      Total: {formatCurrency(calculateTotal(templateToApply.items))}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmApply}>
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Form Dialog - Placeholder for now */}
      {showTemplateForm && (
        <Dialog open={showTemplateForm} onOpenChange={setShowTemplateForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  const description = formData.get('description') as string;
                  const itemsJson = formData.get('items') as string;
                  
                  if (!name) {
                    toast.error('Template name is required');
                    return;
                  }

                  let items: InvoiceTemplateItem[] = [];
                  try {
                    items = itemsJson ? JSON.parse(itemsJson) : [];
                  } catch {
                    toast.error('Invalid items format');
                    return;
                  }

                  saveTemplateMutation.mutate({
                    name,
                    description: description || undefined,
                    items,
                    tags: editingTemplate?.tags || [],
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name *</label>
                  <Input
                    name="name"
                    defaultValue={editingTemplate?.name || ''}
                    required
                    placeholder="e.g., Standard Monthly Service"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    name="description"
                    defaultValue={editingTemplate?.description || ''}
                    placeholder="Template description..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Items (JSON)</label>
                  <Textarea
                    name="items"
                    defaultValue={JSON.stringify(editingTemplate?.items || [], null, 2)}
                    placeholder='[{"service_type_id": "...", "description": "...", "quantity": 1, "unit_price": 150.00}]'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    Enter items as JSON array. Each item should have: service_type_id, description, quantity, unit_price
                  </Text>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowTemplateForm(false);
                      setEditingTemplate(null);
                    }}
                    disabled={saveTemplateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveTemplateMutation.isPending}
                  >
                    {saveTemplateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingTemplate ? 'Update Template' : 'Create Template'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


