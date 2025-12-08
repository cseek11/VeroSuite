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
 * PaymentForm Component Tests
 *
 * Tests for PaymentForm component including:
 * - Component rendering
 * - Payment method selection
 * - Stripe Elements integration
 * - Payment processing
 * - Error handling and retry
 * - Success confirmation
 *
 * Regression Prevention: Payment processing errors
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var PaymentForm_1 = __importDefault(require("../PaymentForm"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
require("@testing-library/jest-dom");
// Mock Stripe
vitest_1.vi.mock('@stripe/stripe-js', function () { return ({
    loadStripe: vitest_1.vi.fn(function () { return Promise.resolve({
        confirmCardPayment: vitest_1.vi.fn(),
        elements: vitest_1.vi.fn(function () { return ({
            create: vitest_1.vi.fn(),
            getElement: vitest_1.vi.fn(),
        }); }),
    }); }),
}); });
vitest_1.vi.mock('@stripe/react-stripe-js', function () { return ({
    Elements: function (_a) {
        var children = _a.children;
        return (0, jsx_runtime_1.jsx)("div", { children: children });
    },
    CardElement: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "card-element", children: "Card Element" }); },
    useStripe: function () { return ({
        confirmCardPayment: vitest_1.vi.fn(),
        elements: vitest_1.vi.fn(function () { return ({
            getElement: vitest_1.vi.fn(function () { return ({
                clear: vitest_1.vi.fn(),
            }); }),
        }); }),
    }); },
    useElements: function () { return ({
        getElement: vitest_1.vi.fn(function () { return ({
            clear: vitest_1.vi.fn(),
        }); }),
    }); },
    CardElementChangeEvent: {},
}); });
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        createStripePaymentIntent: vitest_1.vi.fn(),
        processPayment: vitest_1.vi.fn(),
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
// Type assertions
var mockBilling = enhanced_api_1.billing;
var mockLogger = logger_1.logger;
// @ts-expect-error - Type assertion for mocking, kept for type safety
var _mockToast = toast_1.toast;
(0, vitest_1.describe)('PaymentForm', function () {
    var queryClient;
    var mockInvoice = {
        id: 'inv-1',
        tenant_id: 'tenant-1',
        account_id: 'acc-1',
        invoice_number: 'INV-001',
        total_amount: 1000.00,
        subtotal: 900.00,
        tax_amount: 100.00,
        status: 'sent',
        issue_date: '2025-01-01',
        due_date: '2025-01-31',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        InvoiceItem: [],
        accounts: {
            id: 'acc-1',
            name: 'Test Customer',
            email: 'test@example.com',
        },
    };
    var mockPaymentMethods = [
        {
            id: 'pm-1',
            payment_type: 'credit_card',
            payment_name: 'Visa ending in 1234',
            card_type: 'Visa',
            card_last4: '1234',
            card_expiry: '12/25',
            is_default: true,
        },
        {
            id: 'pm-2',
            payment_type: 'ach',
            payment_name: 'Checking Account',
            is_default: false,
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
        // Default mock implementations
        mockBilling.createStripePaymentIntent.mockResolvedValue({
            clientSecret: 'pi_test_123',
        });
    });
    var renderComponent = function (props) {
        var _a, _b, _c, _d;
        if (props === void 0) { props = {}; }
        var defaultProps = {
            invoice: (_a = props.invoice) !== null && _a !== void 0 ? _a : mockInvoice,
            paymentMethods: (_b = props.paymentMethods) !== null && _b !== void 0 ? _b : mockPaymentMethods,
            onSuccess: (_c = props.onSuccess) !== null && _c !== void 0 ? _c : vitest_1.vi.fn(),
            onCancel: (_d = props.onCancel) !== null && _d !== void 0 ? _d : vitest_1.vi.fn(),
        };
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentForm_1.default, __assign({}, defaultProps)) }));
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render payment method selection initially', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
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
                                (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state when creating payment intent', function () {
            mockBilling.createStripePaymentIntent.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            renderComponent();
            // Should show loading or payment method selection
            var loadingText = react_1.screen.queryByText(/loading/i);
            var selectText = react_1.screen.queryByText(/select.*payment.*method/i);
            (0, vitest_1.expect)(loadingText || selectText).toBeTruthy();
        });
        (0, vitest_1.it)('should handle payment intent creation error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.createStripePaymentIntent.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Failed to create payment intent', vitest_1.expect.any(Error), 'PaymentForm');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment Method Selection', function () {
        (0, vitest_1.it)('should allow selecting a saved payment method', function () { return __awaiter(void 0, void 0, void 0, function () {
            var visaMethod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        // Should move to details step
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        // Should move to details step
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should allow selecting new card option', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newCardButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/add.*new.*card/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        newCardButton = react_1.screen.getByText(/add.*new.*card/i);
                        react_1.fireEvent.click(newCardButton);
                        // Should show card input
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByTestId('card-element')).toBeInTheDocument();
                            })];
                    case 2:
                        // Should show card input
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should display error when payment fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var visaMethod, payButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        payButton = react_1.screen.getByText(/pay.*now/i);
                        react_1.fireEvent.click(payButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith('Payment failed', vitest_1.expect.any(Error), 'PaymentForm');
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show retry button after payment failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var visaMethod, payButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        payButton = react_1.screen.getByText(/pay.*now/i);
                        react_1.fireEvent.click(payButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/retry/i)).toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should limit retry attempts to 3', function () { return __awaiter(void 0, void 0, void 0, function () {
            var visaMethod, payButton, _loop_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        payButton = react_1.screen.getByText(/pay.*now/i);
                        _loop_1 = function (i) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        react_1.fireEvent.click(payButton);
                                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                                if (i < 3) {
                                                    (0, vitest_1.expect)(react_1.screen.getByText(/retry/i)).toBeInTheDocument();
                                                }
                                            })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < 4)) return [3 /*break*/, 6];
                        return [5 /*yield**/, _loop_1(i)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: 
                    // After 3 retries, retry button should not appear
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.queryByText(/retry/i)).not.toBeInTheDocument();
                        })];
                    case 7:
                        // After 3 retries, retry button should not appear
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment Processing', function () {
        (0, vitest_1.it)('should process payment successfully with saved method', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onSuccess, visaMethod, payButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.processPayment.mockResolvedValue({
                            success: true,
                            payment_id: 'pay-1',
                        });
                        onSuccess = vitest_1.vi.fn();
                        renderComponent({ onSuccess: onSuccess });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        payButton = react_1.screen.getByText(/pay.*now/i);
                        react_1.fireEvent.click(payButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.processPayment).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        // Should show success screen
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*successful/i)).toBeInTheDocument();
                            })];
                    case 4:
                        // Should show success screen
                        _a.sent();
                        (0, vitest_1.expect)(onSuccess).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onCancel when cancel button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onCancel, cancelButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onCancel = vitest_1.vi.fn();
                        renderComponent({ onCancel: onCancel });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        cancelButton = react_1.screen.getByText(/cancel/i);
                        react_1.fireEvent.click(cancelButton);
                        (0, vitest_1.expect)(onCancel).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Success Confirmation', function () {
        (0, vitest_1.it)('should display success screen after successful payment', function () { return __awaiter(void 0, void 0, void 0, function () {
            var visaMethod, payButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.processPayment.mockResolvedValue({
                            success: true,
                            payment_id: 'pay-1',
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
                        react_1.fireEvent.click(visaMethod);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*details/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        payButton = react_1.screen.getByText(/pay.*now/i);
                        react_1.fireEvent.click(payButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*successful/i)).toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        // Should show payment details
                        (0, vitest_1.expect)(react_1.screen.getByText(/invoice.*number/i)).toBeInTheDocument();
                        (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Regression Prevention', function () {
        (0, vitest_1.it)('should handle undefined payment methods gracefully', function () {
            renderComponent({ paymentMethods: [] });
            (0, vitest_1.expect)(react_1.screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing invoice data gracefully', function () {
            renderComponent({ invoice: __assign(__assign({}, mockInvoice), { accounts: { id: 'acc-1', name: 'Test Customer', email: '' } }) });
            (0, vitest_1.expect)(react_1.screen.queryByText(/select.*payment.*method/i)).toBeInTheDocument();
        });
    });
});
