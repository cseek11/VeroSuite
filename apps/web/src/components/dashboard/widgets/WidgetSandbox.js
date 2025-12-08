"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSandbox = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var WidgetSandbox = function (_a) {
    var widgetId = _a.widgetId, manifest = _a.manifest, config = _a.config, onError = _a.onError, onReady = _a.onReady, onMessage = _a.onMessage;
    var iframeRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var messageQueueRef = (0, react_1.useRef)([]);
    // Strict CSP for iframe - Note: CSP should be enforced via meta tag in widget HTML or server headers
    // This is a reference CSP that widgets should implement
    // Using nonce for script and style to avoid 'unsafe-inline'
    // Reference CSP (documentation only, not used in code):
    // const csp = [
    //   "default-src 'self'",
    //   `script-src 'self' 'nonce-${nonce}'`, // Use nonce instead of 'unsafe-inline'
    //   `style-src 'self' 'nonce-${nonce}'`, // Use nonce instead of 'unsafe-inline'
    //   "img-src 'self' data: https:",
    //   "font-src 'self' data:",
    //   "connect-src 'self'",
    //   "frame-ancestors 'none'",
    //   "base-uri 'self'",
    //   "form-action 'none'",
    //   "object-src 'none'",
    //   "media-src 'self'",
    //   "worker-src 'none'"
    // ].join('; ');
    // Handle messages from widget
    var handleMessage = (0, react_1.useCallback)(function (event) {
        var _a;
        // Verify origin matches widget entry point
        try {
            var widgetOrigin = new URL(manifest.entry_point).origin;
            if (event.origin !== widgetOrigin && event.origin !== window.location.origin) {
                logger_1.logger.warn('WidgetSandbox: Message from unauthorized origin', {
                    origin: event.origin,
                    widgetId: widgetId
                });
                return;
            }
        }
        catch (e) {
            logger_1.logger.warn('WidgetSandbox: Invalid widget entry point', {
                entryPoint: manifest.entry_point,
                widgetId: widgetId
            });
            return;
        }
        var message = event.data;
        if (message.widgetId !== widgetId) {
            return;
        }
        switch (message.type) {
            case 'ready':
                setIsLoading(false);
                onReady === null || onReady === void 0 ? void 0 : onReady();
                // Send queued messages
                messageQueueRef.current.forEach(function (msg) {
                    var _a, _b;
                    (_b = (_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(msg, '*');
                });
                messageQueueRef.current = [];
                break;
            case 'error':
                var error_1 = new Error(((_a = message.payload) === null || _a === void 0 ? void 0 : _a.message) || 'Widget error');
                setError(error_1);
                onError === null || onError === void 0 ? void 0 : onError(error_1);
                break;
            default:
                onMessage === null || onMessage === void 0 ? void 0 : onMessage(message);
                break;
        }
    }, [widgetId, manifest.entry_point, onError, onReady, onMessage]);
    // Send message to widget
    var sendMessage = (0, react_1.useCallback)(function (message) {
        var _a;
        if (!((_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow)) {
            messageQueueRef.current.push(message);
            return;
        }
        try {
            var widgetOrigin = new URL(manifest.entry_point).origin;
            iframeRef.current.contentWindow.postMessage(message, widgetOrigin);
        }
        catch (e) {
            console.error('WidgetSandbox: Failed to send message', e);
        }
    }, [manifest.entry_point]);
    // Initialize widget
    (0, react_1.useEffect)(function () {
        if (!iframeRef.current)
            return;
        var iframe = iframeRef.current;
        // Set up message listener
        window.addEventListener('message', handleMessage);
        // Load widget
        try {
            iframe.src = manifest.entry_point;
        }
        catch (e) {
            var error_2 = new Error("Failed to load widget: ".concat(e instanceof Error ? e.message : 'Unknown error'));
            setError(error_2);
            onError === null || onError === void 0 ? void 0 : onError(error_2);
            setIsLoading(false);
        }
        return function () {
            window.removeEventListener('message', handleMessage);
            // Send destroy message
            sendMessage({ type: 'destroy', widgetId: widgetId });
        };
    }, [manifest.entry_point, widgetId, handleMessage, sendMessage, onError]);
    // Send config updates
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isLoading && ((_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow)) {
            sendMessage({
                type: 'update',
                widgetId: widgetId,
                payload: { config: config }
            });
        }
    }, [config, isLoading, widgetId, sendMessage]);
    // Send init message when widget is ready
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isLoading && ((_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow)) {
            sendMessage({
                type: 'init',
                widgetId: widgetId,
                payload: { config: config, manifest: manifest }
            });
        }
    }, [isLoading, widgetId, config, manifest, sendMessage]);
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-red-50 border border-red-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-red-800 font-semibold", children: "Widget Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 text-sm mt-1", children: error.message })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full h-full", children: [isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "Loading widget..." })] }) })), (0, jsx_runtime_1.jsx)("iframe", { ref: iframeRef, className: "w-full h-full border-0", sandbox: "allow-scripts allow-same-origin allow-forms", style: { display: isLoading ? 'none' : 'block' }, title: "Widget: ".concat(manifest.name) })] }));
};
exports.WidgetSandbox = WidgetSandbox;
