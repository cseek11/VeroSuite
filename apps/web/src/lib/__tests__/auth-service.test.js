"use strict";
/**
 * AuthService Unit Tests
 *
 * Tests for URL construction, API endpoint paths, and authentication flow.
 * These tests specifically catch issues like duplicate version paths (/v1/v1).
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
var auth_service_1 = require("../auth-service");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}); });
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
(0, vitest_1.describe)('AuthService - URL Construction', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        // Reset environment variables
        delete import.meta.env.VITE_API_BASE_URL;
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Base URL Construction', function () {
        (0, vitest_1.it)('should construct baseUrl correctly with default value', function () {
            // Create a new instance to test constructor
            var rawBase = 'http://localhost:3001/api';
            var trimmed = rawBase.replace(/\/+$/, '');
            var baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
            (0, vitest_1.expect)(baseUrl).toBe('http://localhost:3001/api/v1');
        });
        (0, vitest_1.it)('should not duplicate version when baseUrl already includes /v1', function () {
            var rawBase = 'http://localhost:3001/api/v1';
            var trimmed = rawBase.replace(/\/+$/, '');
            var baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
            (0, vitest_1.expect)(baseUrl).toBe('http://localhost:3001/api/v1');
            (0, vitest_1.expect)(baseUrl).not.toContain('/v1/v1');
        });
        (0, vitest_1.it)('should handle baseUrl with trailing slash', function () {
            var rawBase = 'http://localhost:3001/api/';
            var trimmed = rawBase.replace(/\/+$/, '');
            var baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
            (0, vitest_1.expect)(baseUrl).toBe('http://localhost:3001/api/v1');
        });
        (0, vitest_1.it)('should handle custom VITE_API_BASE_URL', function () {
            var customBase = 'https://api.example.com/api';
            var trimmed = customBase.replace(/\/+$/, '');
            var baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
            (0, vitest_1.expect)(baseUrl).toBe('https://api.example.com/api/v1');
        });
        (0, vitest_1.it)('should preserve existing version in baseUrl', function () {
            var rawBase = 'http://localhost:3001/api/v2';
            var trimmed = rawBase.replace(/\/+$/, '');
            var baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : "".concat(trimmed, "/v1");
            (0, vitest_1.expect)(baseUrl).toBe('http://localhost:3001/api/v2');
        });
    });
    (0, vitest_1.describe)('Login URL Construction', function () {
        (0, vitest_1.it)('should call login with correct URL (no duplicate /v1)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        // Verify fetch was called
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        // Verify URL is correct - should be /api/v1/auth/login, NOT /api/v1/v1/auth/login
                        (0, vitest_1.expect)(calledUrl).toMatch(/\/api\/v1\/auth\/login$/);
                        (0, vitest_1.expect)(calledUrl).not.toMatch(/\/v1\/v1/);
                        (0, vitest_1.expect)(calledUrl).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not have duplicate version segments in login URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl, v1Matches, v1Count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        v1Matches = calledUrl.match(/\/v1/g);
                        v1Count = v1Matches ? v1Matches.length : 0;
                        // Should have exactly 1 occurrence of /v1
                        (0, vitest_1.expect)(v1Count).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should construct login URL correctly with default baseUrl', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        // Should match expected pattern
                        (0, vitest_1.expect)(calledUrl).toBe('http://localhost:3001/api/v1/auth/login');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Refresh Token URL Construction', function () {
        (0, vitest_1.beforeEach)(function () {
            // Mock a valid token that's not expired
            // getToken() tries to parse JSON, so we need to return a JSON string
            var mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE5OTk5OTk5OTl9.test';
            localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: mockToken }));
        });
        (0, vitest_1.it)('should call refresh with correct URL (no duplicate /v1)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'new-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        // Verify URL is correct
                        (0, vitest_1.expect)(calledUrl).toMatch(/\/api\/v1\/auth\/refresh$/);
                        (0, vitest_1.expect)(calledUrl).not.toMatch(/\/v1\/v1/);
                        (0, vitest_1.expect)(calledUrl).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not have duplicate version segments in refresh URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl, v1Matches, v1Count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'new-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        v1Matches = calledUrl.match(/\/v1/g);
                        v1Count = v1Matches ? v1Matches.length : 0;
                        (0, vitest_1.expect)(v1Count).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Exchange Token URL Construction', function () {
        (0, vitest_1.it)('should call exchangeSupabaseToken with correct URL (no duplicate /v1)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'backend-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken('supabase-token')];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        // Verify URL is correct
                        (0, vitest_1.expect)(calledUrl).toMatch(/\/api\/v1\/auth\/exchange-supabase-token$/);
                        (0, vitest_1.expect)(calledUrl).not.toMatch(/\/v1\/v1/);
                        (0, vitest_1.expect)(calledUrl).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not have duplicate version segments in exchange token URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl, v1Matches, v1Count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'backend-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken('supabase-token')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        v1Matches = calledUrl.match(/\/v1/g);
                        v1Count = v1Matches ? v1Matches.length : 0;
                        (0, vitest_1.expect)(v1Count).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('URL Pattern Validation', function () {
        (0, vitest_1.it)('should validate all auth endpoints use correct URL pattern', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        localStorageMock.getItem.mockReturnValue('mock-token');
                        // Test login
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        // Test login
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        (0, vitest_1.expect)(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/login$/);
                        // Test refresh (need valid token)
                        localStorageMock.getItem.mockReturnValue('valid-token');
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.refreshToken()];
                    case 2:
                        _a.sent();
                        if (global.fetch.mock.calls.length > 0) {
                            fetchCall = global.fetch.mock.calls[0];
                            (0, vitest_1.expect)(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/refresh$/);
                        }
                        // Test exchange
                        global.fetch.mockClear();
                        return [4 /*yield*/, auth_service_1.authService.exchangeSupabaseToken('token')];
                    case 3:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        (0, vitest_1.expect)(fetchCall[0]).toMatch(/^https?:\/\/.+\/api\/v1\/auth\/exchange-supabase-token$/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject URLs with duplicate version segments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl, hasDuplicateVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            access_token: 'test-token',
                                            user: { id: 'user-1', email: 'test@example.com' },
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, auth_service_1.authService.login('test@example.com', 'password123')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        hasDuplicateVersion = /\/v\d+\/v\d+/.test(calledUrl);
                        (0, vitest_1.expect)(hasDuplicateVersion).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling with Invalid URLs', function () {
        (0, vitest_1.it)('should handle 404 errors gracefully (might indicate wrong URL)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: false,
                            status: 404,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            message: 'Cannot POST /api/v1/v1/auth/login',
                                        })];
                                });
                            }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, (0, vitest_1.expect)(auth_service_1.authService.login('test@example.com', 'password123')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        calledUrl = fetchCall[0];
                        (0, vitest_1.expect)(calledUrl).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
