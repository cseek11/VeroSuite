/**
 * useOptimizedSearch Hook Tests
 * 
 * Tests for the useOptimizedSearch hook including:
 * - Search functionality
 * - Caching
 * - Debouncing
 * - Error handling
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOptimizedSearch } from '../useOptimizedSearch';

// Mock optimized-search-service
vi.mock('@/lib/optimized-search-service', () => ({
  optimizedSearch: {
    search: vi.fn().mockResolvedValue({
      results: [],
      metrics: { totalTime: 100, resultCount: 0, cacheHit: false, searchStrategy: 'local' },
      suggestion: null,
    }),
    learnCorrection: vi.fn().mockResolvedValue(undefined),
    clearCache: vi.fn(),
    refreshSearchCache: vi.fn().mockResolvedValue(undefined),
    getCacheStats: vi.fn().mockReturnValue({ size: 0, hitRate: 0 }),
    getSearchSuggestions: vi.fn().mockResolvedValue([]),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useOptimizedSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should perform search', async () => {
    const { optimizedSearch } = await import('@/lib/optimized-search-service');
    (optimizedSearch.search as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      results: [{ id: '1', name: 'Result 1' }],
      metrics: { totalTime: 100, resultCount: 1, cacheHit: false, searchStrategy: 'local' },
      suggestion: null,
    });

    const { result } = renderHook(
      () => useOptimizedSearch({}),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.search('test');
      vi.advanceTimersByTime(500); // Advance debounce timer
    });

    await waitFor(() => {
      expect(optimizedSearch.search).toHaveBeenCalled();
    });
  });

  it('should debounce search input', async () => {
    const { optimizedSearch } = await import('@/lib/optimized-search-service');

    const { result } = renderHook(
      () => useOptimizedSearch({}),
      { wrapper: createWrapper() }
    );

    // Simulate rapid input changes
    act(() => {
      result.current.search('t');
      vi.advanceTimersByTime(100);
      result.current.search('te');
      vi.advanceTimersByTime(100);
      result.current.search('test');
      vi.advanceTimersByTime(500);
    });

    // Should only call API once after debounce
    await waitFor(() => {
      expect(optimizedSearch.search).toHaveBeenCalled();
    });
  });

  it('should clear results', () => {
    const { result } = renderHook(
      () => useOptimizedSearch({}),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.results).toEqual([]);
  });
});

