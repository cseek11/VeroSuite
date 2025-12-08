"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FinancialDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var EnhancedUI_1 = require("@/components/ui/EnhancedUI");
var lucide_react_1 = require("lucide-react");
var ARManagement_1 = __importDefault(require("./ARManagement"));
var RevenueAnalytics_1 = __importDefault(require("./RevenueAnalytics"));
var PaymentAnalytics_1 = __importDefault(require("./PaymentAnalytics"));
var PaymentTracking_1 = __importDefault(require("./PaymentTracking"));
var OverdueAlerts_1 = __importDefault(require("./OverdueAlerts"));
var FinancialReports_1 = __importDefault(require("./FinancialReports"));
function FinancialDashboard(_a) {
    var _b;
    var _c = _a.defaultTab, defaultTab = _c === void 0 ? 'overview' : _c;
    var _d = (0, react_1.useState)(defaultTab), activeTab = _d[0], setActiveTab = _d[1];
    var tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: lucide_react_1.BarChart3,
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Quick Access" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-2 text-gray-900", children: "Financial Dashboard" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-purple-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-purple-600" }) })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-4", children: "View comprehensive financial metrics and analytics" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 mr-2 text-green-600" }), "Quick Links"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('ar'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Accounts Receivable" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "View AR summary and aging" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-5 h-5 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('revenue'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Revenue Analytics" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Track revenue trends" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('overdue'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Overdue Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Manage overdue accounts" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('reports'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Financial Reports" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Generate and export reports" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-5 h-5 text-gray-400" })] }) })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-5 h-5 mr-2 text-blue-600" }), "Analytics"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('payments'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Payment Analytics" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Payment trends and insights" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('tracking'); }, className: "w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Payment Tracking" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Track payment performance" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-5 h-5 text-gray-400" })] }) })] })] }) })] })] })),
        },
        {
            id: 'ar',
            label: 'AR Management',
            icon: lucide_react_1.DollarSign,
            component: (0, jsx_runtime_1.jsx)(ARManagement_1.default, {}),
        },
        {
            id: 'revenue',
            label: 'Revenue Analytics',
            icon: lucide_react_1.TrendingUp,
            component: (0, jsx_runtime_1.jsx)(RevenueAnalytics_1.default, {}),
        },
        {
            id: 'payments',
            label: 'Payment Analytics',
            icon: lucide_react_1.CreditCard,
            component: (0, jsx_runtime_1.jsx)(PaymentAnalytics_1.default, {}),
        },
        {
            id: 'tracking',
            label: 'Payment Tracking',
            icon: lucide_react_1.BarChart3,
            component: (0, jsx_runtime_1.jsx)(PaymentTracking_1.default, {}),
        },
        {
            id: 'overdue',
            label: 'Overdue Invoices',
            icon: lucide_react_1.AlertCircle,
            component: (0, jsx_runtime_1.jsx)(OverdueAlerts_1.default, {}),
        },
        {
            id: 'reports',
            label: 'Financial Reports',
            icon: lucide_react_1.FileText,
            component: (0, jsx_runtime_1.jsx)(FinancialReports_1.default, {}),
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900 mb-2", children: "Financial Management" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Comprehensive financial analytics and reporting" })] }), (0, jsx_runtime_1.jsx)(EnhancedUI_1.Tabs, { tabs: tabs.map(function (tab) { return ({ id: tab.id, label: tab.label, icon: tab.icon }); }), active: activeTab, onTabChange: function (tabId) { return setActiveTab(tabId); }, variant: "pills", size: "lg", className: "mb-8" }), (0, jsx_runtime_1.jsx)("div", { className: "tab-content", children: (_b = tabs.find(function (tab) { return tab.id === activeTab; })) === null || _b === void 0 ? void 0 : _b.component })] }));
}
