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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * InvoiceDetail Component Tests
 *
 * Tests for the InvoiceDetail component including:
 * - Component rendering
 * - Payment history display
 * - PDF download functionality
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var InvoiceDetail_1 = __importDefault(require("../InvoiceDetail"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPayments: vitest_1.vi.fn(),
    },
    company: {
        getSettings: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('InvoiceDetail', function () {
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
        notes: 'Test invoice notes',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        created_by: 'user-1',
        updated_by: 'user-1',
        InvoiceItem: [
            {
                id: 'item-1',
                service_type_id: 'svc-1',
                description: 'Service Item 1',
                quantity: 2,
                unit_price: 50,
                total_price: 100,
                created_at: '2025-01-01',
            },
        ],
        accounts: {
            id: 'acc-1',
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-0001',
            address: '123 Main St',
            city: 'Test City',
            state: 'TS',
            zip_code: '12345',
        },
    };
    var mockPayments = [
        {
            id: 'pay-1',
            tenant_id: 'tenant-1',
            invoice_id: 'inv-1',
            payment_method_id: 'pm-1',
            amount: 50,
            payment_date: '2025-01-15',
            reference_number: 'REF-001',
            notes: 'Partial payment',
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
                status: 'sent',
            },
        },
    ];
    var mockCompanySettings = {
        invoice_logo_url: 'https://example.com/logo.png',
        company_name: 'Test Company',
    };
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.billing.getPayments.mockResolvedValue(mockPayments);
        enhanced_api_1.company.getSettings.mockResolvedValue(mockCompanySettings);
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, __assign({ invoice: mockInvoice }, props)) }));
    };
    (0, vitest_1.describe)('Initial Render', function () {
        (0, vitest_1.it)('should render invoice details', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
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
        (0, vitest_1.it)('should display invoice items', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Service Item 1')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('2')).toBeInTheDocument(); // Quantity
                                (0, vitest_1.expect)(react_1.screen.getByText('$50.00')).toBeInTheDocument(); // Unit price
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display customer information', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Bill To')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/123 Main St/)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('test@example.com')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment History', function () {
        (0, vitest_1.it)('should display payment history when payments exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Payment History')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('$50.00')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/REF-001/)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should calculate remaining balance correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Remaining Balance')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('$60.00')).toBeInTheDocument(); // 110 - 50
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not display payment history when no payments', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPayments.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText('Payment History')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Status Display', function () {
        (0, vitest_1.it)('should display correct status for sent invoice', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText('Sent')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct status for paid invoice', function () {
            var paidInvoice = __assign(__assign({}, mockInvoice), { status: 'paid' });
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: paidInvoice }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Paid')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct status for overdue invoice', function () {
            var overdueInvoice = __assign(__assign({}, mockInvoice), { status: 'overdue' });
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: overdueInvoice }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Overdue')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('User Interactions', function () {
        (0, vitest_1.it)('should call onPayNow when pay button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onPayNow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onPayNow = vitest_1.vi.fn();
                        renderComponent({ onPayNow: onPayNow });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var payButton = react_1.screen.getByText('Pay Now');
                                react_1.fireEvent.click(payButton);
                                (0, vitest_1.expect)(onPayNow).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onDownloadPDF when download button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onDownloadPDF;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onDownloadPDF = vitest_1.vi.fn();
                        renderComponent({ onDownloadPDF: onDownloadPDF });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var downloadButton = react_1.screen.getByText('Download PDF');
                                react_1.fireEvent.click(downloadButton);
                                (0, vitest_1.expect)(onDownloadPDF).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not show pay button for paid invoices', function () {
            var paidInvoice = __assign(__assign({}, mockInvoice), { status: 'paid' });
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: paidInvoice }) }));
            (0, vitest_1.expect)(react_1.screen.queryByText('Pay Now')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle API errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPayments.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should still render invoice details
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle missing company settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.company.getSettings.mockResolvedValue(null);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle invoices without items', function () {
            var invoiceWithoutItems = __assign(__assign({}, mockInvoice), { InvoiceItem: [] });
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: invoiceWithoutItems }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('No items found')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should handle invoices without customer address', function () {
            var invoiceWithoutAddress = __assign(__assign({}, mockInvoice), { accounts: __assign(__assign({}, mockInvoice.accounts), { address: undefined, city: undefined }) });
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: invoiceWithoutAddress }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle invoices without notes', function () {
            var notes = mockInvoice.notes, invoiceWithoutNotes = __rest(mockInvoice, ["notes"]);
            (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: invoiceWithoutNotes }) }));
            (0, vitest_1.expect)(react_1.screen.queryByText('Notes')).not.toBeInTheDocument();
        });
    });
});
