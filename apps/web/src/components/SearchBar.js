"use strict";
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
exports.SearchBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// ============================================================================
// SEARCH BAR COMPONENT - Modern Search Interface
// ============================================================================
// This component provides a modern, accessible search interface that integrates
// with the unified search service and provides real-time search capabilities
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var search_integration_1 = require("@/lib/search-integration");
var logger_1 = require("@/utils/logger");
// ============================================================================
// SEARCH SUGGESTION COMPONENT
// ============================================================================
var SearchSuggestion = function (_a) {
    var account = _a.account, isSelected = _a.isSelected, onClick = _a.onClick;
    return ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 cursor-pointer transition-colors duration-150 ".concat(isSelected
            ? 'bg-indigo-50 border-l-4 border-indigo-500'
            : 'hover:bg-gray-50 border-l-4 border-transparent'), onClick: onClick, children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900 truncate", children: account.name }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ".concat(account.account_type === 'commercial'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'), children: account.account_type }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ".concat(account.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'), children: account.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 space-y-1", children: [account.email && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600 truncate", children: ["\uD83D\uDCE7 ", account.email] })), account.phone && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600 truncate", children: ["\uD83D\uDCDE ", account.phone] })), account.address && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600 truncate", children: ["\uD83D\uDCCD ", account.address] }))] })] }) }) }));
};
var SearchHistoryItem = function (_a) {
    var term = _a.term, onClick = _a.onClick, onRemove = _a.onRemove;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1", onClick: onClick, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700 truncate", children: term })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                    e.stopPropagation();
                    onRemove();
                }, className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3 text-gray-400" }) })] }));
};
// ============================================================================
// MAIN SEARCH BAR COMPONENT
// ============================================================================
var SearchBar = function (_a) {
    var _b = _a.placeholder, placeholder = _b === void 0 ? 'Search customers...' : _b, onResultSelect = _a.onResultSelect, onSearchChange = _a.onSearchChange, _c = _a.showHistory, showHistory = _c === void 0 ? true : _c, _d = _a.showRecentSearches, showRecentSearches = _d === void 0 ? true : _d, _e = _a.maxResults, maxResults = _e === void 0 ? 10 : _e, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.autoFocus, autoFocus = _g === void 0 ? false : _g, _h = _a.debounceMs, debounceMs = _h === void 0 ? 300 : _h;
    var _j = (0, react_1.useState)(false), isOpen = _j[0], setIsOpen = _j[1];
    var _k = (0, react_1.useState)(-1), selectedIndex = _k[0], setSelectedIndex = _k[1];
    var _l = (0, react_1.useState)(''), inputValue = _l[0], setInputValue = _l[1];
    var inputRef = (0, react_1.useRef)(null);
    var dropdownRef = (0, react_1.useRef)(null);
    var _m = (0, search_integration_1.useSearchIntegration)({ debounceMs: debounceMs }), results = _m.results, loading = _m.loading, error = _m.error, searchHistory = _m.searchHistory, recentSearches = _m.recentSearches, search = _m.search, clearAll = _m.clearAll, cancelSearch = _m.cancelSearch, addToRecentSearches = _m.addToRecentSearches, clearSearchHistory = _m.clearSearchHistory;
    // Flatten SearchResultItem[] to Account[] for display
    var flattenedAccounts = (0, react_1.useMemo)(function () {
        return results; // results is already SearchResultItem[] (which extends Account)
    }, [results]);
    // ============================================================================
    // EFFECTS
    // ============================================================================
    (0, react_1.useEffect)(function () {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            var _a;
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    (0, react_1.useEffect)(function () {
        if (onSearchChange) {
            onSearchChange(inputValue);
        }
    }, [inputValue]); // Remove onSearchChange from dependencies to prevent infinite loop
    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================
    var handleInputChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var value, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    value = e.target.value;
                    setInputValue(value);
                    setSelectedIndex(-1);
                    if (!value.trim()) return [3 /*break*/, 5];
                    setIsOpen(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, search(value)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Search failed in input change handler', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        searchTerm: value
                    });
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    setIsOpen(false);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleKeyDown = function (e) {
        var _a;
        if (!isOpen)
            return;
        var totalItems = flattenedAccounts.length + (showHistory ? searchHistory.length : 0) + (showRecentSearches ? recentSearches.length : 0);
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(function (prev) { return (prev + 1) % totalItems; });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(function (prev) { return prev <= 0 ? totalItems - 1 : prev - 1; });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleItemSelect(selectedIndex);
                }
                else if (inputValue.trim()) {
                    handleSearch(inputValue.trim());
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
                break;
        }
    };
    var handleItemSelect = function (index) {
        var currentIndex = 0;
        // Check if it's a search result
        if (index < flattenedAccounts.length) {
            var account = flattenedAccounts[index];
            if (account) {
                handleAccountSelect(account);
            }
            return;
        }
        currentIndex += flattenedAccounts.length;
        // Check if it's a search history item
        if (showHistory && index < currentIndex + searchHistory.length) {
            var historyIndex = index - currentIndex;
            var term = searchHistory[historyIndex];
            if (term) {
                setInputValue(term);
                handleSearch(term);
            }
            return;
        }
        currentIndex += searchHistory.length;
        // Check if it's a recent search item
        if (showRecentSearches && index < currentIndex + recentSearches.length) {
            var recentIndex = index - currentIndex;
            var result = recentSearches[recentIndex];
            // recentSearches is SearchResultItem[] (which extends Account)
            if (result) {
                handleAccountSelect(result);
            }
            return;
        }
    };
    var handleAccountSelect = function (account) {
        // Create a SearchResult wrapper for the callback
        var searchResult = {
            data: [account],
            totalCount: 1,
            executionTimeMs: 0,
            searchMethod: 'enhanced'
        };
        addToRecentSearches(searchResult);
        setInputValue('');
        setIsOpen(false);
        setSelectedIndex(-1);
        if (onResultSelect) {
            onResultSelect(searchResult);
        }
    };
    var handleSearch = function (term) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!term.trim())
                        return [2 /*return*/];
                    setInputValue(term);
                    setIsOpen(false);
                    setSelectedIndex(-1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, search(term)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Search failed in search handler', {
                        error: error_2 instanceof Error ? error_2.message : String(error_2),
                        searchTerm: term
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleClear = function () {
        var _a;
        setInputValue('');
        setIsOpen(false);
        setSelectedIndex(-1);
        clearAll();
        cancelSearch();
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var handleRemoveHistoryItem = function (_term) {
        // This would need to be implemented in the search integration
        // For now, we'll just clear all history
        clearSearchHistory();
    };
    // ============================================================================
    // RENDER HELPERS
    // ============================================================================
    var renderSearchResults = function () {
        if (loading) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin mx-auto text-indigo-500" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: "Searching..." })] }));
        }
        if (error) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-8 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-500 text-sm", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Search failed: ", error] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return search(inputValue); }, className: "mt-2 text-indigo-600 hover:text-indigo-800 underline", children: "Try again" })] }) }));
        }
        if (flattenedAccounts.length === 0 && inputValue.trim()) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-8 w-8 mx-auto text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: "No results found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: "Try a different search term" })] }));
        }
        return flattenedAccounts.slice(0, maxResults).map(function (account, index) { return ((0, jsx_runtime_1.jsx)(SearchSuggestion, { account: account, isSelected: selectedIndex === index, onClick: function () { return handleAccountSelect(account); } }, account.id)); });
    };
    var renderSearchHistory = function () {
        if (!showHistory || searchHistory.length === 0)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Recent Searches" }), (0, jsx_runtime_1.jsx)("button", { onClick: clearSearchHistory, className: "text-xs text-indigo-600 hover:text-indigo-800", children: "Clear" })] }) }), searchHistory.slice(0, 5).map(function (term) { return ((0, jsx_runtime_1.jsx)(SearchHistoryItem, { term: term, onClick: function () { return handleSearch(term); }, onRemove: function () { return handleRemoveHistoryItem(term); } }, term)); })] }));
    };
    var renderRecentSearches = function () {
        if (!showRecentSearches || recentSearches.length === 0)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Recent Results" })] }) }), recentSearches
                    .slice(0, 3)
                    .flatMap(function (result) { return result.data || []; })
                    .slice(0, 3)
                    .map(function (account, index) { return ((0, jsx_runtime_1.jsx)(SearchSuggestion, { account: account, isSelected: selectedIndex === flattenedAccounts.length + (showHistory ? searchHistory.length : 0) + index, onClick: function () { return handleAccountSelect(account); } }, account.id)); })] }));
    };
    // ============================================================================
    // RENDER
    // ============================================================================
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-visible ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: inputValue, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () { return setIsOpen(true); }, placeholder: placeholder, className: "block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500" }), inputValue && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleClear, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) }) }))] }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: "absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto", children: [renderSearchResults(), renderSearchHistory(), renderRecentSearches(), !loading && !error && results.length === 0 && !inputValue.trim() && ((0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-8 w-8 mx-auto text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: "Start typing to search" })] }))] }))] }));
};
exports.SearchBar = SearchBar;
exports.default = exports.SearchBar;
