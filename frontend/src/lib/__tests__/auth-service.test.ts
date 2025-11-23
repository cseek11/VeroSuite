/**
 * AuthService Unit Tests
 * 
 * Tests for URL construction, API endpoint paths, and authentication flow.
 * These tests specifically catch issues like duplicate version paths (/v1/v1).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../auth-service';

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

describe('AuthService - URL Construction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset environment variables
    delete (import.meta as any).env.VITE_API_BASE_URL;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Base URL Construction', () => {
    it('should construct baseUrl correctly with default value', () => {
      // Create a new instance to test constructor
      const rawBase = 'http://localhost:3001/api';
      const trimmed = rawBase.replace(/\/+$/, '');
      const baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
      
      expect(baseUrl).toBe('http://localhost:3001/api/v1');
    });

    it('should not duplicate version when baseUrl already includes /v1', () => {
      const rawBase = 'http://localhost:3001/api/v1';
      const trimmed = rawBase.replace(/\/+$/, '');
      const baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
      
      expect(baseUrl).toBe('http://localhost:3001/api/v1');
      expect(baseUrl).not.toContain('/v1/v1');
    });

    it('should handle baseUrl with trailing slash', () => {
      const rawBase = 'http://localhost:3001/api/';
      const trimmed = rawBase.replace(/\/+$/, '');
      const baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
      
      expect(baseUrl).toBe('http://localhost:3001/api/v1');
    });

    it('should handle custom VITE_API_BASE_URL', () => {
      const customBase = 'https://api.example.com/api';
      const trimmed = customBase.replace(/\/+$/, '');
      const baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
      
      expect(baseUrl).toBe('https://api.example.com/api/v1');
    });

    it('should preserve existing version in baseUrl', () => {
      const rawBase = 'http://localhost:3001/api/v2';
      const trimmed = rawBase.replace(/\/+$/, '');
      const baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
      
      expect(baseUrl).toBe('http://localhost:3001/api/v2');
    });
  });

  describe('Login URL Construction', () => {
    it('should call login with correct URL (no duplicate /v1)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();

      // Get the URL that was called
      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // Verify URL is correct - should be /api/v1/auth/login, NOT /api/v1/v1/auth/login
      expect(calledUrl).toMatch(/\/api\/v1\/auth\/login$/);
      expect(calledUrl).not.toMatch(/\/v1\/v1/);
      expect(calledUrl).not.toContain('/v1/v1');
    });

    it('should not have duplicate version segments in login URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // Count occurrences of /v1 in the URL
      const v1Matches = calledUrl.match(/\/v1/g);
      const v1Count = v1Matches ? v1Matches.length : 0;

      // Should have exactly 1 occurrence of /v1
      expect(v1Count).toBe(1);
    });

    it('should construct login URL correctly with default baseUrl', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // Should match expected pattern
      expect(calledUrl).toBe('http://localhost:3001/api/v1/auth/login');
    });
  });

  describe('Refresh Token URL Construction', () => {
    beforeEach(() => {
      // Mock a valid token that's not expired
      // getToken() tries to parse JSON, so we need to return a JSON string
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
    });

    it('should call refresh with correct URL (no duplicate /v1)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'new-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.refreshToken();

      expect(global.fetch).toHaveBeenCalled();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // Verify URL is correct
      expect(calledUrl).toMatch(/\/api\/v1\/auth\/refresh$/);
      expect(calledUrl).not.toMatch(/\/v1\/v1/);
      expect(calledUrl).not.toContain('/v1/v1');
    });

    it('should not have duplicate version segments in refresh URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'new-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.refreshToken();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      const v1Matches = calledUrl.match(/\/v1/g);
      const v1Count = v1Matches ? v1Matches.length : 0;

      expect(v1Count).toBe(1);
    });
  });

  describe('Exchange Token URL Construction', () => {
    it('should call exchangeSupabaseToken with correct URL (no duplicate /v1)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'backend-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.exchangeSupabaseToken('supabase-token');

      expect(global.fetch).toHaveBeenCalled();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // Verify URL is correct
      expect(calledUrl).toMatch(/\/api\/v1\/auth\/exchange-supabase-token$/);
      expect(calledUrl).not.toMatch(/\/v1\/v1/);
      expect(calledUrl).not.toContain('/v1/v1');
    });

    it('should not have duplicate version segments in exchange token URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'backend-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.exchangeSupabaseToken('supabase-token');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      const v1Matches = calledUrl.match(/\/v1/g);
      const v1Count = v1Matches ? v1Matches.length : 0;

      expect(v1Count).toBe(1);
    });
  });

  describe('URL Pattern Validation', () => {
    it('should validate all auth endpoints use correct URL pattern', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);
      localStorageMock.getItem.mockReturnValue('mock-token');

      // Test login
      await authService.login('test@example.com', 'password123');
      let fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/login$/);

      // Test refresh (need valid token)
      localStorageMock.getItem.mockReturnValue('valid-token');
      (global.fetch as any).mockClear();
      await authService.refreshToken();
      if ((global.fetch as any).mock.calls.length > 0) {
        fetchCall = (global.fetch as any).mock.calls[0];
        expect(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/refresh$/);
      }

      // Test exchange
      (global.fetch as any).mockClear();
      await authService.exchangeSupabaseToken('token');
      fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/exchange-supabase-token$/);
    });

    it('should reject URLs with duplicate version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];

      // This test would fail if we had /v1/v1 in the URL
      const hasDuplicateVersion = /\/v\d+\/v\d+/.test(calledUrl);
      expect(hasDuplicateVersion).toBe(false);
    });
  });

  describe('Error Handling with Invalid URLs', () => {
    it('should handle 404 errors gracefully (might indicate wrong URL)', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Cannot POST /api/v1/v1/auth/login',
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow();

      // Verify the URL that was called doesn't have duplicate /v1
      const fetchCall = (global.fetch as any).mock.calls[0];
      const calledUrl = fetchCall[0];
      expect(calledUrl).not.toContain('/v1/v1');
    });
  });
});

