// ============================================================================
// SEARCH LOGGING SERVICE
// ============================================================================
// Service for logging search queries and analytics

import { supabase } from './supabase-client';
import { useAuthStore } from '@/stores/auth';

// Types for search logging
export interface SearchLogEntry {
  id?: string;
  user_id?: string;
  tenant_id: string;
  query: string;
  results_count: number;
  time_taken_ms: number;
  clicked_record_id?: string;
  search_filters?: Record<string, any>;
  created_at?: string;
}

export interface SearchAnalytics {
  total_searches: number;
  avg_results_count: number;
  avg_time_taken_ms: number;
  most_common_queries: Array<{ query: string; count: number }>;
  zero_result_queries: Array<{ query: string; count: number }>;
  click_through_rate: number;
}

export interface SearchCorrection {
  id?: string;
  tenant_id: string;
  original_query: string;
  corrected_query: string;
  success_count: number;
  total_attempts: number;
  confidence_score: number;
  created_at?: string;
  updated_at?: string;
}

class SearchLoggingService {
  private getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  };

  private getTenantId = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get tenant ID from database
    const { data: tenantId, error } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: user.email
      });

    if (error) {
      throw new Error(`Failed to get tenant ID: ${error.message}`);
    }

    if (!tenantId) {
      throw new Error('No tenant ID found for user');
    }

    return tenantId;
  };

  /**
   * Log a search query
   */
  logSearch = async (params: {
    query: string;
    resultsCount: number;
    timeTakenMs: number;
    searchFilters?: Record<string, any>;
  }): Promise<string> => {
    try {
      const user = await this.getCurrentUser();
      const tenantId = await this.getTenantId();

      // Insert directly into search_logs table instead of using RPC
      const { data: logData, error } = await supabase
        .from('search_logs')
        .insert({
          user_id: user.id,
          tenant_id: tenantId,
          query: params.query,
          results_count: params.resultsCount,
          time_taken_ms: params.timeTakenMs,
          search_filters: params.searchFilters || null
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to log search:', error);
        throw error;
      }

      console.log('✅ Search logged:', { query: params.query, logId: logData.id });
      return logData.id;
    } catch (error) {
      console.error('Error logging search:', error);
      throw error;
    }
  };

  /**
   * Log a click on a search result
   */
  logClick = async (logId: string, recordId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('search_logs')
        .update({ clicked_record_id: recordId })
        .eq('id', logId);

      if (error) {
        console.error('Failed to log click:', error);
        throw error;
      }

      console.log('✅ Click logged:', { logId, recordId });
    } catch (error) {
      console.error('Error logging click:', error);
      throw error;
    }
  };

  /**
   * Get search analytics for the current tenant
   */
  getSearchAnalytics = async (daysBack: number = 30): Promise<SearchAnalytics> => {
    try {
      const tenantId = await this.getTenantId();
      const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      // Get basic stats
      const { data: statsData, error: statsError } = await supabase
        .from('search_logs')
        .select('results_count, time_taken_ms, clicked_record_id')
        .eq('tenant_id', tenantId)
        .gte('created_at', cutoffDate);

      if (statsError) {
        console.error('Failed to get search stats:', statsError);
        throw statsError;
      }

      // Get popular queries
      const { data: popularData, error: popularError } = await supabase
        .from('search_logs')
        .select('query')
        .eq('tenant_id', tenantId)
        .gte('created_at', cutoffDate);

      if (popularError) {
        console.error('Failed to get popular queries:', popularError);
        throw popularError;
      }

      // Calculate analytics
      const totalSearches = statsData.length;
      const avgResultsCount = totalSearches > 0 ? statsData.reduce((sum, log) => sum + log.results_count, 0) / totalSearches : 0;
      const avgTimeTakenMs = totalSearches > 0 ? statsData.reduce((sum, log) => sum + log.time_taken_ms, 0) / totalSearches : 0;
      const totalClicks = statsData.filter(log => log.clicked_record_id).length;
      const clickThroughRate = totalSearches > 0 ? totalClicks / totalSearches : 0;

      // Count query frequency
      const queryCounts: Record<string, number> = {};
      popularData.forEach(log => {
        queryCounts[log.query] = (queryCounts[log.query] || 0) + 1;
      });

      const mostCommonQueries = Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const zeroResultQueries = Object.entries(queryCounts)
        .filter(([query]) => {
          const queryLogs = popularData.filter(log => log.query === query);
          return queryLogs.every(log => log.results_count === 0);
        })
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        total_searches: totalSearches,
        avg_results_count: avgResultsCount,
        avg_time_taken_ms: avgTimeTakenMs,
        most_common_queries: mostCommonQueries,
        zero_result_queries: zeroResultQueries,
        click_through_rate: clickThroughRate
      };
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw error;
    }
  };

  /**
   * Get recent search queries for suggestions
   */
  getRecentSearches = async (limit: number = 10): Promise<string[]> => {
    try {
      const user = await this.getCurrentUser();
      const tenantId = await this.getTenantId();

      const { data, error } = await supabase
        .from('search_logs')
        .select('query')
        .eq('tenant_id', tenantId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to get recent searches:', error);
        throw error;
      }

      // Return unique queries
      const uniqueQueries = [...new Set(data.map(item => item.query))];
      return uniqueQueries;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  };

  /**
   * Get popular search queries for the tenant
   */
  getPopularSearches = async (limit: number = 10): Promise<Array<{ query: string; count: number }>> => {
    try {
      const tenantId = await this.getTenantId();

      const { data, error } = await supabase
        .from('search_logs')
        .select('query')
        .eq('tenant_id', tenantId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (error) {
        console.error('Failed to get popular searches:', error);
        throw error;
      }

      // Count query frequency
      const queryCounts: Record<string, number> = {};
      data.forEach(item => {
        queryCounts[item.query] = (queryCounts[item.query] || 0) + 1;
      });

      // Sort by count and return top queries
      return Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  };

  /**
   * Get search corrections for the tenant
   */
  getSearchCorrections = async (): Promise<SearchCorrection[]> => {
    try {
      const tenantId = await this.getTenantId();

      const { data, error } = await supabase
        .from('search_corrections')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('confidence_score', { ascending: false });

      if (error) {
        console.error('Failed to get search corrections:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting search corrections:', error);
      return [];
    }
  };

  /**
   * Add or update a search correction
   */
  addSearchCorrection = async (params: {
    originalQuery: string;
    correctedQuery: string;
    wasSuccessful: boolean;
  }): Promise<void> => {
    try {
      const tenantId = await this.getTenantId();

      // Check if correction already exists
      const { data: existing, error: fetchError } = await supabase
        .from('search_corrections')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('original_query', params.originalQuery)
        .eq('corrected_query', params.correctedQuery)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (existing) {
        // Update existing correction
        const { error: updateError } = await supabase
          .from('search_corrections')
          .update({
            total_attempts: existing.total_attempts + 1,
            success_count: existing.success_count + (params.wasSuccessful ? 1 : 0)
          })
          .eq('id', existing.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new correction
        const { error: insertError } = await supabase
          .from('search_corrections')
          .insert({
            tenant_id: tenantId,
            original_query: params.originalQuery,
            corrected_query: params.correctedQuery,
            total_attempts: 1,
            success_count: params.wasSuccessful ? 1 : 0
          });

        if (insertError) {
          throw insertError;
        }
      }

      console.log('✅ Search correction logged:', params);
    } catch (error) {
      console.error('Error adding search correction:', error);
      throw error;
    }
  };
}

// Export singleton instance
export const searchLoggingService = new SearchLoggingService();

// Export types
export type { SearchLogEntry, SearchAnalytics, SearchCorrection };
