/**
 * API Route Compatibility Tests
 * 
 * Integration tests that verify frontend API calls match backend routes.
 * This test suite would catch URL mismatches like /api/accounts vs /api/v1/accounts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { secureApiClient } from '@/lib/secure-api-client';
import { accountsApi } from '@/lib/accounts-api';

// Mock fetch globally
global.fetch = vi.fn();

// Mock authService
vi.mock('@/lib/auth-service', () => ({
  authService: {
    isAuthenticated: vi.fn().mockReturnValue(true),
    getAuthHeaders: vi.fn().mockResolvedValue({
      'Authorization': 'Bearer test-token',
      'Content-Type': 'application/json',
      'x-tenant-id': 'test-tenant',
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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('API Route Compatibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
  });

  describe('Frontend/Backend Route Matching', () => {
    it('should verify secureApiClient accounts endpoints use /v1/', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      // Test all accounts methods
      await secureApiClient.getAllAccounts();
      let url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/\/api\/v1\/accounts$/);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.getById('test-id');
      url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/\/api\/v\d+\/accounts\/test-id$/);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.create({});
      url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/\/api\/v\d+\/accounts$/);
    });

    it('should verify accountsApi uses /v1/', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/\/api\/v1\/accounts/);
    });
  });

  describe('Version Consistency', () => {
    it('should ensure all accounts endpoints use same version', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const urls: string[] = [];

      await secureApiClient.getAllAccounts();
      urls.push((global.fetch as any).mock.calls[0][0]);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.getById('id');
      urls.push((global.fetch as any).mock.calls[0][0]);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.create({});
      urls.push((global.fetch as any).mock.calls[0][0]);

      // All URLs should use /v1/
      urls.forEach(url => {
        expect(url).toMatch(/\/api\/v1\//);
        expect(url).not.toMatch(/\/api\/v2\//);
      });
    });
  });

  describe('Route Pattern Validation', () => {
    it('should validate route patterns match backend expectations', async () => {
      // Expected backend routes (from accounts.controller.ts)
      const expectedRoutes = {
        getAll: /^https?:\/\/.+\/api\/v1\/accounts$/,
        getById: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
        create: /^https?:\/\/.+\/api\/v1\/accounts$/,
        update: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
        delete: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
      };

      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();
      expect((global.fetch as any).mock.calls[0][0]).toMatch(expectedRoutes.getAll);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.getById('test-id');
      expect((global.fetch as any).mock.calls[0][0]).toMatch(expectedRoutes.getById);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.create({});
      expect((global.fetch as any).mock.calls[0][0]).toMatch(expectedRoutes.create);
    });
  });

  describe('Error Prevention', () => {
    it('should prevent 404 errors from route mismatches', async () => {
      // These URLs would cause 404 errors
      const invalidPatterns = [
        /\/api\/accounts$/,           // Missing version
        /\/api\/v1\/v1\/accounts/,   // Duplicate version
        /\/api\/v2\/accounts/,       // Wrong version
      ];

      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();
      const url = (global.fetch as any).mock.calls[0][0];

      // Verify URL doesn't match any invalid patterns
      invalidPatterns.forEach(pattern => {
        expect(url).not.toMatch(pattern);
      });
    });
  });
});

