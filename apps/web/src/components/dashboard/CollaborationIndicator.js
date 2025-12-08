"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var CollaborationIndicator = function (_a) {
    var isConnected = _a.isConnected, connectionStatus = _a.connectionStatus, collaborators = _a.collaborators, onToggleConnection = _a.onToggleConnection;
    var activeCollaborators = Object.values(collaborators).filter(function (user) { return user.isActive; });
    var getStatusColor = function () {
        switch (connectionStatus) {
            case 'connected': return 'text-green-600';
            case 'connecting': return 'text-yellow-600';
            case 'disconnected': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };
    var getStatusIcon = function () {
        if (connectionStatus === 'connecting') {
            return (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" });
        }
        return isConnected ? (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4" });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: onToggleConnection, className: "flex items-center gap-1 transition-colors ".concat(getStatusColor()), title: "".concat(connectionStatus, " - Click to ").concat(isConnected ? 'disconnect' : 'connect'), children: [getStatusIcon(), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium", children: connectionStatus === 'connecting' ? 'Connecting...' :
                            connectionStatus === 'connected' ? 'Live' : 'Offline' })] }), activeCollaborators.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-3 h-3 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: activeCollaborators.length }), (0, jsx_runtime_1.jsxs)("div", { className: "flex -space-x-1", children: [activeCollaborators.slice(0, 3).map(function (user) { return ((0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white", style: { backgroundColor: user.color }, title: "".concat(user.name, " (").concat(user.email, ")"), children: user.name.charAt(0).toUpperCase() }, user.id)); }), activeCollaborators.length > 3 && ((0, jsx_runtime_1.jsxs)("div", { className: "w-5 h-5 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-bold text-white", children: ["+", activeCollaborators.length - 3] }))] })] })] }))] }));
};
exports.default = CollaborationIndicator;
