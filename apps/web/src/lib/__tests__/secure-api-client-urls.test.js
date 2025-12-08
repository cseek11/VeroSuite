"use strict";
/**
 * SecureApiClient URL Construction Tests
 *
 * Tests for URL construction, API endpoint paths, and versioning.
 * These tests catch issues like missing version prefixes or duplicate versions.
 *
 * Pattern: Similar to auth-service.test.ts
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
var secure_api_client_1 = require("../secure-api-client");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}); });
// Mock authService
vitest_1.vi.mock('@/lib/auth-service', function () { return ({
    authService: {
        isAuthenticated: vitest_1.vi.fn().mockReturnValue(true),
        getAuthHeaders: vitest_1.vi.fn().mockResolvedValue({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
            'x-tenant-id': 'test-tenant',
        }),
    },
}); });
// Mock supabase
vitest_1.vi.mock('@/lib/supabase-client', function () { return ({
    supabase: {
        auth: {
            getSession: vitest_1.vi.fn().mockResolvedValue({
                data: { session: null },
            }),
        },
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
(0, vitest_1.describe)('SecureApiClient - URL Construction', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Base URL Configuration', function () {
        (0, vitest_1.it)('should use default baseUrl when VITE_API_BASE_URL is not set', function () {
            // The baseUrl is set in constructor, so we test the actual calls
            var mockResponse = {
                ok: true,
                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, []];
                }); }); },
            };
            global.fetch.mockResolvedValue(mockResponse);
            secure_api_client_1.secureApiClient.getAllAccounts();
            var fetchCall = global.fetch.mock.calls[0];
            var url = fetchCall[0];
            (0, vitest_1.expect)(url).toMatch(/^http:\/\/localhost:3001\/api/);
        });
    });
    (0, vitest_1.describe)('Accounts Endpoint URLs', function () {
        (0, vitest_1.it)('should call getAllAccounts with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, error_1, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        // Check if fetch was called
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        fetchCall = global.fetch.mock.calls[0];
                        if (!fetchCall) {
                            throw new Error('fetch was not called - check auth mock setup');
                        }
                        url = fetchCall[0];
                        // Critical: Should include /v1/ prefix
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts');
                        (0, vitest_1.expect)(url).not.toBe('http://localhost:3001/api/accounts');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call getAccountById with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: 'account-1' })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getById('account-1')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call createAccount with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: 'account-1' })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create({ name: 'Test Account' })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call updateAccount with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: 'account-1' })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.update('account-1', { name: 'Updated' })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call deleteAccount with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.delete('account-1')];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts/account-1');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('URL Pattern Validation', function () {
        (0, vitest_1.it)('should validate all accounts endpoints use versioned URLs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        // Test all accounts methods
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        // Test all accounts methods
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts$/);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getById('test-id')];
                    case 2:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts\/.+/);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create({})];
                    case 3:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/^https?:\/\/.+\/api\/v\d+\/accounts$/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should support version-specific routing (v1 or v2)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, hasV1, hasV2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        hasV1 = url.includes('/v1/');
                        hasV2 = url.includes('/v2/');
                        // Should have exactly one version
                        (0, vitest_1.expect)(hasV1 || hasV2).toBe(true);
                        (0, vitest_1.expect)(hasV1 && hasV2).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject URLs without version prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // Should NOT match unversioned URL
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/accounts$/);
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v\d+\/accounts$/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject URLs with duplicate version segments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, versionMatches, versionCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // Should NOT have duplicate /v1/v1
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        (0, vitest_1.expect)(url).not.toMatch(/\/v\d+\/v\d+/);
                        versionMatches = url.match(/\/v\d+/g);
                        versionCount = versionMatches ? versionMatches.length : 0;
                        (0, vitest_1.expect)(versionCount).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Regression Tests', function () {
        (0, vitest_1.it)('should prevent /api/accounts bug (missing version)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // This would catch the bug: "Cannot GET /api/accounts"
                        (0, vitest_1.expect)(url).not.toBe('http://localhost:3001/api/accounts');
                        (0, vitest_1.expect)(url).toBe('http://localhost:3001/api/v1/accounts');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should prevent /api/v1/v1/accounts bug (duplicate version)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, hasDuplicateVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        hasDuplicateVersion = /\/v\d+\/v\d+/.test(url);
                        (0, vitest_1.expect)(hasDuplicateVersion).toBe(false);
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
