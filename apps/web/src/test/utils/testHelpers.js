"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vi = exports.mockApiResponse = exports.waitForApiCall = exports.renderWithQueryClient = exports.renderWithRouter = exports.createMockWorkOrder = exports.createMockTechnician = exports.createMockAccount = exports.createMockQueryClient = exports.createMockUser = exports.createMockApiResponse = exports.mockLocalStorage = exports.waitForAsync = exports.createMockDragPayload = exports.createMockCardInteractionRegistry = exports.createMockServerPersistence = exports.createMockDashboardState = exports.createMockLayout = exports.createMockCard = exports.renderWithProviders = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_1 = require("vitest");
/**
 * All Providers Wrapper
 * Wraps components with all necessary providers for testing
 */
var AllProviders = function (_a) {
    var children = _a.children;
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
        },
    });
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
};
/**
 * Custom render function that includes all providers
 */
var renderWithProviders = function (ui, options) {
    return (0, react_1.render)(ui, __assign({ wrapper: AllProviders }, options));
};
exports.renderWithProviders = renderWithProviders;
/**
 * Mock Card Data Factory
 */
var createMockCard = function (overrides) { return (__assign({ id: "card-".concat(Math.random().toString(36).substr(2, 9)), type: 'customers', x: 100, y: 100, width: 400, height: 300 }, overrides)); };
exports.createMockCard = createMockCard;
/**
 * Mock Dashboard Layout Factory
 */
var createMockLayout = function (cards) {
    if (cards === void 0) { cards = []; }
    var cardsMap = cards.reduce(function (acc, card) {
        acc[card.id] = card;
        return acc;
    }, {});
    return {
        cards: cardsMap,
        currentLayout: 'custom',
        canvasHeight: 1000,
    };
};
exports.createMockLayout = createMockLayout;
/**
 * Mock Dashboard State Factory
 */
var createMockDashboardState = function (overrides) { return (__assign({ selectedCards: new Set(), setSelectedCards: vitest_1.vi.fn(), showCardSelector: false, setShowCardSelector: vitest_1.vi.fn(), searchTerm: '', setSearchTerm: vitest_1.vi.fn(), handleDeselectAll: vitest_1.vi.fn(), handleSelectAll: vitest_1.vi.fn() }, overrides)); };
exports.createMockDashboardState = createMockDashboardState;
/**
 * Mock Server Persistence Factory
 */
var createMockServerPersistence = function () { return ({
    addCard: vitest_1.vi.fn().mockResolvedValue('new-card-id'),
    removeCard: vitest_1.vi.fn().mockResolvedValue(undefined),
    updateCardPosition: vitest_1.vi.fn().mockResolvedValue(undefined),
    updateCardSize: vitest_1.vi.fn().mockResolvedValue(undefined),
    currentLayoutId: 'test-layout-id',
    isLoadingLayout: false,
    setIsLoadingLayout: vitest_1.vi.fn(),
    setCurrentLayoutId: vitest_1.vi.fn(),
    setServerLoadSucceeded: vitest_1.vi.fn(),
    serverLoadSucceeded: false,
}); };
exports.createMockServerPersistence = createMockServerPersistence;
/**
 * Mock Card Interaction Registry
 */
var createMockCardInteractionRegistry = function () { return ({
    registerCard: vitest_1.vi.fn(),
    unregisterCard: vitest_1.vi.fn(),
    registerInteraction: vitest_1.vi.fn(),
    getCardConfig: vitest_1.vi.fn(),
    getInteractionConfig: vitest_1.vi.fn(),
    canDrag: vitest_1.vi.fn().mockReturnValue(true),
    canDrop: vitest_1.vi.fn().mockReturnValue(true),
    executeAction: vitest_1.vi.fn().mockResolvedValue({ success: true }),
}); };
exports.createMockCardInteractionRegistry = createMockCardInteractionRegistry;
/**
 * Mock Drag Payload Factory
 */
var createMockDragPayload = function (overrides) { return (__assign({ sourceCardId: 'source-card-id', sourceCardType: 'customers', data: { id: 'customer-123', name: 'Test Customer' }, action: 'create-appointment' }, overrides)); };
exports.createMockDragPayload = createMockDragPayload;
/**
 * Wait for async operations to complete
 */
var waitForAsync = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
exports.waitForAsync = waitForAsync;
/**
 * Mock localStorage
 */
var mockLocalStorage = function () {
    var store = {};
    return {
        getItem: vitest_1.vi.fn(function (key) { return store[key] || null; }),
        setItem: vitest_1.vi.fn(function (key, value) {
            store[key] = value;
        }),
        removeItem: vitest_1.vi.fn(function (key) {
            delete store[key];
        }),
        clear: vitest_1.vi.fn(function () {
            Object.keys(store).forEach(function (key) { return delete store[key]; });
        }),
    };
};
exports.mockLocalStorage = mockLocalStorage;
/**
 * Mock API Response Factory
 */
