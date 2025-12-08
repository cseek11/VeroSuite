"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var CustomerFinancials = function (_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)('overview'), activeTab = _b[0], setActiveTab = _b[1];
    var billingOverview = {
        currentBalance: 1250.00,
        pastDue: 450.00,
        lastPayment: 300.00,
        lastPaymentDate: '2023-12-28',
        nextBillingDate: '2024-01-15',
        paymentMethod: 'Credit Card ending in 1234'
    };
    var invoices = [
        {
            id: 'INV-001',
            date: '2023-12-15',
            dueDate: '2024-01-15',
            amount: 450.00,
            status: 'past_due',
            description: 'Quarterly Pest Control Service'
        },
        {
            id: 'INV-002',
            date: '2023-11-15',
            dueDate: '2023-12-15',
            amount: 300.00,
            status: 'paid',
            description: 'Emergency Spider Treatment'
        },
        {
            id: 'INV-003',
            date: '2023-10-15',
            dueDate: '2023-11-15',
            amount: 500.00,
            status: 'paid',
            description: 'Quarterly Pest Control Service'
        }
    ];
    var paymentHistory = [
        {
            id: 1,
            date: '2023-12-28',
            amount: 300.00,
            method: 'Credit Card',
            reference: 'TXN-12345',
            status: 'completed'
        },
        {
            id: 2,
            date: '2023-11-20',
            amount: 500.00,
            method: 'Credit Card',
            reference: 'TXN-12344',
            status: 'completed'
        },
        {
            id: 3,
            date: '2023-10-18',
            amount: 450.00,
            method: 'Credit Card',
            reference: 'TXN-12343',
            status: 'completed'
        }
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'past_due':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid':
            case 'completed':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" });
            case 'past_due':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "text-lg font-semibold text-gray-900", children: "Financial Information" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4" }), "Process Payment"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('overview'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'overview'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: "Overview" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('invoices'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'invoices'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Invoices (", invoices.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('payments'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'payments'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Payments (", paymentHistory.length, ")"] })] }), activeTab === 'overview' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Current Balance" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xl font-semibold text-gray-900", children: ["$", billingOverview.currentBalance.toFixed(2)] })] })] }), billingOverview.pastDue > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), "$", billingOverview.pastDue.toFixed(2), " past due"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Last Payment" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xl font-semibold text-gray-900", children: ["$", billingOverview.lastPayment.toFixed(2)] })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: new Date(billingOverview.lastPaymentDate).toLocaleDateString() })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Next Billing" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl font-semibold text-gray-900", children: new Date(billingOverview.nextBillingDate).toLocaleDateString() })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Payment Method" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: billingOverview.paymentMethod })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "Update Payment Method" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "View All Methods" })] })] })] })), activeTab === 'invoices' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: invoices.map(function (invoice) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: invoice.id }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: invoice.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-semibold text-gray-900", children: ["$", invoice.amount.toFixed(2)] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: getStatusColor(invoice.status), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [getStatusIcon(invoice.status), invoice.status === 'past_due' ? 'Past Due' :
                                                        invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)] }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Date:" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-gray-900", children: new Date(invoice.date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Due Date:" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-gray-900", children: new Date(invoice.dueDate).toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Download"] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "View Details" }), invoice.status === 'past_due' && ((0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", className: "bg-red-600 hover:bg-red-700", children: "Pay Now" }))] })] }, invoice.id)); }) })), activeTab === 'payments' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: paymentHistory.map(function (payment) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: payment.reference }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: payment.method })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-semibold text-gray-900", children: ["$", payment.amount.toFixed(2)] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: getStatusColor(payment.status), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [getStatusIcon(payment.status), payment.status.charAt(0).toUpperCase() + payment.status.slice(1)] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: new Date(payment.date).toLocaleDateString() })] }, payment.id)); }) }))] }));
};
exports.default = CustomerFinancials;
