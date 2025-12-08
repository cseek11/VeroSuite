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
exports.RegionErrorBoundary = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var framer_motion_1 = require("framer-motion");
/**
 * Region-specific error boundary with recovery and retry logic
 */
var RegionErrorBoundary = /** @class */ (function (_super) {
    __extends(RegionErrorBoundary, _super);
    function RegionErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        Object.defineProperty(_this, "retryTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(_this, "MAX_RETRIES", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(_this, "RETRY_DELAY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // 1 second base delay
        Object.defineProperty(_this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (_this.state.errorLoop) {
                    // Error loop detected, don't retry automatically
                    return;
                }
                if (_this.state.retryCount >= _this.MAX_RETRIES) {
                    _this.setState({ errorLoop: true });
                    return;
                }
                // Exponential backoff
                var delay = _this.RETRY_DELAY * Math.pow(2, _this.state.retryCount);
                _this.retryTimeout = setTimeout(function () {
                    _this.setState({
                        hasError: false,
                        error: null,
                        errorInfo: null
                    });
                    if (_this.props.onRecover) {
                        _this.props.onRecover();
                    }
                }, delay);
            }
        });
        Object.defineProperty(_this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                _this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                    retryCount: 0,
                    errorLoop: false
                });
                if (_this.props.onRecover) {
                    _this.props.onRecover();
                }
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
            errorInfo: null,
            retryCount: 0,
            errorLoop: false
        };
        return _this;
    }
    Object.defineProperty(RegionErrorBoundary, "getDerivedStateFromError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return {
                hasError: true,
                error: error
            };
        }
    });
    Object.defineProperty(RegionErrorBoundary.prototype, "componentDidCatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, errorInfo) {
            // Log error with context
            logger_1.logger.error('Region error boundary caught error', {
                error: error,
                errorInfo: errorInfo,
                regionId: this.props.regionId,
                componentStack: errorInfo.componentStack
            }, 'RegionErrorBoundary');
            this.setState({
                error: error,
                errorInfo: errorInfo,
                retryCount: this.state.retryCount + 1
            });
            // Check for error loops (same error multiple times)
            if (this.state.retryCount >= this.MAX_RETRIES) {
                this.setState({ errorLoop: true });
            }
            // Report to error tracking service (e.g., Sentry)
            if (typeof window !== 'undefined' && window.Sentry) {
                window.Sentry.captureException(error, {
                    contexts: {
                        react: {
                            componentStack: errorInfo.componentStack
                        },
                        region: {
                            regionId: this.props.regionId
                        }
                    }
                });
            }
        }
    });
    Object.defineProperty(RegionErrorBoundary.prototype, "componentWillUnmount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
            }
        }
    });
    Object.defineProperty(RegionErrorBoundary.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _a, _b;
            if (this.state.hasError) {
                // Use custom fallback if provided
                if (this.props.fallback) {
                    return this.props.fallback;
                }
                // Default error UI
                return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "relative w-full h-full min-h-[200px] flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-12 h-12 text-red-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-red-900 mb-2", children: this.state.errorLoop
                                        ? 'Error Loop Detected'
                                        : 'Region Error' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mb-4", children: ((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'An unexpected error occurred' }), this.state.errorLoop && ((0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-yellow-800", children: "This error has occurred multiple times. Please refresh the page or contact support." }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-center", children: [!this.state.errorLoop && ((0, jsx_runtime_1.jsxs)("button", { onClick: this.handleRetry, disabled: this.state.retryCount >= this.MAX_RETRIES, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" }), "Retry (", this.MAX_RETRIES - this.state.retryCount, " left)"] })), (0, jsx_runtime_1.jsx)("button", { onClick: this.handleReset, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Reset" }), (0, jsx_runtime_1.jsxs)("button", { onClick: this.handleDismiss, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), "Dismiss"] })] }), process.env.NODE_ENV === 'development' && this.state.errorInfo && ((0, jsx_runtime_1.jsxs)("details", { className: "mt-4 text-left", children: [(0, jsx_runtime_1.jsx)("summary", { className: "text-xs text-gray-600 cursor-pointer mb-2", children: "Error Details (Dev Only)" }), (0, jsx_runtime_1.jsxs)("pre", { className: "text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40", children: [(_b = this.state.error) === null || _b === void 0 ? void 0 : _b.stack, '\n\n', this.state.errorInfo.componentStack] })] }))] }) }) }));
            }
            return this.props.children;
        }
    });
    return RegionErrorBoundary;
}(react_1.Component));
exports.RegionErrorBoundary = RegionErrorBoundary;
