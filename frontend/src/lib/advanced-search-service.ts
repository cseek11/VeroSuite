// ============================================================================
// ADVANCED SEARCH SERVICE - Fuzzy Matching & Vector Search
// ============================================================================
// Enhanced search service with fuzzy matching, typo tolerance, and vector search

import { supabase } from './supabase-client';
import { config } from '@/lib/config';
import type { SearchFilters, Account } from '@/types/enhanced-types';
import { intentClassificationService, type IntentResult } from './intent-classification-service';
import { actionExecutorService, type ActionResult } from './action-handlers';
import { logger } from '@/utils/logger';

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

// New interface for global search results
export interface GlobalSearchResult {
  type: 'search' | 'action';
  intent?: IntentResult;
  searchResults?: AdvancedSearchResult[];
  actionResult?: ActionResult;
  requiresConfirmation?: boolean;
  confirmationData?: any;
}

// ============================================================================
// ADVANCED SEARCH SERVICE
// ============================================================================

class AdvancedSearchService {

  private getTenantId = async (): Promise<string> => {
    // Get auth data from localStorage
    const authData = localStorage.getItem('verofield_auth');
    if (!authData) {
      throw new Error('User not authenticated');
    }

    try {
      const parsed = JSON.parse(authData);
      const tenantId = parsed.tenantId;
      
      if (!tenantId) {
        throw new Error('Tenant ID not found in auth data');
      }

      logger.debug('Getting tenant ID for user', { userEmail: parsed.user?.email }, 'advanced-search-service');
      return tenantId;
    } catch (error: unknown) {
      logger.error('Error parsing auth data', error, 'advanced-search-service');
      throw new Error('Invalid authentication data');
    }
  };

