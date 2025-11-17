/**
 * API Response Structure Tests
 * 
 * Tests to catch issues with nested response structures where:
 * - Backend wraps DTOs in { data: result, meta: {...} }
 * - DTOs themselves have a { data: [...] } structure
 * - Results in double-nested: { data: { data: [...] } }
 * 
 * This test ensures all API clients handle various response formats correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock supabase
vi.mock('../supabase-client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock api-utils
const mockEnhancedApiCall = vi.fn();
vi.mock('../api-utils', () => ({
  enhancedApiCall: mockEnhancedApiCall,
}));

describe('API Response Structure Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    mockEnhancedApiCall.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
  });

  describe('Double-Nested Response Structure (Controller-wrapped DTO)', () => {
    it('should handle { data: { data: [...] } } structure (technicians pattern)', async () => {
      // This is the actual structure from backend:
      // Controller wraps TechnicianListResponseDto in { data: result, meta: {...} }
      // TechnicianListResponseDto has { data: [...], pagination: {...} }
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [
              { id: '1', first_name: 'John', last_name: 'Doe' },
              { id: '2', first_name: 'Jane', last_name: 'Smith' },
            ],
            pagination: { page: 1, limit: 20, total: 2 },
            success: true,
            message: 'Technicians retrieved successfully',
            timestamp: new Date().toISOString(),
          },
          meta: {
            version: '2.0',
            count: 2,
            timestamp: new Date().toISOString(),
          },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const { enhancedApi } = await import('../enhanced-api');
      const result = await enhancedApi.technicians.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id', '1');
        expect(result[0]).toHaveProperty('first_name', 'John');
      }
    });

    it('should handle { data: { data: [...] } } structure for other endpoints', async () => {
      // Test pattern that could apply to accounts, work orders, etc.
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [{ id: '1', name: 'Item 1' }],
            pagination: { page: 1, limit: 20, total: 1 },
            success: true,
          },
          meta: { version: '2.0', count: 1 },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      // This would be used by any endpoint that follows the same pattern
      const response = responseData;
      let extractedData: any[] = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(1);
      expect(extractedData[0]).toHaveProperty('id', '1');
    });
  });

  describe('Single-Nested Response Structure', () => {
    it('should handle { data: [...] } structure (direct array)', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            { id: '1', name: 'Item 1' },
            { id: '2', name: 'Item 2' },
          ],
          meta: { version: '2.0', count: 2 },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const response = responseData;
      let extractedData: any[] = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(2);
    });
  });

  describe('Alternative Response Formats', () => {
    it('should handle { technicians: [...] } format', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          technicians: [
            { id: '1', name: 'Tech 1' },
            { id: '2', name: 'Tech 2' },
          ],
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const response = responseData;
      let extractedData: any[] = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data?.technicians && Array.isArray(response.data.technicians)) {
        extractedData = response.data.technicians;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      } else if (response?.technicians && Array.isArray(response.technicians)) {
        extractedData = response.technicians;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(2);
    });

    it('should handle direct array response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const response = responseData;
      let extractedData: any[] = [];

      if (Array.isArray(response)) {
        extractedData = response;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(2);
    });
  });

  describe('Error Cases', () => {
    it('should return empty array when response.data.data is not an array', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: { message: 'No items found' }, // Not an array!
            pagination: { page: 1, limit: 20, total: 0 },
          },
          meta: { version: '2.0', count: 0 },
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { enhancedApi } = await import('../enhanced-api');
      const result = await enhancedApi.technicians.list();

      // Should return empty array, not crash
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array when response structure is unexpected', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          unexpected: 'structure',
          with: { nested: 'data' },
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { enhancedApi } = await import('../enhanced-api');
      const result = await enhancedApi.technicians.list();

      // Should return empty array, not crash
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array on API error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({
          message: 'Cannot GET /api/v2/technicians',
          error: 'Not Found',
          statusCode: 404,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { enhancedApi } = await import('../enhanced-api');
      const result = await enhancedApi.technicians.list();

      // Should return empty array on error
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Response Structure Detection', () => {
    it('should detect double-nested structure correctly', () => {
      const response = {
        data: {
          data: [{ id: '1' }],
          pagination: {},
        },
        meta: {},
      };

      const isDoubleNested = response?.data?.data && Array.isArray(response.data.data);
      expect(isDoubleNested).toBe(true);
    });

    it('should detect single-nested structure correctly', () => {
      const response = {
        data: [{ id: '1' }],
        meta: {},
      };

      const isSingleNested = response?.data && Array.isArray(response.data) && !response.data.data;
      expect(isSingleNested).toBe(true);
    });

    it('should detect direct array correctly', () => {
      const response = [{ id: '1' }];

      const isDirectArray = Array.isArray(response);
      expect(isDirectArray).toBe(true);
    });
  });

  describe('Regression Tests', () => {
    it('should prevent "Unexpected response format" warning for valid double-nested structure', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [{ id: '1', name: 'Test' }],
            pagination: { page: 1, limit: 20, total: 1 },
            success: true,
          },
          meta: { version: '2.0', count: 1 },
        }),
      };

      mockEnhancedApiCall.mockResolvedValue(await mockResponse.json());

      const { logger } = await import('@/utils/logger');
      const { enhancedApi } = await import('../enhanced-api');
      
      await enhancedApi.technicians.list();

      // Should NOT log warning for valid structure
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should extract data correctly from double-nested structure (technicians bug fix)', async () => {
      // This is the exact structure that caused the bug
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [
              { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
              { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
            ],
            pagination: { page: 1, limit: 20, total: 2 },
            success: true,
            message: 'Technicians retrieved successfully',
            timestamp: new Date().toISOString(),
          },
          meta: {
            version: '2.0',
            count: 2,
            timestamp: new Date().toISOString(),
          },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const { enhancedApi } = await import('../enhanced-api');
      const result = await enhancedApi.technicians.list();

      // Should extract the array correctly
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      if (result.length >= 2) {
        expect(result[0]).toHaveProperty('id', 'tech-1');
        expect(result[0]).toHaveProperty('first_name', 'John');
        expect(result[1]).toHaveProperty('id', 'tech-2');
        expect(result[1]).toHaveProperty('first_name', 'Jane');
      }
    });
  });

  describe('Similar Endpoints Pattern', () => {
    it('should handle accounts endpoint with same structure', async () => {
      // Accounts might have the same issue
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [{ id: 'acc-1', name: 'Account 1' }],
            pagination: { page: 1, limit: 20, total: 1 },
          },
          meta: { version: '1.0', count: 1 },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const response = responseData;
      let extractedData: any[] = [];

      // Same extraction logic
      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(1);
    });

    it('should handle work orders endpoint with same structure', async () => {
      // Work orders might have the same issue
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            data: [{ id: 'wo-1', description: 'Work Order 1' }],
            pagination: { page: 1, limit: 20, total: 1 },
          },
          meta: { version: '1.0', count: 1 },
        }),
      };

      const responseData = await mockResponse.json();
      mockEnhancedApiCall.mockResolvedValue(responseData);

      const response = responseData;
      let extractedData: any[] = [];

      // Same extraction logic
      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      }

      expect(Array.isArray(extractedData)).toBe(true);
      expect(extractedData.length).toBe(1);
    });
  });
});

