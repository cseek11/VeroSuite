import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, getCurrentUser } from '@/lib/api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/auth';
import { LoginFormData } from '@/lib/validation';

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: getCurrentUser,
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
      const result = await login(credentials.email, credentials.password);
      return { ...result, tenantId: credentials.tenantId };
    },
    onSuccess: (data) => {
      setAuth({ 
        token: data.access_token, 
        tenantId: data.tenantId, 
        user: data.user 
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
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      // Clear all queries
      queryClient.clear();
    },
  });
};
