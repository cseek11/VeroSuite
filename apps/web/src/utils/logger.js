"use strict";
/**
 * Centralized logging utility
 * Replaces console.log/error/warn with structured logging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logWarn = exports.logInfo = exports.logDebug = exports.logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
        Object.defineProperty(this, "isDevelopment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: process.env.NODE_ENV === 'development'
        });
        Object.defineProperty(this, "logHistory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxHistorySize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
    }
    Object.defineProperty(Logger.prototype, "formatMessage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level, message, data, context) {
            return {
                level: level,
                message: message,
                data: data || {},
                timestamp: new Date().toISOString(),
                context: context || 'CardSystem',
            };
        }
    });
    Object.defineProperty(Logger.prototype, "addToHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (entry) {
            this.logHistory.push(entry);
            if (this.logHistory.length > this.maxHistorySize) {
                this.logHistory.shift();
            }
        }
    });
    Object.defineProperty(Logger.prototype, "shouldLog", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level) {
            // In production, only log warnings and errors
            if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
                return false;
            }
            return true;
        }
    });
    Object.defineProperty(Logger.prototype, "debug", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, data, context) {
            var entry = this.formatMessage('debug', message, data, context);
            this.addToHistory(entry);
            if (this.shouldLog('debug')) {
                console.debug("[".concat(entry.context, "] ").concat(message), data || '');
            }
        }
    });
    Object.defineProperty(Logger.prototype, "info", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, data, context) {
            var entry = this.formatMessage('info', message, data, context);
            this.addToHistory(entry);
            if (this.shouldLog('info')) {
                console.info("[".concat(entry.context, "] ").concat(message), data || '');
            }
        }
    });
    Object.defineProperty(Logger.prototype, "warn", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, data, context) {
            var entry = this.formatMessage('warn', message, data, context);
            this.addToHistory(entry);
            console.warn("[".concat(entry.context, "] \u26A0\uFE0F ").concat(message), data || '');
        }
    });
    Object.defineProperty(Logger.prototype, "error", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, error, context) {
            var errorData = error instanceof Error
                ? { message: error.message, stack: error.stack, name: error.name }
                : { error: error };
            var entry = this.formatMessage('error', message, errorData, context);
            this.addToHistory(entry);
            console.error("[".concat(entry.context, "] \u274C ").concat(message), errorData);
            // In production, send to error tracking service (e.g., Sentry)
            if (!this.isDevelopment && typeof window !== 'undefined') {
                // TODO: Integrate with error tracking service
                // window.errorTracking?.captureException(error);
            }
        }
    });
    // Get recent logs for debugging
    Object.defineProperty(Logger.prototype, "getHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (level, limit) {
            if (limit === void 0) { limit = 50; }
            var logs = this.logHistory;
            if (level) {
                logs = logs.filter(function (log) { return log.level === level; });
            }
            return logs.slice(-limit);
        }
    });
    // Clear log history
    Object.defineProperty(Logger.prototype, "clearHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.logHistory = [];
        }
    });
    return Logger;
}());
// Export singleton instance
exports.logger = new Logger();
// Convenience functions
var logDebug = function (message, data, context) {
    return exports.logger.debug(message, data, context);
};
exports.logDebug = logDebug;
var logInfo = function (message, data, context) {
    return exports.logger.info(message, data, context);
};
exports.logInfo = logInfo;
var logWarn = function (message, data, context) {
    return exports.logger.warn(message, data, context);
};
exports.logWarn = logWarn;
var logError = function (message, error, context) {
    return exports.logger.error(message, error, context);
};
exports.logError = logError;
