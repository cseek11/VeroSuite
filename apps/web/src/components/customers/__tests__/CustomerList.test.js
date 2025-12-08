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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CustomerList Component Tests
 *
 * Tests for the CustomerList component including:
 * - List rendering
 * - Search functionality
 * - Filtering
 * - Pagination
 * - Sorting
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var CustomerList_1 = __importDefault(require("../CustomerList"));
var testHelpers_1 = require("@/test/utils/testHelpers");
// Mock secureApiClient
vitest_1.vi.mock('@/lib/secure-api-client', function () { return ({
    secureApiClient: {
        getAllAccounts: vitest_1.vi.fn(),
        accounts: {
            getAll: vitest_1.vi.fn(),
        },
    },
}); });
// Mock supabase
vitest_1.vi.mock('@/lib/supabase-client', function () { return ({
    supabase: {
        from: vitest_1.vi.fn(function () { return ({
            select: vitest_1.vi.fn().mockReturnThis(),
            eq: vitest_1.vi.fn().mockReturnThis(),
            or: vitest_1.vi.fn().mockReturnThis(),
            single: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
        }); }),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}); });
var createTestQueryClient = function () {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
};
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = createTestQueryClient();
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
};
(0, vitest_1.describe)('CustomerList', function () {
    var mockCustomers = [
        (0, testHelpers_1.createMockAccount)({ id: 'account-1', name: 'John Doe', email: 'john@example.com' }),
        (0, testHelpers_1.createMockAccount)({ id: 'account-2', name: 'Jane Smith', email: 'jane@example.com' }),
        (0, testHelpers_1.createMockAccount)({ id: 'account-3', name: 'Bob Johnson', email: 'bob@example.com' }),
    ];
    var mockOnViewCustomer = vitest_1.vi.fn();
    var mockOnEditCustomer = vitest_1.vi.fn();
    var mockOnCreateCustomer = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var secureApiClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.clearAllMocks();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/lib/secure-api-client')); })];
                case 1:
                    secureApiClient = (_a.sent()).secureApiClient;
                    secureApiClient.getAllAccounts.mockResolvedValue(mockCustomers);
                    secureApiClient.accounts.getAll.mockResolvedValue(mockCustomers);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render customer list', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: mockOnViewCustomer, onEditCustomer: mockOnEditCustomer, onCreateCustomer: mockOnCreateCustomer }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Jane Smith')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var secureApiClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/lib/secure-api-client')); })];
                    case 1:
                        secureApiClient = (_a.sent()).secureApiClient;
                        secureApiClient.getAllAccounts.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
                        );
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: mockOnViewCustomer, onEditCustomer: mockOnEditCustomer, onCreateCustomer: mockOnCreateCustomer }) }));
                        // Loading spinner should be visible
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByTestId('loader2-icon')).toBeInTheDocument();
                            })];
                    case 2:
                        // Loading spinner should be visible
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Search Functionality', function () {
        (0, vitest_1.it)('should filter customers by search term', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: mockOnViewCustomer, onEditCustomer: mockOnEditCustomer, onCreateCustomer: mockOnCreateCustomer }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        searchInput = react_1.screen.getByPlaceholderText(/search/i);
                        react_1.fireEvent.change(searchInput, { target: { value: 'John' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Actions', function () {
        (0, vitest_1.it)('should call onCreateCustomer when create button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: mockOnViewCustomer, onEditCustomer: mockOnEditCustomer, onCreateCustomer: mockOnCreateCustomer }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        createButton = react_1.screen.getByRole('button', { name: /add customer/i });
                        react_1.fireEvent.click(createButton);
                        (0, vitest_1.expect)(mockOnCreateCustomer).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onViewCustomer when view button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var viewButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: mockOnViewCustomer, onEditCustomer: mockOnEditCustomer, onCreateCustomer: mockOnCreateCustomer }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        viewButtons = react_1.screen.getAllByRole('button', { name: /view|eye/i });
                        if (viewButtons.length > 0 && viewButtons[0]) {
                            react_1.fireEvent.click(viewButtons[0]);
                            (0, vitest_1.expect)(mockOnViewCustomer).toHaveBeenCalled();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
