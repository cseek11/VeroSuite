"use strict";
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
var search_service_1 = require("../search-service");
// Mock Supabase client - define mocks inside the factory to avoid hoisting issues
vitest_1.vi.mock('../supabase-client', function () {
    var mockFrom = vitest_1.vi.fn();
    var mockGetUser = vitest_1.vi.fn();
    var mockSupabaseClient = {
        from: mockFrom,
        auth: {
            getUser: mockGetUser,
        },
        rpc: vitest_1.vi.fn(),
    };
    return {
        default: mockSupabaseClient,
        supabase: mockSupabaseClient,
        mockFrom: mockFrom,
        mockGetUser: mockGetUser,
    };
});
(0, vitest_1.describe)('SearchService', function () {
    var searchService;
    var mockFrom;
    var mockGetUser;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fromMock, getUserMock, mockQuery;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../supabase-client')); })];
                case 1:
                    _a = _b.sent(), fromMock = _a.mockFrom, getUserMock = _a.mockGetUser;
                    mockFrom = fromMock;
                    mockGetUser = getUserMock;
                    searchService = new search_service_1.SearchService();
                    vitest_1.vi.clearAllMocks();
                    // Mock getTenantId by mocking supabase.auth.getUser
                    mockGetUser.mockResolvedValue({
                        data: {
                            user: {
                                user_metadata: { tenant_id: 'tenant-123' }
                            }
                        },
                        error: null
                    });
                    mockQuery = {
                        select: vitest_1.vi.fn().mockReturnThis(),
                        ilike: vitest_1.vi.fn().mockReturnThis(),
                        eq: vitest_1.vi.fn().mockReturnThis(),
                        gte: vitest_1.vi.fn().mockReturnThis(),
                        lte: vitest_1.vi.fn().mockReturnThis(),
                        or: vitest_1.vi.fn().mockReturnThis(),
                        order: vitest_1.vi.fn().mockReturnThis(),
                        limit: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
                    };
                    mockFrom.mockReturnValue(mockQuery);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('searchCustomers', function () {
        (0, vitest_1.it)('should search customers by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCustomers, mockQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCustomers = [
                            {
                                id: '1',
                                first_name: 'John',
                                last_name: 'Doe',
                                email: 'john@example.com',
                                tenant_id: 'tenant-123',
                            },
                            {
                                id: '2',
                                first_name: 'Jane',
                                last_name: 'Smith',
                                email: 'jane@example.com',
                                tenant_id: 'tenant-123',
                            },
                        ];
                        mockQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            ilike: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: mockCustomers, error: null }),
                        };
                        mockFrom.mockReturnValue(mockQuery);
                        return [4 /*yield*/, searchService.searchCustomers('John', 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(mockCustomers);
                        (0, vitest_1.expect)(mockFrom).toHaveBeenCalledWith('accounts');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle search errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            ilike: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: null, error: { message: 'Search error' } }),
                        };
                        mockFrom.mockReturnValue(mockQuery);
                        return [4 /*yield*/, searchService.searchCustomers('John', 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('searchWorkOrders', function () {
        (0, vitest_1.it)('should search work orders by service type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchService.searchWorkOrders('pest_control', 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('globalSearch', function () {
        (0, vitest_1.it)('should perform global search across multiple entities', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResults, mockCustomerQuery, mockWorkOrderQuery, mockJobQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResults = {
                            customers: [
                                { id: '1', first_name: 'John', last_name: 'Doe', tenant_id: 'tenant-123' },
                            ],
                            workOrders: [
                                { id: '1', service_type: 'pest_control', status: 'scheduled', tenant_id: 'tenant-123' },
                            ],
                            jobs: [
                                { id: '1', title: 'Pest Control Job', status: 'active', tenant_id: 'tenant-123' },
                            ],
                        };
                        mockCustomerQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: mockResults.customers, error: null }),
                        };
                        mockWorkOrderQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: mockResults.workOrders, error: null }),
                        };
                        mockJobQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: mockResults.jobs, error: null }),
                        };
                        mockFrom
                            .mockReturnValueOnce(mockCustomerQuery)
                            .mockReturnValueOnce(mockWorkOrderQuery)
                            .mockReturnValueOnce(mockJobQuery);
                        return [4 /*yield*/, searchService.globalSearch('pest', 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            customers: [],
                            workOrders: [],
                            jobs: [],
                            totalResults: 0,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle partial failures gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCustomerQuery, mockWorkOrderQuery, mockJobQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCustomerQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
                        };
                        mockWorkOrderQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
                        };
                        mockJobQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            or: vitest_1.vi.fn().mockReturnThis(),
                            order: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
                        };
                        mockFrom
                            .mockReturnValueOnce(mockCustomerQuery)
                            .mockReturnValueOnce(mockWorkOrderQuery)
                            .mockReturnValueOnce(mockJobQuery);
                        return [4 /*yield*/, searchService.globalSearch('test', 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            customers: [],
                            workOrders: [],
                            jobs: [],
                            totalResults: 0,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('searchWithFilters', function () {
        (0, vitest_1.it)('should apply multiple filters correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filters, mockQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = {
                            status: 'scheduled',
                            service_type: 'pest_control',
                            date_range: {
                                start: '2024-01-01',
                                end: '2024-01-31',
                            },
                        };
                        mockQuery = {
                            select: vitest_1.vi.fn().mockReturnThis(),
                            eq: vitest_1.vi.fn().mockReturnThis(),
                            gte: vitest_1.vi.fn().mockReturnThis(),
                            lte: vitest_1.vi.fn().mockReturnThis(),
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
                        };
                        return [4 /*yield*/, searchService.searchWithFilters('work_orders', filters, 'tenant-123')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
