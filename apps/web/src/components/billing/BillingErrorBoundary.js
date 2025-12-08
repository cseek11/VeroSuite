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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingErrorBoundary = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var logger_1 = require("@/utils/logger");
/**
 * BillingErrorBoundary
 *
 * Error boundary specifically for billing components.
 * Provides user-friendly error messages and recovery options.
 *
 * Pattern: Following SELECT_UNDEFINED_OPTIONS and error-resilience.md patterns
 * Last Updated: 2025-11-16
 */
var BillingErrorBoundary = /** @class */ (function (_super) {
    __extends(BillingErrorBoundary, _super);
    function BillingErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        Object.defineProperty(_this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false,
            }
        });
        Object.defineProperty(_this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (_this.props.onRetry) {
                    _this.props.onRetry();
                }
                _this.setState({ hasError: false });
            }
        });
        Object.defineProperty(_this, "handleBack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (_this.props.onBack) {
                    _this.props.onBack();
                }
                else {
                    window.history.back();
                }
            }
        });
        return _this;
    }
    Object.defineProperty(BillingErrorBoundary, "getDerivedStateFromError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return { hasError: true, error: error };
        }
    });
    Object.defineProperty(BillingErrorBoundary.prototype, "componentDidCatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, errorInfo) {
            // Structured logging with context
            logger_1.logger.error('BillingErrorBoundary caught an error', {
                context: this.props.context || 'BillingErrorBoundary',
                operation: 'componentDidCatch',
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                },
                errorInfo: {
                    componentStack: errorInfo.componentStack,
                },
            }, 'BillingErrorBoundary');
            this.setState({
                error: error,
                errorInfo: errorInfo,
            });
        }
    });
    Object.defineProperty(BillingErrorBoundary.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _a, _b;
            if (this.state.hasError) {
                if (this.props.fallback) {
                    return this.props.fallback;
                }
                return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 text-red-600" }) }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900 mb-2", children: "Something went wrong" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mb-6", children: ((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'An unexpected error occurred while loading billing information.' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", icon: lucide_react_1.RefreshCw, onClick: this.handleRetry, children: "Try Again" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.ArrowLeft, onClick: this.handleBack, children: "Go Back" })] }), process.env.NODE_ENV === 'development' && this.state.error && ((0, jsx_runtime_1.jsxs)("details", { className: "mt-6 text-left", children: [(0, jsx_runtime_1.jsx)("summary", { className: "cursor-pointer text-sm text-gray-500 mb-2", children: "Error Details (Development Only)" }), (0, jsx_runtime_1.jsxs)("pre", { className: "bg-gray-100 p-4 rounded text-xs overflow-auto", children: [this.state.error.stack, ((_b = this.state.errorInfo) === null || _b === void 0 ? void 0 : _b.componentStack) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ['\n\nComponent Stack:', this.state.errorInfo.componentStack] }))] })] }))] }) }));
            }
            return this.props.children;
        }
    });
    return BillingErrorBoundary;
}(react_1.Component));
exports.BillingErrorBoundary = BillingErrorBoundary;
