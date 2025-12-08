import { useState, useCallback, useMemo, useEffect } from 'react';

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'financial' | 'operational' | 'customer' | 'compliance' | 'custom';
  tags: string[];
  cards: Array<{
    type: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    settings?: Record<string, any>;
  }>;
  layout: {
    canvasWidth: number;
    canvasHeight: number;
    zoom: number;
    pan: { x: number; y: number };
  };
  metadata: {
    author: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    usageCount: number;
  };
  preview?: string; // Base64 image or URL
}

interface UseCardTemplatesProps {
  onApplyTemplate?: (template: CardTemplate) => void;
  onSaveTemplate?: (template: CardTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  userId?: string;
}

export function useCardTemplates({
  onApplyTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  userId = 'user'
}: UseCardTemplatesProps) {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [isLoading, _setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Pre-built templates
  const defaultTemplates: CardTemplate[] = useMemo(() => [
    {
      id: 'executive-dashboard',
      name: 'Executive Dashboard',
      description: 'High-level overview for executives and managers',
      category: 'dashboard',
      tags: ['executive', 'overview', 'kpis'],
      cards: [
        { type: 'smart-kpis', position: { x: 20, y: 20 }, size: { width: 300, height: 200 } },
        { type: 'financial-summary', position: { x: 340, y: 20 }, size: { width: 280, height: 200 } },
        { type: 'team-overview', position: { x: 640, y: 20 }, size: { width: 300, height: 200 } },
        { type: 'recent-activity', position: { x: 20, y: 240 }, size: { width: 400, height: 250 } },
        { type: 'customer-experience-panel', position: { x: 440, y: 240 }, size: { width: 500, height: 250 } }
      ],
      layout: {
        canvasWidth: 1200,
        canvasHeight: 600,
        zoom: 1,
        pan: { x: 0, y: 0 }
      },
      metadata: {
        author: 'system',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        usageCount: 0
      }
    },
    {
      id: 'operational-center',
      name: 'Operational Center',
      description: 'Daily operations monitoring and management',
      category: 'operational',
      tags: ['operations', 'daily', 'monitoring'],
      cards: [
        { type: 'jobs-calendar', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
        { type: 'technician-dispatch-panel', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
        { type: 'inventory-compliance-panel', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
        { type: 'routing', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
        { type: 'reports', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
      ],
      layout: {
        canvasWidth: 1200,
        canvasHeight: 600,
        zoom: 1,
        pan: { x: 0, y: 0 }
      },
      metadata: {
        author: 'system',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        usageCount: 0
      }
    },
    {
      id: 'financial-focus',
      name: 'Financial Focus',
      description: 'Financial metrics and revenue tracking',
      category: 'financial',
      tags: ['financial', 'revenue', 'metrics'],
      cards: [
        { type: 'financial-summary', position: { x: 20, y: 20 }, size: { width: 350, height: 250 } },
        { type: 'smart-kpis', position: { x: 390, y: 20 }, size: { width: 400, height: 250 } },
        { type: 'reports', position: { x: 810, y: 20 }, size: { width: 300, height: 250 } },
        { type: 'customer-search', position: { x: 20, y: 290 }, size: { width: 500, height: 200 } },
        { type: 'quick-actions', position: { x: 540, y: 290 }, size: { width: 300, height: 200 } }
      ],
      layout: {
        canvasWidth: 1200,
        canvasHeight: 600,
        zoom: 1,
        pan: { x: 0, y: 0 }
      },
      metadata: {
        author: 'system',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        usageCount: 0
      }
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      description: 'Customer-focused dashboard for service teams',
      category: 'customer',
      tags: ['customer', 'service', 'support'],
      cards: [
        { type: 'customer-experience-panel', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
        { type: 'customer-search', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
        { type: 'recent-activity', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
        { type: 'jobs-calendar', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
        { type: 'quick-actions', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
      ],
      layout: {
        canvasWidth: 1200,
        canvasHeight: 600,
        zoom: 1,
        pan: { x: 0, y: 0 }
      },
      metadata: {
        author: 'system',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        usageCount: 0
      }
    },
    {
      id: 'compliance-monitor',
      name: 'Compliance Monitor',
      description: 'Compliance tracking and reporting dashboard',
      category: 'compliance',
      tags: ['compliance', 'monitoring', 'reports'],
      cards: [
        { type: 'inventory-compliance-panel', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
        { type: 'reports', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
        { type: 'smart-kpis', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
        { type: 'dashboard-metrics', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
        { type: 'team-overview', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
      ],
      layout: {
        canvasWidth: 1200,
        canvasHeight: 600,
        zoom: 1,
        pan: { x: 0, y: 0 }
      },
      metadata: {
        author: 'system',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        usageCount: 0
      }
    }
  ], []);

  // Initialize with default templates
  useEffect(() => {
    if (templates.length === 0) {
      setTemplates(defaultTemplates);
    }
  }, [defaultTemplates, templates.length]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => template.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [templates, searchTerm, selectedCategory, selectedTags]);

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(templates.map(t => t.category))];
    return ['all', ...cats];
  }, [templates]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = templates.flatMap(t => t.tags);
    return [...new Set(tags)].sort();
  }, [templates]);

  // Apply template
  const applyTemplate = useCallback((template: CardTemplate) => {
    // Increment usage count
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, metadata: { ...t.metadata, usageCount: t.metadata.usageCount + 1 } }
        : t
    ));

    onApplyTemplate?.(template);
  }, [onApplyTemplate]);

  // Save template
  const saveTemplate = useCallback((templateData: Omit<CardTemplate, 'id' | 'metadata'>) => {
    const newTemplate: CardTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      metadata: {
        author: userId,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        usageCount: 0
      }
    };

    setTemplates(prev => [...prev, newTemplate]);
    onSaveTemplate?.(newTemplate);
    return newTemplate;
  }, [userId, onSaveTemplate]);

  // Update template
  const updateTemplate = useCallback((templateId: string, updates: Partial<CardTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, ...updates, metadata: { ...template.metadata, updatedAt: new Date() } }
        : template
    ));
  }, []);

  // Delete template
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    onDeleteTemplate?.(templateId);
  }, [onDeleteTemplate]);

  // Duplicate template
  const duplicateTemplate = useCallback((template: CardTemplate) => {
    const duplicatedTemplate: CardTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      metadata: {
        ...template.metadata,
        author: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        usageCount: 0
      }
    };

    setTemplates(prev => [...prev, duplicatedTemplate]);
    return duplicatedTemplate;
  }, [userId]);

  // Share template
  const shareTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, metadata: { ...template.metadata, isPublic: true } }
        : template
    ));
  }, []);

  // Unshare template
  const unshareTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, metadata: { ...template.metadata, isPublic: false } }
        : template
    ));
  }, []);

  // Create template from current layout
  const createFromLayout = useCallback((
    name: string,
    description: string,
    category: CardTemplate['category'],
    cards: any[],
    layout: any,
    tags: string[] = []
  ) => {
    return saveTemplate({
      name,
      description,
      category,
      tags,
      cards: cards.map(card => ({
        type: card.type,
        position: { x: card.x, y: card.y },
        size: { width: card.width, height: card.height },
        settings: card.settings || {}
      })),
      layout: {
        canvasWidth: layout.canvasWidth || 1200,
        canvasHeight: layout.canvasHeight || 600,
        zoom: layout.zoom || 1,
        pan: layout.pan || { x: 0, y: 0 }
      }
    });
  }, [saveTemplate]);

  // Get template by ID
  const getTemplateById = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  // Get popular templates (most used)
  const getPopularTemplates = useCallback((limit: number = 5) => {
    return [...templates]
      .sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)
      .slice(0, limit);
  }, [templates]);

  // Get recent templates
  const getRecentTemplates = useCallback((limit: number = 5) => {
    return [...templates]
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime())
      .slice(0, limit);
  }, [templates]);

  // Export template to JSON
  const exportTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const exportData = {
      ...template,
      metadata: {
        ...template.metadata,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return exportData;
  }, [templates]);

  // Import template from JSON
  const importTemplate = useCallback((file: File) => {
    return new Promise<CardTemplate>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Validate template structure
          if (!data.name || !data.cards || !Array.isArray(data.cards)) {
            throw new Error('Invalid template format');
          }

          const importedTemplate: CardTemplate = {
            ...data,
            id: `template-${Date.now()}`,
            metadata: {
              ...data.metadata,
              author: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              isPublic: false,
              usageCount: 0,
              version: data.metadata?.version || '1.0.0'
            }
          };

          setTemplates(prev => [...prev, importedTemplate]);
          resolve(importedTemplate);
        } catch (error) {
          reject(new Error('Failed to import template: Invalid format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [userId]);

  // Create template version
  const createTemplateVersion = useCallback((templateId: string, versionName: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const newVersion: CardTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} - ${versionName}`,
      metadata: {
        ...template.metadata,
        author: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: versionName,
        isPublic: false,
        usageCount: 0
      }
    };

    setTemplates(prev => [...prev, newVersion]);
    return newVersion;
  }, [templates, userId]);

  // Get template versions
  const getTemplateVersions = useCallback((baseTemplateName: string) => {
    return templates.filter(t => 
      t.name.startsWith(baseTemplateName) || 
      t.name.includes(baseTemplateName)
    ).sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }, [templates]);

  // Search and filter functions
  const setSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const setCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
  }, []);

  return {
    // State
    templates,
    filteredTemplates,
    isLoading,
    searchTerm,
    selectedCategory,
    selectedTags,
    categories,
    allTags,
    
    // Actions
    applyTemplate,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    shareTemplate,
    unshareTemplate,
    createFromLayout,
    exportTemplate,
    importTemplate,
    createTemplateVersion,
    
    // Getters
    getTemplateById,
    getTemplatesByCategory,
    getPopularTemplates,
    getRecentTemplates,
    getTemplateVersions,
    
    // Search and filter
    setSearch,
    setCategory,
    setTags,
    toggleTag,
    clearFilters,
    
    // Computed
    hasFilters: searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
  };
}
