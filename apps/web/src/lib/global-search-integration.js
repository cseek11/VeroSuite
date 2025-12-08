"use strict";
// ============================================================================
// GLOBAL SEARCH INTEGRATION SERVICE
// ============================================================================
// Orchestrates all components for robust global search functionality
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
exports.globalSearchService = void 0;
var enhanced_intent_service_1 = require("./enhanced-intent-service");
var enhanced_action_handler_1 = require("./enhanced-action-handler");
var robust_api_client_1 = require("./robust-api-client");
var logger_1 = require("@/utils/logger");
var GlobalSearchIntegrationService = /** @class */ (function () {
    function GlobalSearchIntegrationService() {
        Object.defineProperty(this, "intentService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "actionHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "processingCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "defaultConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                debug: process.env.NODE_ENV === 'development',
                enableCache: true,
                enableRetry: true,
                maxProcessingTime: 30000, // 30 seconds
                confidenceThreshold: 0.6
            }
        });
        this.intentService = new enhanced_intent_service_1.EnhancedIntentClassificationService();
        this.actionHandler = new enhanced_action_handler_1.EnhancedActionHandler();
    }
    /**
     * Process global search command with comprehensive error handling
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "processCommand", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, config) {
                var processingConfig, startTime, processingId, timeoutPromise, processingPromise, result, error_1, processingTime;
                if (config === void 0) { config = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processingConfig = __assign(__assign({}, this.defaultConfig), config);
                            startTime = Date.now();
                            processingId = ++this.processingCount;
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Global Search Processing started', {
                                    processingId: processingId,
                                    query: query,
                                    config: processingConfig
                                }, 'global-search-integration');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            timeoutPromise = new Promise(function (_, reject) {
                                setTimeout(function () {
                                    reject(new Error("Processing timeout after ".concat(processingConfig.maxProcessingTime, "ms")));
                                }, processingConfig.maxProcessingTime);
                            });
                            processingPromise = this.executeProcessing(query, processingConfig, processingId);
                            return [4 /*yield*/, Promise.race([processingPromise, timeoutPromise])];
                        case 2:
                            result = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Global Search Processing completed', {
                                    processingId: processingId,
                                    success: result.success,
                                    processingTime: result.processingTime,
                                    confidence: result.confidence
                                }, 'global-search-integration');
                            }
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            processingTime = Date.now() - startTime;
                            logger_1.logger.error('Global Search Processing failed', { processingId: processingId, error: error_1 }, 'global-search-integration');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Command processing failed',
                                    intent: 'unknown',
                                    confidence: 0,
                                    processingTime: processingTime,
                                    errors: [error_1 instanceof Error ? error_1.message : 'Unknown error'],
                                    warnings: [],
                                    suggestions: [
                                        'Please try rephrasing your command',
                                        'Check your internet connection',
                                        'Contact support if the problem persists'
                                    ]
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute the main processing pipeline
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "executeProcessing", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, config, processingId) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, apiHealth, intentResult, actionResult, processingTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            if (!config.debug) return [3 /*break*/, 2];
                            return [4 /*yield*/, robust_api_client_1.robustApiClient.healthCheck()];
                        case 1:
                            apiHealth = _a.sent();
                            if (!apiHealth.healthy) {
                                logger_1.logger.warn('API health check failed', { processingId: processingId }, 'global-search-integration');
                            }
                            _a.label = 2;
                        case 2:
                            // Step 2: Intent classification and entity extraction
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Classifying intent', { processingId: processingId }, 'global-search-integration');
                            }
                            return [4 /*yield*/, this.intentService.classifyIntent(query)];
                        case 3:
                            intentResult = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Intent classified', {
                                    processingId: processingId,
                                    intent: intentResult.intent,
                                    confidence: intentResult.confidence,
                                    entities: Object.keys(intentResult.entities).filter(function (k) { return k !== 'validation'; })
                                }, 'global-search-integration');
                            }
                            // Step 3: Confidence check
                            if (intentResult.confidence < config.confidenceThreshold) {
                                return [2 /*return*/, __assign({ success: false, message: "Low confidence in command understanding (".concat(Math.round(intentResult.confidence * 100), "%)"), intent: intentResult.intent, confidence: intentResult.confidence, processingTime: Date.now() - startTime, errors: ['Command not clearly understood'], warnings: intentResult.validationErrors || [], suggestions: intentResult.suggestions || [
                                            'Please try being more specific',
                                            'Use full customer names',
                                            'Include clear field names (phone, email, etc.)'
                                        ] }, (config.debug && apiHealth ? { debugInfo: { intentResult: intentResult, actionResult: null, apiHealth: apiHealth } } : {}))];
                            }
                            // Step 4: Execute action
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Executing action', { processingId: processingId }, 'global-search-integration');
                            }
                            return [4 /*yield*/, this.actionHandler.executeAction(intentResult)];
                        case 4:
                            actionResult = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Action executed', {
                                    processingId: processingId,
                                    success: actionResult.success,
                                    errors: actionResult.errors.length,
                                    warnings: actionResult.warnings.length
                                }, 'global-search-integration');
                            }
                            processingTime = Date.now() - startTime;
                            return [2 /*return*/, __assign({ success: actionResult.success, message: actionResult.message, data: actionResult.data, intent: intentResult.intent, confidence: intentResult.confidence, processingTime: processingTime, errors: __spreadArray(__spreadArray([], intentResult.validationErrors, true), actionResult.errors, true), warnings: __spreadArray(__spreadArray([], (intentResult.validationErrors || []), true), actionResult.warnings, true), suggestions: __spreadArray(__spreadArray([], (intentResult.suggestions || []), true), (actionResult.suggestions || []), true) }, (config.debug && apiHealth ? {
                                    debugInfo: {
                                        intentResult: intentResult,
                                        actionResult: actionResult,
                                        apiHealth: apiHealth
                                    }
                                } : {}))];
                    }
                });
            });
        }
    });
    /**
     * Get processing statistics
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "getStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            // This would be implemented with actual tracking
            return {
                totalProcessed: this.processingCount,
                averageConfidence: 0.85, // Placeholder
                successRate: 0.92 // Placeholder
            };
        }
    });
    /**
     * Reset conversation context
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "resetContext", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Resetting global search context', {}, 'global-search-integration');
            }
            // The intent service maintains its own context
            // This could be expanded to reset that context if needed
        }
    });
    /**
     * Test command understanding without execution
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "testCommand", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var intentResult, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.intentService.classifyIntent(query)];
                        case 1:
                            intentResult = _a.sent();
                            return [2 /*return*/, {
                                    intent: intentResult.intent,
                                    confidence: intentResult.confidence,
                                    entities: intentResult.entities,
                                    wouldExecute: intentResult.confidence >= this.defaultConfig.confidenceThreshold,
                                    issues: intentResult.validationErrors
                                }];
                        case 2:
                            error_2 = _a.sent();
                            return [2 /*return*/, {
                                    intent: 'unknown',
                                    confidence: 0,
                                    entities: {},
                                    wouldExecute: false,
                                    issues: [error_2 instanceof Error ? error_2.message : 'Unknown error']
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get available commands and examples
     */
    Object.defineProperty(GlobalSearchIntegrationService.prototype, "getAvailableCommands", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return [
                {
                    intent: 'updateCustomer',
                    description: 'Update customer information (phone, email, address)',
                    examples: [
                        'Update customer John Smith phone to (555) 123-4567',
                        'Set Lisa Nguyen email to lisa@company.com',
                        'Change Mike Johnson address to 123 Main St'
                    ],
                    confidence: 0.9
                },
                {
                    intent: 'viewCustomerDetails',
                    description: 'View detailed customer information',
                    examples: [
                        'Show customer John Smith',
                        'View details for Lisa Nguyen',
                        'Display Mike Johnson information'
                    ],
                    confidence: 0.85
                },
                {
                    intent: 'createCustomer',
                    description: 'Create a new customer account',
                    examples: [
                        'Create customer John Doe at 123 Main St with phone (555) 123-4567',
                        'Add new customer Sarah Smith',
                        'Register customer Mike Wilson'
                    ],
                    confidence: 0.88
                },
                {
                    intent: 'deleteCustomer',
                    description: 'Delete customer account (requires confirmation)',
                    examples: [
                        'Delete customer John Smith',
                        'Remove customer account for Lisa Nguyen',
                        'Cancel account for Mike Johnson'
                    ],
                    confidence: 0.92
                }
            ];
        }
    });
    return GlobalSearchIntegrationService;
}());
// Export singleton instance
exports.globalSearchService = new GlobalSearchIntegrationService();
