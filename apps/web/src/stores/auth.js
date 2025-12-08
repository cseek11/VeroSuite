"use strict";
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
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
var logger_1 = require("@/utils/logger");
var supabase_client_1 = require("@/lib/supabase-client");
function loadPersisted() {
    try {
        var raw = localStorage.getItem('verofield_auth');
        if (!raw)
            return { token: null, tenantId: null, user: null, isAuthenticated: null };
        var parsed = JSON.parse(raw);
        // Validate that we have both token and user
        if (!parsed.token || !parsed.user) {
            return { token: null, tenantId: null, user: null, isAuthenticated: null };
        }
        return __assign(__assign({}, parsed), { isAuthenticated: true });
    }
    catch (_a) {
        return { token: null, tenantId: null, user: null, isAuthenticated: null };
    }
}
exports.useAuthStore = (0, zustand_1.create)(function (set, get) { return (__assign(__assign({}, loadPersisted()), { setAuth: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var tenantId;
        var _c;
        var token = _b.token, user = _b.user;
        return __generator(this, function (_d) {
            // Validate required fields
            if (!token || !user) {
                logger_1.logger.error('setAuth: Missing required fields', new Error('Token or user missing'), 'auth-store');
                return [2 /*return*/];
            }
            // Get tenant ID from JWT token (already validated by backend)
            try {
                tenantId = user.tenant_id;
                if (!tenantId) {
                    logger_1.logger.error('No tenant ID found in user data', new Error('No tenant ID found in user data'), 'auth-store');
                    throw new Error('No tenant ID found in user data');
                }
                logger_1.logger.debug('User tenant ID resolved from JWT token', { tenantId: tenantId }, 'auth-store');
                logger_1.logger.debug('User permissions on login', {
                    hasPermissions: !!user.permissions,
                    permissionsCount: ((_c = user.permissions) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    permissions: user.permissions
                }, 'auth-store');
                // Store auth data with tenant ID from JWT
                localStorage.setItem('verofield_auth', JSON.stringify({ token: token, tenantId: tenantId, user: user }));
                set({ token: token, tenantId: tenantId, user: user, isAuthenticated: true });
            }
            catch (error) {
                logger_1.logger.error('Error setting auth data', error, 'auth-store');
                throw new Error("Login failed: ".concat(error instanceof Error ? error.message : 'Unknown error'));
            }
            return [2 /*return*/];
        });
    }); }, clear: function () {
        // Clear all possible auth storage
        localStorage.removeItem('verofield_auth');
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        // Clear Supabase-specific storage
        var supabaseKeys = Object.keys(localStorage).filter(function (key) {
            return key.includes('supabase') || key.includes('sb-');
        });
        supabaseKeys.forEach(function (key) { return localStorage.removeItem(key); });
        // Clear session storage
        sessionStorage.clear();
        // Clear state
        set({ token: null, tenantId: null, user: null, isAuthenticated: null });
        logger_1.logger.info('Auth store cleared completely', {}, 'auth-store');
    }, forceLogout: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, allKeys, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Sign out from Supabase
                    return [4 /*yield*/, supabase_client_1.supabase.auth.signOut()];
                case 1:
                    // Sign out from Supabase
                    _a.sent();
                    logger_1.logger.debug('Supabase auth signed out', {}, 'auth-store');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error('Error signing out from Supabase', error_1, 'auth-store');
                    return [3 /*break*/, 3];
                case 3:
                    // Clear local storage and state
                    get().clear();
                    allKeys = Object.keys(localStorage);
                    allKeys.forEach(function (key) {
                        if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
                            localStorage.removeItem(key);
                            logger_1.logger.debug('Removed auth-related storage key', { key: key }, 'auth-store');
                        }
                    });
                    // Clear session storage completely
                    sessionStorage.clear();
                    // Clear cookies (if any)
                    document.cookie.split(";").forEach(function (c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    // Force clear any remaining Supabase session
                    return [4 /*yield*/, supabase_client_1.supabase.auth.signOut()];
                case 5:
                    // Force clear any remaining Supabase session
                    _a.sent();
                    logger_1.logger.debug('Supabase session cleared', {}, 'auth-store');
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    logger_1.logger.error('Error clearing session', error_2, 'auth-store');
                    return [3 /*break*/, 7];
                case 7:
                    logger_1.logger.info('Complete cleanup done', {}, 'auth-store');
                    // Force page reload to clear any remaining state
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    }); }, nuclearLogout: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.warn('NUCLEAR LOGOUT - Complete system reset', {}, 'auth-store');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Sign out from Supabase
                    return [4 /*yield*/, supabase_client_1.supabase.auth.signOut()];
                case 2:
                    // Sign out from Supabase
                    _a.sent();
                    logger_1.logger.debug('Supabase auth signed out', {}, 'auth-store');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Error signing out from Supabase', error_3, 'auth-store');
                    return [3 /*break*/, 4];
                case 4:
                    // Clear ALL storage without exceptions
                    localStorage.clear();
                    sessionStorage.clear();
                    // Clear all cookies
                    document.cookie.split(";").forEach(function (c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    // Clear state
                    set({ token: null, tenantId: null, user: null, isAuthenticated: null });
                    logger_1.logger.info('Nuclear cleanup complete - redirecting to login', {}, 'auth-store');
                    // Redirect to login page instead of reload
                    window.location.href = '/login';
                    return [2 /*return*/];
            }
        });
    }); }, validateTenantAccess: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, tenantId, currentTenantId, _b, validTenantId, tenantError, error_4, _c, validationResult, validationError, error_5;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = get(), user = _a.user, tenantId = _a.tenantId;
                    if (!user) {
                        logger_1.logger.error('Cannot validate tenant access: missing user', new Error('No user'), 'auth-store');
                        set({ isAuthenticated: false });
                        return [2 /*return*/, false];
                    }
                    currentTenantId = tenantId;
                    if (!!currentTenantId) return [3 /*break*/, 4];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .rpc('get_user_tenant_id', {
                            user_email: user.email
                        })];
                case 2:
                    _b = _d.sent(), validTenantId = _b.data, tenantError = _b.error;
                    if (tenantError) {
                        logger_1.logger.error('Failed to get user tenant ID', tenantError, 'auth-store');
                        set({ isAuthenticated: false });
                        return [2 /*return*/, false];
                    }
                    if (validTenantId) {
                        currentTenantId = validTenantId;
                        set({ tenantId: validTenantId });
                    }
                    else {
                        logger_1.logger.error('No tenant ID found for user in database', new Error('Missing tenant ID'), 'auth-store');
                        set({ isAuthenticated: false });
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _d.sent();
                    logger_1.logger.error('Error getting user tenant ID', error_4, 'auth-store');
                    set({ isAuthenticated: false });
                    return [2 /*return*/, false];
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .rpc('validate_user_tenant_access', {
                            user_email: user.email,
                            claimed_tenant_id: currentTenantId
                        })];
                case 5:
                    _c = _d.sent(), validationResult = _c.data, validationError = _c.error;
                    if (validationError) {
                        logger_1.logger.error('Tenant validation failed', validationError, 'auth-store');
                        set({ isAuthenticated: false });
                        return [2 /*return*/, false];
                    }
                    if (validationResult) {
                        logger_1.logger.info('User tenant access validated', { tenantId: currentTenantId }, 'auth-store');
                        set({ isAuthenticated: true, tenantId: currentTenantId });
                        return [2 /*return*/, true];
                    }
                    else {
                        logger_1.logger.error('Tenant validation returned false', {}, 'auth-store');
                        set({ isAuthenticated: false });
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _d.sent();
                    logger_1.logger.error('Error validating tenant access', error_5, 'auth-store');
                    set({ isAuthenticated: false });
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    }); }, refreshToken: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, baseUrl, response, data, newToken, currentAuth, parsed, updatedAuth, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = get().token;
                    if (!token) {
                        logger_1.logger.warn('Cannot refresh token: no token', {}, 'auth-store');
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/v1/auth/refresh"), {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to refresh token');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    newToken = data.access_token;
                    currentAuth = localStorage.getItem('verofield_auth');
                    if (currentAuth) {
                        parsed = JSON.parse(currentAuth);
                        updatedAuth = __assign(__assign({}, parsed), { token: newToken });
                        localStorage.setItem('verofield_auth', JSON.stringify(updatedAuth));
                        set({ token: newToken });
                        logger_1.logger.debug('Token refreshed', {}, 'auth-store');
                    }
                    return [2 /*return*/, newToken];
                case 4:
                    error_6 = _a.sent();
                    logger_1.logger.error('Error refreshing token', error_6, 'auth-store');
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    }); }, refreshUser: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, token, currentUser, baseUrl, userResponse, userData, updatedUser, newToken, tokenResponse, tokenData, tokenError_1, currentAuth, parsed, updatedAuth, error_7;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = get(), token = _a.token, currentUser = _a.user;
                    if (!token) {
                        logger_1.logger.warn('Cannot refresh user: no token', {}, 'auth-store');
                        return [2 /*return*/];
                    }
                    // Don't refresh if we don't have a user yet (might be during login)
                    if (!currentUser) {
                        logger_1.logger.debug('Skipping refresh - no user in store yet', {}, 'auth-store');
                        return [2 /*return*/];
                    }
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 11, , 12]);
                    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/v1/auth/me"), {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    userResponse = _f.sent();
                    if (!userResponse.ok) {
                        // If we get 401, the token might be invalid - don't clear auth, just log and return
                        // Don't throw an error as this will cause issues
                        if (userResponse.status === 401) {
                            logger_1.logger.warn('Token invalid during refresh - user may need to re-login', {}, 'auth-store');
                            // Don't clear auth here - let the user continue with their current session
                            // They'll be prompted to login when they try to access protected resources
                            return [2 /*return*/];
                        }
                        // For other errors, log but don't throw - preserve current auth state
                        logger_1.logger.warn('Failed to refresh user data (non-critical)', {
                            status: userResponse.status
                        }, 'auth-store');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userResponse.json()];
                case 3:
                    userData = _f.sent();
                    updatedUser = userData.user;
                    newToken = token;
                    _f.label = 4;
                case 4:
                    _f.trys.push([4, 9, , 10]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/v1/auth/refresh"), {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 5:
                    tokenResponse = _f.sent();
                    if (!tokenResponse.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, tokenResponse.json()];
                case 6:
                    tokenData = _f.sent();
                    // RefreshTokenResponseDto returns { data: { access_token, ... }, token: { access_token, ... } }
                    newToken = ((_b = tokenData.token) === null || _b === void 0 ? void 0 : _b.access_token) || ((_c = tokenData.data) === null || _c === void 0 ? void 0 : _c.access_token) || tokenData.access_token;
                    return [3 /*break*/, 8];
                case 7:
                    // Token refresh failed, but we still have user data - use existing token
                    logger_1.logger.debug('Token refresh failed, using existing token', { status: tokenResponse.status }, 'auth-store');
                    _f.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    tokenError_1 = _f.sent();
                    // Token refresh failed, but continue with user data update
                    logger_1.logger.debug('Token refresh error (non-critical)', tokenError_1, 'auth-store');
                    return [3 /*break*/, 10];
                case 10:
                    // Update the stored user data and token
                    // Only update if we successfully got new data
                    if (updatedUser && newToken) {
                        currentAuth = localStorage.getItem('verofield_auth');
                        if (currentAuth) {
                            try {
                                parsed = JSON.parse(currentAuth);
                                updatedAuth = __assign(__assign({}, parsed), { user: updatedUser, token: newToken });
                                localStorage.setItem('verofield_auth', JSON.stringify(updatedAuth));
                                set({ user: updatedUser, token: newToken });
                                logger_1.logger.debug('User data and token refreshed', {
                                    userId: updatedUser.id,
                                    roles: updatedUser.roles,
                                    permissionsCount: ((_d = updatedUser.permissions) === null || _d === void 0 ? void 0 : _d.length) || 0,
                                    permissions: updatedUser.permissions
                                }, 'auth-store');
                            }
                            catch (error) {
                                // If localStorage update fails, don't clear auth - just log
                                logger_1.logger.warn('Failed to update localStorage during refresh (non-critical)', error, 'auth-store');
                            }
                        }
                        else {
                            // If no stored auth, create it with the refreshed data
                            localStorage.setItem('verofield_auth', JSON.stringify({
                                token: newToken,
                                user: updatedUser,
                                tenantId: updatedUser.tenant_id
                            }));
                            set({ user: updatedUser, token: newToken });
                            logger_1.logger.debug('Created new auth storage with refreshed data', {
                                userId: updatedUser.id,
                                roles: updatedUser.roles,
                                permissionsCount: ((_e = updatedUser.permissions) === null || _e === void 0 ? void 0 : _e.length) || 0
                            }, 'auth-store');
                        }
                    }
                    else {
                        logger_1.logger.warn('Refresh completed but no user data or token to update', {
                            hasUpdatedUser: !!updatedUser,
                            hasNewToken: !!newToken
                        }, 'auth-store');
                    }
                    return [3 /*break*/, 12];
                case 11:
                    error_7 = _f.sent();
                    // Don't clear auth on refresh error - just log it
                    logger_1.logger.error('Error refreshing user data (non-critical)', error_7, 'auth-store');
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); } })); });
