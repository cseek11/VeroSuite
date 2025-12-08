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
 * PaymentMethodManager Component Tests
 *
 * Tests for the PaymentMethodManager component including:
 * - Component rendering
 * - CRUD operations
 * - Form validation
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var PaymentMethodManager_1 = __importDefault(require("../PaymentMethodManager"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPaymentMethods: vitest_1.vi.fn(),
        createPaymentMethod: vitest_1.vi.fn(),
        deletePaymentMethod: vitest_1.vi.fn(),
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
        info: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('PaymentMethodManager', function () {
    var queryClient;
    var mockPaymentMethods = [
        {
            id: 'pm-1',
            tenant_id: 'tenant-1',
            account_id: 'acc-1',
            payment_type: 'credit_card',
            payment_name: 'Visa ending in 1234',
            card_type: 'visa',
            card_last4: '1234',
            card_expiry: '12/25',
            is_default: true,
            is_active: true,
            created_at: '2025-01-01',
        },
        {
            id: 'pm-2',
            tenant_id: 'tenant-1',
            account_id: 'acc-1',
            payment_type: 'ach',
            payment_name: 'Checking Account',
            account_number: '1234567890',
            routing_number: '987654321',
            is_default: false,
            is_active: true,
            created_at: '2025-01-02',
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
        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue(mockPaymentMethods);
        enhanced_api_1.billing.createPaymentMethod.mockResolvedValue(mockPaymentMethods[0]);
        enhanced_api_1.billing.deletePaymentMethod.mockResolvedValue(undefined);
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentMethodManager_1.default, __assign({ customerId: "customer-1" }, props)) }));
    };
    (0, vitest_1.describe)('Initial Render', function () {
        (0, vitest_1.it)('should render loading state initially', function () {
            enhanced_api_1.billing.getPaymentMethods.mockImplementation(function () { return new Promise(function () { }); });
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText('Loading payment methods...')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render payment methods after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
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
        (0, vitest_1.it)('should display empty state when no payment methods', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPaymentMethods.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No payment methods')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Add a payment method to make payments faster')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Add Payment Method', function () {
        (0, vitest_1.it)('should open add modal when button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Add Payment Method')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        addButton = react_1.screen.getByText('Add Payment Method');
                        react_1.fireEvent.click(addButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Add Payment Method')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/payment type/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var submitButton = react_1.screen.getByText('Save Payment Method');
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 2:
                        _a.sent();
                        // Should show validation error
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/please enter a payment method name/i)).toBeInTheDocument();
                            })];
                    case 3:
                        // Should show validation error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should create credit card payment method', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var nameInput = react_1.screen.getByLabelText(/payment method name/i);
                                react_1.fireEvent.change(nameInput, { target: { value: 'Mastercard ending in 5678' } });
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
        (0, vitest_1.it)('should validate ACH payment method fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var typeSelect = react_1.screen.getByLabelText(/payment type/i);
                                react_1.fireEvent.change(typeSelect, { target: { value: 'ach' } });
                                var submitButton = react_1.screen.getByText('Save Payment Method');
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/please enter account and routing numbers/i)).toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Delete Payment Method', function () {
        (0, vitest_1.it)('should confirm before deleting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var deleteButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Visa ending in 1234')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        deleteButtons = react_1.screen.getAllByText('Delete');
                        if (deleteButtons[0]) {
                            react_1.fireEvent.click(deleteButtons[0]);
                        }
                        (0, vitest_1.expect)(window.confirm).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should delete payment method when confirmed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var deleteButtons = react_1.screen.getAllByText('Delete');
                                if (deleteButtons[0]) {
                                    react_1.fireEvent.click(deleteButtons[0]);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.deletePaymentMethod).toHaveBeenCalledWith('pm-1');
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not delete when confirmation cancelled', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.confirm = vitest_1.vi.fn(function () { return false; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var deleteButtons = react_1.screen.getAllByText('Delete');
                                if (deleteButtons[0]) {
                                    react_1.fireEvent.click(deleteButtons[0]);
                                }
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(enhanced_api_1.billing.deletePaymentMethod).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should display error when fetch fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getPaymentMethods.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Error loading payment methods')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('API Error')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle create errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.createPaymentMethod.mockRejectedValue(new Error('Create Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var addButton = react_1.screen.getByText('Add Payment Method');
                                react_1.fireEvent.click(addButton);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var nameInput = react_1.screen.getByLabelText(/payment method name/i);
                                react_1.fireEvent.change(nameInput, { target: { value: 'Test Card' } });
                                var last4Input = react_1.screen.getByLabelText(/last 4 digits/i);
                                react_1.fireEvent.change(last4Input, { target: { value: '1234' } });
                                var submitButton = react_1.screen.getByText('Save Payment Method');
                                react_1.fireEvent.click(submitButton);
                            })];
                    case 2:
                        _a.sent();
                        // Should show error toast (mocked)
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.billing.createPaymentMethod).toHaveBeenCalled();
                            })];
                    case 3:
                        // Should show error toast (mocked)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Payment Method Display', function () {
        (0, vitest_1.it)('should show default badge for default payment method', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Default')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should format card number correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/\*\*\*\* \*\*\*\* \*\*\*\* 1234/)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onPaymentMethodSelected when use button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onPaymentMethodSelected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onPaymentMethodSelected = vitest_1.vi.fn();
                        renderComponent({ onPaymentMethodSelected: onPaymentMethodSelected });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var useButtons = react_1.screen.getAllByText('Use');
                                var firstUseButton = useButtons[0];
                                if (firstUseButton) {
                                    react_1.fireEvent.click(firstUseButton);
                                    (0, vitest_1.expect)(onPaymentMethodSelected).toHaveBeenCalledWith(mockPaymentMethods[0]);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
