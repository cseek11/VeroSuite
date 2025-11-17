import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';

interface TemplateLoadingState {
  isLoading: boolean;
  error: string | null;
  templates: any[];
  retryCount: number;
}

export const useTemplateLoading = () => {
  const [state, setState] = useState<TemplateLoadingState>({
    isLoading: false,
    error: null,
    templates: [],
    retryCount: 0
  });

  // Track if templates have been loaded to prevent infinite loops
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const loadTemplates = useCallback(async (retry = false) => {
    // Prevent concurrent loads
    if (isLoadingRef.current && !retry) {
      return;
    }

    if (retry) {
      setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
    } else {
      isLoadingRef.current = true;
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      logger.debug('Loading KPI templates');
      const templates = await enhancedApi.kpiTemplates.list();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        templates: templates || [],
        retryCount: 0
      }));
      
      hasLoadedRef.current = true;
      isLoadingRef.current = false;
      
      logger.info('Templates loaded successfully', { count: templates?.length || 0 });
      return templates;
    } catch (error: any) {
      logger.error('Template loading failed', error, 'TemplateLoading');
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load templates',
        templates: []
      }));
      
      isLoadingRef.current = false;
      
      throw error;
    }
  }, []);

  const retry = useCallback(() => {
    return loadTemplates(true);
  }, [loadTemplates]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-load on mount (only once)
  useEffect(() => {
    if (!hasLoadedRef.current && !isLoadingRef.current) {
      loadTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return {
    ...state,
    loadTemplates,
    retry,
    clearError,
    canRetry: state.retryCount < 3
  };
};




