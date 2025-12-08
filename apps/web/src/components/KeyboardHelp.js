"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var KeyboardHelp = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var shortcuts = [
        { key: '1-8', description: 'Navigate to sections' },
        { key: 'h', description: 'Go to Dashboard' },
        { key: 'j', description: 'Go to Jobs' },
        { key: 'c', description: 'Go to Customers' },
        { key: 'r', description: 'Go to Reports' },
        { key: '6', description: 'Go to Search Analytics' },
        { key: 's', description: 'Go to Settings' },
        { key: 'Ctrl + N', description: 'Create New Job' },
        { key: 'Ctrl + Shift + N', description: 'Create New Customer' },
        { key: 'Ctrl + F', description: 'Search' },
        { key: 'Ctrl + K', description: 'Toggle Sidebar' },
        { key: '?', description: 'Show all shortcuts' },
        { key: 'Esc', description: 'Close modal/dialog' },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(className), children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setIsOpen(!isOpen); }, className: "p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors", title: "Keyboard shortcuts", "aria-label": "Show keyboard shortcuts", children: (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "h-5 w-5" }) }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Keyboard, { className: "h-5 w-5 text-purple-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-900", children: "Keyboard Shortcuts" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setIsOpen(false); }, className: "p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100", "aria-label": "Close keyboard help", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 max-h-64 overflow-y-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: shortcuts.map(function (shortcut, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: shortcut.description }), (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded", children: shortcut.key })] }, index)); }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: ["Press ", (0, jsx_runtime_1.jsx)("kbd", { className: "px-1 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded", children: "?" }), " for full shortcuts list"] }) })] })), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40", onClick: function () { return setIsOpen(false); } }))] }));
};
exports.default = KeyboardHelp;
