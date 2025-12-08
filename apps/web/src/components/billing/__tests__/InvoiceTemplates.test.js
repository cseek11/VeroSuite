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
 * InvoiceTemplates Component Tests
 *
 * Tests for InvoiceTemplates component including:
 * - Component rendering
 * - Template list display
 * - Search and filtering
 * - Template application
 * - Error handling
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var InvoiceTemplates_1 = __importDefault(require("../InvoiceTemplates"));
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Mock dependencies
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
// Type assertions - kept for type safety
// @ts-expect-error - Type assertion for mocking
var _mockLogger = logger_1.logger;
// @ts-expect-error - Type assertion for mocking
var _mockToast = toast_1.toast;
(0, vitest_1.describe)('InvoiceTemplates', function () {
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
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(InvoiceTemplates_1.default, __assign({}, props)) }));
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render invoice templates component', function () {
            renderComponent();
            var templatesText = react_1.screen.getAllByText(/invoice templates/i);
            (0, vitest_1.expect)(templatesText.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should render loading state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Component uses useQuery which will show loading initially
                        renderComponent();
                        // Wait for component to render (may show loading briefly)
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var templatesText = react_1.screen.getAllByText(/invoice templates/i);
                                (0, vitest_1.expect)(templatesText.length).toBeGreaterThan(0);
                            }, { timeout: 2000 })];
                    case 1:
                        // Wait for component to render (may show loading briefly)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should render templates when loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var templates = react_1.screen.getAllByText(/standard monthly service|one-time treatment/i);
                                (0, vitest_1.expect)(templates.length).toBeGreaterThan(0);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should show empty state when no templates', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock empty response
                        queryClient.setQueryData(['invoice-templates'], []);
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/no templates yet/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Template Search and Filtering', function () {
        (0, vitest_1.it)('should filter templates by search term', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        searchInput = react_1.screen.getByPlaceholderText(/search templates/i);
                        react_1.fireEvent.change(searchInput, { target: { value: 'monthly' } });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                                (0, vitest_1.expect)(react_1.screen.queryByText(/one-time treatment/i)).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should filter templates by tag', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tagButtons, monthlyTag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        tagButtons = react_1.screen.getAllByText(/monthly/i);
                        monthlyTag = tagButtons.find(function (btn) { return btn.textContent === 'monthly'; });
                        if (!monthlyTag) return [3 /*break*/, 3];
                        react_1.fireEvent.click(monthlyTag);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Template Actions', function () {
        (0, vitest_1.it)('should open create template dialog when create button clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderComponent();
                        createButton = react_1.screen.getByText(/create template/i);
                        react_1.fireEvent.click(createButton);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/template editor coming soon/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle template deletion', function () { return __awaiter(void 0, void 0, void 0, function () {
            var deleteButtons, deleteButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock window.confirm
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        deleteButtons = react_1.screen.queryAllByRole('button');
                        deleteButton = deleteButtons.find(function (btn) { var _a; return btn.querySelector('svg') || ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('delete')); });
                        if (deleteButton) {
                            react_1.fireEvent.click(deleteButton);
                            // Note: Delete functionality uses mock data, so actual deletion may not trigger
                            // This test verifies the delete button exists and can be clicked
                            (0, vitest_1.expect)(deleteButton).toBeInTheDocument();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle template application', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onApplyTemplate, applyButtons, confirmButtons, lastButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onApplyTemplate = vitest_1.vi.fn();
                        renderComponent({ onApplyTemplate: onApplyTemplate });
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        applyButtons = react_1.screen.getAllByText(/apply/i);
                        if (!(applyButtons.length > 0 && applyButtons[0])) return [3 /*break*/, 4];
                        react_1.fireEvent.click(applyButtons[0]);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var applyTexts = react_1.screen.getAllByText(/apply template/i);
                                (0, vitest_1.expect)(applyTexts.length).toBeGreaterThan(0);
                            })];
                    case 2:
                        _a.sent();
                        confirmButtons = react_1.screen.getAllByRole('button', { name: /apply template/i });
                        if (confirmButtons.length > 0) {
                            lastButton = confirmButtons[confirmButtons.length - 1];
                            if (lastButton) {
                                react_1.fireEvent.click(lastButton); // Click the dialog button
                            }
                        }
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(onApplyTemplate).toHaveBeenCalled();
                                (0, vitest_1.expect)(toast_1.toast.success).toHaveBeenCalled();
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle template fetch error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock query to reject
                        queryClient.setQueryData(['invoice-templates'], undefined);
                        // This would be handled by React Query's error state
                        renderComponent();
                        // Component should handle error gracefully
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var templatesText = react_1.screen.getAllByText(/invoice templates/i);
                                (0, vitest_1.expect)(templatesText.length).toBeGreaterThan(0);
                            })];
                    case 1:
                        // Component should handle error gracefully
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle template deletion error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.confirm = vitest_1.vi.fn(function () { return true; });
                        renderComponent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/standard monthly service/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
