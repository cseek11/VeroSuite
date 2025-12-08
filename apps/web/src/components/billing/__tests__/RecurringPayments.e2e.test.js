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
 * RecurringPayments Component Tests
 * Tests for recurring payment UI flow
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var RecurringPayments_1 = __importDefault(require("../RecurringPayments"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getInvoices: vitest_1.vi.fn(),
        createRecurringPayment: vitest_1.vi.fn(),
        getRecurringPayment: vitest_1.vi.fn(),
        cancelRecurringPayment: vitest_1.vi.fn(),
    },
}); });
// Mock toast
vitest_1.vi.mock('@/utils/toast', function () { return ({
    toast: {
        success: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('RecurringPayments E2E Tests', function () {
    var queryClient;
    var mockInvoices = [
        {
            id: 'invoice-1',
            invoice_number: 'INV-001',
            total_amount: 100.00,
            status: 'sent',
        },
        {
            id: 'invoice-2',
            invoice_number: 'INV-002',
            total_amount: 200.00,
            status: 'overdue',
        },
    ];
    var mockRecurringPayments = [
        {
            subscriptionId: 'sub_1234567890',
            customerId: 'cus_1234567890',
            status: 'active',
            currentPeriodStart: '2025-01-01T00:00:00Z',
            currentPeriodEnd: '2025-02-01T00:00:00Z',
            cancelAtPeriodEnd: false,
            metadata: {
                invoiceId: 'invoice-1',
                accountId: 'account-1',
                tenantId: 'tenant-1',
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
        enhanced_api_1.billing.getInvoices.mockResolvedValue(mockInvoices);
    });
    var renderComponent = function () {
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(RecurringPayments_1.default, {}) }));
    };
    (0, vitest_1.describe)('Initial Render', function () {
        (0, vitest_1.it)('should display recurring payments header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Recurring Payments')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(react_1.screen.getByText('Manage subscription-based recurring payments')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display create button', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                (0, vitest_1.expect)(createButton).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show empty state when no recurring payments', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getInvoices.mockResolvedValue(mockInvoices);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No Recurring Payments')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Create Recurring Payment Flow', function () {
        (0, vitest_1.it)('should open create form when create button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(createButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Create Recurring Payment')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/invoice/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/payment interval/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/amount per payment/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should populate amount when invoice is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(createButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var invoiceSelect = react_1.screen.getByLabelText(/invoice/i);
                                react_1.fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var amountInput = react_1.screen.getByLabelText(/amount per payment/i);
                                (0, vitest_1.expect)(amountInput.value).toBe('100');
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should create recurring payment successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.createRecurringPayment.mockResolvedValue({
                            subscriptionId: 'sub_new_123',
                            status: 'active',
                        });
                        renderComponent();
                        // Open form
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(createButton);
                            })];
                    case 1:
                        // Open form
                        _a.sent();
                        // Fill form
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var invoiceSelect = react_1.screen.getByLabelText(/invoice/i);
                                react_1.fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
                            })];
                    case 2:
                        // Fill form
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var intervalSelect = react_1.screen.getByLabelText(/payment interval/i);
                                react_1.fireEvent.change(intervalSelect, { target: { value: 'monthly' } });
                            })];
                    case 3:
                        _a.sent();
                        // Submit
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var submitButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 4:
                        // Submit
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.createRecurringPayment).toHaveBeenCalledWith('invoice-1', vitest_1.expect.objectContaining({
                                    invoice_id: 'invoice-1',
                                    interval: 'monthly',
                                    amount: 100,
                                }));
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show error if required fields are missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(createButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var submitButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 2:
                        _a.sent();
                        // Should not call API
                        (0, vitest_1.expect)(enhanced_api_1.billing.createRecurringPayment).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Cancel Recurring Payment Flow', function () {
        (0, vitest_1.beforeEach)(function () {
            // Mock query to return recurring payments
            queryClient.setQueryData(['billing', 'recurring-payments'], mockRecurringPayments);
        });
        (0, vitest_1.it)('should display recurring payments list', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/subscription sub_1234567890/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show cancel buttons for active subscriptions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var cancelButtons = react_1.screen.getAllByRole('button', { name: /cancel/i });
                                (0, vitest_1.expect)(cancelButtons.length).toBeGreaterThan(0);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should cancel subscription at period end', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.cancelRecurringPayment.mockResolvedValue({
                            subscriptionId: 'sub_1234567890',
                            status: 'active',
                            cancelAtPeriodEnd: true,
                        });
                        // Mock window.confirm
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var cancelButton = react_1.screen.getByRole('button', { name: /cancel at period end/i });
                                react_1.fireEvent.click(cancelButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.cancelRecurringPayment).toHaveBeenCalledWith('sub_1234567890', false);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should cancel subscription immediately', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.cancelRecurringPayment.mockResolvedValue({
                            subscriptionId: 'sub_1234567890',
                            status: 'canceled',
                        });
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var cancelButton = react_1.screen.getByRole('button', { name: /cancel immediately/i });
                                react_1.fireEvent.click(cancelButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.cancelRecurringPayment).toHaveBeenCalledWith('sub_1234567890', true);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not cancel if user cancels confirmation', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.confirm = vitest_1.vi.fn(function () { return false; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var cancelButton = react_1.screen.getByRole('button', { name: /cancel at period end/i });
                                react_1.fireEvent.click(cancelButton);
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(enhanced_api_1.billing.cancelRecurringPayment).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle API errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.createRecurringPayment.mockRejectedValue(new Error('Failed to create recurring payment'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var createButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(createButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var invoiceSelect = react_1.screen.getByLabelText(/invoice/i);
                                react_1.fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var submitButton = react_1.screen.getByRole('button', { name: /create recurring payment/i });
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 3:
                        _a.sent();
                        // Error should be logged
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.createRecurringPayment).toHaveBeenCalled();
                            })];
                    case 4:
                        // Error should be logged
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
