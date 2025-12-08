"use strict";
// ============================================================================
// ROBUST API CLIENT
// ============================================================================
// Enhanced API client with retry logic, validation, and error recovery
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
exports.robustApiClient = void 0;
var supabase_client_1 = require("@/lib/supabase-client");
var auth_service_1 = require("@/lib/auth-service");
var logger_1 = require("@/utils/logger");
var RobustApiClient = /** @class */ (function () {
    function RobustApiClient() {
        var _this = this;
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "defaultRetryConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                maxRetries: 3,
                baseDelay: 1000,
                maxDelay: 10000,
                backoffFactor: 2,
                retryCondition: function (error) {
                    // Retry on network errors and 5xx status codes
                    return !error.status || error.status >= 500 || error.name === 'NetworkError';
                }
            }
        });
        Object.defineProperty(this, "defaultCacheConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                enabled: true,
                ttl: 5 * 60 * 1000, // 5 minutes
                maxSize: 100
            }
        });
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        // Clean cache periodically
        setInterval(function () { return _this.cleanCache(); }, 60000); // Every minute
    }
    /**
     * Get authentication headers with retry on auth failure
     */
    Object.defineProperty(RobustApiClient.prototype, "getAuthHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (retryCount) {
                var error_1, session, backendAuth, error_2;
                if (retryCount === void 0) { retryCount = 0; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            if (!auth_service_1.authService.isAuthenticated()) return [3 /*break*/, 2];
                            return [4 /*yield*/, auth_service_1.authService.getAuthHeaders()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Backend auth failed, attempting token exchange', { error: error_1 }, 'robust-api-client');
                            }
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, supabase_client_1.supabase.auth.getSession()];
                        case 5:
                            session = (_a.sent()).data.session;
                            if (!(session === null || session === void 0 ? void 0 : session.access_token)) {
                                throw new Error('No valid session found. Please login first.');
                            }
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 11]);
                            return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken(session.access_token)];
                        case 7:
                            backendAuth = _a.sent();
                            return [2 /*return*/, {
                                    'Authorization': "Bearer ".concat(backendAuth.token),
                                    'Content-Type': 'application/json',
                                }];
                        case 8:
                            error_2 = _a.sent();
                            if (!(retryCount < 2)) return [3 /*break*/, 10];
                            // Retry token exchange once
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 9:
                            // Retry token exchange once
                            _a.sent();
                            return [2 /*return*/, this.getAuthHeaders(retryCount + 1)];
                        case 10:
                            logger_1.logger.error('Token exchange failed after retries', { error: error_2 }, 'robust-api-client');
                            throw new Error('Failed to authenticate with backend. Please login again.');
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute API request with retry logic and validation
     */
    Object.defineProperty(RobustApiClient.prototype, "executeWithRetry", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (requestFn_1) {
            return __awaiter(this, arguments, void 0, function (requestFn, config) {
                var retryConfig, startTime, lastError, _loop_1, this_1, attempt, state_1, duration;
                if (config === void 0) { config = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            retryConfig = __assign(__assign({}, this.defaultRetryConfig), config);
                            startTime = Date.now();
                            _loop_1 = function (attempt) {
                                var response, duration_1, data, errorText, error, delay_1, error_3, delay_2;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 8, , 11]);
                                            if (process.env.NODE_ENV === 'development') {
                                                logger_1.logger.debug('API request attempt', { attempt: attempt + 1, maxRetries: retryConfig.maxRetries + 1 }, 'robust-api-client');
                                            }
                                            return [4 /*yield*/, requestFn()];
                                        case 1:
                                            response = _b.sent();
                                            duration_1 = Date.now() - startTime;
                                            if (!response.ok) return [3 /*break*/, 3];
                                            return [4 /*yield*/, response.json()];
                                        case 2:
                                            data = _b.sent();
                                            return [2 /*return*/, { value: {
                                                        data: data,
                                                        success: true,
                                                        retries: attempt,
                                                        duration: duration_1,
                                                        warnings: this_1.validateResponseData(data)
                                                    } }];
                                        case 3: return [4 /*yield*/, response.text()];
                                        case 4:
                                            errorText = _b.sent();
                                            error = new Error("HTTP ".concat(response.status, ": ").concat(response.statusText, " - ").concat(errorText));
                                            error.status = response.status;
                                            if (!(attempt < retryConfig.maxRetries && retryConfig.retryCondition(error))) return [3 /*break*/, 6];
                                            delay_1 = Math.min(retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt), retryConfig.maxDelay);
                                            if (process.env.NODE_ENV === 'development') {
                                                logger_1.logger.debug('Retrying after delay', { delay: delay_1, error: error.message }, 'robust-api-client');
                                            }
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                        case 5:
                                            _b.sent();
                                            return [2 /*return*/, "continue"];
                                        case 6:
                                            lastError = error;
                                            return [2 /*return*/, "break"];
                                        case 7: return [3 /*break*/, 11];
                                        case 8:
                                            error_3 = _b.sent();
                                            lastError = error_3;
                                            if (!(attempt < retryConfig.maxRetries && retryConfig.retryCondition(error_3))) return [3 /*break*/, 10];
                                            delay_2 = Math.min(retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt), retryConfig.maxDelay);
                                            if (process.env.NODE_ENV === 'development') {
                                                logger_1.logger.debug('Retrying after delay', { delay: delay_2, error: error_3.message }, 'robust-api-client');
                                            }
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_2); })];
                                        case 9:
                                            _b.sent();
                                            return [2 /*return*/, "continue"];
                                        case 10: return [2 /*return*/, "break"];
                                        case 11: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            attempt = 0;
                            _a.label = 1;
                        case 1:
                            if (!(attempt <= retryConfig.maxRetries)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_1(attempt)];
                        case 2:
                            state_1 = _a.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            if (state_1 === "break")
                                return [3 /*break*/, 4];
                            _a.label = 3;
                        case 3:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 4:
                            duration = Date.now() - startTime;
                            return [2 /*return*/, {
                                    success: false,
                                    error: lastError instanceof Error ? lastError.message : 'Unknown error',
                                    retries: retryConfig.maxRetries,
                                    duration: duration
                                }];
                    }
                });
            });
        }
    });
    /**
     * Validate response data structure
     */
    Object.defineProperty(RobustApiClient.prototype, "validateResponseData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            var warnings = [];
            if (data === null) {
                warnings.push('Response data is null');
            }
            else if (Array.isArray(data) && data.length === 0) {
                warnings.push('Response data is an empty array');
            }
            else if (typeof data === 'object' && Object.keys(data).length === 0) {
                warnings.push('Response data is an empty object');
            }
            return warnings;
        }
    });
    /**
     * Get from cache or make request
     */
    Object.defineProperty(RobustApiClient.prototype, "getFromCacheOrRequest", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cacheKey_1, requestFn_1) {
            return __awaiter(this, arguments, void 0, function (cacheKey, requestFn, cacheConfig) {
                var config, cached, response, error_4;
                if (cacheConfig === void 0) { cacheConfig = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = __assign(__assign({}, this.defaultCacheConfig), cacheConfig);
                            if (config.enabled) {
                                cached = this.cache.get(cacheKey);
                                if (cached && Date.now() - cached.timestamp < cached.ttl) {
                                    if (process.env.NODE_ENV === 'development') {
                                        logger_1.logger.debug('Cache hit', { cacheKey: cacheKey }, 'robust-api-client');
                                    }
                                    return [2 /*return*/, {
                                            data: cached.data,
                                            success: true,
                                            retries: 0,
                                            duration: 0,
                                            cached: true
                                        }];
                                }
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, requestFn()];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            logger_1.logger.error('Request failed before retry handling', { error: error_4, cacheKey: cacheKey }, 'robust-api-client');
                            return [2 /*return*/, {
                                    success: false,
                                    retries: 0,
                                    duration: 0,
                                    error: error_4 instanceof Error ? error_4.message : String(error_4),
                                }];
                        case 4:
                            // Cache successful responses
                            if (response.success && config.enabled && response.data) {
                                this.setCache(cacheKey, response.data, config.ttl);
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        }
    });
    /**
     * Set cache with size limit
     */
    Object.defineProperty(RobustApiClient.prototype, "setCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (key, data, ttl) {
            // Remove oldest entries if cache is full
            if (this.cache.size >= this.defaultCacheConfig.maxSize) {
                var oldest = this.cache.keys().next();
                if (!oldest.done) {
                    this.cache.delete(oldest.value);
                }
            }
            this.cache.set(key, {
                data: data,
                timestamp: Date.now(),
                ttl: ttl
            });
        }
    });
    /**
     * Clean expired cache entries
     */
    Object.defineProperty(RobustApiClient.prototype, "cleanCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var now = Date.now();
            for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], entry = _b[1];
                if (now - entry.timestamp > entry.ttl) {
                    this.cache.delete(key);
                }
            }
        }
    });
    /**
     * Robust GET request
     */
    Object.defineProperty(RobustApiClient.prototype, "get", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, config) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey;
                var _this = this;
                return __generator(this, function (_a) {
                    cacheKey = "GET:".concat(endpoint);
                    return [2 /*return*/, this.getFromCacheOrRequest(cacheKey, function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var headers;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.getAuthHeaders()];
                                                case 1:
                                                    headers = _a.sent();
                                                    return [2 /*return*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                                            method: 'GET',
                                                            headers: headers,
                                                        })];
                                            }
                                        });
                                    }); }, config === null || config === void 0 ? void 0 : config.retry)];
                            });
                        }); }, config === null || config === void 0 ? void 0 : config.cache)];
                });
            });
        }
    });
    /**
     * Robust POST request
     */
    Object.defineProperty(RobustApiClient.prototype, "post", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('RobustApiClient.post', { endpoint: endpoint, data: data }, 'robust-api-client');
                    }
                    return [2 /*return*/, this.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                            var headers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getAuthHeaders()];
                                    case 1:
                                        headers = _a.sent();
                                        return [2 /*return*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                                method: 'POST',
                                                headers: headers,
                                                body: JSON.stringify(data),
                                            })];
                                }
                            });
                        }); }, config === null || config === void 0 ? void 0 : config.retry)];
                });
            });
        }
    });
    /**
     * Robust PUT request with response validation
     */
    Object.defineProperty(RobustApiClient.prototype, "put", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var result, validation;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('RobustApiClient.put', { endpoint: endpoint, data: data }, 'robust-api-client');
                            }
                            // Clear relevant cache entries
                            this.invalidateCache(endpoint);
                            return [4 /*yield*/, this.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var headers;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getAuthHeaders()];
                                            case 1:
                                                headers = _a.sent();
                                                return [2 /*return*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                                        method: 'PUT',
                                                        headers: headers,
                                                        body: JSON.stringify(data),
                                                    })];
                                        }
                                    });
                                }); }, config === null || config === void 0 ? void 0 : config.retry)];
                        case 1:
                            result = _a.sent();
                            // Validate update result
                            if (result.success && result.data) {
                                validation = this.validateUpdateResult(data, result.data);
                                if (validation.warnings.length > 0) {
                                    result.warnings = __spreadArray(__spreadArray([], (result.warnings || []), true), validation.warnings, true);
                                }
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        }
    });
    /**
     * Validate update operation result
     */
    Object.defineProperty(RobustApiClient.prototype, "validateUpdateResult", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (sentData, returnedData) {
            var warnings = [];
            // Check if returned data contains the updates we sent
            for (var _i = 0, _a = Object.entries(sentData); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (returnedData[key] === undefined) {
                    warnings.push("Field '".concat(key, "' not returned in response"));
                }
                else if (returnedData[key] !== value) {
                    warnings.push("Field '".concat(key, "' value mismatch: sent '").concat(value, "', received '").concat(returnedData[key], "'"));
                }
            }
            return { warnings: warnings };
        }
    });
    /**
     * Robust DELETE request
     */
    Object.defineProperty(RobustApiClient.prototype, "delete", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, config) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // Clear relevant cache entries
                    this.invalidateCache(endpoint);
                    return [2 /*return*/, this.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                            var headers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getAuthHeaders()];
                                    case 1:
                                        headers = _a.sent();
                                        return [2 /*return*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                                method: 'DELETE',
                                                headers: headers,
                                            })];
                                }
                            });
                        }); }, config === null || config === void 0 ? void 0 : config.retry)];
                });
            });
        }
    });
    /**
     * Invalidate cache entries matching pattern
     */
    Object.defineProperty(RobustApiClient.prototype, "invalidateCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint) {
            var pattern = endpoint.split('/')[1]; // Extract resource type
            if (!pattern)
                return;
            for (var _i = 0, _a = this.cache.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        }
    });
    /**
     * High-level methods with built-in error handling
     */
    Object.defineProperty(RobustApiClient.prototype, "getAllAccounts", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get('/accounts')];
                        case 1:
                            response = _a.sent();
                            if (!response.success) {
                                logger_1.logger.error('Failed to get accounts', { error: response.error }, 'robust-api-client');
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, response.data || []];
                    }
                });
            });
        }
    });
    Object.defineProperty(RobustApiClient.prototype, "updateAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.put("/accounts/".concat(id), data)];
                        case 1:
                            response = _a.sent();
                            if (!response.success) {
                                throw new Error("Failed to update account: ".concat(response.error));
                            }
                            return [2 /*return*/, response.data];
                    }
                });
            });
        }
    });
    Object.defineProperty(RobustApiClient.prototype, "createAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.post('/accounts', data)];
                        case 1:
                            response = _a.sent();
                            if (!response.success) {
                                throw new Error("Failed to create account: ".concat(response.error));
                            }
                            return [2 /*return*/, response.data];
                    }
                });
            });
        }
    });
    Object.defineProperty(RobustApiClient.prototype, "deleteAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.delete("/accounts/".concat(id))];
                        case 1:
                            response = _a.sent();
                            if (!response.success) {
                                throw new Error("Failed to delete account: ".concat(response.error));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Health check for API connectivity
     */
    Object.defineProperty(RobustApiClient.prototype, "healthCheck", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, response, latency, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            startTime = Date.now();
                            return [4 /*yield*/, this.get('/health', {
                                    retry: { maxRetries: 1 },
                                    cache: { enabled: false }
                                })];
                        case 1:
                            response = _a.sent();
                            latency = Date.now() - startTime;
                            return [2 /*return*/, {
                                    healthy: response.success,
                                    latency: latency
                                }];
                        case 2:
                            error_5 = _a.sent();
                            return [2 /*return*/, {
                                    healthy: false,
                                    latency: -1
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    return RobustApiClient;
}());
exports.robustApiClient = new RobustApiClient();
