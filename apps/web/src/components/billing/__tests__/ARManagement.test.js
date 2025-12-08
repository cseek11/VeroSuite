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
 * ARManagement Component Tests
 *
 * Tests for the ARManagement component including:
 * - Component rendering
 * - Data loading states
 * - Error handling
 * - Regression prevention for React Hooks violations
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var ARManagement_1 = __importDefault(require("../ARManagement"));
var enhanced_api_1 = require("@/lib/enhanced-api");
// Mock the billing API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getARSummary: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
    },
}); });
// Mock toast
vitest_1.vi.mock('@/utils/toast', function () { return ({
    toast: {
        success: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('ARManagement', function () {
    var queryClient;
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vitest_1.vi.clearAllMocks();
    });
    var renderComponent = function () {
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ARManagement_1.default, {}) }));
    };
    var mockARSummary = {
        totalAR: 100000,
        totalCustomers: 10,
        totalInvoices: 25,
        agingBuckets: [
            { bucket: '0-30', amount: 50000, invoiceCount: 10 },
            { bucket: '31-60', amount: 30000, invoiceCount: 8 },
            { bucket: '61-90', amount: 15000, invoiceCount: 5 },
            { bucket: '90+', amount: 5000, invoiceCount: 2 },
        ],
        customerAR: [
            {
                customerId: 'cust-1',
                customerName: 'Customer 1',
                totalAR: 50000,
                invoices: [
                    { id: 'inv-1', daysPastDue: 15, total_amount: 50000, status: 'overdue', due_date: '2025-01-15' },
                ],
            },
        ],
    };
    (0, vitest_1.describe)('Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16', function () {
        // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
        // Test ensures hooks are called in the same order on every render
        (0, vitest_1.it)('should not crash when transitioning from loading to data state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // This test prevents regression of the bug where useMemo was called
                        // after early returns, causing "Rendered more hooks than during the previous render"
                        // Start with loading state
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockImplementation(function () { return new Promise(function () { }); } // Never resolves - keeps loading
                        );
                        rerender = renderComponent().rerender;
                        // Component should render loading state
                        (0, vitest_1.expect)(react_1.screen.getByText(/loading ar data/i)).toBeInTheDocument();
                        // Now simulate data loading
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockResolvedValue(mockARSummary);
                        // Force re-render with new data
                        rerender((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ARManagement_1.default, {}) }));
                        // Component should render without hook order violation
                        // If hooks are in wrong order, React will throw error
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
                            })];
                    case 1:
                        // Component should render without hook order violation
                        // If hooks are in wrong order, React will throw error
                        _a.sent();
                        // Should render data without crashing
                        (0, vitest_1.expect)(react_1.screen.getByText(/customer 1/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not crash when transitioning from error to data state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Regression test: Component should handle error -> data transition
                        // without hook order violations
                        // Start with error state
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockRejectedValue(new Error('Network error'));
                        rerender = renderComponent().rerender;
                        // Wait for error state
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load ar data/i)).toBeInTheDocument();
                            })];
                    case 1:
                        // Wait for error state
                        _a.sent();
                        // Now simulate successful data load
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockResolvedValue(mockARSummary);
                        // Force re-render
                        rerender((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ARManagement_1.default, {}) }));
                        // Should transition to data state without hook violation
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText(/failed to load ar data/i)).not.toBeInTheDocument();
                            })];
                    case 2:
                        // Should transition to data state without hook violation
                        _a.sent();
                        // Should render data
                        (0, vitest_1.expect)(react_1.screen.getByText(/customer 1/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call all hooks before early returns', function () {
            // Regression test: Verify hooks are called unconditionally
            // This test ensures useMemo is called even when data is undefined
            vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockResolvedValue(undefined);
            // Should not crash - hooks should be called before early return
            (0, vitest_1.expect)(function () {
                renderComponent();
            }).not.toThrow();
            // Component should handle undefined data gracefully
            (0, vitest_1.expect)(react_1.screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined customerAR in useMemo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var summaryWithoutCustomers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        summaryWithoutCustomers = __assign(__assign({}, mockARSummary), { customerAR: undefined });
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockResolvedValue(summaryWithoutCustomers);
                        // Should not crash - useMemo should return empty array
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Component should render without crashing
                        (0, vitest_1.expect)(react_1.screen.getByText(/\$100,000.00/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render loading state', function () {
            vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockImplementation(function () { return new Promise(function () { }); });
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/loading ar data/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockRejectedValue(new Error('Failed to load'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load ar data/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render AR summary data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getARSummary).mockResolvedValue(mockARSummary);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/customer 1/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(react_1.screen.getByText(/\$100,000.00/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
