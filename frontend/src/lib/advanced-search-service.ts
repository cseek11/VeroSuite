// ============================================================================
// ADVANCED SEARCH SERVICE - Fuzzy Matching & Vector Search
// ============================================================================
// Enhanced search service with fuzzy matching, typo tolerance, and vector search

import { supabase } from './supabase-client';
import type { SearchFilters, Account } from '@/types/enhanced-types';

// ============================================================================
// TYPES
// ============================================================================

export interface AdvancedSearchOptions {
  fuzzyThreshold?: number; // 0.0 to 1.0, default 0.3
  maxResults?: number; // default 50
  includeVectorSearch?: boolean; // default false
  searchMode?: 'standard' | 'fuzzy' | 'hybrid' | 'vector'; // default 'hybrid'
  typoTolerance?: number; // 0-3, default 1
}

export interface AdvancedSearchResult extends Account {
  relevance_score: number;
  match_type: 'exact' | 'fuzzy' | 'partial' | 'vector' | 'fallback';
  match_details: {
    field: string;
    similarity: number;
    original_query: string;
    matched_text: string;
  };
  search_suggestions?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'correction' | 'completion' | 'related';
  confidence: number;
}

// ============================================================================
// ADVANCED SEARCH SERVICE
// ============================================================================

class AdvancedSearchService {

  private getTenantId = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 Getting tenant ID for user:', user.email);

