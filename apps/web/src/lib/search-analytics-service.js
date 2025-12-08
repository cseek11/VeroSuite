"use strict";
// ===== SEARCH ANALYTICS SERVICE =====
// Integrates analytics tracking with the existing search system
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
exports.useSearchAnalytics = exports.searchAnalyticsService = exports.SearchAnalyticsService = void 0;
var supabase_client_1 = require("./supabase-client");
var auth_1 = require("../stores/auth");
var logger_1 = require("@/utils/logger");
// ===== SEARCH ANALYTICS SERVICE =====
var SearchAnalyticsService = /** @class */ (function () {
    function SearchAnalyticsService() {
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "searchStartTimes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.sessionId = this.generateSessionId();
    }
    Object.defineProperty(SearchAnalyticsService, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!SearchAnalyticsService.instance) {
                SearchAnalyticsService.instance = new SearchAnalyticsService();
            }
            return SearchAnalyticsService.instance;
        }
    });
    // ===== SESSION MANAGEMENT =====
    Object.defineProperty(SearchAnalyticsService.prototype, "generateSessionId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        }
    });
    Object.defineProperty(SearchAnalyticsService.prototype, "getSessionId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.sessionId;
        }
    });
    // ===== SEARCH TRACKING =====
    /**
     * Start tracking a search query
     * @param queryId Unique identifier for the search
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "startSearchTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (queryId) {
            this.searchStartTimes.set(queryId, performance.now());
        }
    });
    /**
     * Complete search tracking and log analytics
     * @param queryId Unique identifier for the search
     * @param analyticsData Search analytics data
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "completeSearchTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (queryId, analyticsData) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, executionTimeMs, fullAnalyticsData, logId, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = this.searchStartTimes.get(queryId);
                            if (!startTime) {
                                logger_1.logger.warn('Search tracking not started for query', { queryId: queryId }, 'search-analytics-service');
                                return [2 /*return*/, null];
                            }
                            executionTimeMs = Math.round(performance.now() - startTime);
                            this.searchStartTimes.delete(queryId);
                            fullAnalyticsData = __assign(__assign({}, analyticsData), { executionTimeMs: executionTimeMs, sessionId: this.sessionId });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.logSearchQuery(fullAnalyticsData)];
                        case 2:
                            logId = _a.sent();
                            return [2 /*return*/, logId];
                        case 3:
                            error_1 = _a.sent();
                            logger_1.logger.error('Failed to log search analytics', error_1, 'search-analytics-service');
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Log a search query to the analytics system
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "logSearchQuery", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (analyticsData) {
            return __awaiter(this, void 0, void 0, function () {
                var authStore, user, _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            // Debug logging
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Analytics - Logging search query', {
                                    queryText: analyticsData.queryText,
                                    queryType: analyticsData.queryType,
                                    searchMode: analyticsData.searchMode,
                                    resultsCount: analyticsData.resultsCount,
                                    executionTimeMs: analyticsData.executionTimeMs
                                }, 'search-analytics-service');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('log_search_query', {
                                    p_tenant_id: authStore.tenantId,
                                    p_user_id: user.id,
                                    p_session_id: analyticsData.sessionId || this.sessionId,
                                    p_query_text: analyticsData.queryText,
                                    p_query_type: analyticsData.queryType,
                                    p_search_mode: analyticsData.searchMode,
                                    p_results_count: analyticsData.resultsCount,
                                    p_execution_time_ms: analyticsData.executionTimeMs,
                                    p_cache_hit: analyticsData.cacheHit,
                                    p_search_successful: analyticsData.searchSuccessful,
                                    p_error_message: analyticsData.errorMessage || null,
                                    p_user_agent: navigator.userAgent,
                                    p_ip_address: null // Will be captured by backend if needed
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to log search query: ".concat(error.message));
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        }
    });
    /**
     * Log a search result click
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "logSearchClick", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (clickData) {
            return __awaiter(this, void 0, void 0, function () {
                var error, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('log_search_click', {
                                    p_log_id: clickData.logId,
                                    p_clicked_result_id: clickData.clickedResultId,
                                    p_clicked_result_position: clickData.clickedResultPosition,
                                    p_time_to_click_ms: clickData.timeToClickMs
                                })];
                        case 1:
                            error = (_a.sent()).error;
                            if (error) {
                                logger_1.logger.error('Failed to log search click', error, 'search-analytics-service');
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            logger_1.logger.error('Failed to log search click', error_2, 'search-analytics-service');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Log a search error
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "logSearchError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (errorType, errorMessage, queryText, searchMode) {
            return __awaiter(this, void 0, void 0, function () {
                var authStore, user, _a, data, error, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                logger_1.logger.warn('User not authenticated, cannot log search error', {}, 'search-analytics-service');
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('log_search_error', {
                                    p_tenant_id: authStore.tenantId,
                                    p_user_id: user.id,
                                    p_error_type: errorType,
                                    p_error_message: errorMessage,
                                    p_error_stack: new Error().stack || null,
                                    p_query_text: queryText || null,
                                    p_search_mode: searchMode || null,
                                    p_user_agent: navigator.userAgent,
                                    p_ip_address: null
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Failed to log search error', error, 'search-analytics-service');
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, data];
                        case 2:
                            error_3 = _b.sent();
                            logger_1.logger.error('Failed to log search error', error_3, 'search-analytics-service');
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // ===== ANALYTICS QUERIES =====
    /**
     * Get search performance summary
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "getSearchPerformanceSummary", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (daysBack) {
                var authStore, user, _a, data, error, error_4;
                if (daysBack === void 0) { daysBack = 30; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_search_performance_summary', {
                                    p_tenant_id: authStore.tenantId,
                                    p_days_back: daysBack
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to get performance summary: ".concat(error.message));
                            }
                            if (data && data.length > 0) {
                                return [2 /*return*/, data[0]];
                            }
                            return [2 /*return*/, null];
                        case 2:
                            error_4 = _b.sent();
                            logger_1.logger.error('Failed to get search performance summary', error_4, 'search-analytics-service');
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get trending searches
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "getTrendingSearches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var authStore, user, _a, data, error, error_5;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_trending_searches', {
                                    p_tenant_id: authStore.tenantId,
                                    p_limit: limit
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to get trending searches: ".concat(error.message));
                            }
                            return [2 /*return*/, data || []];
                        case 2:
                            error_5 = _b.sent();
                            logger_1.logger.error('Failed to get trending searches', error_5, 'search-analytics-service');
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get search error summary
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "getSearchErrorSummary", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (daysBack) {
                var authStore, user, _a, data, error, error_6;
                if (daysBack === void 0) { daysBack = 30; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_search_error_summary', {
                                    p_tenant_id: authStore.tenantId,
                                    p_days_back: daysBack
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to get error summary: ".concat(error.message));
                            }
                            return [2 /*return*/, data || []];
                        case 2:
                            error_6 = _b.sent();
                            logger_1.logger.error('Failed to get search error summary', error_6, 'search-analytics-service');
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get user search behavior insights
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "getUserSearchInsights", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var authStore, user, _a, data, error, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                throw new Error('User not authenticated');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_user_search_insights', {
                                    p_tenant_id: authStore.tenantId,
                                    p_user_id: user.id
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Failed to get user insights: ".concat(error.message));
                            }
                            if (data && data.length > 0) {
                                return [2 /*return*/, data[0]];
                            }
                            return [2 /*return*/, null];
                        case 2:
                            error_7 = _b.sent();
                            logger_1.logger.error('Failed to get user search insights', error_7, 'search-analytics-service');
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // ===== INTEGRATION HELPERS =====
    /**
     * Create a unique query ID for tracking
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "createQueryId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return "query_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        }
    });
    /**
     * Track search performance metrics
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "trackSearchPerformance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (queryId, searchMode, resultsCount, success, errorMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // Start tracking
                    this.startSearchTracking(queryId);
                    // Complete tracking after a short delay to ensure execution time is captured
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var analyticsData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    analyticsData = {
                                        queryText: queryId, // You might want to pass actual query text here
                                        queryType: 'hybrid', // Default, can be overridden
                                        searchMode: searchMode,
                                        resultsCount: resultsCount,
                                        cacheHit: false, // Default, can be enhanced with cache detection
                                        searchSuccessful: success,
                                        errorMessage: errorMessage,
                                        sessionId: this.sessionId
                                    };
                                    return [4 /*yield*/, this.completeSearchTracking(queryId, analyticsData)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 100);
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Track search result clicks
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "trackSearchClick", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (logId, resultId, position, timeToClickMs) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.logSearchClick({
                                logId: logId,
                                clickedResultId: resultId,
                                clickedResultPosition: position,
                                timeToClickMs: timeToClickMs
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Update popular searches table directly
     */
    Object.defineProperty(SearchAnalyticsService.prototype, "updatePopularSearches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (queryText, resultsCount, searchSuccessful) {
            return __awaiter(this, void 0, void 0, function () {
                var authStore, user, error, error_8;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authStore = auth_1.useAuthStore.getState();
                            user = authStore.user;
                            if (!user) {
                                logger_1.logger.warn('User not authenticated, cannot update popular searches', {}, 'search-analytics-service');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('update_popular_searches', {
                                    p_tenant_id: authStore.tenantId,
                                    p_query_text: queryText,
                                    p_results_count: resultsCount,
                                    p_search_successful: searchSuccessful
                                })];
                        case 1:
                            error = (_b.sent()).error;
                            if (error) {
                                // Handle duplicate key constraint errors (23505) - these are non-critical
                                if (error.code === '23505' || error.code === '409' || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('duplicate key'))) {
                                    logger_1.logger.warn('Popular searches already exists (non-critical)', { error: error.message }, 'search-analytics-service');
                                }
                                else {
                                    logger_1.logger.error('Failed to update popular searches', error, 'search-analytics-service');
                                }
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _b.sent();
                            logger_1.logger.error('Error updating popular searches', error_8, 'search-analytics-service');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    return SearchAnalyticsService;
}());
exports.SearchAnalyticsService = SearchAnalyticsService;
// ===== EXPORT SINGLETON INSTANCE =====
exports.searchAnalyticsService = SearchAnalyticsService.getInstance();
// ===== REACT HOOK FOR SEARCH ANALYTICS =====
// This can be used in components to easily track search analytics
var useSearchAnalytics = function () {
    return {
        startSearchTracking: exports.searchAnalyticsService.startSearchTracking.bind(exports.searchAnalyticsService),
        completeSearchTracking: exports.searchAnalyticsService.completeSearchTracking.bind(exports.searchAnalyticsService),
        trackSearchPerformance: exports.searchAnalyticsService.trackSearchPerformance.bind(exports.searchAnalyticsService),
        trackSearchClick: exports.searchAnalyticsService.trackSearchClick.bind(exports.searchAnalyticsService),
        logSearchError: exports.searchAnalyticsService.logSearchError.bind(exports.searchAnalyticsService),
        getSearchPerformanceSummary: exports.searchAnalyticsService.getSearchPerformanceSummary.bind(exports.searchAnalyticsService),
        getTrendingSearches: exports.searchAnalyticsService.getTrendingSearches.bind(exports.searchAnalyticsService),
        getSearchErrorSummary: exports.searchAnalyticsService.getSearchErrorSummary.bind(exports.searchAnalyticsService),
        getUserSearchInsights: exports.searchAnalyticsService.getUserSearchInsights.bind(exports.searchAnalyticsService),
        createQueryId: exports.searchAnalyticsService.createQueryId.bind(exports.searchAnalyticsService),
        getSessionId: exports.searchAnalyticsService.getSessionId.bind(exports.searchAnalyticsService),
        updatePopularSearches: exports.searchAnalyticsService.updatePopularSearches.bind(exports.searchAnalyticsService)
    };
};
exports.useSearchAnalytics = useSearchAnalytics;
