"use strict";
// ============================================================================
// API UTILITIES - Resilient API calls with retry logic
// ============================================================================
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
exports.getAuthToken = void 0;
exports.fetchWithRetry = fetchWithRetry;
exports.apiCall = apiCall;
exports.enhancedApiCall = enhancedApiCall;
var logger_1 = require("@/utils/logger");
var defaultRetryOptions = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    retryCondition: function (error) {
        var _a, _b;
        // Retry on network errors, 5xx server errors, or connection refused
        return (error.name === 'TypeError' || // Network error
            ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('fetch')) ||
            ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('ECONNREFUSED')) ||
            (error.status >= 500 && error.status < 600));
    }
};
var getAuthToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authData, parsed;
    return __generator(this, function (_a) {
        try {
            authData = localStorage.getItem('verofield_auth');
            if (authData) {
                parsed = JSON.parse(authData);
                if (parsed === null || parsed === void 0 ? void 0 : parsed.token) {
                    return [2 /*return*/, parsed.token];
                }
            }
            throw new Error('No auth token found');
        }
        catch (error) {
            logger_1.logger.error('Failed to get auth token', error, 'api-utils');
            throw error;
        }
        return [2 /*return*/];
    });
}); };
exports.getAuthToken = getAuthToken;
function fetchWithRetry(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options, retryOptions) {
        var config, lastError, _loop_1, attempt, state_1;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = __assign(__assign({}, defaultRetryOptions), retryOptions);
                    _loop_1 = function (attempt) {
                        var response, errorMessage, errorDetails, contentType, errorData, text, _e, error, error_1, errorStatus, retryAfter, retrySeconds_1, delay_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _f.trys.push([0, 10, , 14]);
                                    if (process.env.NODE_ENV === 'development') {
                                        logger_1.logger.debug('API call attempt', { attempt: attempt + 1, maxRetries: config.maxRetries + 1, url: url }, 'api-utils');
                                    }
                                    return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { signal: AbortSignal.timeout(10000) }))];
                                case 1:
                                    response = _f.sent();
                                    if (!!response.ok) return [3 /*break*/, 9];
                                    errorMessage = response.statusText;
                                    errorDetails = null;
                                    _f.label = 2;
                                case 2:
                                    _f.trys.push([2, 7, , 8]);
                                    contentType = response.headers.get('content-type');
                                    if (!(contentType && contentType.includes('application/json'))) return [3 /*break*/, 4];
                                    return [4 /*yield*/, response.clone().json()];
                                case 3:
                                    errorData = _f.sent();
                                    // NestJS ValidationPipe format: { statusCode: 400, message: 'Validation failed', errors: [...] }
                                    if (errorData.errors && Array.isArray(errorData.errors)) {
                                        errorDetails = errorData.errors;
                                        errorMessage = errorData.message || errorData.error || errorMessage;
                                    }
                                    else {
                                        errorMessage = errorData.message || errorData.error || errorMessage;
                                        errorDetails = errorData.details || null;
                                    }
                                    return [3 /*break*/, 6];
                                case 4: return [4 /*yield*/, response.clone().text()];
                                case 5:
                                    text = _f.sent();
                                    if (text) {
                                        errorMessage = text;
                                    }
                                    _f.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    _e = _f.sent();
                                    return [3 /*break*/, 8];
                                case 8:
                                    error = new Error("HTTP ".concat(response.status, ": ").concat(errorMessage));
                                    error.status = response.status;
                                    error.response = response;
                                    error.details = errorDetails;
                                    throw error;
                                case 9:
                                    if (process.env.NODE_ENV === 'development') {
                                        logger_1.logger.debug('API call successful', { url: url }, 'api-utils');
                                    }
                                    return [2 /*return*/, { value: response }];
                                case 10:
                                    error_1 = _f.sent();
                                    lastError = error_1;
                                    logger_1.logger.warn('API call failed', { attempt: attempt + 1, error: error_1 }, 'api-utils');
                                    // Don't retry on the last attempt
                                    if (attempt === config.maxRetries) {
                                        return [2 /*return*/, "break"];
                                    }
                                    errorStatus = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) || ((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.status);
                                    if (errorStatus === 400) {
                                        if (process.env.NODE_ENV === 'development') {
                                            logger_1.logger.debug('Not retrying 400 validation error', { error: error_1 }, 'api-utils');
                                        }
                                        return [2 /*return*/, "break"];
                                    }
                                    if (!(errorStatus === 429)) return [3 /*break*/, 12];
                                    retryAfter = (error_1 === null || error_1 === void 0 ? void 0 : error_1.retryAfter) ||
                                        ((_c = (_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.get('Retry-After')) ||
                                        60;
                                    retrySeconds_1 = parseInt(retryAfter.toString(), 10);
                                    if (process.env.NODE_ENV === 'development') {
                                        logger_1.logger.debug("Rate limit hit, waiting ".concat(retrySeconds_1, " seconds before retry"), { error: error_1 }, 'api-utils');
                                    }
                                    // Wait for the specified retry-after period
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retrySeconds_1 * 1000); })];
                                case 11:
                                    // Wait for the specified retry-after period
                                    _f.sent();
                                    return [2 /*return*/, "continue"];
                                case 12:
                                    if (!config.retryCondition(error_1)) {
                                        if (process.env.NODE_ENV === 'development') {
                                            logger_1.logger.debug('Not retrying due to error type', { error: error_1 }, 'api-utils');
                                        }
                                        return [2 /*return*/, "break"];
                                    }
                                    delay_1 = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
                                    if (process.env.NODE_ENV === 'development') {
                                        logger_1.logger.debug('Retrying', { delay: delay_1 }, 'api-utils');
                                    }
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                case 13:
                                    _f.sent();
                                    return [3 /*break*/, 14];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _d.label = 1;
                case 1:
                    if (!(attempt <= config.maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 2:
                    state_1 = _d.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    _d.label = 3;
                case 3:
                    attempt++;
                    return [3 /*break*/, 1];
                case 4:
                    // If we get here, all retries failed
                    logger_1.logger.error('All retry attempts failed', { url: url, error: lastError }, 'api-utils');
                    throw lastError;
            }
        });
    });
}
function apiCall(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options, retryOptions) {
        var response, data, error_2;
        if (options === void 0) { options = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchWithRetry(url, options, retryOptions)];
                case 1:
                    response = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to parse JSON response', { url: url, error: error_2 }, 'api-utils');
                    throw new Error("Invalid JSON response from ".concat(url));
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Enhanced API call with better error handling
function enhancedApiCall(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options, retryOptions) {
        var error_3, err, message, status_1, errorMessage, retryAfter, category, limit, resetTime, retrySeconds, retryMinutes, errorMessage, rateLimitError;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (options === void 0) { options = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiCall(url, options, retryOptions)];
                case 1: return [2 /*return*/, _j.sent()];
                case 2:
                    error_3 = _j.sent();
                    logger_1.logger.error('Enhanced API call failed', { url: url, error: error_3 }, 'api-utils');
                    err = error_3;
                    message = typeof (err === null || err === void 0 ? void 0 : err.message) === 'string' ? err.message : '';
                    status_1 = typeof (err === null || err === void 0 ? void 0 : err.status) === 'number' ? err.status : undefined;
                    // Provide more specific error messages
                    if (message.includes('fetch')) {
                        throw new Error('Network connection failed. Please check your internet connection and try again.');
                    }
                    else if (message.includes('ECONNREFUSED')) {
                        throw new Error('Backend server is not running. Please start the backend server.');
                    }
                    else if (status_1 === 401) {
                        throw new Error('Authentication failed. Please log in again.');
                    }
                    else if (status_1 === 403) {
                        throw new Error('Access denied. You do not have permission to perform this action.');
                    }
                    else if (status_1 === 404) {
                        errorMessage = message || '';
                        if (errorMessage.includes('Cannot') || errorMessage.includes('GET') || errorMessage.includes('PUT')) {
                            throw new Error('Endpoint not found. This may indicate an authentication issue. Please try logging in again.');
                        }
                        else {
                            throw new Error('Resource not found. The requested data may have been deleted.');
                        }
                    }
                    else if (status_1 === 429) {
                        retryAfter = ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.get('Retry-After')) ||
                            err.retryAfter ||
                            '60';
                        category = ((_d = (_c = err.response) === null || _c === void 0 ? void 0 : _c.headers) === null || _d === void 0 ? void 0 : _d.get('X-RateLimit-Category')) || 'operations';
                        limit = ((_f = (_e = err.response) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f.get('X-RateLimit-Limit')) || 'unknown';
                        resetTime = (_h = (_g = err.response) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.get('X-RateLimit-Reset');
                        retrySeconds = parseInt(retryAfter, 10);
                        retryMinutes = Math.ceil(retrySeconds / 60);
                        errorMessage = "Rate limit exceeded for ".concat(category, " operations (limit: ").concat(limit, "/min). Please wait ").concat(retryMinutes, " minute").concat(retryMinutes > 1 ? 's' : '', " before trying again.");
                        rateLimitError = new Error(errorMessage);
                        rateLimitError.status = 429;
                        rateLimitError.retryAfter = retrySeconds;
                        rateLimitError.category = category;
                        rateLimitError.resetTime = resetTime;
                        rateLimitError.isRateLimit = true;
                        throw rateLimitError;
                    }
                    else if (status_1 !== undefined && status_1 >= 500) {
                        throw new Error('Server error. Please try again later or contact support.');
                    }
                    else {
                        throw error_3 instanceof Error ? error_3 : new Error('Unknown API error');
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
