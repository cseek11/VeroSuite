"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TechnicianManagementPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useTechnicians_1 = require("@/hooks/useTechnicians");
var TechnicianList_1 = __importDefault(require("@/components/technicians/TechnicianList"));
var TechnicianAssignmentInterface_1 = __importDefault(require("@/components/technicians/TechnicianAssignmentInterface"));
var TechnicianAvailabilityCalendar_1 = __importDefault(require("@/components/technicians/TechnicianAvailabilityCalendar"));
var TechnicianDashboard_1 = __importDefault(require("@/components/technicians/TechnicianDashboard"));
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
function TechnicianManagementPage() {
    var _a = (0, react_1.useState)('dashboard'), viewMode = _a[0], setViewMode = _a[1];
    var _b = (0, react_1.useState)(undefined), selectedTechnician = _b[0], setSelectedTechnician = _b[1];
    var _c = (0, react_1.useState)(undefined), selectedDate = _c[0], setSelectedDate = _c[1];
    var _d = (0, react_1.useState)(undefined), selectedTimeSlot = _d[0], setSelectedTimeSlot = _d[1];
    var techniciansData = (0, useTechnicians_1.useTechnicians)({ limit: 20 }).data;
    var technicians = (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.technicians) || [];
    var handleTechnicianSelect = function (technician) {
        setSelectedTechnician(technician);
    };
    var handleAssignmentComplete = function () {
        // Handle assignment completion
        setSelectedDate('');
        setSelectedTimeSlot(undefined);
    };
    var handleTimeSlotSelect = function (technician, date, timeSlot) {
        setSelectedTechnician(technician);
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedTimeSlot({ start: timeSlot, end: addTime(timeSlot, 1) });
        setViewMode('assignment');
    };
    var addTime = function (time, hours) {
        var _a = time.split(':').map(Number), _b = _a[0], hour = _b === void 0 ? 0 : _b, _c = _a[1], minute = _c === void 0 ? 0 : _c;
        var newHour = (hour + hours) % 24;
        return "".concat(newHour.toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0'));
    };
    var getViewModeIcon = function (mode) {
        switch (mode) {
            case 'list': return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4" });
            case 'assignment': return (0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "h-4 w-4" });
            case 'calendar': return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" });
            case 'dashboard': return (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4" });
        }
    };
    var getViewModeTitle = function (mode) {
        switch (mode) {
            case 'list': return 'Technician List';
            case 'assignment': return 'Technician Assignment';
            case 'calendar': return 'Availability Calendar';
            case 'dashboard': return 'Performance Dashboard';
            default: return 'Technician Management';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Technician Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "Manage your technician team and assignments" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { }, className: "px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "h-4 w-4" }), "Add Technician"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { }, className: "px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4" }), "Settings"] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("nav", { className: "flex space-x-8", children: ['dashboard', 'list', 'calendar', 'assignment'].map(function (mode) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setViewMode(mode); }, className: "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ".concat(viewMode === mode
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'), children: [getViewModeIcon(mode), getViewModeTitle(mode)] }, mode)); }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Total Technicians" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: technicians.length })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-green-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Active Technicians" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: technicians.filter(function (t) { return t.status === 'active'; }).length })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-6 w-6 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Jobs Today" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: "12" })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-orange-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-6 w-6 text-orange-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Avg Performance" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: "87%" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [viewMode === 'dashboard' && ((0, jsx_runtime_1.jsx)(TechnicianDashboard_1.default, __assign({}, (selectedTechnician ? { selectedTechnician: selectedTechnician } : {}), { onTechnicianSelect: handleTechnicianSelect }))), viewMode === 'list' && ((0, jsx_runtime_1.jsx)(TechnicianList_1.default, {})), viewMode === 'calendar' && ((0, jsx_runtime_1.jsx)(TechnicianAvailabilityCalendar_1.default, __assign({}, (selectedTechnician ? { selectedTechnician: selectedTechnician } : {}), { onTechnicianSelect: handleTechnicianSelect, onTimeSlotSelect: handleTimeSlotSelect }))), viewMode === 'assignment' && ((0, jsx_runtime_1.jsx)(TechnicianAssignmentInterface_1.default, __assign({}, (selectedDate ? { selectedDate: selectedDate } : {}), (selectedTimeSlot ? { selectedTimeSlot: selectedTimeSlot } : {}), { onTechnicianSelect: handleTechnicianSelect, onAssignmentComplete: handleAssignmentComplete })))] })] })] }));
}
