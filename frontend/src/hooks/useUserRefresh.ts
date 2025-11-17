import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

/**
 * Hook to periodically refresh user data and token
 * Refreshes every 5 minutes when user is authenticated and app is active
 */
export function useUserRefresh() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only set up refresh if user is authenticated
    if (!user || !token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Don't refresh immediately on mount - wait longer to ensure auth is stable
    // This prevents issues right after login
    // Only refresh if we're not on the login page
    const currentPath = window.location.pathname;
    let initialRefreshTimeout: NodeJS.Timeout | null = null;
    
    if (currentPath !== '/login') {
      initialRefreshTimeout = setTimeout(() => {
        // Double-check we're still not on login page before refreshing
        if (window.location.pathname !== '/login') {
          refreshUser().catch((error) => {
            // Don't log as error if it's just a network issue or token not ready yet
            if (error instanceof Error && !error.message.includes('Failed to refresh')) {
              logger.error('Error in initial user refresh', error, 'useUserRefresh');
            } else {
              logger.debug('Initial refresh skipped or failed (may be normal after login)', {}, 'useUserRefresh');
            }
          });
        }
      }, 5000); // Wait 5 seconds after mount before first refresh (longer delay)
    }

    // Set up periodic refresh (every 5 minutes)
    intervalRef.current = setInterval(() => {
      // Don't refresh if we're on login page
      if (window.location.pathname !== '/login') {
        refreshUser().catch((error) => {
          logger.error('Error in periodic user refresh', error, 'useUserRefresh');
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup on unmount or when user/token changes
    return () => {
      if (initialRefreshTimeout) {
        clearTimeout(initialRefreshTimeout);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, token, refreshUser]);
}

