"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceIndicator = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var PresenceIndicator = function (_a) {
    var presence = _a.presence, currentUserId = _a.currentUserId;
    var otherUsers = presence.filter(function (p) { return p.user_id !== currentUserId; });
    var editingUsers = otherUsers.filter(function (p) { return p.is_editing; });
    if (otherUsers.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "presence-indicator flex items-center gap-2", children: [editingUsers.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 bg-yellow-500 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-yellow-800", children: [editingUsers.length, " ", editingUsers.length === 1 ? 'person' : 'people', " editing"] })] })), otherUsers.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex -space-x-2", children: [otherUsers.slice(0, 3).map(function (user) { return ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium", title: "User ".concat(user.user_id.slice(0, 8)), children: user.user_id.slice(0, 1).toUpperCase() }, user.user_id)); }), otherUsers.length > 3 && ((0, jsx_runtime_1.jsxs)("div", { className: "w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium", children: ["+", otherUsers.length - 3] }))] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-600", children: [otherUsers.length, " ", otherUsers.length === 1 ? 'viewer' : 'viewers'] })] }))] }));
};
exports.PresenceIndicator = PresenceIndicator;
