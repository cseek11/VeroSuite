import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import type {
  CreateKpiTemplateDto,
  UpdateKpiTemplateDto,
  KpiTemplateFilters,
  UseKpiTemplateDto
} from '@/types/kpi-templates';

// ============================================================================
// KPI TEMPLATES HOOKS
// ============================================================================

// Hook to get all KPI templates with filtering
export const useKpiTemplates = (filters: KpiTemplateFilters = {}) => {
  const result = useQuery({
    queryKey: queryKeys.kpiTemplates.list(filters),
    queryFn: () => {
      logger.debug('useKpiTemplates calling API', { filters }, 'useKpiTemplates');
      return enhancedApi.kpiTemplates.list(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reduced debug logging for performance (development only)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('useKpiTemplates result', {
      dataCount: Array.isArray(result.data) ? result.data.length : 0,
      isLoading: result.isLoading,
      status: result.status
    }, 'useKpiTemplates');
  }

  return result;
};

// Hook to get a specific KPI template
export const useKpiTemplate = (id: string) => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.detail(id),
    queryFn: () => enhancedApi.kpiTemplates.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get popular KPI templates
export const usePopularKpiTemplates = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.popular(limit),
    queryFn: () => enhancedApi.kpiTemplates.getPopular(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get featured KPI templates
export const useFeaturedKpiTemplates = () => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.featured(),
    queryFn: () => enhancedApi.kpiTemplates.getFeatured(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook to create a new KPI template
export const useCreateKpiTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKpiTemplateDto) => enhancedApi.kpiTemplates.create(data),
    onSuccess: () => {
      // Invalidate and refetch KPI templates
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.featured() });
    },
    onError: (error: unknown) => {
      logger.error('Failed to create KPI template', error, 'useKpiTemplates');
    },
  });
};

// Hook to update a KPI template
export const useUpdateKpiTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKpiTemplateDto }) =>
      enhancedApi.kpiTemplates.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific template in cache
      queryClient.setQueryData(
        queryKeys.kpiTemplates.detail(variables.id),
        data
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.lists() });
    },
    onError: (error) => {
      logger.error('Failed to update KPI template', error, 'useKpiTemplates');
    },
  });
};

// Hook to delete a KPI template
export const useDeleteKpiTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enhancedApi.kpiTemplates.delete(id),
    onSuccess: (_, id) => {
      // Remove the template from cache
      queryClient.removeQueries({ queryKey: queryKeys.kpiTemplates.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.lists() });
    },
    onError: (error) => {
      logger.error('Failed to delete KPI template', error, 'useKpiTemplates');
    },
  });
};

// Hook to use a template to create a user KPI
export const useUseKpiTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: UseKpiTemplateDto }) =>
      enhancedApi.kpiTemplates.useTemplate(templateId, data),
    onSuccess: () => {
      // Invalidate user KPIs and template lists
      queryClient.invalidateQueries({ queryKey: queryKeys.userKpis.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.popular() });
    },
    onError: (error) => {
      logger.error('Failed to use KPI template', error, 'useKpiTemplates');
    },
  });
};

// Hook to track template usage
export const useTrackTemplateUsage = () => {
  return useMutation({
    mutationFn: ({ templateId, action }: { templateId: string; action: string }) =>
      enhancedApi.kpiTemplates.trackUsage(templateId, action),
    onError: (error) => {
      logger.error('Failed to track template usage', error, 'useKpiTemplates');
    },
  });
};

// Hook to favorite/unfavorite a template
export const useFavoriteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ templateId, isFavorited }: { templateId: string; isFavorited: boolean }) => {
      const action = isFavorited ? 'favorited' : 'unfavorited';
      logger.debug('Favorite API call', { templateId, action }, 'useKpiTemplates');
      return enhancedApi.kpiTemplates.trackUsage(templateId, action);
    },
    onSuccess: (data, variables) => {
      logger.debug('Favorite mutation successful', { templateId: variables.templateId, action: variables.isFavorited ? 'favorited' : 'unfavorited' }, 'useKpiTemplates');
      // Invalidate template queries to refresh the data
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.featured() });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.popular() });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiTemplates.favorites() });
      // Also invalidate the specific template's favorite status
      queryClient.invalidateQueries({ queryKey: ['kpi-templates', 'favorite-status', variables.templateId] });
    },
    onError: (error) => {
      logger.error('Failed to favorite/unfavorite template', error, 'useKpiTemplates');
    },
  });
};

// Hook to get user's favorited templates
export const useFavoritedTemplates = () => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.favorites(),
    queryFn: () => {
      logger.debug('useFavoritedTemplates calling API', {}, 'useKpiTemplates');
      return enhancedApi.kpiTemplates.getFavorites();
    },
    staleTime: 1 * 60 * 1000, // 1 minute (shorter for favorites)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch when component mounts
  });
};

// Hook to check if a template is favorited
export const useTemplateFavoriteStatus = (templateId: string) => {
  return useQuery({
    queryKey: ['kpi-templates', 'favorite-status', templateId],
    queryFn: () => enhancedApi.kpiTemplates.getFavoriteStatus(templateId),
    enabled: !!templateId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ============================================================================
// USER KPIS HOOKS
// ============================================================================

// Hook to get user's KPIs
export const useUserKpis = (filters: Record<string, any> = {}) => {
  const result = useQuery({
    queryKey: queryKeys.userKpis.list(filters),
    queryFn: () => {
      logger.debug('useUserKpis calling API', { filters }, 'useKpiTemplates');
      return enhancedApi.userKpis.list();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (user KPIs change more frequently)
  });

  // Reduced debug logging for performance
  if (process.env.NODE_ENV === 'development') {
    logger.debug('useUserKpis result', {
      dataCount: Array.isArray(result.data) ? result.data.length : 0,
      isLoading: result.isLoading,
      status: result.status
    }, 'useKpiTemplates');
  }

  return result;
};

// Hook to get a specific user KPI
export const useUserKpi = (id: string) => {
  return useQuery({
    queryKey: queryKeys.userKpis.detail(id),
    queryFn: () => enhancedApi.userKpis.get(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a new user KPI
export const useCreateUserKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => enhancedApi.userKpis.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userKpis.all });
    },
    onError: (error) => {
      logger.error('Failed to create user KPI', error, 'useKpiTemplates');
    },
  });
};

// Hook to update a user KPI
export const useUpdateUserKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      enhancedApi.userKpis.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.userKpis.detail(variables.id),
        data
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.userKpis.lists() });
    },
    onError: (error) => {
      logger.error('Failed to update user KPI', error, 'useKpiTemplates');
    },
  });
};

// Hook to delete a user KPI
export const useDeleteUserKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enhancedApi.userKpis.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.userKpis.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.userKpis.lists() });
    },
    onError: (error) => {
      logger.error('Failed to delete user KPI', error, 'useKpiTemplates');
    },
  });
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

// Hook to get templates by category
export const useKpiTemplatesByCategory = (category: string) => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.list({ category }),
    queryFn: () => enhancedApi.kpiTemplates.list({ category }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search templates
export const useSearchKpiTemplates = (searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.kpiTemplates.list({ search: searchTerm }),
    queryFn: () => enhancedApi.kpiTemplates.list({ search: searchTerm }),
    enabled: searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
  });
};

// Hook to get template usage analytics
export const useTemplateAnalytics = (templateId: string) => {
  return useQuery({
    queryKey: ['template-analytics', templateId],
    queryFn: async () => {
      // This would be implemented when analytics endpoints are available
      // For now, return mock data
      return {
        views: 0,
        uses: 0,
        favorites: 0,
        shares: 0,
      };
    },
    enabled: !!templateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
