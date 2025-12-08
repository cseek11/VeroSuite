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
exports.TimeSlotManager = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var logger_1 = require("@/utils/logger");
var Dialog_1 = require("@/components/ui/Dialog");
var ui_1 = require("@/components/ui");
var TimeSlotManager = function (_a) {
    var selectedDate = _a.selectedDate, technicianId = _a.technicianId, onSlotSelect = _a.onSlotSelect, _onSlotCreate = _a.onSlotCreate;
    var _b = (0, react_1.useState)(technicianId || ''), selectedTechnician = _b[0], setSelectedTechnician = _b[1];
    var _c = (0, react_1.useState)(false), showCreateDialog = _c[0], setShowCreateDialog = _c[1];
    var _d = (0, react_1.useState)({
        start_time: '09:00',
        end_time: '10:00',
        is_available: true
    }), newSlot = _d[0], setNewSlot = _d[1];
    var _e = (0, react_1.useState)([]), conflicts = _e[0], setConflicts = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch technicians
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'active'],
        queryFn: function () { return enhanced_api_1.enhancedApi.users.list(); },
        staleTime: 10 * 60 * 1000,
    }), _g = _f.data, technicians = _g === void 0 ? [] : _g, techniciansLoading = _f.isLoading;
    // Fetch time slots for selected date and technician
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['time-slots', selectedDate, selectedTechnician],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!selectedTechnician)
                    return [2 /*return*/, []];
                // TODO: Implement time slots API endpoint
                // For now, return mock data
                return [2 /*return*/, [
                        {
                            id: '1',
                            technician_id: selectedTechnician,
                            start_time: '09:00',
                            end_time: '10:00',
                            is_available: true,
                            created_at: new Date().toISOString()
                        },
                        {
                            id: '2',
                            technician_id: selectedTechnician,
                            start_time: '10:00',
                            end_time: '11:00',
                            is_available: false,
                            job_id: 'job-123',
                            created_at: new Date().toISOString()
                        }
                    ]];
            });
        }); },
        enabled: !!selectedTechnician,
        staleTime: 2 * 60 * 1000,
    }), _j = _h.data, timeSlots = _j === void 0 ? [] : _j, slotsLoading = _h.isLoading;
    // Fetch availability patterns
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['availability-patterns', selectedTechnician],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!selectedTechnician)
                    return [2 /*return*/, []];
                // TODO: Implement availability patterns API endpoint
                return [2 /*return*/, [
                        {
                            id: '1',
                            technician_id: selectedTechnician,
                            day_of_week: selectedDate.getDay(),
                            start_time: '08:00',
                            end_time: '17:00',
                            is_active: true
                        }
                    ]];
            });
        }); },
        enabled: !!selectedTechnician,
        staleTime: 10 * 60 * 1000,
    }).data, availabilityPatterns = _k === void 0 ? [] : _k;
    // Create time slot mutation
    var createSlotMutation = (0, react_query_1.useMutation)({
        mutationFn: function (slotData) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement create time slot API endpoint
                logger_1.logger.debug('Creating time slot', slotData, 'TimeSlotManager');
                return [2 /*return*/, __assign({ id: 'new-slot' }, slotData)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['time-slots'] });
            setShowCreateDialog(false);
            setNewSlot({
                start_time: '09:00',
                end_time: '10:00',
                is_available: true
            });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create time slot', error, 'TimeSlotManager');
        }
    });
    // Update time slot mutation
    var updateSlotMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var slotId = _b.slotId, updates = _b.updates;
            return __generator(this, function (_c) {
                // TODO: Implement update time slot API endpoint
                logger_1.logger.debug('Updating time slot', { slotId: slotId, updates: updates }, 'TimeSlotManager');
                return [2 /*return*/, __assign({ id: slotId }, updates)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['time-slots'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update time slot', error, 'TimeSlotManager');
        }
    });
    // Delete time slot mutation
    var deleteSlotMutation = (0, react_query_1.useMutation)({
        mutationFn: function (slotId) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement delete time slot API endpoint
                logger_1.logger.debug('Deleting time slot', { slotId: slotId }, 'TimeSlotManager');
                return [2 /*return*/];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['time-slots'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete time slot', error, 'TimeSlotManager');
        }
    });
    // Generate time slots based on availability patterns
    var generateTimeSlots = function () {
        var _a, _b;
        if (!selectedTechnician || availabilityPatterns.length === 0)
            return;
        var pattern = availabilityPatterns.find(function (p) {
            return p.technician_id === selectedTechnician &&
                p.day_of_week === selectedDate.getDay() &&
                p.is_active;
        });
        if (!pattern)
            return;
        if (!pattern.start_time || !pattern.end_time)
            return;
        var slots = [];
        var startHour = parseInt((_a = pattern.start_time.split(':')[0]) !== null && _a !== void 0 ? _a : '0');
        var endHour = parseInt((_b = pattern.end_time.split(':')[0]) !== null && _b !== void 0 ? _b : '0');
        var _loop_1 = function (hour) {
            var startTime = "".concat(hour.toString().padStart(2, '0'), ":00");
            var endTime = "".concat((hour + 1).toString().padStart(2, '0'), ":00");
            // Check if slot already exists
            var existingSlot = timeSlots.find(function (slot) {
                return slot.start_time === startTime && slot.end_time === endTime;
            });
            if (!existingSlot) {
                slots.push({
                    id: "generated-".concat(hour),
                    technician_id: selectedTechnician,
                    start_time: startTime,
                    end_time: endTime,
                    is_available: true,
                    created_at: new Date().toISOString()
                });
            }
        };
        for (var hour = startHour; hour < endHour; hour++) {
            _loop_1(hour);
        }
        return slots;
    };
    // Check for conflicts
    var checkConflicts = function (startTime, endTime, excludeId) {
        var conflicts = [];
        timeSlots.forEach(function (slot) {
            if (slot.id === excludeId)
                return;
            var slotStart = slot.start_time;
            var slotEnd = slot.end_time;
            // Check for overlap
            if ((startTime >= slotStart && startTime < slotEnd) ||
                (endTime > slotStart && endTime <= slotEnd) ||
                (startTime <= slotStart && endTime >= slotEnd)) {
                conflicts.push("Conflicts with ".concat(slotStart, "-").concat(slotEnd));
            }
        });
        return conflicts;
    };
    // Handle create slot
    var handleCreateSlot = function () {
        var slotConflicts = checkConflicts(newSlot.start_time, newSlot.end_time);
        if (slotConflicts.length > 0) {
            setConflicts(slotConflicts);
            return;
        }
        createSlotMutation.mutate(__assign(__assign({}, newSlot), { technician_id: selectedTechnician }));
    };
    // Handle slot toggle availability
    var handleToggleAvailability = function (slot) {
        updateSlotMutation.mutate({
            slotId: slot.id,
            updates: { is_available: !slot.is_available }
        });
    };
    // Handle slot delete
    var handleDeleteSlot = function (slot) {
        if (window.confirm('Are you sure you want to delete this time slot?')) {
            deleteSlotMutation.mutate(slot.id);
        }
    };
    // Render time slot
    var renderTimeSlot = function (slot) {
        var isConflict = conflicts.some(function (conflict) {
            return conflict.includes("".concat(slot.start_time, "-").concat(slot.end_time));
        });
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg border cursor-pointer transition-colors ".concat(slot.is_available
                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                : 'bg-red-50 border-red-200 hover:bg-red-100', " ").concat(isConflict ? 'ring-2 ring-red-500' : ''), onClick: function () { return onSlotSelect === null || onSlotSelect === void 0 ? void 0 : onSlotSelect(slot); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-gray-900", children: [slot.start_time, " - ", slot.end_time] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: slot.is_available ? 'Available' : 'Booked' }), slot.job_id && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-blue-600", children: ["Job: ", slot.job_id] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () {
                                    handleToggleAvailability(slot);
                                }, children: slot.is_available ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" })) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () {
                                    handleDeleteSlot(slot);
                                }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4 text-red-600" }) })] })] }) }, slot.id));
    };
    if (techniciansLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {});
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Technician" }), (0, jsx_runtime_1.jsxs)(ui_1.Select, { value: selectedTechnician, onValueChange: setSelectedTechnician, children: [(0, jsx_runtime_1.jsx)(ui_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(ui_1.SelectValue, { placeholder: "Choose a technician" }) }), (0, jsx_runtime_1.jsx)(ui_1.SelectContent, { children: technicians.map(function (technician) { return ((0, jsx_runtime_1.jsxs)(ui_1.SelectItem, { value: technician.id, children: [technician.first_name, " ", technician.last_name] }, technician.id)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Managing time slots for: ", selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return setShowCreateDialog(true); }, disabled: !selectedTechnician, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Add Time Slot"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                            var generatedSlots = generateTimeSlots();
                            if (generatedSlots && generatedSlots.length > 0) {
                                generatedSlots.forEach(function (slot) {
                                    createSlotMutation.mutate(slot);
                                });
                            }
                        }, disabled: !selectedTechnician, children: "Generate from Pattern" })] }), conflicts.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-red-800", children: "Time Conflicts Detected" }), (0, jsx_runtime_1.jsx)("ul", { className: "text-sm text-red-700 mt-1", children: conflicts.map(function (conflict, index) { return ((0, jsx_runtime_1.jsxs)("li", { children: ["\u2022 ", conflict] }, index)); }) })] })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: slotsLoading ? ((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {})) : timeSlots.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-500", children: "No time slots found for this technician and date." })) : (timeSlots.map(renderTimeSlot)) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Create Time Slot" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Add a new time slot for the selected technician" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: newSlot.start_time, onChange: function (e) { return setNewSlot(__assign(__assign({}, newSlot), { start_time: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: newSlot.end_time, onChange: function (e) { return setNewSlot(__assign(__assign({}, newSlot), { end_time: e.target.value })); } })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "is_available", checked: newSlot.is_available, onChange: function (e) { return setNewSlot(__assign(__assign({}, newSlot), { is_available: e.target.checked })); }, className: "rounded border-gray-300" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "is_available", className: "text-sm text-gray-700", children: "Available for booking" })] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setShowCreateDialog(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleCreateSlot, disabled: createSlotMutation.isPending, children: createSlotMutation.isPending ? 'Creating...' : 'Create Slot' })] })] }) })] }));
};
exports.TimeSlotManager = TimeSlotManager;
exports.default = exports.TimeSlotManager;
