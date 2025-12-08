/**
 * Technicians API Debug Test
 * 
 * This test helps debug why technicians might not be loading
 * by checking the actual API call and response handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch to capture actual calls
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

describe('Technicians API Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
  });

  it('should make API call to correct URL', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        ],
        meta: { count: 1 },
      }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    // Import after mocks are set up
    const { enhancedApi } = await import('../enhanced-api');
    const result = await enhancedApi.technicians.list();

    // Check that fetch was called
    expect(mockFetch).toHaveBeenCalled();
    
    // Check the URL
    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall).toBeDefined();
    if (!fetchCall) return;
    const url = fetchCall[0];
    
    expect(url).toMatch(/\/api\/v2\/technicians$/);
    expect(url).not.toContain('localhost:3001/api/v2/technicians'); // Should use env var if set
    
    // Check headers
    const options = fetchCall[1];
    expect(options.headers).toHaveProperty('Authorization');
    expect(options.headers.Authorization).toContain('Bearer');
    
    // Check result
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should handle backend response format { data: [...], meta: {...} }', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          { id: '1', first_name: 'John', last_name: 'Doe' },
          { id: '2', first_name: 'Jane', last_name: 'Smith' },
        ],
        meta: { count: 2, version: '2.0' },
      }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    const { enhancedApi } = await import('../enhanced-api');
    const result = await enhancedApi.technicians.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('id', '1');
    expect(result[0]).toHaveProperty('first_name', 'John');
  });

  it('should handle 404 error gracefully', async () => {
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

  it('should handle 401 authentication error', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({
        message: 'Unauthorized',
        statusCode: 401,
      }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    const { enhancedApi } = await import('../enhanced-api');
    const result = await enhancedApi.technicians.list();

    // Should return empty array on auth error
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { enhancedApi } = await import('../enhanced-api');
    const result = await enhancedApi.technicians.list();

    // Should return empty array on network error
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle empty response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [],
        meta: { count: 0 },
      }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    const { enhancedApi } = await import('../enhanced-api');
    const result = await enhancedApi.technicians.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

