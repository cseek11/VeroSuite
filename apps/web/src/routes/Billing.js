"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Billing;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var billing_1 = require("@/components/billing");
var RecurringPayments_1 = __importDefault(require("@/components/billing/RecurringPayments"));
var PaymentAnalytics_1 = __importDefault(require("@/components/billing/PaymentAnalytics"));
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
function Billing() {
    var _a, _b;
    var _c = (0, react_1.useState)('invoices'), activeTab = _c[0], setActiveTab = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var customerId = (0, react_router_dom_1.useParams)().customerId;
    // Fetch billing analytics for overview
    var analytics = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'analytics'],
        queryFn: function () { return enhanced_api_1.billing.getBillingAnalytics(); },
    }).data;
    // If customerId is provided, show customer payment portal
    if (customerId) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: (0, jsx_runtime_1.jsx)(billing_1.CustomerPaymentPortal, { customerId: customerId, onClose: function () { return navigate('/billing'); } }) }));
    }
    var tabs = [
        {
            id: 'invoices',
            label: 'Invoice Management',
            icon: lucide_react_1.FileText,
            component: (0, jsx_runtime_1.jsx)(billing_1.InvoiceManagement, {})
        },
        {
            id: 'generate',
            label: 'Generate Invoice',
            icon: lucide_react_1.PlusCircle,
            component: (0, jsx_runtime_1.jsx)(billing_1.InvoiceGenerator, { onSuccess: function () { return setActiveTab('invoices'); } })
        },
        {
            id: 'templates',
            label: 'Templates',
            icon: lucide_react_1.FileCheck,
            component: (0, jsx_runtime_1.jsx)(billing_1.InvoiceTemplates, {})
        },
        {
            id: 'scheduler',
            label: 'Scheduler',
            icon: lucide_react_1.Calendar,
            component: (0, jsx_runtime_1.jsx)(billing_1.InvoiceScheduler, {})
        },
        {
            id: 'reminders',
            label: 'Reminders',
            icon: lucide_react_1.Mail,
            component: (0, jsx_runtime_1.jsx)(billing_1.InvoiceReminders, {})
        },
        {
            id: 'ar',
            label: 'AR Management',
            icon: lucide_react_1.DollarSign,
            component: (0, jsx_runtime_1.jsx)(billing_1.ARManagement, {})
        },
        {
            id: 'payments',
            label: 'Payment Tracking',
            icon: lucide_react_1.CreditCard,
            component: (0, jsx_runtime_1.jsx)(billing_1.PaymentTracking, {})
        },
        {
            id: 'overdue',
            label: 'Overdue Alerts',
            icon: lucide_react_1.Shield,
            component: (0, jsx_runtime_1.jsx)(billing_1.OverdueAlerts, {})
        },
        {
            id: 'customers',
            label: 'Customer Billing',
            icon: lucide_react_1.Users,
            component: ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-500 mb-2", children: "Customer Billing Management" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400 mb-6", children: "Manage customer payment portals, payment methods, and billing preferences." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", children: "Coming Soon" })] }) }))
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: lucide_react_1.BarChart3,
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-green-700 font-medium", children: "Total Revenue" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-green-800 font-bold mt-1", children: ["$", ((_a = analytics === null || analytics === void 0 ? void 0 : analytics.totalRevenue) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '0.00'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-blue-700 font-medium", children: "Outstanding" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-blue-800 font-bold mt-1", children: ["$", ((_b = analytics === null || analytics === void 0 ? void 0 : analytics.outstandingAmount) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '0.00'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-purple-700 font-medium", children: "Total Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-purple-800 font-bold mt-1", children: (analytics === null || analytics === void 0 ? void 0 : analytics.totalInvoices) || 0 })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-orange-700 font-medium", children: "Overdue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-orange-800 font-bold mt-1", children: (analytics === null || analytics === void 0 ? void 0 : analytics.overdueInvoices) || 0 })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-6 h-6 text-orange-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(PaymentAnalytics_1.default, {})] }))
        },
        {
            id: 'recurring',
            label: 'Recurring Payments',
            icon: lucide_react_1.RefreshCw,
            component: (0, jsx_runtime_1.jsx)(RecurringPayments_1.default, {})
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: lucide_react_1.Settings,
            component: ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-500 mb-2", children: "Billing Settings" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400 mb-6", children: "Configure billing preferences, payment gateways, and invoice templates." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", children: "Coming Soon" })] }) }))
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Billing & Payments" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "Manage invoices, payments, and billing operations" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-blue-100 rounded-lg mr-3 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-800 mb-1", children: "Secure Billing System" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "All payment processing is secured with bank-level encryption and PCI compliance standards." })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)(ui_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); }, children: (0, jsx_runtime_1.jsx)(ui_1.TabsList, { className: "flex flex-wrap gap-2 p-2", children: tabs.map(function (tab) {
                            var Icon = tab.icon;
                            return ((0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: tab.id, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), tab.label] }, tab.id));
                        }) }) }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(ui_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); }, children: tabs.map(function (tab) { return ((0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: tab.id, children: tab.component }, tab.id)); }) }) })] }));
}
