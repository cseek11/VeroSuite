"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ServiceTypeManagement_1 = __importDefault(require("@/components/services/ServiceTypeManagement"));
var ServiceTemplates_1 = __importDefault(require("@/components/services/ServiceTemplates"));
var ServiceHistory_1 = __importDefault(require("@/components/services/ServiceHistory"));
var ServiceScheduling_1 = __importDefault(require("@/components/services/ServiceScheduling"));
var RouteOptimization_1 = __importDefault(require("@/components/services/RouteOptimization"));
function ServiceManagement() {
    var _a = (0, react_1.useState)('types'), viewMode = _a[0], setViewMode = _a[1];
    var navigation = [
        {
            id: 'types',
            name: 'Service Types',
            description: 'Manage service types and categories',
            icon: lucide_react_1.Settings,
            current: viewMode === 'types',
        },
        {
            id: 'templates',
            name: 'Service Templates',
            description: 'Create and manage service templates by customer segment',
            icon: lucide_react_1.FileText,
            current: viewMode === 'templates',
        },
        {
            id: 'scheduling',
            name: 'Service Scheduling',
            description: 'Schedule and manage service appointments',
            icon: lucide_react_1.Clock,
            current: viewMode === 'scheduling',
        },
        {
            id: 'history',
            name: 'Service History',
            description: 'Track service execution and customer feedback',
            icon: lucide_react_1.Clock,
            current: viewMode === 'history',
        },
        {
            id: 'routing',
            name: 'Route Optimization',
            description: 'Optimize technician routes for efficiency',
            icon: lucide_react_1.Map,
            current: viewMode === 'routing',
        },
    ];
    var renderContent = function () {
        switch (viewMode) {
            case 'types':
                return (0, jsx_runtime_1.jsx)(ServiceTypeManagement_1.default, {});
            case 'templates':
                return (0, jsx_runtime_1.jsx)(ServiceTemplates_1.default, {});
            case 'scheduling':
                return (0, jsx_runtime_1.jsx)(ServiceScheduling_1.default, {});
            case 'history':
                return (0, jsx_runtime_1.jsx)(ServiceHistory_1.default, {});
            case 'routing':
                return (0, jsx_runtime_1.jsx)(RouteOptimization_1.default, {});
            default:
                return (0, jsx_runtime_1.jsx)(ServiceTypeManagement_1.default, {});
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Service Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "Comprehensive service management system for pest control operations" })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("nav", { className: "flex space-x-8", "aria-label": "Tabs", children: navigation.map(function (item) {
                        var Icon = item.icon;
                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setViewMode(item.id); }, className: "\n                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200\n                  ".concat(item.current
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300', "\n                "), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: item.name })] }, item.id));
                    }) }) }), (0, jsx_runtime_1.jsx)("div", { children: renderContent() }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 pb-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-800", children: "System Overview" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: "50+" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-600", children: "Service Types" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "7" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-600", children: "Customer Segments" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "24/7" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-600", children: "Scheduling" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: "AI-Powered" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-600", children: "Route Optimization" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 pb-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-800", children: "Key Features" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-5 w-5 text-purple-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Service Type Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "Define and manage service types, categories, and pricing structures" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5 text-green-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Service Templates" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "Create standardized service templates by customer segment" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-blue-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Smart Scheduling" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "Intelligent scheduling with conflict detection and optimization" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-yellow-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Service History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "Comprehensive tracking of service execution and customer feedback" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Map, { className: "h-5 w-5 text-indigo-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Route Optimization" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "AI-powered route optimization for maximum efficiency" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-5 w-5 text-red-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-slate-900", children: "Multi-tenant" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mt-1", children: "Secure, isolated data management for multiple business units" })] })] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-800 mb-2", children: "Integration & Next Steps" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-slate-700 space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Current Status:" }), " Service Management Foundation (Week 3) - Complete"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Next Phase:" }), " Work Order Management (Week 4) - Starting next"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Integration Points:" }), " All components integrate with existing customer management system"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Data Flow:" }), " Service types \u2192 Templates \u2192 Scheduling \u2192 History \u2192 Analytics"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs mt-4 text-slate-600", children: "Note: This foundation provides the core service management capabilities. Future enhancements will include advanced scheduling algorithms, mobile technician apps, and real-time GPS tracking integration." })] })] }) })] }));
}
