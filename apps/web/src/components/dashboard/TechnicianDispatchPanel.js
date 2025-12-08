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
var TechnicianDispatchPanel = function () {
    // Fetch technicians data from API
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'dispatch'],
        queryFn: function () { return enhanced_api_1.enhancedApi.users.list(); },
    }), _b = _a.data, technicians = _b === void 0 ? [] : _b, _isLoading = _a.isLoading;
    var dispatchStats = {
        totalTechnicians: technicians.length,
        available: technicians.filter(function (t) { return t.status === 'available'; }).length,
        busy: technicians.filter(function (t) { return t.status === 'busy'; }).length,
        offline: technicians.filter(function (t) { return t.status === 'offline'; }).length,
        averageResponseTime: '18 min',
        jobsInQueue: 7
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'available':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            case 'busy':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-yellow-500" });
            case 'offline':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-500" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { title: "Technician Dispatch Overview", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: dispatchStats.totalTechnicians }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Technicians" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: dispatchStats.available }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Available" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "mx-auto h-8 w-8 text-yellow-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-yellow-600", children: dispatchStats.busy }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "On Job" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mx-auto h-8 w-8 text-gray-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-gray-600", children: dispatchStats.jobsInQueue }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "In Queue" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: "Average Response Time" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-bold text-blue-600", children: dispatchStats.averageResponseTime })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Technician Status", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: technicians.map(function (technician) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 hover:bg-gray-50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Avatar, { src: technician.avatar, alt: technician.name, size: "md", fallback: technician.name.split(' ').map(function (n) { return n[0]; }).join('') }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: technician.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-1", children: [getStatusIcon(technician.status), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(technician.status), children: technician.status.charAt(0).toUpperCase() + technician.status.slice(1) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium", children: ["\u2B50 ", technician.rating] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: [technician.jobsCompleted, " jobs"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: technician.location })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Response: ", technician.responseTime] })] })] }), technician.currentJob && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 p-3 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-blue-800", children: "Current Job:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-blue-700", children: technician.currentJob })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mb-3", children: technician.specialties.map(function (specialty, index) { return ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "text-xs", children: specialty }, index)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: technician.phone })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: technician.email })] })] })] }, technician.id)); }) }) })] }));
};
exports.default = TechnicianDispatchPanel;
