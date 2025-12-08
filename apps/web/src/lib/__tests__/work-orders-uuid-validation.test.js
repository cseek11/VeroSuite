"use strict";
/**
 * Work Orders UUID Validation Tests
 *
 * Tests to catch "Validation failed (uuid is expected)" errors
 * by validating UUIDs before API calls
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
var work_orders_api_1 = require("../work-orders-api");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
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
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}); });
// UUID validation helper
function isValidUUID(str) {
    if (!str || typeof str !== 'string')
        return false;
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
(0, vitest_1.describe)('Work Orders UUID Validation', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        global.fetch.mockClear();
        localStorageMock.clear();
        localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
        localStorageMock.setItem('tenantId', '7193113e-ece2-4f7b-ae8c-176df4367e28');
    });
    (0, vitest_1.describe)('getWorkOrderById - UUID Validation', function () {
        (0, vitest_1.it)('should reject empty string ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrderById('')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        // Should not make API call with invalid ID
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject undefined ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrderById(undefined)).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        // Should not make API call with invalid ID
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject null ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrderById(null)).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        // Should not make API call with invalid ID
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject invalid UUID format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidIds, _i, invalidIds_1, invalidId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidIds = [
                            'not-a-uuid',
                            '123',
                            'abc-def-ghi',
                            '12345678-1234-1234-1234-1234567890123', // Too long
                            '1234567-1234-1234-1234-123456789012', // Too short
                            '12345678-123-1234-1234-123456789012', // Invalid format
                        ];
                        _i = 0, invalidIds_1 = invalidIds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < invalidIds_1.length)) return [3 /*break*/, 4];
                        invalidId = invalidIds_1[_i];
                        return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrderById(invalidId)).rejects.toThrow()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should accept valid UUID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validUUID, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUUID = '123e4567-e89b-12d3-a456-426614174000';
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: validUUID, description: 'Test' })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, work_orders_api_1.workOrdersApi.getWorkOrderById(validUUID)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        (0, vitest_1.expect)(result).toHaveProperty('id', validUUID);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('updateWorkOrder - UUID Validation', function () {
        (0, vitest_1.it)('should reject empty string ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.updateWorkOrder('', {})).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject invalid UUID format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.updateWorkOrder('invalid', {})).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should accept valid UUID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validUUID, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUUID = '123e4567-e89b-12d3-a456-426614174000';
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: validUUID })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, work_orders_api_1.workOrdersApi.updateWorkOrder(validUUID, { description: 'Updated' })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('deleteWorkOrder - UUID Validation', function () {
        (0, vitest_1.it)('should reject empty string ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.deleteWorkOrder('')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject invalid UUID format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.deleteWorkOrder('invalid')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should accept valid UUID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validUUID, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUUID = '123e4567-e89b-12d3-a456-426614174000';
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ message: 'Deleted' })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, work_orders_api_1.workOrdersApi.deleteWorkOrder(validUUID)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getWorkOrdersByCustomer - UUID Validation', function () {
        (0, vitest_1.it)('should reject empty string customer ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrdersByCustomer('')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject invalid UUID format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrdersByCustomer('invalid')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should accept valid UUID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validUUID, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUUID = '123e4567-e89b-12d3-a456-426614174000';
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, work_orders_api_1.workOrdersApi.getWorkOrdersByCustomer(validUUID)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getWorkOrdersByTechnician - UUID Validation', function () {
        (0, vitest_1.it)('should reject empty string technician ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrdersByTechnician('')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should reject invalid UUID format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrdersByTechnician('invalid')).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should accept valid UUID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validUUID, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUUID = '123e4567-e89b-12d3-a456-426614174000';
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, []];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, work_orders_api_1.workOrdersApi.getWorkOrdersByTechnician(validUUID)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(global.fetch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('UUID Validation Helper', function () {
        (0, vitest_1.it)('should validate UUID format correctly', function () {
            var validUUIDs = [
                '123e4567-e89b-12d3-a456-426614174000',
                '00000000-0000-0000-0000-000000000000',
                'ffffffff-ffff-ffff-ffff-ffffffffffff',
                '7193113e-ece2-4f7b-ae8c-176df4367e28',
            ];
            validUUIDs.forEach(function (uuid) {
                (0, vitest_1.expect)(isValidUUID(uuid)).toBe(true);
            });
        });
        (0, vitest_1.it)('should reject invalid UUID formats', function () {
            var invalidUUIDs = [
                '',
                undefined,
                null,
                'not-a-uuid',
                '123',
                'abc-def-ghi',
                '12345678-1234-1234-1234-1234567890123', // Too long
                '1234567-1234-1234-1234-123456789012', // Too short
            ];
            invalidUUIDs.forEach(function (uuid) {
                (0, vitest_1.expect)(isValidUUID(uuid)).toBe(false);
            });
        });
    });
    (0, vitest_1.describe)('Regression Tests', function () {
        (0, vitest_1.it)('should prevent "Validation failed (uuid is expected)" error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidIds, _i, invalidIds_2, invalidId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidIds = ['', undefined, null, 'invalid', '123'];
                        _i = 0, invalidIds_2 = invalidIds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < invalidIds_2.length)) return [3 /*break*/, 4];
                        invalidId = invalidIds_2[_i];
                        return [4 /*yield*/, (0, vitest_1.expect)(work_orders_api_1.workOrdersApi.getWorkOrderById(invalidId)).rejects.toThrow()];
                    case 2:
                        _a.sent();
                        // Should not make API call
                        (0, vitest_1.expect)(global.fetch).not.toHaveBeenCalled();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle URL params that might be undefined', function () {
            // Simulate useParams() returning undefined
            var idFromParams = undefined;
            var id = idFromParams || '';
            // Should validate before using
            (0, vitest_1.expect)(isValidUUID(id)).toBe(false);
            (0, vitest_1.expect)(id).toBe('');
        });
    });
});
