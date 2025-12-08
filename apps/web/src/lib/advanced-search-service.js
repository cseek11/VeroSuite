"use strict";
// ============================================================================
// ADVANCED SEARCH SERVICE - Fuzzy Matching & Vector Search
// ============================================================================
// Enhanced search service with fuzzy matching, typo tolerance, and vector search
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
exports.advancedSearchService = void 0;
var supabase_client_1 = require("./supabase-client");
var config_1 = require("@/lib/config");
var intent_classification_service_1 = require("./intent-classification-service");
var action_handlers_1 = require("./action-handlers");
var logger_1 = require("@/utils/logger");
// ============================================================================
// ADVANCED SEARCH SERVICE
// ============================================================================
var AdvancedSearchService = /** @class */ (function () {
    function AdvancedSearchService() {
        var _this = this;
        Object.defineProperty(this, "getTenantId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () { return __awaiter(_this, void 0, void 0, function () {
                var authData, parsed, tenantId;
                var _a;
                return __generator(this, function (_b) {
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData) {
                        throw new Error('User not authenticated');
                    }
                    try {
                        parsed = JSON.parse(authData);
                        tenantId = parsed.tenantId;
                        if (!tenantId) {
                            throw new Error('Tenant ID not found in auth data');
                        }
                        logger_1.logger.debug('Getting tenant ID for user', { userEmail: (_a = parsed.user) === null || _a === void 0 ? void 0 : _a.email }, 'advanced-search-service');
                        return [2 /*return*/, tenantId];
                    }
                    catch (error) {
                        logger_1.logger.error('Error parsing auth data', error, 'advanced-search-service');
                        throw new Error('Invalid authentication data');
                    }
                    return [2 /*return*/];
                });
            }); }
        });
        /**
         * Global search that handles both natural language commands and regular search
         * This is the main entry point for the unified search interface
         */
        Object.defineProperty(this, "globalSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (query_1, filters_1) {
                var args_1 = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args_1[_i - 2] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([query_1, filters_1], args_1, true), void 0, function (query, filters, options) {
                    var intentResult, searchResults_1, validation, searchResults_2, confirmationData, actionResult, searchResults, error_1, searchResults, searchError_1;
                    if (options === void 0) { options = {}; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 9, , 14]);
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Starting global search for query', { query: query }, 'advanced-search-service');
                                }
                                intentResult = intent_classification_service_1.intentClassificationService.classifyIntent(query);
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Intent classified', { intent: intentResult.intent, confidence: intentResult.confidence }, 'advanced-search-service');
                                }
                                if (!(intentResult.intent === 'search' || intentResult.confidence < 0.6)) return [3 /*break*/, 2];
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Falling back to regular search', {}, 'advanced-search-service');
                                }
                                return [4 /*yield*/, this.searchCustomersAdvanced(query, filters, options)];
                            case 1:
                                searchResults_1 = _a.sent();
                                return [2 /*return*/, {
                                        type: 'search',
                                        searchResults: searchResults_1,
                                        intent: intentResult
                                    }];
                            case 2:
                                if (!(intentResult.confidence >= 0.6)) return [3 /*break*/, 7];
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Executing action for intent', { intent: intentResult.intent }, 'advanced-search-service');
                                }
                                validation = action_handlers_1.actionExecutorService.validateAction(intentResult);
                                if (!!validation.isValid) return [3 /*break*/, 4];
                                logger_1.logger.warn('Action validation failed', { errors: validation.errors }, 'advanced-search-service');
                                return [4 /*yield*/, this.searchCustomersAdvanced(query, filters, options)];
                            case 3:
                                searchResults_2 = _a.sent();
                                return [2 /*return*/, {
                                        type: 'search',
                                        searchResults: searchResults_2,
                                        intent: intentResult
                                    }];
                            case 4:
                                confirmationData = action_handlers_1.actionExecutorService.getConfirmationData(intentResult);
                                if (!(intentResult.confidence >= 0.9)) return [3 /*break*/, 6];
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('High confidence, executing action immediately', {}, 'advanced-search-service');
                                }
                                return [4 /*yield*/, action_handlers_1.actionExecutorService.executeAction(intentResult)];
                            case 5:
                                actionResult = _a.sent();
                                return [2 /*return*/, {
                                        type: 'action',
                                        intent: intentResult,
                                        actionResult: actionResult,
                                        requiresConfirmation: false
                                    }];
                            case 6:
                                // Otherwise, return confirmation data for user approval
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Medium confidence, requiring confirmation', {}, 'advanced-search-service');
                                }
                                return [2 /*return*/, {
                                        type: 'action',
                                        intent: intentResult,
                                        requiresConfirmation: true,
                                        confirmationData: confirmationData
                                    }];
                            case 7:
                                // Fallback to search
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Fallback to search', {}, 'advanced-search-service');
                                }
                                return [4 /*yield*/, this.searchCustomersAdvanced(query, filters, options)];
                            case 8:
                                searchResults = _a.sent();
                                return [2 /*return*/, {
                                        type: 'search',
                                        searchResults: searchResults,
                                        intent: intentResult
                                    }];
                            case 9:
                                error_1 = _a.sent();
                                logger_1.logger.error('Error in global search', error_1, 'advanced-search-service');
                                _a.label = 10;
                            case 10:
                                _a.trys.push([10, 12, , 13]);
                                return [4 /*yield*/, this.searchCustomersAdvanced(query, filters, options)];
                            case 11:
                                searchResults = _a.sent();
                                return [2 /*return*/, {
                                        type: 'search',
                                        searchResults: searchResults,
                                        intent: {
                                            intent: 'search',
                                            confidence: 0.5,
                                            entities: {},
                                            originalQuery: query,
                                            processedQuery: query
                                        }
                                    }];
                            case 12:
                                searchError_1 = _a.sent();
                                logger_1.logger.error('Fallback search also failed', searchError_1, 'advanced-search-service');
                                throw error_1; // Re-throw original error
                            case 13: return [3 /*break*/, 14];
                            case 14: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Execute a confirmed action (called after user confirms)
         */
        Object.defineProperty(this, "executeConfirmedAction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (intentResult) { return __awaiter(_this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Executing confirmed action', { intent: intentResult.intent }, 'advanced-search-service');
                            }
                            return [4 /*yield*/, action_handlers_1.actionExecutorService.executeAction(intentResult)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            logger_1.logger.error('Error executing confirmed action', error_2, 'advanced-search-service');
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        });
        /**
         * Get search suggestions based on intent classification
         */
        Object.defineProperty(this, "getIntentBasedSuggestions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (query, maxSuggestions) {
                if (maxSuggestions === void 0) { maxSuggestions = 5; }
                var intentResult = intent_classification_service_1.intentClassificationService.classifyIntent(query);
                var examples = intent_classification_service_1.intentClassificationService.getIntentExamples();
                if (intentResult.intent === 'search') {
                    // For search queries, return related search suggestions
                    return [
                        "Find ".concat(query),
                        "Search for ".concat(query),
                        "Lookup ".concat(query),
                        "Show all ".concat(query),
                        "Find customers with ".concat(query)
                    ].slice(0, maxSuggestions);
                }
                // For action intents, return examples of that intent type
                var intentExamples = examples[intentResult.intent] || [];
                return intentExamples.slice(0, maxSuggestions);
            }
        });
        /**
         * Get all supported intents for help/autocomplete
         */
        Object.defineProperty(this, "getSupportedIntents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return intent_classification_service_1.intentClassificationService.getSupportedIntents();
            }
        });
        /**
         * Get examples for all intents
         */
        Object.defineProperty(this, "getIntentExamples", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return intent_classification_service_1.intentClassificationService.getIntentExamples();
            }
        });
        /**
         * Advanced search with fuzzy matching and typo tolerance
         */
        Object.defineProperty(this, "searchCustomersAdvanced", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (query_1, filters_1) {
                var args_1 = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args_1[_i - 2] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([query_1, filters_1], args_1, true), void 0, function (query, filters, options) {
                    var tenantId, _a, fuzzyThreshold, _b, maxResults, _c, searchMode, _d, typoTolerance, normalizedQuery, searchVariations, results, _e, processedResults, error_3;
                    if (options === void 0) { options = {}; }
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _f.trys.push([0, 14, , 15]);
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Starting advanced search', { query: query, filters: filters, options: options }, 'advanced-search-service');
                                }
                                return [4 /*yield*/, this.getTenantId()];
                            case 1:
                                tenantId = _f.sent();
                                _a = options.fuzzyThreshold, fuzzyThreshold = _a === void 0 ? 0.3 : _a, _b = options.maxResults, maxResults = _b === void 0 ? 50 : _b, _c = options.searchMode, searchMode = _c === void 0 ? 'hybrid' : _c, _d = options.typoTolerance, typoTolerance = _d === void 0 ? 1 : _d;
                                normalizedQuery = this.normalizeSearchQuery(query);
                                searchVariations = this.generateSearchVariations(normalizedQuery, typoTolerance);
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Advanced search setup', {
                                        originalQuery: query,
                                        normalizedQuery: normalizedQuery,
                                        searchVariations: searchVariations,
                                        searchMode: searchMode,
                                        fuzzyThreshold: fuzzyThreshold,
                                        tenantId: tenantId
                                    }, 'advanced-search-service');
                                }
                                results = [];
                                _e = searchMode;
                                switch (_e) {
                                    case 'standard': return [3 /*break*/, 2];
                                    case 'fuzzy': return [3 /*break*/, 4];
                                    case 'hybrid': return [3 /*break*/, 6];
                                    case 'vector': return [3 /*break*/, 8];
                                }
                                return [3 /*break*/, 13];
                            case 2: return [4 /*yield*/, this.executeStandardSearch(tenantId, normalizedQuery, filters, maxResults)];
                            case 3:
                                results = _f.sent();
                                return [3 /*break*/, 13];
                            case 4: return [4 /*yield*/, this.executeFuzzySearch(tenantId, searchVariations, filters, fuzzyThreshold, maxResults)];
                            case 5:
                                results = _f.sent();
                                return [3 /*break*/, 13];
                            case 6: return [4 /*yield*/, this.executeHybridSearch(tenantId, normalizedQuery, searchVariations, filters, fuzzyThreshold, maxResults)];
                            case 7:
                                results = _f.sent();
                                return [3 /*break*/, 13];
                            case 8:
                                if (!options.includeVectorSearch) return [3 /*break*/, 10];
                                return [4 /*yield*/, this.executeVectorSearch(tenantId, normalizedQuery, filters, maxResults)];
                            case 9:
                                results = _f.sent();
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, this.executeHybridSearch(tenantId, normalizedQuery, searchVariations, filters, fuzzyThreshold, maxResults)];
                            case 11:
                                results = _f.sent();
                                _f.label = 12;
                            case 12: return [3 /*break*/, 13];
                            case 13:
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Raw search results', { count: results.length, results: results.slice(0, 2) }, 'advanced-search-service');
                                }
                                processedResults = this.postProcessResults(results, query, normalizedQuery);
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Advanced search completed', { resultCount: processedResults.length }, 'advanced-search-service');
                                }
                                return [2 /*return*/, processedResults];
                            case 14:
                                error_3 = _f.sent();
                                logger_1.logger.error('Advanced search failed', error_3, 'advanced-search-service');
                                throw error_3;
                            case 15: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Get search suggestions based on query
         */
        Object.defineProperty(this, "getSearchSuggestions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (query_1) {
                var args_1 = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args_1[_i - 1] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([query_1], args_1, true), void 0, function (query, limit) {
                    var tenantId, normalizedQuery, _a, corrections, completions, related, suggestions, error_4;
                    if (limit === void 0) { limit = 5; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this.getTenantId()];
                            case 1:
                                tenantId = _b.sent();
                                normalizedQuery = this.normalizeSearchQuery(query);
                                return [4 /*yield*/, Promise.all([
                                        this.getTypoCorrections(tenantId, normalizedQuery, limit),
                                        this.getQueryCompletions(tenantId, normalizedQuery, limit),
                                        this.getRelatedQueries(tenantId, normalizedQuery, limit)
                                    ])];
                            case 2:
                                _a = _b.sent(), corrections = _a[0], completions = _a[1], related = _a[2];
                                suggestions = __spreadArray(__spreadArray(__spreadArray([], corrections, true), completions, true), related, true).sort(function (a, b) { return b.confidence - a.confidence; })
                                    .slice(0, limit);
                                return [2 /*return*/, suggestions];
                            case 3:
                                error_4 = _b.sent();
                                logger_1.logger.error('Failed to get search suggestions', error_4, 'advanced-search-service');
                                return [2 /*return*/, []];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        /**
         * Search with auto-correction
         */
        Object.defineProperty(this, "searchWithAutoCorrection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (query_1, filters_1) {
                var args_1 = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args_1[_i - 2] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([query_1, filters_1], args_1, true), void 0, function (query, filters, options) {
                    var results, suggestions_1, bestCorrection, suggestions, error_5;
                    if (options === void 0) { options = {}; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 6, , 7]);
                                return [4 /*yield*/, this.searchCustomersAdvanced(query, filters, options)];
                            case 1:
                                results = _a.sent();
                                if (!(results.length === 0 && this.looksLikeTypo(query))) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.getSearchSuggestions(query, 3)];
                            case 2:
                                suggestions_1 = _a.sent();
                                bestCorrection = suggestions_1.find(function (s) { return s.type === 'correction' && s.confidence > 0.7; });
                                if (!bestCorrection) return [3 /*break*/, 4];
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Auto-correcting query', { original: query, corrected: bestCorrection.text }, 'advanced-search-service');
                                }
                                return [4 /*yield*/, this.searchCustomersAdvanced(bestCorrection.text, filters, options)];
                            case 3:
                                results = _a.sent();
                                return [2 /*return*/, {
                                        results: results,
                                        correctedQuery: bestCorrection.text,
                                        suggestions: suggestions_1
                                    }];
                            case 4: return [4 /*yield*/, this.getSearchSuggestions(query, 5)];
                            case 5:
                                suggestions = _a.sent();
                                return [2 /*return*/, {
                                        results: results,
                                        suggestions: suggestions
                                    }];
                            case 6:
                                error_5 = _a.sent();
                                logger_1.logger.error('Search with auto-correction failed', error_5, 'advanced-search-service');
                                throw error_5;
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            }
        });
    }
    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================
    Object.defineProperty(AdvancedSearchService.prototype, "normalizeSearchQuery", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return query
                .trim()
                .toLowerCase()
                .replace(/[^\w\s@.-]/g, '') // Remove special chars except @, ., -
                .replace(/\s+/g, ' '); // Normalize whitespace
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "generateSearchVariations", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, typoTolerance) {
            var variations = [query];
            if (typoTolerance > 0) {
                // Add common typo variations
                var commonTypos = this.getCommonTypoVariations(query);
                variations.push.apply(variations, commonTypos.slice(0, typoTolerance * 2));
            }
            return __spreadArray([], new Set(variations), true); // Remove duplicates
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "getCommonTypoVariations", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            var variations = [];
            // Common character substitutions
            var substitutions = {
                'a': ['@', '4'],
                'e': ['3'],
                'i': ['1', '!'],
                'o': ['0'],
                's': ['$', '5'],
                't': ['7'],
                'l': ['1'],
                'b': ['6'],
                'g': ['9']
            };
            // Generate variations with character substitutions
            for (var i = 0; i < query.length; i++) {
                var char = query[i];
                if (char && substitutions[char]) {
                    var subs = substitutions[char];
                    if (subs) {
                        for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
                            var sub = subs_1[_i];
                            variations.push(query.slice(0, i) + sub + query.slice(i + 1));
                        }
                    }
                }
            }
            // Add variations with missing/extra characters
            for (var i = 0; i < query.length; i++) {
                // Missing character
                variations.push(query.slice(0, i) + query.slice(i + 1));
                // Extra character
                variations.push(query.slice(0, i) + 'x' + query.slice(i));
            }
            return variations;
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "looksLikeTypo", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            // Simple heuristics to detect potential typos
            return (query.length > 2 && // Not too short
                /[^a-zA-Z0-9\s@.-]/.test(query) || // Has special characters
                query.split(' ').some(function (word) { return word.length > 1 && /[0-9]/.test(word); }) // Numbers in words
            );
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "executeStandardSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId_1, query_1, filters_1) {
            return __awaiter(this, arguments, void 0, function (tenantId, query, filters, maxResults) {
                var _a, data, error;
                if (maxResults === void 0) { maxResults = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Executing standard search', { query: query, tenantId: tenantId, filters: filters, maxResults: maxResults }, 'advanced-search-service');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .rpc('search_customers_multi_word', {
                                    p_search_term: query,
                                    p_tenant_id: tenantId,
                                    p_limit: maxResults,
                                    p_offset: 0
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                logger_1.logger.error('Standard search failed', error, 'advanced-search-service');
                                return [2 /*return*/, []];
                            }
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Standard search results', { count: (data === null || data === void 0 ? void 0 : data.length) || 0, data: data === null || data === void 0 ? void 0 : data.slice(0, 2) }, 'advanced-search-service');
                            }
                            return [2 /*return*/, this.mapToAdvancedResults(data || [], 'exact')];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "executeFuzzySearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId_1, searchVariations_1, _filters_1) {
            return __awaiter(this, arguments, void 0, function (tenantId, searchVariations, _filters, fuzzyThreshold, maxResults) {
                var _a, data, error, e_1, allResults, _loop_1, _i, searchVariations_2, variation, uniqueResults;
                if (fuzzyThreshold === void 0) { fuzzyThreshold = 0.3; }
                if (maxResults === void 0) { maxResults = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!config_1.config.features.enableFuzzy) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('search_customers_fuzzy', {
                                    p_tenant_id: tenantId,
                                    p_query: searchVariations[0] || '',
                                    p_threshold: fuzzyThreshold,
                                    p_limit: maxResults
                                })];
                        case 2:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (!error && data) {
                                return [2 /*return*/, this.mapToAdvancedResults(data, 'fuzzy')];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _b.sent();
                            logger_1.logger.warn('Fuzzy RPC unavailable, falling back to client fuzzy search', { error: e_1 }, 'advanced-search-service');
                            return [3 /*break*/, 4];
                        case 4:
                            allResults = [];
                            _loop_1 = function (variation) {
                                var _c, data, error, fuzzyResults;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, supabase_client_1.supabase
                                                .rpc('search_customers_multi_word', {
                                                p_search_term: variation,
                                                p_tenant_id: tenantId,
                                                p_limit: maxResults,
                                                p_offset: 0
                                            })];
                                        case 1:
                                            _c = _d.sent(), data = _c.data, error = _c.error;
                                            if (!error && data) {
                                                fuzzyResults = data
                                                    .filter(function (result) { return result.match_type === 'fuzzy' && result.relevance_score >= fuzzyThreshold; })
                                                    .map(function (result) { return (__assign(__assign({}, result), { match_type: 'fuzzy', match_details: {
                                                        field: 'name',
                                                        similarity: result.relevance_score,
                                                        original_query: variation,
                                                        matched_text: result.name
                                                    } })); });
                                                allResults.push.apply(allResults, fuzzyResults);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, searchVariations_2 = searchVariations;
                            _b.label = 5;
                        case 5:
                            if (!(_i < searchVariations_2.length)) return [3 /*break*/, 8];
                            variation = searchVariations_2[_i];
                            return [5 /*yield**/, _loop_1(variation)];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 5];
                        case 8:
                            uniqueResults = this.removeDuplicateResults(allResults);
                            return [2 /*return*/, uniqueResults.slice(0, maxResults)];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "executeHybridSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId_1, query_1, searchVariations_1, filters_1) {
            return __awaiter(this, arguments, void 0, function (tenantId, query, searchVariations, filters, fuzzyThreshold, maxResults) {
                var _a, standardResults, fuzzyResults, allResults, uniqueResults;
                if (fuzzyThreshold === void 0) { fuzzyThreshold = 0.3; }
                if (maxResults === void 0) { maxResults = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Executing hybrid search', { query: query, searchVariations: searchVariations, fuzzyThreshold: fuzzyThreshold }, 'advanced-search-service');
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.executeStandardSearch(tenantId, query, filters, maxResults),
                                    this.executeFuzzySearch(tenantId, searchVariations, filters, fuzzyThreshold, maxResults)
                                ])];
                        case 1:
                            _a = _b.sent(), standardResults = _a[0], fuzzyResults = _a[1];
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Hybrid search results', {
                                    standard: standardResults.length,
                                    fuzzy: fuzzyResults.length
                                }, 'advanced-search-service');
                            }
                            allResults = __spreadArray(__spreadArray([], standardResults, true), fuzzyResults, true);
                            uniqueResults = this.removeDuplicateResults(allResults);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Final hybrid results', { total: uniqueResults.length }, 'advanced-search-service');
                            }
                            return [2 /*return*/, uniqueResults.slice(0, maxResults)];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "executeVectorSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId_1, query_1, filters_1) {
            return __awaiter(this, arguments, void 0, function (tenantId, query, filters, maxResults) {
                var _a, data, error, error_6;
                if (maxResults === void 0) { maxResults = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .rpc('search_customers_vector', {
                                    p_embedding: query, // This would normally be a vector embedding
                                    p_tenant_id: tenantId,
                                    p_limit: maxResults,
                                    p_similarity_threshold: 0.7
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Vector search not available, falling back to hybrid search', {}, 'advanced-search-service');
                                }
                                return [2 /*return*/, this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults)];
                            }
                            return [2 /*return*/, this.mapToAdvancedResults(data || [], 'vector')];
                        case 2:
                            error_6 = _b.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Vector search failed, falling back to hybrid search', { error: error_6 }, 'advanced-search-service');
                            }
                            return [2 /*return*/, this.executeHybridSearch(tenantId, query, [query], filters, 0.3, maxResults)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "getTypoCorrections", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_tenantId, _query, _limit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // This would typically use a spell-checker or ML model
                    // For now, return empty array - can be enhanced later
                    return [2 /*return*/, []];
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "getQueryCompletions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_tenantId, query, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error, suggestions_2, rpcError_1, _b, customersData, logsData, suggestions_3, _error_1;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            if (!config_1.config.features.enableSuggestions) return [3 /*break*/, 4];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Calling get_search_suggestions RPC', { query: query, limit: limit }, 'advanced-search-service');
                            }
                            return [4 /*yield*/, supabase_client_1.supabase.rpc('get_search_suggestions', {
                                    p_query: query,
                                    p_limit: limit
                                })];
                        case 2:
                            _a = _c.sent(), data = _a.data, error = _a.error;
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('RPC response', { data: data, error: error }, 'advanced-search-service');
                            }
                            if (!error && Array.isArray(data)) {
                                suggestions_2 = data.map(function (row) { return ({
                                    text: row.suggestion || '',
                                    type: _this.mapSourceToType(row.source),
                                    confidence: Number(row.score) / 100 // Convert score (0-100) to confidence (0-1)
                                }); });
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Mapped suggestions', { suggestions: suggestions_2 }, 'advanced-search-service');
                                }
                                return [2 /*return*/, suggestions_2];
                            }
                            if (error) {
                                logger_1.logger.error('RPC error', error, 'advanced-search-service');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            rpcError_1 = _c.sent();
                            logger_1.logger.warn('RPC get_search_suggestions failed, falling back to direct queries', { error: rpcError_1 }, 'advanced-search-service');
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, Promise.all([
                                // Customer names
                                supabase_client_1.supabase
                                    .from('customers')
                                    .select('first_name, last_name')
                                    .eq('tenant_id', _tenantId)
                                    .or("first_name.ilike.".concat(query, "%,last_name.ilike.").concat(query, "%"))
                                    .limit(limit),
                                // Search logs
                                supabase_client_1.supabase
                                    .from('search_logs')
                                    .select('query')
                                    .eq('tenant_id', _tenantId)
                                    .ilike('query', "".concat(query, "%"))
                                    .order('created_at', { ascending: false })
                                    .limit(limit)
                            ])];
                        case 5:
                            _b = _c.sent(), customersData = _b[0], logsData = _b[1];
                            suggestions_3 = [];
                            // Add customer name suggestions
                            if (customersData.data) {
                                customersData.data.forEach(function (customer) {
                                    var _a, _b;
                                    if ((_a = customer.first_name) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith(query.toLowerCase())) {
                                        suggestions_3.push({ text: customer.first_name, type: 'completion', confidence: 0.9 });
                                    }
                                    if ((_b = customer.last_name) === null || _b === void 0 ? void 0 : _b.toLowerCase().startsWith(query.toLowerCase())) {
                                        suggestions_3.push({ text: customer.last_name, type: 'completion', confidence: 0.9 });
                                    }
                                    if (customer.first_name && customer.last_name &&
                                        (customer.first_name + ' ' + customer.last_name).toLowerCase().startsWith(query.toLowerCase())) {
                                        suggestions_3.push({ text: customer.first_name + ' ' + customer.last_name, type: 'completion', confidence: 0.95 });
                                    }
                                });
                            }
                            // Add log suggestions
                            if (logsData.data) {
                                logsData.data.forEach(function (item) {
                                    if (item.query && !suggestions_3.some(function (s) { return s.text === item.query; })) {
                                        suggestions_3.push({ text: item.query, type: 'completion', confidence: 0.8 });
                                    }
                                });
                            }
                            return [2 /*return*/, suggestions_3
                                    .sort(function (a, b) { return b.confidence - a.confidence; })
                                    .slice(0, limit)];
                        case 6:
                            _error_1 = _c.sent();
                            logger_1.logger.error('Failed to get query completions', _error_1, 'advanced-search-service');
                            return [2 /*return*/, []];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "mapSourceToType", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (source) {
            switch (source) {
                case 'contacts':
                    return 'completion';
                case 'accounts':
                    return 'completion';
                case 'users':
                    return 'completion';
                case 'popular':
                    return 'completion';
                case 'logs':
                    return 'related';
                case 'analytics':
                    return 'related';
                case 'trends':
                    return 'related';
                default:
                    return 'completion';
            }
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "getRelatedQueries", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (tenantId, query, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error, related, error_7;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase
                                    .from('search_logs')
                                    .select('query')
                                    .eq('tenant_id', tenantId)
                                    .neq('query', query)
                                    .order('created_at', { ascending: false })
                                    .limit(limit * 2)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                return [2 /*return*/, []];
                            related = data
                                .filter(function (item) { return _this.calculateSimpleSimilarity(query, item.query) > 0.5; })
                                .slice(0, limit)
                                .map(function (item) { return ({
                                text: item.query,
                                type: 'related',
                                confidence: _this.calculateSimpleSimilarity(query, item.query)
                            }); });
                            return [2 /*return*/, related];
                        case 2:
                            error_7 = _b.sent();
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "calculateSimpleSimilarity", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (str1, str2) {
            var longer = str1.length > str2.length ? str1 : str2;
            var shorter = str1.length > str2.length ? str2 : str1;
            if (longer.length === 0)
                return 1.0;
            var editDistance = this.levenshteinDistance(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "levenshteinDistance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (str1, str2) {
            var _a, _b, _c, _d;
            var matrix = Array(str2.length + 1).fill(null).map(function () { return Array(str1.length + 1).fill(null); });
            for (var i = 0; i <= str1.length; i++)
                matrix[0][i] = i;
            for (var j = 0; j <= str2.length; j++)
                matrix[j][0] = j;
            for (var j = 1; j <= str2.length; j++) {
                for (var i = 1; i <= str1.length; i++) {
                    var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[j][i] = Math.min(((_a = matrix[j][i - 1]) !== null && _a !== void 0 ? _a : 0) + 1, ((_b = matrix[j - 1][i]) !== null && _b !== void 0 ? _b : 0) + 1, ((_c = matrix[j - 1][i - 1]) !== null && _c !== void 0 ? _c : 0) + indicator);
                }
            }
            return (_d = matrix[str2.length][str1.length]) !== null && _d !== void 0 ? _d : 0;
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "mapToAdvancedResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data, defaultMatchType) {
            return data.map(function (item) { return (__assign(__assign({}, item), { match_type: item.match_type || defaultMatchType, match_details: item.match_details || {
                    field: 'name',
                    similarity: item.relevance_score || 1.0,
                    original_query: '',
                    matched_text: item.name
                } })); });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "removeDuplicateResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (results) {
            var seen = new Set();
            return results.filter(function (result) {
                if (seen.has(result.id))
                    return false;
                seen.add(result.id);
                return true;
            });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "postProcessResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (results, originalQuery, _normalizedQuery) {
            var _this = this;
            return results.map(function (result) { return (__assign(__assign({}, result), { match_details: __assign(__assign({}, result.match_details), { original_query: originalQuery }), search_suggestions: _this.generateResultSuggestions(result, originalQuery) })); });
        }
    });
    Object.defineProperty(AdvancedSearchService.prototype, "generateResultSuggestions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (result, query) {
            var suggestions = [];
            // Add related field suggestions
            if (result.city && !query.toLowerCase().includes(result.city.toLowerCase())) {
                suggestions.push("".concat(query, " ").concat(result.city));
            }
            if (result.state && !query.toLowerCase().includes(result.state.toLowerCase())) {
                suggestions.push("".concat(query, " ").concat(result.state));
            }
            return suggestions.slice(0, 3);
        }
    });
    return AdvancedSearchService;
}());
// Export singleton instance
exports.advancedSearchService = new AdvancedSearchService();
