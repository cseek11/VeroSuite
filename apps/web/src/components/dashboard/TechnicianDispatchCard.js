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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TechnicianDispatchCard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Technician Dispatch Card Component
 *
 * Dashboard card for assigning jobs to technicians via drag-and-drop.
 * Supports dragging technicians and dropping jobs onto technicians.
 */
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var components_1 = require("@/routes/dashboard/components");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var enhanced_api_1 = require("@/lib/enhanced-api");
var react_query_1 = require("@tanstack/react-query");
var ConflictResolutionDialog_1 = require("./ConflictResolutionDialog");
var useCardDataDragDrop_1 = require("@/routes/dashboard/hooks/useCardDataDragDrop");
function TechnicianDispatchCard(_a) {
    var _this = this;
    var _b = _a.cardId, cardId = _b === void 0 ? 'technician-dispatch' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _user = (0, auth_1.useAuthStore)().user;
    var _d = (0, react_1.useState)([]), assignments = _d[0], setAssignments = _d[1];
    var _e = (0, react_1.useState)(false), _isAssigning = _e[0], setIsAssigning = _e[1];
    var _f = (0, react_1.useState)(false), conflictDialogOpen = _f[0], setConflictDialogOpen = _f[1];
    var _g = (0, react_1.useState)(null), pendingAssignment = _g[0], setPendingAssignment = _g[1];
    var _h = (0, react_1.useState)(null), conflictData = _h[0], setConflictData = _h[1];
    var _j = (0, react_1.useState)(null), selectedJobForAvailability = _j[0], setSelectedJobForAvailability = _j[1];
    // Get drag state to detect when a job is being dragged
    var _k = (0, useCardDataDragDrop_1.useCardDataDragDrop)({}), isDragging = _k.isDragging, draggingPayload = _k.draggingPayload;
    // Update selected job when dragging a job
    (0, react_1.useEffect)(function () {
        var _a;
        if (isDragging && (draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.sourceDataType) === 'job' && ((_a = draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.data) === null || _a === void 0 ? void 0 : _a.entity)) {
            setSelectedJobForAvailability(draggingPayload.data.entity);
        }
        else if (!isDragging) {
            setSelectedJobForAvailability(null);
        }
    }, [isDragging, draggingPayload]);
    // Fetch availability when a job is selected
    var availableTechnicians = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'availability', selectedJobForAvailability === null || selectedJobForAvailability === void 0 ? void 0 : selectedJobForAvailability.id, selectedJobForAvailability === null || selectedJobForAvailability === void 0 ? void 0 : selectedJobForAvailability.scheduled_date, selectedJobForAvailability === null || selectedJobForAvailability === void 0 ? void 0 : selectedJobForAvailability.scheduled_start_time, selectedJobForAvailability === null || selectedJobForAvailability === void 0 ? void 0 : selectedJobForAvailability.scheduled_end_time],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedJobForAvailability || !selectedJobForAvailability.scheduled_date || !selectedJobForAvailability.scheduled_start_time || !selectedJobForAvailability.scheduled_end_time) {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.getAvailable(String(selectedJobForAvailability.scheduled_date), String(selectedJobForAvailability.scheduled_start_time), String(selectedJobForAvailability.scheduled_end_time))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.warn('Failed to fetch technician availability', error_1);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        enabled: !!selectedJobForAvailability && !!selectedJobForAvailability.scheduled_date && !!selectedJobForAvailability.scheduled_start_time && !!selectedJobForAvailability.scheduled_end_time
    }).data;
    // Fetch technicians
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'dispatch'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var users, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        users = [];
                        if (!(enhanced_api_1.enhancedApi.technicians && typeof enhanced_api_1.enhancedApi.technicians.list === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1:
                        users = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(enhanced_api_1.enhancedApi.users && typeof enhanced_api_1.enhancedApi.users.list === 'function')) return [3 /*break*/, 4];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.users.list()];
                    case 3:
                        users = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        logger_1.logger.warn('Technicians API not available, using empty list');
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/, users.map(function (user) { return ({
                            id: user.id || user.user_id,
                            name: "".concat(user.first_name || '', " ").concat(user.last_name || '').trim() || user.email || user.name || 'Unknown',
                            email: user.email,
                            phone: user.phone,
                            status: user.status || 'available',
                            location: user.location || 'Unknown',
                            rating: user.rating || 0,
                            jobsCompleted: user.jobs_completed || 0,
                            specialties: user.specialties || [],
                            avatar: user.avatar
                        }); })];
                    case 6:
                        error_2 = _a.sent();
                        logger_1.logger.error('Failed to fetch technicians', error_2);
                        return [2 /*return*/, []];
                    case 7: return [2 /*return*/];
                }
            });
        }); },
        retry: false,
        staleTime: 5 * 60 * 1000
    }), _m = _l.data, techniciansData = _m === void 0 ? [] : _m, isLoadingTechnicians = _l.isLoading;
    // Handle job assignment with conflict checking
    var handleAssignJob = (0, react_1.useCallback)(function (job_1, technician_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([job_1, technician_1], args_1, true), void 0, function (job, technician, skipConflictCheck) {
            var conflictResult, error_3, assignmentId_1, newAssignment_1, error_4;
            if (skipConflictCheck === void 0) { skipConflictCheck = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsAssigning(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        if (!(!skipConflictCheck && job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time)) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.checkConflicts(technician.id, job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time, [job.id] // Exclude current job if rescheduling
                            )];
                    case 3:
                        conflictResult = _a.sent();
                        if (conflictResult.has_conflicts) {
                            // Show conflict dialog
                            setConflictData({
                                conflicts: conflictResult.conflicts,
                                canProceed: conflictResult.can_proceed
                            });
                            setPendingAssignment({ job: job, technician: technician });
                            setConflictDialogOpen(true);
                            setIsAssigning(false);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        logger_1.logger.warn('Failed to check conflicts, proceeding with assignment', { error: error_3 });
                        return [3 /*break*/, 5];
                    case 5:
                        assignmentId_1 = "assignment-".concat(Date.now());
                        newAssignment_1 = {
                            id: assignmentId_1,
                            jobId: job.id,
                            jobName: job.description || job.name || "Job ".concat(job.id),
                            technicianId: technician.id,
                            technicianName: technician.name,
                            assignedAt: new Date(),
                            status: 'assigned',
                        };
                        setAssignments(function (prev) { return __spreadArray([newAssignment_1], prev, true); });
                        // Assign job to technician using jobs API
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.jobs.update(job.id, {
                                technician_id: technician.id,
                                status: 'assigned'
                            })];
                    case 6:
                        // Assign job to technician using jobs API
                        _a.sent();
                        // Update assignment status
                        setAssignments(function (prev) {
                            return prev.map(function (a) {
                                return a.id === assignmentId_1
                                    ? __assign(__assign({}, a), { status: 'assigned' }) : a;
                            });
                        });
                        logger_1.logger.info('Job assigned successfully', {
                            jobId: job.id,
                            technicianId: technician.id,
                            technicianName: technician.name
                        });
                        return [3 /*break*/, 9];
                    case 7:
                        error_4 = _a.sent();
                        logger_1.logger.error('Failed to assign job', { error: error_4, jobId: job.id });
                        // Show error to user
                        if (pendingAssignment) {
                            setPendingAssignment(null);
                            setConflictDialogOpen(false);
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        setIsAssigning(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }, [pendingAssignment]);
    // Handle conflict resolution - proceed with assignment
    var handleConflictProceed = (0, react_1.useCallback)(function () {
        if (pendingAssignment) {
            setConflictDialogOpen(false);
            handleAssignJob(pendingAssignment.job, pendingAssignment.technician, true);
            setPendingAssignment(null);
            setConflictData(null);
        }
    }, [pendingAssignment, handleAssignJob]);
    // Handle conflict resolution - cancel assignment
    var handleConflictCancel = (0, react_1.useCallback)(function () {
        setConflictDialogOpen(false);
        setPendingAssignment(null);
        setConflictData(null);
    }, []);
    // Job assignment handler for drag-and-drop (general drop zone)
    var assignJobHandler = (0, react_1.useCallback)(function (payload, technicianId) { return __awaiter(_this, void 0, void 0, function () {
        var job, targetTechnician, available, techAvailability, error_5, available, availableTechIds_1, error_6, error_7;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 13, , 14]);
                    if (payload.sourceDataType !== 'job' || !((_a = payload.data) === null || _a === void 0 ? void 0 : _a.entity)) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'Invalid data type. Expected job data.'
                            }];
                    }
                    job = payload.data.entity;
                    // Set selected job to trigger availability check
                    setSelectedJobForAvailability(job);
                    targetTechnician = void 0;
                    if (!technicianId) return [3 /*break*/, 5];
                    targetTechnician = techniciansData.find(function (t) { return t.id === technicianId; });
                    if (!(job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time && targetTechnician)) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.getAvailable(job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time)];
                case 2:
                    available = _b.sent();
                    techAvailability = available.find(function (t) { return t.id === technicianId; });
                    if (techAvailability && !techAvailability.is_available) {
                        return [2 /*return*/, {
                                success: false,
                                error: "".concat(targetTechnician.name, " is not available: ").concat(techAvailability.reason || 'Not available at this time')
                            }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _b.sent();
                    logger_1.logger.warn('Failed to check availability, proceeding anyway', error_5);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 11];
                case 5:
                    if (!(job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time)) return [3 /*break*/, 10];
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.getAvailable(job.scheduled_date, job.scheduled_start_time, job.scheduled_end_time)];
                case 7:
                    available = _b.sent();
                    availableTechIds_1 = available.filter(function (t) { return t.is_available; }).map(function (t) { return t.id; });
                    targetTechnician = techniciansData.find(function (t) { return availableTechIds_1.includes(t.id); }) || techniciansData[0];
                    return [3 /*break*/, 9];
                case 8:
                    error_6 = _b.sent();
                    logger_1.logger.warn('Failed to check availability, using fallback', error_6);
                    targetTechnician = techniciansData.find(function (t) { return t.status === 'available'; }) || techniciansData[0];
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    // Find first available technician, or any technician if none available
                    targetTechnician = techniciansData.find(function (t) { return t.status === 'available'; }) || techniciansData[0];
                    _b.label = 11;
                case 11:
                    if (!targetTechnician) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'No technicians available. Please add technicians first.'
                            }];
                    }
                    logger_1.logger.debug('Assigning job from drag', {
                        jobId: job.id,
                        technicianId: targetTechnician.id,
                        technicianName: targetTechnician.name,
                        droppedOnTechnician: !!technicianId
                    });
                    return [4 /*yield*/, handleAssignJob(job, targetTechnician)];
                case 12:
                    _b.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "Job assigned to ".concat(targetTechnician.name),
                            data: { jobId: job.id, technicianId: targetTechnician.id }
                        }];
                case 13:
                    error_7 = _b.sent();
                    logger_1.logger.error('Error assigning job from drag', error_7);
                    return [2 /*return*/, {
                            success: false,
                            error: error_7 instanceof Error ? error_7.message : 'Failed to assign job'
                        }];
                case 14: return [2 /*return*/];
            }
        });
    }); }, [techniciansData, handleAssignJob]);
    // Drop zone configuration
    var dropZoneConfig = {
        cardId: cardId,
        cardType: 'technician-dispatch',
        accepts: {
            dataTypes: ['job', 'workorder']
        },
        actions: {
            'assign-job': {
                id: 'assign-job',
                label: 'Assign Job',
                icon: '👷',
                description: 'Assign this job to a technician',
                handler: assignJobHandler,
                requiresConfirmation: false
            }
        },
        dropZoneStyle: {
            highlightColor: '#10b981',
            borderStyle: 'dashed',
            borderWidth: 2,
            backgroundColor: 'rgba(16, 185, 129, 0.05)'
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'available':
                return 'text-green-600 bg-green-50';
            case 'busy':
                return 'text-yellow-600 bg-yellow-50';
            case 'offline':
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'available':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'busy':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-yellow-500" });
            case 'offline':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4 text-gray-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4 text-gray-500" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col min-h-[400px] ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 text-green-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Technician Dispatch" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Drag jobs here to assign technicians" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-auto", children: (0, jsx_runtime_1.jsxs)(components_1.DropZone, { cardId: cardId, dropZoneConfig: dropZoneConfig, onDrop: function (payload, result) {
                        var _a;
                        if (result.success) {
                            logger_1.logger.info('Job assignment initiated', {
                                jobId: (_a = payload.data) === null || _a === void 0 ? void 0 : _a.id
                            });
                        }
                    }, className: "min-h-[200px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-12 h-12 text-gray-400 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 font-medium mb-1", children: "Drop job here" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "to assign to a technician" })] }), techniciansData.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: ["Technicians ", selectedJobForAvailability && '(Availability checked for selected job)'] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: techniciansData.map(function (technician) {
                                        // Get availability status for this technician if job is selected
                                        var techAvailability = availableTechnicians === null || availableTechnicians === void 0 ? void 0 : availableTechnicians.find(function (t) { return t.id === technician.id; });
                                        var isAvailable = techAvailability ? techAvailability.is_available : undefined;
                                        var availabilityReason = techAvailability === null || techAvailability === void 0 ? void 0 : techAvailability.reason;
                                        // Create drop zone config for this specific technician
                                        var technicianDropZoneConfig = {
                                            cardId: "".concat(cardId, "-technician-").concat(technician.id),
                                            cardType: 'technician-dispatch',
                                            accepts: {
                                                dataTypes: ['job', 'workorder']
                                            },
                                            actions: {
                                                'assign-to-technician': {
                                                    id: 'assign-to-technician',
                                                    label: "Assign to ".concat(technician.name),
                                                    icon: '👷',
                                                    description: "Assign this job to ".concat(technician.name),
                                                    handler: function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                        return [2 /*return*/, assignJobHandler(payload, technician.id)];
                                                    }); }); },
                                                    requiresConfirmation: false
                                                }
                                            },
                                            dropZoneStyle: {
                                                highlightColor: '#10b981',
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                backgroundColor: 'rgba(16, 185, 129, 0.05)'
                                            }
                                        };
                                        return ((0, jsx_runtime_1.jsx)(components_1.DropZone, { cardId: "".concat(cardId, "-technician-").concat(technician.id), dropZoneConfig: technicianDropZoneConfig, className: "cursor-move", children: (0, jsx_runtime_1.jsx)(components_1.DraggableContent, { cardId: cardId, dataType: "technician", data: technician, className: "cursor-move", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-white border-2 rounded-lg transition-all ".concat(isAvailable === false
                                                        ? 'border-red-300 bg-red-50 opacity-75'
                                                        : isAvailable === true
                                                            ? 'border-green-300 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400 hover:shadow-md'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 px-2 py-1 rounded ".concat(getStatusColor(technician.status)), children: [getStatusIcon(technician.status), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium capitalize", children: technician.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: technician.name }), technician.location && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: technician.location })] })), isAvailable === false && availabilityReason && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3 h-3 text-red-500" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-red-600 truncate", children: availabilityReason })] })), isAvailable === true && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-green-600", children: "Available for this time slot" })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 ml-2", children: [technician.rating !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-600", children: ["\u2B50 ", technician.rating] })), technician.jobsCompleted !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: [technician.jobsCompleted, " jobs"] }))] })] }) }) }, technician.id));
                                    }) })] })), assignments.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Recent Assignments" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: assignments.map(function (assignment) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: assignment.jobName }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: ["Assigned to ", assignment.technicianName] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: assignment.assignedAt.toLocaleTimeString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-2", children: [assignment.status === 'assigned' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" })), assignment.status === 'cancelled' && ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4 text-red-500" }))] })] }, assignment.id)); }) })] })), techniciansData.length === 0 && !isLoadingTechnicians && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-center text-gray-500 text-sm", children: (0, jsx_runtime_1.jsx)("p", { children: "No technicians available." }) })), isLoadingTechnicians && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-center text-gray-500 text-sm", children: (0, jsx_runtime_1.jsx)("p", { children: "Loading technicians..." }) }))] }) }), conflictData && ((0, jsx_runtime_1.jsx)(ConflictResolutionDialog_1.ConflictResolutionDialog, __assign({ open: conflictDialogOpen, conflicts: conflictData.conflicts, canProceed: conflictData.canProceed, onProceed: handleConflictProceed, onCancel: handleConflictCancel }, (function () {
                var name = pendingAssignment === null || pendingAssignment === void 0 ? void 0 : pendingAssignment.technician.name;
                return name ? { technicianName: name } : {};
            })())))] }));
}
