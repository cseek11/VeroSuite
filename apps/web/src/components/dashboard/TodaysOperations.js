"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var lucide_react_1 = require("lucide-react");
var TodaysOperations = function (_a) {
    var jobs = _a.jobs, isLoading = _a.isLoading;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Today's Operations", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center py-8", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg" }) }) }));
    }
    if (!jobs || jobs.length === 0) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Today's Operations", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mx-auto h-12 w-12 text-gray-400 mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-500 mb-2", children: "No operations scheduled for today" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400", children: "All caught up! Check back later for new assignments." })] }) }));
    }
    var getStatusIcon = function (status) {
        switch (status) {
            case 'completed':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            case 'in-progress':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4 text-blue-500" });
            case 'urgent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-4 w-4 text-gray-500" });
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'urgent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getProgressValue = function (status) {
        switch (status) {
            case 'completed':
                return 100;
            case 'in-progress':
                return 65;
            case 'urgent':
                return 25;
            default:
                return 0;
        }
    };
    var formatTime = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { title: "Today's Operations", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: jobs.map(function (job) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 hover:bg-gray-50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [getStatusIcon(job.status), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: job.title }), job.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: job.description }))] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(job.status), children: job.status.replace('-', ' ') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [formatTime(job.start), job.end && " - ".concat(formatTime(job.end))] })] }), job.technician && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: job.technician })] })), job.location && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: job.location })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(job.status === 'completed' ? 'bg-green-500' :
                                                job.status === 'in-progress' ? 'bg-blue-500' :
                                                    job.status === 'urgent' ? 'bg-red-500' : 'bg-gray-500'), style: { width: "".concat(getProgressValue(job.status), "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center mt-1", children: [getProgressValue(job.status), "%"] })] }) })] }, job.id)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Total Operations: ", jobs.length] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [jobs.filter(function (job) { return job.status === 'completed'; }).length, " Completed"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4 text-blue-500" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: [jobs.filter(function (job) { return job.status === 'in-progress'; }).length, " In Progress"] })] })] })] }) })] }));
};
exports.default = TodaysOperations;
