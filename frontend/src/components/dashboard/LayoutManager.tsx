import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, Search, Trash2, Edit2, Save, Tag, Globe, Lock, FileUp, Copy, Check, AlertCircle } from 'lucide-react';
import { SavedLayout, layoutStorage } from '@/services/layoutStorage';
import { DashboardLayout } from '@/hooks/useDashboardLayout';

interface LayoutManagerProps {
  currentLayout: DashboardLayout;
  currentZoom: number;
  currentPan: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
  onLoadLayout: (layout: DashboardLayout) => void;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({
  currentLayout,
  currentZoom,
  currentPan,
  isOpen,
  onClose,
  onLoadLayout
}) => {
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [editingLayout, setEditingLayout] = useState<SavedLayout | null>(null);
  const [selectedLayouts, setSelectedLayouts] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Save form state
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    isPublic: false
  });
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    isPublic: false
  });

  // Load layouts on mount
  useEffect(() => {
    if (isOpen) {
      loadLayouts();
    }
  }, [isOpen]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadLayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const userLayouts = await layoutStorage.getUserLayouts();
      setLayouts(userLayouts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load layouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLayout = async () => {
    if (!saveForm.name.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Include current zoom and pan in the layout data
      const layoutWithViewport = {
        ...currentLayout,
        zoom: currentZoom,
        pan: currentPan
      };

      await layoutStorage.saveLayout(
        saveForm.name,
        layoutWithViewport,
        saveForm.description || undefined,
        saveForm.tags.length > 0 ? saveForm.tags : undefined,
        saveForm.isPublic
      );
      
      setSaveForm({ name: '', description: '', tags: [], isPublic: false });
      setShowSaveForm(false);
      await loadLayouts();
      showNotification('success', 'Layout saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save layout';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLayout = async (layoutId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const layoutData = await layoutStorage.loadLayoutData(layoutId);
      if (layoutData) {
        onLoadLayout(layoutData);
        onClose();
        showNotification('success', 'Layout loaded successfully!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load layout';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateLayout = async (layoutId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const layout = layouts.find(l => l.id === layoutId);
      if (!layout) {
        throw new Error('Layout not found');
      }
      
      const layoutData = await layoutStorage.loadLayoutData(layoutId);
      if (!layoutData) {
        throw new Error('Failed to load layout data');
      }
      
      await layoutStorage.saveLayout(
        `${layout.name} (Copy)`,
        layoutData,
        layout.description,
        layout.tags,
        layout.is_public
      );
      
      await loadLayouts();
      showNotification('success', 'Layout duplicated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate layout';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleLayoutSelection = (layoutId: string) => {
    setSelectedLayouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layoutId)) {
        newSet.delete(layoutId);
      } else {
        newSet.add(layoutId);
      }
      return newSet;
    });
  };

  const handleBulkExport = async () => {
    try {
      const layoutsToExport = selectedLayouts.size > 0 
        ? layouts.filter(layout => selectedLayouts.has(layout.id))
        : layouts;
      
      const exportData = {
        version: '2.0',
        exportedAt: Date.now(),
        layouts: layoutsToExport.map(layout => ({
          name: layout.name,
          description: layout.description,
          tags: layout.tags,
          is_public: layout.is_public,
          created_at: layout.created_at,
          updated_at: layout.updated_at
        }))
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verocards-layouts-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('success', `Exported ${layoutsToExport.length} layouts successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export layouts';
      setError(errorMessage);
      showNotification('error', errorMessage);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLayouts.size} layout(s)? This cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const deletePromises = Array.from(selectedLayouts).map(id => layoutStorage.deleteLayout(id));
      await Promise.all(deletePromises);
      
      setSelectedLayouts(new Set());
      await loadLayouts();
      showNotification('success', `Deleted ${selectedLayouts.size} layouts successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete layouts';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLayout = async (layoutId: string) => {
    if (!confirm('Are you sure you want to delete this layout?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await layoutStorage.deleteLayout(layoutId);
      await loadLayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete layout');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLayout = async () => {
    if (!editingLayout || !editForm.name.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await layoutStorage.updateLayout(editingLayout.id, {
        name: editForm.name,
        description: editForm.description || undefined,
        tags: editForm.tags.length > 0 ? editForm.tags : [],
        is_public: editForm.isPublic
      });
      
      setEditingLayout(null);
      await loadLayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update layout');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (layout: SavedLayout) => {
    setEditingLayout(layout);
    setEditForm({
      name: layout.name,
      description: layout.description || '',
      tags: layout.tags || [],
      isPublic: layout.is_public
    });
  };

  const handleDownloadLayout = async (layoutId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await layoutStorage.downloadLayout(layoutId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download layout');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLayout = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      
      await layoutStorage.uploadLayout(file);
      await loadLayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload layout');
    } finally {
      setLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredLayouts = layouts.filter(layout =>
    layout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (layout.description && layout.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (layout.tags && layout.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-60">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Layout Manager</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Save Current Layout & Upload */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSaveForm(!showSaveForm)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Current Layout
              </button>

              {/* Upload Layout File */}
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                <FileUp className="w-4 h-4" />
                Upload Layout File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleUploadLayout}
                  className="hidden"
                />
              </label>

              {/* Bulk Operations */}
              {selectedLayouts.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkExport}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export ({selectedLayouts.size})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedLayouts.size})
                  </button>
                </div>
              )}
              
              {showSaveForm && (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Layout name..."
                    value={saveForm.name}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSaveLayout}
                    disabled={!saveForm.name.trim() || loading}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search layouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Layouts List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredLayouts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No layouts found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredLayouts.map((layout) => (
                  <div key={layout.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedLayouts.has(layout.id)}
                          onChange={() => toggleLayoutSelection(layout.id)}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{layout.name}</h3>
                          {layout.is_public ? (
                            <Globe className="w-4 h-4 text-green-500" title="Public" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" title="Private" />
                          )}
                        </div>
                        
                        {layout.description && (
                          <p className="text-sm text-gray-600 mb-2">{layout.description}</p>
                        )}
                        
                        {layout.tags && layout.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {layout.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(layout.created_at).toLocaleDateString()}</span>
                          <span>{layout.file_size ? `${Math.round(layout.file_size / 1024)}KB` : 'Unknown size'}</span>
                        </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleLoadLayout(layout.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Load Layout"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadLayout(layout.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Download Layout File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateLayout(layout.id)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                          title="Duplicate Layout"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(layout)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Edit Layout"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLayout(layout.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Delete Layout"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingLayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center">
            <div className="w-96 bg-white rounded-xl shadow-2xl border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Layout</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={editForm.tags.join(', ')}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) 
                      }))}
                      placeholder="dashboard, productivity, custom"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={editForm.isPublic}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Make this layout public (visible to other users in your organization)
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setEditingLayout(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateLayout}
                    disabled={!editForm.name.trim() || loading}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LayoutManager;
