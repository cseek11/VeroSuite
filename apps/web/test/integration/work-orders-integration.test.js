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
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var WorkOrderForm_1 = __importDefault(require("@/components/work-orders/WorkOrderForm"));
var testHelpers_1 = require("@/test/utils/testHelpers");
var enhanced_api_1 = require("@/lib/enhanced-api");
var secure_api_client_1 = require("@/lib/secure-api-client");
// Mock APIs
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        technicians: {
            list: vitest_1.vi.fn(),
        },
    },
}); });
vitest_1.vi.mock('@/lib/secure-api-client', function () { return ({
    secureApiClient: {
        getAllAccounts: vitest_1.vi.fn(),
    },
}); });
var createTestQueryClient = function () {
    return new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
};
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = createTestQueryClient();
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: children }) }));
};
(0, vitest_1.describe)('Work Orders Integration', function () {
    var mockCustomers = [
        (0, testHelpers_1.createMockAccount)({ id: 'account-1', name: 'Test Customer' }),
    ];
    var mockTechnicians = [
        (0, testHelpers_1.createMockTechnician)({ id: 'tech-1', user: { first_name: 'John', last_name: 'Doe' } }),
    ];
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        enhanced_api_1.enhancedApi.technicians.list.mockResolvedValue(mockTechnicians.map(function (tech) {
            var _a, _b, _c;
            return ({
                id: tech.id,
                user_id: tech.user_id,
                email: (_a = tech.user) === null || _a === void 0 ? void 0 : _a.email,
                first_name: (_b = tech.user) === null || _b === void 0 ? void 0 : _b.first_name,
                last_name: (_c = tech.user) === null || _c === void 0 ? void 0 : _c.last_name,
                status: 'active',
            });
        }));
        secure_api_client_1.secureApiClient.getAllAccounts.mockResolvedValue(mockCustomers);
    });
    (0, vitest_1.it)('should create work order with customer and technician', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockOnSubmit, customerInput, descriptionInput, technicianSelect, submitButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockOnSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: mockOnSubmit, onCancel: vitest_1.vi.fn() }) }));
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(enhanced_api_1.enhancedApi.technicians.list).toHaveBeenCalled();
                        })];
                case 1:
                    _a.sent();
                    customerInput = react_1.screen.getByTestId('customer-search-input');
                    react_1.fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    descriptionInput = react_1.screen.getByLabelText(/description/i);
                    react_1.fireEvent.change(descriptionInput, { target: { value: 'Integration test work order' } });
                    technicianSelect = react_1.screen.getByLabelText(/assigned technician/i);
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(technicianSelect).not.toBeDisabled();
                        })];
                case 3:
                    _a.sent();
                    react_1.fireEvent.change(technicianSelect, { target: { value: 'tech-1' } });
                    submitButton = react_1.screen.getByRole('button', { name: /create.*work.*order/i });
                    react_1.fireEvent.click(submitButton);
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                customer_id: 'account-1',
                                assigned_to: 'tech-1',
                                description: 'Integration test work order',
                            }));
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
