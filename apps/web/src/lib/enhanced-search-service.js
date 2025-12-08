"use strict";
// ============================================================================
// ENHANCED SEARCH SERVICE - Scalable Relevance Ranking
// ============================================================================
// This service uses Postgres functions for weighted full-text search,
// fuzzy matching, and vector search capabilities.
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
exports.searchCorrections = exports.enhancedSearch = exports.searchLogger = void 0;
var supabase_client_1 = require("@/lib/supabase-client");
var logger_1 = require("@/utils/logger");
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
var getTenantId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var knownTenantId;
    return __generator(this, function (_a) {
        knownTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
        // For now, always use the known tenant ID since the user's tenant doesn't have customers
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Using known tenant ID for customers', { tenantId: knownTenantId }, 'enhanced-search-service');
        }
        return [2 /*return*/, knownTenantId];
    });
}); };
var getUserId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
            case 1:
                user = (_a.sent()).data.user;
                if (!user)
                    throw new Error('User not authenticated');
                return [2 /*return*/, user.id];
        }
    });
}); };
exports.searchLogger = {
    logSearch: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, tenantId, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                getUserId(),
                                getTenantId()
                            ])];
                    case 1:
                        _a = _b.sent(), userId = _a[0], tenantId = _a[1];
                        return [4 /*yield*/, supabase_client_1.supabase.rpc('log_search', {
                                p_user_id: userId,
                                p_tenant_id: tenantId,
                                p_query: data.query,
                                p_results_count: data.resultsCount,
                                p_time_taken_ms: data.timeTakenMs,
                                p_clicked_record_id: data.clickedRecordId || null,
                                p_search_filters: data.searchFilters || null
                            })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        logger_1.logger.error('Failed to log search', error_1, 'enhanced-search-service');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    logClick: function (recordId, query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, tenantId, recentLog, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Promise.all([
                                getUserId(),
                                getTenantId()
                            ])];
                    case 1:
                        _a = _b.sent(), userId = _a[0], tenantId = _a[1];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_logs')
                                .select('id')
                                .eq('user_id', userId)
                                .eq('tenant_id', tenantId)
                                .eq('query', query)
                                .is('clicked_record_id', null)
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .single()];
                    case 2:
                        recentLog = (_b.sent()).data;
                        if (!recentLog) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_logs')
                                .update({ clicked_record_id: recordId })
                                .eq('id', recentLog.id)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        logger_1.logger.error('Failed to log click', error_2, 'enhanced-search-service');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
};
// ============================================================================
// ENHANCED SEARCH API
// ============================================================================
exports.enhancedSearch = {
    /**
     * Search customers using enhanced Postgres function with weighted ranking
     */
    searchCustomers: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, tenantId_1, _a, data, error_4, _b, searchResults, error, results, filteredResults, endTime, timeTakenMs, avgRelevanceScore, error_3;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // TEMPORARILY RE-ENABLED - Backend API not fully implemented yet
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Enhanced search service temporarily re-enabled for customer loading', {}, 'enhanced-search-service');
                        }
                        startTime = performance.now();
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Enhanced search service called with filters', { filters: filters }, 'enhanced-search-service');
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, getTenantId()];
                    case 2:
                        tenantId_1 = _e.sent();
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Using tenant ID', { tenantId: tenantId_1 }, 'enhanced-search-service');
                        }
                        if (!!((_c = filters === null || filters === void 0 ? void 0 : filters.search) === null || _c === void 0 ? void 0 : _c.trim())) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('accounts')
                                .select("\n            *,\n            customer_profiles (*),\n            customer_contacts (*),\n            locations (*),\n            work_orders (*),\n            jobs (*)\n          ")
                                .eq('tenant_id', tenantId_1)
                                .order('name', { ascending: true })];
                    case 3:
                        _a = _e.sent(), data = _a.data, error_4 = _a.error;
                        if (error_4)
                            throw error_4;
                        return [2 /*return*/, data || []];
                    case 4: return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_enhanced', {
                            p_search_term: filters.search.trim(),
                            p_tenant_id: tenantId_1,
                            p_limit: 100,
                            p_offset: 0
                        })];
                    case 5:
                        _b = _e.sent(), searchResults = _b.data, error = _b.error;
                        if (error)
                            throw error;
                        results = searchResults.map(function (result) {
                            var _a, _b, _c;
                            return ({
                                id: result.id,
                                name: result.name,
                                email: result.email,
                                phone: result.phone,
                                address: result.address,
                                city: result.city,
                                state: result.state,
                                zip_code: result.zip_code,
                                status: result.status,
                                account_type: (_a = result.account_type) !== null && _a !== void 0 ? _a : 'residential',
                                created_at: result.created_at,
                                updated_at: result.updated_at,
                                tenant_id: (_b = result.tenant_id) !== null && _b !== void 0 ? _b : tenantId_1,
                                ar_balance: (_c = result.ar_balance) !== null && _c !== void 0 ? _c : 0,
                                segment_id: result.segment_id,
                                // Add relevance metadata
                                _relevance_score: result.relevance_score,
                                _match_type: result.match_type
                            });
                        });
                        filteredResults = results;
                        if (filters === null || filters === void 0 ? void 0 : filters.status) {
                            filteredResults = filteredResults.filter(function (customer) {
                                return customer.status === filters.status;
                            });
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.segmentId) {
                            filteredResults = filteredResults.filter(function (customer) {
                                return customer.segment_id === filters.segmentId;
                            });
                        }
                        endTime = performance.now();
                        timeTakenMs = Math.round(endTime - startTime);
                        avgRelevanceScore = results.length > 0
                            ? results.reduce(function (sum, r) { return sum + (r._relevance_score || 0); }, 0) / results.length
                            : 0;
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Enhanced search completed', {
                                resultsCount: filteredResults.length,
                                timeTakenMs: timeTakenMs,
                                avgRelevanceScore: avgRelevanceScore.toFixed(3),
                                firstResult: (_d = filteredResults[0]) === null || _d === void 0 ? void 0 : _d.name,
                                matchTypes: __spreadArray([], new Set(results.map(function (r) { return r._match_type; })), true)
                            }, 'enhanced-search-service');
                        }
                        // Log the search with enhanced metrics
                        return [4 /*yield*/, exports.searchLogger.logSearch({
                                query: filters.search,
                                resultsCount: filteredResults.length,
                                timeTakenMs: timeTakenMs,
                                searchFilters: filters,
                                searchType: 'enhanced',
                                avgRelevanceScore: avgRelevanceScore
                            })];
                    case 6:
                        // Log the search with enhanced metrics
                        _e.sent();
                        return [2 /*return*/, filteredResults];
                    case 7:
                        error_3 = _e.sent();
                        logger_1.logger.error('Error in enhanced search', error_3, 'enhanced-search-service');
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Vector search using embeddings (when pgvector is available)
     */
    searchCustomersVector: function (embedding_1) {
        return __awaiter(this, arguments, void 0, function (embedding, limit, threshold) {
            var startTime, tenantId_2, _a, searchResults, error, results, endTime, timeTakenMs, error_5;
            if (limit === void 0) { limit = 50; }
            if (threshold === void 0) { threshold = 0.7; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = performance.now();
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Vector search called', { embeddingLength: embedding.length }, 'enhanced-search-service');
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, getTenantId()];
                    case 2:
                        tenantId_2 = _b.sent();
                        return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_vector', {
                                p_embedding: embedding,
                                p_tenant_id: tenantId_2,
                                p_limit: limit,
                                p_threshold: threshold
                            })];
                    case 3:
                        _a = _b.sent(), searchResults = _a.data, error = _a.error;
                        if (error) {
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Vector search error', { error: error.message }, 'enhanced-search-service');
                                logger_1.logger.debug('Returning empty results - check if pgvector is properly configured', {}, 'enhanced-search-service');
                            }
                            return [2 /*return*/, []];
                        }
                        results = searchResults.map(function (result) {
                            var _a, _b, _c;
                            return ({
                                id: result.id,
                                name: result.name,
                                email: result.email,
                                phone: result.phone,
                                address: result.address,
                                city: result.city,
                                state: result.state,
                                zip_code: result.zip_code,
                                status: result.status,
                                account_type: (_a = result.account_type) !== null && _a !== void 0 ? _a : 'residential',
                                created_at: result.created_at,
                                updated_at: result.updated_at,
                                tenant_id: (_b = result.tenant_id) !== null && _b !== void 0 ? _b : tenantId_2,
                                ar_balance: (_c = result.ar_balance) !== null && _c !== void 0 ? _c : 0,
                                segment_id: result.segment_id,
                                // Add similarity metadata
                                _similarity_score: result.similarity_score
                            });
                        });
                        endTime = performance.now();
                        timeTakenMs = Math.round(endTime - startTime);
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Vector search completed', {
                                resultsCount: results.length,
                                timeTakenMs: timeTakenMs,
                                avgSimilarityScore: results.length > 0
                                    ? (results.reduce(function (sum, r) { return sum + (r._similarity_score || 0); }, 0) / results.length).toFixed(3)
                                    : '0.000'
                            }, 'enhanced-search-service');
                        }
                        return [2 /*return*/, results];
                    case 4:
                        error_5 = _b.sent();
                        logger_1.logger.error('Error in vector search', error_5, 'enhanced-search-service');
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Log when a user clicks on a search result
     */
    logResultClick: function (recordId, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.searchLogger.logClick(recordId, query)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get search analytics for the current tenant
     */
    getSearchAnalytics: function () {
        return __awaiter(this, arguments, void 0, function (daysBack) {
            var tenantId, _a, data, error, error_6;
            if (daysBack === void 0) { daysBack = 30; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getTenantId()];
                    case 1:
                        tenantId = _b.sent();
                        return [4 /*yield*/, supabase_client_1.supabase.rpc('get_search_analytics', {
                                p_tenant_id: tenantId,
                                p_days_back: daysBack
                            })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                    case 3:
                        error_6 = _b.sent();
                        logger_1.logger.error('Error getting search analytics', error_6, 'enhanced-search-service');
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get search performance metrics
     */
    getSearchPerformance: function () {
        return __awaiter(this, void 0, void 0, function () {
            var tenantId, _a, data, error, metrics, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getTenantId()];
                    case 1:
                        tenantId = _b.sent();
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_logs')
                                .select('*')
                                .eq('tenant_id', tenantId)
                                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
                                .order('created_at', { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        metrics = {
                            totalSearches: data.length,
                            avgTimeMs: data.length > 0
                                ? Math.round(data.reduce(function (sum, log) { return sum + (log.time_taken_ms || 0); }, 0) / data.length)
                                : 0,
                            avgResultsCount: data.length > 0
                                ? Math.round(data.reduce(function (sum, log) { return sum + (log.results_count || 0); }, 0) / data.length)
                                : 0,
                            searchTypes: data.reduce(function (acc, log) {
                                var _a;
                                var type = ((_a = log.search_filters) === null || _a === void 0 ? void 0 : _a.searchType) || 'legacy';
                                acc[type] = (acc[type] || 0) + 1;
                                return acc;
                            }, {})
                        };
                        return [2 /*return*/, metrics];
                    case 3:
                        error_7 = _b.sent();
                        logger_1.logger.error('Error getting search performance', error_7, 'enhanced-search-service');
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
// ============================================================================
// SEARCH CORRECTIONS (Phase 2 Preview)
// ============================================================================
exports.searchCorrections = {
    /**
     * Get search corrections for a query
     */
    getCorrections: function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var tenantId, _a, data, error, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getTenantId()];
                    case 1:
                        tenantId = _b.sent();
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_corrections')
                                .select('corrected_query, confidence_score')
                                .eq('tenant_id', tenantId)
                                .eq('original_query', query.toLowerCase())
                                .gte('confidence_score', 0.5)
                                .order('confidence_score', { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.map(function (c) { return c.corrected_query; })) || []];
                    case 3:
                        error_8 = _b.sent();
                        logger_1.logger.error('Error getting corrections', error_8, 'enhanced-search-service');
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update correction success/failure
     */
    updateCorrection: function (originalQuery, correctedQuery, success) {
        return __awaiter(this, void 0, void 0, function () {
            var tenantId, existing, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, getTenantId()];
                    case 1:
                        tenantId = _a.sent();
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_corrections')
                                .select('success_count, total_attempts')
                                .eq('tenant_id', tenantId)
                                .eq('original_query', originalQuery.toLowerCase())
                                .eq('corrected_query', correctedQuery)
                                .single()];
                    case 2:
                        existing = (_a.sent()).data;
                        if (!success) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('search_corrections')
                                .update({
                                success_count: ((existing === null || existing === void 0 ? void 0 : existing.success_count) || 0) + 1,
                                total_attempts: ((existing === null || existing === void 0 ? void 0 : existing.total_attempts) || 0) + 1
                            })
                                .eq('tenant_id', tenantId)
                                .eq('original_query', originalQuery.toLowerCase())
                                .eq('corrected_query', correctedQuery)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, supabase_client_1.supabase
                            .from('search_corrections')
                            .update({
                            total_attempts: ((existing === null || existing === void 0 ? void 0 : existing.total_attempts) || 0) + 1
                        })
                            .eq('tenant_id', tenantId)
                            .eq('original_query', originalQuery.toLowerCase())
                            .eq('corrected_query', correctedQuery)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_9 = _a.sent();
                        logger_1.logger.error('Error updating correction', error_9, 'enhanced-search-service');
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
};
exports.default = exports.enhancedSearch;
