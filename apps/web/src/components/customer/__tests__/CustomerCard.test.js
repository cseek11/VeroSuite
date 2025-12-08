"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CustomerCard Component Tests
 *
 * Tests for the CustomerCard component including:
 * - Card display
 * - Interactions
 * - Status indicators
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var CustomerCard_1 = require("../CustomerCard");
var testHelpers_1 = require("@/test/utils/testHelpers");
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
(0, vitest_1.describe)('CustomerCard', function () {
    var mockCustomer = (0, testHelpers_1.createMockAccount)({
        id: 'account-1',
        name: 'Test Customer',
        email: 'test@example.com',
        account_type: 'residential',
        status: 'active',
    });
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    var mockOnClick = vitest_1.vi.fn();
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render customer card', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerCard_1.CustomerCard, { customer: mockCustomer, onClick: mockOnClick, isSelected: false, densityMode: "standard" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Test Customer')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display customer email', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerCard_1.CustomerCard, { customer: mockCustomer, onClick: mockOnClick, isSelected: false, densityMode: "standard" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('test@example.com')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display account type', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerCard_1.CustomerCard, { customer: mockCustomer, onClick: mockOnClick, isSelected: false, densityMode: "standard" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText(/residential/i)).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Interactions', function () {
        (0, vitest_1.it)('should call onClick when card is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CustomerCard_1.CustomerCard, { customer: mockCustomer, onClick: mockOnClick, isSelected: false, densityMode: "standard" }) }));
            var card = react_1.screen.getByText('Test Customer').closest('div');
            if (card) {
                react_1.fireEvent.click(card);
                (0, vitest_1.expect)(mockOnClick).toHaveBeenCalled();
            }
        });
    });
});
