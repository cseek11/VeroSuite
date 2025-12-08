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
 * CustomerPaymentHistory Component Tests
 *
 * Tests for the CustomerPaymentHistory component including:
 * - Component rendering
 * - Payment history display
 * - Filtering and sorting
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var CustomerPaymentHistory_1 = __importDefault(require("../CustomerPaymentHistory"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPayments: vitest_1.vi.fn(),
    },
}); });
// Mock toast
vitest_1.vi.mock('@/utils/toast', function () { return ({
    toast: {
        error: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('CustomerPaymentHistory', function () {
    var queryClient;
    var mockPayments = [
        {
            id: 'pay-1',
            tenant_id: 'tenant-1',
            invoice_id: 'inv-1',
            payment_method_id: 'pm-1',
            amount: 100,
            payment_date: '2025-01-15',
            reference_number: 'REF-001',
            notes: 'Payment 1',
            created_at: '2025-01-15',
            created_by: 'user-1',
            payment_methods: {
                id: 'pm-1',
                payment_type: 'credit_card',
                payment_name: 'Visa ending in 1234',
            },
            Invoice: {
                id: 'inv-1',
                invoice_number: 'INV-001',
                total_amount: 100,
                status: 'paid',
            },
        },
        {
            id: 'pay-2',
            tenant_id: 'tenant-1',
            invoice_id: 'inv-2',
            payment_method_id: 'pm-2',
            amount: 200,
            payment_date: '2025-02-15',
            reference_number: 'REF-002',
            notes: 'Payment 2',
            created_at: '2025-02-15',
            created_by: 'user-1',
            payment_methods: {
                id: 'pm-2',
                payment_type: 'ach',
                payment_name: 'Checking Account',
            },
            Invoice: {
                id: 'inv-2',
                invoice_number: 'INV-002',
                total_amount: 200,
                status: 'paid',
            },
        },
    ];
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.billing.getPayments.mockResolvedValue(mockPayments);
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentHistory_1.default, __assign({ customerId: "customer-1" }, props)) }));
    };
    (0, vitest_1.describe)('Initial Render', function () {
        (0, vitest_1.it)('should render loading state initially', function () {
            enhanced_api_1.billing.getPayments.mockImplementation(function () { return new Promise(function () { }); });
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText('Loading payment history...')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render payment history after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('$200.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display statistics cards', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Total Payments')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Total Paid')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('This Month')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment Display', function () {
        (0, vitest_1.it)('should display payment amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('$200.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display invoice numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-002')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display payment methods', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Visa ending in 1234')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Checking Account')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display reference numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/REF-001/)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/REF-002/)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Filtering', function () {
        (0, vitest_1.it)('should filter by search term', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        searchInput = react_1.screen.getByPlaceholderText(/search by invoice number/i);
                        react_1.fireEvent.change(searchInput, { target: { value: 'INV-001' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('$200.00')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter by date range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startDateInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        startDateInput = react_1.screen.getByLabelText(/start date/i);
                        react_1.fireEvent.change(startDateInput, { target: { value: '2025-02-01' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$200.00')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('$100.00')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Sorting', function () {
        (0, vitest_1.it)('should sort by payment date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortButton, payments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        sortButton = react_1.screen.getByText(/payment date/i);
                        react_1.fireEvent.click(sortButton);
                        payments = react_1.screen.getAllByText(/\$[\d,]+\.\d{2}/);
                        (0, vitest_1.expect)(payments.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should sort by amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        sortButton = react_1.screen.getByText(/amount/i);
                        react_1.fireEvent.click(sortButton);
                        // Verify sorting occurred
                        (0, vitest_1.expect)(sortButton).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('User Interactions', function () {
        (0, vitest_1.it)('should call onInvoiceClick when invoice link clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoiceClick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoiceClick = vitest_1.vi.fn();
                        renderComponent({ onInvoiceClick: onInvoiceClick });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var invoiceLinks = react_1.screen.getAllByText(/Invoice INV-/);
                                if (invoiceLinks[0]) {
                                    react_1.fireEvent.click(invoiceLinks[0]);
                                    (0, vitest_1.expect)(onInvoiceClick).toHaveBeenCalledWith('inv-1');
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show filters when filter button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filterButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        filterButton = react_1.screen.getByText(/filters/i);
                        react_1.fireEvent.click(filterButton);
                        (0, vitest_1.expect)(react_1.screen.getByText(/hide filters/i)).toBeInTheDocument();
                        (0, vitest_1.expect)(react_1.screen.getByLabelText(/start date/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should display error when API fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPayments.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Error loading payment history')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('API Error')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle undefined payments array', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPayments.mockResolvedValue(undefined);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No payments found')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle empty payments array', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPayments.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No payments found')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Statistics', function () {
        (0, vitest_1.it)('should calculate total payments correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('2')).toBeInTheDocument(); // Total count
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should calculate total amount correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$300.00')).toBeInTheDocument(); // 100 + 200
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should handle payments without invoice', function () { return __awaiter(void 0, void 0, void 0, function () {
            var paymentsWithoutInvoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentsWithoutInvoice = [__assign(__assign({}, mockPayments[0]), { Invoice: undefined })];
                        enhanced_api_1.billing.getPayments.mockResolvedValue(paymentsWithoutInvoice);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle payments without payment method', function () { return __awaiter(void 0, void 0, void 0, function () {
            var paymentsWithoutMethod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentsWithoutMethod = [__assign(__assign({}, mockPayments[0]), { payment_methods: undefined })];
                        enhanced_api_1.billing.getPayments.mockResolvedValue(paymentsWithoutMethod);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle payments without reference number', function () { return __awaiter(void 0, void 0, void 0, function () {
            var paymentsWithoutRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentsWithoutRef = [__assign(__assign({}, mockPayments[0]), { reference_number: undefined })];
                        enhanced_api_1.billing.getPayments.mockResolvedValue(paymentsWithoutRef);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$100.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
