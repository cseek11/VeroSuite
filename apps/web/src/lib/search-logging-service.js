"use strict";
// ============================================================================
// SEARCH LOGGING SERVICE
// ============================================================================
// Service for logging search queries and analytics
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
exports.searchLoggingService = void 0;
var supabase_client_1 = require("./supabase-client");
var logger_1 = require("@/utils/logger");
var SearchLoggingService = /** @class */ (function () {
    function SearchLoggingService() {
        var _this = this;
        Object.defineProperty(this, "getCurrentUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () { return __awaiter(_this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                        case 1:
                            user = (_a.sent()).data.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [2 /*return*/, user];
                    }
                });
            }); }
        });
        Object.defineProperty(this, "getTenantId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () { return __awaiter(_this, void 0, void 0, function () {
                var user, _a, tenantId, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                        case 1:
                            user = (_b.sent()).data.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .rpc('get_user_tenant_id', {
                                    user_email: user.email
                                })];
                        case 2:
                            _a = _b.sent(), tenantId = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to get tenant ID: ".concat(error.message));
                            }
                            if (typeof tenantId !== 'string' || !tenantId) {
                                throw new Error('No tenant ID found for user');
                            }
                            return [2 /*return*/, tenantId];
                    }
                });
            }); }
        });
        /**
         * Log a search query
         */
        Object.defineProperty(this, "logSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (params) { return __awaiter(_this, void 0, void 0, function () {
                var user, tenantId, _a, logData, error, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.getCurrentUser()];
                        case 1:
                            user = _b.sent();
                            return [4 /*yield*/, this.getTenantId()];
                        case 2:
                            tenantId = _b.sent();
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_logs')
                                    .insert({
                                    user_id: user.id,
                                    tenant_id: tenantId,
                                    query: params.query,
                                    results_count: params.resultsCount,
                                    time_taken_ms: params.timeTakenMs,
                                    search_filters: params.searchFilters || null
                                })
                                    .select('id')
                                    .single()];
                        case 3:
                            _a = _b.sent(), logData = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Failed to log search', error, 'search-logging-service');
                                throw error;
                            }
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Search logged', { query: params.query, logId: logData.id }, 'search-logging-service');
                            }
                            return [2 /*return*/, logData.id];
                        case 4:
                            error_1 = _b.sent();
                            logger_1.logger.error('Error logging search', error_1, 'search-logging-service');
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        });
        /**
         * Log a click on a search result
         */
        Object.defineProperty(this, "logClick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (logId, recordId) { return __awaiter(_this, void 0, void 0, function () {
                var error, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_logs')
                                    .update({ clicked_record_id: recordId })
                                    .eq('id', logId)];
                        case 1:
                            error = (_a.sent()).error;
                            if (error) {
                                logger_1.logger.error('Failed to log click', error, 'search-logging-service');
                                throw error;
                            }
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Click logged', { logId: logId, recordId: recordId }, 'search-logging-service');
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            logger_1.logger.error('Error logging click', error_2, 'search-logging-service');
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        });
        /**
         * Get search analytics for the current tenant
         */
        Object.defineProperty(this, "getSearchAnalytics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                var args_1 = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args_1[_i] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (daysBack) {
                    var tenantId, cutoffDate, _a, statsData, statsError, _b, popularData_1, popularError, totalSearches, avgResultsCount, avgTimeTakenMs, totalClicks, clickThroughRate, queryCounts_1, mostCommonQueries, zeroResultQueries, error_3;
                    if (daysBack === void 0) { daysBack = 30; }
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 4, , 5]);
                                return [4 /*yield*/, this.getTenantId()];
                            case 1:
                                tenantId = _c.sent();
                                cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
                                return [4 /*yield*/, supabase_client_1.supabase
                                        .from('search_logs')
                                        .select('results_count, time_taken_ms, clicked_record_id')
                                        .eq('tenant_id', tenantId)
                                        .gte('created_at', cutoffDate)];
                            case 2:
                                _a = _c.sent(), statsData = _a.data, statsError = _a.error;
                                if (statsError) {
                                    logger_1.logger.error('Failed to get search stats', statsError, 'search-logging-service');
                                    throw statsError;
                                }
                                return [4 /*yield*/, supabase_client_1.supabase
                                        .from('search_logs')
                                        .select('query, results_count')
                                        .eq('tenant_id', tenantId)
                                        .gte('created_at', cutoffDate)];
                            case 3:
                                _b = _c.sent(), popularData_1 = _b.data, popularError = _b.error;
                                if (popularError) {
                                    logger_1.logger.error('Failed to get popular queries', popularError, 'search-logging-service');
                                    throw popularError;
                                }
                                totalSearches = statsData.length;
                                avgResultsCount = totalSearches > 0 ? statsData.reduce(function (sum, log) { return sum + (log.results_count || 0); }, 0) / totalSearches : 0;
                                avgTimeTakenMs = totalSearches > 0 ? statsData.reduce(function (sum, log) { return sum + log.time_taken_ms; }, 0) / totalSearches : 0;
                                totalClicks = statsData.filter(function (log) { return log.clicked_record_id; }).length;
                                clickThroughRate = totalSearches > 0 ? totalClicks / totalSearches : 0;
                                queryCounts_1 = {};
                                popularData_1.forEach(function (log) {
                                    queryCounts_1[log.query] = (queryCounts_1[log.query] || 0) + 1;
                                });
                                mostCommonQueries = Object.entries(queryCounts_1)
                                    .map(function (_a) {
                                    var query = _a[0], count = _a[1];
                                    return ({ query: query, count: count });
                                })
                                    .sort(function (a, b) { return b.count - a.count; })
                                    .slice(0, 10);
                                zeroResultQueries = Object.entries(queryCounts_1)
                                    .filter(function (_a) {
                                    var query = _a[0];
                                    var queryLogs = popularData_1.filter(function (log) { return log.query === query; });
                                    return queryLogs.every(function (log) { return log.results_count === 0; });
                                })
                                    .map(function (_a) {
                                    var query = _a[0], count = _a[1];
                                    return ({ query: query, count: count });
                                })
                                    .sort(function (a, b) { return b.count - a.count; })
                                    .slice(0, 10);
                                return [2 /*return*/, {
                                        total_searches: totalSearches,
                                        avg_results_count: avgResultsCount,
                                        avg_time_taken_ms: avgTimeTakenMs,
                                        most_common_queries: mostCommonQueries,
                                        zero_result_queries: zeroResultQueries,
                                        click_through_rate: clickThroughRate
                                    }];
                            case 4:
                                error_3 = _c.sent();
                                logger_1.logger.error('Error getting search analytics', error_3, 'search-logging-service');
                                throw error_3;
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Get recent search queries for suggestions
         */
        Object.defineProperty(this, "getRecentSearches", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                var args_1 = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args_1[_i] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (limit) {
                    var user, tenantId, _a, data, error, uniqueQueries, error_4;
                    if (limit === void 0) { limit = 10; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 4, , 5]);
                                return [4 /*yield*/, this.getCurrentUser()];
                            case 1:
                                user = _b.sent();
                                return [4 /*yield*/, this.getTenantId()];
                            case 2:
                                tenantId = _b.sent();
                                return [4 /*yield*/, supabase_client_1.supabase
                                        .from('search_logs')
                                        .select('query')
                                        .eq('tenant_id', tenantId)
                                        .eq('user_id', user.id)
                                        .order('created_at', { ascending: false })
                                        .limit(limit)];
                            case 3:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    logger_1.logger.error('Failed to get recent searches', error, 'search-logging-service');
                                    throw error;
                                }
                                uniqueQueries = __spreadArray([], new Set(data.map(function (item) { return item.query; })), true);
                                return [2 /*return*/, uniqueQueries];
                            case 4:
                                error_4 = _b.sent();
                                logger_1.logger.error('Error getting recent searches', error_4, 'search-logging-service');
                                return [2 /*return*/, []];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Get popular search queries for the tenant
         */
        Object.defineProperty(this, "getPopularSearches", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                var args_1 = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args_1[_i] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (limit) {
                    var tenantId, _a, data, error, queryCounts_2, error_5;
                    if (limit === void 0) { limit = 10; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this.getTenantId()];
                            case 1:
                                tenantId = _b.sent();
                                return [4 /*yield*/, supabase_client_1.supabase
                                        .from('search_logs')
                                        .select('query')
                                        .eq('tenant_id', tenantId)
                                        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())];
                            case 2:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    logger_1.logger.error('Failed to get popular searches', error, 'search-logging-service');
                                    throw error;
                                }
                                queryCounts_2 = {};
                                data.forEach(function (item) {
                                    queryCounts_2[item.query] = (queryCounts_2[item.query] || 0) + 1;
                                });
                                // Sort by count and return top queries
                                return [2 /*return*/, Object.entries(queryCounts_2)
                                        .map(function (_a) {
                                        var query = _a[0], count = _a[1];
                                        return ({ query: query, count: count });
                                    })
                                        .sort(function (a, b) { return b.count - a.count; })
                                        .slice(0, limit)];
                            case 3:
                                error_5 = _b.sent();
                                logger_1.logger.error('Error getting popular searches', error_5, 'search-logging-service');
                                return [2 /*return*/, []];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Get search corrections for the tenant
         */
        Object.defineProperty(this, "getSearchCorrections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () { return __awaiter(_this, void 0, void 0, function () {
                var tenantId, _a, data, error, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.getTenantId()];
                        case 1:
                            tenantId = _b.sent();
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_corrections')
                                    .select('*')
                                    .eq('tenant_id', tenantId)
                                    .order('confidence_score', { ascending: false })];
                        case 2:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Failed to get search corrections', error, 'search-logging-service');
                                throw error;
                            }
                            return [2 /*return*/, data || []];
                        case 3:
                            error_6 = _b.sent();
                            logger_1.logger.error('Error getting search corrections', error_6, 'search-logging-service');
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        });
        /**
         * Add or update a search correction
         */
        Object.defineProperty(this, "addSearchCorrection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (params) { return __awaiter(_this, void 0, void 0, function () {
                var tenantId, _a, existing, fetchError, updateError, insertError, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.getTenantId()];
                        case 1:
                            tenantId = _b.sent();
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_corrections')
                                    .select('*')
                                    .eq('tenant_id', tenantId)
                                    .eq('original_query', params.originalQuery)
                                    .eq('corrected_query', params.correctedQuery)
                                    .single()];
                        case 2:
                            _a = _b.sent(), existing = _a.data, fetchError = _a.error;
                            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
                                throw fetchError;
                            }
                            if (!existing) return [3 /*break*/, 4];
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_corrections')
                                    .update({
                                    total_attempts: existing.total_attempts + 1,
                                    success_count: existing.success_count + (params.wasSuccessful ? 1 : 0)
                                })
                                    .eq('id', existing.id)];
                        case 3:
                            updateError = (_b.sent()).error;
                            if (updateError) {
                                throw updateError;
                            }
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_corrections')
                                .insert({
                                tenant_id: tenantId,
                                original_query: params.originalQuery,
                                corrected_query: params.correctedQuery,
                                total_attempts: 1,
                                success_count: params.wasSuccessful ? 1 : 0
                            })];
                        case 5:
                            insertError = (_b.sent()).error;
                            if (insertError) {
                                throw insertError;
                            }
                            _b.label = 6;
                        case 6:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Search correction logged', params, 'search-logging-service');
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            error_7 = _b.sent();
                            logger_1.logger.error('Error adding search correction', error_7, 'search-logging-service');
                            throw error_7;
                        case 8: return [2 /*return*/];
                    }
                });
            }); }
        });
    }
    return SearchLoggingService;
}());
// Export singleton instance
exports.searchLoggingService = new SearchLoggingService();
