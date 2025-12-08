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
exports.default = JobsCalendarCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var ScheduleCalendar_1 = require("@/components/scheduling/ScheduleCalendar");
var PageCardManager_1 = __importDefault(require("@/components/dashboard/PageCardManager"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var enhanced_api_1 = require("@/lib/enhanced-api");
var components_1 = require("@/routes/dashboard/components");
var CardInteractionRegistry_1 = require("@/routes/dashboard/utils/CardInteractionRegistry");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
function JobsCalendarCard(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var onJobSelect = _a.onJobSelect, onJobEdit = _a.onJobEdit, onJobCreate = _a.onJobCreate, onClose = _a.onClose, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.cardId, cardId = _g === void 0 ? 'jobs-calendar' : _g;
    var user = (0, auth_1.useAuthStore)().user;
    var _h = (0, react_1.useState)(new Date()), selectedDate = _h[0], setSelectedDate = _h[1];
    // Note: calendarView is managed by ScheduleCalendar component
    var _j = (0, react_1.useState)(''), searchQuery = _j[0], setSearchQuery = _j[1];
    var _k = (0, react_1.useState)('all'), filterStatus = _k[0], setFilterStatus = _k[1];
    var _l = (0, react_1.useState)('all'), filterPriority = _l[0], setFilterPriority = _l[1];
    var _m = (0, react_1.useState)(null), selectedJob = _m[0], setSelectedJob = _m[1];
    var _o = (0, react_1.useState)(null), dropZoneConfig = _o[0], setDropZoneConfig = _o[1];
    // Register card for interactions
    (0, react_1.useEffect)(function () {
        var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
        // Create appointment action handler
        var createAppointmentHandler = function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var customer, event_1;
            return __generator(this, function (_a) {
                try {
                    customer = payload.data.entity;
                    logger_1.logger.debug('Creating appointment from customer drag', {
                        customerId: customer.id,
                        customerName: customer.name
                    });
                    // Store pending appointment data (for future use if needed)
                    // setPendingAppointment({
                    //   customer: customer,
                    //   date: selectedDate.toISOString().split('T')[0]
                    // });
                    // Trigger job creation with customer pre-filled
                    if (onJobCreate) {
                        event_1 = new CustomEvent('card-interaction:create-appointment', {
                            detail: {
                                customer: customer,
                                date: selectedDate
                            }
                        });
                        window.dispatchEvent(event_1);
                        // Also call the onJobCreate callback if available
                        onJobCreate();
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Opening appointment creation for ".concat(customer.name),
                            data: { customer: customer, date: selectedDate }
                        }];
                }
                catch (error) {
                    logger_1.logger.error('Error creating appointment from customer', error);
                    return [2 /*return*/, {
                            success: false,
                            error: error instanceof Error ? error.message : 'Failed to create appointment'
                        }];
                }
                return [2 /*return*/];
            });
        }); };
        var config = {
            cardId: cardId,
            cardType: 'jobs-calendar',
            accepts: {
                dataTypes: ['customer', 'job', 'workorder']
            },
            actions: {
                'create-appointment': {
                    id: 'create-appointment',
                    label: 'Create Appointment',
                    icon: '📅',
                    description: 'Schedule a new appointment for this customer',
                    handler: createAppointmentHandler,
                    requiresConfirmation: false
                },
                'reschedule': {
                    id: 'reschedule',
                    label: 'Reschedule Job',
                    icon: '🔄',
                    description: 'Reschedule an existing job to the selected date',
                    handler: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                        var job, newDate, updateData, error_1, error_2;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    if (payload.sourceDataType !== 'job' || !((_a = payload.data) === null || _a === void 0 ? void 0 : _a.entity)) {
                                        return [2 /*return*/, {
                                                success: false,
                                                error: 'Invalid data type. Expected job data.'
                                            }];
                                    }
                                    job = payload.data.entity;
                                    logger_1.logger.debug('Rescheduling job from drag', {
                                        jobId: job.id,
                                        currentDate: job.scheduled_date,
                                        newDate: selectedDate.toISOString().split('T')[0]
                                    });
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    newDate = selectedDate.toISOString().split('T')[0];
                                    if (!newDate) {
                                        return [2 /*return*/, {
                                                success: false,
                                                error: 'Invalid date selected'
                                            }];
                                    }
                                    updateData = {
                                        scheduled_date: newDate
                                    };
                                    if (job.scheduled_start_time) {
                                        updateData.scheduled_start_time = job.scheduled_start_time;
                                    }
                                    else {
                                        updateData.scheduled_start_time = '09:00:00';
                                    }
                                    if (job.scheduled_end_time) {
                                        updateData.scheduled_end_time = job.scheduled_end_time;
                                    }
                                    return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.update(job.id, updateData)];
                                case 2:
                                    _b.sent();
                                    logger_1.logger.info('Job rescheduled successfully', {
                                        jobId: job.id,
                                        newDate: selectedDate.toISOString().split('T')[0]
                                    });
                                    return [2 /*return*/, {
                                            success: true,
                                            message: "Job rescheduled to ".concat(selectedDate.toLocaleDateString()),
                                            data: {
                                                jobId: job.id,
                                                newDate: selectedDate.toISOString().split('T')[0]
                                            }
                                        }];
                                case 3:
                                    error_1 = _b.sent();
                                    logger_1.logger.error('Failed to reschedule job', { error: error_1, jobId: job.id });
                                    return [2 /*return*/, {
                                            success: false,
                                            error: error_1 instanceof Error ? error_1.message : 'Failed to reschedule job'
                                        }];
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_2 = _b.sent();
                                    logger_1.logger.error('Error rescheduling job from drag', error_2);
                                    return [2 /*return*/, {
                                            success: false,
                                            error: error_2 instanceof Error ? error_2.message : 'Failed to reschedule job'
                                        }];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); },
                    requiresConfirmation: true,
                    confirmationMessage: 'Are you sure you want to reschedule this job to the selected date?'
                }
            },
            dropZoneStyle: {
                highlightColor: '#6366f1',
                borderStyle: 'dashed',
                backgroundColor: 'rgba(99, 102, 241, 0.05)'
            }
        };
        var cardConfig = {
            id: cardId,
            type: 'jobs-calendar',
            dropZones: [config]
        };
        setDropZoneConfig(config);
        registry.registerCard(cardConfig);
        logger_1.logger.debug('Registered Jobs Calendar Card for interactions', { cardId: cardId });
        // Listen for appointment creation events
        var handleAppointmentEvent = function (_event) {
            // const { customer, date } = _event.detail;
            // Store pending appointment data if needed in the future
            // setPendingAppointment({ customer, date });
            if (onJobCreate) {
                onJobCreate();
            }
        };
        window.addEventListener('card-interaction:create-appointment', handleAppointmentEvent);
        return function () {
            registry.unregisterCard(cardId);
            window.removeEventListener('card-interaction:create-appointment', handleAppointmentEvent);
        };
    }, [cardId, selectedDate, onJobCreate, user]);
    // Note: Jobs are fetched by ScheduleCalendar component to avoid duplicate queries
    // We'll fetch jobs here only for statistics and filtering
    var _p = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'calendar', 'all'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var startDate, endDate, startDateStr, endDateStr;
            return __generator(this, function (_a) {
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                startDateStr = startDate.toISOString().split('T')[0];
                endDateStr = endDate.toISOString().split('T')[0];
                if (!startDateStr || !endDateStr) {
                    throw new Error('Invalid date range');
                }
                return [2 /*return*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(startDateStr, endDateStr)];
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for stats
    }), _q = _p.data, allJobs = _q === void 0 ? [] : _q, jobsError = _p.error;
    // Filter jobs based on search and filters (for statistics only)
    var filteredJobs = allJobs.filter(function (job) {
        var _a, _b, _c, _d, _e, _f;
        var matchesSearch = searchQuery === '' ||
            ((_b = (_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ((_d = (_c = job.service) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ((_f = (_e = job.location) === null || _e === void 0 ? void 0 : _e.address) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchQuery.toLowerCase()));
        var matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        var matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });
    // Handle job selection
    var handleJobSelect = function (job) {
        setSelectedJob(job);
        onJobSelect === null || onJobSelect === void 0 ? void 0 : onJobSelect(job);
    };
    // Handle job edit
    var handleJobEdit = function (job) {
        setSelectedJob(job);
        onJobEdit === null || onJobEdit === void 0 ? void 0 : onJobEdit(job);
    };
    // Handle job create - open a modal or navigate to job creation
    var handleJobCreate = function () {
        if (onJobCreate) {
            onJobCreate();
        }
        else {
            // Fallback: try to open job creation dialog or navigate
            logger_1.logger.info('Job creation requested', { selectedDate: selectedDate });
            // You can add a modal here or navigate to job creation page
            // For now, we'll dispatch an event that can be caught by parent
            var event_2 = new CustomEvent('jobs-calendar:create-job', {
                detail: { date: selectedDate }
            });
            window.dispatchEvent(event_2);
        }
    };
    // Get job statistics
    var getJobStats = function () {
        var total = filteredJobs.length;
        var completed = filteredJobs.filter(function (job) { return job.status === 'completed'; }).length;
        var inProgress = filteredJobs.filter(function (job) { return job.status === 'in_progress'; }).length;
        var scheduled = filteredJobs.filter(function (job) { return job.status === 'scheduled' || job.status === 'assigned'; }).length;
        var unassigned = filteredJobs.filter(function (job) { return job.status === 'unassigned'; }).length;
        return { total: total, completed: completed, inProgress: inProgress, scheduled: scheduled, unassigned: unassigned };
    };
    var stats = getJobStats();
    return ((0, jsx_runtime_1.jsx)(PageCardManager_1.default, __assign({ cardId: cardId || 'jobs-calendar', cardType: "jobs-calendar" }, (onClose && { onClose: onClose }), { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "h-full w-full flex flex-col p-6", children: [jobsError && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-500 mb-2", children: "\u26A0\uFE0F Error loading jobs" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: jobsError instanceof Error ? jobsError.message : 'Unknown error occurred' })] })), !jobsError && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-5 w-5 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Jobs Calendar" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: selectedDate.toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: stats.total }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Total" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: stats.completed }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: stats.inProgress }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "In Progress" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-600", children: stats.scheduled }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Scheduled" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-600", children: stats.unassigned }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Unassigned" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search jobs...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)(ui_1.Select, { value: filterStatus, onValueChange: setFilterStatus, children: [(0, jsx_runtime_1.jsx)(ui_1.SelectTrigger, { className: "w-32", children: (0, jsx_runtime_1.jsx)(ui_1.SelectValue, { placeholder: "Status" }) }), (0, jsx_runtime_1.jsxs)(ui_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "unassigned", children: "Unassigned" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "scheduled", children: "Scheduled" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "in_progress", children: "In Progress" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "cancelled", children: "Cancelled" })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Select, { value: filterPriority, onValueChange: setFilterPriority, children: [(0, jsx_runtime_1.jsx)(ui_1.SelectTrigger, { className: "w-32", children: (0, jsx_runtime_1.jsx)(ui_1.SelectValue, { placeholder: "Priority" }) }), (0, jsx_runtime_1.jsxs)(ui_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "all", children: "All Priority" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "low", children: "Low" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "high", children: "High" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "urgent", children: "Urgent" })] })] })] }), dropZoneConfig && ((0, jsx_runtime_1.jsx)(components_1.DropZone, { cardId: cardId, dropZoneConfig: dropZoneConfig, onDrop: function (payload, result) {
                                var _a, _b, _c, _d;
                                if (result.success) {
                                    logger_1.logger.info('Action completed from drag-and-drop', {
                                        actionId: (_a = result.data) === null || _a === void 0 ? void 0 : _a.actionId,
                                        customerId: (_b = payload.data) === null || _b === void 0 ? void 0 : _b.id,
                                        jobId: (_c = payload.data) === null || _c === void 0 ? void 0 : _c.id
                                    });
                                    // Refresh jobs if rescheduled
                                    if (((_d = result.data) === null || _d === void 0 ? void 0 : _d.actionId) === 'reschedule') {
                                        // The query will automatically refetch due to invalidation
                                    }
                                }
                            }, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)(ScheduleCalendar_1.ScheduleCalendar, { selectedDate: selectedDate, onDateChange: setSelectedDate, onJobSelect: handleJobSelect, onJobEdit: handleJobEdit, onJobCreate: handleJobCreate, searchQuery: searchQuery, filterStatus: filterStatus, filterPriority: filterPriority }), searchQuery && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 mt-2", children: ["Searching for: \"", searchQuery, "\""] }))] }) })), selectedJob && ((0, jsx_runtime_1.jsx)(components_1.DraggableContent, { cardId: cardId, dataType: "job", data: selectedJob, className: "mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Selected Job (Drag to assign or reschedule)" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () { return setSelectedJob(null); }, children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Customer" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (_c = (_b = selectedJob.customer) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Service" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (_e = (_d = selectedJob.service) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Status" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium capitalize", children: selectedJob.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Priority" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium capitalize", children: selectedJob.priority })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Scheduled" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: new Date(selectedJob.scheduled_date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Time" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: [selectedJob.scheduled_start_time, " - ", selectedJob.scheduled_end_time] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return handleJobEdit(selectedJob); }, children: "Edit Job" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () { return setSelectedJob(null); }, children: "Close" })] })] }) }))] }))] }) })));
}
