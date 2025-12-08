"use strict";
// ============================================================================
// SEARCH INTEGRATION - Frontend Integration for Unified Search Service
// ============================================================================
// This file integrates the unified search service with existing frontend components
// and provides a seamless search experience across the CRM
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
exports.searchIntegration = void 0;
exports.useSearchIntegration = useSearchIntegration;
exports.createSearchInputProps = createSearchInputProps;
exports.createSearchResultProps = createSearchResultProps;
var unified_search_service_1 = require("./unified-search-service");
var search_error_logger_1 = require("./search-error-logger");
var supabase_client_1 = require("./supabase-client");
var logger_1 = require("@/utils/logger");
// ============================================================================
// SEARCH INTEGRATION CLASS
// ============================================================================
var SearchIntegration = /** @class */ (function () {
    function SearchIntegration() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                currentSearch: '',
                results: [],
                loading: false,
                error: null,
                searchHistory: [],
                recentSearches: [],
                totalResults: 0,
                searchTime: 0,
                lastSearched: null
            }
        });
        Object.defineProperty(this, "debounceTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "subscribers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
    }
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    /**
     * Subscribe to search state changes
     */
    Object.defineProperty(SearchIntegration.prototype, "subscribe", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (callback) {
            var _this = this;
            this.subscribers.add(callback);
            return function () { return _this.subscribers.delete(callback); };
        }
    });
    /**
     * Get current search state
     */
    Object.defineProperty(SearchIntegration.prototype, "getState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __assign({}, this.state);
        }
    });
    /**
     * Update state and notify subscribers
     */
    Object.defineProperty(SearchIntegration.prototype, "updateState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (updates) {
            var _this = this;
            this.state = __assign(__assign({}, this.state), updates);
            this.subscribers.forEach(function (callback) { return callback(_this.state); });
        }
    });
    // ============================================================================
    // SEARCH OPERATIONS
    // ============================================================================
    /**
     * Perform search with debouncing and error handling
     */
    Object.defineProperty(SearchIntegration.prototype, "search", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm_1) {
            return __awaiter(this, arguments, void 0, function (searchTerm, options) {
                var _a, debounceMs, _b, minSearchLength, _c, showLoadingState, _d, enableRealTimeSearch, searchOptions;
                var _this = this;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_e) {
                    _a = options.debounceMs, debounceMs = _a === void 0 ? 300 : _a, _b = options.minSearchLength, minSearchLength = _b === void 0 ? 1 : _b, _c = options.showLoadingState, showLoadingState = _c === void 0 ? true : _c, _d = options.enableRealTimeSearch, enableRealTimeSearch = _d === void 0 ? true : _d, searchOptions = __rest(options, ["debounceMs", "minSearchLength", "showLoadingState", "enableRealTimeSearch"]);
                    // Clear previous debounce timer
                    if (this.debounceTimer) {
                        clearTimeout(this.debounceTimer);
                    }
                    // Update current search term
                    this.updateState({ currentSearch: searchTerm });
                    // Handle empty search
                    if (!searchTerm || searchTerm.trim().length < minSearchLength) {
                        this.updateState({
                            results: [],
                            loading: false,
                            error: null,
                            totalResults: 0,
                            searchTime: 0
                        });
                        return [2 /*return*/, this.getSearchResult()];
                    }
                    // Show loading state
                    if (showLoadingState) {
                        this.updateState({ loading: true, error: null });
                    }
                    // Debounce search for real-time search
                    if (enableRealTimeSearch && debounceMs > 0) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.debounceTimer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var result;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.performSearch(searchTerm, searchOptions)];
                                            case 1:
                                                result = _a.sent();
                                                resolve(result);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, debounceMs);
                            })];
                    }
                    // Immediate search
                    return [2 /*return*/, this.performSearch(searchTerm, searchOptions)];
                });
            });
        }
    });
    /**
     * Perform the actual search operation
     */
    Object.defineProperty(SearchIntegration.prototype, "performSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm_1) {
            return __awaiter(this, arguments, void 0, function (searchTerm, options) {
                var startTime, filters, searchOptions, result, results, searchTime, _a, _b, _c, error_1, searchTime, errorMessage, _d, _e, _f;
                var _g, _h;
                var _j;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            startTime = Date.now();
                            _k.label = 1;
                        case 1:
                            _k.trys.push([1, 6, , 10]);
                            filters = options.filters, searchOptions = __rest(options, ["filters"]);
                            return [4 /*yield*/, unified_search_service_1.unifiedSearchService.searchCustomers(searchTerm, filters, searchOptions)];
                        case 2:
                            result = _k.sent();
                            results = (_j = result.data) !== null && _j !== void 0 ? _j : [];
                            searchTime = Date.now() - startTime;
                            // Update state with results
                            this.updateState({
                                results: results,
                                loading: false,
                                error: null,
                                totalResults: results.length,
                                searchTime: searchTime,
                                lastSearched: new Date()
                            });
                            // Add to search history
                            this.addToSearchHistory(searchTerm);
                            _b = (_a = search_error_logger_1.searchErrorLogger).logSuccess;
                            _c = ['search', searchTerm, results.length, searchTime];
                            _g = {};
                            return [4 /*yield*/, this.getCurrentTenantId()];
                        case 3:
                            _g.tenantId = _k.sent();
                            return [4 /*yield*/, this.getCurrentUserId()];
                        case 4: 
                        // Log successful search
                        return [4 /*yield*/, _b.apply(_a, _c.concat([(_g.userId = _k.sent(),
                                    _g)]))];
                        case 5:
                            // Log successful search
                            _k.sent();
                            return [2 /*return*/, this.getSearchResult()];
                        case 6:
                            error_1 = _k.sent();
                            searchTime = Date.now() - startTime;
                            errorMessage = error_1 instanceof Error ? error_1.message : 'Search failed';
                            _e = (_d = search_error_logger_1.searchErrorLogger).logError;
                            _f = [error_1];
                            _h = {
                                operation: 'search',
                                query: searchTerm
                            };
                            return [4 /*yield*/, this.getCurrentTenantId()];
                        case 7:
                            _h.tenantId = _k.sent();
                            return [4 /*yield*/, this.getCurrentUserId()];
                        case 8: 
                        // Log search error
                        return [4 /*yield*/, _e.apply(_d, _f.concat([(_h.userId = _k.sent(),
                                    _h), 'medium']))];
                        case 9:
                            // Log search error
                            _k.sent();
                            // Update state with error
                            this.updateState({
                                results: [],
                                loading: false,
                                error: errorMessage,
                                totalResults: 0,
                                searchTime: searchTime,
                                lastSearched: new Date()
                            });
                            return [2 /*return*/, this.getSearchResult()];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get search result in the expected format
     */
    Object.defineProperty(SearchIntegration.prototype, "getSearchResult", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                results: this.state.results,
                loading: this.state.loading,
                error: this.state.error,
                searchTerm: this.state.currentSearch,
                totalResults: this.state.totalResults,
                searchTime: this.state.searchTime,
                lastSearched: this.state.lastSearched || new Date()
            };
        }
    });
    // ============================================================================
    // SEARCH HISTORY MANAGEMENT
    // ============================================================================
    /**
     * Add search term to history
     */
    Object.defineProperty(SearchIntegration.prototype, "addToSearchHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm) {
            var trimmedTerm = searchTerm.trim();
            if (!trimmedTerm)
                return;
            var history = this.state.searchHistory.filter(function (term) { return term !== trimmedTerm; });
            history.unshift(trimmedTerm);
            // Keep only last 10 searches
            var limitedHistory = history.slice(0, 10);
            this.updateState({ searchHistory: limitedHistory });
        }
    });
    /**
     * Clear search history
     */
    Object.defineProperty(SearchIntegration.prototype, "clearSearchHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.updateState({ searchHistory: [] });
        }
    });
    /**
     * Get search history
     */
    Object.defineProperty(SearchIntegration.prototype, "getSearchHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __spreadArray([], this.state.searchHistory, true);
        }
    });
    // ============================================================================
    // RECENT SEARCHES MANAGEMENT
    // ============================================================================
    /**
     * Add result to recent searches
     */
    Object.defineProperty(SearchIntegration.prototype, "addToRecentSearches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (result) {
            var recent = this.state.recentSearches.filter(function (r) { return r.id !== result.id; });
            recent.unshift(result);
            // Keep only last 20 recent searches
            var limitedRecent = recent.slice(0, 20);
            this.updateState({ recentSearches: limitedRecent });
        }
    });
    /**
     * Clear recent searches
     */
    Object.defineProperty(SearchIntegration.prototype, "clearRecentSearches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.updateState({ recentSearches: [] });
        }
    });
    /**
     * Get recent searches
     */
    Object.defineProperty(SearchIntegration.prototype, "getRecentSearches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __spreadArray([], this.state.recentSearches, true);
        }
    });
    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    /**
     * Get current tenant ID
     */
    Object.defineProperty(SearchIntegration.prototype, "getCurrentTenantId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var user, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                        case 1:
                            user = (_c.sent()).data.user;
                            return [2 /*return*/, ((_b = user === null || user === void 0 ? void 0 : user.user_metadata) === null || _b === void 0 ? void 0 : _b.tenant_id) || '7193113e-ece2-4f7b-ae8c-176df4367e28'];
                        case 2:
                            _a = _c.sent();
                            return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28'];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get current user ID
     */
    Object.defineProperty(SearchIntegration.prototype, "getCurrentUserId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var user, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                        case 1:
                            user = (_b.sent()).data.user;
                            return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.id) || 'anonymous'];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, 'anonymous'];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Clear all search state
     */
    Object.defineProperty(SearchIntegration.prototype, "clearAll", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.updateState({
                currentSearch: '',
                results: [],
                loading: false,
                error: null,
                totalResults: 0,
                searchTime: 0,
                lastSearched: null
            });
        }
    });
    /**
     * Refresh current search results
     */
    Object.defineProperty(SearchIntegration.prototype, "refreshCurrentSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.state.currentSearch.trim()) return [3 /*break*/, 2];
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Refreshing current search', { searchTerm: this.state.currentSearch }, 'search-integration');
                            }
                            return [4 /*yield*/, this.performSearch(this.state.currentSearch)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Cancel any pending search
     */
    Object.defineProperty(SearchIntegration.prototype, "cancelSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }
            this.updateState({ loading: false });
        }
    });
    return SearchIntegration;
}());
// ============================================================================
// REACT HOOKS
// ============================================================================
var react_1 = require("react");
/**
 * React hook for search integration
 */
