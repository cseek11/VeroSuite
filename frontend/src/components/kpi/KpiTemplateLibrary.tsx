import React, { useState, useMemo, useEffect } from 'react';
import { useKpiTemplates, useFeaturedKpiTemplates, usePopularKpiTemplates, useTrackTemplateUsage, useFavoritedTemplates, useFavoriteTemplate, useTemplateFavoriteStatus, useUserKpis } from '@/hooks/useKpiTemplates';
import KpiTemplateEditor from './KpiTemplateEditor';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/EnhancedUI';
import { Badge } from '@/components/ui/CRMComponents';
import { Chip } from '@/components/ui/EnhancedUI';
import { 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Plus, 
  Eye, 
  Copy,
  Tag,
  Calendar,
  User,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Settings,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import type { KpiTemplate, KpiTemplateFilters } from '@/types/kpi-templates';

interface KpiTemplateLibraryProps {
  onTemplateSelect?: (template: KpiTemplate) => void;
  onUseTemplate?: (template: KpiTemplate) => void;
  showCreateButton?: boolean;
  className?: string;
}

export default function KpiTemplateLibrary({ 
  onTemplateSelect, 
  onUseTemplate,
  showCreateButton = true,
  className = ''
}: KpiTemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | undefined>();

  // Debounce search term to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks - remove server-side search to prevent excessive API calls
  const { data: templates = [], isLoading: templatesLoading, error: templatesError } = useKpiTemplates({
    // Only filter by category and type on server-side, search is handled client-side
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    template_type: selectedType !== 'all' ? selectedType : undefined,
  });
  const { data: userKpis = [] } = useUserKpis();

  // Debug logging (reduced for performance)
  console.log('🔍 KpiTemplateLibrary Debug:');
  console.log('  - templates count:', Array.isArray(templates) ? templates.length : 'not array');
  console.log('  - templatesLoading:', templatesLoading);
  console.log('  - userKpis count:', Array.isArray(userKpis) ? userKpis.length : 'not array');
  console.log('  - userKpis data:', userKpis);
  console.log('  - templates data:', templates);
  
  const { data: featuredTemplates = [] } = useFeaturedKpiTemplates();
  const { data: popularTemplates = [] } = usePopularKpiTemplates(6);
  const trackUsageMutation = useTrackTemplateUsage();

  // Get favorited templates to sort them first
  const { data: favoritedTemplatesData = [], isLoading: favoritesLoading, error: favoritesError } = useFavoritedTemplates();
  const favoritedTemplateIds = new Set(favoritedTemplatesData.map(t => t.id));
  
  // Debug favorites data (reduced for performance)
  console.log('🔍 Favorites Debug:');
  console.log('  - favoritedTemplatesData count:', favoritedTemplatesData.length);
  console.log('  - favoritesLoading:', favoritesLoading);

  // Local optimistic overrides so clicking heart immediately reorders list
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  
  // Clear optimistic overrides when favorites data is successfully loaded
  React.useEffect(() => {
    if (favoritedTemplatesData.length > 0 && !favoritesLoading && !favoritesError) {
      console.log('🔄 Clearing optimistic overrides - favorites data loaded successfully');
      setFavoriteOverrides({});
    }
  }, [favoritedTemplatesData.length, favoritesLoading, favoritesError]);

  // Effective favorited IDs (server + optimistic overrides)
  const effectiveFavoritedIds = useMemo(() => {
    const set = new Set(favoritedTemplateIds);
    Object.entries(favoriteOverrides).forEach(([id, isFav]) => {
      if (isFav) set.add(id);
      else set.delete(id);
    });
    return set;
  }, [favoritedTemplateIds, favoriteOverrides]);

  // Map user KPIs to template-like objects
  const userTemplates = useMemo(() => {
    console.log('🔄 Processing user KPIs to templates:', userKpis);
    if (!Array.isArray(userKpis)) {
      console.log('⚠️ userKpis is not an array:', userKpis);
      return [] as any[];
    }
    const mapped = userKpis.map((k: any) => {
      console.log('🔍 User KPI details:', {
        id: k.id,
        template_id: k.template_id,
        name: k.name,
        has_template_id: !!k.template_id,
        is_from_template: !!k.template_id
      });
      
      return {
        id: k.template_id || k.id, // Use template_id for favorites, fallback to k.id
        userKpiId: k.id, // Keep original UserKpi ID for reference
        tenant_id: k.tenant_id,
        name: k.name,
        description: k.description || '',
        category: k.category || 'operational',
        template_type: 'user',
        is_from_template: !!k.template_id, // Track if this is from a template or custom
        formula_expression: k.formula_expression || '',
        formula_fields: k.formula_fields || [],
        threshold_config: k.threshold_config || {},
        chart_config: k.chart_config || {},
        data_source_config: k.data_source_config || {},
        tags: k.tags || [],
        is_public: false,
        is_featured: false,
        usage_count: k.usage_count || 0,
        status: 'published',
        created_at: k.created_at,
        creator: k.creator || undefined,
      };
    });
    console.log('✅ Mapped user templates:', mapped);
    console.log('🔍 User template IDs for favorites:', mapped.map(t => ({ name: t.name, id: t.id, userKpiId: t.userKpiId, is_from_template: t.is_from_template })));
    return mapped;
  }, [userKpis]);

  // Combine user templates + system templates
  const combinedTemplates = useMemo(() => {
    const sys = Array.isArray(templates) ? templates : [];
    const combined = [...userTemplates, ...sys];
    console.log('🔄 Combined templates details:', {
      userTemplatesCount: userTemplates.length,
      systemTemplatesCount: sys.length,
      combinedCount: combined.length,
      userTemplates: userTemplates,
      systemTemplates: sys.slice(0, 2), // Show first 2 for debugging
      combinedArray: combined
    });
    console.log('🔄 Combined templates array length:', combined.length);
    console.log('🔄 Combined templates first item:', combined[0]);
    return combined;
  }, [templates, userTemplates]);

  // Derive user templates (user-created templates)
  const derivedUserTemplates = useMemo(() => {
    const source = Array.isArray(combinedTemplates) ? combinedTemplates : [];
    const list = source.filter((t: any) => t.template_type === 'user');
    // keep a stable order: name asc
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
    console.log('🔍 Derived User Templates Debug:');
    console.log('  - source length:', source.length);
    console.log('  - filtered list length:', list.length);
    console.log('  - sorted list length:', sorted.length);
    console.log('  - sorted templates:', sorted);
    return sorted;
  }, [combinedTemplates]);

  // Derive favorites list for the section at the top (optimistic)
  const derivedFavoritedTemplates = useMemo(() => {
    const source = Array.isArray(combinedTemplates) ? combinedTemplates : [];
    
    // For each favorited template, prefer the user version if it exists
    const favoritedList: any[] = [];
    
    Array.from(effectiveFavoritedIds).forEach(favoritedId => {
      // First, check if there's a user template with this template_id (only those from templates)
      const userTemplate = source.find(t => 
        t.template_type === 'user' && t.id === favoritedId && t.is_from_template
      );
      
      if (userTemplate) {
        // Use the user template (only if it's from a template)
        favoritedList.push(userTemplate);
      } else {
        // Check if there's a system template with this ID
        const systemTemplate = source.find(t => 
          t.template_type !== 'user' && t.id === favoritedId
        );
        
        if (systemTemplate) {
          favoritedList.push(systemTemplate);
        }
      }
    });
    
    // Keep a stable order: name asc
    const sorted = [...favoritedList].sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('🔍 Derived Favorites Debug:');
    console.log('  - source length:', source.length);
    console.log('  - effectiveFavoritedIds:', Array.from(effectiveFavoritedIds));
    console.log('  - favorited list length:', favoritedList.length);
    console.log('  - sorted favorites:', sorted);
    console.log('  - user templates in source:', source.filter(t => t.template_type === 'user').map(t => ({ name: t.name, id: t.id, userKpiId: t.userKpiId })));
    console.log('  - system templates in source:', source.filter(t => t.template_type !== 'user').map(t => ({ name: t.name, id: t.id })));
    
    return sorted;
  }, [combinedTemplates, effectiveFavoritedIds]);

  // Filter and sort templates based on search, category, and favorites
  const filteredTemplates = useMemo(() => {
    console.log('🔍 Filtering templates - combinedTemplates:', combinedTemplates);
    console.log('🔍 Filtering templates - combinedTemplates type:', typeof combinedTemplates);
    console.log('🔍 Filtering templates - combinedTemplates isArray:', Array.isArray(combinedTemplates));
    
    if (!Array.isArray(combinedTemplates)) {
      console.error('Templates is not an array:', combinedTemplates);
      console.error('Templates type:', typeof templates);
      console.error('Templates keys:', templates ? Object.keys(templates) : 'null/undefined');
      return [];
    }
    
    // Always work on a copy to avoid mutating server data arrays
    let filtered = [...combinedTemplates];

    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(search) ||
        template.description?.toLowerCase().includes(search) ||
        template.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort: favorited templates first, then by name
    const sorted = filtered.sort((a, b) => {
      const aIsFavorited = effectiveFavoritedIds.has(a.id);
      const bIsFavorited = effectiveFavoritedIds.has(b.id);
      
      if (aIsFavorited && !bIsFavorited) return -1;
      if (!aIsFavorited && bIsFavorited) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
    return sorted;
  }, [combinedTemplates, debouncedSearchTerm, effectiveFavoritedIds]);

  // Get unique categories and types for filters
  const categories = useMemo(() => {
    if (!Array.isArray(combinedTemplates)) {
      console.error('Templates is not an array:', combinedTemplates);
      return ['all'];
    }
    const cats = ['all', ...Array.from(new Set(combinedTemplates.map((t: any) => t.category)))];
    return cats;
  }, [combinedTemplates]);

  const types = useMemo(() => {
    if (!Array.isArray(templates)) {
      console.error('Templates is not an array:', templates);
      return ['all'];
    }
    const types = ['all', ...Array.from(new Set(templates.map(t => t.template_type)))];
    return types;
  }, [templates]);

  // Handle template actions
  const handleTemplateClick = async (template: KpiTemplate) => {
    // Track view
    await trackUsageMutation.mutateAsync({
      templateId: template.id,
      action: 'viewed'
    });
    
    onTemplateSelect?.(template);
  };

  const handleUseTemplate = async (template: KpiTemplate) => {
    console.log('🔍 TICKET-4: Starting template usage with comprehensive logging');
    console.log('📋 Template details:', {
      id: template.id,
      name: template.name,
      type: template.type,
      source: (template as any).source,
      template_type: (template as any).template_type,
      user_id: (template as any).user_id,
      is_active: (template as any).is_active
    });

    // Fire-and-forget tracking so failures don't block using the template
    trackUsageMutation
      .mutateAsync({ templateId: template.id, action: 'viewed' })
      .catch((err) => console.warn('Failed to track template usage:', err));

    // Always proceed to use the template
    try {
      console.log('✅ TICKET-4: Calling onUseTemplate callback');
      onUseTemplate?.(template);
      console.log('✅ TICKET-4: Template usage completed successfully');
    } catch (error) {
      console.error('❌ TICKET-4: Failed to use template:', error);
    }
  };


  const handleShareTemplate = async (template: KpiTemplate) => {
    try {
      // Track the share action
      await trackUsageMutation.mutateAsync({
        templateId: template.id,
        action: 'shared'
      });

      // Copy template URL to clipboard
      const templateUrl = `${window.location.origin}/templates/${template.id}`;
      await navigator.clipboard.writeText(templateUrl);
      
      // Show success message (you could add a toast notification here)
      console.log('Template URL copied to clipboard:', templateUrl);
    } catch (error) {
      console.error('Failed to share template:', error);
    }
  };

  // Get category icon and color
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'operational': return Settings;
      case 'customer': return Users;
      case 'compliance': return Shield;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'shared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Template list item component
  const TemplateListItem = ({ template, featured = false }: { template: KpiTemplate; featured?: boolean }) => {
    const CategoryIcon = getCategoryIcon(template.category);
    
    // Only show favorite functionality for templates that can be favorited
    // User-created KPIs (not from templates) can't be favorited through the template system
    const canBeFavorited = template.template_type !== 'user' || template.is_from_template;
    
    const { data: favoriteStatus } = useTemplateFavoriteStatus(template.id);
    const favoriteMutation = useFavoriteTemplate();
    
    return (
      <div 
        className={`group cursor-pointer transition-all duration-200 hover:bg-gray-50 border rounded-lg p-3 ${featured ? 'ring-2 ring-red-400 bg-red-50' : 'bg-white border-gray-200'}`}
        onClick={() => handleTemplateClick(template)}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Template info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <CategoryIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                    {template.name}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Chip className={`text-xs ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </Chip>
                    <Chip className={`text-xs ${getTypeColor(template.template_type)}`}>
                      {template.template_type}
                    </Chip>
                    <Chip className="text-xs bg-green-100 text-green-700 border-green-200">
                      Live View
                    </Chip>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{template.usage_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(template.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 line-clamp-1 flex-1 min-w-0 pr-2">
                  {template.description}
                </p>
                {template.creator && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-32">{template.creator.first_name} {template.creator.last_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUseTemplate(template);
              }}
              disabled={trackUsageMutation.isPending}
              className="px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Use Template
            </Button>
            
            {canBeFavorited && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !favoriteStatus?.isFavorited;
                  // optimistic override
                  setFavoriteOverrides((prev) => ({ ...prev, [template.id]: next }));
                  favoriteMutation.mutate(
                    { templateId: template.id, isFavorited: next },
                    {
                      onSuccess: () => {
                        // clear override after server confirms (query invalidation will refresh)
                        setFavoriteOverrides((prev) => {
                          const { [template.id]: _omit, ...rest } = prev;
                          return rest;
                        });
                      },
                      onError: () => {
                        // revert override on error
                        setFavoriteOverrides((prev) => {
                          const { [template.id]: _omit, ...rest } = prev;
                          return rest;
                        });
                      }
                    }
                  );
                }}
                disabled={favoriteMutation.isPending}
                className={`px-2 ${favoriteStatus?.isFavorited || favoriteOverrides[template.id] ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorited || favoriteOverrides[template.id] ? "fill-current" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (templatesLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KPI Templates</h2>
          <p className="text-gray-600 mt-1">
            Browse and use pre-built KPI templates for your dashboard
          </p>
        </div>
        
        {showCreateButton && (
          <Button onClick={() => setShowTemplateEditor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* User Templates (user-created templates) */}
      {derivedUserTemplates.length > 0 && !debouncedSearchTerm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Your Templates</h3>
          </div>
          <div className="space-y-2">
            {derivedUserTemplates.map(template => (
              <TemplateListItem key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}

      {/* Favorited Templates (computed locally, includes optimistic state) */}
      {derivedFavoritedTemplates.length > 0 && !debouncedSearchTerm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <h3 className="text-lg font-semibold text-red-900">Your Favorites</h3>
          </div>
          <div className="space-y-2">
            {derivedFavoritedTemplates.slice(0, 6).map(template => (
              <TemplateListItem key={template.id} template={template} featured />
            ))}
          </div>
        </div>
      )}

      {/* Popular Templates */}
      {popularTemplates.length > 0 && !debouncedSearchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
          </div>
          <div className="space-y-2">
            {popularTemplates.map(template => (
              <TemplateListItem key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {debouncedSearchTerm ? `Search Results for "${debouncedSearchTerm}" (${filteredTemplates.length})` : `All Templates (${filteredTemplates.length})`}
          </h3>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearchTerm ? 'Try adjusting your search terms' : 'No templates available yet'}
            </p>
            {showCreateButton && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTemplates.map(template => (
              <TemplateListItem key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      <KpiTemplateEditor
        templateId={editingTemplateId}
        isOpen={showTemplateEditor}
        onClose={() => {
          setShowTemplateEditor(false);
          setEditingTemplateId(undefined);
        }}
        onSave={(template) => {
          // Refresh templates list
          // The hook will automatically refetch due to mutation invalidation
          setShowTemplateEditor(false);
          setEditingTemplateId(undefined);
        }}
      />
    </div>
  );
}
