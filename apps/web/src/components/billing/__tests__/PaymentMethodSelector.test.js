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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * PaymentMethodSelector Component Tests
 *
 * Tests for PaymentMethodSelector component including:
 * - Component rendering
 * - Payment method selection
 * - Add new card option
 * - Error handling
 * - Empty state
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var PaymentMethodSelector_1 = __importDefault(require("../PaymentMethodSelector"));
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
require("@testing-library/jest-dom");
// Mock dependencies
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    billing: {
        getPaymentMethods: vitest_1.vi.fn(),
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
// Type assertions - kept for type safety even if not directly used
// @ts-expect-error - Type assertion for mocking
var _mockBilling = enhanced_api_1.billing;
// @ts-expect-error - Type assertion for mocking
var _mockLogger = logger_1.logger;
(0, vitest_1.describe)('PaymentMethodSelector', function () {
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
    var mockProps = {
        accountId: 'acc-1',
        paymentMethods: mockPaymentMethods,
        onChange: vitest_1.vi.fn(),
        onAddNew: vitest_1.vi.fn(),
        selectedMethodId: null,
    };
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        vitest_1.vi.clearAllMocks();
    });
    var renderComponent = function (props) {
        if (props === void 0) { props = {}; }
        var defaultProps = __assign(__assign({}, mockProps), props);
        return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(PaymentMethodSelector_1.default, __assign({}, defaultProps)) }));
    };
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render payment methods', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/checking.*account/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display default badge for default payment method', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/default/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show add new card option', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/add.*new.*card/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty payment methods', function () {
            renderComponent({ paymentMethods: [] });
            (0, vitest_1.expect)(react_1.screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Payment Method Selection', function () {
        (0, vitest_1.it)('should call onChange when payment method clicked', function () {
            var onChange = vitest_1.vi.fn();
            renderComponent({ onChange: onChange });
            var visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
            react_1.fireEvent.click(visaMethod);
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(mockPaymentMethods[0]);
        });
        (0, vitest_1.it)('should highlight selected payment method', function () {
            renderComponent({ selectedMethodId: 'pm-1' });
            var visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
            (0, vitest_1.expect)(visaMethod.closest('div')).toHaveClass(/selected|active|bg-/);
        });
        (0, vitest_1.it)('should call onAddNew when add new card clicked', function () {
            var onAddNew = vitest_1.vi.fn();
            renderComponent({ onAddNew: onAddNew });
            var addNewButton = react_1.screen.getByText(/add.*new.*card/i);
            react_1.fireEvent.click(addNewButton);
            (0, vitest_1.expect)(onAddNew).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Error Handling', function () {
        (0, vitest_1.it)('should handle loading errors gracefully', function () {
            renderComponent({ paymentMethods: [] });
            // Should show empty state, not crash
            (0, vitest_1.expect)(react_1.screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined payment methods', function () {
            renderComponent({ paymentMethods: undefined });
            // Should not crash
            (0, vitest_1.expect)(react_1.screen.queryByText(/visa/i)).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Payment Method Display', function () {
        (0, vitest_1.it)('should display card type and last 4 digits', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/visa/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/1234/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display card expiry if available', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/12\/25/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display payment method name for non-card methods', function () {
            renderComponent();
            (0, vitest_1.expect)(react_1.screen.getByText(/checking.*account/i)).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Regression Prevention', function () {
        (0, vitest_1.it)('should handle missing payment method properties', function () {
            var incompleteMethods = [
                {
                    id: 'pm-3',
                    payment_type: 'credit_card',
                    payment_name: 'Card',
                    // Missing card_type, card_last4, etc.
                },
            ];
            renderComponent({ paymentMethods: incompleteMethods });
            // Should not crash
            (0, vitest_1.expect)(react_1.screen.getByText(/card/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle null onChange callback', function () {
            renderComponent({ onChange: null });
            var visaMethod = react_1.screen.getByText(/visa.*ending.*1234/i);
            // Should not crash when clicked
            (0, vitest_1.expect)(function () { return react_1.fireEvent.click(visaMethod); }).not.toThrow();
        });
    });
});
