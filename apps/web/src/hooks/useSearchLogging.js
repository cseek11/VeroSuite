"use strict";
// ============================================================================
// SEARCH LOGGING HOOK
// ============================================================================
// React hook for managing search logging functionality
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
exports.useSearchLogging = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var search_logging_service_1 = require("@/lib/search-logging-service");
var logger_1 = require("@/utils/logger");
var useSearchLogging = function (options) {
    if (options === void 0) { options = {}; }
    var _a = options.enableLogging, enableLogging = _a === void 0 ? true : _a, _b = options.enableAnalytics, enableAnalytics = _b === void 0 ? true : _b, _c = options.enableSuggestions, enableSuggestions = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)(false), isLogging = _d[0], setIsLogging = _d[1];
    var _e = (0, react_1.useState)(null), currentLogId = _e[0], setCurrentLogId = _e[1];
    var searchStartTime = (0, react_1.useRef)(0);
    // Fetch recent searches for suggestions
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['search-logging', 'recent-searches'],
        queryFn: function () { return search_logging_service_1.searchLoggingService.getRecentSearches(10); },
        enabled: enableSuggestions,
        staleTime: 5 * 60 * 1000, // 5 minutes
    }).data, recentSearches = _f === void 0 ? [] : _f;
    // Fetch popular searches
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['search-logging', 'popular-searches'],
        queryFn: function () { return search_logging_service_1.searchLoggingService.getPopularSearches(10); },
        enabled: enableSuggestions,
        staleTime: 10 * 60 * 1000, // 10 minutes
    }).data, popularSearches = _g === void 0 ? [] : _g;
    // Fetch search corrections
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['search-logging', 'search-corrections'],
        queryFn: function () { return search_logging_service_1.searchLoggingService.getSearchCorrections(); },
        enabled: enableSuggestions,
        staleTime: 15 * 60 * 1000, // 15 minutes
    }).data, searchCorrections = _h === void 0 ? [] : _h;
    // Fetch search analytics
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['search-logging', 'analytics'],
        queryFn: function () { return search_logging_service_1.searchLoggingService.getSearchAnalytics(30); },
        enabled: enableAnalytics,
        staleTime: 30 * 60 * 1000, // 30 minutes
    }).data, analytics = _j === void 0 ? null : _j;
    // Start logging a search
    var startSearchLog = (0, react_1.useCallback)(function (query, searchFilters) {
        if (!enableLogging)
            return;
        searchStartTime.current = Date.now();
        setIsLogging(true);
        setCurrentLogId(null);
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Starting search log', { query: query, filters: searchFilters }, 'useSearchLogging');
        }
    }, [enableLogging]);
    // Complete logging a search
    var completeSearchLog = (0, react_1.useCallback)(function (query, resultsCount, searchFilters) { return __awaiter(void 0, void 0, void 0, function () {
        var timeTakenMs, logId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!enableLogging || !searchStartTime.current)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    timeTakenMs = Date.now() - searchStartTime.current;
                    return [4 /*yield*/, search_logging_service_1.searchLoggingService.logSearch(__assign({ query: query, resultsCount: resultsCount, timeTakenMs: timeTakenMs }, (searchFilters !== undefined ? { searchFilters: searchFilters } : {})))];
                case 2:
                    logId = _a.sent();
                    setCurrentLogId(logId);
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Search log completed', { query: query, resultsCount: resultsCount, timeTakenMs: timeTakenMs, logId: logId }, 'useSearchLogging');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to log search', error_1, 'useSearchLogging');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLogging(false);
                    searchStartTime.current = 0;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [enableLogging]);
    // Log a click on a search result
    var logSearchClick = (0, react_1.useCallback)(function (recordId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!enableLogging || !currentLogId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, search_logging_service_1.searchLoggingService.logClick(currentLogId, recordId)];
                case 2:
                    _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Search click logged', { logId: currentLogId, recordId: recordId }, 'useSearchLogging');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to log search click', error_2, 'useSearchLogging');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enableLogging, currentLogId]);
    // Add a search correction
    var addSearchCorrection = (0, react_1.useCallback)(function (originalQuery, correctedQuery, wasSuccessful) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!enableLogging)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, search_logging_service_1.searchLoggingService.addSearchCorrection({
                            originalQuery: originalQuery,
                            correctedQuery: correctedQuery,
                            wasSuccessful: wasSuccessful
                        })];
                case 2:
                    _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Search correction added', { originalQuery: originalQuery, correctedQuery: correctedQuery, wasSuccessful: wasSuccessful }, 'useSearchLogging');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to add search correction', error_3, 'useSearchLogging');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enableLogging]);
    // Get search suggestions based on recent and popular searches
    var getSearchSuggestions = (0, react_1.useCallback)(function (query) {
        if (!enableSuggestions || !query.trim())
            return [];
        var suggestions = [];
        var lowerQuery = query.toLowerCase();
        // Add recent searches that match
        recentSearches.forEach(function (recent) {
            if (recent.toLowerCase().includes(lowerQuery) && !suggestions.includes(recent)) {
                suggestions.push(recent);
            }
        });
        // Add popular searches that match
        popularSearches.forEach(function (popular) {
            if (popular.query.toLowerCase().includes(lowerQuery) && !suggestions.includes(popular.query)) {
                suggestions.push(popular.query);
            }
        });
        // Add corrections that match
        searchCorrections.forEach(function (correction) {
            if (correction.original_query.toLowerCase().includes(lowerQuery) && !suggestions.includes(correction.corrected_query)) {
                suggestions.push(correction.corrected_query);
            }
        });
        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }, [enableSuggestions, recentSearches, popularSearches, searchCorrections]);
    // Get suggested correction for a query
    var getSuggestedCorrection = (0, react_1.useCallback)(function (query) {
        if (!enableSuggestions || !query.trim())
            return null;
        var lowerQuery = query.toLowerCase();
        // Find the best matching correction
        var bestMatch = searchCorrections.find(function (correction) {
            return correction.original_query.toLowerCase() === lowerQuery &&
                correction.confidence_score > 0.7;
        });
        return bestMatch ? bestMatch.corrected_query : null;
    }, [enableSuggestions, searchCorrections]);
    return {
        // State
        isLogging: isLogging,
        currentLogId: currentLogId,
        recentSearches: recentSearches,
        popularSearches: popularSearches,
        searchCorrections: searchCorrections,
        analytics: analytics,
        // Actions
        startSearchLog: startSearchLog,
        completeSearchLog: completeSearchLog,
        logSearchClick: logSearchClick,
        addSearchCorrection: addSearchCorrection,
        // Utilities
        getSearchSuggestions: getSearchSuggestions,
        getSuggestedCorrection: getSuggestedCorrection,
    };
};
exports.useSearchLogging = useSearchLogging;
exports.default = exports.useSearchLogging;
