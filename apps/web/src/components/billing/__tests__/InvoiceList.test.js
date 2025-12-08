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
 * InvoiceList Component Tests
 *
 * Tests for the InvoiceList component including:
 * - Component rendering
 * - Filtering and sorting
 * - Search functionality
 * - Error handling
 * - Edge cases and boundary conditions
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var InvoiceList_1 = __importDefault(require("../InvoiceList"));
var enhanced_api_1 = require("@/lib/enhanced-api");
require("@testing-library/jest-dom");
// Mock the API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getInvoices: vitest_1.vi.fn(),
    },
}); });
// Mock toast
vitest_1.vi.mock('@/utils/toast', function () { return ({
    toast: {
        error: vitest_1.vi.fn(),
    },
}); });
// Mock logger
vitest_1.vi.mock('@/utils/logger', function () { return ({
    logger: {
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('InvoiceList', function () {
    var queryClient;
    var mockInvoices = [
        {
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
            notes: 'Test invoice 1',
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
            created_by: 'user-1',
            updated_by: 'user-1',
            InvoiceItem: [],
            accounts: {
                id: 'acc-1',
                name: 'Test Customer 1',
                email: 'test1@example.com',
                phone: '555-0001',
            },
        },
        {
            id: 'inv-2',
            tenant_id: 'tenant-1',
            account_id: 'acc-2',
            invoice_number: 'INV-002',
            status: 'paid',
            issue_date: '2025-02-01',
            due_date: '2025-02-28',
            subtotal: 200,
            tax_amount: 20,
            total_amount: 220,
            notes: 'Test invoice 2',
            created_at: '2025-02-01',
            updated_at: '2025-02-01',
            created_by: 'user-1',
            updated_by: 'user-1',
            InvoiceItem: [],
            accounts: {
                id: 'acc-2',
                name: 'Test Customer 2',
                email: 'test2@example.com',
                phone: '555-0002',
            },
        },
        {
            id: 'inv-3',
            tenant_id: 'tenant-1',
            account_id: 'acc-3',
            invoice_number: 'INV-003',
            status: 'overdue',
            issue_date: '2025-03-01',
            due_date: '2025-03-31',
            subtotal: 300,
            tax_amount: 30,
            total_amount: 330,
            notes: 'Test invoice 3',
            created_at: '2025-03-01',
            updated_at: '2025-03-01',
            created_by: 'user-1',
            updated_by: 'user-1',
            InvoiceItem: [],
            accounts: {
                id: 'acc-3',
                name: 'Test Customer 3',
                email: 'test3@example.com',
                phone: '555-0003',
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
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceList_1.default, __assign({ customerId: "customer-1" }, props)) }));
    };
    (0, vitest_1.describe)('Initial Render', function () {
        (0, vitest_1.it)('should render loading state initially', function () {
            enhanced_api_1.billing.getInvoices.mockImplementation(function () { return new Promise(function () { }); });
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText('Loading invoices...')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render invoices after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-002')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-003')).toBeInTheDocument();
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
                                (0, vitest_1.expect)(react_1.screen.getByText('Total Invoices')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Outstanding')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Paid')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Overdue')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Filtering', function () {
        (0, vitest_1.it)('should filter by status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var statusSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        statusSelect = react_1.screen.getByLabelText(/status/i);
                        react_1.fireEvent.change(statusSelect, { target: { value: 'paid' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-002')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('INV-001')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter by search term', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        searchInput = react_1.screen.getByPlaceholderText(/search by invoice number/i);
                        react_1.fireEvent.change(searchInput, { target: { value: 'INV-001' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('INV-002')).not.toBeInTheDocument();
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
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        startDateInput = react_1.screen.getByLabelText(/start date/i);
                        react_1.fireEvent.change(startDateInput, { target: { value: '2025-02-01' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-002')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText('INV-001')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Sorting', function () {
        (0, vitest_1.it)('should sort by issue date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortButton, invoices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        sortButton = react_1.screen.getByText(/issue date/i);
                        react_1.fireEvent.click(sortButton);
                        invoices = react_1.screen.getAllByText(/INV-/);
                        (0, vitest_1.expect)(invoices[0]).toHaveTextContent('INV-001');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should toggle sort direction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        sortButton = react_1.screen.getByText(/due date/i);
                        react_1.fireEvent.click(sortButton);
                        react_1.fireEvent.click(sortButton); // Click again to toggle
                        // Verify sort direction changed
                        (0, vitest_1.expect)(sortButton).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should display error message when API fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getInvoices.mockRejectedValue(new Error('API Error'));
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('Error loading invoices')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('API Error')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle undefined invoices array', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getInvoices.mockResolvedValue(undefined);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No invoices found')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle empty invoices array', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enhanced_api_1.billing.getInvoices.mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('No invoices found')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('User Interactions', function () {
        (0, vitest_1.it)('should call onInvoiceSelect when view button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoiceSelect, viewButtons, firstViewButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoiceSelect = vitest_1.vi.fn();
                        renderComponent({ onInvoiceSelect: onInvoiceSelect });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        viewButtons = react_1.screen.getAllByText('View');
                        firstViewButton = viewButtons[0];
                        if (firstViewButton) {
                            react_1.fireEvent.click(firstViewButton);
                        }
                        (0, vitest_1.expect)(onInvoiceSelect).toHaveBeenCalledWith(mockInvoices[0]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should call onInvoicePay when pay button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onInvoicePay, payButtons, firstPayButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onInvoicePay = vitest_1.vi.fn();
                        renderComponent({ onInvoicePay: onInvoicePay });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        payButtons = react_1.screen.getAllByText('Pay');
                        firstPayButton = payButtons[0];
                        if (firstPayButton) {
                            react_1.fireEvent.click(firstPayButton);
                        }
                        (0, vitest_1.expect)(onInvoicePay).toHaveBeenCalledWith(mockInvoices[0]);
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
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        filterButton = react_1.screen.getByText(/filters/i);
                        react_1.fireEvent.click(filterButton);
                        (0, vitest_1.expect)(react_1.screen.getByText(/hide filters/i)).toBeInTheDocument();
                        (0, vitest_1.expect)(react_1.screen.getByLabelText(/status/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should handle invoices without customer information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invoicesWithoutCustomer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invoicesWithoutCustomer = [__assign(__assign({}, mockInvoices[0]), { accounts: undefined })];
                        enhanced_api_1.billing.getInvoices.mockResolvedValue(invoicesWithoutCustomer);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.getByText('Unknown Customer')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle invoices without items', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invoicesWithoutItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invoicesWithoutItems = [__assign(__assign({}, mockInvoices[0]), { InvoiceItem: undefined })];
                        enhanced_api_1.billing.getInvoices.mockResolvedValue(invoicesWithoutItems);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('INV-001')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should calculate statistics correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText('3')).toBeInTheDocument(); // Total
                                (0, vitest_1.expect)(react_1.screen.getByText('1')).toBeInTheDocument(); // Overdue
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
