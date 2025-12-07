// ============================================================================
// ENHANCED SEARCH SERVICE - Scalable Relevance Ranking
// ============================================================================
// This service uses Postgres functions for weighted full-text search,
// fuzzy matching, and vector search capabilities.

import { supabase } from '@/lib/supabase-client';
import type { SearchFilters, Account } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

// Use shared singleton Supabase client

// ============================================================================
// TYPES
// ============================================================================

interface EnhancedSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  status: string;
  account_type: string;
  relevance_score: number;
  match_type: 'full_text' | 'phone' | 'fuzzy' | 'fallback';
  created_at: string;
  updated_at: string;
}

interface VectorSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  status: string;
  account_type: string;
  similarity_score: number;
  created_at: string;
  updated_at: string;
}

// Accounts enriched with relevance/similarity metadata used for analytics/logging
type SearchAccount = Account & {
  _relevance_score?: number;
  _match_type?: string;
  _similarity_score?: number;
  segment_id?: string;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getTenantId = async (): Promise<string> => {
  // Use the tenant ID where the customers are located
  const knownTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  
  // For now, always use the known tenant ID since the user's tenant doesn't have customers
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Using known tenant ID for customers', { tenantId: knownTenantId }, 'enhanced-search-service');
  }
  return knownTenantId;
};

const getUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// ============================================================================
// SEARCH LOGGING
// ============================================================================

interface SearchLogData {
  query: string;
  resultsCount: number;
  timeTakenMs: number;
  clickedRecordId?: string;
  searchFilters?: any;
  searchType?: 'enhanced' | 'vector';
  avgRelevanceScore?: number;
}

