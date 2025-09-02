// ===== SEARCH ANALYTICS SERVICE =====
// Integrates analytics tracking with the existing search system

import { supabase } from './supabase-client';
import { useAuthStore } from '../stores/auth';

// ===== TYPES =====

export interface SearchAnalyticsData {
  queryText: string;
  queryType: 'standard' | 'fuzzy' | 'hybrid' | 'vector';
  searchMode: 'standard' | 'fuzzy' | 'hybrid' | 'vector';
  resultsCount: number;
  executionTimeMs: number;
  cacheHit: boolean;
  searchSuccessful: boolean;
  errorMessage?: string | undefined;
  sessionId?: string;
}

export interface SearchClickData {
  logId: string;
  clickedResultId: string;
  clickedResultPosition: number;
  timeToClickMs: number;
}

export interface SearchPerformanceSummary {
  totalSearches: number;
  uniqueUsers: number;
  avgExecutionTimeMs: number;
  successRate: number;
  cacheHitRate: number;
  avgResultsPerSearch: number;
}

export interface TrendingSearch {
  queryText: string;
  searchCount: number;
  trendScore: number;
  successRate: number;
  avgResultsCount: number;
}

export interface SearchErrorSummary {
  errorType: string;
  errorCount: number;
  affectedUsers: number;
  isResolved: boolean;
  lastOccurrence: string;
}

export interface UserSearchInsights {
  totalSearches: number;
  successRate: number;
  preferredMode: string;
  avgQueryLength: number;
  clickThroughRate: number;
  lastSearchAt: string;
}

// ===== SEARCH ANALYTICS SERVICE =====

