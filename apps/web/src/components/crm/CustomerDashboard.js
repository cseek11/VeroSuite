"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var CustomerProfileCard_1 = __importDefault(require("./CustomerProfileCard"));
var ServiceHistoryTimeline_1 = __importDefault(require("./ServiceHistoryTimeline"));
var SmartScheduler_1 = __importDefault(require("./SmartScheduler"));
var ContractManager_1 = __importDefault(require("./ContractManager"));
var CommunicationHub_1 = __importDefault(require("./CommunicationHub"));
var DualNotesSystem_1 = __importDefault(require("./DualNotesSystem"));
var PhotoGallery_1 = __importDefault(require("./PhotoGallery"));
var BusinessIntelligenceDashboard_1 = __importDefault(require("./BusinessIntelligenceDashboard"));
var ComplianceCenter_1 = __importDefault(require("./ComplianceCenter"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function CustomerDashboard(_a) {
    var customerId = _a.customerId;
    var _b = (0, react_1.useState)('overview'), activeTab = _b[0], setActiveTab = _b[1];
    // Fetch customer data
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['crm', 'customer', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.customers.getById(customerId); },
    }), customer = _c.data, customerLoading = _c.isLoading, customerError = _c.error;
    // Placeholder datasets until backend surfaces these endpoints in enhancedApi
    var serviceHistory = [];
    var historyLoading = false;
    var notes = [];
    var notesLoading = false;
    var photos = [];
    var photosLoading = false;
    var contracts = [];
    var contractsLoading = false;
    if (customerLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading customer data..." });
    }
    if (customerError) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: "Error Loading Customer" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: "Failed to load customer data. Please try again." })] }));
    }
    if (!customer) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-yellow-800 mb-1", children: "Customer Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-yellow-700", children: "The requested customer could not be found." })] }));
    }
    var tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: lucide_react_1.User,
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(CustomerProfileCard_1.default, { customer: customer }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(ServiceHistoryTimeline_1.default, { serviceHistory: serviceHistory || [], isLoading: historyLoading }), (0, jsx_runtime_1.jsx)(SmartScheduler_1.default, { customerId: customerId })] })] }))
        },
        {
            id: 'contracts',
            label: 'Contracts',
            icon: lucide_react_1.FileText,
            component: ((0, jsx_runtime_1.jsx)(ContractManager_1.default, { contracts: contracts || [], isLoading: contractsLoading || false }))
        },
        {
            id: 'communication',
            label: 'Communication',
            icon: lucide_react_1.MessageCircle,
            component: ((0, jsx_runtime_1.jsx)(CommunicationHub_1.default, { customerId: customerId }))
        },
        {
            id: 'notes',
            label: 'Notes & Photos',
            icon: lucide_react_1.Camera,
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(DualNotesSystem_1.default, { notes: notes || [], customerId: customerId, isLoading: notesLoading }), (0, jsx_runtime_1.jsx)(PhotoGallery_1.default, { photos: photos || [], customerId: customerId, isLoading: photosLoading })] }))
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: lucide_react_1.BarChart3,
            component: ((0, jsx_runtime_1.jsx)(BusinessIntelligenceDashboard_1.default, { customerId: customerId }))
        },
        {
            id: 'compliance',
            label: 'Compliance',
            icon: lucide_react_1.Shield,
            component: ((0, jsx_runtime_1.jsx)(ComplianceCenter_1.default, { customerId: customerId }))
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "text-slate-900", children: customer.name }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-slate-600 mt-2", children: ["Customer ID: ", customer.id, " \u2022 ", customer.account_type, " \u2022 ", customer.status] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [(0, jsx_runtime_1.jsx)(ui_1.TabsList, { className: "flex flex-wrap gap-2 p-4 border-b border-slate-200", children: tabs.map(function (tab) { return ((0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: tab.id, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(tab.icon, { className: "h-4 w-4" }), tab.label] }, tab.id)); }) }), tabs.map(function (tab) { return ((0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: tab.id, children: tab.component }, tab.id)); })] }) })] }));
}
