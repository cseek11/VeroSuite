// ============================================================================
// SIMPLE SEARCH SERVICE - BYPASS FUNCTION ISSUES
// ============================================================================
// Direct query approach to avoid function problems

import { supabase } from './supabase-client';
import { getTenantId } from './enhanced-api';
import { logger } from '@/utils/logger';

export interface SimpleSearchResult {
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
  match_type: string;
  created_at: string;
  updated_at: string;
}

export interface SearchOptions {
  search?: string;
  status?: string;
  segmentId?: string;
}

export class SimpleSearchService {
  /**
   * Simple search using direct Supabase queries
   */
  async searchCustomers(options: SearchOptions = {}): Promise<SimpleSearchResult[]> {
    const startTime = performance.now();
    
    try {
      const tenantId = await getTenantId();
      const { search = '', status, segmentId } = options;
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Simple search called', { search, status, segmentId, tenantId }, 'simple-search-service');
      }
      
      // Build the query
      let query = supabase
        .from('accounts')
        .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
        .eq('tenant_id', tenantId);
      
      // Apply search filter if provided
      if (search.trim()) {
        const searchTerm = search.trim();
        
        // Check if search term contains numbers (phone search)
        const phoneDigits = searchTerm.replace(/\D/g, '');
        const isPhoneSearch = phoneDigits.length >= 3;
        
        if (isPhoneSearch) {
          // Phone number search
          query = query.or(`phone_digits.ilike.%${phoneDigits}%`);
        } else {
          // Text search across multiple fields
          query = query.or(
            `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`
          );
        }
      }
      
      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }
      
      // Apply account type filter
      if (segmentId) {
        query = query.eq('account_type', segmentId);
      }
      
      // Execute query
      const { data: results, error } = await query
        .order('name', { ascending: true })
        .limit(50);
      
      if (error) {
        logger.error('Search error', error, 'simple-search-service');
        return [];
      }
      
      // Transform results to match expected format
      const transformedResults: SimpleSearchResult[] = (results || []).map((account: any) => ({
        id: account.id,
        name: account.name || '',
        email: account.email || '',
        phone: account.phone || '',
        address: account.address || '',
        city: account.city || '',
        state: account.state || '',
        zip_code: account.zip_code || '',
        status: account.status || '',
        account_type: account.account_type || '',
        relevance_score: 1.0, // Simple scoring for now
        match_type: 'direct_query',
        created_at: account.created_at,
        updated_at: account.updated_at
      }));
      
      const endTime = performance.now();
      const timeTakenMs = Math.round(endTime - startTime);
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Simple search completed', {
          resultsCount: transformedResults.length,
          timeTakenMs,
          searchTerm: search
        }, 'simple-search-service');
      }
      
      return transformedResults;
      
    } catch (error: unknown) {
      logger.error('Error in simple search', error, 'simple-search-service');
      return [];
    }
  }
}

// Export singleton instance
export const simpleSearch = new SimpleSearchService();



































