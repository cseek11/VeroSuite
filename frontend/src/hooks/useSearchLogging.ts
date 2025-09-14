// ============================================================================
// SEARCH LOGGING HOOK
// ============================================================================
// React hook for managing search logging functionality

import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchLoggingService, type SearchAnalytics, type SearchCorrection } from '@/lib/search-logging-service';

export interface UseSearchLoggingOptions {
  enableLogging?: boolean;
  enableAnalytics?: boolean;
  enableSuggestions?: boolean;
}

export interface SearchLoggingState {
  isLogging: boolean;
  currentLogId: string | null;
  recentSearches: string[];
  popularSearches: Array<{ query: string; count: number }>;
  searchCorrections: SearchCorrection[];
  analytics: SearchAnalytics | null;
}

export const useSearchLogging = (options: UseSearchLoggingOptions = {}) => {
  const {
    enableLogging = true,
    enableAnalytics = true,
    enableSuggestions = true
  } = options;

  const [isLogging, setIsLogging] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const searchStartTime = useRef<number>(0);

  // Fetch recent searches for suggestions
  const { data: recentSearches = [] } = useQuery({
    queryKey: ['search-logging', 'recent-searches'],
    queryFn: () => searchLoggingService.getRecentSearches(10),
    enabled: enableSuggestions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch popular searches
  const { data: popularSearches = [] } = useQuery({
    queryKey: ['search-logging', 'popular-searches'],
    queryFn: () => searchLoggingService.getPopularSearches(10),
    enabled: enableSuggestions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch search corrections
  const { data: searchCorrections = [] } = useQuery({
    queryKey: ['search-logging', 'search-corrections'],
    queryFn: () => searchLoggingService.getSearchCorrections(),
    enabled: enableSuggestions,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Fetch search analytics
  const { data: analytics = null } = useQuery({
    queryKey: ['search-logging', 'analytics'],
    queryFn: () => searchLoggingService.getSearchAnalytics(30),
    enabled: enableAnalytics,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Start logging a search
  const startSearchLog = useCallback((query: string, searchFilters?: Record<string, any>) => {
    if (!enableLogging) return;

    searchStartTime.current = Date.now();
    setIsLogging(true);
    setCurrentLogId(null);

    console.log('🔍 Starting search log:', { query, filters: searchFilters });
  }, [enableLogging]);

  // Complete logging a search
  const completeSearchLog = useCallback(async (query: string, resultsCount: number, searchFilters?: Record<string, any>) => {
    if (!enableLogging || !searchStartTime.current) return;

    try {
      const timeTakenMs = Date.now() - searchStartTime.current;
      
      const logId = await searchLoggingService.logSearch({
        query,
        resultsCount,
        timeTakenMs,
        searchFilters
      });

      setCurrentLogId(logId);
      console.log('✅ Search log completed:', { query, resultsCount, timeTakenMs, logId });
    } catch (error) {
      console.error('❌ Failed to log search:', error);
    } finally {
      setIsLogging(false);
      searchStartTime.current = 0;
    }
  }, [enableLogging]);

  // Log a click on a search result
  const logSearchClick = useCallback(async (recordId: string) => {
    if (!enableLogging || !currentLogId) return;

    try {
      await searchLoggingService.logClick(currentLogId, recordId);
      console.log('✅ Search click logged:', { logId: currentLogId, recordId });
    } catch (error) {
      console.error('❌ Failed to log search click:', error);
    }
  }, [enableLogging, currentLogId]);

  // Add a search correction
  const addSearchCorrection = useCallback(async (originalQuery: string, correctedQuery: string, wasSuccessful: boolean) => {
    if (!enableLogging) return;

    try {
      await searchLoggingService.addSearchCorrection({
        originalQuery,
        correctedQuery,
        wasSuccessful
      });
      console.log('✅ Search correction added:', { originalQuery, correctedQuery, wasSuccessful });
    } catch (error) {
      console.error('❌ Failed to add search correction:', error);
    }
  }, [enableLogging]);

  // Get search suggestions based on recent and popular searches
  const getSearchSuggestions = useCallback((query: string): string[] => {
    if (!enableSuggestions || !query.trim()) return [];

    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Add recent searches that match
    recentSearches.forEach(recent => {
      if (recent.toLowerCase().includes(lowerQuery) && !suggestions.includes(recent)) {
        suggestions.push(recent);
      }
    });

    // Add popular searches that match
    popularSearches.forEach(popular => {
      if (popular.query.toLowerCase().includes(lowerQuery) && !suggestions.includes(popular.query)) {
        suggestions.push(popular.query);
      }
    });

    // Add corrections that match
    searchCorrections.forEach(correction => {
      if (correction.original_query.toLowerCase().includes(lowerQuery) && !suggestions.includes(correction.corrected_query)) {
        suggestions.push(correction.corrected_query);
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [enableSuggestions, recentSearches, popularSearches, searchCorrections]);

  // Get suggested correction for a query
  const getSuggestedCorrection = useCallback((query: string): string | null => {
    if (!enableSuggestions || !query.trim()) return null;

    const lowerQuery = query.toLowerCase();
    
    // Find the best matching correction
    const bestMatch = searchCorrections.find(correction => 
      correction.original_query.toLowerCase() === lowerQuery && 
      correction.confidence_score > 0.7
    );

    return bestMatch ? bestMatch.corrected_query : null;
  }, [enableSuggestions, searchCorrections]);

  return {
    // State
    isLogging,
    currentLogId,
    recentSearches,
    popularSearches,
    searchCorrections,
    analytics,
    
    // Actions
    startSearchLog,
    completeSearchLog,
    logSearchClick,
    addSearchCorrection,
    
    // Utilities
    getSearchSuggestions,
    getSuggestedCorrection,
  };
};

export default useSearchLogging;















