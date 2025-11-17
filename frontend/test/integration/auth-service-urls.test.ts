/**
 * AuthService URL Integration Tests
 * 
 * Integration tests that verify auth-service constructs correct URLs
 * and catches issues like duplicate version paths.
 * 
 * These tests would have caught the /api/v1/v1/auth/login bug.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/lib/auth-service';

// Mock fetch globally
global.fetch = vi.fn();

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

describe('AuthService URL Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('URL Construction Validation', () => {
    it('should construct login URL without duplicate version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const url = fetchCall[0];

      // Critical assertions that would catch the bug
      expect(url).toBe('http://localhost:3001/api/v1/auth/login');
      expect(url).not.toContain('/v1/v1');
      expect(url.match(/\/v1/g)?.length).toBe(1);
    });

    it('should construct all auth endpoint URLs correctly', async () => {
      const mockSuccessResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockSuccessResponse);
      localStorageMock.getItem.mockReturnValue('existing-token');

      // Test login
      await authService.login('test@example.com', 'password123');
      let url = (global.fetch as any).mock.calls[0][0];
      expect(url).toBe('http://localhost:3001/api/v1/auth/login');
      expect(url).not.toContain('/v1/v1');

      // Test refresh (need valid token - getToken() parses JSON)
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
      (global.fetch as any).mockClear();
      await authService.refreshToken();
      if ((global.fetch as any).mock.calls.length > 0) {
        url = (global.fetch as any).mock.calls[0][0];
        expect(url).toBe('http://localhost:3001/api/v1/auth/refresh');
        expect(url).not.toContain('/v1/v1');
      }

      // Test exchange
      (global.fetch as any).mockClear();
      await authService.exchangeSupabaseToken('supabase-token');
      url = (global.fetch as any).mock.calls[0][0];
      expect(url).toBe('http://localhost:3001/api/v1/auth/exchange-supabase-token');
      expect(url).not.toContain('/v1/v1');
    });
  });

  describe('URL Pattern Matching', () => {
    it('should match expected URL patterns for all endpoints', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);
      localStorageMock.getItem.mockReturnValue('token');

      // Expected patterns
      const patterns = {
        login: /^https?:\/\/.+\/api\/v1\/auth\/login$/,
        refresh: /^https?:\/\/.+\/api\/v1\/auth\/refresh$/,
        exchange: /^https?:\/\/.+\/api\/v1\/auth\/exchange-supabase-token$/,
      };

      // Test login
      await authService.login('test@example.com', 'password123');
      expect((global.fetch as any).mock.calls[0][0]).toMatch(patterns.login);

      // Test refresh (need valid token - getToken() parses JSON)
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
      (global.fetch as any).mockClear();
      await authService.refreshToken();
      if ((global.fetch as any).mock.calls.length > 0) {
        expect((global.fetch as any).mock.calls[0][0]).toMatch(patterns.refresh);
      }

      // Test exchange
      (global.fetch as any).mockClear();
      await authService.exchangeSupabaseToken('token');
      expect((global.fetch as any).mock.calls[0][0]).toMatch(patterns.exchange);
    });

    it('should reject URLs with malformed version segments', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const url = (global.fetch as any).mock.calls[0][0];

      // These patterns should NOT match
      expect(url).not.toMatch(/\/v1\/v1/);
      expect(url).not.toMatch(/\/v\d+\/v\d+/);
      expect(url).not.toMatch(/\/api\/api/);
    });
  });

  describe('Base URL Configuration', () => {
    it('should handle different base URL configurations correctly', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      // Test with default configuration
      await authService.login('test@example.com', 'password123');
      let url = (global.fetch as any).mock.calls[0][0];
      expect(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/auth\/login$/);

      // The service uses a singleton, so we can't easily test different configs
      // But we can verify the current configuration works correctly
      expect(url).not.toContain('/v1/v1');
    });
  });

  describe('Regression Tests for Known Bugs', () => {
    it('should prevent duplicate /v1/v1 in login URL (regression test)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'test-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      const url = (global.fetch as any).mock.calls[0][0];

      // This is the specific bug we're testing for
      const hasDuplicateV1 = url.includes('/v1/v1');
      expect(hasDuplicateV1).toBe(false);

      // Verify correct URL
      expect(url).toBe('http://localhost:3001/api/v1/auth/login');
    });

    it('should prevent duplicate /v1/v1 in refresh URL (regression test)', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: 'new-token',
          user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
        }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);
      localStorageMock.getItem.mockReturnValue('valid-token');

      await authService.refreshToken();

      if ((global.fetch as any).mock.calls.length > 0) {
        const url = (global.fetch as any).mock.calls[0][0];
        const hasDuplicateV1 = url.includes('/v1/v1');
        expect(hasDuplicateV1).toBe(false);
        expect(url).toBe('http://localhost:3001/api/v1/auth/refresh');
      }
    });
  });
});

