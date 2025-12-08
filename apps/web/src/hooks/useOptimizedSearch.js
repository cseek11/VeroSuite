"use strict";
// ============================================================================
// OPTIMIZED SEARCH HOOK
// ============================================================================
// High-performance React hook for search with:
// - Intelligent debouncing
// - Result caching
// - Performance monitoring
// - Auto-correction suggestions
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearchMonitoring = exports.useSearchSuggestions = exports.useOptimizedSearch = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var optimized_search_service_1 = require("@/lib/optimized-search-service");
var logger_1 = require("@/utils/logger");
/**
 * Optimized search hook with intelligent performance features
 */
var useOptimizedSearch = function (options) {
    if (options === void 0) { options = {}; }
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = options.debounceMs, debounceMs = _a === void 0 ? 300 : _a, _b = options.minQueryLength, minQueryLength = _b === void 0 ? 2 : _b, _c = options.enabled, enabled = _c === void 0 ? true : _c, _d = options.staleTime, staleTime = _d === void 0 ? 5 * 60 * 1000 : _d, // 5 minutes
    _e = options.gcTime, // 5 minutes
    gcTime = _e === void 0 ? 10 * 60 * 1000 : _e, // 10 minutes
    searchOptions = __rest(options, ["debounceMs", "minQueryLength", "enabled", "staleTime", "gcTime"]);
    // Local state
    var _f = (0, react_1.useState)(''), query = _f[0], setQuery = _f[1];
    var _g = (0, react_1.useState)(''), debouncedQuery = _g[0], setDebouncedQuery = _g[1];
    var _h = (0, react_1.useState)(false), isSearching = _h[0], setIsSearching = _h[1];
    var _j = (0, react_1.useState)(null), metrics = _j[0], setMetrics = _j[1];
    var _k = (0, react_1.useState)(null), suggestion = _k[0], setSuggestion = _k[1];
    var _l = (0, react_1.useState)(0), lastSearchTime = _l[0], setLastSearchTime = _l[1];
    // Intelligent debouncing based on query characteristics
    var getDebounceDelay = (0, react_1.useCallback)(function (searchQuery) {
        if (searchQuery.length <= 2)
            return debounceMs + 200; // Longer delay for short queries
        if (searchQuery.length >= 6)
            return Math.max(100, debounceMs - 100); // Shorter delay for longer queries
        if (/^\d+$/.test(searchQuery))
            return debounceMs - 100; // Faster for numbers (phone/ID)
        return debounceMs;
    }, [debounceMs]);
    // Advanced debouncing with performance optimization
    (0, react_1.useEffect)(function () {
        if (query.length < minQueryLength) {
            setDebouncedQuery('');
            return;
        }
        var delay = getDebounceDelay(query);
        var timeSinceLastSearch = Date.now() - lastSearchTime;
        // If user is typing fast, increase debounce delay
        var adjustedDelay = timeSinceLastSearch < 100 ? delay + 100 : delay;
        var timer = setTimeout(function () {
            setDebouncedQuery(query);
            setLastSearchTime(Date.now());
        }, adjustedDelay);
        return function () { return clearTimeout(timer); };
    }, [query, minQueryLength, getDebounceDelay, lastSearchTime]);
    // Query key factory for better caching
    var queryKey = (0, react_1.useMemo)(function () { return [
        'optimized-search',
        debouncedQuery,
        searchOptions
    ]; }, [debouncedQuery, searchOptions]);
    // Main search query with React Query
    var _m = (0, react_query_1.useQuery)({
        queryKey: queryKey,
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
                            return [2 /*return*/, { results: [], metrics: null, suggestion: null }];
                        }
                        setIsSearching(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, optimized_search_service_1.optimizedSearch.search(debouncedQuery, searchOptions)];
                    case 2:
                        result = _a.sent();
                        // Update metrics and suggestions
                        setMetrics(result.metrics);
                        setSuggestion(result.suggestion || null);
                        return [2 /*return*/, result];
                    case 3:
                        setIsSearching(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        enabled: enabled && debouncedQuery.length >= minQueryLength,
        staleTime: staleTime,
        gcTime: gcTime,
        // Optimize re-fetching behavior
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        // Keep previous data while loading new results
        placeholderData: function (previousData) { return previousData; },
    }), searchData = _m.data, isLoading = _m.isLoading, error = _m.error, _refetch = _m.refetch;
    // Memoized results for performance
    var results = (0, react_1.useMemo)(function () { return (searchData === null || searchData === void 0 ? void 0 : searchData.results) || []; }, [searchData === null || searchData === void 0 ? void 0 : searchData.results]);
    // Search function with immediate feedback
    var search = (0, react_1.useCallback)(function (searchQuery) {
        setQuery(searchQuery);
        // Immediate feedback for very short queries
        if (searchQuery.length < minQueryLength) {
            setMetrics(null);
            setSuggestion(null);
        }
    }, [minQueryLength]);
    // Clear results and cache
    var clearResults = (0, react_1.useCallback)(function () {
        setQuery('');
        setDebouncedQuery('');
        setMetrics(null);
        setSuggestion(null);
        queryClient.removeQueries({ queryKey: ['optimized-search'] });
    }, [queryClient]);
    // Accept auto-correction suggestion
    var acceptSuggestion = (0, react_1.useCallback)(function (correction) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(suggestion && debouncedQuery)) return [3 /*break*/, 2];
                    // Learn from the correction
                    return [4 /*yield*/, optimized_search_service_1.optimizedSearch.learnCorrection(debouncedQuery, correction, true)];
                case 1:
                    // Learn from the correction
                    _a.sent();
                    // Search with correction
                    search(correction);
                    setSuggestion(null);
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Accepted suggestion', { original: debouncedQuery, correction: correction }, 'useOptimizedSearch');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [suggestion, debouncedQuery, search]);
    // Reject auto-correction suggestion
    var rejectSuggestion = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(suggestion && debouncedQuery)) return [3 /*break*/, 2];
                    // Learn from rejection
                    return [4 /*yield*/, optimized_search_service_1.optimizedSearch.learnCorrection(debouncedQuery, suggestion, false)];
                case 1:
                    // Learn from rejection
                    _a.sent();
                    setSuggestion(null);
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Rejected suggestion', { original: debouncedQuery, suggestion: suggestion }, 'useOptimizedSearch');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [suggestion, debouncedQuery]);
    // Cache management
    var clearCache = (0, react_1.useCallback)(function () {
        optimized_search_service_1.optimizedSearch.clearCache();
        queryClient.removeQueries({ queryKey: ['optimized-search'] });
    }, [queryClient]);
    var refreshCache = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, optimized_search_service_1.optimizedSearch.refreshSearchCache()];
                case 1:
                    _a.sent();
                    queryClient.invalidateQueries({ queryKey: ['optimized-search'] });
                    return [2 /*return*/];
            }
        });
    }); }, [queryClient]);
    // Cache statistics
    var cacheStats = (0, react_1.useMemo)(function () { return optimized_search_service_1.optimizedSearch.getCacheStats(); }, []);
    // Performance monitoring effect
    (0, react_1.useEffect)(function () {
        if (metrics) {
            // Log slow searches for monitoring
            if (metrics.totalTime > 1000) {
                logger_1.logger.warn('Slow search detected', {
                    query: debouncedQuery,
                    metrics: metrics,
                    searchOptions: searchOptions
                }, 'useOptimizedSearch');
            }
            // Log search patterns for optimization
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Search metrics', {
                    query: debouncedQuery,
                    strategy: metrics.searchStrategy,
                    time: Math.round(metrics.totalTime),
                    results: metrics.resultCount,
                    cached: metrics.cacheHit
                }, 'useOptimizedSearch');
            }
        }
    }, [metrics, debouncedQuery, searchOptions]);
    return {
        // Results
        results: results,
        isLoading: isLoading,
        isSearching: isSearching,
        error: error,
        // Performance metrics
        metrics: metrics,
        suggestion: suggestion,
        // Actions
        search: search,
        clearResults: clearResults,
        acceptSuggestion: acceptSuggestion,
        rejectSuggestion: rejectSuggestion,
        // Cache management
        clearCache: clearCache,
        refreshCache: refreshCache,
        // Stats
        cacheStats: cacheStats
    };
};
exports.useOptimizedSearch = useOptimizedSearch;
/**
 * Hook for search suggestions
 */
