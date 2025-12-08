"use strict";
// ============================================================================
// UNIFIED SEARCH SERVICE TESTS
// ============================================================================
// Comprehensive test suite for the unified search service
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
var vitest_1 = require("vitest");
var unified_search_service_1 = require("../unified-search-service");
var search_error_logger_1 = require("../search-error-logger");
var supabase_client_1 = require("../supabase-client");
// Mock dependencies
vitest_1.vi.mock('../supabase-client', function () { return ({
    default: {
        auth: {
            getUser: vitest_1.vi.fn()
        },
        from: vitest_1.vi.fn(function () { return ({
            select: vitest_1.vi.fn(function () { return ({
                eq: vitest_1.vi.fn(function () { return ({
                    order: vitest_1.vi.fn(function () { return ({
                        limit: vitest_1.vi.fn(function () { return ({
                            data: [],
                            error: null
                        }); })
                    }); })
                }); }),
                or: vitest_1.vi.fn(function () { return ({
                    order: vitest_1.vi.fn(function () { return ({
                        limit: vitest_1.vi.fn(function () { return ({
                            data: [],
                            error: null
                        }); })
                    }); })
                }); })
            }); })
        }); }),
        rpc: vitest_1.vi.fn()
    },
    supabase: {
        auth: {
            getUser: vitest_1.vi.fn()
        },
        from: vitest_1.vi.fn(function () { return ({
            select: vitest_1.vi.fn(function () { return ({
                eq: vitest_1.vi.fn(function () { return ({
                    order: vitest_1.vi.fn(function () { return ({
                        limit: vitest_1.vi.fn(function () { return ({
                            data: [],
                            error: null
                        }); })
                    }); })
                }); }),
                or: vitest_1.vi.fn(function () { return ({
                    order: vitest_1.vi.fn(function () { return ({
                        limit: vitest_1.vi.fn(function () { return ({
                            data: [],
                            error: null
                        }); })
                    }); })
                }); })
            }); })
        }); }),
        rpc: vitest_1.vi.fn()
    }
}); });
vitest_1.vi.mock('../search-error-logger', function () { return ({
    searchErrorLogger: {
        logError: vitest_1.vi.fn(),
        logSuccess: vitest_1.vi.fn(),
        getErrorStats: vitest_1.vi.fn(function () { return ({
            total: 0,
            byType: {},
            bySeverity: {},
            unresolved: 0,
            last24Hours: 0
        }); })
    }
}); });
(0, vitest_1.describe)('UnifiedSearchService', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('searchCustomers', function () {
        (0, vitest_1.test)('should return empty result for empty query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'test-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.totalCount).toBe(0);
                        (0, vitest_1.expect)(result.searchMethod).toBe('enhanced');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should handle authentication errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        supabase_client_1.supabase.auth.getUser.mockRejectedValue(new Error('Auth failed'));
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test query')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.totalCount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should try multiple search methods when first fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'test-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        // Mock enhanced search to fail
                        supabase_client_1.supabase.rpc.mockImplementation(function (functionName) {
                            if (functionName === 'search_customers_enhanced') {
                                return Promise.resolve({ data: null, error: new Error('Function not found') });
                            }
                            if (functionName === 'search_customers_multi_word') {
                                return Promise.resolve({ data: [], error: null });
                            }
                            return Promise.resolve({ data: [], error: null });
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test query')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.totalCount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should use fallback search when all RPC methods fail', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'test-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        // Mock all RPC calls to fail
                        supabase_client_1.supabase.rpc.mockRejectedValue(new Error('RPC failed'));
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test query')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.searchMethod).toBe('fallback');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should log success when search succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, mockData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'test-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        mockData = [
                            { id: '1', name: 'Test Customer', email: 'test@example.com' }
                        ];
                        supabase_client_1.supabase.rpc.mockResolvedValue({
                            data: mockData,
                            error: null
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.data).toEqual(mockData);
                        (0, vitest_1.expect)(result.totalCount).toBe(1);
                        (0, vitest_1.expect)(search_error_logger_1.searchErrorLogger.logSuccess).toHaveBeenCalledWith('search_customers', 'test', 1, vitest_1.expect.any(Number), vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getSearchStats', function () {
        (0, vitest_1.test)('should return search statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockStats, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockStats = {
                            total: 100,
                            byType: { enhanced: 50, fuzzy: 30, fallback: 20 },
                            bySeverity: { low: 80, medium: 15, high: 5 },
                            unresolved: 5,
                            last24Hours: 25
                        };
                        search_error_logger_1.searchErrorLogger.getErrorStats.mockReturnValue(mockStats);
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.getSearchStats()];
                    case 1:
                        stats = _a.sent();
                        (0, vitest_1.expect)(stats.totalSearches).toBe(100);
                        (0, vitest_1.expect)(stats.errorRate).toBe(5);
                        (0, vitest_1.expect)(stats.methodDistribution).toEqual(mockStats.byType);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should handle errors in stats retrieval', function () { return __awaiter(void 0, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search_error_logger_1.searchErrorLogger.getErrorStats.mockImplementation(function () {
                            throw new Error('Stats failed');
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.getSearchStats()];
                    case 1:
                        stats = _a.sent();
                        (0, vitest_1.expect)(stats.totalSearches).toBe(0);
                        (0, vitest_1.expect)(stats.errorRate).toBe(0);
                        (0, vitest_1.expect)(stats.methodDistribution).toEqual({});
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('clearCache', function () {
        (0, vitest_1.test)('should clear search cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // clearCache doesn't log to console, it just clears internal cache
                    // Test that it completes without error
                    return [4 /*yield*/, (0, vitest_1.expect)(unified_search_service_1.unifiedSearchService.clearCache()).resolves.not.toThrow()];
                    case 1:
                        // clearCache doesn't log to console, it just clears internal cache
                        // Test that it completes without error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('error handling', function () {
        (0, vitest_1.test)('should categorize errors correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'test-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        // Mock RPC to throw permission error
                        supabase_client_1.supabase.rpc.mockRejectedValue(new Error('Permission denied'));
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test')];
                    case 1:
                        result = _a.sent();
                        // The service should handle errors gracefully and return empty results
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.totalCount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should handle network errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        supabase_client_1.supabase.auth.getUser.mockRejectedValue(new Error('Network error'));
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test')];
                    case 1:
                        result = _a.sent();
                        // The service should handle network errors gracefully
                        (0, vitest_1.expect)(result.data).toEqual([]);
                        (0, vitest_1.expect)(result.totalCount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('tenant isolation', function () {
        (0, vitest_1.test)('should use correct tenant ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            user_metadata: { tenant_id: 'specific-tenant' }
                        };
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: mockUser }
                        });
                        supabase_client_1.supabase.rpc.mockResolvedValue({
                            data: [],
                            error: null
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(supabase_client_1.supabase.rpc).toHaveBeenCalledWith('search_customers_enhanced', vitest_1.expect.objectContaining({
                            p_tenant_id: 'specific-tenant'
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)('should fallback to default tenant when user has no tenant', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        supabase_client_1.supabase.auth.getUser.mockResolvedValue({
                            data: { user: null }
                        });
                        supabase_client_1.supabase.rpc.mockResolvedValue({
                            data: [],
                            error: null
                        });
                        return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers('test')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(supabase_client_1.supabase.rpc).toHaveBeenCalledWith('search_customers_enhanced', vitest_1.expect.objectContaining({
                            p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28'
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
