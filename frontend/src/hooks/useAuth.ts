import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/enhanced-api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/auth';
import { LoginFormData } from '@/lib/validation';

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};

// Hook to login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const result = await authApi.signIn(credentials.email, credentials.password);
      return result; // Remove tenantId from here
    },
    onSuccess: (data) => {
      setAuth({ 
        token: data.access_token, 
        user: data.user 
        // tenantId will be resolved from user metadata
      });
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

// Hook to logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clear);
  
  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      clearAuth();
      // Clear all queries
      queryClient.clear();
    },
  });
};
