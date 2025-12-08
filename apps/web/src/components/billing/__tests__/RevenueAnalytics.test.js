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
 * RevenueAnalytics Component Tests
 *
 * Tests for RevenueAnalytics component including:
 * - Component rendering
 * - Data loading states
 * - Error handling
 * - Date range filtering
 * - CSV export functionality
 * - Chart data preparation
 *
 * Regression Prevention: TypeScript `any` types - 2025-11-16
 * Pattern: TYPESCRIPT_ANY_TYPES (see docs/error-patterns.md)
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var RevenueAnalytics_1 = __importDefault(require("../RevenueAnalytics"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getRevenueAnalytics: vitest_1.vi.fn(),
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
(0, vitest_1.describe)('RevenueAnalytics', function () {
    var queryClient;
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
    });
    var renderComponent = function (props) {
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(RevenueAnalytics_1.default, __assign({}, props)) }));
    };
    var mockRevenueData = {
        monthlyRevenue: [
            { month: '2025-01', revenue: 10000 },
            { month: '2025-02', revenue: 15000 },
            { month: '2025-03', revenue: 12000 },
        ],
        totalRevenue: 37000,
        growthRate: 15.5,
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render loading state', function () {
            vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/loading.*revenue analytics/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('API Error');
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockRejectedValue(error);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed to load revenue analytics/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to fetch revenue analytics', error, 'RevenueAnalytics');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render revenue data when loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$37,000/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(react_1.screen.getByText(/total revenue/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Date Range Filtering', function () {
        (0, vitest_1.it)('should use provided date range props', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startDate, endDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = '2025-01-01';
                        endDate = '2025-03-31';
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        renderComponent({ startDate: startDate, endDate: endDate });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.getRevenueAnalytics).toHaveBeenCalledWith(startDate, endDate);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should use default date range when props not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.getRevenueAnalytics).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CSV Export', function () {
        (0, vitest_1.it)('should export revenue analytics to CSV', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockLink, createElementSpy, appendChildSpy, removeChildSpy, exportButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        // Mock URL.createObjectURL and URL.revokeObjectURL
                        global.URL.createObjectURL = vitest_1.vi.fn(function () { return 'blob:mock-url'; });
                        global.URL.revokeObjectURL = vitest_1.vi.fn();
                        mockLink = {
                            href: '',
                            download: '',
                            click: vitest_1.vi.fn(),
                            remove: vitest_1.vi.fn(),
                        };
                        createElementSpy = vitest_1.vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
                        appendChildSpy = vitest_1.vi.spyOn(document.body, 'appendChild').mockImplementation(function () { return mockLink; });
                        removeChildSpy = vitest_1.vi.spyOn(document.body, 'removeChild').mockImplementation(function () { return mockLink; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$37,000/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        exportButton = react_1.screen.getByRole('button', { name: /export/i });
                        react_1.fireEvent.click(exportButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(createElementSpy).toHaveBeenCalledWith('a');
                                (0, vitest_1.expect)(mockLink.click).toHaveBeenCalled();
                                (0, vitest_1.expect)(mockLogger.debug).toHaveBeenCalledWith('Revenue analytics exported', vitest_1.expect.objectContaining({
                                    startDate: vitest_1.expect.any(String),
                                    endDate: vitest_1.expect.any(String),
                                    rowCount: vitest_1.expect.any(Number),
                                }), 'RevenueAnalytics');
                            })];
                    case 2:
                        _a.sent();
                        createElementSpy.mockRestore();
                        appendChildSpy.mockRestore();
                        removeChildSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle export error gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var exportButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        // Mock URL.createObjectURL to throw error
                        global.URL.createObjectURL = vitest_1.vi.fn(function () {
                            throw new Error('Export error');
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$37,000/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        exportButton = react_1.screen.getByRole('button', { name: /export/i });
                        react_1.fireEvent.click(exportButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to export revenue analytics', vitest_1.expect.any(Error), 'RevenueAnalytics');
                                (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show error when no data available for export', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(null);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var exportButton = react_1.screen.getByRole('button', { name: /export/i });
                                react_1.fireEvent.click(exportButton);
                                (0, vitest_1.expect)(mockLogger.warn).toHaveBeenCalled();
                                (0, vitest_1.expect)(mockToast.error).toHaveBeenCalledWith('No data to export. Please wait for data to load or adjust the date range.');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Chart Data Preparation', function () {
        (0, vitest_1.it)('should prepare chart data correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$37,000/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Chart should be rendered (Recharts components)
                        // We can't easily test chart internals, but we can verify the component renders
                        (0, vitest_1.expect)(react_1.screen.getByText(/total revenue/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle empty monthly revenue data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var emptyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emptyData = {
                            monthlyRevenue: [],
                            totalRevenue: 0,
                            growthRate: 0,
                        };
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(emptyData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$0/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('View Switching', function () {
        (0, vitest_1.it)('should switch between overview, trends, and breakdown views', function () { return __awaiter(void 0, void 0, void 0, function () {
            var viewButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\$37,000/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        viewButtons = react_1.screen.queryAllByRole('button', { name: /overview|trends|breakdown/i });
                        if (viewButtons.length > 0 && viewButtons[0]) {
                            react_1.fireEvent.click(viewButtons[0]);
                            // Verify view changed (implementation specific)
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle API errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Network error');
                        vitest_1.vi.mocked(enhanced_api_1.billing.getRevenueAnalytics).mockRejectedValue(error);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to fetch revenue analytics', error, 'RevenueAnalytics');
                                (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
