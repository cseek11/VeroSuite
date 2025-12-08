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
exports.ResourceTimeline = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var logger_1 = require("@/utils/logger");
var Dialog_1 = require("@/components/ui/Dialog");
var MINUTES_PER_HOUR = 60;
var DEFAULT_START_HOUR = 6; // 6 AM
var DEFAULT_END_HOUR = 22; // 10 PM
var VISIBLE_HOURS = DEFAULT_END_HOUR - DEFAULT_START_HOUR;
var ResourceTimeline = function (_a) {
    var _b, _c;
    var _d = _a.selectedDate, selectedDate = _d === void 0 ? new Date() : _d, onDateChange = _a.onDateChange, onJobSelect = _a.onJobSelect, onJobUpdate = _a.onJobUpdate;
    var _e = (0, react_1.useState)(selectedDate), viewDate = _e[0], setViewDate = _e[1];
    var _f = (0, react_1.useState)(null), selectedJob = _f[0], setSelectedJob = _f[1];
    var _g = (0, react_1.useState)(false), showJobDialog = _g[0], setShowJobDialog = _g[1];
    var _h = (0, react_1.useState)(1), zoomLevel = _h[0], setZoomLevel = _h[1]; // 1 = day view, 0.5 = half day, 2 = 2 days
    var timeRange = (0, react_1.useState)({ start: DEFAULT_START_HOUR, end: DEFAULT_END_HOUR })[0];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Calculate date range based on zoom level
    var dateRange = (0, react_1.useMemo)(function () {
        var start = new Date(viewDate);
        start.setHours(0, 0, 0, 0);
        var end = new Date(start);
        end.setDate(end.getDate() + Math.ceil(zoomLevel));
        return { start: start, end: end };
    }, [viewDate, zoomLevel]);
    // Fetch technicians
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'timeline'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(enhanced_api_1.enhancedApi.technicians && typeof enhanced_api_1.enhancedApi.technicians.list === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, enhanced_api_1.enhancedApi.users.list()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to fetch technicians', error_1, 'ResourceTimeline');
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        staleTime: 10 * 60 * 1000,
    }), _k = _j.data, technicians = _k === void 0 ? [] : _k, techniciansLoading = _j.isLoading, techniciansError = _j.error;
    // Fetch jobs for date range
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'timeline', dateRange.start.toISOString(), dateRange.end.toISOString()],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var startDateStr, endDateStr, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startDateStr = dateRange.start.toISOString().split('T')[0];
                        endDateStr = dateRange.end.toISOString().split('T')[0];
                        if (!startDateStr || !endDateStr) {
                            throw new Error('Invalid date range');
                        }
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(startDateStr, endDateStr)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.logger.error('Failed to fetch jobs for timeline', error_2, 'ResourceTimeline');
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        staleTime: 2 * 60 * 1000,
    }), _m = _l.data, jobs = _m === void 0 ? [] : _m, jobsLoading = _l.isLoading, jobsError = _l.error;
    // Process jobs into timeline format
    var timelineJobs = (0, react_1.useMemo)(function () {
        var processed = new Map();
        technicians.forEach(function (tech) {
            processed.set(tech.id, []);
        });
        jobs.forEach(function (job) {
            if (!job.technician_id || !job.scheduled_start_time || !job.scheduled_end_time) {
                return;
            }
            var startParts = job.scheduled_start_time.split(':');
            var endParts = job.scheduled_end_time.split(':');
            var startHour = startParts[0] ? Number(startParts[0]) : undefined;
            var startMinute = startParts[1] ? Number(startParts[1]) : undefined;
            var endHour = endParts[0] ? Number(endParts[0]) : undefined;
            var endMinute = endParts[1] ? Number(endParts[1]) : undefined;
            if (startHour === undefined || startMinute === undefined || endHour === undefined || endMinute === undefined) {
                return;
            }
            var startTime = startHour * MINUTES_PER_HOUR + startMinute;
            var endTime = endHour * MINUTES_PER_HOUR + endMinute;
            var duration = endTime - startTime;
            // Calculate position and width
            var visibleStart = timeRange.start * MINUTES_PER_HOUR;
            var visibleEnd = timeRange.end * MINUTES_PER_HOUR;
            var visibleDuration = visibleEnd - visibleStart;
            var left = ((startTime - visibleStart) / visibleDuration) * 100;
            var width = (duration / visibleDuration) * 100;
            var timelineJob = __assign(__assign({}, job), { customer: job.customer || { id: '', name: 'Unknown' }, location: job.location || { id: '', name: 'Unknown', address: 'Unknown' }, service: job.service || { type: 'Unknown', description: '', estimated_duration: 0 }, startTime: startTime, endTime: endTime, duration: duration, left: Math.max(0, Math.min(100, left)), width: Math.max(1, Math.min(100, width)) });
            var techJobs = processed.get(job.technician_id) || [];
            techJobs.push(timelineJob);
            processed.set(job.technician_id, techJobs);
        });
        return processed;
    }, [jobs, technicians, timeRange]);
    // Generate time slots for header
    var timeSlots = (0, react_1.useMemo)(function () {
        var slots = [];
        for (var hour = timeRange.start; hour <= timeRange.end; hour++) {
            slots.push("".concat(hour.toString().padStart(2, '0'), ":00"));
        }
        return slots;
    }, [timeRange]);
    // Update job mutation
    var updateJobMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var jobId = _b.jobId, updates = _b.updates;
            return __generator(this, function (_c) {
                return [2 /*return*/, enhanced_api_1.enhancedApi.jobs.update(jobId, updates)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setShowJobDialog(false);
            var jobId = selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.id;
            setSelectedJob(null);
            if (jobId) {
                logger_1.logger.info('Job updated successfully', { jobId: jobId }, 'ResourceTimeline');
            }
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update job', error, 'ResourceTimeline');
        }
    });
    // Navigation handlers
    var handlePreviousDay = function () {
        var newDate = new Date(viewDate);
        newDate.setDate(newDate.getDate() - 1);
        setViewDate(newDate);
        onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(newDate);
    };
    var handleNextDay = function () {
        var newDate = new Date(viewDate);
        newDate.setDate(newDate.getDate() + 1);
        setViewDate(newDate);
        onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(newDate);
    };
    var handleToday = function () {
        var today = new Date();
        setViewDate(today);
        onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(today);
    };
    var handleZoomIn = function () {
        setZoomLevel(function (prev) { return Math.min(prev * 1.5, 7); }); // Max 7 days
    };
    var handleZoomOut = function () {
        setZoomLevel(function (prev) { return Math.max(prev / 1.5, 0.5); }); // Min half day
    };
    // Job click handler
    var handleJobClick = function (job) {
        setSelectedJob(job);
        setShowJobDialog(true);
        onJobSelect === null || onJobSelect === void 0 ? void 0 : onJobSelect(job);
    };
    // Get job color based on status and priority
    var getJobColor = function (job) {
        if (job.status === 'completed')
            return 'bg-green-500';
        if (job.status === 'in_progress')
            return 'bg-blue-500';
        if (job.status === 'cancelled')
            return 'bg-gray-400';
        if (job.priority === 'urgent')
            return 'bg-red-600';
        if (job.priority === 'high')
            return 'bg-orange-500';
        if (job.priority === 'medium')
            return 'bg-yellow-500';
        return 'bg-blue-400';
    };
    // Get job border color based on priority
    var getJobBorderColor = function (job) {
        if (job.priority === 'urgent')
            return 'border-red-800';
        if (job.priority === 'high')
            return 'border-orange-700';
        if (job.priority === 'medium')
            return 'border-yellow-600';
        return 'border-blue-500';
    };
    if (techniciansLoading || jobsLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-96", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}) }));
    }
    if (techniciansError || jobsError) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-red-600", children: [(0, jsx_runtime_1.jsx)("p", { children: "Failed to load timeline data" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: techniciansError instanceof Error ? techniciansError.message : 'Unknown error' })] }) }));
    }
    var activeTechnicians = technicians.filter(function (tech) { return tech.is_active; });
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handlePreviousDay, "aria-label": "Previous day", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleToday, "aria-label": "Today", children: "Today" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleNextDay, "aria-label": "Next day", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4 font-semibold", children: viewDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleZoomOut, "aria-label": "Zoom out", disabled: zoomLevel <= 0.5, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ZoomOut, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 min-w-[80px] text-center", children: [zoomLevel.toFixed(1), " day", zoomLevel !== 1 ? 's' : ''] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleZoomIn, "aria-label": "Zoom in", disabled: zoomLevel >= 7, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ZoomIn, { className: "h-4 w-4" }) })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-0 overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "min-w-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "sticky top-0 z-10 bg-white border-b", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-48 border-r p-2 font-semibold bg-gray-50", children: "Technician" }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", style: { minWidth: "".concat(VISIBLE_HOURS * 60, "px") }, children: (0, jsx_runtime_1.jsx)("div", { className: "flex", children: timeSlots.map(function (time, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 border-r p-2 text-center text-sm font-medium", style: { minWidth: "".concat((VISIBLE_HOURS / timeSlots.length) * 60, "px") }, children: time }, index)); }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "divide-y", children: activeTechnicians.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-gray-500", children: "No active technicians found" })) : (activeTechnicians.map(function (technician) {
                                    var techJobs = timelineJobs.get(technician.id) || [];
                                    var technicianName = "".concat(technician.first_name, " ").concat(technician.last_name);
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-[80px] hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-48 border-r p-4 bg-gray-50 flex items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-gray-600" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: technicianName })] }), techJobs.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-auto text-xs text-gray-500", children: [techJobs.length, " job", techJobs.length !== 1 ? 's' : ''] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", style: { minWidth: "".concat(VISIBLE_HOURS * 60, "px") }, children: (0, jsx_runtime_1.jsxs)("div", { className: "relative h-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex", children: timeSlots.map(function (_, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 border-r border-gray-200", style: { minWidth: "".concat((VISIBLE_HOURS / timeSlots.length) * 60, "px") } }, index)); }) }), techJobs.map(function (job) {
                                                            var _a, _b, _c, _d;
                                                            var jobColor = getJobColor(job);
                                                            var borderColor = getJobBorderColor(job);
                                                            return ((0, jsx_runtime_1.jsx)("div", { onClick: function () { return handleJobClick(job); }, className: "absolute top-2 bottom-2 rounded border-2 ".concat(jobColor, " ").concat(borderColor, " cursor-pointer hover:opacity-80 transition-opacity shadow-sm"), style: {
                                                                    left: "".concat(job.left, "%"),
                                                                    width: "".concat(job.width, "%"),
                                                                    minWidth: '60px'
                                                                }, title: "".concat(((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown', " - ").concat(((_b = job.service) === null || _b === void 0 ? void 0 : _b.type) || 'Unknown', " (").concat(job.scheduled_start_time, " - ").concat(job.scheduled_end_time, ")"), children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2 h-full flex flex-col justify-between text-white text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold truncate", children: ((_c = job.customer) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown' }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs opacity-90 truncate", children: ((_d = job.service) === null || _d === void 0 ? void 0 : _d.type) || 'Unknown' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs opacity-75", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [job.scheduled_start_time, " - ", job.scheduled_end_time] })] }), job.location && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs opacity-75 truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: job.location.name })] }))] }) }, job.id));
                                                        }), techJobs.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center text-gray-400 text-sm", children: "No jobs scheduled" }))] }) })] }, technician.id));
                                })) })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showJobDialog, onOpenChange: setShowJobDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Job Details" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "View and manage job information" })] }), selectedJob && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-lg", children: ((_b = selectedJob.customer) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: ((_c = selectedJob.service) === null || _c === void 0 ? void 0 : _c.type) || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Status" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: selectedJob.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Priority" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: selectedJob.priority })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: selectedJob.scheduled_date })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Time" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm", children: [selectedJob.scheduled_start_time, " - ", selectedJob.scheduled_end_time] })] }), selectedJob.location && ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Location" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: selectedJob.location.address })] }))] })] })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowJobDialog(false); }, children: "Close" }), onJobUpdate && selectedJob && ((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () {
                                            // Example: Mark as in progress
                                            updateJobMutation.mutate({
                                                jobId: selectedJob.id,
                                                updates: { status: 'in_progress' }
                                            });
                                        }, children: "Update Status" }))] })] }) })] }) }));
};
exports.ResourceTimeline = ResourceTimeline;
