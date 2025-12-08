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
 * Billing Components Integration Tests
 *
 * Tests for integration between billing components including:
 * - InvoiceList -> InvoiceDetail flow
 * - CustomerPaymentPortal -> PaymentMethodManager flow
 * - Payment processing flow
 * - Data consistency across components
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var InvoiceList_1 = __importDefault(require("../InvoiceList"));
var InvoiceDetail_1 = __importDefault(require("../InvoiceDetail"));
var PaymentMethodManager_1 = __importDefault(require("../PaymentMethodManager"));
var CustomerPaymentHistory_1 = __importDefault(require("../CustomerPaymentHistory"));
var CustomerPaymentPortal_1 = __importDefault(require("../CustomerPaymentPortal"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getInvoices: vitest_1.vi.fn(),
        getPayments: vitest_1.vi.fn(),
        getPaymentMethods: vitest_1.vi.fn(),
        createPaymentMethod: vitest_1.vi.fn(),
        deletePaymentMethod: vitest_1.vi.fn(),
    },
    company: {
        getSettings: vitest_1.vi.fn(),
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
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('Billing Components Integration', function () {
    var queryClient;
    var mockInvoice = {
        id: 'inv-1',
        tenant_id: 'tenant-1',
        account_id: 'acc-1',
        invoice_number: 'INV-001',
        status: 'sent',
        issue_date: '2025-01-01',
        due_date: '2025-01-31',
        subtotal: 100,
        tax_amount: 10,
        total_amount: 110,
        notes: 'Test invoice',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        created_by: 'user-1',
        updated_by: 'user-1',
        InvoiceItem: [{
                id: 'item-1',
                service_type_id: 'svc-1',
                description: 'Service Item',
                quantity: 1,
                unit_price: 100,
                total_price: 100,
                created_at: '2025-01-01',
            }],
        accounts: {
            id: 'acc-1',
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-0001',
        },
    };
    var mockPayment = {
        id: 'pay-1',
        tenant_id: 'tenant-1',
        invoice_id: 'inv-1',
        payment_method_id: 'pm-1',
        amount: 110,
        payment_date: '2025-01-15',
        reference_number: 'REF-001',
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
            total_amount: 110,
            status: 'paid',
        },
    };
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.billing.getInvoices.mockResolvedValue([mockInvoice]);
        enhanced_api_1.billing.getPayments.mockResolvedValue([mockPayment]);
        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue([]);
        enhanced_api_1.company.getSettings.mockResolvedValue({});
    });
    (0, vitest_1.describe)('InvoiceList -> InvoiceDetail Flow', function () {
        (0, vitest_1.it)('should navigate from invoice list to detail view', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoiceSelect, viewButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoiceSelect = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceList_1.default, { customerId: "customer-1", onInvoiceSelect: onInvoiceSelect }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        viewButton = react_1.screen.getByText('View');
                        react_1.fireEvent.click(viewButton);
                        (0, vitest_1.expect)(onInvoiceSelect).toHaveBeenCalledWith(mockInvoice);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display invoice detail with correct data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: mockInvoice }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('$110.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CustomerPaymentPortal Integration', function () {
        (0, vitest_1.it)('should display all tabs correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoices')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Make Payment')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Payment History')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Payment Methods')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should switch between tabs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var historyTab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        historyTab = react_1.screen.getByText('Payment History');
                        react_1.fireEvent.click(historyTab);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$110.00')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment Method Management Integration', function () {
        (0, vitest_1.it)('should create and display new payment method', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newPaymentMethod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPaymentMethod = {
                            id: 'pm-new',
                            tenant_id: 'tenant-1',
                            account_id: 'acc-1',
                            payment_type: 'credit_card',
                            payment_name: 'New Card',
                            card_last4: '5678',
                            is_default: false,
                            is_active: true,
                            created_at: '2025-01-01',
                        };
                        enhanced_api_1.billing.createPaymentMethod.mockResolvedValue(newPaymentMethod);
                        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue([newPaymentMethod]);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentMethodManager_1.default, { customerId: "customer-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var nameInput = react_1.screen.getByLabelText(/payment method name/i);
                                react_1.fireEvent.change(nameInput, { target: { value: 'New Card' } });
                                var last4Input = react_1.screen.getByLabelText(/last 4 digits/i);
                                react_1.fireEvent.change(last4Input, { target: { value: '5678' } });
                                var submitButton = react_1.screen.getByText('Save Payment Method');
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.createPaymentMethod).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment History Integration', function () {
        (0, vitest_1.it)('should display payment history with invoice links', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoiceClick, invoiceLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoiceClick = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentHistory_1.default, { customerId: "customer-1", onInvoiceClick: onInvoiceClick }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        invoiceLink = react_1.screen.getByText('Invoice INV-001');
                        react_1.fireEvent.click(invoiceLink);
                        (0, vitest_1.expect)(onInvoiceClick).toHaveBeenCalledWith('inv-1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should calculate statistics correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentHistory_1.default, { customerId: "customer-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('1')).toBeInTheDocument(); // Total payments
                                (0, vitest_1.expect)(react_1.screen.getByText('$110.00')).toBeInTheDocument(); // Total paid
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Data Consistency', function () {
        (0, vitest_1.it)('should maintain consistent invoice data across components', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoiceSelect, viewButton, firstCall, selectedInvoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoiceSelect = vitest_1.vi.fn();
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceList_1.default, { customerId: "customer-1", onInvoiceSelect: onInvoiceSelect }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        viewButton = react_1.screen.getByText('View');
                        react_1.fireEvent.click(viewButton);
                        firstCall = onInvoiceSelect.mock.calls[0];
                        (0, vitest_1.expect)(firstCall).toBeDefined();
                        if (firstCall) {
                            selectedInvoice = firstCall[0];
                            (0, vitest_1.expect)(selectedInvoice.invoice_number).toBe('INV-001');
                            (0, vitest_1.expect)(selectedInvoice.total_amount).toBe(110);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should sync payment data between components', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentHistory_1.default, { customerId: "customer-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('$110.00')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Verify payment data is consistent
                        (0, vitest_1.expect)(enhanced_api_1.billing.getPayments).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
