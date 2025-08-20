import { QueryClient } from '@tanstack/react-query';
import { config } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (only in production)
      refetchOnWindowFocus: config.app.environment === 'production',
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // Retry delay for mutations
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Query keys factory for consistent cache keys
export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // Jobs related queries
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
    today: (technicianId?: string) => [...queryKeys.jobs.all, 'today', technicianId] as const,
  },
  
  // Accounts related queries
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...queryKeys.accounts.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.accounts.lists(), filters] as const,
    details: () => [...queryKeys.accounts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.accounts.details(), id] as const,
  },
  
  // Locations related queries
  locations: {
    all: ['locations'] as const,
    lists: () => [...queryKeys.locations.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    byAccount: (accountId: string) => [...queryKeys.locations.all, 'byAccount', accountId] as const,
  },
  
  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Dashboard related queries
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
    recentActivity: ['dashboard', 'recentActivity'] as const,
    charts: ['dashboard', 'charts'] as const,
  },
  
  // File upload related queries
  uploads: {
    all: ['uploads'] as const,
    presignedUrl: (filename: string) => [...queryKeys.uploads.all, 'presigned', filename] as const,
  },
} as const;

// Utility function to invalidate related queries
export const invalidateQueries = {
  jobs: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all }),
  accounts: () => queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all }),
  locations: () => queryClient.invalidateQueries({ queryKey: queryKeys.locations.all }),
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics }),
  uploads: () => queryClient.invalidateQueries({ queryKey: queryKeys.uploads.all }),
  all: () => queryClient.invalidateQueries(),
};
