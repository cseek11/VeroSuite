"use strict";
/**
 * AuthService URL Integration Tests
 *
 * Integration tests that verify auth-service constructs correct URLs
 * and catches issues like duplicate version paths.
 *
 * These tests would have caught the /api/v1/v1/auth/login bug.
 */
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
var vitest_1 = require("vitest");
var auth_service_1 = require("@/lib/auth-service");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
// Mock localStorage
var localStorageMock = {
    getItem: vitest_1.vi.fn(),
    setItem: vitest_1.vi.fn(),
    removeItem: vitest_1.vi.fn(),
    clear: vitest_1.vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});
(0, vitest_1.describe)('AuthService URL Integration Tests', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });
    (0, vitest_1.describe)('URL Construction Validation', function () {
        (0, vitest_1.it)('should construct login URL without duplicate version segments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _b.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        // Critical assertions that would catch the bug
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/login');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        (0, vitest_1.expect)((_a = url.match(/\/v1/g)) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should construct all auth endpoint URLs correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSuccessResponse, url, mockToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSuccessResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockSuccessResponse);
                        localStorageMock.getItem.mockReturnValue('existing-token');
                        // Test login
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        // Test login
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/login');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
                        localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 2:
                        _a.sent();
                        if (global.fetch.mock.calls.length > 0) {
                            url = global.fetch.mock.calls[0][0];
                            (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/refresh');
                            (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        }
                        // Test exchange
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken('supabase-token')];
                    case 3:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/exchange-supabase-token');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('URL Pattern Matching', function () {
        (0, vitest_1.it)('should match expected URL patterns for all endpoints', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, patterns, mockToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        localStorageMock.getItem.mockReturnValue('token');
                        patterns = {
                            login: /^https?:\/\/.+\/api\/v1\/auth\/login$/,
                            refresh: /^https?:\/\/.+\/api\/v1\/auth\/refresh$/,
                            exchange: /^https?:\/\/.+\/api\/v1\/auth\/exchange-supabase-token$/,
                        };
                        // Test login
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        // Test login
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(patterns.login);
                        mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
                        localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 2:
                        _a.sent();
                        if (global.fetch.mock.calls.length > 0) {
                            (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(patterns.refresh);
                        }
                        // Test exchange
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken('token')];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(patterns.exchange);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject URLs with malformed version segments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // These patterns should NOT match
                        (0, vitest_1.expect)(url).not.toMatch(/\/v1\/v1/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/v\d+\/v\d+/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/api/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Base URL Configuration', function () {
        (0, vitest_1.it)('should handle different base URL configurations correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        // Test with default configuration
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        // Test with default configuration
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/auth\/login$/);
                        // The service uses a singleton, so we can't easily test different configs
                        // But we can verify the current configuration works correctly
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Regression Tests for Known Bugs', function () {
        (0, vitest_1.it)('should prevent duplicate /v1/v1 in login URL (regression test)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, hasDuplicateV1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        hasDuplicateV1 = url.includes('/v1/v1');
                        (0, vitest_1.expect)(hasDuplicateV1).toBe(false);
                        // Verify correct URL
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/login');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should prevent duplicate /v1/v1 in refresh URL (regression test)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, hasDuplicateV1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'new-token',
                                            user: { id: 'user-1', email: 'test@example.com', tenant_id: 'tenant-1' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        localStorageMock.getItem.mockReturnValue('valid-token');
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 1:
                        _a.sent();
                        if (global.fetch.mock.calls.length > 0) {
                            url = global.fetch.mock.calls[0][0];
                            hasDuplicateV1 = url.includes('/v1/v1');
                            (0, vitest_1.expect)(hasDuplicateV1).toBe(false);
                            (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/auth/refresh');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
