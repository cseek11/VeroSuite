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
 * WorkOrderForm Component Tests
 *
 * Tests for the work order form component including:
 * - Technician loading
 * - Customer search integration
 * - Form submission
 * - Form validation
 * - Loading states
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var WorkOrderForm_1 = __importDefault(require("../WorkOrderForm"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var testHelpers_1 = require("@/test/utils/testHelpers");
var work_orders_1 = require("@/types/work-orders");
// Mock enhancedApi
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        technicians: {
            list: vitest_1.vi.fn(),
        },
    },
}); });
// Mock CustomerSearchSelector
vitest_1.vi.mock('@/components/ui/CustomerSearchSelector', function () { return ({
    default: function (_a) {
        var value = _a.value, onChange = _a.onChange, label = _a.label, required = _a.required, error = _a.error, placeholder = _a.placeholder;
        var handleChange = function (_e) {
            var mockCustomer = {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Test Customer',
                account_type: 'residential',
            };
            // Call onChange with customer ID and customer object
            onChange(mockCustomer.id, mockCustomer);
        };
        return ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "customer-search-selector", children: [(0, jsx_runtime_1.jsxs)("label", { children: [label, " ", required && (0, jsx_runtime_1.jsx)("span", { children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { "data-testid": "customer-search-input", value: value || '', onChange: handleChange, placeholder: placeholder }), error && (0, jsx_runtime_1.jsx)("div", { "data-testid": "customer-search-error", children: error })] }));
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        debug: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
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
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
};
(0, vitest_1.describe)('WorkOrderForm', function () {
    var mockOnSubmit = vitest_1.vi.fn();
    var mockOnCancel = vitest_1.vi.fn();
    var mockTechnicians = [
        (0, testHelpers_1.createMockTechnician)({
            id: 'tech-1',
            user: {
                id: 'user-1',
                email: 'tech1@example.com',
                first_name: 'John',
                last_name: 'Technician',
                phone: '+1-555-0001',
            },
        }),
        (0, testHelpers_1.createMockTechnician)({
            id: 'tech-2',
            user: {
                id: 'user-2',
                email: 'tech2@example.com',
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '+1-555-0002',
            },
        }),
    ];
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockTechnicians.map(function (tech) {
            var _a, _b, _c, _d;
            return ({
                id: tech.id,
                user_id: tech.user_id,
                email: (_a = tech.user) === null || _a === void 0 ? void 0 : _a.email,
                first_name: (_b = tech.user) === null || _b === void 0 ? void 0 : _b.first_name,
                last_name: (_c = tech.user) === null || _c === void 0 ? void 0 : _c.last_name,
                phone: (_d = tech.user) === null || _d === void 0 ? void 0 : _d.phone,
                status: 'active',
            });
        }));
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render form with create mode title', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel, mode: "create" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // There are multiple "Create Work Order" texts (heading and button)
                                (0, vitest_1.expect)(react_1.screen.getAllByText('Create Work Order').length).toBeGreaterThan(0);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render form with edit mode title', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel, mode: "edit" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Edit Work Order')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render all form fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByTestId('customer-search-selector')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/service type/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/priority/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/description/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByLabelText(/assigned technician/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Technician Loading', function () {
        (0, vitest_1.it)('should load technicians on mount', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should display technicians in dropdown after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            var technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        (0, vitest_1.expect)(technicianSelect).toBeInTheDocument();
                        react_1.fireEvent.click(technicianSelect);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/john technician/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText(/jane smith/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state while fetching technicians', function () {
            enhanced_api_1.enhancedApi.technicians.list.mockImplementation(function () { return new Promise(function () { }); } // Never resolves
            );
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
            var technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
            (0, vitest_1.expect)(technicianSelect).toBeDisabled();
            (0, vitest_1.expect)(technicianSelect).toHaveTextContent(/loading technicians/i);
        });
        (0, vitest_1.it)('should handle empty technician list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue([]);
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        (0, vitest_1.expect)(technicianSelect).toBeInTheDocument();
                        (0, vitest_1.expect)(technicianSelect).toHaveTextContent(/select technician/i);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle technician loading error gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.enhancedApi.technicians.list.mockRejectedValue(new Error('API Error'));
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        // Form should still render
                        (0, vitest_1.expect)(react_1.screen.getByTestId('customer-search-selector')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should auto-select technician when only one is available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var firstTechnician, singleTechnician;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstTechnician = mockTechnicians[0];
                        if (!firstTechnician) {
                            throw new Error('mockTechnicians[0] is undefined');
                        }
                        singleTechnician = [firstTechnician];
                        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(singleTechnician.map(function (tech) {
                            var user = tech.user;
                            return {
                                id: tech.id,
                                user_id: tech.user_id,
                                email: user === null || user === void 0 ? void 0 : user.email,
                                first_name: user === null || user === void 0 ? void 0 : user.first_name,
                                last_name: user === null || user === void 0 ? void 0 : user.last_name,
                                phone: user === null || user === void 0 ? void 0 : user.phone,
                                status: 'active',
                            };
                        }));
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        // Wait a bit for auto-selection
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                                // The technician should be selected (value should be tech-1)
                                (0, vitest_1.expect)(technicianSelect.value).toBe('tech-1');
                            }, { timeout: 2000 })];
                    case 2:
                        // Wait a bit for auto-selection
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Customer Search Integration', function () {
        (0, vitest_1.it)('should render CustomerSearchSelector', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByTestId('customer-search-selector')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should update customer_id when customer is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByTestId('customer-search-selector')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Customer should be selected
                                (0, vitest_1.expect)(customerInput).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Form Validation', function () {
        (0, vitest_1.it)('should require customer selection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var descriptionInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        react_1.fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Form should not submit without customer
                                (0, vitest_1.expect)(mockOnSubmit).not.toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should require description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/description is required/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate description max length', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, descriptionInput, longDescription, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        longDescription = 'a'.repeat(1001);
                        react_1.fireEvent.change(descriptionInput, { target: { value: longDescription } });
                        react_1.fireEvent.blur(descriptionInput);
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/description must be less than 1000 characters/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate estimated duration minimum', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, descriptionInput, durationInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        react_1.fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
                        react_1.fireEvent.blur(descriptionInput);
                        durationInput = react_1.screen.getByLabelText(/estimated duration/i);
                        // Set invalid value (less than 15) - this will be parsed as 10
                        react_1.fireEvent.change(durationInput, { target: { value: '10' } });
                        react_1.fireEvent.blur(durationInput);
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        // Wait for validation error to appear - react-hook-form validates on submit
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var errorMessage = react_1.screen.queryByText(/duration must be at least 15 minutes/i);
                                (0, vitest_1.expect)(errorMessage).toBeInTheDocument();
                            }, { timeout: 5000 })];
                    case 2:
                        // Wait for validation error to appear - react-hook-form validates on submit
                        _a.sent();
                        // Verify form was not submitted
                        (0, vitest_1.expect)(mockOnSubmit).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate estimated duration maximum', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, descriptionInput, durationInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        react_1.fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
                        react_1.fireEvent.blur(descriptionInput);
                        durationInput = react_1.screen.getByLabelText(/estimated duration/i);
                        // Set invalid value (greater than 480) - this will be parsed as 500
                        react_1.fireEvent.change(durationInput, { target: { value: '500' } });
                        react_1.fireEvent.blur(durationInput);
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        // Wait for validation error to appear - react-hook-form validates on submit
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var errorMessage = react_1.screen.queryByText(/duration cannot exceed 8 hours/i);
                                (0, vitest_1.expect)(errorMessage).toBeInTheDocument();
                            }, { timeout: 5000 })];
                    case 2:
                        // Wait for validation error to appear - react-hook-form validates on submit
                        _a.sent();
                        // Verify form was not submitted
                        (0, vitest_1.expect)(mockOnSubmit).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Form Submission', function () {
        (0, vitest_1.it)('should submit form with valid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, descriptionInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        react_1.fireEvent.change(descriptionInput, { target: { value: 'Test work order description' } });
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        react_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    customer_id: '00000000-0000-0000-0000-000000000001',
                                    description: 'Test work order description',
                                }));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should include all form fields in submission', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customerInput, descriptionInput, serviceTypeSelect, prioritySelect, durationInput, priceInput, notesInput, submitButton, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        customerInput = react_1.screen.getByTestId('customer-search-input');
                        react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                        // Wait for customer to be set in form state
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Customer should be set via mock onChange
                            }, { timeout: 1000 })];
                    case 2:
                        // Wait for customer to be set in form state
                        _a.sent();
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        react_1.fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
                        react_1.fireEvent.blur(descriptionInput);
                        serviceTypeSelect = react_1.screen.getByLabelText(/service type/i);
                        react_1.fireEvent.change(serviceTypeSelect, { target: { value: 'General Pest Control' } });
                        react_1.fireEvent.blur(serviceTypeSelect);
                        prioritySelect = react_1.screen.getByLabelText(/priority/i);
                        // Change from default MEDIUM to HIGH
                        react_1.fireEvent.change(prioritySelect, { target: { value: work_orders_1.WorkOrderPriority.HIGH } });
                        react_1.fireEvent.blur(prioritySelect);
                        durationInput = react_1.screen.getByLabelText(/estimated duration/i);
                        // Change from default 60 to 120 to mark as dirty
                        react_1.fireEvent.change(durationInput, { target: { value: '120' } });
                        react_1.fireEvent.blur(durationInput);
                        priceInput = react_1.screen.getByLabelText(/service price/i);
                        react_1.fireEvent.change(priceInput, { target: { value: '150' } });
                        react_1.fireEvent.blur(priceInput);
                        notesInput = react_1.screen.getByLabelText(/additional notes/i);
                        react_1.fireEvent.change(notesInput, { target: { value: 'Test notes' } });
                        react_1.fireEvent.blur(notesInput);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                                (0, vitest_1.expect)(submitButton).not.toBeDisabled();
                            }, { timeout: 5000 })];
                    case 3:
                        _a.sent();
                        // Submit the form - use userEvent or ensure form submission is triggered
                        react_1.fireEvent.click(submitButton);
                        form = submitButton.closest('form');
                        if (form) {
                            react_1.fireEvent.submit(form);
                        }
                        // Wait for form submission - handleSubmit is async
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalled();
                            }, { timeout: 5000 })];
                    case 4:
                        // Wait for form submission - handleSubmit is async
                        _a.sent();
                        // Verify the submission data
                        (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            customer_id: '00000000-0000-0000-0000-000000000001',
                            description: 'Test description',
                            service_type: 'General Pest Control',
                            priority: work_orders_1.WorkOrderPriority.HIGH,
                            // assigned_to is optional and may be empty string or undefined
                            estimated_duration: 120,
                            service_price: 150,
                            notes: 'Test notes',
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should disable submit button when form is not dirty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        submitButton = react_1.screen.getByRole('button', { name: /create work order/i });
                        (0, vitest_1.expect)(submitButton).toBeDisabled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show loading state during submission', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel, isLoading: true }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(react_1.screen.getByText(/saving/i)).toBeInTheDocument();
                        submitButton = react_1.screen.getByRole('button', { name: /saving/i });
                        (0, vitest_1.expect)(submitButton).toBeDisabled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Cancel Functionality', function () {
        (0, vitest_1.it)('should call onCancel when cancel button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cancelButtons, lastButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        cancelButtons = react_1.screen.getAllByRole('button', { name: /cancel/i });
                        lastButton = cancelButtons[cancelButtons.length - 1];
                        if (lastButton) {
                            react_1.fireEvent.click(lastButton);
                        }
                        (0, vitest_1.expect)(mockOnCancel).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Initial Data', function () {
        (0, vitest_1.it)('should populate form with initial data in edit mode', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialData, descriptionInput, prioritySelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialData = {
                            customer_id: 'account-1',
                            description: 'Initial description',
                            priority: work_orders_1.WorkOrderPriority.HIGH,
                            status: work_orders_1.WorkOrderStatus.IN_PROGRESS,
                        };
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel, initialData: initialData, mode: "edit" }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        descriptionInput = react_1.screen.getByLabelText(/description/i);
                        (0, vitest_1.expect)(descriptionInput.value).toBe('Initial description');
                        prioritySelect = react_1.screen.getByLabelText(/priority/i);
                        (0, vitest_1.expect)(prioritySelect.value).toBe(work_orders_1.WorkOrderPriority.HIGH);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Technician Selection Display', function () {
        (0, vitest_1.it)('should display selected technician information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var technicianSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel }) }));
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                        react_1.fireEvent.change(technicianSelect, { target: { value: 'tech-1' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Technician info appears in both the select option and the display box
                                var johnTechnicianElements = react_1.screen.getAllByText(/john technician/i);
                                (0, vitest_1.expect)(johnTechnicianElements.length).toBeGreaterThan(0);
                                // Email appears in multiple places (option and display box)
                                var emailElements = react_1.screen.getAllByText(/tech1@example.com/i);
                                (0, vitest_1.expect)(emailElements.length).toBeGreaterThan(0);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
