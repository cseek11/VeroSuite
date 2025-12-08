"use strict";
// ============================================================================
// UNIFIED SEARCH SERVICE
// ============================================================================
// Single, reliable search implementation with comprehensive error handling
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
exports.unifiedSearchService = void 0;
var supabase_client_1 = require("./supabase-client");
var search_error_logger_1 = require("./search-error-logger");
var logger_1 = require("@/utils/logger");
var UnifiedSearchService = /** @class */ (function () {
    function UnifiedSearchService() {
        Object.defineProperty(this, "defaultOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                maxResults: 50,
                enableFuzzy: true,
                enableMultiWord: true,
                timeoutMs: 5000
            }
        });
    }
    /**
     * Main search method - tries multiple search strategies
     */
    Object.defineProperty(UnifiedSearchService.prototype, "searchCustomers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, _filters, options) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, opts, searchQuery, tenantId, searchMethods, _i, searchMethods_1, method, result, executionTime, methodError_1, error_1, executionTime, _a, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            startTime = Date.now();
                            opts = __assign(__assign({}, this.defaultOptions), options);
                            searchQuery = query.trim();
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 14, , 17]);
                            return [4 /*yield*/, this.getTenantId()];
                        case 2:
                            tenantId = _e.sent();
                            if (!!searchQuery) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.getAllCustomers(tenantId, opts.maxResults)];
                        case 3: return [2 /*return*/, _e.sent()];
                        case 4:
                            searchMethods = this.getSearchMethods(opts);
                            _i = 0, searchMethods_1 = searchMethods;
                            _e.label = 5;
                        case 5:
                            if (!(_i < searchMethods_1.length)) return [3 /*break*/, 13];
                            method = searchMethods_1[_i];
                            _e.label = 6;
                        case 6:
                            _e.trys.push([6, 10, , 12]);
                            return [4 /*yield*/, this.executeSearchMethod(method, searchQuery, tenantId, opts.maxResults)];
                        case 7:
                            result = _e.sent();
                            if (!(result.data.length > 0)) return [3 /*break*/, 9];
                            executionTime = Date.now() - startTime;
                            // Log success
                            return [4 /*yield*/, search_error_logger_1.searchErrorLogger.logSuccess('search_customers', searchQuery, result.data.length, executionTime, { tenantId: tenantId })];
                        case 8:
                            // Log success
                            _e.sent();
                            return [2 /*return*/, __assign(__assign({}, result), { executionTimeMs: executionTime, searchMethod: method })];
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            methodError_1 = _e.sent();
                            logger_1.logger.warn('Search method failed', { method: method, error: methodError_1 }, 'unified-search-service');
                            return [4 /*yield*/, search_error_logger_1.searchErrorLogger.logError(methodError_1, {
                                    operation: "search_".concat(method),
                                    query: searchQuery,
                                    tenantId: tenantId
                                }, 'low')];
                        case 11:
                            _e.sent();
                            return [3 /*break*/, 12];
                        case 12:
                            _i++;
                            return [3 /*break*/, 5];
                        case 13: 
                        // If all methods fail, return empty result
                        return [2 /*return*/, {
                                data: [],
                                totalCount: 0,
                                executionTimeMs: Date.now() - startTime,
                                searchMethod: 'fallback'
                            }];
                        case 14:
                            error_1 = _e.sent();
                            executionTime = Date.now() - startTime;
                            _b = (_a = search_error_logger_1.searchErrorLogger).logError;
                            _c = [error_1];
                            _d = {
                                operation: 'search_customers',
                                query: searchQuery
                            };
                            return [4 /*yield*/, this.getTenantId().catch(function () { return 'unknown'; })];
                        case 15: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.tenantId = _e.sent(),
                                    _d), 'high']))];
                        case 16:
                            _e.sent();
                            return [2 /*return*/, {
                                    data: [],
                                    totalCount: 0,
                                    executionTimeMs: executionTime,
                                    searchMethod: 'fallback',
                                    error: error_1.message
                                }];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get all customers (no search query)
     */
    Object.defineProperty(UnifiedSearchService.prototype, "getAllCustomers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, _a, data, error, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            startTime = Date.now();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('accounts')
                                    .select('*')
                                    .eq('tenant_id', tenantId)
                                    .order('name')
                                    .limit(limit)];
                        case 2:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, {
                                    data: data || [],
                                    totalCount: (data === null || data === void 0 ? void 0 : data.length) || 0,
                                    executionTimeMs: Date.now() - startTime,
                                    searchMethod: 'enhanced'
                                }];
                        case 3:
                            error_2 = _b.sent();
                            throw new Error("Failed to get all customers: ".concat(error_2.message));
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute specific search method
     */
    Object.defineProperty(UnifiedSearchService.prototype, "executeSearchMethod", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (method, query, tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = method;
                            switch (_a) {
                                case 'enhanced': return [3 /*break*/, 1];
                                case 'multi_word': return [3 /*break*/, 3];
                                case 'fuzzy': return [3 /*break*/, 5];
                                case 'fallback': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 9];
                        case 1: return [4 /*yield*/, this.searchEnhanced(query, tenantId, limit)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3: return [4 /*yield*/, this.searchMultiWord(query, tenantId, limit)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5: return [4 /*yield*/, this.searchFuzzy(query, tenantId, limit)];
                        case 6: return [2 /*return*/, _b.sent()];
                        case 7: return [4 /*yield*/, this.searchFallback(query, tenantId, limit)];
                        case 8: return [2 /*return*/, _b.sent()];
                        case 9: throw new Error("Unknown search method: ".concat(method));
                    }
                });
            });
        }
    });
    /**
     * Enhanced search using search_customers_enhanced function
     */
    Object.defineProperty(UnifiedSearchService.prototype, "searchEnhanced", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_enhanced', {
                                p_search_term: query,
                                p_tenant_id: tenantId,
                                p_limit: limit,
                                p_offset: 0
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, {
                                    data: data || [],
                                    totalCount: (data === null || data === void 0 ? void 0 : data.length) || 0
                                }];
                    }
                });
            });
        }
    });
    /**
     * Multi-word search using search_customers_multi_word function
     */
    Object.defineProperty(UnifiedSearchService.prototype, "searchMultiWord", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_multi_word', {
                                p_search_term: query,
                                p_tenant_id: tenantId,
                                p_limit: limit,
                                p_offset: 0
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, {
                                    data: data || [],
                                    totalCount: (data === null || data === void 0 ? void 0 : data.length) || 0
                                }];
                    }
                });
            });
        }
    });
    /**
     * Fuzzy search using search_customers_fuzzy function
     */
    Object.defineProperty(UnifiedSearchService.prototype, "searchFuzzy", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_fuzzy', {
                                p_tenant_id: tenantId,
                                p_query: query,
                                p_threshold: 0.3,
                                p_limit: limit
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, {
                                    data: data || [],
                                    totalCount: (data === null || data === void 0 ? void 0 : data.length) || 0
                                }];
                    }
                });
            });
        }
    });
    /**
     * Fallback search using direct Supabase queries
     */
    Object.defineProperty(UnifiedSearchService.prototype, "searchFallback", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, tenantId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, supabase_client_1.supabase
                                .from('accounts')
                                .select('*')
                                .eq('tenant_id', tenantId)
                                .or("name.ilike.%".concat(query, "%,email.ilike.%").concat(query, "%,phone.ilike.%").concat(query, "%"))
                                .order('name')
                                .limit(limit)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, {
                                    data: data || [],
                                    totalCount: (data === null || data === void 0 ? void 0 : data.length) || 0
                                }];
                    }
                });
            });
        }
    });
    /**
     * Get search methods in order of preference
     */
    Object.defineProperty(UnifiedSearchService.prototype, "getSearchMethods", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (options) {
            var methods = ['enhanced'];
            if (options.enableMultiWord) {
                methods.push('multi_word');
            }
            if (options.enableFuzzy) {
                methods.push('fuzzy');
            }
            methods.push('fallback');
            return methods;
        }
    });
    /**
     * Get tenant ID with fallback
     */
    Object.defineProperty(UnifiedSearchService.prototype, "getTenantId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var user, tenantIdFromMetadata, validTenantId, dbError_1, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                        case 1:
                            user = (_b.sent()).data.user;
                            if (!user) return [3 /*break*/, 5];
                            tenantIdFromMetadata = (_a = user.user_metadata) === null || _a === void 0 ? void 0 : _a.tenant_id;
                            if (tenantIdFromMetadata) {
                                return [2 /*return*/, tenantIdFromMetadata];
                            }
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_user_tenant_id', {
                                    user_email: user.email
                                })];
                        case 3:
                            validTenantId = (_b.sent()).data;
                            if (validTenantId) {
                                return [2 /*return*/, validTenantId];
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            dbError_1 = _b.sent();
                            logger_1.logger.warn('Failed to get tenant ID from database', { error: dbError_1 }, 'unified-search-service');
                            return [3 /*break*/, 5];
                        case 5: 
                        // Fallback to development tenant ID
                        return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28'];
                        case 6:
                            error_3 = _b.sent();
                            logger_1.logger.error('Error getting tenant ID', error_3, 'unified-search-service');
                            return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28'];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get search performance statistics
     */
    Object.defineProperty(UnifiedSearchService.prototype, "getSearchStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var stats;
                return __generator(this, function (_a) {
                    try {
                        stats = search_error_logger_1.searchErrorLogger.getErrorStats();
                        return [2 /*return*/, {
                                totalSearches: stats.total,
                                avgExecutionTime: 0, // Would need to track this separately
                                errorRate: stats.total > 0 ? (stats.unresolved / stats.total) * 100 : 0,
                                methodDistribution: stats.byType
                            }];
                    }
                    catch (error) {
                        logger_1.logger.error('Failed to get search stats', error, 'unified-search-service');
                        return [2 /*return*/, {
                                totalSearches: 0,
                                avgExecutionTime: 0,
                                errorRate: 0,
                                methodDistribution: {}
                            }];
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Clear search cache (if implemented)
     */
    Object.defineProperty(UnifiedSearchService.prototype, "clearCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Placeholder for cache clearing
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Search cache cleared', {}, 'unified-search-service');
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    return UnifiedSearchService;
}());
// Export singleton instance
exports.unifiedSearchService = new UnifiedSearchService();
