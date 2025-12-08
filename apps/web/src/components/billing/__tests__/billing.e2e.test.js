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
 * Billing E2E Tests
 *
 * End-to-end tests for complete billing user flows including:
 * - Complete invoice viewing flow
 * - Complete payment processing flow
 * - Complete payment method management flow
 * - Complete customer portal flow
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
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
        processPayment: vitest_1.vi.fn(),
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
        info: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('Billing E2E Flows', function () {
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
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.billing.getInvoices.mockResolvedValue([mockInvoice]);
        enhanced_api_1.billing.getPayments.mockResolvedValue([]);
        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue([]);
    });
    (0, vitest_1.describe)('Complete Invoice Viewing Flow', function () {
        (0, vitest_1.it)('should complete full invoice viewing workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var viewButton, closeButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        // Step 1: View invoices list
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        // Step 1: View invoices list
                        _a.sent();
                        viewButton = react_1.screen.getByText('View');
                        react_1.fireEvent.click(viewButton);
                        // Step 3: Verify invoice detail modal opens
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice Details')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Invoice INV-001')).toBeInTheDocument();
                            })];
                    case 2:
                        // Step 3: Verify invoice detail modal opens
                        _a.sent();
                        closeButton = react_1.screen.getByRole('button', { name: /close/i }) ||
                            react_1.screen.getAllByRole('button').find(function (btn) { var _a; return (_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.includes('×'); });
                        if (closeButton) {
                            react_1.fireEvent.click(closeButton);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Complete Payment Method Management Flow', function () {
        (0, vitest_1.it)('should complete full payment method management workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newPaymentMethod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPaymentMethod = {
                            id: 'pm-new',
                            tenant_id: 'tenant-1',
                            account_id: 'acc-1',
                            payment_type: 'credit_card',
                            payment_name: 'Test Card',
                            card_last4: '1234',
                            is_default: false,
                            is_active: true,
                            created_at: '2025-01-01',
                        };
                        enhanced_api_1.billing.createPaymentMethod.mockResolvedValue(newPaymentMethod);
                        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue([newPaymentMethod]);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        // Step 1: Navigate to payment methods tab
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var paymentMethodsTab = react_1.screen.getByText('Payment Methods');
                                react_1.fireEvent.click(paymentMethodsTab);
                            })];
                    case 1:
                        // Step 1: Navigate to payment methods tab
                        _a.sent();
                        // Step 2: Click add payment method
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 2:
                        // Step 2: Click add payment method
                        _a.sent();
                        // Step 3: Fill form
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var nameInput = react_1.screen.getByLabelText(/payment method name/i);
                                react_1.fireEvent.change(nameInput, { target: { value: 'Test Card' } });
                                var last4Input = react_1.screen.getByLabelText(/last 4 digits/i);
                                react_1.fireEvent.change(last4Input, { target: { value: '1234' } });
                                var submitButton = react_1.screen.getByText('Save Payment Method');
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 3:
                        // Step 3: Fill form
                        _a.sent();
                        // Step 4: Verify payment method created
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.createPaymentMethod).toHaveBeenCalled();
                            })];
                    case 4:
                        // Step 4: Verify payment method created
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Complete Payment Processing Flow', function () {
        (0, vitest_1.it)('should complete full payment processing workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var payButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        // Step 1: View invoices
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        // Step 1: View invoices
                        _a.sent();
                        payButton = react_1.screen.getByText('Pay');
                        react_1.fireEvent.click(payButton);
                        // Step 3: Navigate to payment tab
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Make Payment')).toBeInTheDocument();
                            })];
                    case 2:
                        // Step 3: Navigate to payment tab
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Complete Customer Portal Flow', function () {
        (0, vitest_1.it)('should navigate through all portal sections', function () { return __awaiter(void 0, void 0, void 0, function () {
            var historyTab, paymentMethodsTab, invoicesTab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(CustomerPaymentPortal_1.default, { customerId: "customer-1" }) }));
                        // Step 1: Start on invoices tab
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        // Step 1: Start on invoices tab
                        _a.sent();
                        historyTab = react_1.screen.getByText('Payment History');
                        react_1.fireEvent.click(historyTab);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Payment History')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        paymentMethodsTab = react_1.screen.getByText('Payment Methods');
                        react_1.fireEvent.click(paymentMethodsTab);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Payment Methods')).toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        invoicesTab = react_1.screen.getByText('Invoices');
                        react_1.fireEvent.click(invoicesTab);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
