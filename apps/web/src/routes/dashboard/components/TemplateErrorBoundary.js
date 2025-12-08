"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateErrorBoundary = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var TemplateErrorBoundary = /** @class */ (function (_super) {
    __extends(TemplateErrorBoundary, _super);
    function TemplateErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        Object.defineProperty(_this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                _this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        });
        Object.defineProperty(_this, "handleDismiss", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                _this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        });
        _this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
        return _this;
    }
    Object.defineProperty(TemplateErrorBoundary, "getDerivedStateFromError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return {
                hasError: true,
                error: error,
                errorInfo: null
            };
        }
    });
    Object.defineProperty(TemplateErrorBoundary.prototype, "componentDidCatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, errorInfo) {
            // Error boundary - use logger
            logger_1.logger.error('Template Error Boundary caught an error', { error: error, errorInfo: errorInfo }, 'TemplateErrorBoundary');
            this.setState({
                error: error,
                errorInfo: errorInfo
            });
            if (this.props.onError) {
                this.props.onError(error, errorInfo);
            }
        }
    });
    Object.defineProperty(TemplateErrorBoundary.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.state.hasError) {
                if (this.props.fallback) {
                    return this.props.fallback;
                }
                return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-6 h-6 text-red-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Template Loading Error" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: "Failed to load KPI templates. This might be due to:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-xs text-gray-500 list-disc list-inside space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "Network connection issues" }), (0, jsx_runtime_1.jsx)("li", { children: "API server not running" }), (0, jsx_runtime_1.jsx)("li", { children: "Authentication problems" })] })] }), process.env.NODE_ENV === 'development' && this.state.error && ((0, jsx_runtime_1.jsxs)("details", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("summary", { className: "text-xs text-gray-500 cursor-pointer hover:text-gray-700", children: "Technical Details" }), (0, jsx_runtime_1.jsx)("pre", { className: "mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32", children: this.state.error.message })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: this.handleRetry, className: "flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" }), "Retry"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: this.handleDismiss, className: "flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), "Continue Without Templates"] })] })] }) }));
            }
            return this.props.children;
        }
    });
    return TemplateErrorBoundary;
}(react_1.Component));
exports.TemplateErrorBoundary = TemplateErrorBoundary;
