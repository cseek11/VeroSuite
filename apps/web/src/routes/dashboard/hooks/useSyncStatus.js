"use strict";
/**
 * Sync status management hook
 * Tracks when operations are syncing to server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSyncStatus = void 0;
var react_1 = require("react");
var useSyncStatus = function () {
    var _a = (0, react_1.useState)('idle'), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(null), lastSynced = _b[0], setLastSynced = _b[1];
    var _c = (0, react_1.useState)(null), errorMessage = _c[0], setErrorMessage = _c[1];
    var syncTimeoutRef = (0, react_1.useRef)(null);
    // Monitor online/offline status
    (0, react_1.useEffect)(function () {
        var handleOnline = function () {
            if (status === 'offline') {
                setStatus('idle');
            }
        };
        var handleOffline = function () {
            setStatus('offline');
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Check initial status
        if (!navigator.onLine) {
            setStatus('offline');
        }
        return function () {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [status]);
    var startSync = (0, react_1.useCallback)(function () {
        if (status === 'offline')
            return;
        setStatus('syncing');
        setErrorMessage(null);
        // Clear any existing timeout
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }
        // Auto-timeout after 10 seconds
        syncTimeoutRef.current = setTimeout(function () {
            setStatus('error');
            setErrorMessage('Sync timeout - please check your connection');
        }, 10000);
    }, [status]);
    var completeSync = (0, react_1.useCallback)(function () {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
        }
        setStatus('synced');
        setLastSynced(new Date());
        setErrorMessage(null);
        // Reset to idle after 2 seconds
        setTimeout(function () {
            setStatus(function (prev) { return prev === 'synced' ? 'idle' : prev; });
        }, 2000);
    }, []);
    var setError = (0, react_1.useCallback)(function (message) {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
        }
        setStatus('error');
        setErrorMessage(message);
        // Auto-recover after 5 seconds
        setTimeout(function () {
            setStatus('idle');
            setErrorMessage(null);
        }, 5000);
    }, []);
    var setOffline = (0, react_1.useCallback)(function () {
        setStatus('offline');
    }, []);
    var setOnline = (0, react_1.useCallback)(function () {
        if (status === 'offline') {
            setStatus('idle');
        }
    }, [status]);
    return {
        status: status,
        lastSynced: lastSynced,
        errorMessage: errorMessage,
        startSync: startSync,
        completeSync: completeSync,
        setError: setError,
        setOffline: setOffline,
        setOnline: setOnline,
    };
};
exports.useSyncStatus = useSyncStatus;
