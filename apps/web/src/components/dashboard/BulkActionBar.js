"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkActionBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var BulkActionBar = function (_a) {
    var selectedCount = _a.selectedCount, isVisible = _a.isVisible, onBulkDelete = _a.onBulkDelete, onBulkLock = _a.onBulkLock, onBulkUnlock = _a.onBulkUnlock, onBulkDuplicate = _a.onBulkDuplicate, onBulkGroup = _a.onBulkGroup, onBulkUngroup = _a.onBulkUngroup, onBulkMove = _a.onBulkMove, onBulkResize = _a.onBulkResize, onClearSelection = _a.onClearSelection, className = _a.className;
    var _b = (0, react_1.useState)(false), showGroupDialog = _b[0], setShowGroupDialog = _b[1];
    var _c = (0, react_1.useState)(''), groupName = _c[0], setGroupName = _c[1];
    var _d = (0, react_1.useState)(false), showMoveDialog = _d[0], setShowMoveDialog = _d[1];
    var _e = (0, react_1.useState)(false), showResizeDialog = _e[0], setShowResizeDialog = _e[1];
    if (!isVisible || selectedCount === 0) {
        return null;
    }
    var handleGroup = function () {
        if (groupName.trim()) {
            onBulkGroup(groupName.trim());
            setGroupName('');
            setShowGroupDialog(false);
        }
        else {
            onBulkGroup();
            setShowGroupDialog(false);
        }
    };
    var handleMove = function (direction) {
        var distance = 20;
        var deltaX = 0;
        var deltaY = 0;
        switch (direction) {
            case 'up':
                deltaY = -distance;
                break;
            case 'down':
                deltaY = distance;
                break;
            case 'left':
                deltaX = -distance;
                break;
            case 'right':
                deltaX = distance;
                break;
        }
        onBulkMove(deltaX, deltaY);
        setShowMoveDialog(false);
    };
    var handleResize = function (type) {
        var amount = 20;
        var deltaWidth = 0;
        var deltaHeight = 0;
        switch (type) {
            case 'grow':
                deltaWidth = amount;
                deltaHeight = amount;
                break;
            case 'shrink':
                deltaWidth = -amount;
                deltaHeight = -amount;
                break;
            case 'wider':
                deltaWidth = amount;
                break;
            case 'narrower':
                deltaWidth = -amount;
                break;
            case 'taller':
                deltaHeight = amount;
                break;
            case 'shorter':
                deltaHeight = -amount;
                break;
        }
        onBulkResize(deltaWidth, deltaHeight);
        setShowResizeDialog(false);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50", "bg-white border border-gray-200 rounded-lg shadow-lg", "transition-all duration-300 ease-in-out", isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0", className), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium", children: [selectedCount, " selected"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-6 bg-gray-200" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onBulkDelete, className: "p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors", title: "Delete selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onBulkLock, className: "p-2 hover:bg-yellow-100 text-yellow-600 rounded-md transition-colors", title: "Lock selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onBulkUnlock, className: "p-2 hover:bg-green-100 text-green-600 rounded-md transition-colors", title: "Unlock selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onBulkDuplicate, className: "p-2 hover:bg-blue-100 text-blue-600 rounded-md transition-colors", title: "Duplicate selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowGroupDialog(true); }, className: "p-2 hover:bg-purple-100 text-purple-600 rounded-md transition-colors", title: "Group selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onBulkUngroup, className: "p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors", title: "Ungroup selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.UserMinus, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-6 bg-gray-200" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowMoveDialog(true); }, className: "p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors", title: "Move selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Move, { className: "w-4 h-4" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowResizeDialog(true); }, className: "p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors", title: "Resize selected cards", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-4 h-4" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-6 bg-gray-200" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClearSelection, className: "p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors", title: "Clear selection", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }) }), showGroupDialog && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Create Group" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Group Name (optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: groupName, onChange: function (e) { return setGroupName(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500", placeholder: "Enter group name..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowGroupDialog(false); }, className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGroup, className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors", children: "Create Group" })] })] })] }) })), showMoveDialog && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Move Cards" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleMove('up'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2191 Up" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleMove('down'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2193 Down" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleMove('left'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2190 Left" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleMove('right'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2192 Right" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowMoveDialog(false); }, className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: "Close" }) })] })] }) })), showResizeDialog && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Resize Cards" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('grow'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2197 Grow" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('shrink'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2199 Shrink" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('wider'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2194 Wider" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('narrower'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2195 Narrower" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('taller'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2191 Taller" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleResize('shorter'); }, className: "p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "\u2193 Shorter" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowResizeDialog(false); }, className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: "Close" }) })] })] }) }))] }));
};
exports.BulkActionBar = BulkActionBar;
