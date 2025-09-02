// ============================================================================
// OPTIMIZED SEARCH HOOK
// ============================================================================
// High-performance React hook for search with:
// - Intelligent debouncing
// - Result caching
// - Performance monitoring
// - Auto-correction suggestions

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { optimizedSearch, OptimizedSearchResult, SearchOptions, SearchPerformanceMetrics } from '@/lib/optimized-search-service';

export interface UseOptimizedSearchOptions extends SearchOptions {
  // Debouncing options
  debounceMs?: number;
  minQueryLength?: number;
  
  // React Query options
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UseOptimizedSearchReturn {
  // Results
  results: OptimizedSearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  error: Error | null;
  
  // Performance metrics
  metrics: SearchPerformanceMetrics | null;
  suggestion: string | null;
  
  // Actions
  search: (query: string) => void;
  clearResults: () => void;
  acceptSuggestion: (correction: string) => void;
  rejectSuggestion: () => void;
  
  // Cache management
  clearCache: () => void;
  refreshCache: () => Promise<void>;
  
  // Stats
  cacheStats: { size: number; hitRate: number };
}

/**
 * Optimized search hook with intelligent performance features
 */
export const useOptimizedSearch = (
  options: UseOptimizedSearchOptions = {}
): UseOptimizedSearchReturn => {
  const queryClient = useQueryClient();
  
  const {
    debounceMs = 300,
    minQueryLength = 2,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000,   // 10 minutes
    ...searchOptions
  } = options;

  // Local state
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [metrics, setMetrics] = useState<SearchPerformanceMetrics | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);

  // Intelligent debouncing based on query characteristics
  const getDebounceDelay = useCallback((searchQuery: string): number => {
    if (searchQuery.length <= 2) return debounceMs + 200; // Longer delay for short queries
    if (searchQuery.length >= 6) return Math.max(100, debounceMs - 100); // Shorter delay for longer queries
    if (/^\d+$/.test(searchQuery)) return debounceMs - 100; // Faster for numbers (phone/ID)
    return debounceMs;
  }, [debounceMs]);

  // Advanced debouncing with performance optimization
  useEffect(() => {
    if (query.length < minQueryLength) {
      setDebouncedQuery('');
      return;
    }

    const delay = getDebounceDelay(query);
    const timeSinceLastSearch = Date.now() - lastSearchTime;
    
    // If user is typing fast, increase debounce delay
    const adjustedDelay = timeSinceLastSearch < 100 ? delay + 100 : delay;
    
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setLastSearchTime(Date.now());
    }, adjustedDelay);

