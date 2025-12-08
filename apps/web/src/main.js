"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var client_1 = __importDefault(require("react-dom/client"));
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var react_query_devtools_1 = require("@tanstack/react-query-devtools");
var App_1 = __importDefault(require("./routes/App"));
var queryClient_1 = require("./lib/queryClient");
var config_1 = require("./lib/config");
var ErrorBoundary_1 = require("./components/ErrorBoundary");
var KeyboardNavigationProvider_1 = __importDefault(require("./components/KeyboardNavigationProvider"));
var LayoutContext_1 = require("./context/LayoutContext");
var DensityModeContext_1 = require("./context/DensityModeContext");
var sentry_1 = require("./lib/sentry");
var sonner_1 = require("sonner");
var pwa_1 = require("./utils/pwa");
require("./index.css");
// Initialize Sentry for error tracking
(0, sentry_1.initSentry)();
// Initialize PWA features (service worker, install prompt, etc.)
if (typeof window !== 'undefined') {
    (0, pwa_1.initPWA)();
    // Migrate templates from localStorage to backend
    Promise.resolve().then(function () { return __importStar(require('./utils/migrate-templates')); }).then(function (_a) {
        var initTemplateMigration = _a.initTemplateMigration;
        initTemplateMigration();
    });
}
// Error boundary for initialization errors
function ErrorFallback(_a) {
    var error = _a.error;
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: '500px' }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { color: '#dc3545', marginBottom: '20px' }, children: "Configuration Error" }), (0, jsx_runtime_1.jsx)("p", { style: { marginBottom: '15px', color: '#6c757d' }, children: "The application failed to initialize due to a configuration issue." }), (0, jsx_runtime_1.jsxs)("div", { style: {
                        backgroundColor: '#fff',
                        padding: '15px',
                        borderRadius: '5px',
                        border: '1px solid #dee2e6',
                        textAlign: 'left',
                        fontSize: '14px'
                    }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Error:" }), " ", error.message] }), (0, jsx_runtime_1.jsx)("p", { style: { marginTop: '15px', fontSize: '14px', color: '#6c757d' }, children: "Please check your environment variables and try refreshing the page." })] }) }));
}
try {
    client_1.default.createRoot(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(sentry_1.SentryErrorBoundary, { fallback: (0, jsx_runtime_1.jsx)(ErrorFallback, { error: new Error('Application Error') }), children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsxs)(react_query_1.QueryClientProvider, { client: queryClient_1.queryClient, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(KeyboardNavigationProvider_1.default, { children: (0, jsx_runtime_1.jsx)(DensityModeContext_1.DensityModeProvider, { children: (0, jsx_runtime_1.jsx)(LayoutContext_1.LayoutProvider, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }) }) }), config_1.config.features.enableDebugMode && (0, jsx_runtime_1.jsx)(react_query_devtools_1.ReactQueryDevtools, { initialIsOpen: false }), (0, jsx_runtime_1.jsx)(sonner_1.Toaster, { position: "top-right", richColors: true })] }) }) }) }));
}
catch (error) {
    client_1.default.createRoot(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(ErrorFallback, { error: error }));
}
