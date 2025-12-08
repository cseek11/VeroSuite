"use strict";
// ============================================================================
// ENHANCED INTENT CLASSIFICATION SERVICE
// ============================================================================
// Robust intent detection with context awareness, validation, and reliability
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
exports.EnhancedIntentClassificationService = void 0;
var logger_1 = require("@/utils/logger");
var EnhancedIntentClassificationService = /** @class */ (function () {
    function EnhancedIntentClassificationService() {
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                sessionId: crypto.randomUUID(),
                timestamp: new Date()
            }
        });
        // Enhanced pattern system with priority and context
        Object.defineProperty(this, "intentMatcher", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                updateCustomer: {
                    primary: [
                        {
                            pattern: /^update\s+customer\s+([^,]+?)\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
                            confidence: 0.95,
                            groups: { customer: 1, field: 2, value: 3 }
                        },
                        {
                            pattern: /^(?:set|change|modify)\s+([^,]+?)\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
                            confidence: 0.9,
                            groups: { customer: 1, field: 2, value: 3 }
                        }
                    ],
                    secondary: [
                        {
                            pattern: /^([^,]+?)\s+(phone|email|address|name)\s+(?:is|should be|will be)\s+(.+)$/i,
                            confidence: 0.8,
                            groups: { customer: 1, field: 2, value: 3 }
                        }
                    ],
                    contextual: [
                        {
                            pattern: /^update\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
                            confidence: 0.7,
                            requiresContext: 'lastCustomer',
                            groups: { field: 1, value: 2 }
                        }
                    ]
                }
            }
        });
        // Enhanced entity validators
        Object.defineProperty(this, "entityValidators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                phone: {
                    patterns: [
                        { regex: /^\+1[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:\s?(?:ext|x|extension)\.?\s?(\d+))?$/i, confidence: 0.95 },
                        { regex: /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:\s?(?:ext|x|extension)\.?\s?(\d+))?$/i, confidence: 0.9 },
                        { regex: /^(\d{3})[-.]?(\d{3})[-.]?(\d{4})$/i, confidence: 0.85 },
                        { regex: /^(\d{10})$/i, confidence: 0.8 }
                    ],
                    format: function (phone) {
                        var digits = phone.replace(/\D/g, '');
                        if (digits.length === 10) {
                            return "(".concat(digits.slice(0, 3), ") ").concat(digits.slice(3, 6), "-").concat(digits.slice(6));
                        }
                        return phone;
                    },
                    validate: function (phone) {
                        var digits = phone.replace(/\D/g, '');
                        var issues = [];
                        if (digits.length < 10)
                            issues.push('Phone number too short');
                        if (digits.length > 11)
                            issues.push('Phone number too long');
                        if (digits.startsWith('0') || digits.startsWith('1'))
                            issues.push('Invalid area code');
                        return {
                            isValid: issues.length === 0,
                            confidence: issues.length === 0 ? 0.9 : 0.3,
                            issues: issues,
                            suggestions: issues.length > 0 ? ['Please provide a 10-digit phone number'] : []
                        };
                    }
                },
                email: {
                    patterns: [
                        { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, confidence: 0.95 }
                    ],
                    validate: function (email) {
                        var issues = [];
                        if (!email.includes('@'))
                            issues.push('Missing @ symbol');
                        if (!email.includes('.'))
                            issues.push('Missing domain extension');
                        if (email.length < 5)
                            issues.push('Email too short');
                        if (email.length > 100)
                            issues.push('Email too long');
                        return {
                            isValid: issues.length === 0,
                            confidence: issues.length === 0 ? 0.9 : 0.2,
                            issues: issues,
                            suggestions: issues.length > 0 ? ['Please provide a valid email address'] : []
                        };
                    }
                },
                customerName: {
                    validate: function (name) {
                        var issues = [];
                        var parts = name.trim().split(/\s+/);
                        if (parts.length < 2)
                            issues.push('Name should include first and last name');
                        if (name.length < 2)
                            issues.push('Name too short');
                        if (!/^[a-zA-Z\s'-]+$/.test(name))
                            issues.push('Name contains invalid characters');
                        return {
                            isValid: issues.length === 0,
                            confidence: issues.length === 0 ? 0.9 : 0.4,
                            issues: issues,
                            suggestions: issues.length > 0 ? ['Please provide full name (first and last)'] : []
                        };
                    }
                }
            }
        });
    }
    /**
     * Enhanced intent classification with context and validation
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "classifyIntent", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedQuery, validationErrors, intentMatch, entities, _i, _a, _b, key, value, overallConfidence, suggestions, error_1, errorMessage;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalizedQuery = this.normalizeQuery(query);
                            validationErrors = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            intentMatch = this.detectIntentWithContext(normalizedQuery);
                            return [4 /*yield*/, this.extractAndValidateEntities(normalizedQuery, intentMatch.intent)];
                        case 2:
                            entities = _c.sent();
                            // 3. Validation
                            entities.validation = {};
                            for (_i = 0, _a = Object.entries(entities); _i < _a.length; _i++) {
                                _b = _a[_i], key = _b[0], value = _b[1];
                                if (key !== 'validation' && value && this.entityValidators[key]) {
                                    entities.validation[key] = this.entityValidators[key].validate(value);
                                }
                            }
                            overallConfidence = this.calculateOverallConfidence(intentMatch, entities);
                            suggestions = this.generateSuggestions(entities, validationErrors);
                            // 6. Update Context
                            this.updateContext(intentMatch.intent, entities);
                            return [2 /*return*/, {
                                    intent: intentMatch.intent,
                                    confidence: overallConfidence,
                                    entities: entities,
                                    originalQuery: query,
                                    processedQuery: normalizedQuery,
                                    validationErrors: validationErrors,
                                    suggestions: suggestions,
                                    context: __assign({}, this.context)
                                }];
                        case 3:
                            error_1 = _c.sent();
                            logger_1.logger.error('Intent classification failed', error_1, 'enhanced-intent-service');
                            errorMessage = error_1 instanceof Error ? error_1.message : 'Unknown error';
                            return [2 /*return*/, {
                                    intent: 'search',
                                    confidence: 0.1,
                                    entities: { validation: {} },
                                    originalQuery: query,
                                    processedQuery: normalizedQuery,
                                    validationErrors: ["Classification failed: ".concat(errorMessage)],
                                    suggestions: ['Please try rephrasing your command'],
                                    context: __assign({}, this.context)
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Detect intent with context awareness
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "detectIntentWithContext", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            // Try primary patterns first
            for (var _i = 0, _a = Object.entries(this.intentMatcher); _i < _a.length; _i++) {
                var _b = _a[_i], intent = _b[0], matchers = _b[1];
                for (var _c = 0, _d = matchers.primary || []; _c < _d.length; _c++) {
                    var pattern = _d[_c];
                    var match = query.match(pattern.pattern);
                    if (match) {
                        return { intent: intent, confidence: pattern.confidence, match: match };
                    }
                }
            }
            // Try secondary patterns
            for (var _e = 0, _f = Object.entries(this.intentMatcher); _e < _f.length; _e++) {
                var _g = _f[_e], intent = _g[0], matchers = _g[1];
                for (var _h = 0, _j = matchers.secondary || []; _h < _j.length; _h++) {
                    var pattern = _j[_h];
                    var match = query.match(pattern.pattern);
                    if (match) {
                        return { intent: intent, confidence: pattern.confidence, match: match };
                    }
                }
            }
            // Try contextual patterns if context is available
            for (var _k = 0, _l = Object.entries(this.intentMatcher); _k < _l.length; _k++) {
                var _m = _l[_k], intent = _m[0], matchers = _m[1];
                for (var _o = 0, _p = matchers.contextual || []; _o < _p.length; _o++) {
                    var pattern = _p[_o];
                    if (pattern.requiresContext && this.context[pattern.requiresContext]) {
                        var match = query.match(pattern.pattern);
                        if (match) {
                            return { intent: intent, confidence: pattern.confidence, match: match };
                        }
                    }
                }
            }
            // Default to search
            return { intent: 'search', confidence: 0.5 };
        }
    });
    /**
     * Extract and validate entities with context
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "extractAndValidateEntities", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, intent) {
            return __awaiter(this, void 0, void 0, function () {
                var entities, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            entities = { validation: {} };
                            _a = intent;
                            switch (_a) {
                                case 'updateCustomer': return [3 /*break*/, 1];
                            }
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.extractUpdateCustomerEntities(query, entities)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.extractGenericEntities(query, entities)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, entities];
                    }
                });
            });
        }
    });
    /**
     * Extract entities for customer update commands
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "extractUpdateCustomerEntities", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query, entities) {
            return __awaiter(this, void 0, void 0, function () {
                var updatePatterns, _i, updatePatterns_1, pattern, match, phoneMatch, emailMatch;
                return __generator(this, function (_a) {
                    updatePatterns = [
                        /update\s+customer\s+([^,]+?)\s+(?:phone|email|address|name)/i,
                        /(?:set|change|modify)\s+([^,]+?)\s+(?:phone|email|address|name)/i,
                        /([^,]+?)\s+(?:phone|email|address|name)\s+(?:is|should be|will be)/i
                    ];
                    for (_i = 0, updatePatterns_1 = updatePatterns; _i < updatePatterns_1.length; _i++) {
                        pattern = updatePatterns_1[_i];
                        match = query.match(pattern);
                        if (match && match[1]) {
                            entities.customerName = this.formatName(match[1].trim());
                            break;
                        }
                    }
                    // If no customer name found, check context
                    if (!entities.customerName && this.context.lastCustomer) {
                        entities.customerName = this.context.lastCustomer;
                    }
                    phoneMatch = query.match(/(?:phone|call|contact).*?(?:to|is|=)\s*([+\d\s\-\(\)\.x]+)/i);
                    if (phoneMatch && phoneMatch[1]) {
                        entities.phone = this.entityValidators.phone.format(phoneMatch[1].trim());
                    }
                    emailMatch = query.match(/email.*?(?:to|is|=)\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
                    if (emailMatch && emailMatch[1]) {
                        entities.email = emailMatch[1].trim();
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Calculate overall confidence based on intent match and entity validation
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "calculateOverallConfidence", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentMatch, entities) {
            var entityConfidence = 0;
            var validEntityCount = 0;
            for (var _i = 0, _a = Object.values(entities.validation); _i < _a.length; _i++) {
                var validation = _a[_i];
                if ((validation === null || validation === void 0 ? void 0 : validation.confidence) !== undefined) {
                    entityConfidence += validation.confidence;
                    validEntityCount++;
                }
            }
            var avgEntityConfidence = validEntityCount > 0 ? entityConfidence / validEntityCount : 0.5;
            return (intentMatch.confidence * 0.7) + (avgEntityConfidence * 0.3);
        }
    });
    /**
     * Generate helpful suggestions based on validation results
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "generateSuggestions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (entities, errors) {
            var suggestions = [];
            for (var _i = 0, _a = Object.values(entities.validation); _i < _a.length; _i++) {
                var validation = _a[_i];
                if (!validation.isValid && validation.suggestions) {
                    suggestions.push.apply(suggestions, validation.suggestions);
                }
            }
            if (suggestions.length === 0 && errors.length > 0) {
                suggestions.push('Please try rephrasing your command with more specific information');
            }
            return __spreadArray([], new Set(suggestions), true); // Remove duplicates
        }
    });
    /**
     * Update conversation context
     */
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "updateContext", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intent, entities) {
            this.context.lastIntent = intent;
            this.context.timestamp = new Date();
            if (entities.customerName) {
                this.context.lastCustomer = entities.customerName;
            }
        }
    });
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "normalizeQuery", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return query.trim().toLowerCase();
        }
    });
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "formatName", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (name) {
            return name.split(' ').map(function (part) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }).join(' ');
        }
    });
    Object.defineProperty(EnhancedIntentClassificationService.prototype, "extractGenericEntities", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_query, _entities) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Implement generic entity extraction for other intents
                    // This is a placeholder for the existing logic
                    return [2 /*return*/];
                });
            });
        }
    });
    return EnhancedIntentClassificationService;
}());
exports.EnhancedIntentClassificationService = EnhancedIntentClassificationService;