    const { data: tenantId, error } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: user.email
      });

    if (error || !tenantId) {
      console.error('❌ Failed to get tenant ID:', error);
      throw new Error('Failed to get tenant ID');
    }

    console.log('✅ Got tenant ID:', tenantId);
    return tenantId;
  };

  /**
   * Advanced search with fuzzy matching and typo tolerance
   */
  searchCustomersAdvanced = async (
    query: string,
    filters?: SearchFilters,
    options: AdvancedSearchOptions = {}
  ): Promise<AdvancedSearchResult[]> => {
    try {
      console.log('🚀 Starting advanced search:', { query, filters, options });
      
      const tenantId = await this.getTenantId();
      
      const {
        fuzzyThreshold = 0.3,
        maxResults = 50,
        searchMode = 'hybrid',
        typoTolerance = 1
      } = options;

      // Clean and normalize the search query
      const normalizedQuery = this.normalizeSearchQuery(query);
      
      // Generate search variations for typo tolerance
      const searchVariations = this.generateSearchVariations(normalizedQuery, typoTolerance);
      
      console.log('🔍 Advanced search setup:', {
        originalQuery: query,
        normalizedQuery,
        searchVariations,
        searchMode,
        fuzzyThreshold,
        tenantId
      });

      // Execute search based on mode
      let results: AdvancedSearchResult[] = [];
      
      switch (searchMode) {
        case 'standard':
          results = await this.executeStandardSearch(tenantId, normalizedQuery, filters, maxResults);
          break;
        case 'fuzzy':
          results = await this.executeFuzzySearch(tenantId, searchVariations, filters, fuzzyThreshold, maxResults);
          break;
        case 'hybrid':
          results = await this.executeHybridSearch(tenantId, normalizedQuery, searchVariations, filters, fuzzyThreshold, maxResults);
          break;
        case 'vector':
          if (options.includeVectorSearch) {
            results = await this.executeVectorSearch(tenantId, normalizedQuery, filters, maxResults);
          } else {
            results = await this.executeHybridSearch(tenantId, normalizedQuery, searchVariations, filters, fuzzyThreshold, maxResults);
          }
          break;
      }

      console.log('📊 Raw search results:', { count: results.length, results: results.slice(0, 2) });

      // Post-process results
      const processedResults = this.postProcessResults(results, query, normalizedQuery);
      
      console.log(`✅ Advanced search completed: ${processedResults.length} results`);
      return processedResults;

    } catch (error) {
      console.error('❌ Advanced search failed:', error);
      throw error;
    }
  };

  /**
   * Get search suggestions based on query
   */
  getSearchSuggestions = async (query: string, limit: number = 5): Promise<SearchSuggestion[]> => {
    try {
      const tenantId = await this.getTenantId();
      const normalizedQuery = this.normalizeSearchQuery(query);
      
      // Get suggestions from multiple sources
      const [corrections, completions, related] = await Promise.all([
        this.getTypoCorrections(tenantId, normalizedQuery, limit),
        this.getQueryCompletions(tenantId, normalizedQuery, limit),
        this.getRelatedQueries(tenantId, normalizedQuery, limit)
      ]);

      // Combine and rank suggestions
      const suggestions = [...corrections, ...completions, ...related]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit);

      return suggestions;
    } catch (error) {
      console.error('❌ Failed to get search suggestions:', error);
      return [];
    }
  };

  /**
   * Search with auto-correction
   */
  searchWithAutoCorrection = async (
    query: string,
    filters?: SearchFilters,
    options: AdvancedSearchOptions = {}
  ): Promise<{
    results: AdvancedSearchResult[];
    correctedQuery?: string;
    suggestions: SearchSuggestion[];
  }> => {
    try {
      // First, try the original query
      let results = await this.searchCustomersAdvanced(query, filters, options);
      
      // If no results and query looks like it might have typos, try corrections
      if (results.length === 0 && this.looksLikeTypo(query)) {
        const suggestions = await this.getSearchSuggestions(query, 3);
        const bestCorrection = suggestions.find(s => s.type === 'correction' && s.confidence > 0.7);
        
        if (bestCorrection) {
          console.log(`🔧 Auto-correcting "${query}" to "${bestCorrection.text}"`);
          results = await this.searchCustomersAdvanced(bestCorrection.text, filters, options);
          
          return {
            results,
            correctedQuery: bestCorrection.text,
            suggestions
          };
        }
      }

      // Get suggestions for the original query
      const suggestions = await this.getSearchSuggestions(query, 5);
      
      return {
        results,
        suggestions
      };
    } catch (error) {
      console.error('❌ Search with auto-correction failed:', error);
      throw error;
    }
  };

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private normalizeSearchQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/[^\w\s@.-]/g, '') // Remove special chars except @, ., -
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  private generateSearchVariations(query: string, typoTolerance: number): string[] {
    const variations = [query];
    
    if (typoTolerance > 0) {
      // Add common typo variations
      const commonTypos = this.getCommonTypoVariations(query);
      variations.push(...commonTypos.slice(0, typoTolerance * 2));
    }
    
    return [...new Set(variations)]; // Remove duplicates
  }

  private getCommonTypoVariations(query: string): string[] {
    const variations: string[] = [];
    
    // Common character substitutions
    const substitutions: Record<string, string[]> = {
      'a': ['@', '4'],
      'e': ['3'],
      'i': ['1', '!'],
      'o': ['0'],
      's': ['$', '5'],
      't': ['7'],
      'l': ['1'],
      'b': ['6'],
      'g': ['9']
    };

    // Generate variations with character substitutions
    for (let i = 0; i < query.length; i++) {
      const char = query[i];
      if (substitutions[char]) {
        for (const sub of substitutions[char]) {
          variations.push(query.slice(0, i) + sub + query.slice(i + 1));
        }
      }
    }

    // Add variations with missing/extra characters
    for (let i = 0; i < query.length; i++) {
      // Missing character
      variations.push(query.slice(0, i) + query.slice(i + 1));
      // Extra character
      variations.push(query.slice(0, i) + 'x' + query.slice(i));
    }

    return variations;
  }

  private looksLikeTypo(query: string): boolean {
    // Simple heuristics to detect potential typos
    return (
      query.length > 2 && // Not too short
      /[^a-zA-Z0-9\s@.-]/.test(query) || // Has special characters
      query.split(' ').some(word => word.length > 1 && /[0-9]/.test(word)) // Numbers in words
    );
  }

  private async executeStandardSearch(
    tenantId: string,
    query: string,
    filters?: SearchFilters,
    maxResults: number = 50
  ): Promise<AdvancedSearchResult[]> {
    console.log('🔍 Executing standard search:', { query, tenantId, filters, maxResults });
    
    // Use the new multi-word search function for better multi-word query handling
    const { data, error } = await supabase
      .rpc('search_customers_multi_word', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: maxResults,
        p_offset: 0
      });

    if (error) {
      console.error('❌ Standard search failed:', error);
      return [];
    }

    console.log('✅ Standard search results:', { count: data?.length || 0, data: data?.slice(0, 2) });
    return this.mapToAdvancedResults(data || [], 'exact');
  }

  private async executeFuzzySearch(
    tenantId: string,
    searchVariations: string[],
    filters?: SearchFilters,
    fuzzyThreshold: number = 0.3,
    maxResults: number = 50
  ): Promise<AdvancedSearchResult[]> {
    // Use the enhanced search function with fuzzy matching
    const allResults: AdvancedSearchResult[] = [];
    
    for (const variation of searchVariations) {
      const { data, error } = await supabase
        .rpc('search_customers_multi_word', {
          p_search_term: variation,
          p_tenant_id: tenantId,
          p_limit: maxResults,
          p_offset: 0
        });

      if (!error && data) {
        const fuzzyResults = data
          .filter((result: any) => result.match_type === 'fuzzy' && result.relevance_score >= fuzzyThreshold)
          .map((result: any) => ({
            ...result,
            match_type: 'fuzzy' as const,
            match_details: {
              field: 'name',
              similarity: result.relevance_score,
              original_query: variation,
              matched_text: result.name
            }
          }));
        
        allResults.push(...fuzzyResults);
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = this.removeDuplicateResults(allResults);
    return uniqueResults.slice(0, maxResults);
  }

  private async executeHybridSearch(
    tenantId: string,
    query: string,
    searchVariations: string[],
    filters?: SearchFilters,
    fuzzyThreshold: number = 0.3,
    maxResults: number = 50
  ): Promise<AdvancedSearchResult[]> {
    console.log('🔍 Executing hybrid search:', { query, searchVariations, fuzzyThreshold });
    
    // Combine standard and fuzzy search results
    const [standardResults, fuzzyResults] = await Promise.all([
      this.executeStandardSearch(tenantId, query, filters, maxResults),
      this.executeFuzzySearch(tenantId, searchVariations, filters, fuzzyThreshold, maxResults)
    ]);

    console.log('📊 Hybrid search results:', { 
      standard: standardResults.length, 
      fuzzy: fuzzyResults.length 
    });

    // Merge and deduplicate results
    const allResults = [...standardResults, ...fuzzyResults];
    const uniqueResults = this.removeDuplicateResults(allResults);
    
    console.log('✅ Final hybrid results:', { total: uniqueResults.length });
    return uniqueResults.slice(0, maxResults);
  }

  private async executeVectorSearch(
    tenantId: string,
    query: string,
    filters?: SearchFilters,
    maxResults: number = 50
  ): Promise<AdvancedSearchResult[]> {
    try {
      // Try vector search if available
      const { data, error } = await supabase
        .rpc('search_customers_vector', {
          p_embedding: query, // This would normally be a vector embedding
          p_tenant_id: tenantId,
          p_limit: maxResults,
          p_similarity_threshold: 0.7
        });

      if (error) {
        console.log('Vector search not available, falling back to hybrid search');
        return this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults);
      }

      return this.mapToAdvancedResults(data || [], 'vector');
    } catch (error) {
      console.log('Vector search failed, falling back to hybrid search');
      return this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults);
    }
  }

  private async getTypoCorrections(tenantId: string, query: string, limit: number): Promise<SearchSuggestion[]> {
    // This would typically use a spell-checker or ML model
    // For now, return empty array - can be enhanced later
    return [];
  }

  private async getQueryCompletions(tenantId: string, query: string, limit: number): Promise<SearchSuggestion[]> {
    try {
      // Get popular queries that start with the current query
      const { data, error } = await supabase
        .from('search_logs')
        .select('query')
        .eq('tenant_id', tenantId)
        .ilike('query', `${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return [];

      const completions = data.map(item => ({
        text: item.query,
        type: 'completion' as const,
        confidence: 0.8
      }));

      return completions;
    } catch (error) {
      return [];
    }
  }

  private async getRelatedQueries(tenantId: string, query: string, limit: number): Promise<SearchSuggestion[]> {
    try {
      // Get queries that are similar to the current query
      const { data, error } = await supabase
        .from('search_logs')
        .select('query')
        .eq('tenant_id', tenantId)
        .neq('query', query)
        .order('created_at', { ascending: false })
        .limit(limit * 2);

      if (error) return [];

      // Simple similarity check (can be enhanced with proper similarity algorithms)
      const related = data
        .filter(item => this.calculateSimpleSimilarity(query, item.query) > 0.5)
        .slice(0, limit)
        .map(item => ({
          text: item.query,
          type: 'related' as const,
          confidence: this.calculateSimpleSimilarity(query, item.query)
        }));

      return related;
    } catch (error) {
      return [];
    }
  }

  private calculateSimpleSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private mapToAdvancedResults(data: any[], defaultMatchType: string): AdvancedSearchResult[] {
    return data.map(item => ({
      ...item,
      match_type: item.match_type || defaultMatchType,
      match_details: item.match_details || {
        field: 'name',
        similarity: item.relevance_score || 1.0,
        original_query: '',
        matched_text: item.name
      }
    }));
  }

  private removeDuplicateResults(results: AdvancedSearchResult[]): AdvancedSearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      if (seen.has(result.id)) return false;
      seen.add(result.id);
      return true;
    });
  }

  private postProcessResults(
    results: AdvancedSearchResult[],
    originalQuery: string,
    normalizedQuery: string
  ): AdvancedSearchResult[] {
    return results.map(result => ({
      ...result,
      match_details: {
        ...result.match_details,
        original_query: originalQuery
      },
      search_suggestions: this.generateResultSuggestions(result, originalQuery)
    }));
  }

  private generateResultSuggestions(result: AdvancedSearchResult, query: string): string[] {
    const suggestions: string[] = [];
    
    // Add related field suggestions
    if (result.city && !query.toLowerCase().includes(result.city.toLowerCase())) {
      suggestions.push(`${query} ${result.city}`);
    }
    
    if (result.state && !query.toLowerCase().includes(result.state.toLowerCase())) {
      suggestions.push(`${query} ${result.state}`);
    }
    
    return suggestions.slice(0, 3);
  }
}

// Export singleton instance
export const advancedSearchService = new AdvancedSearchService();

// Export types
export type { AdvancedSearchOptions, AdvancedSearchResult, SearchSuggestion };
