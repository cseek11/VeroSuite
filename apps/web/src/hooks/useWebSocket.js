"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
var react_1 = require("react");
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
function useWebSocket(options) {
    if (options === void 0) { options = {}; }
    var _a = options.namespace, namespace = _a === void 0 ? '/kpi-updates' : _a, _b = options.autoConnect, autoConnect = _b === void 0 ? true : _b, _c = options.reconnectAttempts, reconnectAttempts = _c === void 0 ? 5 : _c, _d = options.reconnectDelay, reconnectDelay = _d === void 0 ? 1000 : _d;
    var _e = (0, auth_1.useAuthStore)(), token = _e.token, tenantId = _e.tenantId;
    var socketRef = (0, react_1.useRef)(null);
    var _f = (0, react_1.useState)(false), isConnected = _f[0], setIsConnected = _f[1];
    var _g = (0, react_1.useState)('disconnected'), connectionStatus = _g[0], setConnectionStatus = _g[1];
    var _h = (0, react_1.useState)(null), lastError = _h[0], setLastError = _h[1];
    var _j = (0, react_1.useState)(null), connectionStats = _j[0], setConnectionStats = _j[1];
    var reconnectAttemptsRef = (0, react_1.useRef)(0);
    var reconnectTimeoutRef = (0, react_1.useRef)(null);
    var connect = (0, react_1.useCallback)(function () {
        var _a;
        if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
            return;
        }
        if (!token || !tenantId) {
            setLastError('No authentication token or tenant ID available');
            setConnectionStatus('error');
            return;
        }
        setConnectionStatus('connecting');
        setLastError(null);
        // Create socket connection - fix port mismatch
        var backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        var socket = (0, socket_io_client_1.default)("".concat(backendUrl).concat(namespace), {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'],
            timeout: 5000,
            autoConnect: true,
        });
        socketRef.current = socket;
        // Connection event handlers
        socket.on('connect', function () {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('WebSocket connected', {}, 'useWebSocket');
            }
            setIsConnected(true);
            setConnectionStatus('connected');
            setLastError(null);
            reconnectAttemptsRef.current = 0;
        });
        socket.on('connected', function (_data) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('WebSocket authenticated', {}, 'useWebSocket');
            }
        });
        socket.on('disconnect', function (reason) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('WebSocket disconnected', { reason: reason }, 'useWebSocket');
            }
            setIsConnected(false);
            setConnectionStatus('disconnected');
            // Attempt reconnection if not manual disconnect
            if (reason !== 'io client disconnect' && reconnectAttemptsRef.current < reconnectAttempts) {
                reconnectAttemptsRef.current++;
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Attempting reconnection', { attempt: reconnectAttemptsRef.current, max: reconnectAttempts }, 'useWebSocket');
                }
                reconnectTimeoutRef.current = setTimeout(function () {
                    connect();
                }, reconnectDelay * reconnectAttemptsRef.current);
            }
        });
        socket.on('connect_error', function (error) {
            logger_1.logger.warn('WebSocket connection error (graceful degradation)', { error: error.message }, 'useWebSocket');
            setLastError("WebSocket unavailable: ".concat(error.message));
            setConnectionStatus('disconnected');
            setIsConnected(false);
            // Don't spam reconnection attempts - just log and continue without WebSocket
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Continuing without WebSocket - real-time features disabled', {}, 'useWebSocket');
            }
        });
        socket.on('error', function (error) {
            logger_1.logger.error('WebSocket error', error, 'useWebSocket');
            setLastError(error.message || 'Unknown WebSocket error');
        });
        // KPI update handlers
        socket.on('kpi-update', function (update) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('KPI update received', { update: update }, 'useWebSocket');
            }
            // This will be handled by the callback registered via onKPIUpdate
        });
        socket.on('kpi-alert', function (alert) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('KPI alert received', { alert: alert }, 'useWebSocket');
            }
            // This will be handled by the callback registered via onKPIAlert
        });
        socket.on('connection-stats', function (stats) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Connection stats received', { stats: stats }, 'useWebSocket');
            }
            setConnectionStats(stats);
        });
        socket.on('heartbeat', function (_data) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Heartbeat received', {}, 'useWebSocket');
            }
        });
        socket.on('pong', function (_data) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Pong received', {}, 'useWebSocket');
            }
        });
    }, [token, tenantId, namespace, reconnectAttempts, reconnectDelay]);
    var disconnect = (0, react_1.useCallback)(function () {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        setConnectionStatus('disconnected');
        reconnectAttemptsRef.current = reconnectAttempts; // Prevent reconnection
    }, [reconnectAttempts]);
    var subscribeToKPI = (0, react_1.useCallback)(function (kpiId, metrics) {
        var _a;
        if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
            socketRef.current.emit('subscribe-kpi', { kpiId: kpiId, metrics: metrics });
        }
    }, []);
    var unsubscribeFromKPI = (0, react_1.useCallback)(function (kpiId) {
        var _a;
        if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
            socketRef.current.emit('unsubscribe-kpi', { kpiId: kpiId });
        }
    }, []);
    var onKPIUpdate = (0, react_1.useCallback)(function (callback) {
        if (socketRef.current) {
            socketRef.current.off('kpi-update');
            socketRef.current.on('kpi-update', callback);
        }
    }, []);
    var onKPIAlert = (0, react_1.useCallback)(function (callback) {
        if (socketRef.current) {
            socketRef.current.off('kpi-alert');
            socketRef.current.on('kpi-alert', callback);
        }
    }, []);
    var onConnectionStats = (0, react_1.useCallback)(function (callback) {
        if (socketRef.current) {
            socketRef.current.off('connection-stats');
            socketRef.current.on('connection-stats', callback);
        }
    }, []);
    var ping = (0, react_1.useCallback)(function () {
        var _a;
        if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
            socketRef.current.emit('ping');
        }
    }, []);
    // Auto-connect on mount if enabled
    (0, react_1.useEffect)(function () {
        if (autoConnect && token && tenantId) {
            connect();
        }
        return function () {
            disconnect();
        };
    }, [autoConnect, token, tenantId, connect, disconnect]);
    // Cleanup on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            disconnect();
        };
    }, [disconnect]);
    return {
        socket: socketRef.current,
        isConnected: isConnected,
        connectionStatus: connectionStatus,
        lastError: lastError,
        connectionStats: connectionStats,
        connect: connect,
        disconnect: disconnect,
        subscribeToKPI: subscribeToKPI,
        unsubscribeFromKPI: unsubscribeFromKPI,
        onKPIUpdate: onKPIUpdate,
        onKPIAlert: onKPIAlert,
        onConnectionStats: onConnectionStats,
        ping: ping,
    };
}
