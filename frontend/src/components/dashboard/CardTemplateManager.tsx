import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Plus, 
  Copy, 
  Trash2, 
  Share2, 
  Eye,
  Grid3X3,
  BarChart3,
  DollarSign,
  UserCheck,
  Shield,
  Settings,
  Tag,
  Download,
  Upload,
  GitBranch
} from 'lucide-react';
import { useCardTemplates, CardTemplate } from '@/hooks/useCardTemplates';
import { cn } from '@/lib/utils';
import { toast } from '@/utils/toast';

interface CardTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (template: CardTemplate) => void;
  onSaveTemplate?: (template: CardTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  currentCards?: any[];
  currentLayout?: any;
  userId?: string;
}

const CardTemplateManager: React.FC<CardTemplateManagerProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  currentCards = [],
  currentLayout,
  userId = 'user'
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my-templates' | 'import-export'>('browse');
  const [showPreview, setShowPreview] = useState<CardTemplate | null>(null);
  const [showVersionModal, setShowVersionModal] = useState<CardTemplate | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const templates = useCardTemplates({
    ...(onApplyTemplate ? { onApplyTemplate } : {}),
    ...(onSaveTemplate ? { onSaveTemplate } : {}),
    ...(onDeleteTemplate ? { onDeleteTemplate } : {}),
    ...(userId !== undefined ? { userId } : {})
  });

  const categoryIcons = {
    dashboard: Grid3X3,
    financial: DollarSign,
    operational: BarChart3,
    customer: UserCheck,
    compliance: Shield,
    custom: Settings
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      dashboard: 'text-blue-600 bg-blue-100',
      financial: 'text-green-600 bg-green-100',
      operational: 'text-purple-600 bg-purple-100',
      customer: 'text-orange-600 bg-orange-100',
      compliance: 'text-red-600 bg-red-100',
      custom: 'text-gray-600 bg-gray-100'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const handleSaveCurrentLayout = () => {
    if (currentCards.length === 0) {
      toast.warning('No cards to save as template');
      return;
    }

    const name = prompt('Enter template name:');
    if (!name) return;

    const description = prompt('Enter template description:') || '';
    const category = prompt('Enter category (dashboard/financial/operational/customer/compliance/custom):') as CardTemplate['category'] || 'custom';
    const tags = prompt('Enter tags (comma-separated):')?.split(',').map(t => t.trim()).filter(Boolean) || [];

    templates.createFromLayout(
      name,
      description,
      category,
      currentCards,
      currentLayout || {},
      tags
    );

    toast.success('Template saved successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Card Templates</h2>
            <p className="text-sm text-gray-500">Browse, create, and manage dashboard templates</p>
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
            { id: 'browse', name: 'Browse Templates', icon: Grid3X3 },
            { id: 'create', name: 'Create Template', icon: Plus },
            { id: 'my-templates', name: 'My Templates', icon: Users },
            { id: 'import-export', name: 'Import/Export', icon: Upload }
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
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        {activeTab === 'browse' && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templates.searchTerm}
                  onChange={(e) => templates.setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={templates.selectedCategory}
                onChange={(e) => templates.setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {templates.categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {templates.hasFilters && (
                <button
                  onClick={templates.clearFilters}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Tags */}
            {templates.allTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {templates.allTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      onClick={() => templates.toggleTag(tag)}
                      className={cn(
                        "flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors",
                        templates.selectedTags.includes(tag)
                          ? "bg-purple-100 text-purple-700 border border-purple-300"
                          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-300px)]">
          {activeTab === 'browse' && (
            <div>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Templates</p>
                      <p className="text-2xl font-bold text-blue-900">{templates.templates.length}</p>
                    </div>
                    <Grid3X3 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Most Popular</p>
                      <p className="text-2xl font-bold text-green-900">
                        {templates.getPopularTemplates(1)[0]?.name || 'N/A'}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">My Templates</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {templates.templates.filter(t => t.metadata.author === userId).length}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.filteredTemplates.map(template => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(template.category)}
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(template.category))}>
                          {template.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setShowPreview(template)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => templates.exportTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => templates.duplicateTemplate(template)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {template.metadata.author === userId && (
                          <>
                            <button
                              onClick={() => setShowVersionModal(template)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Create Version"
                            >
                              <GitBranch className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => templates.deleteTemplate(template.id)}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{template.metadata.usageCount} uses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {template.metadata?.isPublic && (
                          <Share2 className="w-3 h-3 text-blue-500" />
                        )}
                        <span className="text-xs text-gray-500">{template.cards.length} cards</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => templates.applyTemplate(template)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Apply Template
                    </button>
                  </div>
                ))}

                {templates.filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No templates found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Save Current Layout as Template</h3>
                <p className="text-blue-700 mb-4">
                  Save your current dashboard layout as a reusable template that you can apply later or share with others.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-blue-600">
                    <strong>{currentCards.length}</strong> cards in current layout
                  </div>
                  <button
                    onClick={handleSaveCurrentLayout}
                    disabled={currentCards.length === 0}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                      currentCards.length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Template</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create from Scratch</h3>
                <p className="text-gray-600 mb-4">
                  Create a new template by designing a layout from scratch. This will open the template builder.
                </p>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create New Template</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import-export' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Section */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Export Templates</h3>
                  <p className="text-green-700 mb-4">
                    Export your templates to share with others or backup your work.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const myTemplates = templates.templates.filter(t => t.metadata.author === userId);
                        myTemplates.forEach(template => templates.exportTemplate(template.id));
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export All My Templates</span>
                    </button>
                    <button
                      onClick={() => {
                        const publicTemplates = templates.templates.filter(t => t.metadata.isPublic);
                        publicTemplates.forEach(template => templates.exportTemplate(template.id));
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Public Templates</span>
                    </button>
                  </div>
                </div>

                {/* Import Section */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Import Templates</h3>
                  <p className="text-blue-700 mb-4">
                    Import template files to add new templates to your library.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".json"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setImportError(null);
                        setImportSuccess(null);

                        try {
                          const importedTemplate = await templates.importTemplate(file);
                          setImportSuccess(`Template "${importedTemplate.name}" imported successfully!`);
                        } catch (error) {
                          setImportError(error instanceof Error ? error.message : 'Import failed');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {importSuccess && (
                      <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                        {importSuccess}
                      </div>
                    )}
                    {importError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {importError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Statistics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{templates.templates.length}</div>
                    <div className="text-sm text-gray-600">Total Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {templates.templates.filter(t => t.metadata.author === userId).length}
                    </div>
                    <div className="text-sm text-gray-600">My Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {templates.templates.filter(t => t.metadata.isPublic).length}
                    </div>
                    <div className="text-sm text-gray-600">Public Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {templates.templates.reduce((sum, t) => sum + t.metadata.usageCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Uses</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-templates' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.templates.filter(t => t.metadata.author === userId).map(template => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(template.category)}
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(template.category))}>
                          {template.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setShowPreview(template)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => templates.duplicateTemplate(template)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => templates.deleteTemplate(template.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-500">
                        Created {template.metadata.createdAt.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {template.metadata.usageCount} uses
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => templates.applyTemplate(template)}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => template.metadata.isPublic ? templates.unshareTemplate(template.id) : templates.shareTemplate(template.id)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-md transition-colors",
                          template.metadata.isPublic
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                        )}
                      >
                        {template.metadata.isPublic ? 'Unshare' : 'Share'}
                      </button>
                    </div>
                  </div>
                ))}

                {templates.templates.filter(t => t.metadata.author === userId).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't created any templates yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
              <button
                onClick={() => setShowPreview(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">{showPreview.name}</h4>
                <p className="text-sm text-gray-600">{showPreview.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Cards in this template:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {showPreview.cards.map((card, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {card.type} ({card.size.width}x{card.size.height})
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    templates.applyTemplate(showPreview);
                    setShowPreview(null);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Apply Template
                </button>
                <button
                  onClick={() => setShowPreview(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Creation Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Template Version</h3>
              <button
                onClick={() => setShowVersionModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Template: {showVersionModal.name}</h4>
                <p className="text-sm text-gray-600">Create a new version of this template</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., v2.0, Updated Layout, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    id="versionName"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const versionName = (document.getElementById('versionName') as HTMLInputElement)?.value || 'v2.0';
                      templates.createTemplateVersion(showVersionModal.id, versionName);
                      setShowVersionModal(null);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Create Version
                  </button>
                  <button
                    onClick={() => setShowVersionModal(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTemplateManager;
