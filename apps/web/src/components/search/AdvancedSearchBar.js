"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// ============================================================================
// ADVANCED SEARCH BAR
// ============================================================================
// Advanced search component with fuzzy matching, suggestions, and auto-correction
var react_1 = require("react");
var useAdvancedSearch_1 = require("@/hooks/useAdvancedSearch");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var logger_1 = require("@/utils/logger");
var AdvancedSearchBar = function (_a) {
    var onResultsChange = _a.onResultsChange, _onFiltersChange = _a.onFiltersChange, _b = _a.placeholder, placeholder = _b === void 0 ? "Search customers with fuzzy matching..." : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.showModeSelector, showModeSelector = _d === void 0 ? true : _d, _e = _a.showSuggestions, showSuggestions = _e === void 0 ? true : _e, _f = _a.enableAutoCorrection, enableAutoCorrection = _f === void 0 ? true : _f;
    var _g = (0, react_1.useState)(false), _isFocused = _g[0], setIsFocused = _g[1];
    var _h = (0, react_1.useState)(false), showModeDropdown = _h[0], setShowModeDropdown = _h[1];
    var _j = (0, react_1.useState)(false), showSuggestionsDropdown = _j[0], setShowSuggestionsDropdown = _j[1];
    var inputRef = (0, react_1.useRef)(null);
    var dropdownRef = (0, react_1.useRef)(null);
    var _k = (0, useAdvancedSearch_1.useAdvancedSearch)({
        enableAutoCorrection: enableAutoCorrection,
        enableSuggestions: showSuggestions,
        defaultSearchMode: 'hybrid'
    }), query = _k.query, results = _k.results, suggestions = _k.suggestions, correctedQuery = _k.correctedQuery, isLoading = _k.isLoading, error = _k.error, searchMode = _k.searchMode, hasSearched = _k.hasSearched, search = _k.search, clearSearch = _k.clearSearch, updateSearchMode = _k.updateSearchMode, searchWithSuggestion = _k.searchWithSuggestion, searchWithCorrection = _k.searchWithCorrection, getSearchStats = _k.getSearchStats;
    // Notify parent when results change (but only after search)
    // Use a stable callback reference to prevent infinite loops
    var stableOnResultsChange = (0, react_1.useCallback)(function (newResults) {
        if (onResultsChange) {
            logger_1.logger.debug('AdvancedSearchBar calling onResultsChange', { resultsCount: newResults.length }, 'AdvancedSearchBar');
            onResultsChange(newResults);
        }
    }, [onResultsChange]);
    (0, react_1.useEffect)(function () {
        if (hasSearched && !isLoading) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('AdvancedSearchBar effect triggered', {
                    hasSearched: hasSearched,
                    isLoading: isLoading,
                    resultsLength: results.length
                });
            }
            stableOnResultsChange(results);
        }
    }, [results, hasSearched, isLoading, stableOnResultsChange]);
    // Handle clicks outside dropdown
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestionsDropdown(false);
                setShowModeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var handleInputChange = function (e) {
        var value = e.target.value;
        search(value);
        setShowSuggestionsDropdown(value.length > 0);
    };
    var handleKeyDown = function (e) {
        var _a;
        if (e.key === 'Escape') {
            setShowSuggestionsDropdown(false);
            setShowModeDropdown(false);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
    };
    var handleSuggestionClick = function (suggestion) {
        var _a;
        searchWithSuggestion(suggestion);
        setShowSuggestionsDropdown(false);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var handleCorrectionClick = function () {
        if (correctedQuery) {
            searchWithCorrection(correctedQuery);
            setShowSuggestionsDropdown(false);
        }
    };
    var getSearchModeIcon = function (mode) {
        switch (mode) {
            case 'standard': return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-4 h-4" });
            case 'fuzzy': return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4" });
            case 'hybrid': return (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-4 h-4" });
            case 'vector': return (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-4 h-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4" });
        }
    };
    var getSearchModeLabel = function (mode) {
        switch (mode) {
            case 'standard': return 'Standard';
            case 'fuzzy': return 'Fuzzy';
            case 'hybrid': return 'Hybrid';
            case 'vector': return 'Vector';
            default: return 'Search';
        }
    };
    var getSearchModeDescription = function (mode) {
        switch (mode) {
            case 'standard': return 'Exact text matching';
            case 'fuzzy': return 'Typo-tolerant matching';
            case 'hybrid': return 'Best of both worlds';
            case 'vector': return 'AI-powered semantic search';
            default: return '';
        }
    };
    var stats = getSearchStats();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(className), ref: dropdownRef, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [showModeSelector && ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setShowModeDropdown(!showModeDropdown); }, className: "flex items-center space-x-2 min-w-[100px]", children: [getSearchModeIcon(searchMode), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: getSearchModeLabel(searchMode) }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3" })] }), showModeDropdown && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "absolute top-full left-0 mt-1 z-50 min-w-[200px] p-2 bg-white border border-gray-200 shadow-lg backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: ['standard', 'fuzzy', 'hybrid', 'vector'].map(function (mode) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                    updateSearchMode(mode);
                                                    setShowModeDropdown(false);
                                                }, className: "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ".concat(searchMode === mode
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : 'hover:bg-gray-100 hover:border-gray-200'), children: [getSearchModeIcon(mode), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: getSearchModeLabel(mode) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: getSearchModeDescription(mode) })] })] }, mode)); }) }) }))] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: query, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () {
                                                    setIsFocused(true);
                                                    if (query.length > 0)
                                                        setShowSuggestionsDropdown(true);
                                                }, onBlur: function (_event) { return setIsFocused(false); }, placeholder: placeholder, className: "advanced-search-input w-full pl-10 pr-10 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200" }), query && ((0, jsx_runtime_1.jsx)("button", { onClick: clearSearch, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" }) }))] })] }), correctedQuery && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lightbulb, { className: "w-4 h-4 text-blue-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-blue-700", children: ["Did you mean \"", correctedQuery, "\"?"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleCorrectionClick, className: "ml-auto text-blue-600 border-blue-300 hover:bg-blue-100", children: "Use correction" })] }) })), error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-700", children: error })] }) })), hasSearched && stats && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center space-x-4 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { children: [stats.totalResults, " results"] }), stats.exactMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.exactMatches, " exact"] }), stats.fuzzyMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.fuzzyMatches, " fuzzy"] }), stats.vectorMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.vectorMatches, " vector"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Avg relevance: ", (stats.averageRelevance * 100).toFixed(0), "%"] })] }))] }), showSuggestionsDropdown && suggestions.length > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "absolute top-full left-0 right-0 mt-1 z-40 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs font-medium text-gray-500 mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Smart Suggestions" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-purple-600 font-medium", children: [suggestions.length, " found"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: suggestions.map(function (suggestion, index) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSuggestionClick(suggestion); }, className: "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 border border-transparent flex items-center space-x-2 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: suggestion.text }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: suggestion.type }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium text-purple-600", children: [(suggestion.confidence * 100).toFixed(0), "% match"] })] })] }), suggestion.type === 'correction' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" })), suggestion.type === 'completion' && ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 text-purple-400" }))] }, index)); }) })] }) }))] }));
};
exports.AdvancedSearchBar = AdvancedSearchBar;
exports.default = exports.AdvancedSearchBar;
