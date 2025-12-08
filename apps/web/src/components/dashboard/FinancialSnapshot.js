"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var FinancialSnapshot = function () {
    // Fetch financial data from API
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['financial', 'snapshot'],
        queryFn: function () { return enhanced_api_1.enhancedApi.financial.getSnapshot(); },
    }), _b = _a.data, financialData = _b === void 0 ? {
        currentMonth: {
            revenue: 0,
            expenses: 0,
            profit: 0,
            jobsCompleted: 0,
            averageJobValue: 0,
            outstandingInvoices: 0
        },
        previousMonth: {
            revenue: 0,
            expenses: 0,
            profit: 0
        },
        yearly: {
            revenue: 0,
            expenses: 0,
            profit: 0
        }
    } : _b, _isLoading = _a.isLoading;
    // Fetch revenue breakdown from API
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['financial', 'revenue-breakdown'],
        queryFn: function () { return enhanced_api_1.enhancedApi.financial.getRevenueBreakdown(); },
    }).data, revenueBreakdown = _c === void 0 ? [] : _c;
    // Fetch recent transactions from API
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['financial', 'recent-transactions'],
        queryFn: function () { return enhanced_api_1.enhancedApi.financial.getRecentTransactions(); },
    }).data, recentTransactions = _d === void 0 ? [] : _d;
    var calculateGrowth = function (current, previous) {
        return ((current - previous) / previous) * 100;
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var revenueGrowth = calculateGrowth(financialData.currentMonth.revenue, financialData.previousMonth.revenue);
    var profitGrowth = calculateGrowth(financialData.currentMonth.profit, financialData.previousMonth.profit);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Financial Overview", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: formatCurrency(financialData.currentMonth.revenue) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-1", children: "Monthly Revenue" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center space-x-1", children: [revenueGrowth >= 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-4 w-4 text-red-500" })), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600', children: [Math.abs(revenueGrowth).toFixed(1), "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: formatCurrency(financialData.currentMonth.expenses) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Monthly Expenses" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mx-auto h-8 w-8 text-purple-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-purple-600", children: formatCurrency(financialData.currentMonth.profit) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-1", children: "Monthly Profit" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center space-x-1", children: [profitGrowth >= 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-4 w-4 text-red-500" })), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: profitGrowth >= 0 ? 'text-green-600' : 'text-red-600', children: [Math.abs(profitGrowth).toFixed(1), "%"] })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Revenue Breakdown", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: revenueBreakdown.map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: item.category }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-bold", children: formatCurrency(item.amount) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-500 h-2 rounded-full", style: { width: "".concat(item.percentage, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center", children: [item.percentage, "%"] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: [item.percentage, "% of total revenue"] })] }, index)); }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Key Metrics", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: financialData.currentMonth.jobsCompleted }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Jobs Completed This Month" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: formatCurrency(financialData.currentMonth.averageJobValue) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Average Job Value" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "mx-auto h-8 w-8 text-orange-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-orange-600", children: formatCurrency(financialData.currentMonth.outstandingInvoices) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Outstanding Invoices" })] })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Recent Transactions", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: recentTransactions.map(function (transaction) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full ".concat(transaction.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'), children: transaction.type === 'payment' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-5 w-5 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "h-5 w-5 text-blue-600" })) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: transaction.customer }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: new Date(transaction.date).toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-bold", children: formatCurrency(transaction.amount) }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(transaction.status), children: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) })] })] }, transaction.id)); }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Yearly Summary", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: formatCurrency(financialData.yearly.revenue) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Annual Revenue" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "mx-auto h-8 w-8 text-red-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-red-600", children: formatCurrency(financialData.yearly.expenses) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Annual Expenses" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: formatCurrency(financialData.yearly.profit) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Annual Profit" })] })] }) })] }));
};
exports.default = FinancialSnapshot;
