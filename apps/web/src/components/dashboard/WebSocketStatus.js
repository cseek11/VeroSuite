"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketStatus = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useWebSocket_1 = require("@/hooks/useWebSocket");
var WebSocketStatus = function (_a) {
    var _b = _a.showStats, showStats = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, useWebSocket_1.useWebSocket)({ autoConnect: true }), isConnected = _d.isConnected, connectionStatus = _d.connectionStatus, lastError = _d.lastError, connectionStats = _d.connectionStats, ping = _d.ping, connect = _d.connect, _disconnect = _d.disconnect;
    var _e = (0, react_1.useState)(null), pingLatency = _e[0], _setPingLatency = _e[1];
    var _f = (0, react_1.useState)(null), lastPingTime = _f[0], setLastPingTime = _f[1];
    // Handle ping with latency measurement
    var handlePing = function () {
        if (isConnected) {
            var startTime = Date.now();
            setLastPingTime(startTime);
            ping();
        }
    };
    // Listen for pong to calculate latency
    (0, react_1.useEffect)(function () {
        // This would be set up through the useWebSocket hook's onPong callback
        // For now, we'll simulate it
        return function () {
            // Cleanup if needed
        };
    }, [lastPingTime]);
    var getStatusColor = function () {
        switch (connectionStatus) {
            case 'connected':
                return 'text-green-600';
            case 'connecting':
                return 'text-yellow-600';
            case 'disconnected':
                return 'text-gray-500';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-500';
        }
    };
    var getStatusIcon = function () {
        switch (connectionStatus) {
            case 'connected':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-4 h-4" });
            case 'connecting':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-4 h-4 animate-pulse" });
            case 'disconnected':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4" });
            case 'error':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4" });
        }
    };
    var getStatusText = function () {
        switch (connectionStatus) {
            case 'connected':
                return 'Connected';
            case 'connecting':
                return 'Connecting...';
            case 'disconnected':
                return 'Disconnected';
            case 'error':
                return 'Error';
            default:
                return 'Unknown';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ".concat(getStatusColor()), children: [getStatusIcon(), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium", children: getStatusText() })] }), isConnected && pingLatency && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [pingLatency, "ms"] })] })), showStats && connectionStats && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [connectionStats.totalClients, " clients"] }), connectionStats.tenantStats && connectionStats.tenantStats.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-1", children: ["(", connectionStats.tenantStats.length, " tenants)"] }))] })), lastError && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { title: lastError, children: "Error" })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: isConnected ? ((0, jsx_runtime_1.jsx)("button", { onClick: handlePing, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Ping server", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-3 h-3 text-gray-500" }) })) : ((0, jsx_runtime_1.jsx)("button", { onClick: connect, className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Reconnect", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-3 h-3 text-gray-500" }) })) })] }));
};
exports.WebSocketStatus = WebSocketStatus;
