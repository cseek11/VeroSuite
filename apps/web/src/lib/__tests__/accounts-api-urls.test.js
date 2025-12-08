"use strict";
/**
 * AccountsApi URL Construction Tests
 *
 * Tests for accounts-api.ts URL construction and versioning.
 * Similar pattern to auth-service.test.ts and secure-api-client-urls.test.ts
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
var accounts_api_1 = require("../accounts-api");
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
(0, vitest_1.describe)('AccountsApi - URL Construction', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(JSON.stringify({ token: 'test-token' }));
    });
    (0, vitest_1.describe)('Base URL Configuration', function () {
        (0, vitest_1.it)('should construct baseUrl with version prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        // Should include /v1/ in the URL
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v1\/accounts/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/accounts[^/]/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Get Accounts URL', function () {
        (0, vitest_1.it)('should call getAccounts with correct versioned URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        // URL may have trailing ? from empty query params, which is fine
                        (0, vitest_1.expect)(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/accounts(\?)?$/);
                        (0, vitest_1.expect)(url).not.toBe('http://localhost:3001/api/accounts');
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should include query parameters correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts({ page: 1, limit: 10, search: 'test' })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toContain('/api/v1/accounts?');
                        (0, vitest_1.expect)(url).toContain('page=1');
                        (0, vitest_1.expect)(url).toContain('limit=10');
                        (0, vitest_1.expect)(url).toContain('search=test');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('URL Pattern Validation', function () {
        (0, vitest_1.it)('should match expected URL pattern for accounts endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, pattern;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        pattern = /^https?:\/\/.+\/api\/v1\/accounts(\?.*)?$/;
                        (0, vitest_1.expect)(url).toMatch(pattern);
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
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // Should NOT match unversioned pattern
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/accounts(\?|$)/);
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v\d+\/accounts/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject URLs with duplicate version segments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, url, versionMatches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).not.toContain('/v1/v1');
                        (0, vitest_1.expect)(url).not.toMatch(/\/v\d+\/v\d+/);
                        versionMatches = url.match(/\/v\d+/g);
                        (0, vitest_1.expect)(versionMatches === null || versionMatches === void 0 ? void 0 : versionMatches.length).toBe(1);
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
                                return [2 /*return*/, ({ accounts: [], pagination: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, accounts_api_1.accountsApi.getAccounts()];
                    case 1:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        // This would catch: "Cannot GET /api/accounts"
                        (0, vitest_1.expect)(url).not.toBe('http://localhost:3001/api/accounts');
                        // URL may have trailing ? from empty query params, which is fine
                        (0, vitest_1.expect)(url).toMatch(/^http:\/\/localhost:3001\/api\/v1\/accounts(\?)?$/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
