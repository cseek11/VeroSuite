"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLoadingIndicator = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var TemplateLoadingIndicator = function (_a) {
    var isLoading = _a.isLoading, error = _a.error, templatesCount = _a.templatesCount, onRetry = _a.onRetry, onDismiss = _a.onDismiss, canRetry = _a.canRetry, _b = _a.autoHideDelay // Default 3 seconds
    , autoHideDelay = _b === void 0 ? 3000 : _b // Default 3 seconds
    ;
    var _c = (0, react_1.useState)(true), isVisible = _c[0], setIsVisible = _c[1];
    var _d = (0, react_1.useState)(false), isFadingOut = _d[0], setIsFadingOut = _d[1];
    var _e = (0, react_1.useState)(0), countdown = _e[0], setCountdown = _e[1];
    // Auto-hide success indicator after delay with fade-out animation
    (0, react_1.useEffect)(function () {
        if (!isLoading && !error && templatesCount > 0) {
            // Start countdown
            setCountdown(Math.ceil(autoHideDelay / 1000));
            var countdownInterval_1 = setInterval(function () {
                setCountdown(function (prev) {
                    if (prev <= 1) {
                        clearInterval(countdownInterval_1);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            var timer_1 = setTimeout(function () {
                setIsFadingOut(true);
                // Hide completely after fade animation
                setTimeout(function () {
                    setIsVisible(false);
                }, 300); // Match the CSS transition duration
            }, autoHideDelay);
            return function () {
                clearTimeout(timer_1);
                clearInterval(countdownInterval_1);
            };
        }
        return undefined;
    }, [isLoading, error, templatesCount, autoHideDelay]);
    // Reset visibility when loading starts or error occurs
    (0, react_1.useEffect)(function () {
        if (isLoading || error) {
            setIsVisible(true);
            setIsFadingOut(false);
            setCountdown(0);
        }
    }, [isLoading, error]);
    // Don't render if not visible
    if (!isVisible) {
        return null;
    }
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40 max-w-sm transition-all duration-300 ".concat(isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-5 h-5 text-blue-500 animate-spin" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "Loading Templates" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Fetching KPI templates..." })] })] }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-red-200 p-4 z-40 max-w-sm transition-all duration-300 ".concat(isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-500 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "Template Loading Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 mb-2", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [canRetry && ((0, jsx_runtime_1.jsx)("button", { onClick: onRetry, className: "text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors", children: "Retry" })), (0, jsx_runtime_1.jsx)("button", { onClick: onDismiss, className: "text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors", children: "Dismiss" })] })] })] }) }));
    }
    if (templatesCount > 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-green-200 p-4 z-40 max-w-sm transition-all duration-300 ".concat(isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-5 h-5 text-green-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "Templates Loaded" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: [templatesCount, " templates available", countdown > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-2 text-blue-500 font-medium", children: ["\u2022 Auto-hide in ", countdown, "s"] }))] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onDismiss, className: "text-gray-400 hover:text-gray-600 transition-colors", title: "Dismiss", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-yellow-200 p-4 z-40 max-w-sm transition-all duration-300 ".concat(isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-5 h-5 text-yellow-500" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "No Templates" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "No templates available" })] })] }) }));
};
exports.TemplateLoadingIndicator = TemplateLoadingIndicator;
