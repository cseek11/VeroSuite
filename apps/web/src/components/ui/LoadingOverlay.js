"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
/**
 * LoadingOverlay Component
 *
 * Displays a loading overlay with spinner and optional text.
 * Can be used to overlay content during loading states.
 *
 * @example
 * <LoadingOverlay isLoading={isLoading} text="Loading customers...">
 *   <CustomerList />
 * </LoadingOverlay>
 *
 * Last Updated: 2025-11-19
 */
var LoadingOverlay = function (_a) {
    var isLoading = _a.isLoading, text = _a.text, _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, children = _a.children;
    if (!isLoading) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(className), children: [children && ((0, jsx_runtime_1.jsx)("div", { className: "opacity-50 pointer-events-none", children: children })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: size }), text && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 font-medium", children: text }))] }) })] }));
};
exports.LoadingOverlay = LoadingOverlay;
exports.default = exports.LoadingOverlay;
