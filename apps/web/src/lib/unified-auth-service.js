"use strict";
// ============================================================================
// UNIFIED AUTHENTICATION SERVICE
// ============================================================================
// Centralized authentication service for VeroField CRM
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
exports.unifiedAuthService = void 0;
var supabase_client_1 = require("./supabase-client");
var search_error_logger_1 = require("./search-error-logger");
var logger_1 = require("@/utils/logger");
var UnifiedAuthService = /** @class */ (function () {
    function UnifiedAuthService() {
        Object.defineProperty(this, "currentUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "currentSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.initializeAuth();
    }
    Object.defineProperty(UnifiedAuthService.prototype, "initializeAuth", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, session, error, error_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.getSession()];
                        case 1:
                            _a = _b.sent(), session = _a.data.session, error = _a.error;
                            if (error) {
                                logger_1.logger.warn('Auth initialization error', { error: error }, 'unified-auth-service');
                                return [2 /*return*/];
                            }
                            if (!(session === null || session === void 0 ? void 0 : session.user)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.setCurrentUser(session.user)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            // Listen for auth changes
                            supabase_client_1.supabase.auth.onAuthStateChange(function (event, session) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(event === 'SIGNED_IN' && (session === null || session === void 0 ? void 0 : session.user))) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.setCurrentUser(session.user)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            if (event === 'SIGNED_OUT') {
                                                this.currentUser = null;
                                                this.currentSession = null;
                                            }
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_1, {
                                operation: 'auth_initialization',
                                timestamp: new Date()
                            }, 'low');
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "setCurrentUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    try {
                        tenantId = ((_a = user.user_metadata) === null || _a === void 0 ? void 0 : _a.tenant_id) || ((_b = user.app_metadata) === null || _b === void 0 ? void 0 : _b.tenant_id);
                        if (!tenantId) {
                            throw new Error('No tenant_id found in user metadata');
                        }
                        this.currentUser = {
                            id: user.id,
                            email: user.email,
                            tenant_id: tenantId,
                            role: ((_c = user.user_metadata) === null || _c === void 0 ? void 0 : _c.role) || 'user'
                        };
                        this.currentSession = {
                            user: this.currentUser,
                            access_token: user.access_token || '',
                            refresh_token: user.refresh_token || ''
                        };
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('User authenticated', { email: this.currentUser.email, tenantId: this.currentUser.tenant_id }, 'unified-auth-service');
                        }
                    }
                    catch (error) {
                        search_error_logger_1.searchErrorLogger.logError(error, {
                            operation: 'set_current_user',
                            userId: user === null || user === void 0 ? void 0 : user.id,
                            timestamp: new Date()
                        }, 'low');
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "signIn", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.signInWithPassword({
                                    email: email,
                                    password: password
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Sign in failed: ".concat(error.message));
                            }
                            if (!data.user) {
                                throw new Error('No user returned from sign in');
                            }
                            return [4 /*yield*/, this.setCurrentUser(data.user)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, this.currentUser];
                        case 3:
                            error_2 = _b.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_2, {
                                operation: 'sign_in',
                                timestamp: new Date()
                            }, 'high');
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "signUp", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (email, password, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.signUp({
                                    email: email,
                                    password: password,
                                    options: {
                                        data: {
                                            tenant_id: tenantId
                                        }
                                    }
                                })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Sign up failed: ".concat(error.message));
                            }
                            if (!data.user) {
                                throw new Error('No user returned from sign up');
                            }
                            return [4 /*yield*/, this.setCurrentUser(data.user)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, this.currentUser];
                        case 3:
                            error_3 = _b.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_3, {
                                operation: 'sign_up',
                                tenantId: tenantId,
                                timestamp: new Date()
                            }, 'high');
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "signOut", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var error, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.signOut()];
                        case 1:
                            error = (_a.sent()).error;
                            if (error) {
                                throw new Error("Sign out failed: ".concat(error.message));
                            }
                            this.currentUser = null;
                            this.currentSession = null;
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_4, {
                                operation: 'sign_out',
                                timestamp: new Date()
                            }, 'medium');
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "getCurrentUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.currentUser;
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "getCurrentSession", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.currentSession;
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "isAuthenticated", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.currentUser !== null;
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "getTenantId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _a;
            return ((_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.tenant_id) || null;
        }
    });
    Object.defineProperty(UnifiedAuthService.prototype, "refreshSession", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error, error_5;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, supabase_client_1.supabase.auth.refreshSession()];
                        case 1:
                            _a = _c.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new Error("Session refresh failed: ".concat(error.message));
                            }
                            if (!((_b = data.session) === null || _b === void 0 ? void 0 : _b.user)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.setCurrentUser(data.session.user)];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, this.currentSession];
                        case 3: return [2 /*return*/, null];
                        case 4:
                            error_5 = _c.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_5, {
                                operation: 'refresh_session',
                                timestamp: new Date()
                            }, 'medium');
                            return [2 /*return*/, null];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // Test authentication with default credentials
    Object.defineProperty(UnifiedAuthService.prototype, "testAuth", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var testEmail, testPassword, testTenantId, signInError_1, signUpError_1, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            testEmail = 'test@veropest.com';
                            testPassword = 'TestPassword123!';
                            testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 8]);
                            return [4 /*yield*/, this.signIn(testEmail, testPassword)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 3:
                            signInError_1 = _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.signUp(testEmail, testPassword, testTenantId)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 6:
                            signUpError_1 = _a.sent();
                            logger_1.logger.warn('Test auth failed', { error: signUpError_1 }, 'unified-auth-service');
                            return [2 /*return*/, false];
                        case 7: return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            error_6 = _a.sent();
                            search_error_logger_1.searchErrorLogger.logError(error_6, {
                                operation: 'test_auth',
                                timestamp: new Date()
                            }, 'low');
                            return [2 /*return*/, false];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
    });
    return UnifiedAuthService;
}());
exports.unifiedAuthService = new UnifiedAuthService();
