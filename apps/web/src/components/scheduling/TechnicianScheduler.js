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
exports.TechnicianScheduler = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var logger_1 = require("@/utils/logger");
var ScheduleCalendar_1 = require("./ScheduleCalendar");
var Dialog_1 = require("@/components/ui/Dialog");
var TechnicianScheduler = function (_a) {
    var _b, _c;
    var selectedDate = _a.selectedDate, onTechnicianSelect = _a.onTechnicianSelect, _onJobAssign = _a.onJobAssign, onBulkAssign = _a.onBulkAssign;
    var _d = (0, react_1.useState)(''), selectedTechnician = _d[0], setSelectedTechnician = _d[1];
    var _e = (0, react_1.useState)([]), selectedJobs = _e[0], setSelectedJobs = _e[1];
    var _f = (0, react_1.useState)(false), showAssignmentDialog = _f[0], setShowAssignmentDialog = _f[1];
    var _g = (0, react_1.useState)(''), assignmentReason = _g[0], setAssignmentReason = _g[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch technicians with performance metrics
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'with-metrics'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var techs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.users.list()];
                    case 1:
                        techs = _a.sent();
                        // TODO: Fetch performance metrics for each technician
                        return [2 /*return*/, techs.map(function (tech) { return (__assign(__assign({}, tech), { performance_metrics: {
                                    completion_rate: Math.random() * 100,
                                    customer_rating: 3 + Math.random() * 2,
                                    jobs_completed: Math.floor(Math.random() * 100),
                                    utilization_rate: Math.random() * 100,
                                    on_time_rate: Math.random() * 100
                                } })); })];
                }
            });
        }); },
        staleTime: 10 * 60 * 1000,
    }), _j = _h.data, technicians = _j === void 0 ? [] : _j, techniciansLoading = _h.isLoading;
    // Fetch unassigned jobs for the selected date
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'unassigned', selectedDate],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var dateStr, allJobs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateStr = selectedDate.toISOString().split('T')[0];
                        if (!dateStr)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateStr, dateStr)];
                    case 1:
                        allJobs = _a.sent();
                        return [2 /*return*/, allJobs.filter(function (job) { return !job.technician_id; })];
                }
            });
        }); },
        staleTime: 2 * 60 * 1000,
    }), _l = _k.data, jobs = _l === void 0 ? [] : _l, jobsLoading = _k.isLoading;
    // Assign job mutation
    var assignJobMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var dateStr;
            var jobId = _b.jobId, technicianId = _b.technicianId;
            return __generator(this, function (_c) {
                dateStr = selectedDate.toISOString().split('T')[0];
                if (!dateStr)
                    throw new Error('Invalid date');
                return [2 /*return*/, enhanced_api_1.enhancedApi.jobs.update(jobId, {
                        technician_id: technicianId,
                        scheduled_date: dateStr,
                        scheduled_start_time: '09:00',
                        scheduled_end_time: '17:00'
                    })];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setShowAssignmentDialog(false);
            setSelectedJobs([]);
            setAssignmentReason('');
        },
        onError: function (error) {
            logger_1.logger.error('Failed to assign job', error, 'TechnicianScheduler');
        }
    });
    // Bulk assign jobs mutation
    var bulkAssignMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var dateStr, promises;
            var jobIds = _b.jobIds, technicianId = _b.technicianId;
            return __generator(this, function (_c) {
                dateStr = selectedDate.toISOString().split('T')[0];
                if (!dateStr)
                    throw new Error('Invalid date');
                promises = jobIds.map(function (jobId) {
                    return enhanced_api_1.enhancedApi.jobs.update(jobId, {
                        technician_id: technicianId,
                        scheduled_date: dateStr,
                        scheduled_start_time: '09:00',
                        scheduled_end_time: '17:00'
                    });
                });
                return [2 /*return*/, Promise.all(promises)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setShowAssignmentDialog(false);
            setSelectedJobs([]);
            setAssignmentReason('');
        },
        onError: function (error) {
            logger_1.logger.error('Failed to bulk assign jobs', error, 'TechnicianScheduler');
        }
    });
    // Skill matching algorithm
    var getSkillMatchScore = function (_job, _technician) {
        // TODO: Implement skill matching logic
        // For now, return a random score
        return Math.random() * 100;
    };
    // Workload calculation
    var getTechnicianWorkload = function (_technicianId) {
        // TODO: Calculate current workload for technician
        return Math.random() * 100;
    };
    // Get assignment recommendations
    var getAssignmentRecommendations = function (job) {
        return technicians
            .map(function (tech) {
            var score = getSkillMatchScore(job, tech);
            return {
                technician: tech,
                score: score,
                workload: getTechnicianWorkload(tech.id),
                recommendation: score > 80 ? 'high' : score > 60 ? 'medium' : 'low'
            };
        })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 3);
    };
    // Handle job selection
    var handleJobSelect = function (jobId) {
        setSelectedJobs(function (prev) {
            return prev.includes(jobId)
                ? prev.filter(function (id) { return id !== jobId; })
                : __spreadArray(__spreadArray([], prev, true), [jobId], false);
        });
    };
    // Handle bulk assignment
    var handleBulkAssign = function () {
        if (selectedJobs.length === 0 || !selectedTechnician)
            return;
        var technician = technicians.find(function (t) { return t.id === selectedTechnician; });
        if (!technician)
            return;
        var jobsToAssign = jobs.filter(function (job) { return selectedJobs.includes(job.id); });
        onBulkAssign === null || onBulkAssign === void 0 ? void 0 : onBulkAssign(jobsToAssign, technician);
        setShowAssignmentDialog(true);
    };
    // Handle assignment confirmation
    var handleAssignmentConfirm = function () {
        if (!selectedTechnician)
            return;
        if (selectedJobs.length === 1) {
            var jobId = selectedJobs[0];
            if (!jobId)
                return;
            assignJobMutation.mutate({
                jobId: jobId,
                technicianId: selectedTechnician
            });
        }
        else {
            bulkAssignMutation.mutate({
                jobIds: selectedJobs,
                technicianId: selectedTechnician
            });
        }
    };
    // Render technician card
    var renderTechnicianCard = function (technician) {
        var _a, _b, _c, _d;
        var workload = getTechnicianWorkload(technician.id);
        var isSelected = selectedTechnician === technician.id;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 cursor-pointer transition-all rounded-lg border ".concat(isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md border-gray-200'), onClick: function () {
                setSelectedTechnician(technician.id);
                onTechnicianSelect === null || onTechnicianSelect === void 0 ? void 0 : onTechnicianSelect(technician);
            }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-medium text-gray-900", children: [technician.first_name, " ", technician.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: technician.phone })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 text-yellow-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: (_a = technician.performance_metrics) === null || _a === void 0 ? void 0 : _a.customer_rating.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: [(_b = technician.performance_metrics) === null || _b === void 0 ? void 0 : _b.completion_rate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Jobs Completed" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (_c = technician.performance_metrics) === null || _c === void 0 ? void 0 : _c.jobs_completed })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Utilization" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: [workload.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "On-Time Rate" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: [(_d = technician.performance_metrics) === null || _d === void 0 ? void 0 : _d.on_time_rate.toFixed(1), "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Workload" }), (0, jsx_runtime_1.jsxs)("span", { children: [workload.toFixed(0), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(workload > 80 ? 'bg-red-500' :
                                    workload > 60 ? 'bg-yellow-500' : 'bg-green-500'), style: { width: "".concat(workload, "%") } }) })] })] }, technician.id));
    };
    // Render job card
    var renderJobCard = function (job) {
        var _a, _b, _c, _d;
        var isSelected = selectedJobs.includes(job.id);
        var recommendations = getAssignmentRecommendations(job);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 cursor-pointer transition-all rounded-lg border ".concat(isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md border-gray-200'), onClick: function () { return handleJobSelect(job.id); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: ((_b = job.service) === null || _b === void 0 ? void 0 : _b.type) || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                        job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                            job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'), children: job.priority }), isSelected && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-blue-600" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 mr-2" }), (0, jsx_runtime_1.jsxs)("span", { children: [((_c = job.service) === null || _c === void 0 ? void 0 : _c.estimated_duration) || 0, " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-gray-600", children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: "\uD83D\uDCCD" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: ((_d = job.location) === null || _d === void 0 ? void 0 : _d.address) || 'Unknown' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 pt-3 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mb-2", children: "Recommended Technicians:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-2", children: recommendations.map(function (rec) { return ((0, jsx_runtime_1.jsxs)("div", { className: "px-2 py-1 rounded text-xs ".concat(rec.recommendation === 'high' ? 'bg-green-100 text-green-800' :
                                    rec.recommendation === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'), children: [rec.technician.first_name, " (", rec.score.toFixed(0), "%)"] }, rec.technician.id)); }) })] })] }, job.id));
    };
    // Handle bulk selection from ScheduleCalendar
    var handleBulkSelect = function (jobIds) {
        setSelectedJobs(jobIds);
    };
    if (techniciansLoading || jobsLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {});
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900", children: "Technician Assignment" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Assign jobs to technicians for ", selectedDate.toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: [selectedJobs.length, " job", selectedJobs.length !== 1 ? 's' : '', " selected"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: handleBulkAssign, disabled: selectedJobs.length === 0 || !selectedTechnician, children: "Assign Selected" })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsx)(ScheduleCalendar_1.ScheduleCalendar, { selectedDate: selectedDate, onDateChange: function () {
                        // Date change handled by parent
                    }, searchQuery: "", filterStatus: "unassigned", filterPriority: "all", filterTechnician: selectedTechnician, showTechnicianMetrics: true, enableBulkSelection: true, onBulkSelect: handleBulkSelect, showAnalytics: false, showMap: false }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-md font-medium text-gray-900 mb-4", children: "Available Technicians" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: technicians.map(renderTechnicianCard) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-md font-medium text-gray-900 mb-4", children: ["Unassigned Jobs (", jobs.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: jobs.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-500", children: "No unassigned jobs for this date." })) : (jobs.map(function (job) { return renderJobCard(job); })) })] })] }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showAssignmentDialog, onOpenChange: setShowAssignmentDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: selectedJobs.length === 1 ? 'Assign Job' : 'Bulk Assign Jobs' }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: selectedJobs.length === 1
                                        ? 'Assign this job to the selected technician'
                                        : "Assign ".concat(selectedJobs.length, " jobs to the selected technician") })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assignment Reason (Optional)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Enter reason for assignment...", value: assignmentReason, onChange: function (e) { return setAssignmentReason(e.target.value); } })] }), selectedJobs.length > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-blue-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-800", children: ["You are about to assign ", selectedJobs.length, " jobs to", ' ', (_b = technicians.find(function (t) { return t.id === selectedTechnician; })) === null || _b === void 0 ? void 0 : _b.first_name, ' ', (_c = technicians.find(function (t) { return t.id === selectedTechnician; })) === null || _c === void 0 ? void 0 : _c.last_name] })] }) }))] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setShowAssignmentDialog(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleAssignmentConfirm, disabled: assignJobMutation.isPending || bulkAssignMutation.isPending, children: assignJobMutation.isPending || bulkAssignMutation.isPending
                                        ? 'Assigning...'
                                        : 'Confirm Assignment' })] })] }) })] }));
};
exports.TechnicianScheduler = TechnicianScheduler;
exports.default = exports.TechnicianScheduler;
