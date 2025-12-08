"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDisplay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var ErrorDisplay = function (_a) {
    var errors = _a.errors, onDismiss = _a.onDismiss, onRetry = _a.onRetry, className = _a.className;
    if (errors.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('fixed top-4 right-4 z-50 space-y-2 max-w-md', className), children: errors.map(function (error) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-2", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-semibold text-red-900", children: [error.operation.charAt(0).toUpperCase() + error.operation.slice(1), " Failed"] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onDismiss(error.id); }, className: "text-red-400 hover:text-red-600 transition-colors flex-shrink-0", "aria-label": "Dismiss error", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mt-1", children: error.message }), error.retryable && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                            // Retry operation - parent will get stored operation from error handling
                                            onRetry(error.id);
                                        }, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3.5 h-3.5" }), "Retry ", error.retryCount > 0 && "(".concat(error.retryCount, ")")] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-red-600", children: error.retryCount >= 3 ? 'Max retries reached' : '' })] }))] })] }) }, error.id)); }) }));
};
exports.ErrorDisplay = ErrorDisplay;
