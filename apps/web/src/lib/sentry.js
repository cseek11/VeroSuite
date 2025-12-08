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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryUtils = exports.SentryPerformance = exports.SentryErrorBoundary = void 0;
exports.initSentry = initSentry;
var Sentry = __importStar(require("@sentry/react"));
var config_1 = require("./config");
var logger_1 = require("@/utils/logger");
// Initialize Sentry
function initSentry() {
    if (!config_1.config.monitoring.sentry.dsn) {
        logger_1.logger.warn('Sentry DSN not configured - error tracking disabled', {}, 'sentry');
        return;
    }
    Sentry.init({
        dsn: config_1.config.monitoring.sentry.dsn,
        integrations: (function () {
            var _a, _b;
            var tracing = (_b = (_a = Sentry).browserTracingIntegration) === null || _b === void 0 ? void 0 : _b.call(_a);
            return tracing ? [tracing] : [];
        })(),
        tracesSampleRate: config_1.config.monitoring.sentry.tracesSampleRate,
        environment: config_1.config.app.environment,
        release: config_1.config.app.version,
        // Error filtering
        beforeSend: function (event, _hint) {
            var _a;
            // Filter out certain errors
            if (event.exception) {
                var exception = (_a = event.exception.values) === null || _a === void 0 ? void 0 : _a[0];
                if ((exception === null || exception === void 0 ? void 0 : exception.type) === 'ChunkLoadError') {
                    // Ignore chunk load errors (usually network issues)
                    return null;
                }
            }
            // Add user context if available
            var user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id) {
                event.user = {
                    id: user.id,
                    email: user.email,
                    tenantId: user.tenant_id,
                };
            }
            return event;
        },
        // Breadcrumbs for better debugging
        beforeBreadcrumb: function (breadcrumb) {
            // Filter out sensitive data
            if (breadcrumb.category === 'http' && breadcrumb.data) {
                // Remove sensitive headers
                if (breadcrumb.data.request_headers) {
                    delete breadcrumb.data.request_headers.authorization;
                    delete breadcrumb.data.request_headers.cookie;
                }
            }
            return breadcrumb;
        },
    });
}
// Error boundary component
exports.SentryErrorBoundary = Sentry.ErrorBoundary;
// Performance monitoring
exports.SentryPerformance = {
    // Track API calls
    trackApiCall: function (endpoint, duration, status) {
        Sentry.addBreadcrumb({
            category: 'api',
            message: "".concat(endpoint, " - ").concat(status),
            data: {
                endpoint: endpoint,
                duration: duration,
                status: status,
            },
            level: status >= 400 ? 'error' : 'info',
        });
    },
    // Track page loads
    trackPageLoad: function (route, loadTime) {
        Sentry.addBreadcrumb({
            category: 'navigation',
            message: "Page loaded: ".concat(route),
            data: {
                route: route,
                loadTime: loadTime,
            },
            level: 'info',
        });
    },
    // Track user actions
    trackUserAction: function (action, data) {
        Sentry.addBreadcrumb({
            category: 'user',
            message: action,
            data: data,
            level: 'info',
        });
    },
};
// Utility functions
exports.SentryUtils = {
    // Set user context
    setUser: function (user) {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            tenantId: user.tenant_id,
        });
    },
    // Clear user context
    clearUser: function () {
        Sentry.setUser(null);
    },
    // Capture exceptions
    captureException: function (error, context) {
        Sentry.captureException(error, {
            extra: context,
        });
    },
    // Capture messages
    captureMessage: function (message, level) {
        if (level === void 0) { level = 'info'; }
        Sentry.captureMessage(message, level);
    },
};
