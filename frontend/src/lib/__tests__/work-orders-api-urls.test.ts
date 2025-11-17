/**
 * Work Orders API URL Construction Tests
 * 
 * Tests to ensure work orders API calls use correct versioned endpoints
 * and prevent bugs like "Cannot GET /api/work-orders"
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { workOrdersApi } from '../work-orders-api';

// Mock fetch globally
global.fetch = vi.fn() as any;

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

describe('WorkOrdersApi - URL Construction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    localStorageMock.clear();
    
    // Set up localStorage values
    localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'mock-token' }));
    localStorageMock.setItem('tenantId', '7193113e-ece2-4f7b-ae8c-176df4367e28');
  });

  describe('Base URL Configuration', () => {
    it('should construct URLs with version prefix', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // Should include /v1/ in the URL
      expect(url).toMatch(/\/api\/v1\/work-orders/);
      expect(url).not.toMatch(/\/api\/work-orders[^/]/);
    });
  });

  describe('Get Work Orders URL', () => {
    it('should call getWorkOrders with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders({ page: 1, limit: 20 });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // URL may have trailing ? from empty query params, which is fine
      expect(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/work-orders/);
      expect(url).not.toBe('http://localhost:3001/api/work-orders');
      expect(url).not.toContain('/v1/v1');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
    });

    it('should include query parameters correctly', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders({
        page: 1,
        limit: 20,
        status: 'pending',
        priority: 'high',
      });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toContain('/api/v1/work-orders');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
      expect(url).toContain('status=pending');
      expect(url).toContain('priority=high');
    });
  });

  describe('URL Pattern Validation', () => {
    it('should match expected URL pattern for work orders endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      const pattern = /^https?:\/\/.+\/api\/v1\/work-orders(\?.*)?$/;
      expect(url).toMatch(pattern);
    });

    it('should reject URLs without version prefix', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // Should NOT match unversioned pattern
      expect(url).not.toMatch(/\/api\/work-orders(\?|$)/);
      expect(url).toMatch(/\/api\/v\d+\/work-orders/);
    });

    it('should reject URLs with duplicate version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      const versionMatches = url.match(/\/v\d+/g);
      expect(versionMatches?.length).toBe(1);
    });
  });

  describe('Regression Tests', () => {
    it('should prevent /api/work-orders bug (missing version)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrders({ page: 1, limit: 20 });

      const url = (global.fetch as any).mock.calls[0][0];

      // This would catch: "Cannot GET /api/work-orders?page=1&limit=20"
      expect(url).not.toBe('http://localhost:3001/api/work-orders');
      // URL may have trailing ? from empty query params, which is fine
      expect(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/work-orders/);
    });
  });
});

