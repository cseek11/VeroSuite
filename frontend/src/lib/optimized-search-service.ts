// ============================================================================
// OPTIMIZED SEARCH SERVICE
// ============================================================================
// High-performance search service with advanced features:
// - Smart search strategy selection
// - Typo tolerance and auto-correction
// - Result caching
// - Performance monitoring

import { supabase } from './supabase-client';
import { useAuthStore } from '@/stores/auth';

export interface OptimizedSearchResult {
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
  match_type: 'exact' | 'prefix' | 'partial' | 'phone' | 'email' | 'fuzzy' | 'typo_tolerance' | 'variation_match';
  suggested_correction?: string;
  typo_confidence?: number;
  created_at: string;
  updated_at: string;
}

export interface SearchOptions {
  // Performance options
  enableFuzzySearch?: boolean;
  enableTypoTolerance?: boolean;
  maxResults?: number;
  offset?: number;
  
  // Relevance options
  fuzzyThreshold?: number;
  typoTolerance?: number;
  
  // Caching options
  useCache?: boolean;
  cacheTimeout?: number;
}

export interface SearchPerformanceMetrics {
  totalTime: number;
  databaseTime: number;
  cacheHit: boolean;
  resultCount: number;
  searchStrategy: string;
  correctionSuggested: boolean;
}

class OptimizedSearchService {
  private cache = new Map<string, { results: OptimizedSearchResult[]; timestamp: number; metrics: SearchPerformanceMetrics }>();
  private defaultCacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Main search function with intelligent strategy selection
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<{
    results: OptimizedSearchResult[];
    metrics: SearchPerformanceMetrics;
    suggestion?: string;
  }> {
    const startTime = performance.now();
    const tenantId = await this.getTenantId();
    
    const {
      enableFuzzySearch = true,
      enableTypoTolerance = true,
      maxResults = 50,
      offset = 0,
      fuzzyThreshold = 0.3,
      typoTolerance = 0.7,
      useCache = true,
      cacheTimeout = this.defaultCacheTimeout
    } = options;

    // Check cache first
    if (useCache) {
      const cached = this.getCachedResults(query, options);
      if (cached) {
        return {
          results: cached.results,
          metrics: { ...cached.metrics, totalTime: performance.now() - startTime },
          suggestion: cached.results[0]?.suggested_correction
        };
      }
    }

    let results: OptimizedSearchResult[] = [];
    let searchStrategy = 'unknown';
    let correctionSuggested = false;
    const dbStartTime = performance.now();

    try {
      // Strategy 1: Fast search for most queries
      if (query.length >= 2) {
        results = await this.executeSmartSearch(query, tenantId, maxResults, offset);
        searchStrategy = 'smart';
        
        // Strategy 2: If few results and fuzzy search enabled, try fuzzy
        if (results.length < 3 && enableFuzzySearch && query.length >= 3) {
          const fuzzyResults = await this.executeFuzzySearch(query, tenantId, fuzzyThreshold, Math.max(5, maxResults - results.length));
          results = this.mergeResults(results, fuzzyResults);
          searchStrategy = 'smart+fuzzy';
        }
        
        // Strategy 3: If still few results and typo tolerance enabled, try typo correction
        if (results.length < 3 && enableTypoTolerance && query.length >= 3) {
          const typoResults = await this.executeTypoTolerantSearch(query, tenantId, typoTolerance, Math.max(5, maxResults - results.length));
          
          // Check if we got a correction suggestion
          if (typoResults.length > 0 && typoResults[0].suggested_correction) {
            correctionSuggested = true;
          }
          
          results = this.mergeResults(results, typoResults);
          searchStrategy = 'smart+fuzzy+typo';
        }
      }

      const databaseTime = performance.now() - dbStartTime;
      const totalTime = performance.now() - startTime;

      const metrics: SearchPerformanceMetrics = {
        totalTime,
        databaseTime,
        cacheHit: false,
        resultCount: results.length,
        searchStrategy,
        correctionSuggested
      };

      // Cache the results
      if (useCache && results.length > 0) {
        this.cacheResults(query, options, results, metrics, cacheTimeout);
      }

      return {
        results: results.slice(0, maxResults),
        metrics,
        suggestion: results.find(r => r.suggested_correction)?.suggested_correction
      };

    } catch (error) {
      console.error('Search failed:', error);
      return {
        results: [],
        metrics: {
          totalTime: performance.now() - startTime,
          databaseTime: performance.now() - dbStartTime,
          cacheHit: false,
          resultCount: 0,
          searchStrategy: 'error',
          correctionSuggested: false
        }
      };
    }
  }

