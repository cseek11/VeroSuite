"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogger = exports.logger = exports.Logger = exports.LogLevel = void 0;
var sentry_1 = require("./sentry");
var config_1 = require("./config");
// Log levels
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Structured logger class
var Logger = /** @class */ (function () {
    function Logger() {
        Object.defineProperty(this, "logs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxLogs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sessionId = this.generateSessionId();
    }
    Object.defineProperty(Logger, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!Logger.instance) {
                Logger.instance = new Logger();
            }
            return Logger.instance;
        }
    });
    // Generate unique session ID
    Object.defineProperty(Logger.prototype, "generateSessionId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        }
    });
    // Get user context
    Object.defineProperty(Logger.prototype, "getUserContext", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            try {
                var user = JSON.parse(localStorage.getItem('user') || '{}');
                return {
                    userId: user.id,
                    tenantId: user.tenant_id,
                    email: user.email,
                };
            }
            catch (_a) {
                return {};
            }
        }
    });
    // Create log entry with structured format
    // MANDATORY: All logs must include message, context, traceId, operation, severity, errorCode/rootCause
    Object.defineProperty(Logger.prototype, "createLogEntry", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            var userContext = this.getUserContext();
            // Handle context as string (context identifier) or object (legacy support)
            var contextValue = typeof context === 'string' ? context : (context || 'Application');
            var additionalData = typeof context === 'object' ? context : {};
            // Get or generate trace ID
            var finalTraceId = traceId || this.getOrGenerateTraceId();
            var finalRequestId = requestId || this.getOrGenerateRequestId();
            var entry = {
                level: level,
                message: message,
                timestamp: new Date().toISOString(),
                context: contextValue,
                severity: this.getSeverityFromLevel(level),
                additionalData: __assign(__assign(__assign({}, additionalData), userContext), { sessionId: this.sessionId, environment: config_1.config.app.environment, version: config_1.config.app.version }),
                userId: userContext.userId,
                tenantId: userContext.tenantId,
                sessionId: this.sessionId,
            };
            if (operation)
                entry.operation = operation;
            if (errorCode)
                entry.errorCode = errorCode;
            if (rootCause)
                entry.rootCause = rootCause;
            if (finalTraceId)
                entry.traceId = finalTraceId;
            if (spanId)
                entry.spanId = spanId;
            if (finalRequestId)
                entry.requestId = finalRequestId;
            if (error)
                entry.error = error;
            return entry;
        }
    });
    // Get severity string from log level
    Object.defineProperty(Logger.prototype, "getSeverityFromLevel", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level) {
            switch (level) {
                case LogLevel.DEBUG:
                    return 'debug';
                case LogLevel.INFO:
                    return 'info';
                case LogLevel.WARN:
                    return 'warn';
                case LogLevel.ERROR:
                case LogLevel.FATAL:
                    return 'error';
                default:
                    return 'info';
            }
        }
    });
    // Get or generate trace ID (stored in session storage for consistency)
    Object.defineProperty(Logger.prototype, "getOrGenerateTraceId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var key = 'verofield_trace_id';
            var traceId = sessionStorage.getItem(key);
            if (!traceId) {
                traceId = "trace_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                sessionStorage.setItem(key, traceId);
            }
            return traceId;
        }
    });
    // Get or generate request ID
    Object.defineProperty(Logger.prototype, "getOrGenerateRequestId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return "req_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        }
    });
    // Add log entry
    Object.defineProperty(Logger.prototype, "addLog", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (entry) {
            this.logs.push(entry);
            // Keep only the last maxLogs entries
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(-this.maxLogs);
            }
            // Send to Sentry for error levels
            if (entry.level >= LogLevel.ERROR) {
                if (entry.error) {
                    sentry_1.SentryUtils.captureException(entry.error, { extra: entry.context });
                }
                else {
                    sentry_1.SentryUtils.captureMessage(entry.message, 'error');
                }
            }
            // Console output based on environment
            if (config_1.config.app.environment === 'development' || entry.level >= LogLevel.WARN) {
                this.consoleOutput(entry);
            }
        }
    });
    // Console output with formatting
    Object.defineProperty(Logger.prototype, "consoleOutput", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_entry) {
            // Direct console output disabled to enforce structured logging policy.
            // Logs are stored in memory, optionally sent to Sentry, and retrievable via getLogs().
        }
    });
    // Log methods with structured format support
    /**
     * Log debug message with structured format
     * @param message - Human-readable log message
     * @param context - Context identifier (string) or additional data (object for backward compatibility)
     * @param operation - Operation name (function, endpoint, action)
     * @param traceId - Distributed trace identifier
     * @param spanId - Span identifier within trace
     * @param requestId - Request identifier
     */
    Object.defineProperty(Logger.prototype, "debug", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, operation, traceId, spanId, requestId) {
            var entry = this.createLogEntry(LogLevel.DEBUG, message, context, undefined, operation, undefined, undefined, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    /**
     * Log info message with structured format
     */
    Object.defineProperty(Logger.prototype, "info", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, operation, traceId, spanId, requestId) {
            var entry = this.createLogEntry(LogLevel.INFO, message, context, undefined, operation, undefined, undefined, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    /**
     * Log warning message with structured format
     */
    Object.defineProperty(Logger.prototype, "warn", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, error, operation, errorCode, traceId, spanId, requestId) {
            var entry = this.createLogEntry(LogLevel.WARN, message, context, error, operation, errorCode, undefined, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    /**
     * Log error message with structured format
     */
    Object.defineProperty(Logger.prototype, "error", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            var entry = this.createLogEntry(LogLevel.ERROR, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    /**
     * Log fatal error message with structured format
     */
    Object.defineProperty(Logger.prototype, "fatal", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            var entry = this.createLogEntry(LogLevel.FATAL, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    // API call logging
    Object.defineProperty(Logger.prototype, "logApiCall", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, method, status, duration, error) {
            var level = error ? LogLevel.ERROR : (status >= 400 ? LogLevel.WARN : LogLevel.INFO);
            var message = "API ".concat(method, " ").concat(endpoint, " - ").concat(status, " (").concat(duration, "ms)");
            var context = {
                endpoint: endpoint,
                method: method,
                status: status,
                duration: duration,
                type: 'api_call',
            };
            if (error) {
                this.log(level, message, context, error);
            }
            else {
                this.log(level, message, context);
            }
        }
    });
    // User action logging
    Object.defineProperty(Logger.prototype, "logUserAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (action, data) {
            var message = "User action: ".concat(action);
            var context = {
                action: action,
                data: data,
                type: 'user_action',
            };
            this.info(message, context);
        }
    });
    // Page navigation logging
    Object.defineProperty(Logger.prototype, "logPageNavigation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (from, to, duration) {
            var message = "Navigation: ".concat(from, " \u2192 ").concat(to);
            var context = {
                from: from,
                to: to,
                duration: duration,
                type: 'navigation',
            };
            this.info(message, context);
        }
    });
    // Generic log method with structured format support
    Object.defineProperty(Logger.prototype, "log", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            var entry = this.createLogEntry(level, message, context, error, operation, errorCode, rootCause, traceId, spanId, requestId);
            this.addLog(entry);
        }
    });
    // Get logs with filtering
    Object.defineProperty(Logger.prototype, "getLogs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (filter) {
            var now = Date.now();
            return this.logs.filter(function (entry) {
                var _a;
                if ((filter === null || filter === void 0 ? void 0 : filter.level) && entry.level < filter.level) {
                    return false;
                }
                if (filter === null || filter === void 0 ? void 0 : filter.timeRange) {
                    var entryTime = new Date(entry.timestamp).getTime();
                    return now - entryTime < filter.timeRange;
                }
                if (filter === null || filter === void 0 ? void 0 : filter.type) {
                    var ctxType = typeof entry.context === 'object' ? (_a = entry.context) === null || _a === void 0 ? void 0 : _a.type : undefined;
                    if (ctxType !== filter.type) {
                        return false;
                    }
                }
                if ((filter === null || filter === void 0 ? void 0 : filter.userId) && entry.userId !== filter.userId) {
                    return false;
                }
                return true;
            });
        }
    });
    // Export logs
    Object.defineProperty(Logger.prototype, "exportLogs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return JSON.stringify(this.logs, null, 2);
        }
    });
    // Clear logs
    Object.defineProperty(Logger.prototype, "clearLogs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.logs = [];
        }
    });
    // Get log statistics
    Object.defineProperty(Logger.prototype, "getLogStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var stats = {
                total: this.logs.length,
                byLevel: {},
                byType: {},
            };
            this.logs.forEach(function (entry) {
                var _a;
                var level = LogLevel[entry.level];
                stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
                var type = typeof entry.context === 'object' ? ((_a = entry.context) === null || _a === void 0 ? void 0 : _a.type) || 'general' : 'general';
                stats.byType[type] = (stats.byType[type] || 0) + 1;
            });
            return stats;
        }
    });
    return Logger;
}());
exports.Logger = Logger;
// Logger instance
exports.logger = Logger.getInstance();
// React hook for logging
var useLogger = function () {
    return {
        debug: function (message, context) { return exports.logger.debug(message, context); },
        info: function (message, context) { return exports.logger.info(message, context); },
        warn: function (message, context, error) { return exports.logger.warn(message, context, error); },
        error: function (message, context, error) { return exports.logger.error(message, context, error); },
        fatal: function (message, context, error) { return exports.logger.fatal(message, context, error); },
        logApiCall: function (endpoint, method, status, duration, error) {
            return exports.logger.logApiCall(endpoint, method, status, duration, error);
        },
        logUserAction: function (action, data) { return exports.logger.logUserAction(action, data); },
        logPageNavigation: function (from, to, duration) { return exports.logger.logPageNavigation(from, to, duration); },
    };
};
exports.useLogger = useLogger;
