// ============================================================================
// ADVANCED SEARCH HOOK
// ============================================================================
// React hook for advanced search functionality with fuzzy matching and suggestions

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  advancedSearchService, 
  type AdvancedSearchOptions, 
  type AdvancedSearchResult, 
  type SearchSuggestion 
} from '@/lib/advanced-search-service';
import type { SearchFilters } from '@/types/enhanced-types';
import { searchAnalyticsService } from '@/lib/search-analytics-service';
import { logger } from '@/utils/logger';

export interface UseAdvancedSearchOptions {
  enableAutoCorrection?: boolean;
  enableSuggestions?: boolean;
  debounceMs?: number;
  defaultSearchMode?: 'standard' | 'fuzzy' | 'hybrid' | 'vector';
  fuzzyThreshold?: number;
  typoTolerance?: number;
}

export interface AdvancedSearchState {
  results: AdvancedSearchResult[];
  suggestions: SearchSuggestion[];
  correctedQuery?: string;
  isLoading: boolean;
  error: string | null;
  searchMode: 'standard' | 'fuzzy' | 'hybrid' | 'vector';
  hasSearched: boolean;
}

export const useAdvancedSearch = (options: UseAdvancedSearchOptions = {}) => {
  const {
    enableAutoCorrection = true,
    enableSuggestions = true,
    debounceMs = 300,
    defaultSearchMode = 'hybrid',
    fuzzyThreshold = 0.3,
    typoTolerance = 1
  } = options;

  // Core state
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchMode, setSearchMode] = useState<'standard' | 'fuzzy' | 'hybrid' | 'vector'>(defaultSearchMode);
  const [hasSearched, setHasSearched] = useState(false);




  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // Advanced search query
  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError,
    refetch: _refetchSearch
  } = useQuery({
    queryKey: ['advanced-search', debouncedQuery, filters, searchMode],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('useQuery queryFn called with debouncedQuery', { debouncedQuery }, 'useAdvancedSearch');
      }
      
      if (!debouncedQuery.trim()) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Empty search query, returning empty results', {}, 'useAdvancedSearch');
        }
        return {
          results: [],
          suggestions: [],
          correctedQuery: undefined
        };
      }

      const searchOptions: AdvancedSearchOptions = {
        fuzzyThreshold,
        typoTolerance,
        searchMode,
        maxResults: 50
      };

      try {
        // Start analytics tracking
        const queryId = searchAnalyticsService.createQueryId();
        searchAnalyticsService.startSearchTracking(queryId);
        
        let searchResult;
        if (enableAutoCorrection) {
          searchResult = await advancedSearchService.searchWithAutoCorrection(debouncedQuery, filters, searchOptions);
        } else {
          const results = await advancedSearchService.searchCustomersAdvanced(debouncedQuery, filters, searchOptions);
          const suggestions = enableSuggestions 
            ? await advancedSearchService.getSearchSuggestions(debouncedQuery, 5)
            : [];
          
          searchResult = {
            results,
            suggestions,
            correctedQuery: undefined
          };
        }
        
        // Complete analytics tracking
        await searchAnalyticsService.completeSearchTracking(queryId, {
          queryText: debouncedQuery,
          queryType: 'hybrid',
          searchMode: searchMode,
          resultsCount: searchResult.results?.length || 0,
          cacheHit: false,
          searchSuccessful: true,
          sessionId: searchAnalyticsService.getSessionId()
        });
        
        // Update popular searches in the database
        try {
          await searchAnalyticsService.updatePopularSearches(debouncedQuery, searchResult.results?.length || 0, true);
        } catch (analyticsError: unknown) {
          logger.warn('Failed to update popular searches', { error: analyticsError }, 'useAdvancedSearch');
        }
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('useQuery search completed', {
            resultsCount: searchResult.results?.length || 0,
            suggestionsCount: searchResult.suggestions?.length || 0,
            correctedQuery: searchResult.correctedQuery
          }, 'useAdvancedSearch');
        }
        
        return searchResult;
      } catch (error: unknown) {
        // Log search error to analytics
        await searchAnalyticsService.logSearchError(
          'search_execution_error',
          error instanceof Error ? error.message : 'Unknown search error',
          debouncedQuery,
          searchMode
        );
        
        logger.error('useQuery search failed', error, 'useAdvancedSearch');
        throw error;
      }
    },
    enabled: Boolean(debouncedQuery.trim()), // Enable when debouncedQuery exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Suggestions query (separate from main search)
  const {
    data: suggestionsData,
    isLoading: _isSuggestionsLoading
  } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => advancedSearchService.getSearchSuggestions(query, 5),
    enabled: enableSuggestions && query.length > 2 && !hasSearched,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Debug logging - moved after all hooks are declared
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('useAdvancedSearch state', {
        query,
        debouncedQuery,
        hasSearched,
        isLoading: isSearching,
        resultsLength: searchData?.results?.length || 0
      }, 'useAdvancedSearch');
    }
  }, [query, debouncedQuery, hasSearched, isSearching, searchData?.results?.length]);

  // Debounced search function - FIXED: Remove refetchSearch to prevent infinite loops
  const performSearch = useCallback((searchText: string, searchFilters?: SearchFilters) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('performSearch called', { searchText }, 'useAdvancedSearch');
    }
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!searchText.trim()) {
      setDebouncedQuery('');
      setHasSearched(false);
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Executing search', { searchText }, 'useAdvancedSearch');
        }
        setDebouncedQuery(searchText); // This will trigger useQuery via queryKey change
        setHasSearched(true);
      }
    }, debounceMs);
  }, [debounceMs]);

  // Search function
  const search = useCallback((searchText: string, searchFilters?: SearchFilters) => {
    setQuery(searchText);
    if (searchFilters) {
      setFilters(searchFilters);
    }
    performSearch(searchText, searchFilters);
  }, [performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setFilters({});
    setHasSearched(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = undefined;
    }
  }, []);

  // Update search mode
  const updateSearchMode = useCallback((mode: 'standard' | 'fuzzy' | 'hybrid' | 'vector') => {
    setSearchMode(mode);
    if (debouncedQuery.trim()) {
      // Re-trigger search with new mode
      performSearch(debouncedQuery, filters);
    }
  }, [debouncedQuery, filters, performSearch]);

  // Get search suggestions for current query
  const getSuggestions = useCallback(async (searchQuery: string): Promise<SearchSuggestion[]> => {
    if (!enableSuggestions || searchQuery.length < 2) return [];
    
    try {
      return await advancedSearchService.getSearchSuggestions(searchQuery, 5);
    } catch (error: unknown) {
      logger.error('Failed to get suggestions', error, 'useAdvancedSearch');
      return [];
    }
  }, [enableSuggestions]);

  // Search with specific suggestion
  const searchWithSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    performSearch(suggestion.text, filters);
  }, [filters, performSearch]);

  // Search with corrected query
  const searchWithCorrection = useCallback((correctedQuery: string) => {
    setQuery(correctedQuery);
    performSearch(correctedQuery, filters);
  }, [filters, performSearch]);

  // Get search statistics
  const getSearchStats = useCallback(() => {
    if (!searchData?.results) return null;

    const totalResults = searchData.results.length;
    const averageRelevance = totalResults > 0 
      ? searchData.results.reduce((sum, r) => sum + (r.relevance_score || 0), 0) / totalResults
      : 0;

    const stats = {
      totalResults,
      exactMatches: searchData.results.filter(r => r.match_type === 'exact').length,
      fuzzyMatches: searchData.results.filter(r => r.match_type === 'fuzzy').length,
      partialMatches: searchData.results.filter(r => r.match_type === 'partial').length,
      vectorMatches: searchData.results.filter(r => r.match_type === 'vector').length,
      averageRelevance,
      hasCorrection: !!searchData.correctedQuery,
      suggestionsCount: searchData.suggestions.length
    };

    return stats;
  }, [searchData]);

  // Cleanup on unmount - FIXED: Prevent memory leaks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = undefined;
      }
    };
  }, []);

  // State
  const results = searchData?.results || [];
  const suggestions = searchData?.suggestions || suggestionsData || [];
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Final state preparation', {
      resultsLength: results.length,
      suggestionsLength: suggestions.length,
      isLoading: isSearching,
      hasSearched,
      error: searchError?.message
    }, 'useAdvancedSearch');
  }
  
  const state: AdvancedSearchState = {
    results,
    suggestions,
    ...(searchData?.correctedQuery && { correctedQuery: searchData.correctedQuery }),
    isLoading: isSearching,
    error: searchError?.message || null,
    searchMode,
    hasSearched
  };

  return {
    // State
    ...state,
    
    // Actions
    search,
    clearSearch,
    updateSearchMode,
    getSuggestions,
    searchWithSuggestion,
    searchWithCorrection,
    
    // Utilities
    getSearchStats,
    
    // Raw data
    query,
    filters,
    setFilters
  };
};

export default useAdvancedSearch;
