import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Copy, Share2, Globe, Lock, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { toast } from '@/utils/toast';
import { logger } from '@/utils/logger';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { enhancedApi } from '@/lib/enhanced-api';
import { offlineQueueService } from '@/services/offline-queue.service';
import { isOnline } from '@/utils/pwa';

interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  regions: DashboardRegion[];
  created_at: string;
  updated_at: string;
  is_system?: boolean;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegions: DashboardRegion[];
  onLoadTemplate: (template: DashboardTemplate) => Promise<void>;
  onSaveAsTemplate?: (name: string, description?: string) => Promise<void>;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  isOpen,
  onClose,
  currentRegions,
  onLoadTemplate,
  onSaveAsTemplate
}) => {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // Load templates from backend
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const templatesData = await enhancedApi.dashboardLayouts.templates.list();
      setTemplates(templatesData || []);
    } catch (error) {
      logger.error('Failed to load templates', { error }, 'TemplateManager');
      toast.error('Failed to load templates');
      // Fallback to empty array
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Template name is required');
      return;
    }

    if (currentRegions.length === 0) {
      toast.error('Cannot save empty dashboard as template');
      return;
    }

    setSaving(true);
    try {
      const templateData = {
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        regions: currentRegions.map(r => ({ ...r })),
        is_public: false
      };

      let newTemplate;
      if (isOnline()) {
        newTemplate = await enhancedApi.dashboardLayouts.templates.create(templateData);
      } else {
        // Queue for offline sync
        offlineQueueService.enqueue({
          type: 'create',
          resource: 'template',
          data: templateData
        });
        // Create optimistic template
        newTemplate = {
          id: `temp-${Date.now()}`,
          ...templateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_system: false
        };
        toast.info('Template will be saved when online');
      }

      setTemplates([...templates, newTemplate]);
      
      if (onSaveAsTemplate) {
        await onSaveAsTemplate(templateName.trim(), templateDescription.trim() || undefined);
      }

      setShowSaveDialog(false);
      setTemplateName('');
      setTemplateDescription('');
      toast.success('Template saved successfully');
    } catch (error) {
      logger.error('Failed to save template', { error }, 'TemplateManager');
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadTemplate = async (template: DashboardTemplate) => {
    if (template.regions.length === 0) {
      toast.info('This template is empty. Add regions to customize it.');
      return;
    }

    setLoading(true);
    try {
      await onLoadTemplate(template);
      toast.success(`Loaded template: ${template.name}`);
      onClose();
    } catch (error) {
      logger.error('Failed to load template', { error, templateId: template.id }, 'TemplateManager');
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      if (isOnline()) {
        await enhancedApi.dashboardLayouts.templates.delete(templateId);
      } else {
        // Queue for offline sync
        offlineQueueService.enqueue({
          type: 'delete',
          resource: 'template',
          resourceId: templateId,
          data: {}
        });
        toast.info('Template will be deleted when online');
      }

      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Template deleted');
    } catch (error) {
      logger.error('Failed to delete template', { error, templateId }, 'TemplateManager');
      toast.error('Failed to delete template');
    }
  };

  const handleDuplicateTemplate = async (template: DashboardTemplate) => {
    try {
      const templateData = {
        name: `${template.name} (Copy)`,
        description: template.description,
        thumbnail: template.thumbnail,
        regions: template.regions,
        is_public: false
      };

      let duplicated;
      if (isOnline()) {
        duplicated = await enhancedApi.dashboardLayouts.templates.create(templateData);
      } else {
        // Queue for offline sync
        offlineQueueService.enqueue({
          type: 'create',
          resource: 'template',
          data: templateData
        });
        // Create optimistic template
        duplicated = {
          id: `temp-${Date.now()}`,
          ...templateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_system: false
        };
        toast.info('Template will be duplicated when online');
      }

      setTemplates([...templates, duplicated]);
      toast.success('Template duplicated');
    } catch (error) {
      logger.error('Failed to duplicate template', { error, templateId: template.id }, 'TemplateManager');
      toast.error('Failed to duplicate template');
    }
  };

  const handleShareTemplate = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
    setIsPublic(template.is_public || false);
    setShareLink(`${window.location.origin}/dashboard?template=${template.id}`);
    setShowShareDialog(true);
  };

  const handleTogglePublic = async () => {
    if (!selectedTemplate) return;

    try {
      const updateData = { is_public: !isPublic };
      let updated;

      if (isOnline()) {
        updated = await enhancedApi.dashboardLayouts.templates.update(selectedTemplate.id, updateData);
      } else {
        // Queue for offline sync
        offlineQueueService.enqueue({
          type: 'update',
          resource: 'template',
          resourceId: selectedTemplate.id,
          data: updateData
        });
        // Optimistic update
        updated = { ...selectedTemplate, ...updateData };
        toast.info('Sharing settings will be updated when online');
      }

      setIsPublic(!isPublic);
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? updated : t));
      toast.success(`Template ${!isPublic ? 'made public' : 'made private'}`);
    } catch (error) {
      logger.error('Failed to update template sharing', { error, templateId: selectedTemplate.id }, 'TemplateManager');
      toast.error('Failed to update sharing settings');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Dashboard Templates
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Save Current as Template */}
            {currentRegions.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Save Current Layout</h3>
                    <p className="text-sm text-blue-700">
                      Save your current dashboard layout as a reusable template
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save as Template
                  </Button>
                </div>
              </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {template.regions.length} region{template.regions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {template.is_system && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                        System
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      onClick={() => handleLoadTemplate(template)}
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Load
                    </Button>
                    {!template.is_system && (
                      <>
                        <Button
                          onClick={() => handleShareTemplate(template)}
                          variant="outline"
                          className="px-3"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDuplicateTemplate(template)}
                          variant="outline"
                          className="px-3"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          variant="outline"
                          className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {template.is_public && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Public
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {templates.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No templates available</p>
                {currentRegions.length > 0 && (
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Save Current as Template
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., My Custom Dashboard"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe what this template is for..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={500}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                This will save {currentRegions.length} region{currentRegions.length !== 1 ? 's' : ''} as a template.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setShowSaveDialog(false);
                setTemplateName('');
                setTemplateDescription('');
              }}
              variant="outline"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={saving || !templateName.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Template Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Template
            </DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h4>
                {selectedTemplate.description && (
                  <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <Label className="font-semibold">
                      {isPublic ? 'Public Template' : 'Private Template'}
                    </Label>
                    <p className="text-xs text-gray-600">
                      {isPublic 
                        ? 'Anyone in your organization can view and use this template'
                        : 'Only you can view and use this template'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={handleTogglePublic}
                />
              </div>

              {isPublic && (
                <div className="space-y-2">
                  <Label>Share Link</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="px-3"
                      title="Copy link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Share this link with others in your organization to let them use this template
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