  /**
   * Fast search using optimized function
   */
  private async executeSmartSearch(
    query: string,
    tenantId: string,
    limit: number,
    offset: number
  ): Promise<OptimizedSearchResult[]> {
    const { data, error } = await supabase
      .rpc('search_customers_smart', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: limit,
        p_offset: offset
      });

    if (error) {
      console.error('Smart search failed:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fuzzy search for broader matching
   */
  private async executeFuzzySearch(
    query: string,
    tenantId: string,
    threshold: number,
    limit: number
  ): Promise<OptimizedSearchResult[]> {
    const { data, error } = await supabase
      .rpc('search_customers_fuzzy', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_similarity_threshold: threshold,
        p_limit: limit
      });

    if (error) {
      console.error('Fuzzy search failed:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Typo-tolerant search with auto-correction
   */
  private async executeTypoTolerantSearch(
    query: string,
    tenantId: string,
    tolerance: number,
    limit: number
  ): Promise<OptimizedSearchResult[]> {
    const { data, error } = await supabase
      .rpc('search_customers_with_autocorrect', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: limit,
        p_offset: 0
      });

    if (error) {
      console.error('Typo-tolerant search failed:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Learn from user corrections
   */
  async learnCorrection(original: string, corrected: string, accepted: boolean = true): Promise<void> {
    try {
      const tenantId = await this.getTenantId();
      
      await supabase.rpc('learn_typo_correction', {
        p_tenant_id: tenantId,
        p_original: original,
        p_corrected: corrected,
        p_accepted: accepted
      });

      console.log('Learned correction:', { original, corrected, accepted });
    } catch (error) {
      console.error('Failed to learn correction:', error);
    }
  }

  /**
   * Get search suggestions based on query
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const tenantId = await this.getTenantId();
      
      // Get suggestions from typo corrections table
      const { data, error } = await supabase
        .from('search_typo_corrections')
        .select('corrected_query, frequency')
        .eq('tenant_id', tenantId)
        .ilike('original_query', `%${query.toLowerCase()}%`)
        .eq('user_accepted', true)
        .order('frequency', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to get suggestions:', error);
        return [];
      }

      return data?.map(item => item.corrected_query) || [];
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Merge and deduplicate search results
   */
  private mergeResults(
    existing: OptimizedSearchResult[],
    newResults: OptimizedSearchResult[]
  ): OptimizedSearchResult[] {
    const existingIds = new Set(existing.map(r => r.id));
    const uniqueNew = newResults.filter(r => !existingIds.has(r.id));
    
    return [...existing, ...uniqueNew];
  }

  /**
   * Cache management
   */
  private getCachedResults(
    query: string,
    options: SearchOptions
  ): { results: OptimizedSearchResult[]; metrics: SearchPerformanceMetrics } | null {
    const cacheKey = this.generateCacheKey(query, options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < (options.cacheTimeout || this.defaultCacheTimeout)) {
      return { results: cached.results, metrics: { ...cached.metrics, cacheHit: true } };
    }
    
    return null;
  }

  private cacheResults(
    query: string,
    options: SearchOptions,
    results: OptimizedSearchResult[],
    metrics: SearchPerformanceMetrics,
    timeout: number
  ): void {
    const cacheKey = this.generateCacheKey(query, options);
    
    this.cache.set(cacheKey, {
      results,
      timestamp: Date.now(),
      metrics
    });

    // Clean up old cache entries (simple LRU)
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  private generateCacheKey(query: string, options: SearchOptions): string {
    return `${query.toLowerCase()}_${JSON.stringify(options)}`;
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get performance metrics
   */
  getCacheStats(): { size: number; hitRate: number } {
    // This would be more sophisticated in a real implementation
    return {
      size: this.cache.size,
      hitRate: 0.85 // Mock hit rate
    };
  }

  /**
   * Refresh search cache (for materialized view)
   */
  async refreshSearchCache(): Promise<void> {
    try {
      await supabase.rpc('refresh_search_cache');
      console.log('Search cache refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh search cache:', error);
    }
  }

  /**
   * Get tenant ID for current user
   */
  private async getTenantId(): Promise<string> {
    const { tenantId } = useAuthStore.getState();
    if (!tenantId) {
      throw new Error('No tenant ID available');
    }
    return tenantId;
  }
}

// Export singleton instance
export const optimizedSearch = new OptimizedSearchService();

// Export types
export type { SearchOptions, SearchPerformanceMetrics };
















