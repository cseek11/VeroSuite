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

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import type { InvoiceTemplate } from '@/types/api.types';

interface InvoiceTemplateItem {
  service_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

// Extended template with items for component use
interface InvoiceTemplateWithItems extends Omit<InvoiceTemplate, 'template_content'> {
  items: InvoiceTemplateItem[];
}

interface InvoiceTemplatesProps {
  onApplyTemplate?: (template: InvoiceTemplateWithItems) => void;
}

export default function InvoiceTemplates({ onApplyTemplate }: InvoiceTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplateWithItems | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [templateToApply, setTemplateToApply] = useState<InvoiceTemplateWithItems | null>(null);

  const queryClient = useQueryClient();

  // Mock templates - In production, this would fetch from API
  const { data: templatesData, isLoading, error: templatesError } = useQuery<InvoiceTemplateWithItems[]>({
    queryKey: ['invoice-templates'],
    queryFn: async (): Promise<InvoiceTemplateWithItems[]> => {
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Standard Monthly Service',
          description: 'Monthly pest control service invoice template',
          items: [
            {
              service_type_id: '',
              description: 'Monthly Pest Control Service',
              quantity: 1,
              unit_price: 150.00,
            },
          ],
          tags: ['monthly', 'recurring'],
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'One-Time Treatment',
          description: 'Template for one-time treatment services',
          items: [
            {
              service_type_id: '',
              description: 'One-Time Treatment Service',
              quantity: 1,
              unit_price: 200.00,
            },
          ],
          tags: ['one-time', 'treatment'],
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    },
  });

  if (templatesError) {
    logger.error('Failed to fetch invoice templates', templatesError, 'InvoiceTemplates');
    toast.error('Failed to load templates. Please try again.');
  }

  const templates: InvoiceTemplateWithItems[] = Array.isArray(templatesData) ? templatesData : [];

  // Extract unique tags from templates
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach((template: InvoiceTemplateWithItems) => {
      template.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((template: InvoiceTemplateWithItems) =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower) ||
        template.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter((template: InvoiceTemplateWithItems) =>
        template.tags?.includes(selectedTag)
      );
    }

    return filtered;
  }, [templates, searchTerm, selectedTag]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: InvoiceTemplateWithItems) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      logger.debug('Template deleted', { templateId }, 'InvoiceTemplates');
      toast.success('Template deleted successfully');
      
      // Invalidate query to refetch
      await queryClient.invalidateQueries({ queryKey: ['invoice-templates'] });
    } catch (error) {
      logger.error('Failed to delete template', error, 'InvoiceTemplates');
      toast.error('Failed to delete template. Please try again.');
    }
  };

  const handleApplyTemplate = (template: InvoiceTemplateWithItems) => {
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
              {filteredTemplates.map((template: InvoiceTemplateWithItems) => (
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
                        {template.items.slice(0, 2).map((item: InvoiceTemplateItem, index: number) => (
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
                        {template.tags.map((tag: string) => (
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
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
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
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <Text className="text-yellow-800 font-medium">
                        Template Editor Coming Soon
                      </Text>
                      <Text variant="small" className="text-yellow-700 mt-1">
                        Template creation and editing will be available in the next update.
                        For now, templates are managed via the API.
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateForm(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