var createMockApiResponse = function (data, overrides) { return (__assign({ ok: true, status: 200, json: vitest_1.vi.fn().mockResolvedValue(data), text: vitest_1.vi.fn().mockResolvedValue(JSON.stringify(data)) }, overrides)); };
exports.createMockApiResponse = createMockApiResponse;
/**
 * Create a test user
 */
var createMockUser = function (overrides) { return (__assign({ id: 'user-123', email: 'test@example.com', name: 'Test User', tenant_id: 'tenant-123', roles: ['user'] }, overrides)); };
exports.createMockUser = createMockUser;
/**
 * Create a test QueryClient
 */
var createMockQueryClient = function (overrides) {
    return new react_query_1.QueryClient(__assign({ defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        } }, overrides));
};
exports.createMockQueryClient = createMockQueryClient;
/**
 * Create a mock Account/Customer
 */
var createMockAccount = function (overrides) { return (__assign({ id: "account-".concat(Math.random().toString(36).substr(2, 9)), tenant_id: 'tenant-123', name: 'Test Customer', account_type: 'residential', status: 'active', phone: '+1-555-0000', email: 'customer@example.com', address: '123 Test Street', city: 'Test City', state: 'TC', zip_code: '12345', ar_balance: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, overrides)); };
exports.createMockAccount = createMockAccount;
/**
 * Create a mock Technician
 */
var createMockTechnician = function (overrides) { return (__assign({ id: "technician-".concat(Math.random().toString(36).substr(2, 9)), user_id: "user-".concat(Math.random().toString(36).substr(2, 9)), employee_id: "EMP-".concat(Math.random().toString(36).substr(2, 9)), hire_date: new Date().toISOString(), position: 'Pest Control Technician', department: 'Field Operations', employment_type: 'full_time', status: 'active', country: 'US', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user: {
        id: "user-".concat(Math.random().toString(36).substr(2, 9)),
        email: 'technician@example.com',
        first_name: 'John',
        last_name: 'Technician',
        phone: '+1-555-0001',
    } }, overrides)); };
exports.createMockTechnician = createMockTechnician;
/**
 * Create a mock Work Order
 */
var createMockWorkOrder = function (overrides) { return (__assign({ id: "workorder-".concat(Math.random().toString(36).substr(2, 9)), work_order_number: "WO-".concat(Math.random().toString(36).substr(2, 9).toUpperCase()), tenant_id: 'tenant-123', customer_id: "account-".concat(Math.random().toString(36).substr(2, 9)), status: 'pending', priority: 'medium', scheduled_date: new Date(Date.now() + 86400000).toISOString(), description: 'Test work order description', notes: 'Test notes', estimated_duration: 60, service_price: 100.00, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), account: {
        id: "account-".concat(Math.random().toString(36).substr(2, 9)),
        name: 'Test Customer',
        account_type: 'residential',
        phone: '+1-555-0000',
        email: 'customer@example.com',
    } }, overrides)); };
exports.createMockWorkOrder = createMockWorkOrder;
/**
 * Render with Router wrapper
 */
var renderWithRouter = function (ui, options) {
    var Wrapper = function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }));
    };
    return (0, react_1.render)(ui, __assign({ wrapper: Wrapper }, options));
};
exports.renderWithRouter = renderWithRouter;
/**
 * Render with QueryClient wrapper
 */
var renderWithQueryClient = function (ui, queryClient, options) {
    var client = queryClient || (0, exports.createMockQueryClient)();
    var Wrapper = function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: client, children: children }));
    };
    return (0, react_1.render)(ui, __assign({ wrapper: Wrapper }, options));
};
exports.renderWithQueryClient = renderWithQueryClient;
/**
 * Wait for API call to complete
 */
var waitForApiCall = function (mockFn_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([mockFn_1], args_1, true), void 0, function (mockFn, timeout) {
        var startTime;
        if (timeout === void 0) { timeout = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(!mockFn.mock.calls.length && Date.now() - startTime < timeout)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    if (!mockFn.mock.calls.length) {
                        throw new Error('API call was not made within timeout');
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.waitForApiCall = waitForApiCall;
/**
 * Mock API response helper
 */
var mockApiResponse = function (data, status, delay) {
    if (status === void 0) { status = 200; }
    if (delay === void 0) { delay = 0; }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve({
                ok: status >= 200 && status < 300,
                status: status,
                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, data];
                }); }); },
                text: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, JSON.stringify(data)];
                }); }); },
                headers: new Headers(),
                redirected: false,
                statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
                type: 'default',
                url: '',
                clone: function () { return this; },
                body: null,
                bodyUsed: false,
                arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, new ArrayBuffer(0)];
                }); }); },
                blob: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, new Blob()];
                }); }); },
                formData: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, new FormData()];
                }); }); },
            });
        }, delay);
    });
};
exports.mockApiResponse = mockApiResponse;
/**
 * Re-export everything from testing-library
 */
__exportStar(require("@testing-library/react"), exports);
var vitest_2 = require("vitest");
Object.defineProperty(exports, "vi", { enumerable: true, get: function () { return vitest_2.vi; } });
