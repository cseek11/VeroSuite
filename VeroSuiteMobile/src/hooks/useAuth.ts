// ============================================================================
// VeroField Mobile App - Authentication Hook
// ============================================================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthState, LoginCredentials, User, AppError } from '../types';
import authService from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const queryClient = useQueryClient();

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const isAuthenticated = await authService.isAuthenticated();
      const user = await authService.getStoredUser();
      const token = await authService.getStoredToken();

      setAuthState({
        user,
        token,
        isAuthenticated,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: AppError) => {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error: AppError) => {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      queryClient.clear();
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (token) => {
      if (token) {
        setAuthState(prev => ({
          ...prev,
          token,
        }));
      } else {
        // Token refresh failed, logout user
        logoutMutation.mutate();
      }
    },
    onError: () => {
      // Token refresh failed, logout user
      logoutMutation.mutate();
    },
  });

  // Login function
  const login = (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    loginMutation.mutate(credentials);
  };

  // Logout function
  const logout = () => {
    logoutMutation.mutate();
  };

  // Refresh token function
  const refreshToken = () => {
    refreshTokenMutation.mutate();
  };

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    
    // Actions
    login,
    logout,
    refreshToken,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshingToken: refreshTokenMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    refreshError: refreshTokenMutation.error,
  };
};

// User query hook
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getStoredUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly called
  });
};

export default useAuth;
