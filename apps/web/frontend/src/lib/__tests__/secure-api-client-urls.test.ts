/**
 * SecureApiClient URL Construction Tests
 * 
 * Tests for URL construction, API endpoint paths, and versioning.
 * These tests catch issues like missing version prefixes or duplicate versions.
 * 
 * Pattern: Similar to auth-service.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { secureApiClient } from '../secure-api-client';

// Mock fetch globally
global.fetch = vi.fn();

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

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

describe('SecureApiClient - URL Construction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Base URL Configuration', () => {
    it('should use default baseUrl when VITE_API_BASE_URL is not set', () => {
      // The baseUrl is set in constructor, so we test the actual calls
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      secureApiClient.getAllAccounts();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toMatch(/^http:\/\/localhost:3001\/api/);
    });
  });

  describe('Accounts Endpoint URLs', () => {
    it('should call getAllAccounts with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      try {
        await secureApiClient.getAllAccounts();
      } catch (error) {
        // Ignore auth errors for URL testing
      }

      // Check if fetch was called
      expect(global.fetch).toHaveBeenCalled();
      const fetchCall = (global.fetch as any).mock.calls[0];
      if (!fetchCall) {
        throw new Error('fetch was not called - check auth mock setup');
      }
      const url = fetchCall[0];

      // Critical: Should include /v1/ prefix
      expect(url).toBe('http://localhost:3001/api/v1/accounts');
      expect(url).not.toBe('http://localhost:3001/api/accounts');
      expect(url).not.toContain('/v1/v1');
    });

    it('should call getAccountById with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ id: 'account-1' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.accounts.getById('account-1');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
      expect(url).not.toContain('/v1/v1');
    });

    it('should call createAccount with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ id: 'account-1' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.accounts.create({ name: 'Test Account' });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toBe('http://localhost:3001/api/v1/accounts');
      expect(url).not.toContain('/v1/v1');
    });

    it('should call updateAccount with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ id: 'account-1' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.accounts.update('account-1', { name: 'Updated' });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
      expect(url).not.toContain('/v1/v1');
    });

    it('should call deleteAccount with correct versioned URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.accounts.delete('account-1');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      expect(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
      expect(url).not.toContain('/v1/v1');
    });
  });

  describe('URL Pattern Validation', () => {
    it('should validate all accounts endpoints use versioned URLs', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      // Test all accounts methods
      await secureApiClient.getAllAccounts();
      let url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts$/);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.getById('test-id');
      url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts\/.+/);

      (global.fetch as any).mockClear();
      await secureApiClient.accounts.create({});
      url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts$/);
    });

    it('should support version-specific routing (v1 or v2)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();
      const url = (global.fetch as any).mock.calls[0][0];

      // Should use either v1 or v2, but not both
      const hasV1 = url.includes('/v1/');
      const hasV2 = url.includes('/v2/');
      
      // Should have exactly one version
      expect(hasV1 || hasV2).toBe(true);
      expect(hasV1 && hasV2).toBe(false);
    });

    it('should reject URLs without version prefix', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // Should NOT match unversioned URL
      expect(url).not.toMatch(/\/api\/accounts$/);
      expect(url).toMatch(/\/api\/v\d+\/accounts$/);
    });

    it('should reject URLs with duplicate version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // Should NOT have duplicate /v1/v1
      expect(url).not.toContain('/v1/v1');
      expect(url).not.toMatch(/\/v\d+\/v\d+/);

      // Count version segments
      const versionMatches = url.match(/\/v\d+/g);
      const versionCount = versionMatches ? versionMatches.length : 0;
      expect(versionCount).toBe(1);
    });
  });

  describe('Regression Tests', () => {
    it('should prevent /api/accounts bug (missing version)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // This would catch the bug: "Cannot GET /api/accounts"
      expect(url).not.toBe('http://localhost:3001/api/accounts');
      expect(url).toBe('http://localhost:3001/api/v1/accounts');
    });

    it('should prevent /api/v1/v1/accounts bug (duplicate version)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await secureApiClient.getAllAccounts();

      const url = (global.fetch as any).mock.calls[0][0];

      // This would catch the duplicate version bug
      const hasDuplicateVersion = /\/v\d+\/v\d+/.test(url);
      expect(hasDuplicateVersion).toBe(false);
      expect(url).not.toContain('/v1/v1');
    });
  });
});

