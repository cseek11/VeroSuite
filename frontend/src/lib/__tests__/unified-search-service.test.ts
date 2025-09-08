// ============================================================================
// UNIFIED SEARCH SERVICE TESTS
// ============================================================================
// Comprehensive test suite for the unified search service

import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import { unifiedSearchService } from '../unified-search-service';
import { searchErrorLogger } from '../search-error-logger';
import { supabase } from '../supabase-client';

// Mock dependencies
vi.mock('../supabase-client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              data: [],
              error: null
            }))
          }))
        })),
        or: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      }))
    })),
    rpc: vi.fn()
  }
}));

vi.mock('../search-error-logger', () => ({
  searchErrorLogger: {
    logError: vi.fn(),
    logSuccess: vi.fn(),
    getErrorStats: vi.fn(() => ({
      total: 0,
      byType: {},
      bySeverity: {},
      unresolved: 0,
      last24Hours: 0
    }))
  }
}));

describe('UnifiedSearchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchCustomers', () => {
    test('should return empty result for empty query', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'test-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      const result = await unifiedSearchService.searchCustomers('');

      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.searchMethod).toBe('enhanced');
    });

    test('should handle authentication errors gracefully', async () => {
      (supabase.auth.getUser as Mock).mockRejectedValue(new Error('Auth failed'));

      const result = await unifiedSearchService.searchCustomers('test query');

      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
      expect(searchErrorLogger.logError).toHaveBeenCalled();
    });

    test('should try multiple search methods when first fails', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'test-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      // Mock enhanced search to fail
      (supabase.rpc as Mock).mockImplementation((functionName) => {
        if (functionName === 'search_customers_enhanced') {
          return Promise.resolve({ data: null, error: new Error('Function not found') });
        }
        if (functionName === 'search_customers_multi_word') {
          return Promise.resolve({ data: [], error: null });
        }
        return Promise.resolve({ data: [], error: null });
      });

      const result = await unifiedSearchService.searchCustomers('test query');

      expect(result.data).toEqual([]);
      expect(result.searchMethod).toBe('multi_word');
      expect(supabase.rpc).toHaveBeenCalledWith('search_customers_enhanced', expect.any(Object));
      expect(supabase.rpc).toHaveBeenCalledWith('search_customers_multi_word', expect.any(Object));
    });

    test('should use fallback search when all RPC methods fail', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'test-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      // Mock all RPC calls to fail
      (supabase.rpc as Mock).mockRejectedValue(new Error('RPC failed'));

      const result = await unifiedSearchService.searchCustomers('test query');

      expect(result.data).toEqual([]);
      expect(result.searchMethod).toBe('fallback');
    });

    test('should log success when search succeeds', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'test-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      const mockData = [
        { id: '1', name: 'Test Customer', email: 'test@example.com' }
      ];

      (supabase.rpc as Mock).mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await unifiedSearchService.searchCustomers('test');

      expect(result.data).toEqual(mockData);
      expect(result.totalCount).toBe(1);
      expect(searchErrorLogger.logSuccess).toHaveBeenCalledWith(
        'search_customers',
        'test',
        1,
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  describe('getSearchStats', () => {
    test('should return search statistics', async () => {
      const mockStats = {
        total: 100,
        byType: { enhanced: 50, fuzzy: 30, fallback: 20 },
        bySeverity: { low: 80, medium: 15, high: 5 },
        unresolved: 5,
        last24Hours: 25
      };

      (searchErrorLogger.getErrorStats as Mock).mockReturnValue(mockStats);

      const stats = await unifiedSearchService.getSearchStats();

      expect(stats.totalSearches).toBe(100);
      expect(stats.errorRate).toBe(5);
      expect(stats.methodDistribution).toEqual(mockStats.byType);
    });

    test('should handle errors in stats retrieval', async () => {
      (searchErrorLogger.getErrorStats as Mock).mockImplementation(() => {
        throw new Error('Stats failed');
      });

      const stats = await unifiedSearchService.getSearchStats();

      expect(stats.totalSearches).toBe(0);
      expect(stats.errorRate).toBe(0);
      expect(stats.methodDistribution).toEqual({});
    });
  });

  describe('clearCache', () => {
    test('should clear search cache', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await unifiedSearchService.clearCache();

      expect(consoleSpy).toHaveBeenCalledWith('Search cache cleared');
      
      consoleSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    test('should categorize errors correctly', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'test-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      // Mock RPC to throw permission error
      (supabase.rpc as Mock).mockRejectedValue(new Error('Permission denied'));

      await unifiedSearchService.searchCustomers('test');

      expect(searchErrorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: 'search_customers',
          query: 'test',
          tenantId: 'test-tenant'
        }),
        'high'
      );
    });

    test('should handle network errors', async () => {
      (supabase.auth.getUser as Mock).mockRejectedValue(new Error('Network error'));

      const result = await unifiedSearchService.searchCustomers('test');

      expect(result.error).toBe('Network error');
      expect(searchErrorLogger.logError).toHaveBeenCalled();
    });
  });

  describe('tenant isolation', () => {
    test('should use correct tenant ID', async () => {
      const mockUser = {
        user_metadata: { tenant_id: 'specific-tenant' }
      };
      
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: mockUser }
      });

      (supabase.rpc as Mock).mockResolvedValue({
        data: [],
        error: null
      });

      await unifiedSearchService.searchCustomers('test');

      expect(supabase.rpc).toHaveBeenCalledWith(
        'search_customers_enhanced',
        expect.objectContaining({
          p_tenant_id: 'specific-tenant'
        })
      );
    });

    test('should fallback to default tenant when user has no tenant', async () => {
      (supabase.auth.getUser as Mock).mockResolvedValue({
        data: { user: null }
      });

      (supabase.rpc as Mock).mockResolvedValue({
        data: [],
        error: null
      });

      await unifiedSearchService.searchCustomers('test');

      expect(supabase.rpc).toHaveBeenCalledWith(
        'search_customers_enhanced',
        expect.objectContaining({
          p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28'
        })
      );
    });
  });
});
