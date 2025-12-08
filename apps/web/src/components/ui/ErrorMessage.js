"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
/**
 * ErrorMessage Component
 *
 * Displays user-friendly error, warning, or info messages with consistent styling.
 * Supports dismissible messages and actionable buttons.
 *
 * @example
 * <ErrorMessage
 *   message="Failed to save work order"
 *   type="error"
 *   actionable={{ label: "Retry", onClick: handleRetry }}
 * />
 *
 * Last Updated: 2025-11-19
 */
var ErrorMessage = function (_a) {
    var message = _a.message, _b = _a.type, type = _b === void 0 ? 'error' : _b, onDismiss = _a.onDismiss, actionable = _a.actionable, _c = _a.className, className = _c === void 0 ? '' : _c;
    var typeStyles = {
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: 'text-red-600',
            iconComponent: lucide_react_1.AlertCircle,
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            icon: 'text-yellow-600',
            iconComponent: lucide_react_1.AlertTriangle,
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: 'text-blue-600',
            iconComponent: lucide_react_1.Info,
        },
    };
    var styles = typeStyles[type];
    var IconComponent = styles.iconComponent;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3 p-4 rounded-lg border ".concat(styles.container, " ").concat(className), role: "alert", "aria-live": "polite", children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "w-5 h-5 mt-0.5 flex-shrink-0 ".concat(styles.icon), "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: message }), actionable && ((0, jsx_runtime_1.jsx)("button", { onClick: actionable.onClick, className: "mt-2 text-sm font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded", style: {
                            color: type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb'
                        }, children: actionable.label }))] }), onDismiss && ((0, jsx_runtime_1.jsx)("button", { onClick: onDismiss, className: "flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded", "aria-label": "Dismiss message", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }));
};
exports.ErrorMessage = ErrorMessage;
exports.default = exports.ErrorMessage;
