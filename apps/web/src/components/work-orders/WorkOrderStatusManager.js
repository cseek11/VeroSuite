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
exports.default = WorkOrderStatusManager;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var work_orders_1 = require("@/types/work-orders");
var work_orders_2 = require("@/types/work-orders");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Dialog_1 = require("@/components/ui/Dialog");
var logger_1 = require("@/utils/logger");
var statusTransitions = [
    {
        from: work_orders_1.WorkOrderStatus.PENDING,
        to: work_orders_1.WorkOrderStatus.IN_PROGRESS,
        label: 'Start Work',
        description: 'Mark work order as in progress',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4" }),
        color: 'blue',
        requiresNotes: false
    },
    {
        from: work_orders_1.WorkOrderStatus.PENDING,
        to: work_orders_1.WorkOrderStatus.CANCELED,
        label: 'Cancel',
        description: 'Cancel the work order',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }),
        color: 'red',
        requiresNotes: true
    },
    {
        from: work_orders_1.WorkOrderStatus.IN_PROGRESS,
        to: work_orders_1.WorkOrderStatus.COMPLETED,
        label: 'Complete',
        description: 'Mark work order as completed',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
        color: 'green',
        requiresNotes: false,
        autoComplete: true
    },
    {
        from: work_orders_1.WorkOrderStatus.IN_PROGRESS,
        to: work_orders_1.WorkOrderStatus.CANCELED,
        label: 'Cancel',
        description: 'Cancel the work order',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }),
        color: 'red',
        requiresNotes: true
    },
    {
        from: work_orders_1.WorkOrderStatus.CANCELED,
        to: work_orders_1.WorkOrderStatus.PENDING,
        label: 'Reactivate',
        description: 'Reactivate the canceled work order',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "h-4 w-4" }),
        color: 'yellow',
        requiresNotes: true
    }
];
function WorkOrderStatusManager(_a) {
    var _this = this;
    var workOrder = _a.workOrder, _b = _a.workOrderIds, workOrderIds = _b === void 0 ? [] : _b, onStatusChange = _a.onStatusChange, onBulkStatusChange = _a.onBulkStatusChange, _c = _a.mode, mode = _c === void 0 ? 'single' : _c;
    var _d = (0, react_1.useState)(false), showStatusDialog = _d[0], setShowStatusDialog = _d[1];
    var _e = (0, react_1.useState)(null), selectedTransition = _e[0], setSelectedTransition = _e[1];
    var _f = (0, react_1.useState)(''), statusNotes = _f[0], setStatusNotes = _f[1];
    var _g = (0, react_1.useState)(false), isSubmitting = _g[0], setIsSubmitting = _g[1];
    var updateWorkOrderMutation = (0, useWorkOrders_1.useUpdateWorkOrder)();
    var bulkUpdateStatusMutation = (0, useWorkOrders_1.useBulkUpdateStatus)();
    var getAvailableTransitions = function () {
        if (mode === 'bulk') {
            // For bulk operations, only allow safe transitions
            return statusTransitions.filter(function (t) {
                return t.to === work_orders_1.WorkOrderStatus.IN_PROGRESS ||
                    t.to === work_orders_1.WorkOrderStatus.COMPLETED ||
                    t.to === work_orders_1.WorkOrderStatus.CANCELED;
            });
        }
        if (!workOrder)
            return [];
        return statusTransitions.filter(function (t) { return t.from === workOrder.status; });
    };
    var handleStatusChange = function (transition) { return __awaiter(_this, void 0, void 0, function () {
        var updateData, timestamp, statusChangeNote, notesText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transition)
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!(mode === 'single' && workOrder)) return [3 /*break*/, 3];
                    updateData = {
                        status: transition.to
                    };
                    // Set completion date if completing
                    if (transition.to === work_orders_1.WorkOrderStatus.COMPLETED) {
                        updateData.completion_date = new Date().toISOString();
                    }
                    // Add notes if provided
                    if (statusNotes.trim()) {
                        timestamp = new Date().toLocaleString();
                        statusChangeNote = "[".concat(timestamp, "] Status changed to ").concat((0, work_orders_2.getStatusLabel)(transition.to), ": ").concat(statusNotes.trim());
                        updateData.notes = workOrder.notes
                            ? "".concat(workOrder.notes, "\n\n").concat(statusChangeNote)
                            : statusChangeNote;
                    }
                    return [4 /*yield*/, updateWorkOrderMutation.mutateAsync({
                            id: workOrder.id,
                            data: updateData
                        })];
                case 2:
                    _a.sent();
                    onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(workOrder, transition.to);
                    return [3 /*break*/, 5];
                case 3:
                    if (!(mode === 'bulk' && workOrderIds.length > 0)) return [3 /*break*/, 5];
                    notesText = statusNotes.trim()
                        ? "Bulk status change to ".concat((0, work_orders_2.getStatusLabel)(transition.to), ": ").concat(statusNotes.trim())
                        : undefined;
                    return [4 /*yield*/, bulkUpdateStatusMutation.mutateAsync(__assign({ workOrderIds: workOrderIds, newStatus: transition.to }, (notesText ? { notes: notesText } : {})))];
                case 4:
                    _a.sent();
                    onBulkStatusChange === null || onBulkStatusChange === void 0 ? void 0 : onBulkStatusChange(workOrderIds, transition.to);
                    _a.label = 5;
                case 5:
                    setShowStatusDialog(false);
                    setSelectedTransition(null);
                    setStatusNotes('');
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to update work order status', error_1, 'WorkOrderStatusManager');
                    return [3 /*break*/, 8];
                case 7:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var availableTransitions = getAvailableTransitions();
    if (availableTransitions.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "h-5 w-5" }), "Status Management"] }), workOrder && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-".concat((0, work_orders_2.getStatusColor)(workOrder.status), "-100 text-").concat((0, work_orders_2.getStatusColor)(workOrder.status), "-800"), children: (0, work_orders_2.getStatusLabel)(workOrder.status) }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: availableTransitions.map(function (transition) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                setSelectedTransition(transition);
                                setShowStatusDialog(true);
                            }, className: "w-full p-3 text-left rounded-md border border-".concat(transition.color, "-200 bg-").concat(transition.color, "-50 hover:bg-").concat(transition.color, "-100 transition-colors"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-".concat(transition.color, "-100"), children: transition.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: transition.label }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: transition.description })] })] }) }, "".concat(transition.from, "-").concat(transition.to))); }) }), mode === 'bulk' && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-blue-800", children: ["This will update ", workOrderIds.length, " work order(s)"] })] }) }))] }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showStatusDialog, onOpenChange: setShowStatusDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.icon, selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.label] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogDescription, { children: [selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.description, workOrder && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Work Order:" }), " ", workOrder.description] })), mode === 'bulk' && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Affected:" }), " ", workOrderIds.length, " work order(s)"] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.requiresNotes) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Notes ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("textarea", { value: statusNotes, onChange: function (e) { return setStatusNotes(e.target.value); }, rows: 3, className: "crm-textarea", placeholder: "Please provide a reason for this status change...", required: true })] })), !(selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.requiresNotes) && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes (Optional)" }), (0, jsx_runtime_1.jsx)("textarea", { value: statusNotes, onChange: function (e) { return setStatusNotes(e.target.value); }, rows: 3, className: "crm-textarea", placeholder: "Add any additional notes..." })] })), (selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.autoComplete) && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-green-50 border border-green-200 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-green-800", children: "This will automatically set the completion date to now." })] }) }))] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowStatusDialog(false); }, disabled: isSubmitting, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return selectedTransition && handleStatusChange(selectedTransition); }, disabled: isSubmitting || ((selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.requiresNotes) ? !statusNotes.trim() : false), className: "flex items-center gap-2", children: isSubmitting ? ('Updating...') : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.icon, selectedTransition === null || selectedTransition === void 0 ? void 0 : selectedTransition.label] })) })] })] }) })] }));
}
