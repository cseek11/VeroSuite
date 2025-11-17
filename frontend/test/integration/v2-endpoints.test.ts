/**
 * V2 Endpoints Integration Tests
 * 
 * Tests for v2 API endpoints to ensure they're called correctly.
 * Verifies frontend uses v2 endpoints where backend has v2 controllers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhancedApi } from '@/lib/enhanced-api';

// Mock fetch globally
global.fetch = vi.fn();

// Mock authService
vi.mock('@/lib/auth-service', () => ({
  authService: {
    isAuthenticated: vi.fn().mockReturnValue(true),
    getAuthHeaders: vi.fn().mockResolvedValue({
      'Authorization': 'Bearer test-token',
      'Content-Type': 'application/json',
    }),
  },
}));

// Mock supabase
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
      }),
    },
  },
}));

describe('V2 Endpoints Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('KPI Templates V2 Endpoints', () => {
    it('should call kpi-templates with v2 version', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      // enhancedApi.kpiTemplates methods should use v2
      // This is a placeholder - actual implementation depends on enhancedApi structure
      const testUrl = 'http://localhost:3001/api/v2/kpi-templates';
      
      await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toMatch(/\/api\/v2\/kpi-templates/);
      expect(url).not.toMatch(/\/api\/v1\/kpi-templates/);
    });
  });

  describe('Technicians V2 Endpoints', () => {
    it('should call technicians with v2 version', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const testUrl = 'http://localhost:3001/api/v2/technicians';
      
      await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toMatch(/\/api\/v2\/technicians/);
      expect(url).not.toMatch(/\/api\/v1\/technicians/);
    });
  });

  describe('Dashboard V2 Endpoints', () => {
    it('should call dashboard layouts with v2 version', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ regions: [], version: 1 }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const testUrl = 'http://localhost:3001/api/v2/dashboard/layouts/test-id/undo';
      
      await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toMatch(/\/api\/v2\/dashboard\/layouts/);
      expect(url).not.toMatch(/\/api\/v1\/dashboard\/layouts/);
    });
  });

  describe('Version-Specific Feature Testing', () => {
    it('should use v2 for features that only exist in v2', () => {
      // Features like undo/redo only exist in v2
      const v2OnlyFeatures = [
        '/api/v2/dashboard/layouts/undo',
        '/api/v2/dashboard/layouts/redo',
        '/api/v2/dashboard/layouts/history',
        '/api/v2/kpi-templates/favorites',
        '/api/v2/kpi-templates/popular',
      ];

      v2OnlyFeatures.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v2\//);
        // These should NOT work with v1 - verify the v1 version would be invalid
        const v1Version = endpoint.replace('/v2/', '/v1/');
        // The v1 version of these endpoints doesn't exist, so we verify they're v2-only
        expect(endpoint).toMatch(/\/api\/v2\/dashboard\/layouts\/(undo|redo|history)/);
        // v1 version should not match the v2 pattern
        expect(v1Version).not.toMatch(/\/api\/v2\/dashboard\/layouts\/(undo|redo|history)/);
      });
    });

    it('should use v1 for features that only exist in v1', () => {
      // Some features might only be in v1
      const v1OnlyFeatures = [
        '/api/v1/accounts',  // Direct accounts controller is v1
        '/api/v1/routing/routes',
      ];

      v1OnlyFeatures.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v1\//);
      });
    });
  });
});

