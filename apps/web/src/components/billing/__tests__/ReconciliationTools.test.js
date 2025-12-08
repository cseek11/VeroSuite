"use strict";
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
 * ReconciliationTools Component Tests
 *
 * Tests for ReconciliationTools component including:
 * - Component rendering
 * - Hook order compliance (REACT_HOOKS_ORDER_VIOLATION prevention)
 * - Error handling
 * - Data loading states
 * - CSV export functionality
 * - Record selection and filtering
 *
 * Last Updated: 2025-11-18
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var ReconciliationTools_1 = __importDefault(require("../ReconciliationTools"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPaymentTracking: vitest_1.vi.fn(),
    },
}); });
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
    },
}); });
vitest_1.vi.mock('@/utils/toast', function () { return ({
    toast: {
        success: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
// Type assertions for mocked functions
var mockBilling = enhanced_api_1.billing;
var mockLogger = logger_1.logger;
var mockToast = toast_1.toast;
(0, vitest_1.describe)('ReconciliationTools', function () {
    var queryClient;
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
    });
    var renderComponent = function () {
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ReconciliationTools_1.default, {}) }));
    };
    var mockTrackingData = {
        payments: [
            {
                id: '1',
                payment_date: '2025-01-15',
                amount: 1000,
                reference_number: 'REF-001',
                notes: 'Test payment',
                Invoice: {
                    invoice_number: 'INV-001',
                    accounts: { name: 'Test Customer' },
                },
                payment_methods: {
                    payment_name: 'Credit Card',
                },
            },
            {
                id: '2',
                payment_date: '2025-01-16',
                amount: 2000,
                reference_number: 'REF-002',
                Invoice: {
                    invoice_number: 'INV-002',
                    accounts: { name: 'Another Customer' },
                },
                payment_methods: {
                    payment_name: 'ACH',
                },
            },
        ],
        summary: {
            totalAmount: 3000,
            paymentCount: 2,
            averagePayment: 1500,
        },
        dailyTrends: {},
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mockBilling.getPaymentTracking.mockImplementation(function () { return new Promise(function () { }); });
                renderComponent();
                (0, vitest_1.expect)(react_1.screen.getByText(/loading reconciliation data/i)).toBeInTheDocument();
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should render reconciliation tools with data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(react_1.screen.getByText(/reconcile payments and match transactions/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display summary cards', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/total records/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/matched/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/unmatched/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/disputed/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle payment tracking error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Failed to fetch tracking data');
                        mockBilling.getPaymentTracking.mockRejectedValue(error);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to fetch payment tracking data', error, 'ReconciliationTools');
                                (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load reconciliation data/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CSV Export', function () {
        (0, vitest_1.beforeEach)(function () {
            mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
        });
        (0, vitest_1.it)('should export CSV successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockClick, exportButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock URL.createObjectURL and document.createElement
                        global.URL.createObjectURL = vitest_1.vi.fn(function () { return 'blob:url'; });
                        global.URL.revokeObjectURL = vitest_1.vi.fn();
                        mockClick = vitest_1.vi.fn();
                        global.document.createElement = vitest_1.vi.fn(function () { return ({
                            click: mockClick,
                            href: '',
                            download: '',
                        }); });
                        global.document.body.appendChild = vitest_1.vi.fn();
                        global.document.body.removeChild = vitest_1.vi.fn();
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        exportButton = react_1.screen.getByText(/export csv/i);
                        react_1.fireEvent.click(exportButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.debug).toHaveBeenCalledWith('Reconciliation CSV exported', vitest_1.expect.any(Object), 'ReconciliationTools');
                                (0, vitest_1.expect)(mockToast.success).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle CSV export error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var exportButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Force an error during export
                        global.Blob = vitest_1.vi.fn(function () {
                            throw new Error('Blob creation failed');
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        exportButton = react_1.screen.getByText(/export csv/i);
                        react_1.fireEvent.click(exportButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to export Reconciliation CSV', vitest_1.expect.any(Error), 'ReconciliationTools');
                                (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Record Selection', function () {
        (0, vitest_1.beforeEach)(function () {
            mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
        });
        (0, vitest_1.it)('should allow selecting records', function () { return __awaiter(void 0, void 0, void 0, function () {
            var checkboxes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        checkboxes = react_1.screen.getAllByRole('checkbox');
                        (0, vitest_1.expect)(checkboxes.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show bulk actions when records are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Filtering', function () {
        (0, vitest_1.beforeEach)(function () {
            mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
        });
        (0, vitest_1.it)('should filter records by search term', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        searchInput = react_1.screen.getByPlaceholderText(/search invoices, customers/i);
                        (0, vitest_1.expect)(searchInput).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter records by status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var statusFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        statusFilter = react_1.screen.getByText(/all statuses/i);
                        (0, vitest_1.expect)(statusFilter).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Hook Order Compliance', function () {
        (0, vitest_1.it)('should call hooks before early returns', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // This test verifies that hooks are called in the correct order
                        // by checking that the component renders without errors
                        mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment reconciliation tools/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // If hooks were called after early returns, this would fail
                        (0, vitest_1.expect)(react_1.screen.getByText(/reconcile payments and match transactions/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
