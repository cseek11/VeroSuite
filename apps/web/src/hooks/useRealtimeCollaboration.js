"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeCollaboration = useRealtimeCollaboration;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var USER_COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];
// Simulated WebSocket for demo purposes
var MockWebSocket = /** @class */ (function () {
    function MockWebSocket() {
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "isConnected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    Object.defineProperty(MockWebSocket.prototype, "connect", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            this.isConnected = true;
            setTimeout(function () {
                _this.emit('open', {});
            }, 100);
        }
    });
    Object.defineProperty(MockWebSocket.prototype, "disconnect", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.isConnected = false;
            this.emit('close', {});
        }
    });
    Object.defineProperty(MockWebSocket.prototype, "send", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            var _this = this;
            if (!this.isConnected)
                return;
            // Simulate network delay
            setTimeout(function () {
                // Echo back to simulate other users (for demo)
                _this.emit('message', { data: data });
            }, 50 + Math.random() * 100);
        }
    });
    Object.defineProperty(MockWebSocket.prototype, "on", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }
    });
    Object.defineProperty(MockWebSocket.prototype, "off", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (event, callback) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(function (cb) { return cb !== callback; });
            }
        }
    });
    Object.defineProperty(MockWebSocket.prototype, "emit", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(function (callback) { return callback(data); });
            }
        }
    });
    return MockWebSocket;
}());
function useRealtimeCollaboration(_dashboardId, currentUser) {
    var _a = (0, react_1.useState)(false), isConnected = _a[0], setIsConnected = _a[1];
    var _b = (0, react_1.useState)({}), collaborators = _b[0], setCollaborators = _b[1];
    var _c = (0, react_1.useState)('disconnected'), connectionStatus = _c[0], setConnectionStatus = _c[1];
    var wsRef = (0, react_1.useRef)(null);
    var userColor = (0, react_1.useRef)(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]);
    // Initialize WebSocket connection
    var connect = (0, react_1.useCallback)(function () {
        if (wsRef.current)
            return;
        setConnectionStatus('connecting');
        wsRef.current = new MockWebSocket();
        wsRef.current.on('open', function () {
            var _a;
            setIsConnected(true);
            setConnectionStatus('connected');
            // Announce user joining
            var joinEvent = {
                type: 'user_join',
                userId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || 'anonymous',
                timestamp: Date.now(),
                data: {
                    name: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Anonymous User',
                    email: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) || '',
                    color: userColor.current
                }
            };
            (_a = wsRef.current) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(joinEvent));
        });
        wsRef.current.on('close', function () {
            setIsConnected(false);
            setConnectionStatus('disconnected');
            setCollaborators({});
        });
        wsRef.current.on('message', function (data) {
            try {
                var event_1 = data;
                var collaborationEvent = JSON.parse(event_1.data);
                handleCollaborationEvent(collaborationEvent);
            }
            catch (error) {
                logger_1.logger.error('Failed to parse collaboration event', error, 'useRealtimeCollaboration');
            }
        });
        wsRef.current.connect();
    }, [currentUser]);
    // Disconnect from collaboration
    var disconnect = (0, react_1.useCallback)(function () {
        if (wsRef.current) {
            // Announce user leaving
            try {
                var leaveEvent = {
                    type: 'user_leave',
                    userId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || 'anonymous',
                    timestamp: Date.now(),
                    data: {}
                };
                wsRef.current.send(JSON.stringify(leaveEvent));
            }
            catch (error) {
                logger_1.logger.warn('Failed to send leave event', { error: error }, 'useRealtimeCollaboration');
            }
            // Clean up the connection
            wsRef.current.disconnect();
            wsRef.current = null;
        }
        // Reset state
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setCollaborators({});
    }, [currentUser]);
    // Handle incoming collaboration events
    var handleCollaborationEvent = (0, react_1.useCallback)(function (event) {
        // Don't process our own events
        if (event.userId === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id))
            return;
        switch (event.type) {
            case 'user_join':
                setCollaborators(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[event.userId] = {
                        id: event.userId,
                        name: event.data.name,
                        email: event.data.email,
                        color: event.data.color,
                        lastSeen: event.timestamp,
                        isActive: true
                    }, _a)));
                });
                break;
            case 'user_leave':
                setCollaborators(function (prev) {
                    var updated = __assign({}, prev);
                    delete updated[event.userId];
                    return updated;
                });
                break;
            case 'cursor_move':
                setCollaborators(function (prev) {
                    var _a;
                    var prevUser = prev[event.userId];
                    // If user doesn't exist, just skip (could also add a placeholder if wanted)
                    if (!prevUser)
                        return prev;
                    return __assign(__assign({}, prev), (_a = {}, _a[event.userId] = __assign(__assign({}, prevUser), { cursor: event.data.cursor, lastSeen: event.timestamp, isActive: true }), _a));
                });
                break;
            case 'layout_update':
                // Handle layout updates from other users
                // This would trigger a layout merge/conflict resolution
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Layout update from user', { userId: event.userId, data: event.data }, 'useRealtimeCollaboration');
                }
                break;
            case 'card_select':
                // Handle card selection from other users
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Card selection from user', { userId: event.userId, data: event.data }, 'useRealtimeCollaboration');
                }
                break;
        }
    }, [currentUser]);
    // Broadcast layout change
    var broadcastLayoutUpdate = (0, react_1.useCallback)(function (layout) {
        if (!wsRef.current || !isConnected)
            return;
        var event = {
            type: 'layout_update',
            userId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || 'anonymous',
            timestamp: Date.now(),
            data: { layout: layout }
        };
        wsRef.current.send(JSON.stringify(event));
    }, [isConnected, currentUser]);
    // Broadcast cursor movement
    var broadcastCursorMove = (0, react_1.useCallback)(function (x, y) {
        if (!wsRef.current || !isConnected)
            return;
        var event = {
            type: 'cursor_move',
            userId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || 'anonymous',
            timestamp: Date.now(),
            data: { cursor: { x: x, y: y } }
        };
        wsRef.current.send(JSON.stringify(event));
    }, [isConnected, currentUser]);
    // Broadcast card selection
    var broadcastCardSelection = (0, react_1.useCallback)(function (cardIds) {
        if (!wsRef.current || !isConnected)
            return;
        var event = {
            type: 'card_select',
            userId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || 'anonymous',
            timestamp: Date.now(),
            data: { selectedCards: cardIds }
        };
        wsRef.current.send(JSON.stringify(event));
    }, [isConnected, currentUser]);
    // Clean up on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            disconnect();
        };
    }, [disconnect]);
    // Auto-connect when user is available (but not if manually disconnected)
    (0, react_1.useEffect)(function () {
        if (currentUser && !isConnected && connectionStatus === 'disconnected' && !wsRef.current) {
            connect();
        }
    }, [currentUser, isConnected, connectionStatus, connect]);
    return {
        isConnected: isConnected,
        connectionStatus: connectionStatus,
        collaborators: collaborators,
        connect: connect,
        disconnect: disconnect,
        broadcastLayoutUpdate: broadcastLayoutUpdate,
        broadcastCursorMove: broadcastCursorMove,
        broadcastCardSelection: broadcastCardSelection,
        userColor: userColor.current
    };
}
