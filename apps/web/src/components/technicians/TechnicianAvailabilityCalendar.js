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
exports.default = TechnicianAvailabilityCalendar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useTechnicians_1 = require("@/hooks/useTechnicians");
var technician_1 = require("@/types/technician");
var jobs_1 = require("@/types/jobs");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
function TechnicianAvailabilityCalendar(_a) {
    var _b;
    var _selectedTechnician = _a.selectedTechnician, onTechnicianSelect = _a.onTechnicianSelect, onTimeSlotSelect = _a.onTimeSlotSelect, _c = _a.mode, _mode = _c === void 0 ? 'availability' : _c;
    var _d = (0, react_1.useState)(new Date()), currentDate = _d[0], setCurrentDate = _d[1];
    var _e = (0, react_1.useState)('week'), viewMode = _e[0], setViewMode = _e[1];
    var _f = (0, react_1.useState)(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = (0, react_1.useState)(''), filterStatus = _g[0], setFilterStatus = _g[1];
    var technicianQueryParams = __assign(__assign({}, (filterStatus ? { status: filterStatus } : {})), { limit: 20 });
    var _h = (0, useTechnicians_1.useTechnicians)(technicianQueryParams), techniciansData = _h.data, techniciansLoading = _h.isLoading;
    var technicians = (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.technicians) || [];
    // Filter technicians based on search
    var filteredTechnicians = (0, react_1.useMemo)(function () {
        if (!searchTerm)
            return technicians;
        var searchLower = searchTerm.toLowerCase();
        return technicians.filter(function (tech) {
            var _a, _b, _c, _d, _e, _f, _g;
            return ((_b = (_a = tech.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) ||
                ((_d = (_c = tech.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower)) ||
                ((_f = (_e = tech.user) === null || _e === void 0 ? void 0 : _e.email) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchLower)) ||
                ((_g = tech.position) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(searchLower));
        });
    }, [technicians, searchTerm]);
    // Generate time slots for a day (8 AM to 6 PM, 30-minute intervals)
    var generateTimeSlots = function (date, technician) {
        var slots = [];
        var startHour = 8;
        var endHour = 18;
        for (var hour = startHour; hour < endHour; hour++) {
            for (var minute = 0; minute < 60; minute += 30) {
                var time = "".concat(hour.toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0'));
                // Mock availability logic - in real app, this would check actual schedules
                var isAvailable = Math.random() > 0.3; // 70% chance of being available
                var hasJob = Math.random() > 0.8; // 20% chance of having a job
                var status_1 = 'available';
                var job = void 0;
                if (hasJob && !isAvailable) {
                    status_1 = 'busy';
                    job = {
                        id: "job-".concat(Math.random()),
                        work_order_id: "wo-".concat(Math.random()),
                        technician_id: technician.id,
                        scheduled_date: date.toISOString(),
                        scheduled_start_time: time,
                        scheduled_end_time: "".concat((hour + 1).toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0')),
                        status: jobs_1.JobStatus.SCHEDULED,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        work_order: {
                            id: "wo-".concat(Math.random()),
                            description: 'Sample Job',
                            priority: 'medium',
                            status: 'pending',
                            account: {
                                id: "acc-".concat(Math.random()),
                                name: 'Sample Customer',
                                account_type: 'residential'
                            }
                        }
                    };
                }
                else if (!isAvailable && !hasJob) {
                    status_1 = Math.random() > 0.5 ? 'break' : 'travel';
                }
                var slot = {
                    time: time,
                    available: isAvailable,
                    status: status_1
                };
                if (job) {
                    slot.job = job;
                }
                slots.push(slot);
            }
        }
        return slots;
    };
    // Generate schedule for a technician for a specific date
    var generateDaySchedule = function (date, technician) {
        var timeSlots = generateTimeSlots(date, technician);
        var jobs = timeSlots.filter(function (slot) { return slot.job; }).map(function (slot) { return slot.job; });
        var totalHours = 10; // 8 AM to 6 PM
        var availableHours = timeSlots.filter(function (slot) { return slot.available; }).length * 0.5; // 30-minute slots
        return {
            date: date,
            timeSlots: timeSlots,
            totalHours: totalHours,
            availableHours: availableHours,
            jobs: jobs
        };
    };
    // Get week days
    var getWeekDays = function (date) {
        var startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        var days = [];
        for (var i = 0; i < 7; i++) {
            var day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };
    // Navigate calendar
    var navigateCalendar = function (direction) {
        var newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        }
        else {
            newDate.setMonth(newDate.getMonth() + direction);
        }
        setCurrentDate(newDate);
    };
    // Get time slot color
    var getTimeSlotColor = function (status) {
        switch (status) {
            case 'available': return 'bg-green-100 border-green-200 text-green-800';
            case 'busy': return 'bg-red-100 border-red-200 text-red-800';
            case 'break': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
            case 'travel': return 'bg-blue-100 border-blue-200 text-blue-800';
            default: return 'bg-gray-100 border-gray-200 text-gray-800';
        }
    };
    // Get status icon
    var getStatusIcon = function (status) {
        switch (status) {
            case 'available': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-3 w-3" });
            case 'busy': return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-3 w-3" });
            case 'break': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" });
            case 'travel': return (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-3 w-3" });
        }
    };
    if (techniciansLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading technicians..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Technician Availability" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "View technician schedules and availability" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('week'); }, className: "px-3 py-1 rounded-md text-sm font-medium transition-colors ".concat(viewMode === 'week'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'), children: "Week" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('month'); }, className: "px-3 py-1 rounded-md text-sm font-medium transition-colors ".concat(viewMode === 'month'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'), children: "Month" })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search technicians...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: function (e) { return setFilterStatus(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ACTIVE, children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.INACTIVE, children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ON_LEAVE, children: "On Leave" })] }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return navigateCalendar(-1); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: viewMode === 'week'
                                        ? "Week of ".concat(((_b = getWeekDays(currentDate)[0]) !== null && _b !== void 0 ? _b : currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
                                        : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return navigateCalendar(1); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setCurrentDate(new Date()); }, children: "Today" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredTechnicians.map(function (technician) {
                    var _a, _b, _c, _d, _e, _f;
                    var weekDays = getWeekDays(currentDate);
                    var daySchedules = weekDays.map(function (day) { return generateDaySchedule(day, technician); });
                    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-medium text-purple-600", children: [(_b = (_a = technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-semibold text-gray-900", children: [(_e = technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = technician.user) === null || _f === void 0 ? void 0 : _f.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: technician.position })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Availability" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-green-600", children: [Math.round((daySchedules.reduce(function (sum, day) { return sum + day.availableHours; }, 0) /
                                                                (daySchedules.length * 10)) * 100), "%"] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return onTechnicianSelect === null || onTechnicianSelect === void 0 ? void 0 : onTechnicianSelect(technician); }, children: "View Details" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-7 gap-2", children: weekDays.map(function (day, dayIndex) {
                                    var schedule = daySchedules[dayIndex];
                                    if (!schedule) {
                                        return null;
                                    }
                                    var isToday = day.toDateString() === new Date().toDateString();
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-2 rounded-md ".concat(isToday ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-700'), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: day.toLocaleDateString('en-US', { weekday: 'short' }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: day.getDate() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [schedule.timeSlots.slice(0, 6).map(function (slot, slotIndex) {
                                                        var _a;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-1 rounded text-xs border cursor-pointer hover:shadow-sm transition-shadow ".concat(getTimeSlotColor(slot.status)), onClick: function () { return onTimeSlotSelect === null || onTimeSlotSelect === void 0 ? void 0 : onTimeSlotSelect(technician, day, slot.time); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [getStatusIcon(slot.status), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: slot.time })] }), slot.job && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs opacity-75 truncate", children: (_a = slot.job.work_order) === null || _a === void 0 ? void 0 : _a.description }))] }, slotIndex));
                                                    }), schedule.timeSlots.length > 6 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 text-center", children: ["+", schedule.timeSlots.length - 6, " more"] }))] })] }, dayIndex));
                                }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Total Jobs" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-900", children: daySchedules.reduce(function (sum, day) { return sum + day.jobs.length; }, 0) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Available Hours" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-green-600", children: [daySchedules.reduce(function (sum, day) { return sum + day.availableHours; }, 0).toFixed(1), "h"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Utilization" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-blue-600", children: [Math.round((daySchedules.reduce(function (sum, day) { return sum + (day.totalHours - day.availableHours); }, 0) /
                                                            (daySchedules.length * 10)) * 100), "%"] })] })] }) })] }, technician.id));
                }) }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: "Legend" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-green-100 border border-green-200 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Available" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-red-100 border border-red-200 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Busy" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-yellow-100 border border-yellow-200 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Break" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-blue-100 border border-blue-200 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Travel" })] })] })] })] }));
}
