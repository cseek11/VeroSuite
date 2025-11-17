// ============================================================================
// SEARCH INTEGRATION - Frontend Integration for Unified Search Service
// ============================================================================
// This file integrates the unified search service with existing frontend components
// and provides a seamless search experience across the CRM

import { unifiedSearchService } from './unified-search-service';
import { searchErrorLogger } from './search-error-logger';
import { supabase } from './supabase-client';
import type { SearchResult, SearchOptions } from './unified-search-service';
import { logger } from '@/utils/logger';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SearchIntegrationOptions extends SearchOptions {
  // Frontend-specific options
  debounceMs?: number;
  minSearchLength?: number;
  showLoadingState?: boolean;
  enableRealTimeSearch?: boolean;
}

export interface SearchIntegrationResult {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  totalResults: number;
  searchTime: number;
  lastSearched: Date;
}

export interface SearchIntegrationState {
  currentSearch: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchHistory: string[];
  recentSearches: SearchResult[];
  totalResults: number;
  searchTime: number;
  lastSearched: Date | null;
}

// ============================================================================
// SEARCH INTEGRATION CLASS
// ============================================================================

class SearchIntegration {
  private state: SearchIntegrationState = {
    currentSearch: '',
    results: [],
    loading: false,
    error: null,
    searchHistory: [],
    recentSearches: [],
    totalResults: 0,
    searchTime: 0,
    lastSearched: null
  };

  private debounceTimer: NodeJS.Timeout | null = null;
  private subscribers: Set<(state: SearchIntegrationState) => void> = new Set();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Subscribe to search state changes
   */
  subscribe(callback: (state: SearchIntegrationState) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Get current search state
   */
  getState(): SearchIntegrationState {
    return { ...this.state };
  }

  /**
   * Update state and notify subscribers
   */
  private updateState(updates: Partial<SearchIntegrationState>): void {
    this.state = { ...this.state, ...updates };
    this.subscribers.forEach(callback => callback(this.state));
  }

  // ============================================================================
  // SEARCH OPERATIONS
  // ============================================================================

  /**
   * Perform search with debouncing and error handling
   */
  async search(
    searchTerm: string, 
    options: SearchIntegrationOptions = {}
  ): Promise<SearchIntegrationResult> {
    const {
      debounceMs = 300,
      minSearchLength = 1,
      showLoadingState = true,
      enableRealTimeSearch = true,
      ...searchOptions
    } = options;

    // Clear previous debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Update current search term
    this.updateState({ currentSearch: searchTerm });

    // Handle empty search
    if (!searchTerm || searchTerm.trim().length < minSearchLength) {
      this.updateState({
        results: [],
        loading: false,
        error: null,
        totalResults: 0,
        searchTime: 0
      });
      return this.getSearchResult();
    }

    // Show loading state
    if (showLoadingState) {
      this.updateState({ loading: true, error: null });
    }

    // Debounce search for real-time search
    if (enableRealTimeSearch && debounceMs > 0) {
      return new Promise((resolve) => {
        this.debounceTimer = setTimeout(async () => {
          const result = await this.performSearch(searchTerm, searchOptions);
          resolve(result);
        }, debounceMs);
      });
    }

    // Immediate search
    return this.performSearch(searchTerm, searchOptions);
  }

  /**
   * Perform the actual search operation
   */
  private async performSearch(
    searchTerm: string, 
    options: SearchOptions = {}
  ): Promise<SearchIntegrationResult> {
    const startTime = Date.now();

    try {
      // Perform search using unified search service
      const results = await unifiedSearchService.search(searchTerm, options);
      const searchTime = Date.now() - startTime;

      // Update state with results
      this.updateState({
        results,
        loading: false,
        error: null,
        totalResults: results.length,
        searchTime,
        lastSearched: new Date()
      });

      // Add to search history
      this.addToSearchHistory(searchTerm);

      // Log successful search
      await searchErrorLogger.logSuccess('search', searchTerm, results.length, searchTime, {
        tenantId: await this.getCurrentTenantId(),
        userId: await this.getCurrentUserId()
      });

      return this.getSearchResult();

    } catch (error: unknown) {
      const searchTime = Date.now() - startTime;
      
      // Log search error
      await searchErrorLogger.logError(error, {
        operation: 'search',
        query: searchTerm,
        tenantId: await this.getCurrentTenantId(),
        userId: await this.getCurrentUserId()
      }, 'medium');

      // Update state with error
      this.updateState({
        results: [],
        loading: false,
        error: error.message || 'Search failed',
        totalResults: 0,
        searchTime,
        lastSearched: new Date()
      });

      return this.getSearchResult();
    }
  }

  /**
   * Get search result in the expected format
   */
  private getSearchResult(): SearchIntegrationResult {
    return {
      results: this.state.results,
      loading: this.state.loading,
      error: this.state.error,
      searchTerm: this.state.currentSearch,
      totalResults: this.state.totalResults,
      searchTime: this.state.searchTime,
      lastSearched: this.state.lastSearched || new Date()
    };
  }

  // ============================================================================
  // SEARCH HISTORY MANAGEMENT
  // ============================================================================

  /**
   * Add search term to history
   */
  private addToSearchHistory(searchTerm: string): void {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    const history = this.state.searchHistory.filter(term => term !== trimmedTerm);
    history.unshift(trimmedTerm);
    
    // Keep only last 10 searches
    const limitedHistory = history.slice(0, 10);
    
    this.updateState({ searchHistory: limitedHistory });
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.updateState({ searchHistory: [] });
  }

  /**
   * Get search history
   */
  getSearchHistory(): string[] {
    return [...this.state.searchHistory];
  }

  // ============================================================================
  // RECENT SEARCHES MANAGEMENT
  // ============================================================================

  /**
   * Add result to recent searches
   */
  addToRecentSearches(result: SearchResult): void {
    const recent = this.state.recentSearches.filter(r => r.id !== result.id);
    recent.unshift(result);
    
    // Keep only last 20 recent searches
    const limitedRecent = recent.slice(0, 20);
    
    this.updateState({ recentSearches: limitedRecent });
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    this.updateState({ recentSearches: [] });
  }

  /**
   * Get recent searches
   */
  getRecentSearches(): SearchResult[] {
    return [...this.state.recentSearches];
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current tenant ID
   */
  private async getCurrentTenantId(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.user_metadata?.tenant_id || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    } catch {
      return '7193113e-ece2-4f7b-ae8c-176df4367e28';
    }
  }

  /**
   * Get current user ID
   */
  private async getCurrentUserId(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  /**
   * Clear all search state
   */
  clearAll(): void {
    this.updateState({
      currentSearch: '',
      results: [],
      loading: false,
      error: null,
      totalResults: 0,
      searchTime: 0,
      lastSearched: null
    });
  }

  /**
   * Refresh current search results
   */
  async refreshCurrentSearch(): Promise<void> {
    if (this.state.currentSearch.trim()) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Refreshing current search', { searchTerm: this.state.currentSearch }, 'search-integration');
      }
      await this.performSearch(this.state.currentSearch);
    }
  }

