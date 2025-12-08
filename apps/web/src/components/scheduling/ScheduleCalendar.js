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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleCalendar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
var Label_1 = __importDefault(require("@/components/ui/Label"));
var ConflictBadge_1 = require("./ConflictBadge");
var AlertPanel_1 = require("./AlertPanel");
var RecurrencePatternSelector_1 = require("./RecurrencePatternSelector");
var RecurrencePreview_1 = require("./RecurrencePreview");
var RecurringSeriesManager_1 = require("./RecurringSeriesManager");
var ConflictResolutionDialog_1 = require("@/components/dashboard/ConflictResolutionDialog");
var logger_1 = require("@/utils/logger");
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var SchedulingAnalytics_1 = __importDefault(require("./SchedulingAnalytics"));
var Dialog_1 = require("@/components/ui/Dialog");
var CRMComponents_1 = require("@/components/ui/CRMComponents");
var ScheduleCalendar = function (_a) {
    var _b, _c, _d, _e;
    var _f = _a.selectedDate, selectedDate = _f === void 0 ? new Date() : _f, onDateChange = _a.onDateChange, onJobSelect = _a.onJobSelect, onJobEdit = _a.onJobEdit, _onJobCreate = _a.onJobCreate, _g = _a.searchQuery, searchQuery = _g === void 0 ? '' : _g, _h = _a.filterStatus, filterStatus = _h === void 0 ? 'all' : _h, _j = _a.filterPriority, filterPriority = _j === void 0 ? 'all' : _j, _k = _a.showAnalytics, showAnalytics = _k === void 0 ? false : _k, _l = _a.analyticsMode, analyticsMode = _l === void 0 ? 'embedded' : _l, _m = _a.showMap, showMap = _m === void 0 ? false : _m, _o = _a.mapMode, mapMode = _o === void 0 ? 'overlay' : _o, _p = _a.enableBulkSelection, enableBulkSelection = _p === void 0 ? false : _p, onBulkSelect = _a.onBulkSelect, filterTechnician = _a.filterTechnician, _q = _a.showTechnicianMetrics, _showTechnicianMetrics = _q === void 0 ? false : _q;
    var _r = (0, react_1.useState)('week'), currentView = _r[0], setCurrentView = _r[1];
    var _s = (0, react_1.useState)(new Set()), selectedJobIds = _s[0], setSelectedJobIds = _s[1];
    var _t = (0, react_1.useState)(null), selectedJob = _t[0], setSelectedJob = _t[1];
    var _u = (0, react_1.useState)(false), _isEditing = _u[0], setIsEditing = _u[1];
    var _v = (0, react_1.useState)(null), _editingJob = _v[0], setEditingJob = _v[1];
    var _w = (0, react_1.useState)(false), showJobDialog = _w[0], setShowJobDialog = _w[1];
    var _x = (0, react_1.useState)(null), draggedJob = _x[0], setDraggedJob = _x[1];
    var _y = (0, react_1.useState)([]), alerts = _y[0], setAlerts = _y[1];
    var _z = (0, react_1.useState)(new Map()), jobConflicts = _z[0], setJobConflicts = _z[1];
    var _0 = (0, react_1.useState)(new Map()), availabilityStatus = _0[0], setAvailabilityStatus = _0[1];
    var _1 = (0, react_1.useState)(false), showCreateDialog = _1[0], setShowCreateDialog = _1[1];
    var _2 = (0, react_1.useState)(false), _isRecurring = _2[0], setIsRecurring = _2[1];
    var _3 = (0, react_1.useState)(null), _recurrencePattern = _3[0], setRecurrencePattern = _3[1];
    var _4 = (0, react_1.useState)(false), showSeriesManager = _4[0], setShowSeriesManager = _4[1];
    var _5 = (0, react_1.useState)(null), selectedTemplateId = _5[0], setSelectedTemplateId = _5[1];
    var _6 = (0, react_1.useState)(false), conflictDialogOpen = _6[0], setConflictDialogOpen = _6[1];
    var _7 = (0, react_1.useState)(null), conflictData = _7[0], setConflictData = _7[1];
    var _8 = (0, react_1.useState)(null), pendingJobUpdate = _8[0], setPendingJobUpdate = _8[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Debug: Log when search props change
    (0, react_1.useEffect)(function () {
        if (searchQuery || filterStatus !== 'all' || filterPriority !== 'all') {
            logger_1.logger.debug('ScheduleCalendar filters changed', { searchQuery: searchQuery, filterStatus: filterStatus, filterPriority: filterPriority }, 'ScheduleCalendar');
        }
    }, [searchQuery, filterStatus, filterPriority]);
    // Fetch jobs for the selected date range
    // Use keepPreviousData to prevent flickering when switching views
    var _9 = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'calendar', selectedDate, currentView],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var startDate, endDate, startDateStr, endDateStr, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = getDateRangeStart(selectedDate, currentView);
                        endDate = getDateRangeEnd(selectedDate, currentView);
                        startDateStr = startDate.toISOString().split('T')[0];
                        endDateStr = endDate.toISOString().split('T')[0];
                        if (!startDateStr || !endDateStr) {
                            throw new Error('Invalid date range');
                        }
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(startDateStr, endDateStr)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: react_query_1.keepPreviousData, // Keep showing previous data while loading new data (React Query v5)
    }), _10 = _9.data, jobs = _10 === void 0 ? [] : _10, jobsLoading = _9.isLoading, jobsError = _9.error;
    // Filter jobs based on search and filters
    var filteredJobs = (0, react_1.useMemo)(function () {
        if (!jobs || jobs.length === 0) {
            return [];
        }
        var filtered = jobs.filter(function (job) {
            var _a, _b, _c, _d, _e;
            // Handle different data structures
            var customerName = ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || ((_b = job.account) === null || _b === void 0 ? void 0 : _b.name) || job.account_name || '';
            var serviceType = ((_c = job.service) === null || _c === void 0 ? void 0 : _c.type) || job.service_type || job.service_name || '';
            var locationAddress = ((_d = job.location) === null || _d === void 0 ? void 0 : _d.address) || job.location_address || job.address || '';
            var jobStatus = job.status || '';
            var jobPriority = job.priority || '';
            var jobTechnicianId = job.technician_id || '';
            // Search matching
            var searchLower = searchQuery.toLowerCase();
            var matchesSearch = searchQuery === '' ||
                customerName.toLowerCase().includes(searchLower) ||
                serviceType.toLowerCase().includes(searchLower) ||
                locationAddress.toLowerCase().includes(searchLower) ||
                ((_e = job.id) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(searchLower));
            // Status matching
            var matchesStatus = filterStatus === 'all' || jobStatus === filterStatus;
            // Priority matching
            var matchesPriority = filterPriority === 'all' || jobPriority === filterPriority;
            // Technician matching
            var matchesTechnician = !filterTechnician || jobTechnicianId === filterTechnician;
            return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
        });
        // Debug logging
        if (searchQuery || filterStatus !== 'all' || filterPriority !== 'all') {
            logger_1.logger.debug('Filtering jobs', {
                totalJobs: jobs.length,
                filteredCount: filtered.length,
                searchQuery: searchQuery,
                filterStatus: filterStatus,
                filterPriority: filterPriority
            }, 'ScheduleCalendar');
        }
        return filtered;
    }, [jobs, searchQuery, filterStatus, filterPriority]);
    // Fetch technicians
    var _11 = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'active'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.technicians && typeof enhanced_api_1.enhancedApi.technicians.list === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, enhanced_api_1.enhancedApi.users.list()];
                }
            });
        }); },
        staleTime: 10 * 60 * 1000, // 10 minutes
    }), _12 = _11.data, technicians = _12 === void 0 ? [] : _12, techniciansLoading = _11.isLoading;
    // Check availability for jobs with technicians
    (0, react_1.useEffect)(function () {
        var checkAvailability = function () { return __awaiter(void 0, void 0, void 0, function () {
            var availabilityMap, jobsToCheck, uniqueChecks, _i, jobsToCheck_1, job, key, _loop_1, _a, _b, _c, _key, jobs_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        availabilityMap = new Map();
                        jobsToCheck = filteredJobs.filter(function (job) {
                            return job.technician_id &&
                                job.scheduled_date &&
                                job.scheduled_start_time &&
                                job.scheduled_end_time;
                        });
                        uniqueChecks = new Map();
                        for (_i = 0, jobsToCheck_1 = jobsToCheck; _i < jobsToCheck_1.length; _i++) {
                            job = jobsToCheck_1[_i];
                            key = "".concat(job.technician_id, "-").concat(job.scheduled_date, "-").concat(job.scheduled_start_time, "-").concat(job.scheduled_end_time);
                            if (!uniqueChecks.has(key)) {
                                uniqueChecks.set(key, []);
                            }
                            uniqueChecks.get(key).push(job);
                        }
                        _loop_1 = function (_key, jobs_1) {
                            var job, available, techAvailability, _e, jobs_2, j, error_1;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        job = jobs_1[0];
                                        _f.label = 1;
                                    case 1:
                                        _f.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.getAvailable(job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time)];
                                    case 2:
                                        available = _f.sent();
                                        techAvailability = available.find(function (t) { return t.id === job.technician_id; });
                                        // Set availability status for all jobs with this key
                                        for (_e = 0, jobs_2 = jobs_1; _e < jobs_2.length; _e++) {
                                            j = jobs_2[_e];
                                            if (techAvailability) {
                                                availabilityMap.set(j.id, {
                                                    is_available: techAvailability.is_available,
                                                    reason: techAvailability.reason
                                                });
                                            }
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _f.sent();
                                        // Silently fail - don't block calendar rendering
                                        logger_1.logger.debug('Availability check failed for job', { jobId: job.id, error: error_1 }, 'ScheduleCalendar');
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _a = 0, _b = uniqueChecks.entries();
                        _d.label = 1;
                    case 1:
                        if (!(_a < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_a], _key = _c[0], jobs_1 = _c[1];
                        return [5 /*yield**/, _loop_1(_key, jobs_1)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4:
                        setAvailabilityStatus(availabilityMap);
                        return [2 /*return*/];
                }
            });
        }); };
        // Debounce availability checking
        var timeoutId = setTimeout(function () {
            checkAvailability();
        }, 500);
        return function () { return clearTimeout(timeoutId); };
    }, [filteredJobs]);
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
            setEditingJob(null);
            setIsEditing(false);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update job', error, 'ScheduleCalendar');
        }
    });
    // Check for conflicts for displayed jobs
    (0, react_1.useEffect)(function () {
        var checkConflicts = function () { return __awaiter(void 0, void 0, void 0, function () {
            var newAlerts, conflictsMap, _loop_2, _i, filteredJobs_1, job, state_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        newAlerts = [];
                        conflictsMap = new Map();
                        _loop_2 = function (job) {
                            var conflictResult, firstConflict, highestSeverity, error_2, scheduledDate, today;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        if (!(job.technician_id && job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time)) return [3 /*break*/, 4];
                                        _g.label = 1;
                                    case 1:
                                        _g.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.checkConflicts(job.technician_id, job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time, [job.id] // Exclude current job
                                            )];
                                    case 2:
                                        conflictResult = _g.sent();
                                        if (conflictResult.has_conflicts && conflictResult.conflicts.length > 0) {
                                            firstConflict = conflictResult.conflicts[0];
                                            if (!firstConflict)
                                                return [2 /*return*/, { value: void 0 }];
                                            highestSeverity = conflictResult.conflicts.reduce(function (max, c) {
                                                var _a, _b;
                                                var severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                                                return ((_a = severityOrder[c.severity]) !== null && _a !== void 0 ? _a : 4) < ((_b = severityOrder[max.severity]) !== null && _b !== void 0 ? _b : 4) ? c : max;
                                            }, firstConflict);
                                            if (highestSeverity) {
                                                conflictsMap.set(job.id, {
                                                    type: highestSeverity.type,
                                                    severity: highestSeverity.severity
                                                });
                                                // Create alert for critical/high conflicts
                                                if (highestSeverity.severity === 'critical' || highestSeverity.severity === 'high') {
                                                    newAlerts.push({
                                                        id: "conflict-".concat(job.id),
                                                        type: 'conflict',
                                                        severity: highestSeverity.severity,
                                                        message: "Conflict: ".concat(highestSeverity.description),
                                                        jobId: job.id,
                                                        jobTitle: "".concat(((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown', " - ").concat(((_b = job.service) === null || _b === void 0 ? void 0 : _b.type) || 'Unknown'),
                                                        timestamp: new Date(),
                                                        onClick: function () {
                                                            setSelectedJob(job);
                                                            setShowJobDialog(true);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_2 = _g.sent();
                                        // Silently fail conflict checks - don't block calendar rendering
                                        logger_1.logger.debug('Conflict check failed for job', { jobId: job.id, error: error_2 }, 'ScheduleCalendar');
                                        return [3 /*break*/, 4];
                                    case 4:
                                        // Check for overdue jobs
                                        if ((job.status === 'assigned' || job.status === 'unassigned') && job.scheduled_date) {
                                            scheduledDate = new Date(job.scheduled_date);
                                            today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            scheduledDate.setHours(0, 0, 0, 0);
                                            if (scheduledDate < today) {
                                                newAlerts.push({
                                                    id: "overdue-".concat(job.id),
                                                    type: 'overdue',
                                                    severity: 'high',
                                                    message: "Overdue job: ".concat(((_c = job.customer) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown'),
                                                    jobId: job.id,
                                                    jobTitle: "".concat(((_d = job.customer) === null || _d === void 0 ? void 0 : _d.name) || 'Unknown', " - ").concat(((_e = job.service) === null || _e === void 0 ? void 0 : _e.type) || 'Unknown'),
                                                    timestamp: new Date(),
                                                    onClick: function () {
                                                        setSelectedJob(job);
                                                        setShowJobDialog(true);
                                                    }
                                                });
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, filteredJobs_1 = filteredJobs;
                        _f.label = 1;
                    case 1:
                        if (!(_i < filteredJobs_1.length)) return [3 /*break*/, 4];
                        job = filteredJobs_1[_i];
                        return [5 /*yield**/, _loop_2(job)];
                    case 2:
                        state_1 = _f.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        setAlerts(newAlerts);
                        setJobConflicts(conflictsMap);
                        return [2 /*return*/];
                }
            });
        }); };
        // Debounce conflict checking
        var timeoutId = setTimeout(function () {
            checkConflicts();
        }, 500);
        return function () { return clearTimeout(timeoutId); };
    }, [filteredJobs]);
    // Convert filtered jobs to calendar events
    var calendarEvents = (0, react_1.useMemo)(function () {
        return filteredJobs.map(function (job) {
            var _a, _b, _c, _d, _e;
            var startTime = job.scheduled_start_time ?
                new Date("".concat(job.scheduled_date, "T").concat(job.scheduled_start_time)) :
                new Date("".concat(job.scheduled_date, "T09:00:00"));
            var endTime = job.scheduled_end_time ?
                new Date("".concat(job.scheduled_date, "T").concat(job.scheduled_end_time)) :
                new Date(startTime.getTime() + (((_a = job.service) === null || _a === void 0 ? void 0 : _a.estimated_duration) || 60) * 60000);
            var technician = technicians.find(function (t) { return (t.id || t.user_id) === job.technician_id; });
            var conflict = jobConflicts.get(job.id);
            var availability = availabilityStatus.get(job.id);
            var hasAvailabilityIssue = availability && !availability.is_available;
            return {
                id: job.id,
                title: "".concat(((_b = job.customer) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown', " - ").concat(((_c = job.service) === null || _c === void 0 ? void 0 : _c.type) || 'Unknown'),
                start: startTime,
                end: endTime,
                technicianId: job.technician_id || undefined,
                technicianName: technician
                    ? "".concat(technician.first_name || '', " ").concat(technician.last_name || '').trim() || technician.email || 'Unknown'
                    : 'Unassigned',
                status: job.status,
                priority: job.priority,
                customer: ((_d = job.customer) === null || _d === void 0 ? void 0 : _d.name) || 'Unknown',
                location: ((_e = job.location) === null || _e === void 0 ? void 0 : _e.address) || 'Unknown',
                color: getJobColor(job.status, job.priority, !!conflict || hasAvailabilityIssue),
                job: job,
                hasConflict: !!conflict || undefined,
                conflictType: (conflict === null || conflict === void 0 ? void 0 : conflict.type) || undefined,
                conflictSeverity: (conflict === null || conflict === void 0 ? void 0 : conflict.severity) || undefined,
                availabilityIssue: hasAvailabilityIssue ? availability.reason : undefined,
                isRecurring: !!job.is_recurring || !!job.recurring_template_id || undefined
            };
        });
    }, [filteredJobs, technicians, jobConflicts, availabilityStatus]);
    // Get date range based on current view
    var getDateRangeStart = function (date, view) {
        var d = new Date(date);
        switch (view) {
            case 'month':
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                return d;
            case 'week':
                var day = d.getDay();
                d.setDate(d.getDate() - day);
                d.setHours(0, 0, 0, 0);
                return d;
            case 'day':
                d.setHours(0, 0, 0, 0);
                return d;
            case 'list':
                // For list view, show a wider range (30 days back)
                d.setDate(d.getDate() - 30);
                d.setHours(0, 0, 0, 0);
                return d;
            default:
                return d;
        }
    };
    var getDateRangeEnd = function (date, view) {
        var d = new Date(date);
        switch (view) {
            case 'month':
                d.setMonth(d.getMonth() + 1);
                d.setDate(0);
                d.setHours(23, 59, 59, 999);
                return d;
            case 'week':
                d.setDate(d.getDate() - d.getDay() + 6);
                d.setHours(23, 59, 59, 999);
                return d;
            case 'day':
                d.setHours(23, 59, 59, 999);
                return d;
            case 'list':
                // For list view, show a wider range (30 days forward)
                d.setDate(d.getDate() + 30);
                d.setHours(23, 59, 59, 999);
                return d;
            default:
                return d;
        }
    };
    // Get job color based on status and priority
    var getJobColor = function (status, priority, hasConflict) {
        // Override with conflict color if conflict exists
        if (hasConflict)
            return '#ef4444'; // Red for conflicts
        if (status === 'completed')
            return '#22c55e';
        if (status === 'cancelled')
            return '#ef4444';
        if (status === 'in_progress')
            return '#3b82f6';
        switch (priority) {
            case 'urgent': return '#dc2626';
            case 'high': return '#ea580c';
            case 'medium': return '#d97706';
            case 'low': return '#65a30d';
            default: return '#6b7280';
        }
    };
    // Get border color based on conflict severity
    var getConflictBorderColor = function (severity) {
        switch (severity) {
            case 'critical': return 'border-red-500 border-2';
            case 'high': return 'border-orange-500 border-2';
            case 'medium': return 'border-yellow-500 border-2';
            case 'low': return 'border-blue-500 border';
            default: return '';
        }
    };
    // Handle job drag start
    var handleDragStart = function (event, job) {
        setDraggedJob(job);
        event.dataTransfer.effectAllowed = 'move';
    };
    // Handle job drop with conflict checking
    var handleDrop = function (event, targetDate, targetTime) { return __awaiter(void 0, void 0, void 0, function () {
        var dateStr, newStartTime, newEndTime, newStartTimeStr, newEndTimeStr, newDateStr, conflictResult, error_3;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    event.preventDefault();
                    if (!draggedJob)
                        return [2 /*return*/];
                    dateStr = targetDate.toISOString().split('T')[0];
                    if (!dateStr)
                        return [2 /*return*/];
                    newStartTime = new Date("".concat(dateStr, "T").concat(targetTime));
                    newEndTime = new Date(newStartTime.getTime() + (((_a = draggedJob.service) === null || _a === void 0 ? void 0 : _a.estimated_duration) || 60) * 60000);
                    newStartTimeStr = targetTime;
                    newEndTimeStr = (_c = (_b = newEndTime.toTimeString().split(' ')[0]) === null || _b === void 0 ? void 0 : _b.substring(0, 5)) !== null && _c !== void 0 ? _c : '10:00';
                    newDateStr = dateStr;
                    if (!draggedJob.technician_id) return [3 /*break*/, 4];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.checkConflicts(draggedJob.technician_id, newDateStr, newStartTimeStr, newEndTimeStr, [draggedJob.id] // Exclude current job
                        )];
                case 2:
                    conflictResult = _d.sent();
                    if (conflictResult.has_conflicts) {
                        // Store pending update and show conflict dialog
                        setPendingJobUpdate({
                            jobId: draggedJob.id,
                            updates: {
                                scheduled_date: newDateStr,
                                scheduled_start_time: newStartTimeStr,
                                scheduled_end_time: newEndTimeStr
                            }
                        });
                        setConflictData({
                            conflicts: conflictResult.conflicts,
                            canProceed: conflictResult.can_proceed
                        });
                        setConflictDialogOpen(true);
                        setDraggedJob(null);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _d.sent();
                    logger_1.logger.warn('Failed to check conflicts, proceeding with update', { error: error_3 }, 'ScheduleCalendar');
                    return [3 /*break*/, 4];
                case 4:
                    // No conflicts or no technician assigned - proceed with update
                    updateJobMutation.mutate({
                        jobId: draggedJob.id,
                        updates: {
                            scheduled_date: newDateStr,
                            scheduled_start_time: newStartTimeStr,
                            scheduled_end_time: newEndTimeStr
                        }
                    });
                    setDraggedJob(null);
                    return [2 /*return*/];
            }
        });
    }); };
    // Handle conflict resolution proceed
    var handleConflictProceed = function () {
        if (pendingJobUpdate) {
            updateJobMutation.mutate(pendingJobUpdate);
            setPendingJobUpdate(null);
        }
        setConflictDialogOpen(false);
        setConflictData(null);
    };
    // Handle conflict resolution cancel
    var handleConflictCancel = function () {
        setPendingJobUpdate(null);
        setConflictDialogOpen(false);
        setConflictData(null);
    };
    // Handle job click
    var handleJobClick = function (job) {
        setSelectedJob(job);
        setShowJobDialog(true);
        onJobSelect === null || onJobSelect === void 0 ? void 0 : onJobSelect(job);
    };
    // Handle job edit
    var handleJobEdit = function (job) {
        setEditingJob(job);
        setIsEditing(true);
        onJobEdit === null || onJobEdit === void 0 ? void 0 : onJobEdit(job);
    };
    // Render time slots for a day
    var renderTimeSlots = function (date) {
        var timeSlots = [];
        var _loop_3 = function (hour) {
            timeSlots.push((0, jsx_runtime_1.jsxs)("div", { className: "border-b border-gray-200 p-2 min-h-[60px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 mb-1", children: [hour.toString().padStart(2, '0'), ":00"] }), (0, jsx_runtime_1.jsx)("div", { className: "min-h-[50px] p-1", onDragOver: function (e) { return e.preventDefault(); }, onDrop: function (e) { return handleDrop(e, date, "".concat(hour.toString().padStart(2, '0'), ":00")); }, children: calendarEvents
                            .filter(function (event) {
                            var eventDate = new Date(event.start);
                            return eventDate.toDateString() === date.toDateString() &&
                                eventDate.getHours() === hour;
                        })
                            .map(function (event) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow relative ".concat(getConflictBorderColor(event.conflictSeverity)), style: { backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }, draggable: true, onDragStart: function (e) { return handleDragStart(e, event.job); }, onClick: function () { return handleJobClick(event.job); }, children: [event.hasConflict && event.conflictType && event.conflictSeverity && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", children: (0, jsx_runtime_1.jsx)(ConflictBadge_1.ConflictBadge, { type: event.conflictType, severity: event.conflictSeverity, size: "sm" }) })), event.availabilityIssue && !event.hasConflict && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", title: event.availabilityIssue, children: (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-orange-500 rounded-full border border-white" }) })), (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-white truncate ".concat((event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''), children: event.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/80 text-xs", children: event.technicianName }), event.availabilityIssue && ((0, jsx_runtime_1.jsxs)("div", { className: "text-white/70 text-xs mt-1 italic truncate", title: event.availabilityIssue, children: ["\u26A0\uFE0F ", event.availabilityIssue] })), event.isRecurring && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 -mt-1 -ml-1 z-10", title: "Recurring job", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Repeat, { className: "w-3 h-3 text-blue-300" }) }))] }, event.id)); }) })] }, hour));
        };
        for (var hour = 6; hour < 20; hour++) {
            _loop_3(hour);
        }
        return timeSlots;
    };
    // Render week view
    var renderWeekView = function () {
        var startDate = getDateRangeStart(selectedDate, 'week');
        var days = Array.from({ length: 7 }, function (_, i) {
            var date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date;
        });
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-8 gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 p-2", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-700", children: "Time" }) }), days.map(function (day, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-2 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-700", children: day.toLocaleDateString('en-US', { weekday: 'short' }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: day.getDate() })] }, index)); }), Array.from({ length: 14 }, function (_, hourIndex) {
                    var hour = hourIndex + 6;
                    return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-2 text-xs text-gray-500", children: [hour.toString().padStart(2, '0'), ":00"] }), days.map(function (day, dayIndex) { return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 p-1 min-h-[60px]", onDragOver: function (e) { return e.preventDefault(); }, onDrop: function (e) { return handleDrop(e, day, "".concat(hour.toString().padStart(2, '0'), ":00")); }, children: calendarEvents
                                    .filter(function (event) {
                                    var eventDate = new Date(event.start);
                                    return eventDate.toDateString() === day.toDateString() &&
                                        eventDate.getHours() === hour;
                                })
                                    .map(function (event) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow mb-1 relative ".concat(getConflictBorderColor(event.conflictSeverity)), style: { backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }, draggable: true, onDragStart: function (e) { return handleDragStart(e, event.job); }, onClick: function () { return handleJobClick(event.job); }, children: [event.hasConflict && event.conflictType && event.conflictSeverity && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", children: (0, jsx_runtime_1.jsx)(ConflictBadge_1.ConflictBadge, { type: event.conflictType, severity: event.conflictSeverity, size: "sm" }) })), event.availabilityIssue && !event.hasConflict && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", title: event.availabilityIssue, children: (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-orange-500 rounded-full border border-white" }) })), (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-white truncate ".concat((event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''), children: event.customer }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/80 text-xs", children: event.technicianName }), event.availabilityIssue && ((0, jsx_runtime_1.jsx)("div", { className: "text-white/70 text-xs mt-0.5 italic truncate", title: event.availabilityIssue, children: "\u26A0\uFE0F" })), event.isRecurring && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 -mt-1 -ml-1 z-10", title: "Recurring job", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Repeat, { className: "w-2 h-2 text-blue-300" }) }))] }, event.id)); }) }, "".concat(dayIndex, "-").concat(hour))); })] }, hour));
                })] }));
    };
    // Handle bulk selection toggle
    var handleBulkToggle = function (jobId) {
        if (!enableBulkSelection)
            return;
        var newSelection = new Set(selectedJobIds);
        if (newSelection.has(jobId)) {
            newSelection.delete(jobId);
        }
        else {
            newSelection.add(jobId);
        }
        setSelectedJobIds(newSelection);
        onBulkSelect === null || onBulkSelect === void 0 ? void 0 : onBulkSelect(Array.from(newSelection));
    };
    // Render list view
    var renderListView = function () {
        var sortedJobs = __spreadArray([], filteredJobs, true).sort(function (a, b) {
            var dateA = new Date("".concat(a.scheduled_date, "T").concat(a.scheduled_start_time || '00:00:00'));
            var dateB = new Date("".concat(b.scheduled_date, "T").concat(b.scheduled_start_time || '00:00:00'));
            return dateA.getTime() - dateB.getTime();
        });
        return ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [enableBulkSelection && ((0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedJobIds.size === filteredJobs.length && filteredJobs.length > 0, onChange: function (e) {
                                            if (e.target.checked) {
                                                var allIds = new Set(filteredJobs.map(function (j) { return j.id; }));
                                                setSelectedJobIds(allIds);
                                                onBulkSelect === null || onBulkSelect === void 0 ? void 0 : onBulkSelect(Array.from(allIds));
                                            }
                                            else {
                                                setSelectedJobIds(new Set());
                                                onBulkSelect === null || onBulkSelect === void 0 ? void 0 : onBulkSelect([]);
                                            }
                                        }, className: "rounded border-gray-300" }) })), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Job" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date & Time" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Priority" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: sortedJobs.length === 0 ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: enableBulkSelection ? 8 : 7, className: "px-3 py-2 text-center text-sm text-gray-500", style: { height: 'var(--row-height, 44px)' }, children: "No jobs found" }) })) : (sortedJobs.map(function (job) {
                            var _a, _b, _c, _d, _e;
                            var technician = technicians.find(function (t) { return (t.id || t.user_id) === job.technician_id; });
                            var technicianName = technician
                                ? "".concat(technician.first_name || '', " ").concat(technician.last_name || '').trim() || technician.email || 'Unknown'
                                : 'Unassigned';
                            var isSelected = selectedJobIds.has(job.id);
                            return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50 ".concat(isSelected ? 'bg-blue-50' : ''), style: { height: 'var(--row-height, 44px)' }, children: [enableBulkSelection && ((0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isSelected, onChange: function () { return handleBulkToggle(job.id); }, className: "rounded border-gray-300" }) })), (0, jsx_runtime_1.jsxs)("td", { className: "px-3 py-2 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: ((_a = job.service) === null || _a === void 0 ? void 0 : _a.type) || job.service_type || 'Service' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: ((_b = job.service) === null || _b === void 0 ? void 0 : _b.description) || job.description || 'No description' })] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-3 py-2 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: ((_c = job.customer) === null || _c === void 0 ? void 0 : _c.name) || ((_d = job.account) === null || _d === void 0 ? void 0 : _d.name) || 'Unknown' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: ((_e = job.location) === null || _e === void 0 ? void 0 : _e.address) || job.location_address || '' })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: technicianName }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-3 py-2 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: new Date(job.scheduled_date).toLocaleDateString() }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [job.scheduled_start_time || '00:00', " - ", job.scheduled_end_time || '00:00'] })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    job.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                        job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'), children: job.status || 'unknown' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                    job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'), children: job.priority || 'medium' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                        setSelectedJob(job);
                                                        setShowJobDialog(true);
                                                        onJobSelect === null || onJobSelect === void 0 ? void 0 : onJobSelect(job);
                                                    }, className: "text-blue-600 hover:text-blue-900", title: "View details", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                        handleJobEdit(job);
                                                    }, className: "text-gray-600 hover:text-gray-900", title: "Edit job", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) })] }) })] }, job.id));
                        })) })] }) }));
    };
    // Render month view
    var renderMonthView = function () {
        var startDate = getDateRangeStart(selectedDate, 'month');
        var endDate = getDateRangeEnd(selectedDate, 'month');
        var days = [];
        for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-7 gap-1", children: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (day) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 p-2 text-center text-sm font-medium text-gray-700", children: day }, day)); }), days.map(function (day, index) {
                    var dayEvents = calendarEvents.filter(function (event) {
                        var eventDate = new Date(event.start);
                        return eventDate.toDateString() === day.toDateString();
                    });
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 p-2 min-h-[120px] hover:bg-gray-50", onDragOver: function (e) { return e.preventDefault(); }, onDrop: function (e) { return handleDrop(e, day, '09:00'); }, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-700 mb-1", children: day.getDate() }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: dayEvents.map(function (event) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow relative ".concat(getConflictBorderColor(event.conflictSeverity)), style: { backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }, draggable: true, onDragStart: function (e) { return handleDragStart(e, event.job); }, onClick: function () { return handleJobClick(event.job); }, children: [event.hasConflict && event.conflictType && event.conflictSeverity && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", children: (0, jsx_runtime_1.jsx)(ConflictBadge_1.ConflictBadge, { type: event.conflictType, severity: event.conflictSeverity, size: "sm" }) })), event.availabilityIssue && !event.hasConflict && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mt-1 -mr-1 z-10", title: event.availabilityIssue, children: (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full border border-white" }) })), (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-white truncate ".concat((event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''), children: event.customer }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/80 text-xs", children: event.start.toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            }) })] }, event.id)); }) })] }, index));
                })] }));
    };
    if (jobsError) {
        return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "mx-auto h-12 w-12 text-red-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "Error loading jobs" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: jobsError instanceof Error ? jobsError.message : 'Unknown error occurred' })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-md shadow-sm relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-semibold text-gray-900", children: selectedDate.toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: currentView === 'month' ? 'primary' : 'secondary', size: "sm", onClick: function () { return setCurrentView('month'); }, children: "Month" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: currentView === 'week' ? 'primary' : 'secondary', size: "sm", onClick: function () { return setCurrentView('week'); }, children: "Week" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: currentView === 'day' ? 'primary' : 'secondary', size: "sm", onClick: function () { return setCurrentView('day'); }, children: "Day" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: currentView === 'list' ? 'primary' : 'secondary', size: "sm", onClick: function () { return setCurrentView('list'); }, children: "List" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                                            var newDate = new Date(selectedDate);
                                            newDate.setDate(newDate.getDate() - (currentView === 'month' ? 30 : currentView === 'week' ? 7 : 1));
                                            onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(newDate);
                                        }, children: "\u2190" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                                            var newDate = new Date(selectedDate);
                                            newDate.setDate(newDate.getDate() + (currentView === 'month' ? 30 : currentView === 'week' ? 7 : 1));
                                            onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(newDate);
                                        }, children: "\u2192" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", onClick: function () {
                                            setShowCreateDialog(true);
                                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Add Job"] })] })] }) }), showAnalytics && analyticsMode === 'dashboard' && ((0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 p-3", children: (0, jsx_runtime_1.jsx)(SchedulingAnalytics_1.default, { startDate: getDateRangeStart(selectedDate, currentView), endDate: getDateRangeEnd(selectedDate, currentView), onDateRangeChange: function (start, _end) {
                            // Update selected date if user changes range in analytics
                            if (onDateChange) {
                                onDateChange(start);
                            }
                        } }) })), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 ".concat(showMap && mapMode === 'side' ? 'flex gap-3' : ''), children: [showMap && mapMode === 'side' && ((0, jsx_runtime_1.jsx)("div", { className: "w-1/3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-100 rounded-lg h-full flex items-center justify-center text-gray-500", children: "Map View (Side Mode)" }) })), (0, jsx_runtime_1.jsx)("div", { className: showMap && mapMode === 'side' ? 'flex-1' : '', children: jobsLoading || techniciansLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading calendar..." }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showAnalytics && analyticsMode === 'embedded' && ((0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(SchedulingAnalytics_1.default, { startDate: getDateRangeStart(selectedDate, currentView), endDate: getDateRangeEnd(selectedDate, currentView), onDateRangeChange: function (start, _end) {
                                                // Update selected date if user changes range in analytics
                                                if (onDateChange) {
                                                    onDateChange(start);
                                                }
                                            } }) })), currentView === 'month' && renderMonthView(), currentView === 'week' && renderWeekView(), currentView === 'day' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: renderTimeSlots(selectedDate) })), currentView === 'list' && renderListView()] })) })] }), showMap && mapMode === 'overlay' && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-1/3 h-full bg-white border-l border-gray-200 shadow-lg z-10 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-100 rounded-lg h-full flex items-center justify-center text-gray-500", children: "Map View (Overlay Mode)" }) })), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showJobDialog, onOpenChange: setShowJobDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Job Details" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "View and manage job information" })] }), selectedJob && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [selectedJob.is_recurring && selectedJob.recurring_template_id && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Repeat, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-blue-900", children: "Recurring Job" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                                                        setSelectedTemplateId(selectedJob.recurring_template_id);
                                                        setShowSeriesManager(true);
                                                        setShowJobDialog(false);
                                                    }, children: "Manage Series" })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Customer" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: ((_b = selectedJob.customer) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Status" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900 capitalize", children: selectedJob.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Priority" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900 capitalize", children: selectedJob.priority })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Service Type" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: ((_c = selectedJob.service) === null || _c === void 0 ? void 0 : _c.type) || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Scheduled Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: new Date(selectedJob.scheduled_date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Time Window" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-900", children: [selectedJob.scheduled_start_time, " - ", selectedJob.scheduled_end_time] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Location" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: ((_d = selectedJob.location) === null || _d === void 0 ? void 0 : _d.address) || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Technician" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: selectedJob.technician_id
                                                            ? (function () {
                                                                var tech = technicians.find(function (t) { return (t.id || t.user_id) === selectedJob.technician_id; });
                                                                var first = (tech === null || tech === void 0 ? void 0 : tech.first_name) || '';
                                                                var last = (tech === null || tech === void 0 ? void 0 : tech.last_name) || '';
                                                                var fullName = "".concat(first, " ").concat(last).trim();
                                                                return fullName || (tech === null || tech === void 0 ? void 0 : tech.email) || 'Unassigned';
                                                            })()
                                                            : 'Unassigned' })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: ((_e = selectedJob.service) === null || _e === void 0 ? void 0 : _e.description) || selectedJob.job_description || 'No description' })] })] })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setShowJobDialog(false); }, children: "Close" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return selectedJob && handleJobEdit(selectedJob); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-1" }), "Edit Job"] })] })] }) }), (0, jsx_runtime_1.jsx)(JobCreateDialog, { open: showCreateDialog, onClose: function () {
                        setShowCreateDialog(false);
                        setIsRecurring(false);
                        setRecurrencePattern(null);
                    }, selectedDate: selectedDate, onJobCreated: function () {
                        queryClient.invalidateQueries({ queryKey: ['jobs'] });
                        setShowCreateDialog(false);
                        setIsRecurring(false);
                        setRecurrencePattern(null);
                    } }), showSeriesManager && selectedTemplateId && ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showSeriesManager, onOpenChange: setShowSeriesManager, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: (0, jsx_runtime_1.jsx)(RecurringSeriesManager_1.RecurringSeriesManager, { templateId: selectedTemplateId, onClose: function () {
                                setShowSeriesManager(false);
                                setSelectedTemplateId(null);
                            }, onEdit: function (templateId) {
                                // TODO: Open edit dialog
                                logger_1.logger.debug('Edit template requested', { templateId: templateId }, 'ScheduleCalendar');
                            } }) }) })), conflictData && ((0, jsx_runtime_1.jsx)(ConflictResolutionDialog_1.ConflictResolutionDialog, __assign({ open: conflictDialogOpen, conflicts: conflictData.conflicts, canProceed: conflictData.canProceed, onProceed: handleConflictProceed, onCancel: handleConflictCancel }, (function () {
                    var _a, _b;
                    if (!(draggedJob === null || draggedJob === void 0 ? void 0 : draggedJob.technician_id))
                        return {};
                    var technician = technicians.find(function (t) { return (t.id || t.user_id) === draggedJob.technician_id; });
                    if (!technician)
                        return {};
                    var technicianName = "".concat((_a = technician.first_name) !== null && _a !== void 0 ? _a : '', " ").concat((_b = technician.last_name) !== null && _b !== void 0 ? _b : '').trim();
                    return technicianName ? { technicianName: technicianName } : {};
                })()))), (0, jsx_runtime_1.jsx)(AlertPanel_1.AlertPanel, { alerts: alerts, onAlertClick: function (alert) {
                        if (alert.jobId) {
                            var job = filteredJobs.find(function (j) { return j.id === alert.jobId; });
                            if (job) {
                                setSelectedJob(job);
                                setShowJobDialog(true);
                            }
                        }
                    }, onDismiss: function (alertId) {
                        setAlerts(function (prev) { return prev.filter(function (a) { return a.id !== alertId; }); });
                    } })] }) }));
};
exports.ScheduleCalendar = ScheduleCalendar;
// Job Creation Dialog Component
// Validation schema following best practices
var jobCreateSchema = zod_2.z.object({
    customer_id: zod_2.z.string().uuid('Please select a valid customer'),
    location_id: zod_2.z.string().min(1, 'Location is required'),
    service_type: zod_2.z.string().min(1, 'Service type is required'),
    priority: zod_2.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    scheduled_date: zod_2.z.string().min(1, 'Scheduled date is required'),
    scheduled_start_time: zod_2.z.string().min(1, 'Start time is required'),
    scheduled_end_time: zod_2.z.string().min(1, 'End time is required'),
    technician_id: zod_2.z.string().optional().or(zod_2.z.literal('')),
    description: zod_2.z.string().max(2000, 'Description must be less than 2000 characters').optional(),
});
var JobCreateDialog = function (_a) {
    var _b;
    var open = _a.open, onClose = _a.onClose, selectedDate = _a.selectedDate, onJobCreated = _a.onJobCreated;
    var _c = (0, react_1.useState)(false), isRecurring = _c[0], setIsRecurring = _c[1];
    var _d = (0, react_1.useState)(null), recurrencePattern = _d[0], setRecurrencePattern = _d[1];
    var _e = (0, react_1.useState)(null), selectedCustomer = _e[0], setSelectedCustomer = _e[1];
    var _f = (0, react_1.useState)([]), customerLocations = _f[0], setCustomerLocations = _f[1];
    var _g = (0, react_1.useState)(null), submitError = _g[0], setSubmitError = _g[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Use react-hook-form with zod validation
    var _h = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(jobCreateSchema),
        defaultValues: {
            customer_id: '',
            location_id: '',
            service_type: '',
            priority: 'medium',
            scheduled_date: (_b = selectedDate.toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : new Date().toISOString().substring(0, 10),
            scheduled_start_time: '09:00',
            scheduled_end_time: '10:00',
            technician_id: '',
            description: '',
        },
    }), control = _h.control, handleSubmit = _h.handleSubmit, errors = _h.formState.errors, watch = _h.watch, setValue = _h.setValue, reset = _h.reset;
    var watchedCustomerId = watch('customer_id');
    var watchedScheduledDate = watch('scheduled_date');
    var watchedStartTime = watch('scheduled_start_time');
    var watchedEndTime = watch('scheduled_end_time');
    // Update scheduled_date when selectedDate changes
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (open) {
            var baseDate = selectedDate !== null && selectedDate !== void 0 ? selectedDate : new Date();
            var safeDate = (_b = (_a = baseDate.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : '';
            setValue('scheduled_date', safeDate);
        }
    }, [selectedDate, open, setValue]);
    // Reset form when dialog closes
    (0, react_1.useEffect)(function () {
        var _a;
        if (!open) {
            reset({
                customer_id: '',
                location_id: '',
                service_type: '',
                priority: 'medium',
                scheduled_date: (_a = selectedDate.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().substring(0, 10),
                scheduled_start_time: '09:00',
                scheduled_end_time: '10:00',
                technician_id: '',
                description: '',
            });
            setIsRecurring(false);
            setRecurrencePattern(null);
            setSelectedCustomer(null);
            setCustomerLocations([]);
            setSubmitError(null);
        }
    }, [open, selectedDate, reset]);
    // Fetch locations when customer is selected
    (0, react_1.useEffect)(function () {
        if (watchedCustomerId && selectedCustomer) {
            var loadLocations = function () { return __awaiter(void 0, void 0, void 0, function () {
                var locations, currentLocationId, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, enhanced_api_1.enhancedApi.locations.getByCustomerId(watchedCustomerId)];
                        case 1:
                            locations = _a.sent();
                            setCustomerLocations(locations || []);
                            // Auto-select first location if available
                            if (locations && locations.length > 0) {
                                currentLocationId = watch('location_id');
                                if (!currentLocationId && locations[0]) {
                                    setValue('location_id', locations[0].id);
                                }
                            }
                            else {
                                setValue('location_id', '');
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            logger_1.logger.error('Error loading locations', error_4, 'ScheduleCalendar');
                            setCustomerLocations([]);
                            setValue('location_id', '');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            loadLocations();
        }
        else {
            setCustomerLocations([]);
            setValue('location_id', '');
        }
    }, [watchedCustomerId, selectedCustomer, setValue, watch]);
    // Fetch service types
    var serviceTypesData = (0, react_query_1.useQuery)({
        queryKey: ['service-types'],
        queryFn: function () { return enhanced_api_1.enhancedApi.serviceTypes.getAll(); },
        staleTime: 10 * 60 * 1000,
    }).data;
    // Extract service types array from response
    var serviceTypes = serviceTypesData || [];
    // Fallback service types if API doesn't return data
    var defaultServiceTypes = [
        'General Pest Control',
        'Termite Treatment',
        'Rodent Control',
        'Bed Bug Treatment',
        'Wildlife Removal',
        'Inspection',
        'Maintenance'
    ];
    var availableServiceTypes = serviceTypes.length > 0
        ? serviceTypes.map(function (st) { return st.service_name || st.name; })
        : defaultServiceTypes;
    // Fetch technicians
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'active'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.technicians && typeof enhanced_api_1.enhancedApi.technicians.list === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, enhanced_api_1.enhancedApi.users.list()];
                }
            });
        }); },
        staleTime: 10 * 60 * 1000,
    }).data, technicians = _j === void 0 ? [] : _j;
    // Create job mutation
    var createJobMutation = (0, react_query_1.useMutation)({
        mutationFn: function (jobData) { return __awaiter(void 0, void 0, void 0, function () {
            var customerName, templatePayload, template, generateUntil, generateUntilStr, jobPayload;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRecurring && recurrencePattern)) return [3 /*break*/, 3];
                        customerName = (selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.name) || 'Job';
                        templatePayload = {
                            name: "Recurring: ".concat(customerName),
                            description: jobData.description || '',
                            recurrence_type: recurrencePattern.recurrence_type,
                            recurrence_interval: recurrencePattern.recurrence_interval,
                            start_time: "".concat(jobData.scheduled_start_time, ":00"),
                            end_time: "".concat(jobData.scheduled_end_time, ":00"),
                            start_date: recurrencePattern.start_date,
                            job_template: {
                                customer_id: jobData.customer_id,
                                location_id: jobData.location_id,
                                service_type_id: jobData.service_type,
                                priority: jobData.priority,
                                notes: jobData.description || '',
                            },
                        };
                        if (recurrencePattern.recurrence_days_of_week && recurrencePattern.recurrence_days_of_week.length > 0) {
                            templatePayload.recurrence_days_of_week = recurrencePattern.recurrence_days_of_week;
                        }
                        if (recurrencePattern.recurrence_day_of_month !== undefined) {
                            templatePayload.recurrence_day_of_month = recurrencePattern.recurrence_day_of_month;
                        }
                        if (recurrencePattern.end_date) {
                            templatePayload.end_date = recurrencePattern.end_date;
                        }
                        if (recurrencePattern.max_occurrences !== undefined) {
                            templatePayload.max_occurrences = recurrencePattern.max_occurrences;
                        }
                        if (recurrencePattern.recurrence_weekday_of_month) {
                            templatePayload.recurrence_weekday_of_month = recurrencePattern.recurrence_weekday_of_month;
                        }
                        if (jobData.technician_id) {
                            templatePayload.job_template.technician_id = jobData.technician_id;
                        }
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.recurring.createTemplate(templatePayload)];
                    case 1:
                        template = _b.sent();
                        generateUntil = new Date();
                        generateUntil.setMonth(generateUntil.getMonth() + 3);
                        generateUntilStr = (_a = generateUntil.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().substring(0, 10);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.recurring.generate(template.id, generateUntilStr)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, template];
                    case 3:
                        jobPayload = {
                            account_id: jobData.customer_id,
                            location_id: jobData.location_id,
                            scheduled_date: jobData.scheduled_date,
                            scheduled_start_time: jobData.scheduled_start_time,
                            scheduled_end_time: jobData.scheduled_end_time,
                            priority: jobData.priority,
                        };
                        if (jobData.technician_id) {
                            jobPayload.technician_id = jobData.technician_id;
                        }
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.create(jobPayload)];
                    case 4: return [2 /*return*/, _b.sent()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
            onJobCreated();
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create job', error, 'ScheduleCalendar');
            setSubmitError(error.message || 'Failed to create job. Please try again.');
        },
    });
    var onSubmit = function (data) {
        setSubmitError(null);
        // Validate recurring pattern if needed
        if (isRecurring && (!recurrencePattern || (recurrencePattern.recurrence_type === 'weekly' && (!recurrencePattern.recurrence_days_of_week || recurrencePattern.recurrence_days_of_week.length === 0)))) {
            setSubmitError('Please configure the recurrence pattern');
            return;
        }
        createJobMutation.mutate(data);
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: open, onOpenChange: function (isOpen) {
            if (!isOpen) {
                onClose();
            }
        }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Create New Job" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Create a new job or recurring job series" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [submitError && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-red-50 border border-red-200 rounded-md", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: submitError }) })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "customer_id", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { value: field.value, onChange: function (customerId, customer) {
                                                    field.onChange(customerId);
                                                    setSelectedCustomer(customer);
                                                    setValue('location_id', ''); // Reset location when customer changes
                                                }, label: "Customer", required: true, showSelectedBox: true, apiSource: "direct", error: (_b = errors.customer_id) === null || _b === void 0 ? void 0 : _b.message, placeholder: "Search customers..." }));
                                        } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "location_id", control: control, render: function (_a) {
                                            var _b, _c;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Label_1.default, { htmlFor: "location_id", children: ["Location ", watchedCustomerId ? '*' : ''] }), !watchedCustomerId ? ((0, jsx_runtime_1.jsx)(Input_1.default, { value: "", onChange: function () { return undefined; }, placeholder: "Select customer first", disabled: true, error: (_b = errors.location_id) === null || _b === void 0 ? void 0 : _b.message })) : customerLocations.length > 0 ? ((0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: field.value, onValueChange: function (value) { return field.onChange(value); }, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, { placeholder: "Select location" }) }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectContent, { children: customerLocations.map(function (location) { return ((0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: location.id, children: location.name || location.address || "Location ".concat(location.id.slice(0, 8)) }, location.id)); }) })] })) : ((0, jsx_runtime_1.jsx)(Input_1.default, { value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "No locations found - enter location ID", error: (_c = errors.location_id) === null || _c === void 0 ? void 0 : _c.message })), errors.location_id && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.location_id.message }))] }));
                                        } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_type", control: control, render: function (_a) {
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "service_type", children: "Service Type" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: field.value, onValueChange: field.onChange, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, { placeholder: "Select service type" }) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "", children: "Select service type" }), availableServiceTypes.map(function (serviceType) { return ((0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: serviceType, children: serviceType }, serviceType)); })] })] }), errors.service_type && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.service_type.message }))] }));
                                        } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "priority", control: control, render: function (_a) {
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "priority", children: "Priority" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: field.value, onValueChange: field.onChange, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "low", children: "Low" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "high", children: "High" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "urgent", children: "Urgent" })] })] })] }));
                                        } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_date", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "scheduled_date", children: "Scheduled Date *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, error: (_b = errors.scheduled_date) === null || _b === void 0 ? void 0 : _b.message }), errors.scheduled_date && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.scheduled_date.message }))] }));
                                        } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_start_time", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "scheduled_start_time", children: "Start Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, error: (_b = errors.scheduled_start_time) === null || _b === void 0 ? void 0 : _b.message }), errors.scheduled_start_time && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.scheduled_start_time.message }))] }));
                                                } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_end_time", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "scheduled_end_time", children: "End Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, error: (_b = errors.scheduled_end_time) === null || _b === void 0 ? void 0 : _b.message }), errors.scheduled_end_time && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600 mt-1", children: errors.scheduled_end_time.message }))] }));
                                                } }) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "technician_id", control: control, render: function (_a) {
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { htmlFor: "technician_id", children: "Technician" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: field.value || '', onValueChange: field.onChange, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, { placeholder: "Unassigned" }) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "", children: "Unassigned" }), technicians.map(function (tech) { return ((0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectItem, { value: tech.id || tech.user_id, children: [tech.first_name, " ", tech.last_name] }, tech.id || tech.user_id)); })] })] })] }));
                                        } }) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(Textarea_1.default, { value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, label: "Description", rows: 3, placeholder: "Job description or notes", error: (_b = errors.description) === null || _b === void 0 ? void 0 : _b.message }));
                                } }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-gray-50 rounded-md", children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { id: "is-recurring", checked: isRecurring, onChange: setIsRecurring, label: "Make this a recurring job" }) }), isRecurring && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(RecurrencePatternSelector_1.RecurrencePatternSelector, __assign({}, (recurrencePattern ? { value: recurrencePattern } : {}), { onChange: setRecurrencePattern, startDate: new Date(watchedScheduledDate) })), recurrencePattern && ((0, jsx_runtime_1.jsx)(RecurrencePreview_1.RecurrencePreview, { pattern: recurrencePattern, startTime: watchedStartTime, endTime: watchedEndTime }))] })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: onClose, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: createJobMutation.isPending, children: createJobMutation.isPending ? 'Creating...' : isRecurring ? 'Create Recurring Series' : 'Create Job' })] })] })] }) }));
};
exports.default = exports.ScheduleCalendar;
