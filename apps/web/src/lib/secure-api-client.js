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
exports.secureApiClient = void 0;
var supabase_client_1 = require("@/lib/supabase-client");
var auth_1 = require("@/stores/auth");
var auth_service_1 = require("@/lib/auth-service");
var logger_1 = require("@/utils/logger");
var SecureApiClient = /** @class */ (function () {
    function SecureApiClient() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    }
    /**
     * Get authentication headers with JWT token
     */
    Object.defineProperty(SecureApiClient.prototype, "getAuthHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1, session, backendAuth, error_2;
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
                                logger_1.logger.debug('Backend auth failed, trying to exchange Supabase token', { error: error_1 }, 'secure-api-client');
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
                            _a.trys.push([6, 8, , 9]);
                            // Exchange Supabase token for backend token
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Exchanging Supabase token for backend token', {}, 'secure-api-client');
                            }
                            return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken(session.access_token)];
                        case 7:
                            backendAuth = _a.sent();
                            return [2 /*return*/, {
                                    'Authorization': "Bearer ".concat(backendAuth.token),
                                    'Content-Type': 'application/json',
                                    'x-tenant-id': '7193113e-ece2-4f7b-ae8c-176df4367e28', // Development tenant ID
                                }];
                        case 8:
                            error_2 = _a.sent();
                            logger_1.logger.error('Token exchange failed', error_2, 'secure-api-client');
                            throw new Error('Failed to authenticate with backend. Please login again.');
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Handle API response and errors
     */
    Object.defineProperty(SecureApiClient.prototype, "handleResponse", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var currentPath, errorText;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!response.ok) return [3 /*break*/, 2];
                            if (response.status === 401) {
                                currentPath = window.location.pathname;
                                if (currentPath !== '/login') {
                                    auth_1.useAuthStore.getState().clear();
                                }
                                throw new Error('Authentication failed');
                            }
                            return [4 /*yield*/, response.text()];
                        case 1:
                            errorText = _a.sent();
                            throw new Error("API request failed: ".concat(response.statusText, " - ").concat(errorText));
                        case 2: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    /**
     * Secure GET request with automatic tenant context
     */
    Object.defineProperty(SecureApiClient.prototype, "get", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                    method: 'GET',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    /**
     * Secure POST request with automatic tenant context
     */
    Object.defineProperty(SecureApiClient.prototype, "post", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, data) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, url, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.post', { endpoint: endpoint, data: data }, 'secure-api-client');
                            }
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.post headers', { headers: headers }, 'secure-api-client');
                            }
                            url = "".concat(this.baseUrl).concat(endpoint);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.post full URL', { url: url }, 'secure-api-client');
                            }
                            return [4 /*yield*/, fetch(url, {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify(data),
                                })];
                        case 2:
                            response = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.post response', { status: response.status, headers: Object.fromEntries(response.headers.entries()) }, 'secure-api-client');
                            }
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    /**
     * Secure PUT request with automatic tenant context
     */
    Object.defineProperty(SecureApiClient.prototype, "put", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, data) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, url, response, errorText, responseData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.put', { endpoint: endpoint, data: data, phone: data === null || data === void 0 ? void 0 : data.phone }, 'secure-api-client');
                            }
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.put headers', { headers: headers }, 'secure-api-client');
                            }
                            url = "".concat(this.baseUrl).concat(endpoint);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.put full URL', { url: url }, 'secure-api-client');
                            }
                            return [4 /*yield*/, fetch(url, {
                                    method: 'PUT',
                                    headers: headers,
                                    body: JSON.stringify(data),
                                })];
                        case 2:
                            response = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.put response', { status: response.status, headers: Object.fromEntries(response.headers.entries()) }, 'secure-api-client');
                            }
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.text()];
                        case 3:
                            errorText = _a.sent();
                            throw new Error("API request failed: ".concat(response.statusText, " - ").concat(errorText));
                        case 4: return [4 /*yield*/, response.clone().json()];
                        case 5:
                            responseData = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('secureApiClient.put response data', { responseData: responseData, phone: responseData === null || responseData === void 0 ? void 0 : responseData.phone }, 'secure-api-client');
                            }
                            // Return the response data directly instead of calling handleResponse
                            return [2 /*return*/, responseData];
                    }
                });
            });
        }
    });
    /**
     * Secure DELETE request with automatic tenant context
     */
    Object.defineProperty(SecureApiClient.prototype, "delete", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                    method: 'DELETE',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    // ============================================================================
    // ACCOUNTS API METHODS
    // ============================================================================
    /**
     * Get all accounts for the authenticated user's tenant
     */
    Object.defineProperty(SecureApiClient.prototype, "getAllAccounts", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.get('/v1/accounts')];
                });
            });
        }
    });
    /**
     * Get a specific account by ID
     */
    Object.defineProperty(SecureApiClient.prototype, "getAccountById", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.get("/v1/accounts/".concat(id))];
                });
            });
        }
    });
    /**
     * Create a new account
     */
    Object.defineProperty(SecureApiClient.prototype, "createAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (accountData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.post('/v1/accounts', accountData)];
                });
            });
        }
    });
    /**
     * Update an existing account
     */
    Object.defineProperty(SecureApiClient.prototype, "updateAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, accountData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.put("/v1/accounts/".concat(id), accountData)];
                });
            });
        }
    });
    /**
     * Delete an account
     */
    Object.defineProperty(SecureApiClient.prototype, "deleteAccount", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.delete("/v1/accounts/".concat(id))];
                });
            });
        }
    });
    Object.defineProperty(SecureApiClient.prototype, "accounts", {
        // ============================================================================
        // CONVENIENCE METHODS (for backward compatibility)
        // ============================================================================
        /**
         * Accounts namespace for backward compatibility
         */
        get: function () {
            var _this = this;
            return {
                getAll: function () { return _this.getAllAccounts(); },
                getById: function (id) { return _this.getAccountById(id); },
                create: function (data) { return _this.createAccount(data); },
                update: function (id, data) { return _this.updateAccount(id, data); },
                delete: function (id) { return _this.deleteAccount(id); },
            };
        },
        enumerable: false,
        configurable: true
    });
    return SecureApiClient;
}());
// Create singleton instance
exports.secureApiClient = new SecureApiClient();
