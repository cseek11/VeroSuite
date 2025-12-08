"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockIndicator = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var LockIndicator = function (_a) {
    var isLocked = _a.isLocked, lockedBy = _a.lockedBy, currentUserId = _a.currentUserId;
    if (!isLocked) {
        return null;
    }
    var isLockedByMe = lockedBy === currentUserId;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "lock-indicator flex items-center gap-1 px-2 py-1 rounded text-xs ".concat(isLockedByMe
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-red-100 text-red-800 border border-red-300'), children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD12" }), (0, jsx_runtime_1.jsx)("span", { children: isLockedByMe ? 'Locked by you' : 'Locked by another user' })] }));
};
exports.LockIndicator = LockIndicator;
