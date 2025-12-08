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
exports.authService = void 0;
var logger_1 = require("@/utils/logger");
// Authentication service for backend API integration
var AuthService = /** @class */ (function () {
    function AuthService() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'verofield_auth'
        });
        // Normalize base URL to ensure it targets versioned API (/api/v1)
        var rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        var trimmed = rawBase.replace(/\/+$/, '');
        // If base already ends with /v{n}, keep it; otherwise append /v1
        this.baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
    }
    /**
     * Login with email and password
     */
    Object.defineProperty(AuthService.prototype, "login", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, fetch("".concat(this.baseUrl, "/auth/login"), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ email: email, password: password }),
                                })];
                        case 1:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            error = _a.sent();
                            throw new Error(error.message || 'Login failed');
                        case 3: return [4 /*yield*/, response.json()];
                        case 4:
                            data = _a.sent();
                            // Store the token
                            localStorage.setItem(this.tokenKey, data.access_token);
                            return [2 /*return*/, {
                                    user: data.user,
                                    token: data.access_token,
                                }];
                        case 5:
                            error_1 = _a.sent();
                            logger_1.logger.error('Login error', error_1, 'auth-service');
                            throw error_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Exchange Supabase token for backend JWT
     */
    Object.defineProperty(AuthService.prototype, "exchangeSupabaseToken", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (supabaseToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error, data, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, fetch("".concat(this.baseUrl, "/auth/exchange-supabase-token"), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ supabaseToken: supabaseToken }),
                                })];
                        case 1:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            error = _a.sent();
                            throw new Error(error.message || 'Token exchange failed');
                        case 3: return [4 /*yield*/, response.json()];
                        case 4:
                            data = _a.sent();
                            // Store the backend token
                            localStorage.setItem(this.tokenKey, JSON.stringify({
                                token: data.access_token,
                                user: data.user,
                                timestamp: Date.now()
                            }));
                            return [2 /*return*/, {
                                    user: data.user,
                                    token: data.access_token,
                                }];
                        case 5:
                            error_2 = _a.sent();
                            logger_1.logger.error('Token exchange error', error_2, 'auth-service');
                            throw error_2;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get stored authentication token
     */
    Object.defineProperty(AuthService.prototype, "getToken", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var authData = localStorage.getItem(this.tokenKey);
            if (!authData)
                return null;
            try {
                var parsed = JSON.parse(authData);
                return parsed.token || null;
            }
            catch (_a) {
                return null;
            }
        }
    });
    /**
     * Check if token is expired
     */
    Object.defineProperty(AuthService.prototype, "isTokenExpired", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (token) {
            try {
                var parts = token.split('.');
                if (parts.length < 2)
                    return true;
                var payload = JSON.parse(atob(parts[1]));
                var currentTime = Math.floor(Date.now() / 1000);
                return payload.exp < currentTime;
            }
            catch (_a) {
                return true; // If we can't parse the token, consider it expired
            }
        }
    });
    /**
     * Refresh the authentication token
     */
    Object.defineProperty(AuthService.prototype, "refreshToken", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var currentToken, response, data, newToken, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 8]);
                            currentToken = this.getToken();
                            if (!currentToken) {
                                throw new Error('No token to refresh');
                            }
                            return [4 /*yield*/, fetch("".concat(this.baseUrl, "/auth/refresh"), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': "Bearer ".concat(currentToken),
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            if (!(response.status === 404)) return [3 /*break*/, 3];
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Refresh endpoint not available, attempting to get new token', {}, 'auth-service');
                            }
                            return [4 /*yield*/, this.getNewToken()];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: throw new Error('Token refresh failed');
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            data = _a.sent();
                            newToken = data.access_token;
                            // Update stored token
                            localStorage.setItem(this.tokenKey, JSON.stringify({
                                token: newToken,
                                user: data.user
                            }));
                            return [2 /*return*/, newToken];
                        case 6:
                            error_3 = _a.sent();
                            logger_1.logger.error('Token refresh error', error_3, 'auth-service');
                            return [4 /*yield*/, this.getNewToken()];
                        case 7: 
                        // If refresh fails, try to get a new token
                        return [2 /*return*/, _a.sent()];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get a new token by re-authenticating with stored credentials
     */
    Object.defineProperty(AuthService.prototype, "getNewToken", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Try to get stored credentials (this would need to be implemented)
                        // For now, we'll return null to force re-login
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('No stored credentials available, user needs to re-login', {}, 'auth-service');
                        }
                        this.logout();
                        return [2 /*return*/, null];
                    }
                    catch (error) {
                        logger_1.logger.error('Failed to get new token', error, 'auth-service');
                        this.logout();
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Check if user is authenticated
     */
    Object.defineProperty(AuthService.prototype, "isAuthenticated", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return !!this.getToken();
        }
    });
    /**
     * Logout and clear stored token
     */
    Object.defineProperty(AuthService.prototype, "logout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            localStorage.removeItem(this.tokenKey);
            // Also clear any other auth-related storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    });
    /**
     * Get authentication headers for API requests
     */
    Object.defineProperty(AuthService.prototype, "getAuthHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, newToken, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = this.getToken();
                            if (!token) {
                                throw new Error('No authentication token found');
                            }
                            if (!this.isTokenExpired(token)) return [3 /*break*/, 4];
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Token expired, attempting refresh', {}, 'auth-service');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.refreshToken()];
                        case 2:
                            newToken = _a.sent();
                            if (newToken) {
                                token = newToken;
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Token refreshed successfully', {}, 'auth-service');
                                }
                            }
                            else {
                                // If refresh fails, try to extend the current token for development
                                if (process.env.NODE_ENV === 'development') {
                                    logger_1.logger.debug('Refresh failed, extending current token for development', {}, 'auth-service');
                                }
                                token = this.extendTokenForDevelopment(token);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Token refresh failed, extending for development', { error: error_4 }, 'auth-service');
                            }
                            token = this.extendTokenForDevelopment(token);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                                'x-tenant-id': '7193113e-ece2-4f7b-ae8c-176df4367e28', // Development tenant ID
                            }];
                    }
                });
            });
        }
    });
    /**
     * Extend token expiration for development purposes
     */
    Object.defineProperty(AuthService.prototype, "extendTokenForDevelopment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (token) {
            try {
                var parts = token.split('.');
                if (parts.length !== 3)
                    return token;
                var payload = JSON.parse(atob(parts[1]));
                // Extend expiration by 24 hours
                payload.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
                // Re-encode the payload (this is just for development)
                var payloadString = JSON.stringify(payload);
                if (!payloadString) {
                    throw new Error('Failed to stringify payload');
                }
                var newPayload = btoa(payloadString);
                var newToken = "".concat(parts[0], ".").concat(newPayload, ".").concat(parts[2]);
                // Update stored token
                localStorage.setItem(this.tokenKey, JSON.stringify({
                    token: newToken,
                    user: payload
                }));
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Token extended for development', {}, 'auth-service');
                }
                return newToken;
            }
            catch (error) {
                logger_1.logger.error('Failed to extend token', error, 'auth-service');
                return token;
            }
        }
    });
    return AuthService;
}());
// Export singleton instance
exports.authService = new AuthService();
exports.default = exports.authService;
