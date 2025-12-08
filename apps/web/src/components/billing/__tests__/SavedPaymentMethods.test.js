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
 * SavedPaymentMethods Component Tests
 *
 * Tests for SavedPaymentMethods component including:
 * - Component rendering
 * - Adding payment methods
 * - Deleting payment methods
 * - Form validation
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var SavedPaymentMethods_1 = __importDefault(require("../SavedPaymentMethods"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
require("@testing-library/jest-dom");
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPaymentMethods: vitest_1.vi.fn(),
        createPaymentMethod: vitest_1.vi.fn(),
        deletePaymentMethod: vitest_1.vi.fn(),
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
var mockBilling = enhanced_api_1.billing;
var mockLogger = logger_1.logger;
var mockToast = toast_1.toast;
(0, vitest_1.describe)('SavedPaymentMethods', function () {
    var queryClient;
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
        mockBilling.getPaymentMethods.mockResolvedValue(mockPaymentMethods);
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        var defaultProps = __assign({ accountId: 'acc-1' }, props);
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(SavedPaymentMethods_1.default, __assign({}, defaultProps)) }));
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render loading state initially', function () {
            mockBilling.getPaymentMethods.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/loading.*payment.*methods/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render payment methods after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/checking.*account/i)).toBeInTheDocument();
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
                        mockBilling.getPaymentMethods.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
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
                                (0, vitest_1.expect)(react_1.screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        addButton = react_1.screen.getByText(/add.*payment.*method/i);
                        react_1.fireEvent.click(addButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*type/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addButton, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        addButton = react_1.screen.getByText(/add.*payment.*method/i);
                        react_1.fireEvent.click(addButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/payment.*type/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        submitButton = react_1.screen.getByText(/save/i);
                        react_1.fireEvent.click(submitButton);
                        // Should show validation error
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/required/i)).toBeInTheDocument();
                            })];
                    case 3:
                        // Should show validation error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should create payment method successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addButton, typeSelect, nameInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.createPaymentMethod.mockResolvedValue({
                            id: 'pm-3',
                            payment_type: 'credit_card',
                            payment_name: 'Mastercard ending in 5678',
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        addButton = react_1.screen.getByText(/add.*payment.*method/i);
                        react_1.fireEvent.click(addButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/payment.*type/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        typeSelect = react_1.screen.getByLabelText(/payment.*type/i);
                        react_1.fireEvent.change(typeSelect, { target: { value: 'credit_card' } });
                        nameInput = react_1.screen.getByLabelText(/payment.*name/i);
                        react_1.fireEvent.change(nameInput, { target: { value: 'Mastercard ending in 5678' } });
                        submitButton = react_1.screen.getByText(/save/i);
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.createPaymentMethod).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockToast.success).toHaveBeenCalledWith('Payment method added successfully');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle create payment method error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addButton, typeSelect, nameInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.createPaymentMethod.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        addButton = react_1.screen.getByText(/add.*payment.*method/i);
                        react_1.fireEvent.click(addButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/payment.*type/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        typeSelect = react_1.screen.getByLabelText(/payment.*type/i);
                        react_1.fireEvent.change(typeSelect, { target: { value: 'credit_card' } });
                        nameInput = react_1.screen.getByLabelText(/payment.*name/i);
                        react_1.fireEvent.change(nameInput, { target: { value: 'Test Card' } });
                        submitButton = react_1.screen.getByText(/save/i);
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Delete Payment Method', function () {
        (0, vitest_1.it)('should delete payment method successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var deleteButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.deletePaymentMethod.mockResolvedValue({});
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        deleteButtons = react_1.screen.getAllByText(/delete/i);
                        if (deleteButtons[0]) {
                            react_1.fireEvent.click(deleteButtons[0]);
                        }
                        // Confirm deletion
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var confirmButton = react_1.screen.getByText(/confirm|yes|delete/i);
                                react_1.fireEvent.click(confirmButton);
                            })];
                    case 2:
                        // Confirm deletion
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.deletePaymentMethod).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockToast.success).toHaveBeenCalledWith('Payment method deleted successfully');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle delete payment method error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var deleteButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.deletePaymentMethod.mockRejectedValue(new Error('Delete failed'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        deleteButtons = react_1.screen.getAllByText(/delete/i);
                        if (deleteButtons[0]) {
                            react_1.fireEvent.click(deleteButtons[0]);
                        }
                        // Confirm deletion
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var confirmButton = react_1.screen.getByText(/confirm|yes|delete/i);
                                react_1.fireEvent.click(confirmButton);
                            })];
                    case 2:
                        // Confirm deletion
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockToast.error).toHaveBeenCalled();
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
                        mockBilling.getPaymentMethods.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display error message when payment methods fail to load', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBilling.getPaymentMethods.mockRejectedValue(new Error('Failed to load'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/failed.*load/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Regression Prevention', function () {
        (0, vitest_1.it)('should handle undefined accountId', function () {
            renderComponent({ accountId: undefined });
            // Should not crash
            (0, vitest_1.expect)(react_1.screen.queryByText(/loading/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing payment method properties', function () { return __awaiter(void 0, void 0, void 0, function () {
            var incompleteMethods;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        incompleteMethods = [
                            {
                                id: 'pm-3',
                                payment_type: 'credit_card',
                                // Missing other properties
                            },
                        ];
                        mockBilling.getPaymentMethods.mockResolvedValue(incompleteMethods);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Should not crash
                                (0, vitest_1.expect)(react_1.screen.queryByText(/payment.*method/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