var useSearchSuggestions = function (query, enabled) {
    if (enabled === void 0) { enabled = true; }
    return (0, react_query_1.useQuery)({
        queryKey: ['search-suggestions', query],
        queryFn: function () { return optimized_search_service_1.optimizedSearch.getSearchSuggestions(query, 5); },
        enabled: enabled && query.length >= 2,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useSearchSuggestions = useSearchSuggestions;
/**
 * Hook for search performance monitoring
 */
var useSearchMonitoring = function () {
    var _a = (0, react_1.useState)({
        averageTime: 0,
        totalSearches: 0,
        cacheHitRate: 0,
        slowSearches: 0
    }), searchMetrics = _a[0], setSearchMetrics = _a[1];
    var recordSearch = (0, react_1.useCallback)(function (metrics) {
        setSearchMetrics(function (prev) { return ({
            averageTime: (prev.averageTime * prev.totalSearches + metrics.totalTime) / (prev.totalSearches + 1),
            totalSearches: prev.totalSearches + 1,
            cacheHitRate: metrics.cacheHit ?
                (prev.cacheHitRate * prev.totalSearches + 1) / (prev.totalSearches + 1) :
                (prev.cacheHitRate * prev.totalSearches) / (prev.totalSearches + 1),
            slowSearches: metrics.totalTime > 1000 ? prev.slowSearches + 1 : prev.slowSearches
        }); });
    }, []);
    return {
        metrics: searchMetrics,
        recordSearch: recordSearch
    };
};
exports.useSearchMonitoring = useSearchMonitoring;
