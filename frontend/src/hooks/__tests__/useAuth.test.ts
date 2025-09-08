import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase-client';

// Mock Supabase client
vi.mock('../../lib/supabase-client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('useAuth', () => {
  const mockSupabaseAuth = vi.mocked(supabase.auth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'dispatcher',
        },
      };

      const mockSession = {
        user: mockUser,
        access_token: 'jwt-token',
      };

      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login errors', async () => {
      const mockError = { message: 'Invalid credentials' };
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'wrongpassword');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle logout errors', async () => {
      const mockError = { message: 'Logout failed' };
      mockSupabaseAuth.signOut.mockResolvedValue({ error: mockError });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.error).toBe('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when session exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'dispatcher',
        },
      };

      const mockSession = {
        user: mockUser,
        access_token: 'jwt-token',
      };

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
    });

    it('should return null when no session exists', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('auth state changes', () => {
    it('should handle auth state changes', () => {
      const mockCallback = vi.fn();
      mockSupabaseAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.onAuthStateChange(mockCallback);
      });

      expect(mockSupabaseAuth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('user permissions', () => {
    it('should check user permissions correctly', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'dispatcher',
        },
      };

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.hasPermission('manage_customers')).toBe(true);
      expect(result.current.hasPermission('admin_access')).toBe(false);
    });

    it('should return false for permissions when user is not authenticated', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.hasPermission('manage_customers')).toBe(false);
    });
  });

  describe('tenant context', () => {
    it('should return tenant ID from user metadata', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          tenant_id: 'tenant-123',
          role: 'dispatcher',
        },
      };

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.tenantId).toBe('tenant-123');
    });

    it('should return null tenant ID when user is not authenticated', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.tenantId).toBeNull();
    });
  });
});


