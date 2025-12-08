"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLoader = exports.LoadingSpinner = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
/**
 * LoadingSpinner Component
 *
 * Displays a loading spinner with optional text.
 * Supports multiple sizes and full-screen mode.
 *
 * @example
 * <LoadingSpinner size="lg" text="Loading..." />
 * <LoadingSpinner fullScreen text="Loading application..." />
 *
 * Last Updated: 2025-11-19
 */
var LoadingSpinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, text = _a.text, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.fullScreen, fullScreen = _d === void 0 ? false : _d;
    var sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };
    var containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
        : "flex items-center justify-center ".concat(className);
    return ((0, jsx_runtime_1.jsx)("div", { className: containerClasses, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { role: "status", "aria-live": "polite", "aria-label": text || 'Loading', children: (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "animate-spin ".concat(sizeClasses[size], " text-purple-600"), "aria-hidden": "true" }) }), text && ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600 font-medium", children: text }))] }) }));
};
exports.LoadingSpinner = LoadingSpinner;
var PageLoader = function (_a) {
    var _b = _a.text, text = _b === void 0 ? 'Loading...' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsx)(exports.LoadingSpinner, { size: "lg", text: text }) }) }));
};
exports.PageLoader = PageLoader;
