"use strict";
// ============================================================================
// OPTIMIZED SEARCH SERVICE
// ============================================================================
// High-performance search service with advanced features:
// - Smart search strategy selection
// - Typo tolerance and auto-correction
// - Result caching
// - Performance monitoring
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
exports.optimizedSearch = void 0;
var supabase_client_1 = require("./supabase-client");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var OptimizedSearchService = /** @class */ (function () {
    function OptimizedSearchService() {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "defaultCacheTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
    }
    /**
     * Main search function with intelligent strategy selection
     */
    Object.defineProperty(OptimizedSearchService.prototype, "search", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, options) {
                var startTime, tenantId, _a, enableFuzzySearch, _b, enableTypoTolerance, _c, maxResults, _d, offset, _e, fuzzyThreshold, _f, typoTolerance, _g, useCache, _h, cacheTimeout, cached, cachedSuggestion, results, searchStrategy, correctionSuggested, dbStartTime, fuzzyResults, typoResults, firstTypoResult, databaseTime, totalTime, metrics, suggestion, error_1;
                var _j, _k;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            startTime = performance.now();
                            return [4 /*yield*/, this.getTenantId()];
                        case 1:
                            tenantId = _l.sent();
                            _a = options.enableFuzzySearch, enableFuzzySearch = _a === void 0 ? true : _a, _b = options.enableTypoTolerance, enableTypoTolerance = _b === void 0 ? true : _b, _c = options.maxResults, maxResults = _c === void 0 ? 50 : _c, _d = options.offset, offset = _d === void 0 ? 0 : _d, _e = options.fuzzyThreshold, fuzzyThreshold = _e === void 0 ? 0.3 : _e, _f = options.typoTolerance, typoTolerance = _f === void 0 ? 0.7 : _f, _g = options.useCache, useCache = _g === void 0 ? true : _g, _h = options.cacheTimeout, cacheTimeout = _h === void 0 ? this.defaultCacheTimeout : _h;
                            // Check cache first
                            if (useCache) {
                                cached = this.getCachedResults(query, options);
                                if (cached) {
                                    cachedSuggestion = (_j = cached.results[0]) === null || _j === void 0 ? void 0 : _j.suggested_correction;
                                    return [2 /*return*/, __assign({ results: cached.results, metrics: __assign(__assign({}, cached.metrics), { totalTime: performance.now() - startTime }) }, (cachedSuggestion ? { suggestion: cachedSuggestion } : {}))];
                                }
                            }
                            results = [];
                            searchStrategy = 'unknown';
                            correctionSuggested = false;
                            dbStartTime = performance.now();
                            _l.label = 2;
                        case 2:
                            _l.trys.push([2, 8, , 9]);
                            if (!(query.length >= 2)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.executeSmartSearch(query, tenantId, maxResults, offset)];
                        case 3:
                            results = _l.sent();
                            searchStrategy = 'smart';
                            if (!(results.length < 3 && enableFuzzySearch && query.length >= 3)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.executeFuzzySearch(query, tenantId, fuzzyThreshold, Math.max(5, maxResults - results.length))];
                        case 4:
                            fuzzyResults = _l.sent();
                            results = this.mergeResults(results, fuzzyResults);
                            searchStrategy = 'smart+fuzzy';
                            _l.label = 5;
                        case 5:
                            if (!(results.length < 3 && enableTypoTolerance && query.length >= 3)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.executeTypoTolerantSearch(query, tenantId, typoTolerance, Math.max(5, maxResults - results.length))];
                        case 6:
                            typoResults = _l.sent();
                            firstTypoResult = typoResults[0];
                            if (firstTypoResult === null || firstTypoResult === void 0 ? void 0 : firstTypoResult.suggested_correction) {
                                correctionSuggested = true;
                            }
                            results = this.mergeResults(results, typoResults);
                            searchStrategy = 'smart+fuzzy+typo';
                            _l.label = 7;
                        case 7:
                            databaseTime = performance.now() - dbStartTime;
                            totalTime = performance.now() - startTime;
                            metrics = {
                                totalTime: totalTime,
                                databaseTime: databaseTime,
                                cacheHit: false,
                                resultCount: results.length,
                                searchStrategy: searchStrategy,
                                correctionSuggested: correctionSuggested
                            };
                            // Cache the results
                            if (useCache && results.length > 0) {
                                this.cacheResults(query, options, results, metrics, cacheTimeout);
                            }
                            suggestion = (_k = results.find(function (r) { return r.suggested_correction; })) === null || _k === void 0 ? void 0 : _k.suggested_correction;
                            return [2 /*return*/, __assign({ results: results.slice(0, maxResults), metrics: metrics }, (suggestion ? { suggestion: suggestion } : {}))];
                        case 8:
                            error_1 = _l.sent();
                            logger_1.logger.error('Search failed', error_1, 'optimized-search-service');
                            return [2 /*return*/, {
                                    results: [],
                                    metrics: {
                                        totalTime: performance.now() - startTime,
                                        databaseTime: performance.now() - dbStartTime,
                                        cacheHit: false,
                                        resultCount: 0,
                                        searchStrategy: 'error',
                                        correctionSuggested: false
                                    }
                                }];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Fast search using optimized function
     */
    Object.defineProperty(OptimizedSearchService.prototype, "executeSmartSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, limit, offset) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase
                                .rpc('search_customers_smart', {
                                p_search_term: query,
                                p_tenant_id: tenantId,
                                p_limit: limit,
                                p_offset: offset
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Smart search failed', error, 'optimized-search-service');
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, data || []];
                    }
                });
            });
        }
    });
    /**
     * Fuzzy search for broader matching
     */
    Object.defineProperty(OptimizedSearchService.prototype, "executeFuzzySearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, threshold, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase
                                .rpc('search_customers_fuzzy', {
                                p_search_term: query,
                                p_tenant_id: tenantId,
                                p_similarity_threshold: threshold,
                                p_limit: limit
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Fuzzy search failed', error, 'optimized-search-service');
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, data || []];
                    }
                });
            });
        }
    });
    /**
     * Typo-tolerant search with auto-correction
     */
    Object.defineProperty(OptimizedSearchService.prototype, "executeTypoTolerantSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, _tolerance, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase
                                .rpc('search_customers_with_autocorrect', {
                                p_search_term: query,
                                p_tenant_id: tenantId,
                                p_limit: limit,
                                p_offset: 0
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Typo-tolerant search failed', error, 'optimized-search-service');
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, data || []];
                    }
                });
            });
        }
    });
    /**
     * Learn from user corrections
     */
    Object.defineProperty(OptimizedSearchService.prototype, "learnCorrection", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (original_1, corrected_1) {
            return __awaiter(this, arguments, void 0, function (original, corrected, accepted) {
                var tenantId, error_2;
                if (accepted === void 0) { accepted = true; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.getTenantId()];
                        case 1:
                            tenantId = _a.sent();
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('learn_typo_correction', {
                                    p_tenant_id: tenantId,
                                    p_original: original,
                                    p_corrected: corrected,
                                    p_accepted: accepted
                                })];
                        case 2:
                            _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Learned correction', { original: original, corrected: corrected, accepted: accepted }, 'optimized-search-service');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            logger_1.logger.error('Failed to learn correction', error_2, 'optimized-search-service');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get search suggestions based on query
     */
    Object.defineProperty(OptimizedSearchService.prototype, "getSearchSuggestions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, limit) {
                var tenantId, _a, data, error, error_3;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (query.length < 2)
                                return [2 /*return*/, []];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.getTenantId()];
                        case 2:
                            tenantId = _b.sent();
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_typo_corrections')
                                    .select('corrected_query, frequency')
                                    .eq('tenant_id', tenantId)
                                    .ilike('original_query', "%".concat(query.toLowerCase(), "%"))
                                    .eq('user_accepted', true)
                                    .order('frequency', { ascending: false })
                                    .limit(limit)];
                        case 3:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Failed to get suggestions', error, 'optimized-search-service');
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.map(function (item) { return item.corrected_query; })) || []];
                        case 4:
                            error_3 = _b.sent();
                            logger_1.logger.error('Error getting suggestions', error_3, 'optimized-search-service');
                            return [2 /*return*/, []];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Merge and deduplicate search results
     */
    Object.defineProperty(OptimizedSearchService.prototype, "mergeResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (existing, newResults) {
            var existingIds = new Set(existing.map(function (r) { return r.id; }));
            var uniqueNew = newResults.filter(function (r) { return !existingIds.has(r.id); });
            return __spreadArray(__spreadArray([], existing, true), uniqueNew, true);
        }
    });
    /**
     * Cache management
     */
    Object.defineProperty(OptimizedSearchService.prototype, "getCachedResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, options) {
            var cacheKey = this.generateCacheKey(query, options);
            var cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < (options.cacheTimeout || this.defaultCacheTimeout)) {
                return { results: cached.results, metrics: __assign(__assign({}, cached.metrics), { cacheHit: true }) };
            }
            return null;
        }
    });
    Object.defineProperty(OptimizedSearchService.prototype, "cacheResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, options, results, metrics, _timeout) {
            var cacheKey = this.generateCacheKey(query, options);
            this.cache.set(cacheKey, {
                results: results,
                timestamp: Date.now(),
                metrics: metrics
            });
            // Clean up old cache entries (simple LRU)
            if (this.cache.size > 100) {
                var oldest = this.cache.keys().next();
                if (!oldest.done) {
                    this.cache.delete(oldest.value);
                }
            }
        }
    });
    Object.defineProperty(OptimizedSearchService.prototype, "generateCacheKey", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, options) {
            return "".concat(query.toLowerCase(), "_").concat(JSON.stringify(options));
        }
    });
    /**
     * Clear search cache
     */
    Object.defineProperty(OptimizedSearchService.prototype, "clearCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.cache.clear();
        }
    });
    /**
     * Get performance metrics
     */
    Object.defineProperty(OptimizedSearchService.prototype, "getCacheStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            // This would be more sophisticated in a real implementation
            return {
                size: this.cache.size,
                hitRate: 0.85 // Mock hit rate
            };
        }
    });
    /**
     * Refresh search cache (for materialized view)
     */
    Object.defineProperty(OptimizedSearchService.prototype, "refreshSearchCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('refresh_search_cache')];
                        case 1:
                            _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Search cache refreshed successfully', {}, 'optimized-search-service');
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            logger_1.logger.error('Failed to refresh search cache', error_4, 'optimized-search-service');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get tenant ID for current user
     */
    Object.defineProperty(OptimizedSearchService.prototype, "getTenantId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId;
                return __generator(this, function (_a) {
                    tenantId = auth_1.useAuthStore.getState().tenantId;
                    if (!tenantId) {
                        throw new Error('No tenant ID available');
                    }
                    return [2 /*return*/, tenantId];
                });
            });
        }
    });
    return OptimizedSearchService;
}());
// Export singleton instance
exports.optimizedSearch = new OptimizedSearchService();
