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
 * PaymentTracking Component Tests
 *
 * Tests for PaymentTracking component including:
 * - Component rendering
 * - Hook order compliance (REACT_HOOKS_ORDER_VIOLATION prevention)
 * - Error handling
 * - Data loading states
 * - CSV export functionality
 *
 * Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16
 * Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var PaymentTracking_1 = __importDefault(require("../PaymentTracking"));
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
// Type assertions - kept for type safety
// @ts-expect-error - Type assertion for mocking
var _mockBilling = enhanced_api_1.billing;
var mockLogger = logger_1.logger;
var mockToast = toast_1.toast;
(0, vitest_1.describe)('PaymentTracking', function () {
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
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentTracking_1.default, {}) }));
    };
    var mockTrackingData = {
        payments: [
            {
                id: 1,
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
        ],
        summary: {
            totalAmount: 1000,
            paymentCount: 1,
            averagePayment: 1000,
        },
        dailyTrends: {
            '2025-01-15': 1000,
        },
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockImplementation(function () { return new Promise(function () { }); } // Never resolves
                    );
                    renderComponent();
                    (0, vitest_1.expect)(react_1.screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();
                }
                catch (error) {
                    mockLogger.error('Test "should render loading state" failed', error, 'PaymentTrackingTest');
                    throw error;
                }
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should render error state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load payment tracking data/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        mockLogger.error('Test "should render error state" failed', error_1, 'PaymentTrackingTest');
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render payment tracking data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(mockTrackingData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/test customer/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        mockLogger.error('Test "should render payment tracking data" failed', error_2, 'PaymentTrackingTest');
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16', function () {
        // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
        // This test prevents regression of the bug where useMemo was called
        // after early returns, causing "Rendered more hooks than during the previous render"
        (0, vitest_1.it)('should call all hooks before early returns', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockImplementation(function () { return new Promise(function (resolve) { return setTimeout(function () { return resolve(mockTrackingData); }, 100); }); });
                        rerender_1 = renderComponent().rerender;
                        (0, vitest_1.expect)(react_1.screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(function () {
                            rerender_1((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentTracking_1.default, {}) }));
                        }).not.toThrow();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        mockLogger.error('Test "should call all hooks before early returns" failed', error_3, 'PaymentTrackingTest');
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle hook order correctly when transitioning from loading to loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolvePromise_1, promise, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        promise = new Promise(function (resolve) {
                            resolvePromise_1 = resolve;
                        });
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockReturnValue(promise);
                        renderComponent();
                        (0, vitest_1.expect)(react_1.screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();
                        resolvePromise_1(mockTrackingData);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            }, { timeout: 2000 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockLogger.error).not.toHaveBeenCalledWith(vitest_1.expect.stringContaining('hooks'), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        mockLogger.error('Test "handle hook order from loading to loaded" failed', error_4, 'PaymentTrackingTest');
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle hook order correctly when transitioning from loaded to error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValueOnce(mockTrackingData);
                        rerender = renderComponent().rerender;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockRejectedValueOnce(new Error('API Error'));
                        queryClient = new react_query_1.QueryClient({
                            defaultOptions: {
                                queries: { retry: false },
                            },
                        });
                        rerender((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentTracking_1.default, {}) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load payment tracking data/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockLogger.error).not.toHaveBeenCalledWith(vitest_1.expect.stringContaining('hooks'), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        mockLogger.error('Test "handle hook order from loaded to error" failed', error_5, 'PaymentTrackingTest');
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should log errors when API call fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_7, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        error_7 = new Error('API Error');
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockRejectedValue(error_7);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to fetch payment tracking data', error_7, 'PaymentTracking');
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockToast.error).toHaveBeenCalledWith('Failed to load payment tracking data. Please try again.');
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        mockLogger.error('Test "log errors when API call fails" failed', error_6, 'PaymentTrackingTest');
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle CSV export errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalCreateObjectURL, error_8, exportButton, error_9, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(mockTrackingData);
                        originalCreateObjectURL = URL.createObjectURL;
                        URL.createObjectURL = vitest_1.vi.fn(function () {
                            throw new Error('Blob error');
                        });
                        renderComponent();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        mockLogger.error('Wait for render failed in CSV export error test', error_8, 'PaymentTrackingTest');
                        throw error_8;
                    case 4:
                        exportButton = react_1.screen.getByText(/export csv/i);
                        react_1.fireEvent.click(exportButton);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to export Payment Tracking CSV', vitest_1.expect.any(Error), 'PaymentTracking');
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_9 = _a.sent();
                        mockLogger.error('Wait for logger call failed in CSV export error test', error_9, 'PaymentTrackingTest');
                        throw error_9;
                    case 8:
                        (0, vitest_1.expect)(mockToast.error).toHaveBeenCalledWith('Failed to export report. Please try again.');
                        // Restore
                        URL.createObjectURL = originalCreateObjectURL;
                        return [3 /*break*/, 10];
                    case 9:
                        error_10 = _a.sent();
                        mockLogger.error('Test "handle CSV export errors" failed', error_10, 'PaymentTrackingTest');
                        throw error_10;
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Data Processing', function () {
        (0, vitest_1.it)('should process chart data correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(mockTrackingData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Chart should render without errors
                        // (We can't easily test chart rendering, but we can verify no errors)
                        (0, vitest_1.expect)(mockLogger.error).not.toHaveBeenCalled();
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        mockLogger.error('Test "process chart data correctly" failed', error_11, 'PaymentTrackingTest');
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle empty dailyTrends', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataWithoutTrends, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dataWithoutTrends = __assign(__assign({}, mockTrackingData), { dailyTrends: {} });
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(dataWithoutTrends);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Should not crash with empty trends
                        (0, vitest_1.expect)(mockLogger.error).not.toHaveBeenCalled();
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        mockLogger.error('Test "handle empty dailyTrends" failed', error_12, 'PaymentTrackingTest');
                        throw error_12;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle undefined trackingData safely', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // useMemo should handle undefined data with guard
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(null);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Should render null or error state, not crash
                                (0, vitest_1.expect)(react_1.screen.queryByText(/payment tracking & reconciliation/i)).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Should not throw hook order errors
                        (0, vitest_1.expect)(mockLogger.error).not.toHaveBeenCalledWith(vitest_1.expect.stringContaining('hooks'), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        mockLogger.error('Test "handle undefined trackingData safely" failed', error_13, 'PaymentTrackingTest');
                        throw error_13;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CSV Export', function () {
        (0, vitest_1.it)('should export CSV successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCreateObjectURL, mockRevokeObjectURL, mockClick_1, mockRemoveChild, mockAppendChild, error_14, exportButton, error_15, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        vitest_1.vi.mocked(enhanced_api_1.billing.getPaymentTracking).mockResolvedValue(mockTrackingData);
                        mockCreateObjectURL = vitest_1.vi.fn(function () { return 'blob:url'; });
                        mockRevokeObjectURL = vitest_1.vi.fn();
                        mockClick_1 = vitest_1.vi.fn();
                        mockRemoveChild = vitest_1.vi.fn();
                        mockAppendChild = vitest_1.vi.fn(function (element) {
                            element.click = mockClick_1;
                            return element;
                        });
                        global.URL.createObjectURL = mockCreateObjectURL;
                        global.URL.revokeObjectURL = mockRevokeObjectURL;
                        document.createElement = vitest_1.vi.fn(function () { return ({
                            href: '',
                            download: '',
                            click: mockClick_1,
                        }); });
                        document.body.appendChild = mockAppendChild;
                        document.body.removeChild = mockRemoveChild;
                        renderComponent();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_14 = _a.sent();
                        mockLogger.error('Wait for render failed in CSV export success test', error_14, 'PaymentTrackingTest');
                        throw error_14;
                    case 4:
                        exportButton = react_1.screen.getByText(/export csv/i);
                        react_1.fireEvent.click(exportButton);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.debug).toHaveBeenCalledWith('Payment Tracking CSV exported', vitest_1.expect.objectContaining({
                                    startDate: vitest_1.expect.any(String),
                                    endDate: vitest_1.expect.any(String),
                                }), 'PaymentTracking');
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_15 = _a.sent();
                        mockLogger.error('Wait for logger call failed in CSV export success test', error_15, 'PaymentTrackingTest');
                        throw error_15;
                    case 8:
                        (0, vitest_1.expect)(mockToast.success).toHaveBeenCalledWith('Payment tracking report exported successfully');
                        return [3 /*break*/, 10];
                    case 9:
                        error_16 = _a.sent();
                        mockLogger.error('Test "export CSV successfully" failed', error_16, 'PaymentTrackingTest');
                        throw error_16;
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    });
});
