"use strict";
/**
 * Observability test helpers for frontend tests
 * Helps verify logs were emitted, trace IDs are present, etc.
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLogger = void 0;
exports.assertLogEmitted = assertLogEmitted;
exports.assertLogHasRequiredFields = assertLogHasRequiredFields;
exports.assertErrorLogHasRequiredFields = assertErrorLogHasRequiredFields;
exports.assertTraceIdsPresent = assertTraceIdsPresent;
exports.createLogCapture = createLogCapture;
var logger_1 = require("../lib/logger");
/**
 * Mock logger for testing
 */
var MockLogger = /** @class */ (function () {
    function MockLogger() {
        Object.defineProperty(this, "logs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    Object.defineProperty(MockLogger.prototype, "debug", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, operation, traceId, spanId, requestId) {
            this.logs.push(__assign(__assign(__assign(__assign(__assign(__assign({ level: logger_1.LogLevel.DEBUG, message: message }, (typeof context === 'string' ? { context: context } : {})), (operation ? { operation: operation } : {})), { severity: 'debug' }), (traceId ? { traceId: traceId } : {})), (spanId ? { spanId: spanId } : {})), (requestId ? { requestId: requestId } : {})));
        }
    });
    Object.defineProperty(MockLogger.prototype, "info", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, operation, traceId, spanId, requestId) {
            this.logs.push(__assign(__assign(__assign(__assign(__assign(__assign({ level: logger_1.LogLevel.INFO, message: message }, (typeof context === 'string' ? { context: context } : {})), (operation ? { operation: operation } : {})), { severity: 'info' }), (traceId ? { traceId: traceId } : {})), (spanId ? { spanId: spanId } : {})), (requestId ? { requestId: requestId } : {})));
        }
    });
    Object.defineProperty(MockLogger.prototype, "warn", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, _error, operation, errorCode, traceId, spanId, requestId) {
            this.logs.push(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ level: logger_1.LogLevel.WARN, message: message }, (typeof context === 'string' ? { context: context } : {})), (operation ? { operation: operation } : {})), { severity: 'warn' }), (errorCode ? { errorCode: errorCode } : {})), (traceId ? { traceId: traceId } : {})), (spanId ? { spanId: spanId } : {})), (requestId ? { requestId: requestId } : {})));
        }
    });
    Object.defineProperty(MockLogger.prototype, "error", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, _error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            this.logs.push(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ level: logger_1.LogLevel.ERROR, message: message }, (typeof context === 'string' ? { context: context } : {})), (operation ? { operation: operation } : {})), { severity: 'error' }), (errorCode ? { errorCode: errorCode } : {})), (rootCause ? { rootCause: rootCause } : {})), (traceId ? { traceId: traceId } : {})), (spanId ? { spanId: spanId } : {})), (requestId ? { requestId: requestId } : {})));
        }
    });
    Object.defineProperty(MockLogger.prototype, "fatal", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, context, _error, operation, errorCode, rootCause, traceId, spanId, requestId) {
            this.logs.push(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ level: logger_1.LogLevel.FATAL, message: message }, (typeof context === 'string' ? { context: context } : {})), (operation ? { operation: operation } : {})), { severity: 'error' }), (errorCode ? { errorCode: errorCode } : {})), (rootCause ? { rootCause: rootCause } : {})), (traceId ? { traceId: traceId } : {})), (spanId ? { spanId: spanId } : {})), (requestId ? { requestId: requestId } : {})));
        }
    });
    Object.defineProperty(MockLogger.prototype, "clear", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.logs = [];
        }
    });
    return MockLogger;
}());
exports.MockLogger = MockLogger;
/**
 * Assert that a log was emitted matching the assertion
 */
function assertLogEmitted(logs, assertion) {
    for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
        var log = logs_1[_i];
        var matches = true;
        if (assertion.message) {
            if (assertion.message instanceof RegExp) {
                matches = matches && assertion.message.test(log.message);
            }
            else {
                matches = matches && log.message.includes(assertion.message);
            }
        }
        if (assertion.context) {
            matches = matches && log.context === assertion.context;
        }
        if (assertion.operation) {
            matches = matches && log.operation === assertion.operation;
        }
        if (assertion.severity) {
            matches = matches && log.severity === assertion.severity;
        }
        if (assertion.errorCode) {
            matches = matches && log.errorCode === assertion.errorCode;
        }
        if (assertion.traceId) {
            matches = matches && log.traceId === assertion.traceId;
        }
        if (assertion.spanId) {
            matches = matches && log.spanId === assertion.spanId;
        }
        if (assertion.requestId) {
            matches = matches && log.requestId === assertion.requestId;
        }
        if (matches) {
            return { found: true, matchingLog: log };
        }
    }
    return { found: false };
}
/**
 * Assert that required log fields are present
 */
function assertLogHasRequiredFields(log) {
    var requiredFields = ['message', 'context', 'severity', 'timestamp'];
    var missingFields = [];
    requiredFields.forEach(function (field) {
        if (!log[field]) {
            missingFields.push(field);
        }
    });
    return {
        valid: missingFields.length === 0,
        missingFields: missingFields,
    };
}
/**
 * Assert that error log has required error fields
 */
function assertErrorLogHasRequiredFields(log) {
    var requiredFields = ['message', 'context', 'severity', 'timestamp'];
    var recommendedFields = ['errorCode', 'rootCause', 'operation'];
    var missingFields = [];
    var missingRecommended = [];
    requiredFields.forEach(function (field) {
        if (!log[field]) {
            missingFields.push(field);
        }
    });
    recommendedFields.forEach(function (field) {
        if (!log[field]) {
            missingRecommended.push(field);
        }
    });
    return {
        valid: missingFields.length === 0,
        missingFields: __spreadArray(__spreadArray([], missingFields, true), missingRecommended, true),
    };
}
/**
 * Assert that trace IDs are present in logs
 */
function assertTraceIdsPresent(logs) {
    var logsWithoutTraceId = logs.filter(function (log) { return !log.traceId; });
    return {
        valid: logsWithoutTraceId.length === 0,
        logsWithoutTraceId: logsWithoutTraceId,
    };
}
/**
 * Create log capture utility for tests
 */
function createLogCapture() {
    var logs = [];
    return {
        capture: function (log) {
            logs.push(log);
        },
        getLogs: function () { return logs; },
        clear: function () {
            logs.length = 0;
        },
        assertLogEmitted: function (assertion) {
            return assertLogEmitted(logs, assertion);
        },
    };
}
