"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardShortcutsModal = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var KeyboardShortcutsModal = function (_a) {
    var showKeyboardHelp = _a.showKeyboardHelp, setShowKeyboardHelp = _a.setShowKeyboardHelp, shortcuts = _a.shortcuts;
    if (!showKeyboardHelp)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Keyboard Shortcuts" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowKeyboardHelp(false); }, className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5 text-gray-500" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: ['Card Creation', 'Layout', 'Card Management', 'Selection', 'Help'].map(function (category) { return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-800 mb-3", children: category }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: shortcuts
                                    .filter(function (shortcut) { return shortcut.category === category; })
                                    .map(function (shortcut, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 text-sm", children: shortcut.description }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: shortcut.action })] }), (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm", children: shortcut.key })] }, index)); }) })] }, category)); }) })] }) }));
};
exports.KeyboardShortcutsModal = KeyboardShortcutsModal;