  /**
   * Global search that handles both natural language commands and regular search
   * This is the main entry point for the unified search interface
   */
  globalSearch = async (
    query: string,
    filters?: SearchFilters,
    options: AdvancedSearchOptions = {}
  ): Promise<GlobalSearchResult> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Starting global search for query', { query }, 'advanced-search-service');
      }
      
      // First, classify the intent of the query
      const intentResult = intentClassificationService.classifyIntent(query);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Intent classified', { intent: intentResult.intent, confidence: intentResult.confidence }, 'advanced-search-service');
      }
      
      // If it's a search intent or low confidence, fall back to regular search
      if (intentResult.intent === 'search' || intentResult.confidence < 0.6) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Falling back to regular search', {}, 'advanced-search-service');
        }
        const searchResults = await this.searchCustomersAdvanced(query, filters, options);
        return {
          type: 'search',
          searchResults,
          intent: intentResult
        };
      }
      
      // For action intents with high confidence, execute the action
      if (intentResult.confidence >= 0.6) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Executing action for intent', { intent: intentResult.intent }, 'advanced-search-service');
        }
        
        // Validate the action before execution
        const validation = actionExecutorService.validateAction(intentResult);
        if (!validation.isValid) {
          logger.warn('Action validation failed', { errors: validation.errors }, 'advanced-search-service');
          // Fall back to search if validation fails
          const searchResults = await this.searchCustomersAdvanced(query, filters, options);
          return {
            type: 'search',
            searchResults,
            intent: intentResult
          };
        }
        
        // Get confirmation data for the action
        const confirmationData = actionExecutorService.getConfirmationData(intentResult);
        
        // If confidence is high enough, execute immediately
        if (intentResult.confidence >= 0.9) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('High confidence, executing action immediately', {}, 'advanced-search-service');
          }
          const actionResult = await actionExecutorService.executeAction(intentResult);
          
          return {
            type: 'action',
            intent: intentResult,
            actionResult,
            requiresConfirmation: false
          };
        }
        
        // Otherwise, return confirmation data for user approval
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Medium confidence, requiring confirmation', {}, 'advanced-search-service');
        }
        return {
          type: 'action',
          intent: intentResult,
          requiresConfirmation: true,
          confirmationData
        };
      }
      
      // Fallback to search
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Fallback to search', {}, 'advanced-search-service');
      }
      const searchResults = await this.searchCustomersAdvanced(query, filters, options);
      return {
        type: 'search',
        searchResults,
        intent: intentResult
      };
      
    } catch (error: unknown) {
      logger.error('Error in global search', error, 'advanced-search-service');
      
      // On error, fall back to regular search
      try {
        const searchResults = await this.searchCustomersAdvanced(query, filters, options);
        return {
          type: 'search',
          searchResults,
          intent: {
            intent: 'search',
            confidence: 0.5,
            entities: {},
            originalQuery: query,
            processedQuery: query
          }
        };
      } catch (searchError: unknown) {
        logger.error('Fallback search also failed', searchError, 'advanced-search-service');
        throw error; // Re-throw original error
      }
    }
  };

  /**
   * Execute a confirmed action (called after user confirms)
   */
  executeConfirmedAction = async (intentResult: IntentResult): Promise<ActionResult> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Executing confirmed action', { intent: intentResult.intent }, 'advanced-search-service');
      }
      return await actionExecutorService.executeAction(intentResult);
    } catch (error: unknown) {
      logger.error('Error executing confirmed action', error, 'advanced-search-service');
      throw error;
    }
  };

  /**
   * Get search suggestions based on intent classification
   */
  getIntentBasedSuggestions = (query: string, maxSuggestions: number = 5): string[] => {
    const intentResult = intentClassificationService.classifyIntent(query);
    const examples = intentClassificationService.getIntentExamples();
    
    if (intentResult.intent === 'search') {
      // For search queries, return related search suggestions
      return [
        `Find ${query}`,
        `Search for ${query}`,
        `Lookup ${query}`,
        `Show all ${query}`,
        `Find customers with ${query}`
      ].slice(0, maxSuggestions);
    }
    
    // For action intents, return examples of that intent type
    const intentExamples = examples[intentResult.intent] || [];
    return intentExamples.slice(0, maxSuggestions);
  };

  /**
   * Get all supported intents for help/autocomplete
   */
  getSupportedIntents = () => {
    return intentClassificationService.getSupportedIntents();
  };

  /**
   * Get examples for all intents
   */
  getIntentExamples = () => {
    return intentClassificationService.getIntentExamples();
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
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Starting advanced search', { query, filters, options }, 'advanced-search-service');
      }
      
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
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Advanced search setup', {
          originalQuery: query,
          normalizedQuery,
          searchVariations,
          searchMode,
          fuzzyThreshold,
          tenantId
        }, 'advanced-search-service');
      }

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

      if (process.env.NODE_ENV === 'development') {
        logger.debug('Raw search results', { count: results.length, results: results.slice(0, 2) }, 'advanced-search-service');
      }

      // Post-process results
      const processedResults = this.postProcessResults(results, query, normalizedQuery);
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Advanced search completed', { resultCount: processedResults.length }, 'advanced-search-service');
      }
      return processedResults;

    } catch (error: unknown) {
      logger.error('Advanced search failed', error, 'advanced-search-service');
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
    } catch (error: unknown) {
      logger.error('Failed to get search suggestions', error, 'advanced-search-service');
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
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Auto-correcting query', { original: query, corrected: bestCorrection.text }, 'advanced-search-service');
          }
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
    } catch (error: unknown) {
      logger.error('Search with auto-correction failed', error, 'advanced-search-service');
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
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Executing standard search', { query, tenantId, filters, maxResults }, 'advanced-search-service');
    }
    
    // Use the new multi-word search function for better multi-word query handling
    const { data, error } = await supabase
      .rpc('search_customers_multi_word', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: maxResults,
        p_offset: 0
      });

    if (error) {
      logger.error('Standard search failed', error, 'advanced-search-service');
      return [];
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Standard search results', { count: data?.length || 0, data: data?.slice(0, 2) }, 'advanced-search-service');
    }
    return this.mapToAdvancedResults(data || [], 'exact');
  }

  private async executeFuzzySearch(
    tenantId: string,
    searchVariations: string[],
    filters?: SearchFilters,
    fuzzyThreshold: number = 0.3,
    maxResults: number = 50
  ): Promise<AdvancedSearchResult[]> {
    // Prefer backend RPC when feature is enabled
    if (config.features.enableFuzzy) {
      try {
        const { data, error } = await supabase.rpc('search_customers_fuzzy', {
          p_tenant_id: tenantId,
          p_query: searchVariations[0] || '',
          p_threshold: fuzzyThreshold,
          p_limit: maxResults
        });
        if (!error && data) {
          return this.mapToAdvancedResults(data, 'fuzzy');
        }
      } catch (e: unknown) {
        logger.warn('Fuzzy RPC unavailable, falling back to client fuzzy search', { error: e }, 'advanced-search-service');
      }
    }

    // Fallback: client-side aggregation using existing RPC
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
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Executing hybrid search', { query, searchVariations, fuzzyThreshold }, 'advanced-search-service');
    }
    
    // Combine standard and fuzzy search results
    const [standardResults, fuzzyResults] = await Promise.all([
      this.executeStandardSearch(tenantId, query, filters, maxResults),
      this.executeFuzzySearch(tenantId, searchVariations, filters, fuzzyThreshold, maxResults)
    ]);

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Hybrid search results', { 
        standard: standardResults.length, 
        fuzzy: fuzzyResults.length 
      }, 'advanced-search-service');
    }

    // Merge and deduplicate results
    const allResults = [...standardResults, ...fuzzyResults];
    const uniqueResults = this.removeDuplicateResults(allResults);
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Final hybrid results', { total: uniqueResults.length }, 'advanced-search-service');
    }
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
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Vector search not available, falling back to hybrid search', {}, 'advanced-search-service');
        }
        return this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults);
      }

      return this.mapToAdvancedResults(data || [], 'vector');
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Vector search failed, falling back to hybrid search', { error }, 'advanced-search-service');
      }
      return this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults);
    }
  }

  private async getTypoCorrections(_tenantId: string, _query: string, _limit: number): Promise<SearchSuggestion[]> {
    // This would typically use a spell-checker or ML model
    // For now, return empty array - can be enhanced later
    return [];
  }

  private async getQueryCompletions(_tenantId: string, query: string, limit: number): Promise<SearchSuggestion[]> {
    try {
      if (config.features.enableSuggestions) {
        try {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Calling get_search_suggestions RPC', { query, limit }, 'advanced-search-service');
          }
          const { data, error } = await supabase.rpc('get_search_suggestions', {
            p_query: query,
            p_limit: limit
          });
          if (process.env.NODE_ENV === 'development') {
            logger.debug('RPC response', { data, error }, 'advanced-search-service');
          }
          if (!error && Array.isArray(data)) {
            const suggestions = (data as any[]).map((row) => ({
              text: row.suggestion || '',
              type: this.mapSourceToType(row.source),
              confidence: Number(row.score) / 100 // Convert score (0-100) to confidence (0-1)
            }));
            if (process.env.NODE_ENV === 'development') {
              logger.debug('Mapped suggestions', { suggestions }, 'advanced-search-service');
            }
            return suggestions;
          }
          if (error) {
            logger.error('RPC error', error, 'advanced-search-service');
          }
        } catch (rpcError: unknown) {
          logger.warn('RPC get_search_suggestions failed, falling back to direct queries', { error: rpcError }, 'advanced-search-service');
        }
      }
      
      // Fallback to querying customers and logs directly
      const [customersData, logsData] = await Promise.all([
        // Customer names
        supabase
          .from('customers')
          .select('first_name, last_name')
          .eq('tenant_id', _tenantId)
          .or(`first_name.ilike.${query}%,last_name.ilike.${query}%`)
          .limit(limit),
        // Search logs
        supabase
          .from('search_logs')
          .select('query')
          .eq('tenant_id', _tenantId)
          .ilike('query', `${query}%`)
          .order('created_at', { ascending: false })
          .limit(limit)
      ]);
      
      const suggestions: SearchSuggestion[] = [];
      
      // Add customer name suggestions
      if (customersData.data) {
        customersData.data.forEach(customer => {
          if (customer.first_name?.toLowerCase().startsWith(query.toLowerCase())) {
            suggestions.push({ text: customer.first_name, type: 'completion', confidence: 0.9 });
          }
          if (customer.last_name?.toLowerCase().startsWith(query.toLowerCase())) {
            suggestions.push({ text: customer.last_name, type: 'completion', confidence: 0.9 });
          }
          if (customer.first_name && customer.last_name && 
              (customer.first_name + ' ' + customer.last_name).toLowerCase().startsWith(query.toLowerCase())) {
            suggestions.push({ text: customer.first_name + ' ' + customer.last_name, type: 'completion', confidence: 0.95 });
          }
        });
      }
      
      // Add log suggestions
      if (logsData.data) {
        logsData.data.forEach(item => {
          if (item.query && !suggestions.some(s => s.text === item.query)) {
            suggestions.push({ text: item.query, type: 'completion', confidence: 0.8 });
          }
        });
      }
      
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit);
        
    } catch (_error) {
      logger.error('Failed to get query completions', _error, 'advanced-search-service');
      return [];
    }
  }

  private mapSourceToType(source: string): 'correction' | 'completion' | 'related' {
    switch (source) {
      case 'contacts':
        return 'completion';
      case 'accounts':
        return 'completion';
      case 'users':
        return 'completion';
      case 'popular':
        return 'completion';
      case 'logs':
        return 'related';
      case 'analytics':
        return 'related';
      case 'trends':
        return 'related';
      default:
        return 'completion';
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
    _normalizedQuery: string
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
