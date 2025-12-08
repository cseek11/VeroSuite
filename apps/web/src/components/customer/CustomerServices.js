"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var CustomerServices = function (_a) {
    var customerId = _a.customerId;
    var _b = (0, react_1.useState)('upcoming'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['customer-jobs', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.jobs.getByCustomerId(customerId); },
        enabled: !!customerId,
    }), _d = _c.data, jobs = _d === void 0 ? [] : _d, _jobsLoading = _c.isLoading;
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['customer-work-orders', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.workOrders.getByCustomerId(customerId); },
        enabled: !!customerId,
    }), _f = _e.data, workOrders = _f === void 0 ? [] : _f, _workOrdersLoading = _e.isLoading;
    var upcomingServices = (0, react_1.useMemo)(function () {
        var scheduled = (jobs || []).filter(function (j) { return ['scheduled', 'unassigned'].includes((j.status || '').toLowerCase()); });
        return scheduled.map(function (j) {
            var _a, _b;
            return ({
                id: j.id,
                date: j.scheduled_date,
                time: j.scheduled_start_time,
                service: ((_a = j.work_orders) === null || _a === void 0 ? void 0 : _a.service_type) || ((_b = j.work_orders) === null || _b === void 0 ? void 0 : _b.description) || 'Service',
                technician: j.technicians ? "".concat(j.technicians.first_name, " ").concat(j.technicians.last_name) : 'Unassigned',
                status: j.status,
            });
        });
    }, [jobs]);
    var pendingWorkOrders = (0, react_1.useMemo)(function () {
        return (workOrders || []).filter(function (w) { return (w.status || '').toLowerCase() === 'pending'; });
    }, [workOrders]);
    var serviceHistory = (0, react_1.useMemo)(function () {
        return (jobs || []).filter(function (j) { return (j.status || '').toLowerCase() === 'completed'; }).map(function (j) {
            var _a;
            return ({
                id: j.id,
                date: j.actual_end_time || j.scheduled_date,
                service: ((_a = j.work_orders) === null || _a === void 0 ? void 0 : _a.service_type) || 'Service',
                technician: j.technicians ? "".concat(j.technicians.first_name, " ").concat(j.technicians.last_name) : 'Tech',
                status: j.status,
                notes: j.completion_notes,
            });
        });
    }, [jobs]);
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'completed':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" });
            case 'scheduled':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "text-lg font-semibold text-gray-900", children: "Services & Work Orders" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Schedule Service"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('upcoming'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'upcoming'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Upcoming (", upcomingServices.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('history'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'history'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["History (", serviceHistory.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('workorders'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'workorders'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Work Orders (", pendingWorkOrders.length, ")"] })] }), activeTab === 'upcoming' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: upcomingServices.map(function (service) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: service.service }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [new Date(service.date).toLocaleDateString(), " at ", service.time] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: getStatusColor(service.status), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [getStatusIcon(service.status), service.status.charAt(0).toUpperCase() + service.status.slice(1)] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: service.technician })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Primary Address" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "Reschedule" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "View Details" })] })] }, service.id)); }) })), activeTab === 'history' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: serviceHistory.map(function (service) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: service.service }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: new Date(service.date).toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: getStatusColor(service.status), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [getStatusIcon(service.status), service.status.charAt(0).toUpperCase() + service.status.slice(1)] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: service.technician })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Primary Address" })] })] }), service.notes && ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 rounded-lg p-3 mb-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: service.notes }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "View Report" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "Schedule Follow-up" })] })] }, service.id)); }) })), activeTab === 'workorders' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: pendingWorkOrders.map(function (w) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: w.service_type || 'Work Order' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: w.scheduled_date ? new Date(w.scheduled_date).toLocaleString() : 'Not Scheduled' })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: 'bg-yellow-100 text-yellow-800', children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), "Pending"] }) })] }), w.description && ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 rounded-lg p-3 mb-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: w.description }) }))] }, w.id)); }) }))] }));
};
exports.default = CustomerServices;
