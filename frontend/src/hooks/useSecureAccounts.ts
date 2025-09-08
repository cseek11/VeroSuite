import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secureApiClient } from '@/lib/secure-api-client';

/**
 * Secure hook for fetching accounts with automatic tenant isolation
 */
export function useSecureAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => secureApiClient.get('/accounts'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry authentication errors
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Secure hook for fetching a single account by ID
 */
export function useSecureAccount(accountId: string) {
  return useQuery({
    queryKey: ['accounts', accountId],
    queryFn: () => secureApiClient.get(`/accounts/${accountId}`),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Secure hook for creating accounts with automatic tenant isolation
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountData: any) => secureApiClient.post('/accounts', accountData),
    onSuccess: () => {
      // Invalidate accounts query to refetch data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error('Failed to create account:', error);
    },
  });
}

/**
 * Secure hook for updating accounts with automatic tenant isolation
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      secureApiClient.put(`/accounts/${id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate accounts queries
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update account:', error);
    },
  });
}

/**
 * Secure hook for deleting accounts with automatic tenant isolation
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => secureApiClient.delete(`/accounts/${accountId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error('Failed to delete account:', error);
    },
  });
}

/**
 * Secure hook for searching accounts with automatic tenant isolation
 */
export function useSearchAccounts(searchTerm: string) {
  return useQuery({
    queryKey: ['accounts', 'search', searchTerm],
    queryFn: () => secureApiClient.get(`/accounts/search?q=${encodeURIComponent(searchTerm)}`),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}




