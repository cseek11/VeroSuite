"use strict";
// ============================================================================
// SEARCH ERROR LOGGER
// ============================================================================
// Comprehensive error logging for search operations with detailed context
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchErrorLogger = void 0;
var supabase_client_1 = require("./supabase-client");
var logger_1 = require("@/utils/logger");
var SearchErrorLogger = /** @class */ (function () {
    function SearchErrorLogger() {
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // Keep last 1000 errors in memory
    }
    /**
     * Log a search error with full context
     */
    Object.defineProperty(SearchErrorLogger.prototype, "logError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error_1, context_1) {
            return __awaiter(this, arguments, void 0, function (error, context, severity) {
                var errorId, fullContext, searchError, persistError_1;
                if (severity === void 0) { severity = 'medium'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            errorId = crypto.randomUUID();
                            fullContext = __assign({ operation: 'unknown', timestamp: new Date() }, context);
                            searchError = {
                                id: errorId,
                                type: this.categorizeError(error),
                                message: error.message,
                                context: fullContext,
                                severity: severity,
                                resolved: false,
                                createdAt: new Date()
                            };
                            // Add to memory cache
                            this.errors.unshift(searchError);
                            if (this.errors.length > this.maxErrors) {
                                this.errors = this.errors.slice(0, this.maxErrors);
                            }
                            // Log error with detailed context
                            logger_1.logger.error('Search Error', {
                                id: errorId,
                                type: searchError.type,
                                severity: severity,
                                operation: fullContext.operation,
                                message: error.message,
                                query: fullContext.query,
                                stack: error.stack,
                                context: fullContext
                            }, 'search-error-logger');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.persistError(searchError)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            persistError_1 = _a.sent();
                            logger_1.logger.error('Failed to persist search error', persistError_1, 'search-error-logger');
                            return [3 /*break*/, 4];
                        case 4: 
                        // Send to external error tracking if configured
                        return [4 /*yield*/, this.sendToErrorTracking(searchError)];
                        case 5:
                            // Send to external error tracking if configured
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Log search operation success for analytics
     */
    Object.defineProperty(SearchErrorLogger.prototype, "logSuccess", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (operation, query, resultsCount, executionTimeMs, context) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Search Success', {
                                    operation: operation,
                                    query: query,
                                    resultsCount: resultsCount,
                                    executionTimeMs: executionTimeMs,
                                    context: context
                                }, 'search-error-logger');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('log_search_success', {
                                    p_operation: operation,
                                    p_query: query,
                                    p_results_count: resultsCount,
                                    p_execution_time_ms: executionTimeMs,
                                    p_context: context || {}
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            logger_1.logger.warn('Failed to log search success', { error: error_1 }, 'search-error-logger');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get recent errors for debugging
     */
    Object.defineProperty(SearchErrorLogger.prototype, "getRecentErrors", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (limit) {
            if (limit === void 0) { limit = 50; }
            return this.errors.slice(0, limit);
        }
    });
    /**
     * Get errors by type
     */
    Object.defineProperty(SearchErrorLogger.prototype, "getErrorsByType", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (type) {
            return this.errors.filter(function (error) { return error.type === type; });
        }
    });
    /**
     * Get critical errors that need attention
     */
    Object.defineProperty(SearchErrorLogger.prototype, "getCriticalErrors", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.errors.filter(function (error) { return error.severity === 'critical' && !error.resolved; });
        }
    });
    /**
     * Mark error as resolved
     */
    Object.defineProperty(SearchErrorLogger.prototype, "resolveError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (errorId) {
            return __awaiter(this, void 0, void 0, function () {
                var error, dbError_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = this.errors.find(function (e) { return e.id === errorId; });
                            if (!error) return [3 /*break*/, 4];
                            error.resolved = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_errors')
                                    .update({ is_resolved: true, resolved_at: new Date().toISOString() })
                                    .eq('id', errorId)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            dbError_1 = _a.sent();
                            logger_1.logger.error('Failed to update error resolution', dbError_1, 'search-error-logger');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get error statistics
     */
    Object.defineProperty(SearchErrorLogger.prototype, "getErrorStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var now = new Date();
            var last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            var byType = this.errors.reduce(function (acc, error) {
                acc[error.type] = (acc[error.type] || 0) + 1;
                return acc;
            }, {});
            var bySeverity = this.errors.reduce(function (acc, error) {
                acc[error.severity] = (acc[error.severity] || 0) + 1;
                return acc;
            }, {});
            return {
                total: this.errors.length,
                byType: byType,
                bySeverity: bySeverity,
                unresolved: this.errors.filter(function (e) { return !e.resolved; }).length,
                last24Hours: this.errors.filter(function (e) { return e.createdAt > last24Hours; }).length
            };
        }
    });
    /**
     * Categorize error type based on error message and context
     */
    Object.defineProperty(SearchErrorLogger.prototype, "categorizeError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            var message = error.message.toLowerCase();
            if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
                return 'permission';
            }
            if (message.includes('authentication') || message.includes('token') || message.includes('login')) {
                return 'authentication';
            }
            if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
                return 'network';
            }
            if (message.includes('database') || message.includes('sql') || message.includes('query')) {
                return 'database';
            }
            if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
                return 'validation';
            }
            return 'unknown';
        }
    });
    /**
     * Persist error to database
     */
    Object.defineProperty(SearchErrorLogger.prototype, "persistError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return __awaiter(this, void 0, void 0, function () {
                var dbError_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.from('search_errors').insert({
                                    id: error.id,
                                    tenant_id: error.context.tenantId,
                                    user_id: error.context.userId,
                                    error_type: error.type,
                                    error_message: error.message,
                                    error_stack: error.context.stack,
                                    query_text: error.context.query,
                                    user_agent: error.context.userAgent,
                                    created_at: error.createdAt.toISOString()
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            dbError_2 = _a.sent();
                            logger_1.logger.error('Failed to persist search error to database', dbError_2, 'search-error-logger');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Send error to external tracking service
     */
    Object.defineProperty(SearchErrorLogger.prototype, "sendToErrorTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // This would integrate with services like Sentry, LogRocket, etc.
                    // For now, just log to logger
                    if (error.severity === 'critical') {
                        logger_1.logger.error('CRITICAL SEARCH ERROR - Consider external alerting', error, 'search-error-logger');
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    return SearchErrorLogger;
}());
// Export singleton instance
exports.searchErrorLogger = new SearchErrorLogger();