    return () => clearTimeout(timer);
  }, [query, minQueryLength, getDebounceDelay, lastSearchTime]);

  // Query key factory for better caching
  const queryKey = useMemo(() => [
    'optimized-search',
    debouncedQuery,
    searchOptions
  ], [debouncedQuery, searchOptions]);

  // Main search query with React Query
  const {
    data: searchData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
        return { results: [], metrics: null, suggestion: null };
      }

      setIsSearching(true);
      try {
        const result = await optimizedSearch.search(debouncedQuery, searchOptions);
        
        // Update metrics and suggestions
        setMetrics(result.metrics);
        setSuggestion(result.suggestion || null);
        
        return result;
      } finally {
        setIsSearching(false);
      }
    },
    enabled: enabled && debouncedQuery.length >= minQueryLength,
    staleTime,
    gcTime,
    // Optimize re-fetching behavior
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    // Keep previous data while loading new results
    placeholderData: (previousData) => previousData,
  });

  // Memoized results for performance
  const results = useMemo(() => searchData?.results || [], [searchData?.results]);

  // Search function with immediate feedback
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    // Immediate feedback for very short queries
    if (searchQuery.length < minQueryLength) {
      setMetrics(null);
      setSuggestion(null);
    }
  }, [minQueryLength]);

  // Clear results and cache
  const clearResults = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setMetrics(null);
    setSuggestion(null);
    queryClient.removeQueries({ queryKey: ['optimized-search'] });
  }, [queryClient]);

  // Accept auto-correction suggestion
  const acceptSuggestion = useCallback(async (correction: string) => {
    if (suggestion && debouncedQuery) {
      // Learn from the correction
      await optimizedSearch.learnCorrection(debouncedQuery, correction, true);
      
      // Search with correction
      search(correction);
      setSuggestion(null);
      
      console.log('Accepted suggestion:', { original: debouncedQuery, correction });
    }
  }, [suggestion, debouncedQuery, search]);

  // Reject auto-correction suggestion
  const rejectSuggestion = useCallback(async () => {
    if (suggestion && debouncedQuery) {
      // Learn from rejection
      await optimizedSearch.learnCorrection(debouncedQuery, suggestion, false);
      setSuggestion(null);
      
      console.log('Rejected suggestion:', { original: debouncedQuery, suggestion });
    }
  }, [suggestion, debouncedQuery]);

  // Cache management
  const clearCache = useCallback(() => {
    optimizedSearch.clearCache();
    queryClient.removeQueries({ queryKey: ['optimized-search'] });
  }, [queryClient]);

  const refreshCache = useCallback(async () => {
    await optimizedSearch.refreshSearchCache();
    queryClient.invalidateQueries({ queryKey: ['optimized-search'] });
  }, [queryClient]);

  // Cache statistics
  const cacheStats = useMemo(() => optimizedSearch.getCacheStats(), []);

  // Performance monitoring effect
  useEffect(() => {
    if (metrics) {
      // Log slow searches for monitoring
      if (metrics.totalTime > 1000) {
        console.warn('Slow search detected:', {
          query: debouncedQuery,
          metrics,
          searchOptions
        });
      }
      
      // Log search patterns for optimization
      if (process.env.NODE_ENV === 'development') {
        console.log('Search metrics:', {
          query: debouncedQuery,
          strategy: metrics.searchStrategy,
          time: Math.round(metrics.totalTime),
          results: metrics.resultCount,
          cached: metrics.cacheHit
        });
      }
    }
  }, [metrics, debouncedQuery, searchOptions]);

  return {
    // Results
    results,
    isLoading,
    isSearching,
    error: error as Error | null,
    
    // Performance metrics
    metrics,
    suggestion,
    
    // Actions
    search,
    clearResults,
    acceptSuggestion,
    rejectSuggestion,
    
    // Cache management
    clearCache,
    refreshCache,
    
    // Stats
    cacheStats
  };
};

/**
 * Hook for search suggestions
 */
export const useSearchSuggestions = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => optimizedSearch.getSearchSuggestions(query, 5),
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
};

/**
 * Hook for search performance monitoring
 */
export const useSearchMonitoring = () => {
  const [searchMetrics, setSearchMetrics] = useState<{
    averageTime: number;
    totalSearches: number;
    cacheHitRate: number;
    slowSearches: number;
  }>({
    averageTime: 0,
    totalSearches: 0,
    cacheHitRate: 0,
    slowSearches: 0
  });

  const recordSearch = useCallback((metrics: SearchPerformanceMetrics) => {
    setSearchMetrics(prev => ({
      averageTime: (prev.averageTime * prev.totalSearches + metrics.totalTime) / (prev.totalSearches + 1),
      totalSearches: prev.totalSearches + 1,
      cacheHitRate: metrics.cacheHit ? 
        (prev.cacheHitRate * prev.totalSearches + 1) / (prev.totalSearches + 1) :
        (prev.cacheHitRate * prev.totalSearches) / (prev.totalSearches + 1),
      slowSearches: metrics.totalTime > 1000 ? prev.slowSearches + 1 : prev.slowSearches
    }));
  }, []);

  return {
    metrics: searchMetrics,
    recordSearch
  };
};
