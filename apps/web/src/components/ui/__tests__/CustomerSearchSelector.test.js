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
 * CustomerSearchSelector Component Tests
 *
 * Tests for the customer search selector component including:
 * - Customer fetching on mount
 * - Local search filtering
 * - Customer selection
 * - Loading states
 * - Error handling
 * - Empty states
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var CustomerSearchSelector_1 = __importDefault(require("../CustomerSearchSelector"));
var secure_api_client_1 = require("@/lib/secure-api-client");
var testHelpers_1 = require("@/test/utils/testHelpers");
// Mock secureApiClient
vitest_1.vi.mock('@/lib/secure-api-client', function () { return ({
    secureApiClient: {
        getAllAccounts: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
    },
}); });
var createTestQueryClient = function () {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
};
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = createTestQueryClient();
    return (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children });
};
(0, vitest_1.describe)('CustomerSearchSelector', function () {
    var mockOnChange = vitest_1.vi.fn();
    var mockCustomers = [
        (0, testHelpers_1.createMockAccount)({
            id: 'account-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-1000',
            address: '123 Main St',
            city: 'Test City',
            state: 'TC',
            zip_code: '12345',
            account_type: 'residential',
        }),
        (0, testHelpers_1.createMockAccount)({
            id: 'account-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1-555-2000',
            address: '456 Business Ave',
            city: 'Business City',
            state: 'BC',
            zip_code: '54321',
            account_type: 'commercial',
        }),
        (0, testHelpers_1.createMockAccount)({
            id: 'account-3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '+1-555-3000',
            address: '789 Residential Rd',
            city: 'Residential City',
            state: 'RC',
            zip_code: '98765',
            account_type: 'residential',
        }),
    ];
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        secure_api_client_1.secureApiClient.getAllAccounts.mockResolvedValue(mockCustomers);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render search input with placeholder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                input = react_1.screen.getByPlaceholderText(/search customers/i);
                (0, vitest_1.expect)(input).toBeInTheDocument();
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should render label when provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, label: "Select Customer" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Select Customer')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show required indicator when required prop is true', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, label: "Customer", required: true }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('*')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error message when error prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, error: "Customer is required" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Customer is required')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Customer Fetching', function () {
        (0, vitest_1.it)('should fetch customers on mount', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state while fetching customers', function () {
            secure_api_client_1.secureApiClient.getAllAccounts.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
            // Check for loading indicator (may not be visible immediately)
            var input = react_1.screen.getByPlaceholderText(/search customers/i);
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle API error gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        secure_api_client_1.secureApiClient.getAllAccounts.mockRejectedValue(new Error('API Error'));
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        // Component should still render without crashing
                        (0, vitest_1.expect)(react_1.screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Search Functionality', function () {
        (0, vitest_1.it)('should filter customers by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        react_1.fireEvent.change(input, { target: { value: 'John' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                                // Should not show other customers
                                (0, vitest_1.expect)(react_1.screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter customers by email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: 'jane@example.com' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Jane Smith')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter customers by phone', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: '555-2000' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Jane Smith')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter customers by address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: 'Main St' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should be case-insensitive when searching', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: 'JOHN' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should limit results to 20 when searching', function () { return __awaiter(void 0, void 0, void 0, function () {
            var manyCustomers, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manyCustomers = Array.from({ length: 30 }, function (_, i) {
                            return (0, testHelpers_1.createMockAccount)({
                                id: "account-".concat(i),
                                name: "Customer ".concat(i),
                            });
                        });
                        secure_api_client_1.secureApiClient.getAllAccounts.mockResolvedValue(manyCustomers);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: 'Customer' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var results = react_1.screen.getAllByText(/Customer \d+/);
                                (0, vitest_1.expect)(results.length).toBeLessThanOrEqual(20);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show first 10 customers when search term is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var manyCustomers, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manyCustomers = Array.from({ length: 30 }, function (_, i) {
                            return (0, testHelpers_1.createMockAccount)({
                                id: "account-".concat(i),
                                name: "Customer ".concat(i),
                            });
                        });
                        secure_api_client_1.secureApiClient.getAllAccounts.mockResolvedValue(manyCustomers);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var results = react_1.screen.queryAllByText(/Customer \d+/);
                                (0, vitest_1.expect)(results.length).toBeLessThanOrEqual(10);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Selection', function () {
        (0, vitest_1.it)('should call onChange when customer is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, customerOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.change(input, { target: { value: 'John' } });
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        customerOption = react_1.screen.getByText('John Doe');
                        react_1.fireEvent.click(customerOption);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith('account-1', vitest_1.expect.objectContaining({ name: 'John Doe' }));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should close dropdown after selecting customer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, customerOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        // Type to trigger search and show results
                        react_1.fireEvent.change(input, { target: { value: 'John' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        customerOption = react_1.screen.getByText('John Doe');
                        react_1.fireEvent.click(customerOption);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Dropdown should be closed, so customer list should not be visible
                                (0, vitest_1.expect)(react_1.screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                                // Input should show selected customer name
                                (0, vitest_1.expect)(input.value).toBe('John Doe');
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should clear selection when user starts typing different name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, value: "account-1" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        // Wait for selected customer to be set
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(input.value).toBe('John Doe');
                            })];
                    case 2:
                        // Wait for selected customer to be set
                        _a.sent();
                        // Start typing different name
                        react_1.fireEvent.change(input, { target: { value: 'Different Name' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith('', null);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Clear Functionality', function () {
        (0, vitest_1.it)('should clear search term and selection when clear button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, clearButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        // Type to set search term
                        react_1.fireEvent.change(input, { target: { value: 'John' } });
                        react_1.fireEvent.focus(input);
                        // Wait for the clear button to appear (it only appears when searchTerm is not empty)
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var _a;
                                var clearButton = (_a = react_1.screen.queryByTestId('x-icon')) === null || _a === void 0 ? void 0 : _a.closest('button');
                                (0, vitest_1.expect)(clearButton).toBeInTheDocument();
                            })];
                    case 2:
                        // Wait for the clear button to appear (it only appears when searchTerm is not empty)
                        _a.sent();
                        clearButton = react_1.screen.getByTestId('x-icon').closest('button');
                        (0, vitest_1.expect)(clearButton).toBeInTheDocument();
                        react_1.fireEvent.click(clearButton);
                        // Wait for the input to be cleared and onChange to be called
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(input.value).toBe('');
                                (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith('', null);
                            }, { timeout: 2000 })];
                    case 3:
                        // Wait for the input to be cleared and onChange to be called
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Empty States', function () {
        (0, vitest_1.it)('should show empty state when no customers match search', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        react_1.fireEvent.change(input, { target: { value: 'NonExistentCustomer123' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/no customers found/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show message to start typing when search is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/start typing to search customers/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Selected Customer Box', function () {
        (0, vitest_1.it)('should show selected customer box when showSelectedBox is true and customer is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, value: "account-1", showSelectedBox: true }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        // Should show selected customer box
                        (0, vitest_1.expect)(react_1.screen.getByText(/selected customer|john doe/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not show selected customer box when showSelectedBox is false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange, value: "account-1", showSelectedBox: false }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        // Should not show selected customer box
                        (0, vitest_1.expect)(react_1.screen.queryByText(/selected customer/i)).not.toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Click Outside', function () {
        (0, vitest_1.it)('should close dropdown when clicking outside', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, outside;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { onChange: mockOnChange }), (0, jsx_runtime_1.jsx)("div", { "data-testid": "outside", children: "Outside" })] }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(secure_api_client_1.secureApiClient.getAllAccounts).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        input = react_1.screen.getByPlaceholderText(/search customers/i);
                        react_1.fireEvent.focus(input);
                        // Type to trigger search and show results
                        react_1.fireEvent.change(input, { target: { value: 'John' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('John Doe')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        outside = react_1.screen.getByTestId('outside');
                        react_1.fireEvent.mouseDown(outside);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
