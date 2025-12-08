import React, { useState, useMemo, useEffect } from 'react';
import { useKpiTemplates, useFeaturedKpiTemplates, usePopularKpiTemplates, useTrackTemplateUsage, useFavoritedTemplates, useFavoriteTemplate, useTemplateFavoriteStatus, useUserKpis } from '@/hooks/useKpiTemplates';
import KpiTemplateEditor from './KpiTemplateEditor';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import {
  Search, 
  Filter, 
  TrendingUp, 
  Plus, 
  Eye,
  Calendar,
  User,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  Shield,
  Heart
} from 'lucide-react';
import type { KpiTemplate } from '@/types/kpi-templates';
import { logger } from '@/utils/logger';

type TemplateType = KpiTemplate['template_type'];
type TemplateCategory = KpiTemplate['category'];
type TemplateStatus = KpiTemplate['status'];

type TemplateLike = Partial<KpiTemplate> & Record<string, any> & {
  id?: string;
  tags?: string[];
  description?: string | null;
  category?: TemplateCategory | null;
  template_type?: TemplateType | null;
  is_from_template?: boolean;
  creator?: KpiTemplate['creator'];
  usage_count?: number | null;
  created_at?: string | null;
};

type CategoryFilter = 'all' | 'financial' | 'operational' | 'customer' | 'compliance' | 'user';
type TemplateTypeFilter = 'all' | 'system' | 'user' | 'shared';

const coerceString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const templateCategories: TemplateCategory[] = [
  'user',
  'financial',
  'operational',
  'customer',
  'compliance',
];
const templateTypes: TemplateType[] = ['system', 'user', 'shared'];
const templateStatuses: TemplateStatus[] = ['draft', 'published', 'archived'];

const normalizeCategory = (value: unknown): TemplateCategory => {
  const maybeCategory = coerceString(value) as TemplateCategory;
  return templateCategories.includes(maybeCategory) ? maybeCategory : 'operational';
};

const normalizeTemplateType = (value: unknown): TemplateType => {
  const maybeType = coerceString(value) as TemplateType;
  return templateTypes.includes(maybeType) ? maybeType : 'system';
};

const normalizeStatus = (value: unknown): TemplateStatus => {
  const maybeStatus = coerceString(value) as TemplateStatus;
  return templateStatuses.includes(maybeStatus) ? maybeStatus : 'published';
};

const normalizeThresholdConfig = (
  value: unknown
): KpiTemplate['threshold_config'] | undefined => {
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as any).green === 'number' &&
    typeof (value as any).yellow === 'number' &&
    typeof (value as any).red === 'number'
  ) {
    return value as KpiTemplate['threshold_config'];
  }
  return undefined;
};

const normalizeChartConfig = (
  value: unknown
): KpiTemplate['chart_config'] | undefined => {
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as any).type === 'string' &&
    Array.isArray((value as any).colorScheme)
  ) {
    return value as KpiTemplate['chart_config'];
  }
  return undefined;
};

const normalizeDataSourceConfig = (
  value: unknown
): KpiTemplate['data_source_config'] | undefined => {
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as any).table === 'string' &&
    typeof (value as any).timeRange === 'string'
  ) {
    return value as KpiTemplate['data_source_config'];
  }
  return undefined;
};