export class SearchAnalyticsService {
  private static instance: SearchAnalyticsService;
  private sessionId: string;
  private searchStartTimes: Map<string, number> = new Map();

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): SearchAnalyticsService {
    if (!SearchAnalyticsService.instance) {
      SearchAnalyticsService.instance = new SearchAnalyticsService();
    }
    return SearchAnalyticsService.instance;
  }

  // ===== SESSION MANAGEMENT =====

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  // ===== SEARCH TRACKING =====

  /**
   * Start tracking a search query
   * @param queryId Unique identifier for the search
   */
  public startSearchTracking(queryId: string): void {
    this.searchStartTimes.set(queryId, performance.now());
  }

  /**
   * Complete search tracking and log analytics
   * @param queryId Unique identifier for the search
   * @param analyticsData Search analytics data
   */
  public async completeSearchTracking(
    queryId: string, 
    analyticsData: Omit<SearchAnalyticsData, 'executionTimeMs'>
  ): Promise<string | null> {
    const startTime = this.searchStartTimes.get(queryId);
    if (!startTime) {
      console.warn('Search tracking not started for query:', queryId);
      return null;
    }

    const executionTimeMs = Math.round(performance.now() - startTime);
    this.searchStartTimes.delete(queryId);

    const fullAnalyticsData: SearchAnalyticsData = {
      ...analyticsData,
      executionTimeMs,
      sessionId: this.sessionId
    };

    try {
      const logId = await this.logSearchQuery(fullAnalyticsData);
      return logId;
    } catch (error) {
      console.error('Failed to log search analytics:', error);
      return null;
    }
  }

  /**
   * Log a search query to the analytics system
   */
  private async logSearchQuery(analyticsData: SearchAnalyticsData): Promise<string> {
    const authStore = useAuthStore.getState();
    const user = authStore.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Debug logging
    console.log('🔍 Analytics - Logging search query:', {
      queryText: analyticsData.queryText,
      queryType: analyticsData.queryType,
      searchMode: analyticsData.searchMode,
      resultsCount: analyticsData.resultsCount,
      executionTimeMs: analyticsData.executionTimeMs
    });

    const { data, error } = await supabase.rpc('log_search_query', {
      p_tenant_id: authStore.tenantId,
      p_user_id: user.id,
      p_session_id: analyticsData.sessionId || this.sessionId,
      p_query_text: analyticsData.queryText,
      p_query_type: analyticsData.queryType,
      p_search_mode: analyticsData.searchMode,
      p_results_count: analyticsData.resultsCount,
      p_execution_time_ms: analyticsData.executionTimeMs,
      p_cache_hit: analyticsData.cacheHit,
      p_search_successful: analyticsData.searchSuccessful,
      p_error_message: analyticsData.errorMessage || null,
      p_user_agent: navigator.userAgent,
      p_ip_address: null // Will be captured by backend if needed
    });

    if (error) {
      throw new Error(`Failed to log search query: ${error.message}`);
    }

    return data;
  }

  /**
   * Log a search result click
   */
  public async logSearchClick(clickData: SearchClickData): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_search_click', {
        p_log_id: clickData.logId,
        p_clicked_result_id: clickData.clickedResultId,
        p_clicked_result_position: clickData.clickedResultPosition,
        p_time_to_click_ms: clickData.timeToClickMs
      });

      if (error) {
        console.error('Failed to log search click:', error);
      }
    } catch (error) {
      console.error('Failed to log search click:', error);
    }
  }

  /**
   * Log a search error
   */
  public async logSearchError(
    errorType: string,
    errorMessage: string,
    queryText?: string,
    searchMode?: string
  ): Promise<string | null> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        console.warn('User not authenticated, cannot log search error');
        return null;
      }

      const { data, error } = await supabase.rpc('log_search_error', {
        p_tenant_id: authStore.tenantId,
        p_user_id: user.id,
        p_error_type: errorType,
        p_error_message: errorMessage,
        p_error_stack: new Error().stack || null,
        p_query_text: queryText || null,
        p_search_mode: searchMode || null,
        p_user_agent: navigator.userAgent,
        p_ip_address: null
      });

      if (error) {
        console.error('Failed to log search error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to log search error:', error);
      return null;
    }
  }

  // ===== ANALYTICS QUERIES =====

  /**
   * Get search performance summary
   */
  public async getSearchPerformanceSummary(daysBack: number = 30): Promise<SearchPerformanceSummary | null> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_search_performance_summary', {
        p_tenant_id: authStore.tenantId,
        p_days_back: daysBack
      });

      if (error) {
        throw new Error(`Failed to get performance summary: ${error.message}`);
      }

      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Failed to get search performance summary:', error);
      return null;
    }
  }

  /**
   * Get trending searches
   */
  public async getTrendingSearches(limit: number = 10): Promise<TrendingSearch[]> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_trending_searches', {
        p_tenant_id: authStore.tenantId,
        p_limit: limit
      });

      if (error) {
        throw new Error(`Failed to get trending searches: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get trending searches:', error);
      return [];
    }
  }

  /**
   * Get search error summary
   */
  public async getSearchErrorSummary(daysBack: number = 30): Promise<SearchErrorSummary[]> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_search_error_summary', {
        p_tenant_id: authStore.tenantId,
        p_days_back: daysBack
      });

      if (error) {
        throw new Error(`Failed to get error summary: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get search error summary:', error);
      return [];
    }
  }

  /**
   * Get user search behavior insights
   */
  public async getUserSearchInsights(): Promise<UserSearchInsights | null> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_user_search_insights', {
        p_tenant_id: authStore.tenantId,
        p_user_id: user.id
      });

      if (error) {
        throw new Error(`Failed to get user insights: ${error.message}`);
      }

      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Failed to get user search insights:', error);
      return null;
    }
  }

  // ===== INTEGRATION HELPERS =====

  /**
   * Create a unique query ID for tracking
   */
  public createQueryId(): string {
    return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track search performance metrics
   */
  public async trackSearchPerformance(
    queryId: string,
    searchMode: string,
    resultsCount: number,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    // Start tracking
    this.startSearchTracking(queryId);

    // Complete tracking after a short delay to ensure execution time is captured
    setTimeout(async () => {
      const analyticsData: Omit<SearchAnalyticsData, 'executionTimeMs'> = {
        queryText: queryId, // You might want to pass actual query text here
        queryType: 'hybrid', // Default, can be overridden
        searchMode: searchMode as any,
        resultsCount,
        cacheHit: false, // Default, can be enhanced with cache detection
        searchSuccessful: success,
        errorMessage,
        sessionId: this.sessionId
      };

      await this.completeSearchTracking(queryId, analyticsData);
    }, 100);
  }

  /**
   * Track search result clicks
   */
  public async trackSearchClick(
    logId: string,
    resultId: string,
    position: number,
    timeToClickMs: number
  ): Promise<void> {
    await this.logSearchClick({
      logId,
      clickedResultId: resultId,
      clickedResultPosition: position,
      timeToClickMs
    });
  }

  /**
   * Update popular searches table directly
   */
  public async updatePopularSearches(
    queryText: string,
    resultsCount: number,
    searchSuccessful: boolean
  ): Promise<void> {
    try {
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      if (!user) {
        console.warn('User not authenticated, cannot update popular searches');
        return;
      }

      // Insert or update popular searches
      const { error } = await supabase.rpc('update_popular_searches', {
        p_tenant_id: authStore.tenantId,
        p_query_text: queryText,
        p_results_count: resultsCount,
        p_search_successful: searchSuccessful
      });

      if (error) {
        console.error('Failed to update popular searches:', error);
      }
    } catch (error) {
      console.error('Error updating popular searches:', error);
    }
  }
}

// ===== EXPORT SINGLETON INSTANCE =====
export const searchAnalyticsService = SearchAnalyticsService.getInstance();

// ===== REACT HOOK FOR SEARCH ANALYTICS =====
// This can be used in components to easily track search analytics

export const useSearchAnalytics = () => {
  return {
    startSearchTracking: searchAnalyticsService.startSearchTracking.bind(searchAnalyticsService),
    completeSearchTracking: searchAnalyticsService.completeSearchTracking.bind(searchAnalyticsService),
    trackSearchPerformance: searchAnalyticsService.trackSearchPerformance.bind(searchAnalyticsService),
    trackSearchClick: searchAnalyticsService.trackSearchClick.bind(searchAnalyticsService),
    logSearchError: searchAnalyticsService.logSearchError.bind(searchAnalyticsService),
    getSearchPerformanceSummary: searchAnalyticsService.getSearchPerformanceSummary.bind(searchAnalyticsService),
    getTrendingSearches: searchAnalyticsService.getTrendingSearches.bind(searchAnalyticsService),
    getSearchErrorSummary: searchAnalyticsService.getSearchErrorSummary.bind(searchAnalyticsService),
    getUserSearchInsights: searchAnalyticsService.getUserSearchInsights.bind(searchAnalyticsService),
    createQueryId: searchAnalyticsService.createQueryId.bind(searchAnalyticsService),
    getSessionId: searchAnalyticsService.getSessionId.bind(searchAnalyticsService),
    updatePopularSearches: searchAnalyticsService.updatePopularSearches.bind(searchAnalyticsService)
  };
};
