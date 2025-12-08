"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JobScheduler;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * @deprecated This component is deprecated. Use ScheduleCalendar from @/components/scheduling/ScheduleCalendar instead.
 *
 * Migration Guide:
 * - Replace JobScheduler with ScheduleCalendar
 * - ScheduleCalendar provides all features of JobScheduler plus additional enterprise features
 * - See docs/guides/development/SCHEDULER_MIGRATION_GUIDE.md for detailed migration instructions
 *
 * This component will be removed in a future version.
 * Last Updated: 2025-12-08
 */
var react_1 = require("react");
var useJobs_1 = require("@/hooks/useJobs");
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var useTechnicians_1 = require("@/hooks/useTechnicians");
var jobs_1 = require("@/types/jobs");
var work_orders_1 = require("@/types/work-orders");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Dialog_1 = require("@/components/ui/Dialog");
var logger_1 = require("@/utils/logger");
var useDialog_1 = require("@/hooks/useDialog");
function JobScheduler(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f;
    var _onJobSelect = _a.onJobSelect, onJobEdit = _a.onJobEdit, _onJobCreate = _a.onJobCreate;
    var showAlert = (0, useDialog_1.useDialog)().showAlert;
    var _g = (0, react_1.useState)(new Date()), currentDate = _g[0], setCurrentDate = _g[1];
    var _h = (0, react_1.useState)('month'), viewMode = _h[0], setViewMode = _h[1];
    var _j = (0, react_1.useState)(null), selectedJob = _j[0], setSelectedJob = _j[1];
    var _k = (0, react_1.useState)(false), showJobDialog = _k[0], setShowJobDialog = _k[1];
    var _l = (0, react_1.useState)(false), showCreateDialog = _l[0], setShowCreateDialog = _l[1];
    var _m = (0, react_1.useState)(null), _selectedWorkOrder = _m[0], setSelectedWorkOrder = _m[1];
    var _o = (0, react_1.useState)(''), filterTechnician = _o[0], setFilterTechnician = _o[1];
    var _p = (0, react_1.useState)(''), searchTerm = _p[0], setSearchTerm = _p[1];
    var _q = (0, useJobs_1.useJobs)(), jobs = _q.data, jobsLoading = _q.isLoading, refetchJobs = _q.refetch;
    var workOrders = (0, useWorkOrders_1.useWorkOrders)({ status: work_orders_1.WorkOrderStatus.PENDING }).data;
    var technicians = (0, useTechnicians_1.useTechnicians)().data;
    var createJobMutation = (0, useJobs_1.useCreateJob)();
    var deleteJobMutation = (0, useJobs_1.useDeleteJob)();
    // Filter jobs based on search and technician filter
    var filteredJobs = (0, react_1.useMemo)(function () {
        if (!(jobs === null || jobs === void 0 ? void 0 : jobs.data))
            return [];
        return jobs.data.filter(function (job) {
            var _a, _b, _c, _d, _e, _f;
            var matchesSearch = !searchTerm ||
                ((_b = (_a = job.work_order) === null || _a === void 0 ? void 0 : _a.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((_d = (_c = job.technician) === null || _c === void 0 ? void 0 : _c.first_name) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((_f = (_e = job.technician) === null || _e === void 0 ? void 0 : _e.last_name) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchTerm.toLowerCase()));
            var matchesTechnician = !filterTechnician || job.technician_id === filterTechnician;
            return matchesSearch && matchesTechnician;
        });
    }, [jobs, searchTerm, filterTechnician]);
    // Get jobs for a specific date
    var getJobsForDate = function (date) {
        return filteredJobs.filter(function (job) {
            var jobDate = new Date(job.scheduled_date);
            return jobDate.toDateString() === date.toDateString();
        });
    };
    // Get days in month for calendar view
    var getDaysInMonth = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        var days = [];
        var current = new Date(startDate);
        while (current <= lastDay || current.getDay() !== 0) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };
    // Get week days for week view
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
    var navigateDate = function (direction) {
        var newDate = new Date(currentDate);
        switch (viewMode) {
            case 'month':
                newDate.setMonth(newDate.getMonth() + direction);
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (direction * 7));
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + direction);
                break;
        }
        setCurrentDate(newDate);
    };
    // Handle job creation from work order
    var handleCreateJobFromWorkOrder = function (workOrder) { return __awaiter(_this, void 0, void 0, function () {
        var accountId, locationId, scheduledDate, jobData, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    accountId = ((_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.id) || workOrder.customer_id;
                    locationId = workOrder.location_id;
                    if (!(!accountId || !locationId)) return [3 /*break*/, 2];
                    logger_1.logger.error('Work order missing account_id or location_id', { accountId: accountId, locationId: locationId }, 'JobScheduler');
                    return [4 /*yield*/, showAlert({
                            title: 'Cannot Create Job',
                            message: 'Work order must have a customer and location assigned.',
                            type: 'error',
                        })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
                case 2:
                    scheduledDate = workOrder.scheduled_date
                        ? new Date(workOrder.scheduled_date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0];
                    jobData = {
                        work_order_id: workOrder.id,
                        account_id: accountId,
                        location_id: locationId,
                        technician_id: (_b = workOrder.assigned_to) !== null && _b !== void 0 ? _b : undefined,
                        scheduled_date: (_c = scheduledDate !== null && scheduledDate !== void 0 ? scheduledDate : new Date().toISOString().split('T')[0]) !== null && _c !== void 0 ? _c : new Date().toISOString().substring(0, 10),
                        scheduled_start_time: '09:00',
                        scheduled_end_time: '17:00',
                        priority: workOrder.priority || 'medium',
                        status: jobs_1.JobStatus.SCHEDULED,
                        notes: "Job created from work order: ".concat(workOrder.description)
                    };
                    return [4 /*yield*/, createJobMutation.mutateAsync(jobData)];
                case 3:
                    _d.sent();
                    setShowCreateDialog(false);
                    setSelectedWorkOrder(null);
                    refetchJobs();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _d.sent();
                    logger_1.logger.error('Failed to create job', error_1, 'JobScheduler');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Handle job deletion
    var handleDeleteJob = function (job) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteJobMutation.mutateAsync(job.id)];
                case 1:
                    _a.sent();
                    setShowJobDialog(false);
                    setSelectedJob(null);
                    refetchJobs();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to delete job', error_2, 'JobScheduler');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Format time
    var formatTime = function (timeString) {
        return new Date("2000-01-01T".concat(timeString)).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    // Format date
    var formatDate = function (date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };
    // Get job status color
    var getJobStatusColor = function (status) {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'canceled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (jobsLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading jobs..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Job Scheduler" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage and schedule technician jobs" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: function () { return setShowCreateDialog(true); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Create Job"] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return navigateDate(-1); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-center min-w-[200px]", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold", children: [viewMode === 'month' && currentDate.toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric'
                                            }), viewMode === 'week' && "Week of ".concat((_b = getWeekDays(currentDate)[0]) === null || _b === void 0 ? void 0 : _b.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })), viewMode === 'day' && currentDate.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })] }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return navigateDate(1); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1", children: ['month', 'week', 'day', 'list'].map(function (mode) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode(mode); }, className: "px-3 py-1 rounded-md text-sm font-medium transition-colors ".concat(viewMode === mode
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'), children: mode.charAt(0).toUpperCase() + mode.slice(1) }, mode)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search jobs...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }), (0, jsx_runtime_1.jsxs)("select", { value: filterTechnician, onChange: function (e) { return setFilterTechnician(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Technicians" }), (_c = technicians === null || technicians === void 0 ? void 0 : technicians.technicians) === null || _c === void 0 ? void 0 : _c.map(function (tech) { return ((0, jsx_runtime_1.jsxs)("option", { value: tech.id, children: [tech.first_name, " ", tech.last_name] }, tech.id)); })] })] })] }) }), viewMode === 'list' ? ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Job" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date & Time" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredJobs.map(function (job) {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: ((_a = job.work_order) === null || _a === void 0 ? void 0 : _a.description) || 'No description' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Job #", job.id.slice(-8)] })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: job.technician ? "".concat(job.technician.first_name, " ").concat(job.technician.last_name) : 'Unassigned' }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: formatDate(new Date(job.scheduled_date)) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [formatTime(job.scheduled_start_time), " - ", formatTime(job.scheduled_end_time)] })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(getJobStatusColor(job.status)), children: job.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                                setSelectedJob(job);
                                                                setShowJobDialog(true);
                                                            }, className: "text-blue-600 hover:text-blue-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onJobEdit === null || onJobEdit === void 0 ? void 0 : onJobEdit(job); }, className: "text-gray-600 hover:text-gray-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) })] }) })] }, job.id));
                                }) })] }) }) })) : ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-7 gap-1", children: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (day) { return ((0, jsx_runtime_1.jsx)("div", { className: "text-center font-semibold text-gray-600 p-2 text-sm", children: day }, day)); }), getDaysInMonth(currentDate).map(function (date, index) {
                            var dayJobs = getJobsForDate(date);
                            var isCurrentMonth = date.getMonth() === currentDate.getMonth();
                            var isToday = date.toDateString() === new Date().toDateString();
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded p-2 min-h-[120px] ".concat(isCurrentMonth ? 'bg-white' : 'bg-gray-50', " ").concat(!isCurrentMonth ? 'text-gray-400' : '', " ").concat(isToday ? 'bg-blue-50 border-blue-200' : ''), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1 ".concat(isToday ? 'text-blue-600' : ''), children: date.getDate() }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [dayJobs.slice(0, 3).map(function (job) {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs p-1 rounded cursor-pointer text-white bg-blue-500 hover:bg-blue-600", onClick: function () {
                                                        setSelectedJob(job);
                                                        setShowJobDialog(true);
                                                    }, children: [(0, jsx_runtime_1.jsx)("div", { className: "truncate", children: ((_a = job.work_order) === null || _a === void 0 ? void 0 : _a.description) || 'No description' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs opacity-75", children: [formatTime(job.scheduled_start_time), " - ", (_b = job.technician) === null || _b === void 0 ? void 0 : _b.first_name] })] }, job.id));
                                            }), dayJobs.length > 3 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 text-center", children: ["+", dayJobs.length - 3, " more"] }))] })] }, index));
                        })] }) })), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showJobDialog, onOpenChange: setShowJobDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Job Details" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "View and manage job information" })] }), selectedJob && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: ((_d = selectedJob.work_order) === null || _d === void 0 ? void 0 : _d.description) || 'No description' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Status" }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(getJobStatusColor(selectedJob.status)), children: selectedJob.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Scheduled Date" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: formatDate(new Date(selectedJob.scheduled_date)) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Time" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900", children: [formatTime(selectedJob.scheduled_start_time), " - ", formatTime(selectedJob.scheduled_end_time)] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [selectedJob.technician && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Technician" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-900", children: [selectedJob.technician.first_name, " ", selectedJob.technician.last_name] }), selectedJob.technician.email && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), selectedJob.technician.email] })), selectedJob.technician.phone && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3" }), selectedJob.technician.phone] }))] })] })), ((_e = selectedJob.work_order) === null || _e === void 0 ? void 0 : _e.account) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Customer" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: selectedJob.work_order.account.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: selectedJob.work_order.account.account_type })] })] }))] })] }), selectedJob.notes && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1 p-3 bg-gray-50 rounded-md", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900 whitespace-pre-wrap", children: selectedJob.notes }) })] }))] })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowJobDialog(false); }, children: "Close" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: function () { return selectedJob && (onJobEdit === null || onJobEdit === void 0 ? void 0 : onJobEdit(selectedJob)); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-2" }), "Edit Job"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "danger", onClick: function () { return selectedJob && handleDeleteJob(selectedJob); }, disabled: deleteJobMutation.isPending, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4 mr-2" }), deleteJobMutation.isPending ? 'Deleting...' : 'Delete Job'] })] })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Create Job from Work Order" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Select a work order to create a scheduled job" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsx)("div", { className: "max-h-96 overflow-y-auto", children: (_f = workOrders === null || workOrders === void 0 ? void 0 : workOrders.data) === null || _f === void 0 ? void 0 : _f.map(function (workOrder) {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer", onClick: function () { return setSelectedWorkOrder(workOrder); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: workOrder.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Customer: ", ((_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Priority: ", workOrder.priority, " | Status: ", workOrder.status] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                                        handleCreateJobFromWorkOrder(workOrder);
                                                    }, disabled: createJobMutation.isPending, children: createJobMutation.isPending ? 'Creating...' : 'Create Job' })] }) }, workOrder.id));
                                }) }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowCreateDialog(false); }, children: "Cancel" }) })] }) })] }));
}
