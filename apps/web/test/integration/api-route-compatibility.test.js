"use strict";
/**
 * API Route Compatibility Tests
 *
 * Integration tests that verify frontend API calls match backend routes.
 * This test suite would catch URL mismatches like /api/accounts vs /api/v1/accounts
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
var secure_api_client_1 = require("@/lib/secure-api-client");
var accounts_api_1 = require("@/lib/accounts-api");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
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
(0, vitest_1.describe)('API Route Compatibility', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');
    });
    (0, vitest_1.describe)('Frontend/Backend Route Matching', function () {
        (0, vitest_1.it)('should verify secureApiClient accounts endpoints use /v1/', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v1\/accounts$/);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getById('test-id')];
                    case 2:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v\d+\/accounts\/test-id$/);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create({})];
                    case 3:
                        _a.sent();
                        url = global.fetch.mock.calls[0][0];
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v\d+\/accounts$/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should verify accountsApi uses /v1/', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v1\/accounts/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Version Consistency', function () {
        (0, vitest_1.it)('should ensure all accounts endpoints use same version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, urls;
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
                        urls = [];
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        _a.sent();
                        urls.push(global.fetch.mock.calls[0][0]);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getById('id')];
                    case 2:
                        _a.sent();
                        urls.push(global.fetch.mock.calls[0][0]);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create({})];
                    case 3:
                        _a.sent();
                        urls.push(global.fetch.mock.calls[0][0]);
                        // All URLs should use /v1/
                        urls.forEach(function (url) {
                            (0, vitest_1.expect)(url).toMatch(/\/api\/v1\//);
                            (0, vitest_1.expect)(url).not.toMatch(/\/api\/v2\//);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Route Pattern Validation', function () {
        (0, vitest_1.it)('should validate route patterns match backend expectations', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedRoutes, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedRoutes = {
                            getAll: /^https?:\/\/.+\/api\/v1\/accounts$/,
                            getById: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
                            create: /^https?:\/\/.+\/api\/v1\/accounts$/,
                            update: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
                            delete: /^https?:\/\/.+\/api\/v1\/accounts\/[^/]+$/,
                        };
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
                        (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(expectedRoutes.getAll);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getById('test-id')];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(expectedRoutes.getById);
                        global.fetch.mockClear();
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create({})];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch.mock.calls[0][0]).toMatch(expectedRoutes.create);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Prevention', function () {
        (0, vitest_1.it)('should prevent 404 errors from route mismatches', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidPatterns, mockResponse, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidPatterns = [
                            /\/api\/accounts$/, // Missing version
                            /\/api\/v1\/v1\/accounts/, // Duplicate version
                            /\/api\/v2\/accounts/, // Wrong version
                        ];
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
                        // Verify URL doesn't match any invalid patterns
                        invalidPatterns.forEach(function (pattern) {
                            (0, vitest_1.expect)(url).not.toMatch(pattern);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
