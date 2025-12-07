// ============================================================================
// UNIFIED SEARCH SERVICE
// ============================================================================
// Single, reliable search implementation with comprehensive error handling

import { supabase } from './supabase-client';
import { searchErrorLogger } from './search-error-logger';
import type { SearchFilters, Account } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

export interface SearchResult {
  data: Account[];
  totalCount: number;
  executionTimeMs: number;
  searchMethod: 'enhanced' | 'multi_word' | 'fuzzy' | 'fallback';
  error?: string;
}

export interface SearchOptions {
  maxResults?: number;
  enableFuzzy?: boolean;
  enableMultiWord?: boolean;
  timeoutMs?: number;
}

class UnifiedSearchService {
  private defaultOptions: Required<SearchOptions> = {
    maxResults: 50,
    enableFuzzy: true,
    enableMultiWord: true,
    timeoutMs: 5000
  };

  /**
   * Main search method - tries multiple search strategies
   */
  async searchCustomers(
    query: string,
    _filters?: SearchFilters,
    options?: SearchOptions
  ): Promise<SearchResult> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };
    const searchQuery = query.trim();

    try {
      // Get tenant ID
      const tenantId = await this.getTenantId();
      
      // If no query, return all customers
      if (!searchQuery) {
        return await this.getAllCustomers(tenantId, opts.maxResults);
      }

      // Try different search methods in order of preference
      const searchMethods = this.getSearchMethods(opts);
      
      for (const method of searchMethods) {
        try {
          const result = await this.executeSearchMethod(
            method,
            searchQuery,
            tenantId,
            opts.maxResults
          );
          
          if (result.data.length > 0) {
            const executionTime = Date.now() - startTime;
            
            // Log success
            await searchErrorLogger.logSuccess(
              'search_customers',
              searchQuery,
              result.data.length,
              executionTime,
              { tenantId }
            );
            
            return {
              ...result,
              executionTimeMs: executionTime,
              searchMethod: method
            };
          }
        } catch (methodError: unknown) {
          logger.warn('Search method failed', { method, error: methodError }, 'unified-search-service');
          await searchErrorLogger.logError(
            methodError as Error,
            {
              operation: `search_${method}`,
              query: searchQuery,
              tenantId
            },
            'low'
          );
        }
      }

      // If all methods fail, return empty result
      return {
        data: [],
        totalCount: 0,
        executionTimeMs: Date.now() - startTime,
        searchMethod: 'fallback'
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      await searchErrorLogger.logError(
        error as Error,
        {
          operation: 'search_customers',
          query: searchQuery,
          tenantId: await this.getTenantId().catch(() => 'unknown')
        },
        'high'
      );

      return {
        data: [],
        totalCount: 0,
        executionTimeMs: executionTime,
        searchMethod: 'fallback',
        error: (error as Error).message
      };
    }
  }

  /**
   * Get all customers (no search query)
   */
  private async getAllCustomers(tenantId: string, limit: number): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name')
        .limit(limit);

      if (error) throw error;

      return {
        data: data || [],
        totalCount: data?.length || 0,
        executionTimeMs: Date.now() - startTime,
        searchMethod: 'enhanced'
      };
    } catch (error) {
      throw new Error(`Failed to get all customers: ${(error as Error).message}`);
    }
  }

  /**
   * Execute specific search method
   */
  private async executeSearchMethod(
    method: SearchResult['searchMethod'],
    query: string,
    tenantId: string,
    limit: number
  ): Promise<Omit<SearchResult, 'searchMethod' | 'executionTimeMs'>> {
    switch (method) {
      case 'enhanced':
        return await this.searchEnhanced(query, tenantId, limit);
      
      case 'multi_word':
        return await this.searchMultiWord(query, tenantId, limit);
      
      case 'fuzzy':
        return await this.searchFuzzy(query, tenantId, limit);
      
      case 'fallback':
        return await this.searchFallback(query, tenantId, limit);
      
      default:
        throw new Error(`Unknown search method: ${method}`);
    }
  }

  /**
   * Enhanced search using search_customers_enhanced function
   */
  private async searchEnhanced(
    query: string,
    tenantId: string,
    limit: number
  ): Promise<Omit<SearchResult, 'searchMethod' | 'executionTimeMs'>> {
    const { data, error } = await supabase.rpc('search_customers_enhanced', {
      p_search_term: query,
      p_tenant_id: tenantId,
      p_limit: limit,
      p_offset: 0
    });

    if (error) throw error;

    return {
      data: data || [],
      totalCount: data?.length || 0
    };
  }

  /**
   * Multi-word search using search_customers_multi_word function
   */
  private async searchMultiWord(
    query: string,
    tenantId: string,
    limit: number
  ): Promise<Omit<SearchResult, 'searchMethod' | 'executionTimeMs'>> {
    const { data, error } = await supabase.rpc('search_customers_multi_word', {
      p_search_term: query,
      p_tenant_id: tenantId,
      p_limit: limit,
      p_offset: 0
    });

    if (error) throw error;

    return {
      data: data || [],
      totalCount: data?.length || 0
    };
  }

  /**
   * Fuzzy search using search_customers_fuzzy function
   */
  private async searchFuzzy(
    query: string,
    tenantId: string,
    limit: number
  ): Promise<Omit<SearchResult, 'searchMethod' | 'executionTimeMs'>> {
    const { data, error } = await supabase.rpc('search_customers_fuzzy', {
      p_tenant_id: tenantId,
      p_query: query,
      p_threshold: 0.3,
      p_limit: limit
    });

    if (error) throw error;

    return {
      data: data || [],
      totalCount: data?.length || 0
    };
  }

  /**
   * Fallback search using direct Supabase queries
   */
  private async searchFallback(
    query: string,
    tenantId: string,
    limit: number
  ): Promise<Omit<SearchResult, 'searchMethod' | 'executionTimeMs'>> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name')
      .limit(limit);

    if (error) throw error;

    return {
      data: data || [],
      totalCount: data?.length || 0
    };
  }

  /**
   * Get search methods in order of preference
   */
  private getSearchMethods(options: Required<SearchOptions>): SearchResult['searchMethod'][] {
    const methods: SearchResult['searchMethod'][] = ['enhanced'];
    
    if (options.enableMultiWord) {
      methods.push('multi_word');
    }
    
    if (options.enableFuzzy) {
      methods.push('fuzzy');
    }
    
    methods.push('fallback');
    
    return methods;
  }

  /**
   * Get tenant ID with fallback
   */
  private async getTenantId(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get from user metadata first
        const tenantIdFromMetadata = user.user_metadata?.tenant_id;
        if (tenantIdFromMetadata) {
          return tenantIdFromMetadata;
        }
        
        // Try to get from database
        try {
          const { data: validTenantId } = await supabase.rpc('get_user_tenant_id', {
            user_email: user.email
          });
          
          if (validTenantId) {
            return validTenantId;
          }
        } catch (dbError: unknown) {
          logger.warn('Failed to get tenant ID from database', { error: dbError }, 'unified-search-service');
        }
      }
      
      // Fallback to development tenant ID
      return '7193113e-ece2-4f7b-ae8c-176df4367e28';
      
    } catch (error: unknown) {
      logger.error('Error getting tenant ID', error, 'unified-search-service');
      return '7193113e-ece2-4f7b-ae8c-176df4367e28';
    }
  }

  /**
   * Get search performance statistics
   */
  async getSearchStats(): Promise<{
    totalSearches: number;
    avgExecutionTime: number;
    errorRate: number;
    methodDistribution: Record<string, number>;
  }> {
    try {
      const stats = searchErrorLogger.getErrorStats();
      
      return {
        totalSearches: stats.total,
        avgExecutionTime: 0, // Would need to track this separately
        errorRate: stats.total > 0 ? (stats.unresolved / stats.total) * 100 : 0,
        methodDistribution: stats.byType
      };
    } catch (error: unknown) {
      logger.error('Failed to get search stats', error, 'unified-search-service');
      return {
        totalSearches: 0,
        avgExecutionTime: 0,
        errorRate: 0,
        methodDistribution: {}
      };
    }
  }

  /**
   * Clear search cache (if implemented)
   */
  async clearCache(): Promise<void> {
    // Placeholder for cache clearing
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Search cache cleared', {}, 'unified-search-service');
    }
  }
}

// Export singleton instance
export const unifiedSearchService = new UnifiedSearchService();