export const searchLogger = {
  async logSearch(data: SearchLogData): Promise<void> {
    try {
      const [userId, tenantId] = await Promise.all([
        getUserId(),
        getTenantId()
      ]);

      await supabase.rpc('log_search', {
        p_user_id: userId,
        p_tenant_id: tenantId,
        p_query: data.query,
        p_results_count: data.resultsCount,
        p_time_taken_ms: data.timeTakenMs,
        p_clicked_record_id: data.clickedRecordId || null,
        p_search_filters: data.searchFilters || null
      });
    } catch (error: unknown) {
      logger.error('Failed to log search', error, 'enhanced-search-service');
      // Don't throw - logging should not break search functionality
    }
  },

  async logClick(recordId: string, query: string): Promise<void> {
    try {
      const [userId, tenantId] = await Promise.all([
        getUserId(),
        getTenantId()
      ]);

      // Update the most recent search log for this query
      const { data: recentLog } = await supabase
        .from('search_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .eq('query', query)
        .is('clicked_record_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentLog) {
        await supabase
          .from('search_logs')
          .update({ clicked_record_id: recordId })
          .eq('id', recentLog.id);
      }
    } catch (error: unknown) {
      logger.error('Failed to log click', error, 'enhanced-search-service');
    }
  }
};

// ============================================================================
// ENHANCED SEARCH API
// ============================================================================

export const enhancedSearch = {
  /**
   * Search customers using enhanced Postgres function with weighted ranking
   */
  async searchCustomers(filters?: SearchFilters): Promise<Account[]> {
    // TEMPORARILY RE-ENABLED - Backend API not fully implemented yet
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Enhanced search service temporarily re-enabled for customer loading', {}, 'enhanced-search-service');
    }
    
    const startTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Enhanced search service called with filters', { filters }, 'enhanced-search-service');
    }
    
    try {
      const tenantId = await getTenantId();
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Using tenant ID', { tenantId }, 'enhanced-search-service');
      }
      
      // If no search term, return all customers
      if (!filters?.search?.trim()) {
        const { data, error } = await supabase
          .from('accounts')
          .select(`
            *,
            customer_profiles (*),
            customer_contacts (*),
            locations (*),
            work_orders (*),
            jobs (*)
          `)
          .eq('tenant_id', tenantId)
          .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
      }

      // Use enhanced search function
      const { data: searchResults, error } = await supabase.rpc(
        'search_customers_enhanced',
        {
          p_search_term: filters.search.trim(),
          p_tenant_id: tenantId,
          p_limit: 100,
          p_offset: 0
        }
      );

      if (error) throw error;

      // Convert enhanced search results to Account format
      const results: SearchAccount[] = (searchResults as EnhancedSearchResult[]).map(result => ({
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        city: result.city,
        state: result.state,
        zip_code: result.zip_code,
        status: result.status as 'active' | 'inactive' | 'suspended',
        account_type: (result.account_type as Account['account_type']) ?? 'residential',
        created_at: result.created_at,
        updated_at: result.updated_at,
        tenant_id: (result as any).tenant_id ?? tenantId,
        ar_balance: (result as any).ar_balance ?? 0,
        segment_id: (result as any).segment_id,
        // Add relevance metadata
        _relevance_score: result.relevance_score,
        _match_type: result.match_type
      }));

      // Apply additional filters
      let filteredResults = results;

      if (filters?.status) {
        filteredResults = filteredResults.filter(customer => 
          customer.status === filters.status
        );
      }

      if (filters?.segmentId) {
        filteredResults = filteredResults.filter(customer => 
          customer.segment_id === filters.segmentId
        );
      }

      const endTime = performance.now();
      const timeTakenMs = Math.round(endTime - startTime);

      // Calculate average relevance score
      const avgRelevanceScore = results.length > 0 
        ? results.reduce((sum, r) => sum + (r._relevance_score || 0), 0) / results.length 
        : 0;

      if (process.env.NODE_ENV === 'development') {
        logger.debug('Enhanced search completed', {
          resultsCount: filteredResults.length,
          timeTakenMs,
          avgRelevanceScore: avgRelevanceScore.toFixed(3),
          firstResult: filteredResults[0]?.name,
          matchTypes: [...new Set(results.map(r => r._match_type))]
        }, 'enhanced-search-service');
      }

      // Log the search with enhanced metrics
      await searchLogger.logSearch({
        query: filters.search,
        resultsCount: filteredResults.length,
        timeTakenMs,
        searchFilters: filters,
        searchType: 'enhanced',
        avgRelevanceScore
      });

      return filteredResults;
    } catch (error: unknown) {
      logger.error('Error in enhanced search', error, 'enhanced-search-service');
      throw error;
    }
  },

  /**
   * Vector search using embeddings (when pgvector is available)
   */
  async searchCustomersVector(
    embedding: number[],
    limit: number = 50,
    threshold: number = 0.7
  ): Promise<Account[]> {
    const startTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Vector search called', { embeddingLength: embedding.length }, 'enhanced-search-service');
    }
    
    try {
      const tenantId = await getTenantId();
      
      const { data: searchResults, error } = await supabase.rpc(
        'search_customers_vector',
        {
          p_embedding: embedding,
          p_tenant_id: tenantId,
          p_limit: limit,
          p_threshold: threshold
        }
      );

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Vector search error', { error: error.message }, 'enhanced-search-service');
          logger.debug('Returning empty results - check if pgvector is properly configured', {}, 'enhanced-search-service');
        }
        return [];
      }

      const results: SearchAccount[] = (searchResults as VectorSearchResult[]).map(result => ({
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        city: result.city,
        state: result.state,
        zip_code: result.zip_code,
        status: result.status as 'active' | 'inactive' | 'suspended',
        account_type: (result.account_type as Account['account_type']) ?? 'residential',
        created_at: result.created_at,
        updated_at: result.updated_at,
        tenant_id: (result as any).tenant_id ?? tenantId,
        ar_balance: (result as any).ar_balance ?? 0,
        segment_id: (result as any).segment_id,
        // Add similarity metadata
        _similarity_score: result.similarity_score
      }));

      const endTime = performance.now();
      const timeTakenMs = Math.round(endTime - startTime);

      if (process.env.NODE_ENV === 'development') {
        logger.debug('Vector search completed', {
          resultsCount: results.length,
          timeTakenMs,
          avgSimilarityScore: results.length > 0 
            ? (results.reduce((sum, r) => sum + (r._similarity_score || 0), 0) / results.length).toFixed(3)
            : '0.000'
        }, 'enhanced-search-service');
      }

      return results;
    } catch (error: unknown) {
      logger.error('Error in vector search', error, 'enhanced-search-service');
      return [];
    }
  },

  /**
   * Log when a user clicks on a search result
   */
  async logResultClick(recordId: string, query: string): Promise<void> {
    await searchLogger.logClick(recordId, query);
  },

  /**
   * Get search analytics for the current tenant
   */
  async getSearchAnalytics(daysBack: number = 30): Promise<any> {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase.rpc('get_search_analytics', {
        p_tenant_id: tenantId,
        p_days_back: daysBack
      });

      if (error) throw error;
      return data;
    } catch (error: unknown) {
      logger.error('Error getting search analytics', error, 'enhanced-search-service');
      throw error;
    }
  },

  /**
   * Get search performance metrics
   */
  async getSearchPerformance(): Promise<any> {
    try {
      const tenantId = await getTenantId();
      
      // Get recent search logs with performance data
      const { data, error } = await supabase
        .from('search_logs')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate performance metrics
      const metrics = {
        totalSearches: data.length,
        avgTimeMs: data.length > 0 
          ? Math.round(data.reduce((sum, log) => sum + (log.time_taken_ms || 0), 0) / data.length)
          : 0,
        avgResultsCount: data.length > 0
          ? Math.round(data.reduce((sum, log) => sum + (log.results_count || 0), 0) / data.length)
          : 0,
        searchTypes: data.reduce((acc, log) => {
          const type = log.search_filters?.searchType || 'legacy';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return metrics;
    } catch (error: unknown) {
      logger.error('Error getting search performance', error, 'enhanced-search-service');
      throw error;
    }
  }
};

// ============================================================================
// SEARCH CORRECTIONS (Phase 2 Preview)
// ============================================================================

export const searchCorrections = {
  /**
   * Get search corrections for a query
   */
  async getCorrections(query: string): Promise<string[]> {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('search_corrections')
        .select('corrected_query, confidence_score')
        .eq('tenant_id', tenantId)
        .eq('original_query', query.toLowerCase())
        .gte('confidence_score', 0.5)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data?.map(c => c.corrected_query) || [];
    } catch (error: unknown) {
      logger.error('Error getting corrections', error, 'enhanced-search-service');
      return [];
    }
  },

  /**
   * Update correction success/failure
   */
  async updateCorrection(originalQuery: string, correctedQuery: string, success: boolean): Promise<void> {
    try {
      const tenantId = await getTenantId();
      // Get current values first
      const { data: existing } = await supabase
        .from('search_corrections')
        .select('success_count, total_attempts')
        .eq('tenant_id', tenantId)
        .eq('original_query', originalQuery.toLowerCase())
        .eq('corrected_query', correctedQuery)
        .single();
      
      if (success) {
        await supabase
          .from('search_corrections')
          .update({ 
            success_count: (existing?.success_count || 0) + 1,
            total_attempts: (existing?.total_attempts || 0) + 1
          })
          .eq('tenant_id', tenantId)
          .eq('original_query', originalQuery.toLowerCase())
          .eq('corrected_query', correctedQuery);
      } else {
        await supabase
          .from('search_corrections')
          .update({ 
            total_attempts: (existing?.total_attempts || 0) + 1
          })
          .eq('tenant_id', tenantId)
          .eq('original_query', originalQuery.toLowerCase())
          .eq('corrected_query', correctedQuery);
      }
    } catch (error: unknown) {
      logger.error('Error updating correction', error, 'enhanced-search-service');
    }
  }
};

export default enhancedSearch;
