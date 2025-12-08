"use strict";
// ============================================================================
// ADVANCED SEARCH HOOK
// ============================================================================
// React hook for advanced search functionality with fuzzy matching and suggestions
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
exports.useAdvancedSearch = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var advanced_search_service_1 = require("@/lib/advanced-search-service");
var search_analytics_service_1 = require("@/lib/search-analytics-service");
var logger_1 = require("@/utils/logger");
var useAdvancedSearch = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var _b = options.enableAutoCorrection, enableAutoCorrection = _b === void 0 ? true : _b, _c = options.enableSuggestions, enableSuggestions = _c === void 0 ? true : _c, _d = options.debounceMs, debounceMs = _d === void 0 ? 300 : _d, _e = options.defaultSearchMode, defaultSearchMode = _e === void 0 ? 'hybrid' : _e, _f = options.fuzzyThreshold, fuzzyThreshold = _f === void 0 ? 0.3 : _f, _g = options.typoTolerance, typoTolerance = _g === void 0 ? 1 : _g;
    // Core state
    var _h = (0, react_1.useState)(''), query = _h[0], setQuery = _h[1];
    var _j = (0, react_1.useState)(''), debouncedQuery = _j[0], setDebouncedQuery = _j[1];
    var _k = (0, react_1.useState)({}), filters = _k[0], setFilters = _k[1];
    var _l = (0, react_1.useState)(defaultSearchMode), searchMode = _l[0], setSearchMode = _l[1];
    var _m = (0, react_1.useState)(false), hasSearched = _m[0], setHasSearched = _m[1];
    var debounceTimeoutRef = (0, react_1.useRef)();
    var isMountedRef = (0, react_1.useRef)(true);
    // Advanced search query
    var _o = (0, react_query_1.useQuery)({
        queryKey: ['advanced-search', debouncedQuery, filters, searchMode],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchOptions, queryId, searchResult, results_1, suggestions_1, _a, analyticsError_1, error_1;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('useQuery queryFn called with debouncedQuery', { debouncedQuery: debouncedQuery }, 'useAdvancedSearch');
                        }
                        if (!debouncedQuery.trim()) {
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Empty search query, returning empty results', {}, 'useAdvancedSearch');
                            }
                            return [2 /*return*/, {
                                    results: [],
                                    suggestions: [],
                                    correctedQuery: undefined
                                }];
                        }
                        searchOptions = {
                            fuzzyThreshold: fuzzyThreshold,
                            typoTolerance: typoTolerance,
                            searchMode: searchMode,
                            maxResults: 50
                        };
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 14, , 16]);
                        queryId = search_analytics_service_1.searchAnalyticsService.createQueryId();
                        search_analytics_service_1.searchAnalyticsService.startSearchTracking(queryId);
                        searchResult = void 0;
                        if (!enableAutoCorrection) return [3 /*break*/, 3];
                        return [4 /*yield*/, advanced_search_service_1.advancedSearchService.searchWithAutoCorrection(debouncedQuery, filters, searchOptions)];
                    case 2:
                        searchResult = _f.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, advanced_search_service_1.advancedSearchService.searchCustomersAdvanced(debouncedQuery, filters, searchOptions)];
                    case 4:
                        results_1 = _f.sent();
                        if (!enableSuggestions) return [3 /*break*/, 6];
                        return [4 /*yield*/, advanced_search_service_1.advancedSearchService.getSearchSuggestions(debouncedQuery, 5)];
                    case 5:
                        _a = _f.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _a = [];
                        _f.label = 7;
                    case 7:
                        suggestions_1 = _a;
                        searchResult = {
                            results: results_1,
                            suggestions: suggestions_1,
                            correctedQuery: undefined
                        };
                        _f.label = 8;
                    case 8: 
                    // Complete analytics tracking
                    return [4 /*yield*/, search_analytics_service_1.searchAnalyticsService.completeSearchTracking(queryId, {
                            queryText: debouncedQuery,
                            queryType: 'hybrid',
                            searchMode: searchMode,
                            resultsCount: ((_b = searchResult.results) === null || _b === void 0 ? void 0 : _b.length) || 0,
                            cacheHit: false,
                            searchSuccessful: true,
                            sessionId: search_analytics_service_1.searchAnalyticsService.getSessionId()
                        })];
                    case 9:
                        // Complete analytics tracking
                        _f.sent();
                        _f.label = 10;
                    case 10:
                        _f.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, search_analytics_service_1.searchAnalyticsService.updatePopularSearches(debouncedQuery, ((_c = searchResult.results) === null || _c === void 0 ? void 0 : _c.length) || 0, true)];
                    case 11:
                        _f.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        analyticsError_1 = _f.sent();
                        logger_1.logger.warn('Failed to update popular searches', { error: analyticsError_1 }, 'useAdvancedSearch');
                        return [3 /*break*/, 13];
                    case 13:
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('useQuery search completed', {
                                resultsCount: ((_d = searchResult.results) === null || _d === void 0 ? void 0 : _d.length) || 0,
                                suggestionsCount: ((_e = searchResult.suggestions) === null || _e === void 0 ? void 0 : _e.length) || 0,
                                correctedQuery: searchResult.correctedQuery
                            }, 'useAdvancedSearch');
                        }
                        return [2 /*return*/, searchResult];
                    case 14:
                        error_1 = _f.sent();
                        // Log search error to analytics
                        return [4 /*yield*/, search_analytics_service_1.searchAnalyticsService.logSearchError('search_execution_error', error_1 instanceof Error ? error_1.message : 'Unknown search error', debouncedQuery, searchMode)];
                    case 15:
                        // Log search error to analytics
                        _f.sent();
                        logger_1.logger.error('useQuery search failed', error_1, 'useAdvancedSearch');
                        throw error_1;
                    case 16: return [2 /*return*/];
                }
            });
        }); },
        enabled: Boolean(debouncedQuery.trim()), // Enable when debouncedQuery exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    }), searchData = _o.data, isSearching = _o.isLoading, searchError = _o.error, _refetchSearch = _o.refetch;
    // Suggestions query (separate from main search)
    var _p = (0, react_query_1.useQuery)({
        queryKey: ['search-suggestions', query],
        queryFn: function () { return advanced_search_service_1.advancedSearchService.getSearchSuggestions(query, 5); },
        enabled: enableSuggestions && query.length > 2 && !hasSearched,
        staleTime: 2 * 60 * 1000, // 2 minutes
    }), suggestionsData = _p.data, _isSuggestionsLoading = _p.isLoading;
    // Debug logging - moved after all hooks are declared
    (0, react_1.useEffect)(function () {
        var _a;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('useAdvancedSearch state', {
                query: query,
                debouncedQuery: debouncedQuery,
                hasSearched: hasSearched,
                isLoading: isSearching,
                resultsLength: ((_a = searchData === null || searchData === void 0 ? void 0 : searchData.results) === null || _a === void 0 ? void 0 : _a.length) || 0
            }, 'useAdvancedSearch');
        }
    }, [query, debouncedQuery, hasSearched, isSearching, (_a = searchData === null || searchData === void 0 ? void 0 : searchData.results) === null || _a === void 0 ? void 0 : _a.length]);
    // Debounced search function - FIXED: Remove refetchSearch to prevent infinite loops
    var performSearch = (0, react_1.useCallback)(function (searchText) {
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('performSearch called', { searchText: searchText }, 'useAdvancedSearch');
        }
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        if (!searchText.trim()) {
            setDebouncedQuery('');
            setHasSearched(false);
            return;
        }
        debounceTimeoutRef.current = setTimeout(function () {
            if (isMountedRef.current) {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Executing search', { searchText: searchText }, 'useAdvancedSearch');
                }
                setDebouncedQuery(searchText); // This will trigger useQuery via queryKey change
                setHasSearched(true);
            }
        }, debounceMs);
    }, [debounceMs]);
    // Search function
    var search = (0, react_1.useCallback)(function (searchText, searchFilters) {
        setQuery(searchText);
        if (searchFilters) {
            setFilters(searchFilters);
        }
        performSearch(searchText);
    }, [performSearch]);
    // Clear search
    var clearSearch = (0, react_1.useCallback)(function () {
        setQuery('');
        setDebouncedQuery('');
        setFilters({});
        setHasSearched(false);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = undefined;
        }
    }, []);
    // Update search mode
    var updateSearchMode = (0, react_1.useCallback)(function (mode) {
        setSearchMode(mode);
        if (debouncedQuery.trim()) {
            // Re-trigger search with new mode
            performSearch(debouncedQuery);
        }
    }, [debouncedQuery, performSearch]);
    // Get search suggestions for current query
    var getSuggestions = (0, react_1.useCallback)(function (searchQuery) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!enableSuggestions || searchQuery.length < 2)
                        return [2 /*return*/, []];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, advanced_search_service_1.advancedSearchService.getSearchSuggestions(searchQuery, 5)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to get suggestions', error_2, 'useAdvancedSearch');
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enableSuggestions]);
    // Search with specific suggestion
    var searchWithSuggestion = (0, react_1.useCallback)(function (suggestion) {
        setQuery(suggestion.text);
        performSearch(suggestion.text);
    }, [performSearch]);
    // Search with corrected query
    var searchWithCorrection = (0, react_1.useCallback)(function (correctedQuery) {
        setQuery(correctedQuery);
        performSearch(correctedQuery);
    }, [performSearch]);
    // Get search statistics
    var getSearchStats = (0, react_1.useCallback)(function () {
        if (!(searchData === null || searchData === void 0 ? void 0 : searchData.results))
            return null;
        var totalResults = searchData.results.length;
        var averageRelevance = totalResults > 0
            ? searchData.results.reduce(function (sum, r) { return sum + (r.relevance_score || 0); }, 0) / totalResults
            : 0;
        var stats = {
            totalResults: totalResults,
            exactMatches: searchData.results.filter(function (r) { return r.match_type === 'exact'; }).length,
            fuzzyMatches: searchData.results.filter(function (r) { return r.match_type === 'fuzzy'; }).length,
            partialMatches: searchData.results.filter(function (r) { return r.match_type === 'partial'; }).length,
            vectorMatches: searchData.results.filter(function (r) { return r.match_type === 'vector'; }).length,
            averageRelevance: averageRelevance,
            hasCorrection: !!searchData.correctedQuery,
            suggestionsCount: searchData.suggestions.length
        };
        return stats;
    }, [searchData]);
    // Cleanup on unmount - FIXED: Prevent memory leaks
    (0, react_1.useEffect)(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
                debounceTimeoutRef.current = undefined;
            }
        };
    }, []);
    // State
    var results = (searchData === null || searchData === void 0 ? void 0 : searchData.results) || [];
    var suggestions = (searchData === null || searchData === void 0 ? void 0 : searchData.suggestions) || suggestionsData || [];
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Final state preparation', {
            resultsLength: results.length,
            suggestionsLength: suggestions.length,
            isLoading: isSearching,
            hasSearched: hasSearched,
            error: searchError === null || searchError === void 0 ? void 0 : searchError.message
        }, 'useAdvancedSearch');
    }
    var state = __assign(__assign({ results: results, suggestions: suggestions }, ((searchData === null || searchData === void 0 ? void 0 : searchData.correctedQuery) && { correctedQuery: searchData.correctedQuery })), { isLoading: isSearching, error: (searchError === null || searchError === void 0 ? void 0 : searchError.message) || null, searchMode: searchMode, hasSearched: hasSearched });
    return __assign(__assign({}, state), { 
        // Actions
        search: search, clearSearch: clearSearch, updateSearchMode: updateSearchMode, getSuggestions: getSuggestions, searchWithSuggestion: searchWithSuggestion, searchWithCorrection: searchWithCorrection, 
        // Utilities
        getSearchStats: getSearchStats, 
        // Raw data
        query: query, filters: filters, setFilters: setFilters });
};
exports.useAdvancedSearch = useAdvancedSearch;
exports.default = exports.useAdvancedSearch;
