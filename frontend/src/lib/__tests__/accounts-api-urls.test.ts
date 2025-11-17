/**
 * AccountsApi URL Construction Tests
 * 
 * Tests for accounts-api.ts URL construction and versioning.
 * Similar pattern to auth-service.test.ts and secure-api-client-urls.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { accountsApi } from '../accounts-api';

// Mock fetch globally
global.fetch = vi.fn();

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
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

describe('AccountsApi - URL Construction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: 'test-token' }));
  });

  describe('Base URL Configuration', () => {
    it('should construct baseUrl with version prefix', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // Should include /v1/ in the URL
      expect(url).toMatch(/\/api\/v1\/accounts/);
      expect(url).not.toMatch(/\/api\/accounts[^/]/);
    });
  });

  describe('Get Accounts URL', () => {
    it('should call getAccounts with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // URL may have trailing ? from empty query params, which is fine
      expect(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/accounts(\?)?$/);
      expect(url).not.toBe('http://localhost:3001/api/accounts');
      expect(url).not.toContain('/v1/v1');
    });

    it('should include query parameters correctly', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts({ page: 1, limit: 10, search: 'test' });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toContain('/api/v1/accounts?');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
      expect(url).toContain('search=test');
    });
  });

  describe('URL Pattern Validation', () => {
    it('should match expected URL pattern for accounts endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const url = (global.fetch as any).mock.calls[0][0];
      const pattern = /^https?:\/\/.+\/api\/v1\/accounts(\?.*)?$/;

      expect(url).toMatch(pattern);
    });

    it('should reject URLs without version prefix', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // Should NOT match unversioned pattern
      expect(url).not.toMatch(/\/api\/accounts(\?|$)/);
      expect(url).toMatch(/\/api\/v\d+\/accounts/);
    });

    it('should reject URLs with duplicate version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      expect(url).not.toContain('/v1/v1');
      expect(url).not.toMatch(/\/v\d+\/v\d+/);

      const versionMatches = url.match(/\/v\d+/g);
      expect(versionMatches?.length).toBe(1);
    });
  });

  describe('Regression Tests', () => {
    it('should prevent /api/accounts bug (missing version)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accounts: [], pagination: {} }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await accountsApi.getAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // This would catch: "Cannot GET /api/accounts"
      expect(url).not.toBe('http://localhost:3001/api/accounts');
      // URL may have trailing ? from empty query params, which is fine
      expect(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/accounts(\?)?$/);
    });
  });
});

