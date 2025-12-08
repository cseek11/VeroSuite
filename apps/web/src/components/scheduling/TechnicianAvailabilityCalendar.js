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
exports.TechnicianAvailabilityCalendar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Technician Availability Calendar Component
 *
 * Allows technicians and managers to set recurring weekly availability patterns.
 * Shows a weekly view with time slots for each day.
 */
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
];
var TechnicianAvailabilityCalendar = function (_a) {
    var technicianId = _a.technicianId, technicianName = _a.technicianName, onClose = _a.onClose, _b = _a.readOnly, readOnly = _b === void 0 ? false : _b;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_1.useState)([]), patterns = _c[0], setPatterns = _c[1];
    var _d = (0, react_1.useState)(null), editingDay = _d[0], setEditingDay = _d[1];
    var _e = (0, react_1.useState)('09:00'), tempStartTime = _e[0], setTempStartTime = _e[1];
    var _f = (0, react_1.useState)('17:00'), tempEndTime = _f[0], setTempEndTime = _f[1];
    var _g = (0, react_1.useState)(true), tempIsActive = _g[0], setTempIsActive = _g[1];
    // Fetch existing availability patterns
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['technician-availability', technicianId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.getAvailability(technicianId)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to fetch availability', error_1);
                        return [2 /*return*/, { availability_patterns: [] }];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        enabled: !!technicianId,
        staleTime: 5 * 60 * 1000
    }), availabilityData = _h.data, isLoading = _h.isLoading;
    // Initialize patterns from fetched data
    (0, react_1.useEffect)(function () {
        if (availabilityData === null || availabilityData === void 0 ? void 0 : availabilityData.availability_patterns) {
            var fetchedPatterns = availabilityData.availability_patterns.map(function (p) { return ({
                day_of_week: p.day_of_week,
                start_time: p.start_time || '09:00',
                end_time: p.end_time || '17:00',
                is_active: p.is_active !== false
            }); });
            setPatterns(fetchedPatterns);
        }
        else {
            // Initialize with empty patterns for all days
            setPatterns(DAYS_OF_WEEK.map(function (day) { return ({
                day_of_week: day.value,
                start_time: '09:00',
                end_time: '17:00',
                is_active: false
            }); }));
        }
    }, [availabilityData]);
    // Save availability pattern mutation
    var savePatternMutation = (0, react_query_1.useMutation)({
        mutationFn: function (pattern) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.setAvailability(technicianId, pattern.day_of_week, pattern.start_time, pattern.end_time, pattern.is_active)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['technician-availability', technicianId] });
            queryClient.invalidateQueries({ queryKey: ['technicians', 'available'] });
            setEditingDay(null);
            logger_1.logger.info('Availability pattern saved', { technicianId: technicianId, day: editingDay });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to save availability pattern', error);
        }
    });
    var handleEditDay = function (dayOfWeek) {
        if (readOnly)
            return;
        var existingPattern = patterns.find(function (p) { return p.day_of_week === dayOfWeek; });
        if (existingPattern) {
            setTempStartTime(existingPattern.start_time);
            setTempEndTime(existingPattern.end_time);
            setTempIsActive(existingPattern.is_active);
        }
        else {
            setTempStartTime('09:00');
            setTempEndTime('17:00');
            setTempIsActive(true);
        }
        setEditingDay(dayOfWeek);
    };
    var handleSaveDay = function () {
        if (editingDay === null)
            return;
        var pattern = {
            day_of_week: editingDay,
            start_time: tempStartTime,
            end_time: tempEndTime,
            is_active: tempIsActive
        };
        // Validate time range
        if (tempStartTime >= tempEndTime) {
            toast_1.toast.error('End time must be after start time');
            return;
        }
        savePatternMutation.mutate(pattern);
        // Update local state
        setPatterns(function (prev) {
            var filtered = prev.filter(function (p) { return p.day_of_week !== editingDay; });
            return __spreadArray(__spreadArray([], filtered, true), [pattern], false);
        });
    };
    var handleCancelEdit = function () {
        setEditingDay(null);
    };
    var handleToggleActive = function (dayOfWeek) {
        if (readOnly)
            return;
        var pattern = patterns.find(function (p) { return p.day_of_week === dayOfWeek; });
        if (pattern) {
            var updatedPattern_1 = __assign(__assign({}, pattern), { is_active: !pattern.is_active });
            savePatternMutation.mutate(updatedPattern_1);
            setPatterns(function (prev) { return prev.map(function (p) {
                return p.day_of_week === dayOfWeek ? updatedPattern_1 : p;
            }); });
        }
    };
    var getPatternForDay = function (dayOfWeek) {
        return patterns.find(function (p) { return p.day_of_week === dayOfWeek; });
    };
    var formatTime = function (time) {
        if (!time)
            return '';
        var _a = time.split(':'), hours = _a[0], _b = _a[1], minutes = _b === void 0 ? '00' : _b;
        var hour = parseInt(hours !== null && hours !== void 0 ? hours : '0', 10);
        var ampm = hour >= 12 ? 'PM' : 'AM';
        var displayHour = hour % 12 || 12;
        return "".concat(displayHour, ":").concat(minutes, " ").concat(ampm);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading availability..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-blue-600" }), "Availability Schedule"] }), technicianName && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: ["for ", technicianName] }))] }), onClose && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: onClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: DAYS_OF_WEEK.map(function (day) {
                    var _a;
                    var pattern = getPatternForDay(day.value);
                    var isEditing = editingDay === day.value;
                    var isActive = (_a = pattern === null || pattern === void 0 ? void 0 : pattern.is_active) !== null && _a !== void 0 ? _a : false;
                    return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 transition-colors ".concat(isActive
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50', " ").concat(!readOnly ? 'cursor-pointer hover:border-blue-300' : ''), onClick: function () { return !isEditing && !readOnly && handleEditDay(day.value); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 font-medium text-gray-900", children: day.label }), isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-600", children: "From:" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: tempStartTime, onChange: function (e) { return setTempStartTime(e.target.value); }, className: "w-32", onClick: function (e) { return e.stopPropagation(); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-600", children: "To:" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: tempEndTime, onChange: function (e) { return setTempEndTime(e.target.value); }, className: "w-32", onClick: function (e) { return e.stopPropagation(); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: tempIsActive, onChange: function (e) { return setTempIsActive(e.target.checked); }, onClick: function (e) { return e.stopPropagation(); }, className: "rounded" }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-600", children: "Active" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", onClick: function () {
                                                                handleSaveDay();
                                                            }, disabled: savePatternMutation.isPending, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4 mr-1" }), "Save"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () {
                                                                handleCancelEdit();
                                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 mr-1" }), "Cancel"] })] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4 flex-1", children: isActive ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-700", children: [formatTime((pattern === null || pattern === void 0 ? void 0 : pattern.start_time) || ''), " - ", formatTime((pattern === null || pattern === void 0 ? void 0 : pattern.end_time) || '')] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium", children: "Active" })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Not available" })] })) }))] }), !isEditing && !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () {
                                        handleToggleActive(day.value);
                                    }, children: isActive ? 'Disable' : 'Enable' }))] }) }, day.value));
                }) }), readOnly && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-800", children: "This is a read-only view. Contact an administrator to modify availability." }) })), !readOnly && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Tip:" }), " Click on any day to set availability hours. Availability patterns are recurring weekly."] }) }))] }));
};
exports.TechnicianAvailabilityCalendar = TechnicianAvailabilityCalendar;
exports.default = exports.TechnicianAvailabilityCalendar;
