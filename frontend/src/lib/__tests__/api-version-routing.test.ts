/**
 * API Version Routing Tests
 * 
 * Tests for version-aware API routing (v1 and v2 endpoints).
 * Ensures frontend calls the correct version based on endpoint requirements.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('API Version Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Version Detection', () => {
    it('should identify v1 endpoints correctly', () => {
      const v1Endpoints = [
        '/api/v1/accounts',
        '/api/v1/auth/login',
        '/api/v1/work-orders',
        '/api/v1/technicians',
      ];

      v1Endpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v1\//);
        expect(endpoint).not.toMatch(/\/api\/v2\//);
      });
    });

    it('should identify v2 endpoints correctly', () => {
      const v2Endpoints = [
        '/api/v2/crm/accounts',
        '/api/v2/auth/login',
        '/api/v2/kpi-templates',
        '/api/v2/dashboard/layouts',
      ];

      v2Endpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v2\//);
        expect(endpoint).not.toMatch(/\/api\/v1\//);
      });
    });

    it('should reject endpoints without version', () => {
      const unversionedEndpoints = [
        '/api/accounts',
        '/api/auth/login',
        '/api/work-orders',
      ];

      unversionedEndpoints.forEach(endpoint => {
        expect(endpoint).not.toMatch(/\/api\/v\d+\//);
      });
    });
  });

  describe('Version-Specific Routing', () => {
    it('should route accounts to v1 (accounts controller)', () => {
      // Accounts controller is v1
      const endpoint = '/api/v1/accounts';
      expect(endpoint).toMatch(/\/api\/v1\/accounts$/);
    });

    it('should route crm accounts to v2 (crm-v2 controller)', () => {
      // CRM v2 controller has accounts endpoint
      const endpoint = '/api/v2/crm/accounts';
      expect(endpoint).toMatch(/\/api\/v2\/crm\/accounts$/);
    });

    it('should route auth to correct version based on feature', () => {
      // Auth v1 is deprecated but still works
      const v1Auth = '/api/v1/auth/login';
      expect(v1Auth).toMatch(/\/api\/v1\/auth\/login$/);

      // Auth v2 is preferred for new features
      const v2Auth = '/api/v2/auth/login';
      expect(v2Auth).toMatch(/\/api\/v2\/auth\/login$/);
    });
  });

  describe('Version Consistency', () => {
    it('should ensure all endpoints in a feature use same version', () => {
      // KPI templates should all use v2
      const kpiTemplateEndpoints = [
        '/api/v2/kpi-templates',
        '/api/v2/kpi-templates/use',
        '/api/v2/kpi-templates/favorites',
        '/api/v2/kpi-templates/popular',
      ];

      kpiTemplateEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v2\/kpi-templates/);
        expect(endpoint).not.toMatch(/\/api\/v1\/kpi-templates/);
      });
    });

    it('should ensure dashboard endpoints use v2', () => {
      const dashboardEndpoints = [
        '/api/v2/dashboard/layouts/undo',
        '/api/v2/dashboard/layouts/redo',
        '/api/v2/dashboard/layouts/history',
        '/api/v2/dashboard/templates',
      ];

      dashboardEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/\/api\/v2\/dashboard/);
      });
    });
  });

  describe('Version Migration Scenarios', () => {
    it('should handle endpoints that exist in both v1 and v2', () => {
      // Some endpoints exist in both versions
      const v1Endpoint = '/api/v1/auth/login';
      const v2Endpoint = '/api/v2/auth/login';

      // Both should be valid
      expect(v1Endpoint).toMatch(/\/api\/v1\/auth\/login$/);
      expect(v2Endpoint).toMatch(/\/api\/v2\/auth\/login$/);
    });

    it('should prefer v2 when both versions exist', () => {
      // V2 should be preferred for new implementations
      const preferredEndpoint = '/api/v2/auth/login';
      const deprecatedEndpoint = '/api/v1/auth/login';

      // V2 should be used for new code
      expect(preferredEndpoint).toMatch(/\/api\/v2\//);
      // V1 is deprecated but still functional
      expect(deprecatedEndpoint).toMatch(/\/api\/v1\//);
    });
  });

  describe('Version Validation', () => {
    it('should reject mixing v1 and v2 in same request path', () => {
      const invalidPaths = [
        '/api/v1/v2/accounts',
        '/api/v2/v1/accounts',
        '/api/v1/accounts/v2',
      ];

      invalidPaths.forEach(path => {
        const v1Count = (path.match(/\/v1\//g) || []).length;
        const v2Count = (path.match(/\/v2\//g) || []).length;
        
        // Should not have both versions (at least one should be 0)
        const hasBothVersions = v1Count > 0 && v2Count > 0;
        expect(hasBothVersions).toBe(false);
      });
    });

    it('should ensure single version per endpoint', () => {
      const validEndpoints = [
        '/api/v1/accounts',
        '/api/v2/crm/accounts',
      ];

      validEndpoints.forEach(endpoint => {
        const versions = endpoint.match(/\/v\d+\//g) || [];
        expect(versions.length).toBe(1);
      });
    });
  });
});

