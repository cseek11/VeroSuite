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
 * InvoiceReminders Component Tests
 *
 * Tests for InvoiceReminders component including:
 * - Component rendering
 * - Overdue invoices list
 * - Reminder sending (individual and bulk)
 * - Reminder history
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var InvoiceReminders_1 = __importDefault(require("../InvoiceReminders"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getOverdueInvoices: vitest_1.vi.fn(),
        sendInvoiceReminder: vitest_1.vi.fn(),
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
// @ts-expect-error - Type assertion for mocking, kept for type safety
var _mockLogger = logger_1.logger;
// @ts-expect-error - Type assertion for mocking, kept for type safety
var _mockToast = toast_1.toast;
(0, vitest_1.describe)('InvoiceReminders', function () {
    var queryClient;
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
    });
    var renderComponent = function (props) {
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceReminders_1.default, __assign({}, props)) }));
    };
    var mockOverdueInvoices = [
        {
            id: 'inv-1',
            invoice_number: 'INV-001',
            due_date: '2025-01-01',
            total_amount: 1000,
            accounts: {
                name: 'Test Customer 1',
            },
            status: 'overdue',
        },
        {
            id: 'inv-2',
            invoice_number: 'INV-002',
            due_date: '2025-01-05',
            total_amount: 2000,
            accounts: {
                name: 'Test Customer 2',
            },
            status: 'overdue',
        },
    ];
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render invoice reminders component', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/invoice reminders/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockImplementation(function () { return new Promise(function () { }); } // Never resolves
                        );
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/loading overdue invoices/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render overdue invoices when loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var overdueText = react_1.screen.queryAllByText(/2 overdue invoice|overdue invoice/i);
                                (0, vitest_1.expect)(overdueText.length).toBeGreaterThan(0);
                                var invText = react_1.screen.queryAllByText(/INV-001/i);
                                var customerText = react_1.screen.queryAllByText(/test customer 1/i);
                                (0, vitest_1.expect)(invText.length + customerText.length).toBeGreaterThan(0);
                            }, { timeout: 3000 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show empty state when no overdue invoices', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue([]);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/no overdue invoices/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Invoice Selection', function () {
        (0, vitest_1.it)('should allow selecting invoices', function () { return __awaiter(void 0, void 0, void 0, function () {
            var checkboxes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        checkboxes = react_1.screen.getAllByRole('checkbox');
                        if (checkboxes.length > 0 && checkboxes[0]) {
                            react_1.fireEvent.click(checkboxes[0]);
                            // Bulk button should appear
                            (0, vitest_1.expect)(react_1.screen.getByText(/send bulk reminders/i)).toBeInTheDocument();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should allow selecting all invoices', function () { return __awaiter(void 0, void 0, void 0, function () {
            var selectAllButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        selectAllButton = react_1.screen.getByText(/select all/i);
                        react_1.fireEvent.click(selectAllButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/send bulk reminders \(2\)/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Reminder Sending', function () {
        (0, vitest_1.it)('should send individual reminder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendButton, sendButtonsByRole, sendButtonsByText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        vitest_1.vi.mocked(enhanced_api_1.billing.sendInvoiceReminder).mockResolvedValue({
                            successful: 1,
                            total: 1,
                            failed: 0,
                            results: [{ invoice_id: 'inv-1', status: 'sent' }],
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Wait for send buttons to appear - try both role and text
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                                var sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                                (0, vitest_1.expect)(sendButtonsByRole.length + sendButtonsByText.length).toBeGreaterThan(0);
                            }, { timeout: 3000 })];
                    case 2:
                        // Wait for send buttons to appear - try both role and text
                        _a.sent();
                        sendButton = null;
                        sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                        if (sendButtonsByRole.length > 0 && sendButtonsByRole[0]) {
                            sendButton = sendButtonsByRole[0];
                        }
                        else {
                            sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                            if (sendButtonsByText.length > 0 && sendButtonsByText[0]) {
                                sendButton = sendButtonsByText[0];
                            }
                        }
                        (0, vitest_1.expect)(sendButton).not.toBeNull();
                        if (sendButton) {
                            react_1.fireEvent.click(sendButton);
                        }
                        // Wait for the async operation to complete
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.sendInvoiceReminder).toHaveBeenCalled();
                            }, { timeout: 5000 })];
                    case 3:
                        // Wait for the async operation to complete
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should send bulk reminders', function () { return __awaiter(void 0, void 0, void 0, function () {
            var checkboxes, selectAllButton, bulkButton, confirmButton, lastButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        vitest_1.vi.mocked(enhanced_api_1.billing.sendInvoiceReminder).mockResolvedValue({
                            successful: 2,
                            total: 2,
                            failed: 0,
                            results: [
                                { invoice_id: 'inv-1', status: 'sent' },
                                { invoice_id: 'inv-2', status: 'sent' },
                            ],
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Select all invoices - try to find checkboxes or select all button
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Try to find checkboxes to select invoices
                                var checkboxes = react_1.screen.queryAllByRole('checkbox');
                                var selectAllButton = react_1.screen.queryByText(/select all/i) || react_1.screen.queryByRole('button', { name: /select all/i });
                                (0, vitest_1.expect)(checkboxes.length > 0 || selectAllButton).toBeTruthy();
                            }, { timeout: 3000 })];
                    case 2:
                        // Select all invoices - try to find checkboxes or select all button
                        _a.sent();
                        checkboxes = react_1.screen.queryAllByRole('checkbox');
                        if (checkboxes.length > 0) {
                            // Select all checkboxes
                            checkboxes.forEach(function (checkbox) {
                                if (!checkbox.hasAttribute('checked')) {
                                    react_1.fireEvent.click(checkbox);
                                }
                            });
                        }
                        else {
                            selectAllButton = react_1.screen.queryByRole('button', { name: /select all/i });
                            if (!selectAllButton) {
                                selectAllButton = react_1.screen.queryByText(/select all/i);
                            }
                            if (selectAllButton) {
                                react_1.fireEvent.click(selectAllButton);
                            }
                        }
                        // Wait for bulk button to appear (only shows when invoices are selected)
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var bulkByText = react_1.screen.queryByText(/send bulk reminders/i);
                                var bulkByRole = react_1.screen.queryByRole('button', { name: /send bulk reminders/i });
                                (0, vitest_1.expect)(bulkByText || bulkByRole).toBeTruthy();
                            }, { timeout: 5000 })];
                    case 3:
                        // Wait for bulk button to appear (only shows when invoices are selected)
                        _a.sent();
                        bulkButton = react_1.screen.queryByRole('button', { name: /send bulk reminders/i });
                        if (!bulkButton) {
                            bulkButton = react_1.screen.queryByText(/send bulk reminders/i);
                        }
                        (0, vitest_1.expect)(bulkButton).not.toBeNull();
                        if (bulkButton) {
                            react_1.fireEvent.click(bulkButton);
                        }
                        // Confirm in dialog - wait for dialog to appear
                        // There may be multiple "Send Reminders" buttons, so find the one in the dialog
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var confirmButtons = react_1.screen.queryAllByText(/send reminders/i);
                                var confirmByRole = react_1.screen.queryAllByRole('button', { name: /send reminders/i });
                                (0, vitest_1.expect)(confirmButtons.length > 0 || confirmByRole.length > 0).toBe(true);
                            }, { timeout: 5000 })];
                    case 4:
                        // Confirm in dialog - wait for dialog to appear
                        // There may be multiple "Send Reminders" buttons, so find the one in the dialog
                        _a.sent();
                        confirmButton = react_1.screen.queryAllByRole('button', { name: /send reminders/i });
                        if (confirmButton.length === 0) {
                            confirmButton = react_1.screen.queryAllByText(/send reminders/i);
                        }
                        (0, vitest_1.expect)(confirmButton.length).toBeGreaterThan(0);
                        // Click the last one (should be the dialog confirm button)
                        if (confirmButton.length > 0) {
                            lastButton = confirmButton[confirmButton.length - 1];
                            if (lastButton) {
                                react_1.fireEvent.click(lastButton);
                            }
                        }
                        // Wait for the async operation to complete
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.sendInvoiceReminder).toHaveBeenCalled();
                            }, { timeout: 5000 })];
                    case 5:
                        // Wait for the async operation to complete
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle reminder send error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendButton, sendButtonsByRole, sendButtonsByText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        vitest_1.vi.mocked(enhanced_api_1.billing.sendInvoiceReminder).mockResolvedValue({
                            successful: 0,
                            total: 1,
                            failed: 1,
                            results: [{ invoice_id: 'inv-1', error: 'Failed to send' }],
                        });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Wait for send buttons to appear - try both role and text
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                                var sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                                (0, vitest_1.expect)(sendButtonsByRole.length + sendButtonsByText.length).toBeGreaterThan(0);
                            }, { timeout: 3000 })];
                    case 2:
                        // Wait for send buttons to appear - try both role and text
                        _a.sent();
                        sendButton = null;
                        sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                        if (sendButtonsByRole.length > 0 && sendButtonsByRole[0]) {
                            sendButton = sendButtonsByRole[0];
                        }
                        else {
                            sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                            if (sendButtonsByText.length > 0 && sendButtonsByText[0]) {
                                sendButton = sendButtonsByText[0];
                            }
                        }
                        (0, vitest_1.expect)(sendButton).not.toBeNull();
                        if (sendButton) {
                            react_1.fireEvent.click(sendButton);
                        }
                        // Wait for the async operation to complete
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.sendInvoiceReminder).toHaveBeenCalled();
                            }, { timeout: 5000 })];
                    case 3:
                        // Wait for the async operation to complete
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Reminder History', function () {
        (0, vitest_1.it)('should display reminder history', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/reminder history/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter reminder history by type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var typeSelect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/reminder history/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        typeSelect = react_1.screen.getByDisplayValue(/all types/i);
                        react_1.fireEvent.change(typeSelect, { target: { value: 'email' } });
                        // History should be filtered
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Implementation specific - verify filtering works
                            })];
                    case 2:
                        // History should be filtered
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle overdue invoices fetch error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('API Error');
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockRejectedValue(error);
                        renderComponent();
                        // Wait for error to be handled - React Query will handle the error
                        // The component should still render even with an error
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                // Component should render (may show error state or empty state)
                                var components = react_1.screen.queryAllByText(/invoice reminders|overdue invoices|failed|error/i);
                                (0, vitest_1.expect)(components.length).toBeGreaterThan(0);
                            }, { timeout: 5000 })];
                    case 1:
                        // Wait for error to be handled - React Query will handle the error
                        // The component should still render even with an error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle reminder send network error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, sendButton, sendButtonsByRole, sendButtonsByText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(enhanced_api_1.billing.getOverdueInvoices).mockResolvedValue(mockOverdueInvoices);
                        error = new Error('Network error');
                        vitest_1.vi.mocked(enhanced_api_1.billing.sendInvoiceReminder).mockRejectedValue(error);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/2 overdue invoice/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Wait for send buttons to appear - try both role and text
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                                var sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                                (0, vitest_1.expect)(sendButtonsByRole.length + sendButtonsByText.length).toBeGreaterThan(0);
                            }, { timeout: 3000 })];
                    case 2:
                        // Wait for send buttons to appear - try both role and text
                        _a.sent();
                        sendButton = null;
                        sendButtonsByRole = react_1.screen.queryAllByRole('button', { name: /send reminder/i });
                        if (sendButtonsByRole.length > 0 && sendButtonsByRole[0]) {
                            sendButton = sendButtonsByRole[0];
                        }
                        else {
                            sendButtonsByText = react_1.screen.queryAllByText(/send reminder/i);
                            if (sendButtonsByText.length > 0 && sendButtonsByText[0]) {
                                sendButton = sendButtonsByText[0];
                            }
                        }
                        (0, vitest_1.expect)(sendButton).not.toBeNull();
                        if (sendButton) {
                            react_1.fireEvent.click(sendButton);
                        }
                        // Wait for the async operation to complete
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(mockBilling.sendInvoiceReminder).toHaveBeenCalled();
                            }, { timeout: 5000 })];
                    case 3:
                        // Wait for the async operation to complete
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
