/**
 * useJobs Hook Tests
 * 
 * Tests for the useJobs hook including:
 * - Job fetching
 * - Filtering
 * - Mutations
 * - Status updates
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '../useJobs';

// Mock fetch
global.fetch = vi.fn();

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
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

describe('useJobs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('verofield_auth', JSON.stringify({ token: 'mock-token' }));
  });

  describe('useJobs', () => {
    it('should fetch jobs', async () => {
      const mockJobs = {
        data: [
          { id: 'job-1', status: 'scheduled' },
          { id: 'job-2', status: 'completed' },
        ],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockJobs,
      });

      const { result } = renderHook(() => useJobs(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
    });

    it('should filter jobs by technician', async () => {
      const mockJobs = {
        data: [{ id: 'job-1', technician_id: 'tech-1' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockJobs,
      });

      const { result } = renderHook(() => useJobs({ technician_id: 'tech-1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('technician_id=tech-1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('useCreateJob', () => {
    it('should create job', async () => {
      const mockJob = { id: 'job-1', status: 'scheduled' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockJob,
      });

      const { result } = renderHook(() => useCreateJob(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.mutateAsync({
          work_order_id: 'wo-1',
          account_id: 'account-1',
          location_id: 'loc-1',
          scheduled_date: '2024-01-01',
        });
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/jobs'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('useUpdateJob', () => {
    it('should update job', async () => {
      const mockJob = { id: 'job-1', status: 'in-progress' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockJob,
      });

      const { result } = renderHook(() => useUpdateJob(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.mutateAsync({
          id: 'job-1',
          data: { status: 'in-progress' },
        });
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/jobs/job-1'),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('useDeleteJob', () => {
    it('should delete job', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: 'Job deleted' }),
      });

      const { result } = renderHook(() => useDeleteJob(), {
        wrapper: createWrapper(),
      });

      await waitFor(async () => {
        await result.current.mutateAsync('job-1');
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/jobs/job-1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});

