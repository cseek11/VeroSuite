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
exports.default = AvailabilityManager;
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
var Dialog_1 = require("@/components/ui/Dialog");
var DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
function AvailabilityManager(_a) {
    var _this = this;
    var technicianId = _a.technicianId, technicianName = _a.technicianName, onClose = _a.onClose;
    var _b = (0, react_1.useState)(null), editingPattern = _b[0], setEditingPattern = _b[1];
    var _c = (0, react_1.useState)(false), showTimeOffDialog = _c[0], setShowTimeOffDialog = _c[1];
    var _d = (0, react_1.useState)({
        start_date: '',
        end_date: '',
        reason: ''
    }), timeOffRequest = _d[0], setTimeOffRequest = _d[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch availability
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['technician-availability', technicianId],
        queryFn: function () { return enhanced_api_1.enhancedApi.technicians.getAvailability(technicianId); },
    }), availabilityData = _e.data, isLoading = _e.isLoading;
    // Set availability mutation
    var setAvailabilityMutation = (0, react_query_1.useMutation)({
        mutationFn: function (pattern) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, enhanced_api_1.enhancedApi.technicians.setAvailability(technicianId, pattern.day_of_week, pattern.start_time, pattern.end_time, pattern.is_active)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['technician-availability'] });
            setEditingPattern(null);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to set availability', error, 'AvailabilityManager');
        }
    });
    // Create time-off request mutation
    var createTimeOffMutation = (0, react_query_1.useMutation)({
        mutationFn: function (request) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement time-off request API endpoint
                logger_1.logger.debug('Creating time-off request', request, 'AvailabilityManager');
                return [2 /*return*/, Promise.resolve(__assign(__assign({ id: 'temp-id' }, request), { status: 'pending' }))];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['technician-availability'] });
            setShowTimeOffDialog(false);
            setTimeOffRequest({ start_date: '', end_date: '', reason: '' });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create time-off request', error, 'AvailabilityManager');
        }
    });
    var availabilityPatterns = (availabilityData === null || availabilityData === void 0 ? void 0 : availabilityData.patterns) || [];
    var timeOffRequests = (availabilityData === null || availabilityData === void 0 ? void 0 : availabilityData.timeOffRequests) || [];
    var handleEditPattern = function (dayOfWeek) {
        var existing = availabilityPatterns.find(function (p) { return p.day_of_week === dayOfWeek; });
        if (existing) {
            setEditingPattern({
                day_of_week: dayOfWeek,
                start_time: existing.start_time,
                end_time: existing.end_time,
                is_active: existing.is_active
            });
        }
        else {
            setEditingPattern({
                day_of_week: dayOfWeek,
                start_time: '09:00',
                end_time: '17:00',
                is_active: true
            });
        }
    };
    var handleSavePattern = function () {
        if (editingPattern) {
            setAvailabilityMutation.mutate(editingPattern);
        }
    };
    var handleDeletePattern = function (dayOfWeek) {
        setAvailabilityMutation.mutate({
            day_of_week: dayOfWeek,
            start_time: '00:00',
            end_time: '00:00',
            is_active: false
        });
    };
    var handleCreateTimeOff = function () {
        if (timeOffRequest.start_date && timeOffRequest.end_date && timeOffRequest.reason) {
            createTimeOffMutation.mutate(timeOffRequest);
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading availability..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Availability Management" }), technicianName && ((0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: technicianName }))] }), onClose && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onClose, icon: lucide_react_1.X, children: "Close" }))] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Weekly Availability Pattern" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: "Set recurring weekly availability" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: DAYS_OF_WEEK.map(function (day, index) {
                                var pattern = availabilityPatterns.find(function (p) { return p.day_of_week === index; });
                                var isEditing = (editingPattern === null || editingPattern === void 0 ? void 0 : editingPattern.day_of_week) === index;
                                return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 ".concat((pattern === null || pattern === void 0 ? void 0 : pattern.is_active)
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-gray-200 bg-gray-50'), children: isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: day }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: editingPattern.is_active, onChange: function (checked) { return setEditingPattern(__assign(__assign({}, editingPattern), { is_active: checked })); } }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: "Active" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600 mb-1", children: "Start Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: editingPattern.start_time, onChange: function (e) { return setEditingPattern(__assign(__assign({}, editingPattern), { start_time: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600 mb-1", children: "End Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: editingPattern.end_time, onChange: function (e) { return setEditingPattern(__assign(__assign({}, editingPattern), { end_time: e.target.value })); } })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: handleSavePattern, disabled: setAvailabilityMutation.isPending, icon: lucide_react_1.Save, children: "Save" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setEditingPattern(null); }, children: "Cancel" }), pattern && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handleDeletePattern(index); }, icon: lucide_react_1.Trash2, children: "Delete" }))] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full ".concat((pattern === null || pattern === void 0 ? void 0 : pattern.is_active) ? 'bg-green-500' : 'bg-gray-300') }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: day }), (pattern === null || pattern === void 0 ? void 0 : pattern.is_active) && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-sm text-gray-600", children: [pattern.start_time, " - ", pattern.end_time] })), !(pattern === null || pattern === void 0 ? void 0 : pattern.is_active) && ((0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-500 italic", children: "Not available" }))] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handleEditPattern(index); }, icon: pattern ? lucide_react_1.Edit : lucide_react_1.Plus, children: pattern ? 'Edit' : 'Add' })] })) }, index));
                            }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Time-Off Requests" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return setShowTimeOffDialog(true); }, icon: lucide_react_1.Plus, children: "Request Time Off" })] }), timeOffRequests.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "No time-off requests" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: timeOffRequests.map(function (request) { return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-medium", children: [new Date(request.start_date).toLocaleDateString(), " - ", new Date(request.end_date).toLocaleDateString()] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600 mt-1", children: request.reason })] }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium ".concat(request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'), children: request.status || 'pending' })] }) }, request.id)); }) }))] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showTimeOffDialog, onOpenChange: setShowTimeOffDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Request Time Off" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Submit a time-off request for approval" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium mb-1", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: timeOffRequest.start_date, onChange: function (e) { return setTimeOffRequest(__assign(__assign({}, timeOffRequest), { start_date: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium mb-1", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: timeOffRequest.end_date, onChange: function (e) { return setTimeOffRequest(__assign(__assign({}, timeOffRequest), { end_date: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium mb-1", children: "Reason" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Vacation, sick leave, personal time...", value: timeOffRequest.reason, onChange: function (e) { return setTimeOffRequest(__assign(__assign({}, timeOffRequest), { reason: e.target.value })); } })] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () {
                                        setShowTimeOffDialog(false);
                                        setTimeOffRequest({ start_date: '', end_date: '', reason: '' });
                                    }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleCreateTimeOff, disabled: createTimeOffMutation.isPending || !timeOffRequest.start_date || !timeOffRequest.end_date || !timeOffRequest.reason, children: createTimeOffMutation.isPending ? 'Submitting...' : 'Submit Request' })] })] }) })] }));
}