const ensureTemplateArray = (value: unknown): TemplateLike[] =>
  Array.isArray(value) ? (value as TemplateLike[]) : [];

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedType, setSelectedType] = useState<TemplateTypeFilter>('all');
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
  const templateQueryParams: Record<string, string> = {};
  if (selectedCategory !== 'all') {
    templateQueryParams.category = selectedCategory;
  }
  if (selectedType !== 'all') {
    templateQueryParams.template_type = selectedType;
  }

  const { data: templates = [], isLoading: templatesLoading, error: _templatesError } = useKpiTemplates(templateQueryParams);
  const { data: userKpis = [] } = useUserKpis();

  const { data: _featuredTemplates = [] } = useFeaturedKpiTemplates();
  const { data: popularTemplates = [] } = usePopularKpiTemplates(6);
  const trackUsageMutation = useTrackTemplateUsage();

  // Get favorited templates to sort them first
  const { data: favoritedTemplatesData = [], isLoading: favoritesLoading, error: favoritesError } = useFavoritedTemplates();
  const favoritedTemplateIds = new Set(favoritedTemplatesData.map(t => t.id));

  // Local optimistic overrides so clicking heart immediately reorders list
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  
  // Clear optimistic overrides when favorites data is successfully loaded
  React.useEffect(() => {
    if (favoritedTemplatesData.length > 0 && !favoritesLoading && !favoritesError) {
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
  const userTemplates: TemplateLike[] = useMemo(() => {
    if (!Array.isArray(userKpis)) {
      logger.warn('userKpis is not an array', { userKpis }, 'KpiTemplateLibrary');
      return [];
    }

    return userKpis.map((k: Record<string, unknown>) => {
      const id = coerceString(k.template_id || k.id);
      const tenantId = typeof k.tenant_id === 'string' ? k.tenant_id : undefined;
      const thresholdConfig = normalizeThresholdConfig(k.threshold_config);
      const chartConfig = normalizeChartConfig(k.chart_config);
      const dataSourceConfig = normalizeDataSourceConfig(k.data_source_config);
      const status = normalizeStatus(k.status ?? 'published');
      const createdAt = typeof k.created_at === 'string' ? k.created_at : undefined;
    const creator =
      k.creator && typeof k.creator === 'object' && (k as any).creator?.id
        ? (k.creator as KpiTemplate['creator'])
        : undefined;

      const baseTemplate = {
        id,
        userKpiId: k.id,
        name: coerceString(k.name, 'Untitled'),
        description: coerceString(k.description, ''),
        category: normalizeCategory(k.category),
        template_type: normalizeTemplateType('user'),
        is_from_template: !!k.template_id,
        formula_expression: coerceString(k.formula_expression, ''),
        formula_fields: Array.isArray(k.formula_fields) ? k.formula_fields : [],
        ...(thresholdConfig ? { threshold_config: thresholdConfig } : {}),
        ...(chartConfig ? { chart_config: chartConfig } : {}),
        ...(dataSourceConfig ? { data_source_config: dataSourceConfig } : {}),
        tags: Array.isArray(k.tags) ? (k.tags as string[]) : [],
        is_public: false,
        is_featured: false,
        usage_count: typeof k.usage_count === 'number' ? k.usage_count : 0,
        status,
      };

      return tenantId
      ? {
          ...baseTemplate,
          ...(createdAt ? { created_at: createdAt } : {}),
          ...(creator ? { creator } : {}),
          tenant_id: tenantId,
        }
      : {
          ...baseTemplate,
          ...(createdAt ? { created_at: createdAt } : {}),
          ...(creator ? { creator } : {}),
        };
    });
  }, [userKpis]);

  // Combine user templates + system templates
  const combinedTemplates: TemplateLike[] = useMemo(() => {
    const sys = ensureTemplateArray(templates).map((t) => {
      const normalizedThreshold = normalizeThresholdConfig(t.threshold_config);
      const normalizedChart = normalizeChartConfig(t.chart_config);
      const normalizedDataSource = normalizeDataSourceConfig(t.data_source_config);
      const createdAt = typeof t.created_at === 'string' ? t.created_at : undefined;
      const creator =
        t.creator && typeof t.creator === 'object' && (t as any).creator?.id
          ? (t.creator as KpiTemplate['creator'])
          : undefined;
      return {
        ...t,
        template_type: normalizeTemplateType(t.template_type),
        category: normalizeCategory(t.category),
        status: normalizeStatus(t.status),
        ...(normalizedThreshold ? { threshold_config: normalizedThreshold } : {}),
        ...(normalizedChart ? { chart_config: normalizedChart } : {}),
        ...(normalizedDataSource ? { data_source_config: normalizedDataSource } : {}),
        ...(createdAt ? { created_at: createdAt } : {}),
        ...(creator ? { creator } : {}),
      };
    });
    return [...userTemplates, ...sys];
  }, [templates, userTemplates]);

  // Derive user templates (user-created templates)
  const derivedUserTemplates = useMemo(() => {
    const list = combinedTemplates.filter((t) => t.template_type === 'user');
    return [...list].sort((a, b) => coerceString(a.name).localeCompare(coerceString(b.name)));
  }, [combinedTemplates]);

  // Derive favorites list for the section at the top (optimistic)
  const derivedFavoritedTemplates = useMemo(() => {
    const favoritedList: TemplateLike[] = [];

    Array.from(effectiveFavoritedIds).forEach((favoritedId) => {
      const userTemplate = combinedTemplates.find(
        (t) => t.template_type === 'user' && t.id === favoritedId && t.is_from_template
      );

      if (userTemplate) {
        favoritedList.push(userTemplate);
        return;
      }

      const systemTemplate = combinedTemplates.find(
        (t) => t.template_type !== 'user' && t.id === favoritedId
      );

      if (systemTemplate) {
        favoritedList.push(systemTemplate);
      }
    });

    return [...favoritedList].sort((a, b) => coerceString(a.name).localeCompare(coerceString(b.name)));
  }, [combinedTemplates, effectiveFavoritedIds]);

  // Filter and sort templates based on search, category, and favorites
  const filteredTemplates = useMemo(() => {
    let filtered = [...combinedTemplates];

    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((template) => {
        const name = coerceString(template.name).toLowerCase();
        const description = coerceString(template.description).toLowerCase();
        const tags = Array.isArray(template.tags)
          ? template.tags.filter((tag): tag is string => typeof tag === 'string')
          : [];

        return (
          name.includes(search) ||
          description.includes(search) ||
          tags.some((tag) => tag.toLowerCase().includes(search))
        );
      });
    }

    return filtered.sort((a, b) => {
      const aIsFavorited = a.id ? effectiveFavoritedIds.has(a.id) : false;
      const bIsFavorited = b.id ? effectiveFavoritedIds.has(b.id) : false;

      if (aIsFavorited && !bIsFavorited) return -1;
      if (!aIsFavorited && bIsFavorited) return 1;

      return coerceString(a.name).localeCompare(coerceString(b.name));
    });
  }, [combinedTemplates, debouncedSearchTerm, effectiveFavoritedIds]);

  // Get unique categories and types for filters
  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    combinedTemplates.forEach((t) => cats.add(coerceString(t.category, 'uncategorized')));
    return Array.from(cats);
  }, [combinedTemplates]);

  const types = useMemo(() => {
    const typeSet = new Set<string>(['all']);
    ensureTemplateArray(templates).forEach((t) => typeSet.add(coerceString(t.template_type, 'unknown')));
    return Array.from(typeSet);
  }, [templates]);

  // Handle template actions
  const handleTemplateClick = async (template: TemplateLike & { id: string }) => {
    // Track view
    await trackUsageMutation.mutateAsync({
      templateId: template.id,
      action: 'viewed'
    });
    
    onTemplateSelect?.(template as KpiTemplate);
  };

  const handleUseTemplate = async (template: TemplateLike & { id: string }) => {
    // Fire-and-forget tracking so failures don't block using the template
    trackUsageMutation
      .mutateAsync({ templateId: template.id, action: 'viewed' })
      .catch((err) => logger.warn('Failed to track template usage', err, 'KpiTemplateLibrary'));

    // Always proceed to use the template
    try {
      onUseTemplate?.(template as KpiTemplate);
    } catch (error) {
      logger.error('Failed to use template', error, 'KpiTemplateLibrary');
    }
  };


  // Share template functionality (currently unused but kept for future implementation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleShareTemplate = async (_template: KpiTemplate) => {
    try {
      // Track the share action
      await trackUsageMutation.mutateAsync({
        templateId: _template.id,
        action: 'shared'
      });

      // Copy template URL to clipboard
      const templateUrl = `${window.location.origin}/templates/${_template.id}`;
      await navigator.clipboard.writeText(templateUrl);
      
      logger.debug('Template URL copied to clipboard', { templateUrl }, 'KpiTemplateLibrary');
    } catch (error) {
      logger.error('Failed to share template', error, 'KpiTemplateLibrary');
    }
  };

  // Mark placeholder handler as intentionally unused for now
  void _handleShareTemplate;

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
  const TemplateListItem = ({ template, featured = false }: { template: TemplateLike & { id: string }; featured?: boolean }) => {
    const templateId = template.id;

    const CategoryIcon = getCategoryIcon(coerceString(template.category, ''));
    
    // Only show favorite functionality for templates that can be favorited
    // User-created KPIs (not from templates) can't be favorited through the template system
    const canBeFavorited = template.template_type !== 'user' || template.is_from_template;
    
    const { data: favoriteStatus } = useTemplateFavoriteStatus(templateId);
    const favoriteMutation = useFavoriteTemplate();
    
    return (
      <div 
        className={`group cursor-pointer transition-all duration-200 hover:bg-gray-50 border rounded-lg p-3 ${featured ? 'ring-2 ring-red-400 bg-red-50' : 'bg-white border-gray-200'}`}
        onClick={() => handleTemplateClick({ ...template, id: templateId })}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Template info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <CategoryIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                    {coerceString(template.name, 'Untitled Template')}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge className={`text-xs ${getCategoryColor(coerceString(template.category, ''))}`}>
                      {template.category || 'uncategorized'}
                    </Badge>
                    <Badge className={`text-xs ${getTypeColor(coerceString(template.template_type, ''))}`}>
                      {template.template_type}
                    </Badge>
                    <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                      Live View
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{template.usage_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{template.created_at ? new Date(template.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 line-clamp-1 flex-1 min-w-0 pr-2">
                  {coerceString(template.description)}
                </p>
                {template.creator && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-32">
                      {coerceString(template.creator?.first_name)} {coerceString(template.creator?.last_name)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button
              size="sm"
              onClick={() => {
                handleUseTemplate({ ...template, id: templateId });
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
                onClick={() => {
                  const next = !favoriteStatus?.isFavorited;
                  // optimistic override
                  setFavoriteOverrides((prev) => ({ ...prev, [templateId]: next }));
                  favoriteMutation.mutate(
                    { templateId, isFavorited: next },
                    {
                      onSuccess: () => {
                        // clear override after server confirms (query invalidation will refresh)
                        setFavoriteOverrides((prev) => {
                          const { [templateId]: _omit, ...rest } = prev;
                          return rest;
                        });
                      },
                      onError: () => {
                        // revert override on error
                        setFavoriteOverrides((prev) => {
                          const { [templateId]: _omit, ...rest } = prev;
                          return rest;
                        });
                      }
                    }
                  );
                }}
                disabled={favoriteMutation.isPending}
                className={`px-2 ${favoriteStatus?.isFavorited || favoriteOverrides[templateId] ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorited || favoriteOverrides[templateId] ? "fill-current" : ""}`} />
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
                onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
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
                onChange={(e) => setSelectedType(e.target.value as TemplateTypeFilter)}
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
            {derivedUserTemplates
              .filter((template): template is TemplateLike & { id: string } => !!template.id)
              .map((template) => (
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
            {derivedFavoritedTemplates
              .filter((template): template is TemplateLike & { id: string } => !!template.id)
              .slice(0, 6)
              .map((template) => (
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
            {popularTemplates
              .filter((template): template is TemplateLike & { id: string } => !!template.id)
              .map((template) => (
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
            {filteredTemplates
              .filter((template): template is TemplateLike & { id: string } => !!template.id)
              .map((template) => (
                <TemplateListItem key={template.id} template={template} />
              ))}
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      <KpiTemplateEditor
        {...(editingTemplateId ? { templateId: editingTemplateId } : { templateId: null })}
        isOpen={showTemplateEditor}
        onClose={() => {
          setShowTemplateEditor(false);
          setEditingTemplateId(undefined);
        }}
        onSave={(_template) => {
          // Refresh templates list
          // The hook will automatically refetch due to mutation invalidation
          setShowTemplateEditor(false);
          setEditingTemplateId(undefined);
        }}
      />
    </div>
  );
}
