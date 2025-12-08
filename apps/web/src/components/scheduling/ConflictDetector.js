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
exports.ConflictDetector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var logger_1 = require("@/utils/logger");
var Dialog_1 = require("@/components/ui/Dialog");
var Select_1 = __importDefault(require("@/components/ui/Select"));
var ConflictDetector = function (_a) {
    var selectedDate = _a.selectedDate, onConflictResolve = _a.onConflictResolve, onConflictIgnore = _a.onConflictIgnore;
    var _b = (0, react_1.useState)([]), conflicts = _b[0], setConflicts = _b[1];
    var _c = (0, react_1.useState)(null), selectedConflict = _c[0], setSelectedConflict = _c[1];
    var _d = (0, react_1.useState)(false), showResolutionDialog = _d[0], setShowResolutionDialog = _d[1];
    var _e = (0, react_1.useState)(''), resolutionMethod = _e[0], setResolutionMethod = _e[1];
    var _f = (0, react_1.useState)(false), isScanning = _f[0], setIsScanning = _f[1];
    // Fetch jobs for conflict detection
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['jobs', 'conflict-detection', selectedDate],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var dateStr, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        dateStr = (_b = (_a = selectedDate === null || selectedDate === void 0 ? void 0 : selectedDate.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : new Date().toISOString().substring(0, 10);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.getByDateRange(dateStr, dateStr)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result];
                }
            });
        }); },
        staleTime: 1 * 60 * 1000, // 1 minute for real-time conflict detection
    }), _h = _g.data, jobs = _h === void 0 ? [] : _h, jobsLoading = _g.isLoading;
    // Fetch technicians
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'active'],
        queryFn: function () { return enhanced_api_1.enhancedApi.users.list(); },
        staleTime: 10 * 60 * 1000,
    }).data, technicians = _j === void 0 ? [] : _j;
    // Resolve conflict mutation
    var resolveConflictMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var conflictId = _b.conflictId, resolution = _b.resolution;
            return __generator(this, function (_c) {
                // TODO: Implement conflict resolution API endpoint
                logger_1.logger.debug('Resolving conflict', { conflictId: conflictId, resolution: resolution }, 'ConflictDetector');
                return [2 /*return*/, { id: conflictId, resolution: resolution }];
            });
        }); },
        onSuccess: function (data) {
            setConflicts(function (prev) { return prev.map(function (conflict) {
                return conflict.id === data.id
                    ? __assign(__assign({}, conflict), { resolved_at: new Date().toISOString(), resolution_method: data.resolution }) : conflict;
            }); });
            setShowResolutionDialog(false);
            setSelectedConflict(null);
            onConflictResolve === null || onConflictResolve === void 0 ? void 0 : onConflictResolve(selectedConflict, data.resolution);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to resolve conflict', error, 'ConflictDetector');
        }
    });
    // Ignore conflict mutation
    var ignoreConflictMutation = (0, react_query_1.useMutation)({
        mutationFn: function (conflictId) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement conflict ignore API endpoint
                logger_1.logger.debug('Ignoring conflict', { conflictId: conflictId }, 'ConflictDetector');
                return [2 /*return*/, { id: conflictId }];
            });
        }); },
        onSuccess: function (data) {
            setConflicts(function (prev) { return prev.filter(function (conflict) { return conflict.id !== data.id; }); });
            onConflictIgnore === null || onConflictIgnore === void 0 ? void 0 : onConflictIgnore(selectedConflict);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to ignore conflict', error, 'ConflictDetector');
        }
    });
    // Detect time overlap conflicts
    var detectTimeOverlapConflicts = function (jobs) {
        var _a, _b;
        var conflicts = [];
        for (var i = 0; i < jobs.length; i++) {
            for (var j = i + 1; j < jobs.length; j++) {
                var job1 = jobs[i];
                var job2 = jobs[j];
                if (!job1 || !job2)
                    continue;
                // Check if jobs are on the same date and have overlapping times
                if (job1.scheduled_date === job2.scheduled_date &&
                    job1.scheduled_start_time && job1.scheduled_end_time &&
                    job2.scheduled_start_time && job2.scheduled_end_time) {
                    var start1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_start_time));
                    var end1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_end_time));
                    var start2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_start_time));
                    var end2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_end_time));
                    // Check for overlap
                    if (start1 < end2 && start2 < end1) {
                        conflicts.push({
                            id: "time-overlap-".concat(job1.id, "-").concat(job2.id),
                            type: 'time_overlap',
                            severity: 'high',
                            description: "Time overlap between ".concat(((_a = job1.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown', " and ").concat(((_b = job2.customer) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown'),
                            conflicting_jobs: [job1.id, job2.id],
                            detected_at: new Date().toISOString()
                        });
                    }
                }
            }
        }
        return conflicts;
    };
    // Detect technician double booking conflicts
    var detectTechnicianDoubleBookingConflicts = function (jobs) {
        var conflicts = [];
        var technicianJobs = new Map();
        // Group jobs by technician
        jobs.forEach(function (job) {
            if (job.technician_id) {
                if (!technicianJobs.has(job.technician_id)) {
                    technicianJobs.set(job.technician_id, []);
                }
                technicianJobs.get(job.technician_id).push(job);
            }
        });
        // Check for double bookings
        technicianJobs.forEach(function (techJobs, technicianId) {
            for (var i = 0; i < techJobs.length; i++) {
                for (var j = i + 1; j < techJobs.length; j++) {
                    var job1 = techJobs[i];
                    var job2 = techJobs[j];
                    if (!job1 || !job2)
                        continue;
                    if (job1.scheduled_date === job2.scheduled_date &&
                        job1.scheduled_start_time && job1.scheduled_end_time &&
                        job2.scheduled_start_time && job2.scheduled_end_time) {
                        var start1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_start_time));
                        var end1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_end_time));
                        var start2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_start_time));
                        var end2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_end_time));
                        if (start1 < end2 && start2 < end1) {
                            var technician = technicians.find(function (t) { return t.id === technicianId; });
                            conflicts.push({
                                id: "double-booking-".concat(job1.id, "-").concat(job2.id),
                                type: 'technician_double_booking',
                                severity: 'critical',
                                description: "Technician ".concat((technician === null || technician === void 0 ? void 0 : technician.first_name) || '', " ").concat((technician === null || technician === void 0 ? void 0 : technician.last_name) || '', " double booked"),
                                conflicting_jobs: [job1.id, job2.id],
                                detected_at: new Date().toISOString()
                            });
                        }
                    }
                }
            }
        });
        return conflicts;
    };
    // Detect location conflicts
    var detectLocationConflicts = function (jobs) {
        var conflicts = [];
        var locationJobs = new Map();
        // Group jobs by location
        jobs.forEach(function (job) {
            var _a;
            var locId = ((_a = job.location) === null || _a === void 0 ? void 0 : _a.id) || job.location_id;
            if (!locId)
                return;
            if (!locationJobs.has(locId)) {
                locationJobs.set(locId, []);
            }
            locationJobs.get(locId).push(job);
        });
        // Check for location conflicts
        locationJobs.forEach(function (locJobs) {
            var _a;
            if (locJobs.length > 1) {
                for (var i = 0; i < locJobs.length; i++) {
                    for (var j = i + 1; j < locJobs.length; j++) {
                        var job1 = locJobs[i];
                        var job2 = locJobs[j];
                        if (!job1 || !job2)
                            continue;
                        if (job1.scheduled_date === job2.scheduled_date &&
                            job1.scheduled_start_time && job1.scheduled_end_time &&
                            job2.scheduled_start_time && job2.scheduled_end_time) {
                            var start1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_start_time));
                            var end1 = new Date("".concat(job1.scheduled_date, "T").concat(job1.scheduled_end_time));
                            var start2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_start_time));
                            var end2 = new Date("".concat(job2.scheduled_date, "T").concat(job2.scheduled_end_time));
                            if (start1 < end2 && start2 < end1) {
                                conflicts.push({
                                    id: "location-conflict-".concat(job1.id, "-").concat(job2.id),
                                    type: 'location_conflict',
                                    severity: 'medium',
                                    description: "Location conflict at ".concat(((_a = job1.location) === null || _a === void 0 ? void 0 : _a.address) || 'Unknown location'),
                                    conflicting_jobs: [job1.id, job2.id],
                                    detected_at: new Date().toISOString()
                                });
                            }
                        }
                    }
                }
            }
        });
        return conflicts;
    };
    // Run conflict detection
    var runConflictDetection = function () { return __awaiter(void 0, void 0, void 0, function () {
        var timeOverlapConflicts, doubleBookingConflicts, locationConflicts, allConflicts;
        return __generator(this, function (_a) {
            setIsScanning(true);
            try {
                timeOverlapConflicts = detectTimeOverlapConflicts(jobs);
                doubleBookingConflicts = detectTechnicianDoubleBookingConflicts(jobs);
                locationConflicts = detectLocationConflicts(jobs);
                allConflicts = __spreadArray(__spreadArray(__spreadArray([], timeOverlapConflicts, true), doubleBookingConflicts, true), locationConflicts, true);
                setConflicts(allConflicts);
            }
            catch (error) {
                logger_1.logger.error('Error during conflict detection', error, 'ConflictDetector');
            }
            finally {
                setIsScanning(false);
            }
            return [2 /*return*/];
        });
    }); };
    // Auto-run conflict detection when jobs change
    (0, react_1.useEffect)(function () {
        if (jobs.length > 0) {
            runConflictDetection();
        }
    }, [jobs]);
    // Get conflict severity color
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-100';
            case 'high': return 'text-orange-600 bg-orange-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    // Get conflict type icon
    var getConflictTypeIcon = function (type) {
        switch (type) {
            case 'time_overlap': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" });
            case 'technician_double_booking': return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" });
            case 'location_conflict': return (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" });
            case 'resource_conflict': return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
        }
    };
    // Render conflict card
    var renderConflictCard = function (conflict) {
        var conflictingJobs = jobs.filter(function (job) {
            return conflict.conflicting_jobs.includes(job.id);
        });
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4 border-l-4 ".concat(conflict.severity === 'critical' ? 'border-l-red-500' :
                conflict.severity === 'high' ? 'border-l-orange-500' :
                    conflict.severity === 'medium' ? 'border-l-yellow-500' :
                        'border-l-blue-500'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full ".concat(getSeverityColor(conflict.severity)), children: getConflictTypeIcon(conflict.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: conflict.description }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getSeverityColor(conflict.severity)), children: conflict.severity })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 mb-3", children: ["Detected: ", new Date(conflict.detected_at).toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-700", children: "Conflicting Jobs:" }), conflictingJobs.map(function (job) {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 bg-gray-50 p-2 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: [job.scheduled_start_time, " - ", job.scheduled_end_time, " | ", ((_b = job.service) === null || _b === void 0 ? void 0 : _b.type) || 'Unknown Service'] })] }, job.id));
                                            })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                                    setSelectedConflict(conflict);
                                    setShowResolutionDialog(true);
                                }, children: "Resolve" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () {
                                    setSelectedConflict(conflict);
                                    ignoreConflictMutation.mutate(conflict.id);
                                }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }) })] })] }) }, conflict.id));
    };
    if (jobsLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {});
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900", children: "Conflict Detection" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Monitoring scheduling conflicts for ", selectedDate.toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [conflicts.length, " conflict", conflicts.length !== 1 ? 's' : '', " detected"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: runConflictDetection, disabled: isScanning, children: isScanning ? 'Scanning...' : 'Rescan' })] })] }), conflicts.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-red-800", children: "Critical" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-red-900", children: conflicts.filter(function (c) { return c.severity === 'critical'; }).length })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-orange-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-orange-800", children: "High" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-orange-900", children: conflicts.filter(function (c) { return c.severity === 'high'; }).length })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-yellow-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-yellow-800", children: "Medium" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-yellow-900", children: conflicts.filter(function (c) { return c.severity === 'medium'; }).length })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-green-50 border border-green-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-green-800", children: "Resolved" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-green-900", children: conflicts.filter(function (c) { return c.resolved_at; }).length })] })] }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: conflicts.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mx-auto h-12 w-12 text-green-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No conflicts detected" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "All scheduled jobs are conflict-free for this date." })] })) : (conflicts.map(renderConflictCard)) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showResolutionDialog, onOpenChange: setShowResolutionDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Resolve Conflict" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Choose how to resolve this scheduling conflict" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Resolution Method" }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: resolutionMethod, onChange: setResolutionMethod, options: [
                                                { value: 'reschedule_job', label: 'Reschedule Job' },
                                                { value: 'reassign_technician', label: 'Reassign Technician' },
                                                { value: 'split_job', label: 'Split Job' },
                                                { value: 'manual_resolution', label: 'Manual Resolution' }
                                            ], placeholder: "Select resolution method" })] }), selectedConflict && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Conflict:" }), " ", selectedConflict.description] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700 mt-1", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Type:" }), " ", selectedConflict.type.replace('_', ' ')] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700 mt-1", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Severity:" }), " ", selectedConflict.severity] })] }))] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setShowResolutionDialog(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () {
                                        if (selectedConflict && resolutionMethod) {
                                            resolveConflictMutation.mutate({
                                                conflictId: selectedConflict.id,
                                                resolution: resolutionMethod
                                            });
                                        }
                                    }, disabled: !resolutionMethod || resolveConflictMutation.isPending, children: resolveConflictMutation.isPending ? 'Resolving...' : 'Resolve Conflict' })] })] }) })] }));
};
exports.ConflictDetector = ConflictDetector;
exports.default = exports.ConflictDetector;