  /**
   * Cancel any pending search
   */
  cancelSearch(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    this.updateState({ loading: false });
  }
}

// ============================================================================
// REACT HOOKS
// ============================================================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * React hook for search integration
 */
export function useSearchIntegration(options: SearchIntegrationOptions = {}) {
  const [state, setState] = useState<SearchIntegrationState>(searchIntegration.getState());
  const searchIntegrationRef = useRef(searchIntegration);
  
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [
    options.debounceMs,
    options.minSearchLength,
    options.showLoadingState,
    options.enableRealTimeSearch,
    options.includeFields,
    options.excludeFields,
    options.limit,
    options.offset,
    options.sortBy,
    options.sortOrder,
    options.filters
  ]);

  useEffect(() => {
    const unsubscribe = searchIntegrationRef.current.subscribe(setState);
    return unsubscribe;
  }, []);

  const search = useCallback(
    (searchTerm: string, searchOptions?: SearchOptions) => {
      return searchIntegrationRef.current.search(searchTerm, { ...memoizedOptions, ...searchOptions });
    },
    [memoizedOptions]
  );

  const clearAll = useCallback(() => {
    searchIntegrationRef.current.clearAll();
  }, []);

  const cancelSearch = useCallback(() => {
    searchIntegrationRef.current.cancelSearch();
  }, []);

  const addToRecentSearches = useCallback((result: SearchResult) => {
    searchIntegrationRef.current.addToRecentSearches(result);
  }, []);

  const clearSearchHistory = useCallback(() => {
    searchIntegrationRef.current.clearSearchHistory();
  }, []);

  const clearRecentSearches = useCallback(() => {
    searchIntegrationRef.current.clearRecentSearches();
  }, []);

  const refreshCurrentSearch = useCallback(() => {
    return searchIntegrationRef.current.refreshCurrentSearch();
  }, []);

  return {
    ...state,
    search,
    clearAll,
    cancelSearch,
    addToRecentSearches,
    clearSearchHistory,
    clearRecentSearches,
    refreshCurrentSearch,
    getSearchHistory: searchIntegrationRef.current.getSearchHistory.bind(searchIntegrationRef.current),
    getRecentSearches: searchIntegrationRef.current.getRecentSearches.bind(searchIntegrationRef.current)
  };
}

// ============================================================================
// COMPONENT INTEGRATION HELPERS
// ============================================================================

/**
 * Create search input props for form integration
 */
export function createSearchInputProps(
  onSearch: (searchTerm: string) => void,
  options: SearchIntegrationOptions = {}
) {
  return {
    placeholder: 'Search customers...',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch(e.currentTarget.value);
      }
    },
    ...options
  };
}

/**
 * Create search result props for component integration
 */
export function createSearchResultProps(result: SearchResult) {
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    address: result.address,
    type: result.type,
    status: result.status,
    score: result.score,
    matchedFields: result.matchedFields
  };
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const searchIntegration = new SearchIntegration();
export default searchIntegration;
