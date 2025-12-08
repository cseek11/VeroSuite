"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * FinancialDashboard Component Tests
 *
 * Tests for FinancialDashboard component including:
 * - Component rendering
 * - Tab navigation
 * - Default tab behavior
 * - Component integration
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var FinancialDashboard_1 = __importDefault(require("../FinancialDashboard"));
// Mock child components to avoid complex dependencies
vitest_1.vi.mock('../ARManagement', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "ar-management", children: "AR Management" }); },
}); });
vitest_1.vi.mock('../RevenueAnalytics', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "revenue-analytics", children: "Revenue Analytics" }); },
}); });
vitest_1.vi.mock('../PaymentAnalytics', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "payment-analytics", children: "Payment Analytics" }); },
}); });
vitest_1.vi.mock('../PaymentTracking', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "payment-tracking", children: "Payment Tracking" }); },
}); });
vitest_1.vi.mock('../OverdueAlerts', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "overdue-alerts", children: "Overdue Alerts" }); },
}); });
vitest_1.vi.mock('../FinancialReports', function () { return ({
    default: function () { return (0, jsx_runtime_1.jsx)("div", { "data-testid": "financial-reports", children: "Financial Reports" }); },
}); });
(0, vitest_1.describe)('FinancialDashboard', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Component Rendering', function () {
        (0, vitest_1.it)('should render overview tab by default', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            (0, vitest_1.expect)(react_1.screen.getByText(/financial dashboard/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/quick access/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with custom default tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "ar" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('ar-management')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render all tab options', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            // Check for tab labels
            (0, vitest_1.expect)(react_1.screen.getByText(/accounts receivable/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/revenue analytics/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/overdue invoices/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/financial reports/i)).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Tab Navigation', function () {
        (0, vitest_1.it)('should switch to AR tab when AR link is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            var arLink = react_1.screen.getByText(/accounts receivable/i).closest('button');
            (0, vitest_1.expect)(arLink).toBeInTheDocument();
            if (arLink) {
                react_1.fireEvent.click(arLink);
                (0, vitest_1.expect)(react_1.screen.getByTestId('ar-management')).toBeInTheDocument();
            }
        });
        (0, vitest_1.it)('should switch to Revenue tab when Revenue link is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            var revenueLink = react_1.screen.getByText(/revenue analytics/i).closest('button');
            (0, vitest_1.expect)(revenueLink).toBeInTheDocument();
            if (revenueLink) {
                react_1.fireEvent.click(revenueLink);
                (0, vitest_1.expect)(react_1.screen.getByTestId('revenue-analytics')).toBeInTheDocument();
            }
        });
        (0, vitest_1.it)('should switch to Overdue tab when Overdue link is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            var overdueLink = react_1.screen.getByText(/overdue invoices/i).closest('button');
            (0, vitest_1.expect)(overdueLink).toBeInTheDocument();
            if (overdueLink) {
                react_1.fireEvent.click(overdueLink);
                (0, vitest_1.expect)(react_1.screen.getByTestId('overdue-alerts')).toBeInTheDocument();
            }
        });
        (0, vitest_1.it)('should switch to Reports tab when Reports link is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, {}));
            var reportsLink = react_1.screen.getByText(/financial reports/i).closest('button');
            (0, vitest_1.expect)(reportsLink).toBeInTheDocument();
            if (reportsLink) {
                react_1.fireEvent.click(reportsLink);
                (0, vitest_1.expect)(react_1.screen.getByTestId('financial-reports')).toBeInTheDocument();
            }
        });
    });
    (0, vitest_1.describe)('Component Integration', function () {
        (0, vitest_1.it)('should render ARManagement component in AR tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "ar" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('ar-management')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render RevenueAnalytics component in Revenue tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "revenue" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('revenue-analytics')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render PaymentTracking component in Tracking tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "tracking" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('payment-tracking')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render OverdueAlerts component in Overdue tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "overdue" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('overdue-alerts')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render FinancialReports component in Reports tab', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "reports" }));
            (0, vitest_1.expect)(react_1.screen.getByTestId('financial-reports')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Overview Tab', function () {
        (0, vitest_1.it)('should display quick access cards', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "overview" }));
            (0, vitest_1.expect)(react_1.screen.getByText(/financial dashboard/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/view comprehensive financial metrics/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display quick links section', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialDashboard_1.default, { defaultTab: "overview" }));
            (0, vitest_1.expect)(react_1.screen.getByText(/quick links/i)).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText(/analytics/i)).toBeInTheDocument();
        });
    });
});
