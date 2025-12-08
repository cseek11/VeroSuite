"use strict";
/**
 * API Response Structure Tests
 *
 * Tests to catch issues with nested response structures where:
 * - Backend wraps DTOs in { data: result, meta: {...} }
 * - DTOs themselves have a { data: [...] } structure
 * - Results in double-nested: { data: { data: [...] } }
 *
 * This test ensures all API clients handle various response formats correctly.
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
// Mock fetch globally
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
// Mock api-utils
var mockEnhancedApiCall = vitest_1.vi.fn();
vitest_1.vi.mock('../api-utils', function () { return ({
    enhancedApiCall: mockEnhancedApiCall,
}); });
(0, vitest_1.describe)('API Response Structure Handling', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mockFetch.mockClear();
        mockEnhancedApiCall.mockClear();
        localStorageMock.clear();
        localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
    });
    (0, vitest_1.describe)('Double-Nested Response Structure (Controller-wrapped DTO)', function () {
        (0, vitest_1.it)('should handle { data: { data: [...] } } structure (technicians pattern)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, enhancedApi, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [
                                                    { id: '1', first_name: 'John', last_name: 'Doe' },
                                                    { id: '2', first_name: 'Jane', last_name: 'Smith' },
                                                ],
                                                pagination: { page: 1, limit: 20, total: 2 },
                                                success: true,
                                                message: 'Technicians retrieved successfully',
                                                timestamp: new Date().toISOString(),
                                            },
                                            meta: {
                                                version: '2.0',
                                                count: 2,
                                                timestamp: new Date().toISOString(),
                                            },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _a.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                    case 2:
                        enhancedApi = (_a.sent()).enhancedApi;
                        return [4 /*yield*/, enhancedApi.technicians.list()];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                        (0, vitest_1.expect)(result.length).toBe(2);
                        if (result.length > 0) {
                            (0, vitest_1.expect)(result[0]).toHaveProperty('id', '1');
                            (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle { data: { data: [...] } } structure for other endpoints', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [{ id: '1', name: 'Item 1' }],
                                                pagination: { page: 1, limit: 20, total: 1 },
                                                success: true,
                                            },
                                            meta: { version: '2.0', count: 1 },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _a.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        if ((response === null || response === void 0 ? void 0 : response.data) && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(1);
                        (0, vitest_1.expect)(extractedData[0]).toHaveProperty('id', '1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Single-Nested Response Structure', function () {
        (0, vitest_1.it)('should handle { data: [...] } structure (direct array)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
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
                                                { id: '1', name: 'Item 1' },
                                                { id: '2', name: 'Item 2' },
                                            ],
                                            meta: { version: '2.0', count: 2 },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _a.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        if ((response === null || response === void 0 ? void 0 : response.data) && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Alternative Response Formats', function () {
        (0, vitest_1.it)('should handle { technicians: [...] } format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            technicians: [
                                                { id: '1', name: 'Tech 1' },
                                                { id: '2', name: 'Tech 2' },
                                            ],
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _a.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        if ((response === null || response === void 0 ? void 0 : response.data) && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && typeof response.data === 'object' && 'technicians' in response.data && Array.isArray(response.data.technicians)) {
                            extractedData = response.data.technicians;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.technicians) && Array.isArray(response.technicians)) {
                            extractedData = response.technicians;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle direct array response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, [
                                            { id: '1', name: 'Item 1' },
                                            { id: '2', name: 'Item 2' },
                                        ]];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _b.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        if (Array.isArray(response)) {
                            extractedData = response;
                        }
                        else if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Cases', function () {
        (0, vitest_1.it)('should return empty array when response.data.data is not an array', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                            data: {
                                                data: { message: 'No items found' }, // Not an array!
                                                pagination: { page: 1, limit: 20, total: 0 },
                                            },
                                            meta: { version: '2.0', count: 0 },
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
                        // Should return empty array, not crash
                        (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                        (0, vitest_1.expect)(result.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return empty array when response structure is unexpected', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                            unexpected: 'structure',
                                            with: { nested: 'data' },
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
                        // Should return empty array, not crash
                        (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                        (0, vitest_1.expect)(result.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return empty array on API error', function () { return __awaiter(void 0, void 0, void 0, function () {
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
    });
    (0, vitest_1.describe)('Response Structure Detection', function () {
        (0, vitest_1.it)('should detect double-nested structure correctly', function () {
            var _a;
            var response = {
                data: {
                    data: [{ id: '1' }],
                    pagination: {},
                },
                meta: {},
            };
            var isDoubleNested = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) && Array.isArray(response.data.data);
            (0, vitest_1.expect)(isDoubleNested).toBe(true);
        });
        (0, vitest_1.it)('should detect single-nested structure correctly', function () {
            var response = {
                data: [{ id: '1' }],
                meta: {},
            };
            var isSingleNested = (response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data) && !response.data.data;
            (0, vitest_1.expect)(isSingleNested).toBe(true);
        });
        (0, vitest_1.it)('should detect direct array correctly', function () {
            var response = [{ id: '1' }];
            var isDirectArray = Array.isArray(response);
            (0, vitest_1.expect)(isDirectArray).toBe(true);
        });
    });
    (0, vitest_1.describe)('Regression Tests', function () {
        (0, vitest_1.it)('should prevent "Unexpected response format" warning for valid double-nested structure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, _a, _b, logger, enhancedApi;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [{ id: '1', name: 'Test' }],
                                                pagination: { page: 1, limit: 20, total: 1 },
                                                success: true,
                                            },
                                            meta: { version: '2.0', count: 1 },
                                        })];
                                });
                            }); },
                        };
                        _b = (_a = mockEnhancedApiCall).mockResolvedValue;
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/utils/logger')); })];
                    case 2:
                        logger = (_c.sent()).logger;
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                    case 3:
                        enhancedApi = (_c.sent()).enhancedApi;
                        return [4 /*yield*/, enhancedApi.technicians.list()];
                    case 4:
                        _c.sent();
                        // Should NOT log warning for valid structure
                        (0, vitest_1.expect)(logger.warn).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should extract data correctly from double-nested structure (technicians bug fix)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, enhancedApi, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [
                                                    { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                                                    { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
                                                ],
                                                pagination: { page: 1, limit: 20, total: 2 },
                                                success: true,
                                                message: 'Technicians retrieved successfully',
                                                timestamp: new Date().toISOString(),
                                            },
                                            meta: {
                                                version: '2.0',
                                                count: 2,
                                                timestamp: new Date().toISOString(),
                                            },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _a.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../enhanced-api')); })];
                    case 2:
                        enhancedApi = (_a.sent()).enhancedApi;
                        return [4 /*yield*/, enhancedApi.technicians.list()];
                    case 3:
                        result = _a.sent();
                        // Should extract the array correctly
                        (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
                        (0, vitest_1.expect)(result.length).toBe(2);
                        if (result.length >= 2) {
                            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'tech-1');
                            (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
                            (0, vitest_1.expect)(result[1]).toHaveProperty('id', 'tech-2');
                            (0, vitest_1.expect)(result[1]).toHaveProperty('first_name', 'Jane');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Similar Endpoints Pattern', function () {
        (0, vitest_1.it)('should handle accounts endpoint with same structure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [{ id: 'acc-1', name: 'Account 1' }],
                                                pagination: { page: 1, limit: 20, total: 1 },
                                            },
                                            meta: { version: '1.0', count: 1 },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _b.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        // Same extraction logic
                        if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle work orders endpoint with same structure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, responseData, response, extractedData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            status: 200,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            data: {
                                                data: [{ id: 'wo-1', description: 'Work Order 1' }],
                                                pagination: { page: 1, limit: 20, total: 1 },
                                            },
                                            meta: { version: '1.0', count: 1 },
                                        })];
                                });
                            }); },
                        };
                        return [4 /*yield*/, mockResponse.json()];
                    case 1:
                        responseData = _b.sent();
                        mockEnhancedApiCall.mockResolvedValue(responseData);
                        response = responseData;
                        extractedData = [];
                        // Same extraction logic
                        if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) && Array.isArray(response.data.data)) {
                            extractedData = response.data.data;
                        }
                        else if ((response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data)) {
                            extractedData = response.data;
                        }
                        (0, vitest_1.expect)(Array.isArray(extractedData)).toBe(true);
                        (0, vitest_1.expect)(extractedData.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
