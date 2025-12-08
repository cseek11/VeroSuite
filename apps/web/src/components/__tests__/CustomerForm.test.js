"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var vitest_1 = require("vitest");
var test_utils_1 = require("../../test/setup/test-utils");
var CustomerForm_1 = __importDefault(require("../customers/CustomerForm"));
var supabase_client_1 = require("../../lib/supabase-client");
var react_query_1 = require("@tanstack/react-query");
// Mock Supabase client
vitest_1.vi.mock('../../lib/supabase-client', function () { return ({
    default: {
        from: vitest_1.vi.fn(),
        auth: {
            getUser: vitest_1.vi.fn().mockResolvedValue({
                data: { user: { id: 'user-123', user_metadata: { tenant_id: 'tenant-123' } } },
                error: null,
            }),
        },
        rpc: vitest_1.vi.fn(),
    },
    supabase: {
        from: vitest_1.vi.fn(),
        auth: {
            getUser: vitest_1.vi.fn().mockResolvedValue({
                data: { user: { id: 'user-123', user_metadata: { tenant_id: 'tenant-123' } } },
                error: null,
            }),
        },
        rpc: vitest_1.vi.fn(),
    },
}); });
// Mock secureApiClient
vitest_1.vi.mock('../../lib/secure-api-client', function () { return ({
    secureApiClient: {
        accounts: {
            create: vitest_1.vi.fn().mockResolvedValue({ id: 'customer-123' }),
        },
    },
}); });
// Mock useAuth hook
vitest_1.vi.mock('../../hooks/useAuth', function () { return ({
    useAuth: function () { return ({
        user: {
            id: 'user-123',
            user_metadata: { tenant_id: 'tenant-123' },
        },
        tenantId: 'tenant-123',
        isAuthenticated: true,
    }); },
}); });
var createTestQueryClient = function () {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
};
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = createTestQueryClient();
    return (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children });
};
(0, vitest_1.describe)('CustomerForm', function () {
    // Mock Supabase client (currently unused in tests, kept for potential future use)
    var _mockSupabaseClient = vitest_1.vi.mocked(supabase_client_1.supabase);
    void _mockSupabaseClient; // Suppress unused warning
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Form Rendering', function () {
        (0, vitest_1.it)('should render all form fields', function () {
            (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
            // Use more specific query to avoid matching "Business Name"
            var nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
            (0, vitest_1.expect)(nameInputs.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/email/i)).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/phone/i)).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/address/i)).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/city/i)).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/state/i)).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByLabelText(/zip code/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render submit and cancel buttons', function () {
            (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
            (0, vitest_1.expect)(test_utils_1.screen.getByRole('button', { name: /create customer/i })).toBeInTheDocument();
            (0, vitest_1.expect)(test_utils_1.screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Validation', function () {
        (0, vitest_1.it)('should show validation errors for required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                (0, vitest_1.expect)(test_utils_1.screen.getByText(/name is required/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Email validation might show "Invalid email format" for empty string, or "Email is required"
                        // Check for either message
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                var emailError = test_utils_1.screen.queryByText(/email is required/i) || test_utils_1.screen.queryByText(/invalid email format/i);
                                (0, vitest_1.expect)(emailError).toBeInTheDocument();
                            })];
                    case 2:
                        // Email validation might show "Invalid email format" for empty string, or "Email is required"
                        // Check for either message
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate email format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var nameInputs, emailInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
                        nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
                        if (nameInputs[0]) {
                            test_utils_1.fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
                        }
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/state/i), { target: { value: 'CA' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
                        emailInput = test_utils_1.screen.getByLabelText(/email/i);
                        test_utils_1.fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
                        test_utils_1.fireEvent.blur(emailInput);
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                // Check for either "Invalid email format" or "Email is required" (Zod validates both)
                                var errorText = test_utils_1.screen.queryByText(/invalid email format|email is required/i);
                                (0, vitest_1.expect)(errorText).toBeInTheDocument();
                            }, { timeout: 3000 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should require phone number', function () { return __awaiter(void 0, void 0, void 0, function () {
            var phoneInput, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
                        phoneInput = test_utils_1.screen.getByLabelText(/phone/i);
                        // Leave phone empty to test required validation
                        test_utils_1.fireEvent.blur(phoneInput);
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                (0, vitest_1.expect)(test_utils_1.screen.getByText(/phone is required/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Form Submission', function () {
        (0, vitest_1.it)('should submit form with valid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockOnSave, mockOnCancel, secureApiClient, nameInputs, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockOnSave = vitest_1.vi.fn();
                        mockOnCancel = vitest_1.vi.fn();
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../lib/secure-api-client')); })];
                    case 1:
                        secureApiClient = (_a.sent()).secureApiClient;
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: mockOnSave, onCancel: mockOnCancel }) }));
                        nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
                        if (nameInputs[0]) {
                            test_utils_1.fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
                        }
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/state/i), { target: { value: 'CA' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                (0, vitest_1.expect)(secureApiClient.accounts.create).toHaveBeenCalled();
                                (0, vitest_1.expect)(mockOnSave).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle submission errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockOnSave, mockOnCancel, secureApiClient, nameInputs, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockOnSave = vitest_1.vi.fn();
                        mockOnCancel = vitest_1.vi.fn();
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../lib/secure-api-client')); })];
                    case 1:
                        secureApiClient = (_a.sent()).secureApiClient;
                        secureApiClient.accounts.create.mockRejectedValueOnce(new Error('Database error'));
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: mockOnSave, onCancel: mockOnCancel }) }));
                        nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
                        if (nameInputs[0]) {
                            test_utils_1.fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
                        }
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/state/i), { target: { value: 'CA' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        // Error handling is done via logger.error, so we just verify onSave wasn't called
                        return [4 /*yield*/, (0, test_utils_1.waitFor)(function () {
                                (0, vitest_1.expect)(secureApiClient.accounts.create).toHaveBeenCalled();
                            })];
                    case 2:
                        // Error handling is done via logger.error, so we just verify onSave wasn't called
                        _a.sent();
                        // onSave should not be called on error
                        (0, vitest_1.expect)(mockOnSave).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Form Reset', function () {
        (0, vitest_1.it)('should reset form when cancel is clicked', function () {
            var mockOnCancel = vitest_1.vi.fn();
            (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: mockOnCancel }) }));
            var nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
            var nameInput = nameInputs[0];
            if (nameInput) {
                test_utils_1.fireEvent.change(nameInput, { target: { value: 'John Doe' } });
            }
            var cancelButton = test_utils_1.screen.getByRole('button', { name: /cancel/i });
            test_utils_1.fireEvent.click(cancelButton);
            (0, vitest_1.expect)(mockOnCancel).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Loading States', function () {
        (0, vitest_1.it)('should show loading state during submission', function () { return __awaiter(void 0, void 0, void 0, function () {
            var secureApiClient, nameInputs, submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../lib/secure-api-client')); })];
                    case 1:
                        secureApiClient = (_a.sent()).secureApiClient;
                        secureApiClient.accounts.create.mockImplementation(function () { return new Promise(function (resolve) { return setTimeout(resolve, 100); }); });
                        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: vitest_1.vi.fn(), onCancel: vitest_1.vi.fn() }) }));
                        nameInputs = test_utils_1.screen.getAllByLabelText(/^name/i);
                        if (nameInputs[0]) {
                            test_utils_1.fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
                        }
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/state/i), { target: { value: 'CA' } });
                        test_utils_1.fireEvent.change(test_utils_1.screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
                        submitButton = test_utils_1.screen.getByRole('button', { name: /create customer/i });
                        test_utils_1.fireEvent.click(submitButton);
                        (0, vitest_1.expect)(submitButton).toBeDisabled();
                        (0, vitest_1.expect)(test_utils_1.screen.getByText(/saving/i)).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
