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
exports.default = BulkScheduler;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var ConflictResolutionDialog_1 = require("@/components/dashboard/ConflictResolutionDialog");
var ScheduleCalendar_1 = require("./ScheduleCalendar");
function BulkScheduler(_a) {
    var _this = this;
    var _b = _a.selectedDate, selectedDate = _b === void 0 ? new Date() : _b, onComplete = _a.onComplete, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)(new Set()), selectedJobs = _c[0], setSelectedJobs = _c[1];
    var _d = (0, react_1.useState)(null), selectedTechnician = _d[0], setSelectedTechnician = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('all'), filterStatus = _f[0], setFilterStatus = _f[1];
    var _g = (0, react_1.useState)(false), showConflictDialog = _g[0], setShowConflictDialog = _g[1];
    var _h = (0, react_1.useState)(null), conflictData = _h[0], setConflictData = _h[1];
    var _j = (0, react_1.useState)([]), _pendingAssignments = _j[0], setPendingAssignments = _j[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch jobs for the selected date
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'bulk-scheduler', selectedDate],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var dateStr;
            var _a;
            return __generator(this, function (_b) {
                dateStr = (_a = selectedDate.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().substring(0, 10);
                return [2 /*return*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateStr, dateStr)];
            });
        }); },
    }), _l = _k.data, jobs = _l === void 0 ? [] : _l, jobsLoading = _k.isLoading;
    // Fetch technicians
    var _m = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'active'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
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
    }), _o = _m.data, technicians = _o === void 0 ? [] : _o, techniciansLoading = _m.isLoading;
    // Filter jobs
    var filteredJobs = (0, react_1.useMemo)(function () {
        return jobs.filter(function (job) {
            var _a, _b, _c, _d, _e, _f;
            var matchesSearch = ((_b = (_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((_d = (_c = job.service) === null || _c === void 0 ? void 0 : _c.description) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((_f = (_e = job.location) === null || _e === void 0 ? void 0 : _e.address) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchTerm.toLowerCase()));
            var matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'unassigned' && !job.technician_id) ||
                (filterStatus === 'assigned' && !!job.technician_id) ||
                job.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [jobs, searchTerm, filterStatus]);
    // Bulk assignment mutation
    var bulkAssignMutation = (0, react_query_1.useMutation)({
        mutationFn: function (assignments) { return __awaiter(_this, void 0, void 0, function () {
            var results, successful, failed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled(assignments.map(function (_a) {
                            var jobId = _a.jobId, technicianId = _a.technicianId;
                            return enhanced_api_1.enhancedApi.jobs.update(jobId, {
                                technician_id: technicianId,
                                status: 'assigned'
                            });
                        }))];
                    case 1:
                        results = _a.sent();
                        successful = results.filter(function (r) { return r.status === 'fulfilled'; }).length;
                        failed = results.filter(function (r) { return r.status === 'rejected'; }).length;
                        return [2 /*return*/, { successful: successful, failed: failed, total: assignments.length }];
                }
            });
        }); },
        onSuccess: function (result) {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            logger_1.logger.info('Bulk assignment completed', result, 'BulkScheduler');
            setSelectedJobs(new Set());
            setSelectedTechnician(null);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        },
        onError: function (error) {
            logger_1.logger.error('Bulk assignment failed', error, 'BulkScheduler');
        }
    });
    // Check conflicts for bulk assignment
    var checkBulkConflicts = function () { return __awaiter(_this, void 0, void 0, function () {
        var jobsToCheck, conflicts, canProceed, _i, jobsToCheck_1, job, conflictResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedTechnician || selectedJobs.size === 0)
                        return [2 /*return*/];
                    jobsToCheck = filteredJobs.filter(function (job) { return selectedJobs.has(job.id); });
                    conflicts = [];
                    canProceed = true;
                    _i = 0, jobsToCheck_1 = jobsToCheck;
                    _a.label = 1;
                case 1:
                    if (!(_i < jobsToCheck_1.length)) return [3 /*break*/, 6];
                    job = jobsToCheck_1[_i];
                    if (!(job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.checkConflicts(selectedTechnician, job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time, Array.from(selectedJobs) // Exclude all selected jobs
                        )];
                case 3:
                    conflictResult = _a.sent();
                    if (conflictResult.has_conflicts) {
                        conflicts.push.apply(conflicts, conflictResult.conflicts);
                        if (!conflictResult.can_proceed) {
                            canProceed = false;
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    logger_1.logger.warn('Failed to check conflicts for job', { jobId: job.id, error: error_1 }, 'BulkScheduler');
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (conflicts.length > 0) {
                        setConflictData({ conflicts: conflicts, canProceed: canProceed });
                        setShowConflictDialog(true);
                    }
                    else {
                        // No conflicts, proceed with assignment
                        handleBulkAssign();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // Handle bulk assignment
    var handleBulkAssign = function () {
        if (!selectedTechnician || selectedJobs.size === 0)
            return;
        var assignments = Array.from(selectedJobs).map(function (jobId) { return ({
            jobId: jobId,
            technicianId: selectedTechnician
        }); });
        setPendingAssignments(assignments);
        bulkAssignMutation.mutate(assignments);
    };
    // Handle conflict proceed
    var handleConflictProceed = function () {
        setShowConflictDialog(false);
        handleBulkAssign();
        setConflictData(null);
    };
    // Handle conflict cancel
    var handleConflictCancel = function () {
        setShowConflictDialog(false);
        setConflictData(null);
    };
    // Toggle job selection
    var toggleJobSelection = function (jobId) {
        var newSelection = new Set(selectedJobs);
        if (newSelection.has(jobId)) {
            newSelection.delete(jobId);
        }
        else {
            newSelection.add(jobId);
        }
        setSelectedJobs(newSelection);
    };
    // Select all jobs
    var selectAllJobs = function () {
        setSelectedJobs(new Set(filteredJobs.map(function (job, _index) { return job.id; })));
    };
    // Clear selection
    var clearSelection = function () {
        setSelectedJobs(new Set());
    };
    var selectedTechnicianData = technicians.find(function (t) { return (t.id || t.user_id) === selectedTechnician; });
    // Handle bulk selection from ScheduleCalendar
    var handleBulkSelect = function (jobIds) {
        setSelectedJobs(new Set(jobIds));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Bulk Job Assignment" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Assign multiple jobs to technicians at once" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [selectedJobs.size > 0 && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: clearSelection, children: ["Clear (", selectedJobs.size, ")"] })), onCancel && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onCancel, icon: lucide_react_1.X, children: "Cancel" }))] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsx)(ScheduleCalendar_1.ScheduleCalendar, __assign({ selectedDate: selectedDate, onDateChange: function () {
                        // Date change handled by parent if needed
                    }, searchQuery: searchTerm, filterStatus: filterStatus, filterPriority: "all" }, (selectedTechnician ? { filterTechnician: selectedTechnician } : {}), { enableBulkSelection: true, onBulkSelect: handleBulkSelect, showAnalytics: false, showMap: false })) }), selectedJobs.size > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-purple-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "w-5 h-5 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold text-purple-900", children: [selectedJobs.size, " job", selectedJobs.size !== 1 ? 's' : '', " selected"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-purple-700", children: selectedTechnicianData
                                                    ? "Assigning to ".concat(selectedTechnicianData.first_name, " ").concat(selectedTechnicianData.last_name)
                                                    : 'Select a technician to assign' })] })] }), selectedTechnician && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: checkBulkConflicts, disabled: bulkAssignMutation.isPending, icon: lucide_react_1.ArrowRight, children: bulkAssignMutation.isPending ? 'Assigning...' : 'Assign Jobs' }))] }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 space-y-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search jobs...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: function (e) { return setFilterStatus(e.target.value); }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Jobs" }), (0, jsx_runtime_1.jsx)("option", { value: "unassigned", children: "Unassigned" }), (0, jsx_runtime_1.jsx)("option", { value: "assigned", children: "Assigned" }), (0, jsx_runtime_1.jsx)("option", { value: "scheduled", children: "Scheduled" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: selectAllJobs, size: "sm", children: "Select All" })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: jobsLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading jobs..." })] })) : filteredJobs.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 mb-2", children: "No jobs found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-400 text-sm", children: searchTerm || filterStatus !== 'all'
                                                    ? 'Try adjusting your filters'
                                                    : "No jobs scheduled for ".concat(selectedDate.toLocaleDateString()) })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: filteredJobs.map(function (job) {
                                            var _a, _b, _c;
                                            return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 cursor-pointer transition-colors ".concat(selectedJobs.has(job.id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'), onClick: function () { return toggleJobSelection(job.id); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: selectedJobs.has(job.id), onChange: function () { return toggleJobSelection(job.id); }, className: "mt-1" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), job.technician_id && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full", children: "Assigned" })), job.priority && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 text-xs rounded-full ".concat(job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                                                    job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                                                        job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                                            'bg-gray-100 text-gray-800'), children: job.priority }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [job.scheduled_date && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-3 h-3 mr-1" }), new Date(job.scheduled_date).toLocaleDateString()] })), job.scheduled_start_time && job.scheduled_end_time && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3 mr-1" }), job.scheduled_start_time, " - ", job.scheduled_end_time] })), ((_b = job.location) === null || _b === void 0 ? void 0 : _b.address) && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 mr-1" }), job.location.address] }))] }), ((_c = job.service) === null || _c === void 0 ? void 0 : _c.description) && ((0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: job.service.description }))] })] })] }) }, job.id));
                                        }) })) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Select Technician" }), techniciansLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-6 h-6 animate-spin text-purple-600" }) })) : technicians.length === 0 ? ((0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 text-center py-8", children: "No technicians available" })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: technicians.map(function (technician) { return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-3 cursor-pointer transition-colors ".concat(selectedTechnician === (technician.id || technician.user_id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'), onClick: function () { return setSelectedTechnician(technician.id || technician.user_id); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full border-2 ".concat(selectedTechnician === (technician.id || technician.user_id)
                                                                ? 'border-purple-500 bg-purple-500'
                                                                : 'border-gray-300') }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-medium", children: [technician.first_name, " ", technician.last_name] }), technician.is_active === false && ((0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-xs text-gray-500", children: "Inactive" }))] }), selectedTechnician === (technician.id || technician.user_id) && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-purple-600" }))] }) }, technician.id || technician.user_id)); }) }))] }) }), selectedJobs.size > 0 && selectedTechnician && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-blue-50 border-blue-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold text-blue-900 mb-3", children: "Assignment Summary" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700", children: "Jobs Selected:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold text-blue-900", children: selectedJobs.size })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700", children: "Technician:" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-semibold text-blue-900", children: [selectedTechnicianData === null || selectedTechnicianData === void 0 ? void 0 : selectedTechnicianData.first_name, " ", selectedTechnicianData === null || selectedTechnicianData === void 0 ? void 0 : selectedTechnicianData.last_name] })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t border-blue-200", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: checkBulkConflicts, disabled: bulkAssignMutation.isPending, className: "w-full", icon: lucide_react_1.ArrowRight, children: bulkAssignMutation.isPending ? 'Assigning...' : "Assign ".concat(selectedJobs.size, " Job").concat(selectedJobs.size !== 1 ? 's' : '') }) })] })] }) }))] })] }), conflictData && ((0, jsx_runtime_1.jsx)(ConflictResolutionDialog_1.ConflictResolutionDialog, __assign({ open: showConflictDialog, conflicts: conflictData.conflicts, canProceed: conflictData.canProceed, onProceed: handleConflictProceed, onCancel: handleConflictCancel }, (function () {
                var _a, _b;
                if (!selectedTechnicianData)
                    return {};
                var name = "".concat((_a = selectedTechnicianData.first_name) !== null && _a !== void 0 ? _a : '', " ").concat((_b = selectedTechnicianData.last_name) !== null && _b !== void 0 ? _b : '').trim();
                return name ? { technicianName: name } : {};
            })())))] }));
}
