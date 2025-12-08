"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CustomerInfoPanel Component Tests
 *
 * Tests for the CustomerInfoPanel component including:
 * - Panel rendering
 * - Data display
 * - Edit functionality
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var CustomerInfoPanel_1 = __importDefault(require("../CustomerInfoPanel"));
var testHelpers_1 = require("@/test/utils/testHelpers");
// Mock enhancedApi
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        accounts: {
            update: vitest_1.vi.fn().mockResolvedValue({}),
        },
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
(0, vitest_1.describe)('CustomerInfoPanel', function () {
    var mockCustomer = (0, testHelpers_1.createMockAccount)({
        id: 'account-1',
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+1-555-0000',
        account_type: 'residential',
        status: 'active',
    });
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render customer info panel', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerInfoPanel_1.default, { customer: mockCustomer }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display customer contact information', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerInfoPanel_1.default, { customer: mockCustomer }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('test@example.com')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('+1-555-0000')).toBeInTheDocument();
        });
    });
});
