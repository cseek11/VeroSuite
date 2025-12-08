"use strict";
/**
 * Technicians API Debug Test
 *
 * This test helps debug why technicians might not be loading
 * by checking the actual API call and response handling
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
// Mock fetch to capture actual calls
var mockFetch = vitest_1.vi.fn();
global.fetch = mockFetch;
// Mock localStorage
var localStorageMock = (function () {
    var store = {};
    return {
        getItem: vitest_1.vi.fn(function (key) { return store[key] || null; }),
        setItem: vitest_1.vi.fn(function (key, value) { store[key] = value; }),
        removeItem: vitest_1.vi.fn(function (key) { delete store[key]; }),
        clear: vitest_1.vi.fn(function () { store = {}; }),
    };
})();
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
});
// Mock supabase
vitest_1.vi.mock('../supabase-client', function () { return ({
    supabase: {
        auth: {
            getSession: vitest_1.vi.fn(function () { return Promise.resolve({ data: { session: null } }); }),
        },
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        debug: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('Technicians API Debug', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mockFetch.mockClear();
        localStorageMock.clear();
        localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
    });
    (0, vitest_1.it)('should make API call to correct URL', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponse, enhancedApi, result, fetchCall, url, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockResponse = {
                        ok: true,
                        status: 200,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        data: [
                                            { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                                        ],
                                        meta: { count: 1 },
                                    })];
                            });
                        }); },
                    };
                    mockFetch.mockResolvedValue(mockResponse);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    // Check that fetch was called
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                    fetchCall = mockFetch.mock.calls[0];
                    (0, vitest_1.expect)(fetchCall).toBeDefined();
                    if (!fetchCall)
                        return [2 /*return*/];
                    url = fetchCall[0];
                    (0, vitest_1.expect)(url).toMatch(/\/api\/v2\/technicians$/);
                    (0, vitest_1.expect)(url).not.toContain('localhost:3001/api/v2/technicians'); // Should use env var if set
                    options = fetchCall[1];
                    (0, vitest_1.expect)(options.headers).toHaveProperty('Authorization');
                    (0, vitest_1.expect)(options.headers.Authorization).toContain('Bearer');
                    // Check result
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle backend response format { data: [...], meta: {...} }', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponse, enhancedApi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockResponse = {
                        ok: true,
                        status: 200,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        data: [
                                            { id: '1', first_name: 'John', last_name: 'Doe' },
                                            { id: '2', first_name: 'Jane', last_name: 'Smith' },
                                        ],
                                        meta: { count: 2, version: '2.0' },
                                    })];
                            });
                        }); },
                    };
                    mockFetch.mockResolvedValue(mockResponse);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(2);
                    (0, vitest_1.expect)(result[0]).toHaveProperty('id', '1');
                    (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle 404 error gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponse, enhancedApi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockResponse = {
                        ok: false,
                        status: 404,
                        statusText: 'Not Found',
                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        message: 'Cannot GET /api/v2/technicians',
                                        error: 'Not Found',
                                        statusCode: 404,
                                    })];
                            });
                        }); },
                    };
                    mockFetch.mockResolvedValue(mockResponse);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    // Should return empty array on error
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle 401 authentication error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponse, enhancedApi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockResponse = {
                        ok: false,
                        status: 401,
                        statusText: 'Unauthorized',
                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        message: 'Unauthorized',
                                        statusCode: 401,
                                    })];
                            });
                        }); },
                    };
                    mockFetch.mockResolvedValue(mockResponse);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    // Should return empty array on auth error
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle network errors', function () { return __awaiter(void 0, void 0, void 0, function () {
        var enhancedApi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch.mockRejectedValue(new Error('Network error'));
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    // Should return empty array on network error
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle empty response', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponse, enhancedApi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockResponse = {
                        ok: true,
                        status: 200,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        data: [],
                                        meta: { count: 0 },
                                    })];
                            });
                        }); },
                    };
                    mockFetch.mockResolvedValue(mockResponse);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.technicians.list()];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                    (0, vitest_1.expect)(result.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
