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
exports.ErrorBoundary = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
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
                _this.setState({ hasError: false });
            }
        });
        Object.defineProperty(_this, "handleGoHome", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                window.location.href = '/';
            }
        });
        return _this;
    }
    Object.defineProperty(ErrorBoundary, "getDerivedStateFromError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return { hasError: true, error: error };
        }
    });
    Object.defineProperty(ErrorBoundary.prototype, "componentDidCatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, errorInfo) {
            logger_1.logger.error('ErrorBoundary caught an error', { error: error, errorInfo: errorInfo }, 'ErrorBoundary');
        }
    });
    Object.defineProperty(ErrorBoundary.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _a;
            if (this.state.hasError) {
                if (this.props.fallback) {
                    return this.props.fallback;
                }
                return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-md w-full mx-auto p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 text-red-600" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-6", children: ((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'An unexpected error occurred' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: this.handleRetry, className: "w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4 mr-2" }), "Try Again"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: this.handleGoHome, className: "w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "w-4 h-4 mr-2" }), "Go Home"] })] })] }) }) }));
            }
            return this.props.children;
        }
    });
    return ErrorBoundary;
}(react_1.Component));
exports.ErrorBoundary = ErrorBoundary;