function useSearchIntegration(options) {
    if (options === void 0) { options = {}; }
    var _a = (0, react_1.useState)(exports.searchIntegration.getState()), state = _a[0], setState = _a[1];
    var searchIntegrationRef = (0, react_1.useRef)(exports.searchIntegration);
    // Memoize options to prevent unnecessary re-renders
    var memoizedOptions = (0, react_1.useMemo)(function () { return options; }, [
        options.debounceMs,
        options.minSearchLength,
        options.showLoadingState,
        options.enableRealTimeSearch,
        options.includeFields,
        options.excludeFields,
        options.limit,
        options.offset,
        options.sortBy,
        options.sortOrder,
        options.filters
    ]);
    (0, react_1.useEffect)(function () {
        var unsubscribe = searchIntegrationRef.current.subscribe(setState);
        return unsubscribe;
    }, []);
    var search = (0, react_1.useCallback)(function (searchTerm, searchOptions) {
        return searchIntegrationRef.current.search(searchTerm, __assign(__assign({}, memoizedOptions), searchOptions));
    }, [memoizedOptions]);
    var clearAll = (0, react_1.useCallback)(function () {
        searchIntegrationRef.current.clearAll();
    }, []);
    var cancelSearch = (0, react_1.useCallback)(function () {
        searchIntegrationRef.current.cancelSearch();
    }, []);
    var addToRecentSearches = (0, react_1.useCallback)(function (result) {
        searchIntegrationRef.current.addToRecentSearches(result);
    }, []);
    var clearSearchHistory = (0, react_1.useCallback)(function () {
        searchIntegrationRef.current.clearSearchHistory();
    }, []);
    var clearRecentSearches = (0, react_1.useCallback)(function () {
        searchIntegrationRef.current.clearRecentSearches();
    }, []);
    var refreshCurrentSearch = (0, react_1.useCallback)(function () {
        return searchIntegrationRef.current.refreshCurrentSearch();
    }, []);
    return __assign(__assign({}, state), { search: search, clearAll: clearAll, cancelSearch: cancelSearch, addToRecentSearches: addToRecentSearches, clearSearchHistory: clearSearchHistory, clearRecentSearches: clearRecentSearches, refreshCurrentSearch: refreshCurrentSearch, getSearchHistory: searchIntegrationRef.current.getSearchHistory.bind(searchIntegrationRef.current), getRecentSearches: searchIntegrationRef.current.getRecentSearches.bind(searchIntegrationRef.current) });
}
// ============================================================================
// COMPONENT INTEGRATION HELPERS
// ============================================================================
/**
 * Create search input props for form integration
 */
function createSearchInputProps(onSearch, options) {
    if (options === void 0) { options = {}; }
    return __assign({ placeholder: 'Search customers...', onChange: function (e) {
            onSearch(e.target.value);
        }, onKeyDown: function (e) {
            if (e.key === 'Enter') {
                onSearch(e.currentTarget.value);
            }
        } }, options);
}
/**
 * Create search result props for component integration
 */
function createSearchResultProps(result) {
    return {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        type: result.type,
        status: result.status,
        score: result.score,
        matchedFields: result.matchedFields
    };
}
// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================
exports.searchIntegration = new SearchIntegration();
exports.default = exports.searchIntegration;
