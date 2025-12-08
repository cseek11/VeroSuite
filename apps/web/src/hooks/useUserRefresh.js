"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserRefresh = useUserRefresh;
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
/**
 * Hook to periodically refresh user data and token
 * Refreshes every 5 minutes when user is authenticated and app is active
 */
function useUserRefresh() {
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    var token = (0, auth_1.useAuthStore)(function (s) { return s.token; });
    var refreshUser = (0, auth_1.useAuthStore)(function (s) { return s.refreshUser; });
    var intervalRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
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
        var currentPath = window.location.pathname;
        var initialRefreshTimeout = null;
        if (currentPath !== '/login') {
            initialRefreshTimeout = setTimeout(function () {
                // Double-check we're still not on login page before refreshing
                if (window.location.pathname !== '/login') {
                    refreshUser().catch(function (error) {
                        // Don't log as error if it's just a network issue or token not ready yet
                        if (error instanceof Error && !error.message.includes('Failed to refresh')) {
                            logger_1.logger.error('Error in initial user refresh', error, 'useUserRefresh');
                        }
                        else {
                            logger_1.logger.debug('Initial refresh skipped or failed (may be normal after login)', {}, 'useUserRefresh');
                        }
                    });
                }
            }, 5000); // Wait 5 seconds after mount before first refresh (longer delay)
        }
        // Set up periodic refresh (every 5 minutes)
        intervalRef.current = setInterval(function () {
            // Don't refresh if we're on login page
            if (window.location.pathname !== '/login') {
                refreshUser().catch(function (error) {
                    logger_1.logger.error('Error in periodic user refresh', error, 'useUserRefresh');
                });
            }
        }, 5 * 60 * 1000); // 5 minutes
        // Cleanup on unmount or when user/token changes
        return function () {
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
