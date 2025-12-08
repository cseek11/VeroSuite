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
exports.default = WorkOrderDetail;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var useJobs_1 = require("@/hooks/useJobs");
var work_orders_1 = require("@/types/work-orders");
var jobs_1 = require("@/types/jobs");
var work_orders_2 = require("@/types/work-orders");
var WorkOrderStatusManager_1 = __importDefault(require("./WorkOrderStatusManager"));
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Dialog_1 = require("@/components/ui/Dialog");
var logger_1 = require("@/utils/logger");
var useDialog_1 = require("@/hooks/useDialog");
function WorkOrderDetail(_a) {
    var _this = this;
    var _b, _c, _d;
    var workOrderId = _a.workOrderId, onEdit = _a.onEdit, onDelete = _a.onDelete, onStatusChange = _a.onStatusChange, onClose = _a.onClose;
    var _e = (0, useDialog_1.useDialog)(), showAlert = _e.showAlert, DialogComponents = _e.DialogComponents;
    var _f = (0, react_1.useState)(false), showDeleteDialog = _f[0], setShowDeleteDialog = _f[1];
    var _g = (0, react_1.useState)(false), showCreateJobDialog = _g[0], setShowCreateJobDialog = _g[1];
    var _h = (0, react_1.useState)({}), jobFormData = _h[0], setJobFormData = _h[1];
    var _j = (0, useWorkOrders_1.useWorkOrder)(workOrderId), workOrder = _j.data, isLoading = _j.isLoading, error = _j.error, refetch = _j.refetch;
    var deleteWorkOrderMutation = (0, useWorkOrders_1.useDeleteWorkOrder)();
    var createJobMutation = (0, useJobs_1.useCreateJob)();
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!workOrder)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteWorkOrderMutation.mutateAsync(workOrder.id)];
                case 2:
                    _a.sent();
                    setShowDeleteDialog(false);
                    onDelete === null || onDelete === void 0 ? void 0 : onDelete(workOrder);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete work order', error_1, 'WorkOrderDetail');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handlePrint = function () {
        window.print();
    };
    var handleCreateJobClick = function () {
        var _a, _b;
        if (!workOrder)
            return;
        // Pre-fill job form data from work order
        var scheduledDateParts = new Date((_a = workOrder.scheduled_date) !== null && _a !== void 0 ? _a : Date.now())
            .toISOString()
            .split('T');
        var scheduledDate = ((_b = scheduledDateParts[0]) !== null && _b !== void 0 ? _b : new Date().toISOString().split('T')[0]);
        // Calculate default start/end times based on estimated duration or defaults
        var estimatedDuration = workOrder.estimated_duration || 60; // default 60 minutes
        var defaultStartTime = '09:00';
        var defaultEndTime = new Date(Date.now() + estimatedDuration * 60000).toTimeString().slice(0, 5);
        setJobFormData(__assign(__assign({ work_order_id: workOrder.id }, (workOrder.assigned_to !== undefined && { technician_id: workOrder.assigned_to })), { scheduled_date: scheduledDate, scheduled_start_time: defaultStartTime, scheduled_end_time: defaultEndTime, status: jobs_1.JobStatus.SCHEDULED, notes: "Job created from work order: ".concat(workOrder.description) }));
        setShowCreateJobDialog(true);
    };
    var handleCreateJobSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var accountId, locationId, jobData, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!workOrder || !jobFormData.work_order_id || !jobFormData.scheduled_date) {
                        logger_1.logger.error('Missing required fields for job creation', {}, 'WorkOrderDetail');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 8]);
                    accountId = ((_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.id) || workOrder.customer_id;
                    locationId = workOrder.location_id;
                    if (!(!accountId || !locationId)) return [3 /*break*/, 3];
                    logger_1.logger.error('Work order missing account_id or location_id', { accountId: accountId, locationId: locationId }, 'WorkOrderDetail');
                    return [4 /*yield*/, showAlert({
                            title: 'Cannot Create Job',
                            message: 'Work order must have a customer and location assigned.',
                            type: 'error',
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    jobData = __assign(__assign(__assign({ work_order_id: jobFormData.work_order_id, account_id: accountId, location_id: locationId }, (jobFormData.technician_id !== undefined && { technician_id: jobFormData.technician_id })), { scheduled_date: jobFormData.scheduled_date, scheduled_start_time: jobFormData.scheduled_start_time || '09:00', scheduled_end_time: jobFormData.scheduled_end_time || '10:00', priority: workOrder.priority || 'medium', status: jobFormData.status || jobs_1.JobStatus.SCHEDULED }), (jobFormData.notes !== undefined && { notes: jobFormData.notes }));
                    return [4 /*yield*/, createJobMutation.mutateAsync(jobData)];
                case 4:
                    _b.sent();
                    // Show success message
                    return [4 /*yield*/, showAlert({
                            title: 'Success',
                            message: 'Job created successfully!',
                            type: 'success',
                        })];
                case 5:
                    // Show success message
                    _b.sent();
                    // Close dialog and refresh work order data
                    setShowCreateJobDialog(false);
                    refetch();
                    return [3 /*break*/, 8];
                case 6:
                    error_2 = _b.sent();
                    logger_1.logger.error('Failed to create job', error_2, 'WorkOrderDetail');
                    return [4 /*yield*/, showAlert({
                            title: 'Error',
                            message: 'Failed to create job. Please check the console for details.',
                            type: 'error',
                        })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Check if work order has required data for job creation
    var canCreateJob = workOrder &&
        (((_b = workOrder.account) === null || _b === void 0 ? void 0 : _b.id) || workOrder.customer_id) &&
        workOrder.location_id &&
        workOrder.status !== work_orders_1.WorkOrderStatus.COMPLETED &&
        workOrder.status !== work_orders_1.WorkOrderStatus.CANCELED;
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    var formatDateTime = function (dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case work_orders_1.WorkOrderStatus.PENDING:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5" });
            case work_orders_1.WorkOrderStatus.IN_PROGRESS:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-5 w-5" });
            case work_orders_1.WorkOrderStatus.COMPLETED:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5" });
            case work_orders_1.WorkOrderStatus.CANCELED:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5" });
        }
    };
    var getAccountTypeIcon = function (accountType) {
        switch (accountType === null || accountType === void 0 ? void 0 : accountType.toLowerCase()) {
            case 'residential':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "h-4 w-4" });
            case 'commercial':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "h-4 w-4" });
            case 'industrial':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Briefcase, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "h-4 w-4" });
        }
    };
    var formatCurrency = function (value) {
        var numeric = typeof value === 'number' ? value : parseFloat(String(value));
        if (Number.isNaN(numeric))
            return '$0.00';
        return "$".concat(numeric.toFixed(2));
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading work order..." }) }));
    }
    if (error || !workOrder) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Error Loading Work Order" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: (error === null || error === void 0 ? void 0 : error.message) || 'Work order not found' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return refetch(); }, variant: "outline", children: "Try Again" }), onClose && ((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: onClose, variant: "outline", children: "Close" }))] })] }) }));
    }
    var canEdit = workOrder.status !== work_orders_1.WorkOrderStatus.COMPLETED && workOrder.status !== work_orders_1.WorkOrderStatus.CANCELED;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 print:space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-gray-900", children: ["Work Order #", workOrder.work_order_number || workOrder.id.slice(-8)] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Created ", formatDate(workOrder.created_at)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: handlePrint, className: "flex items-center gap-2 print:hidden", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { className: "h-4 w-4" }), "Print"] }), canEdit && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: function () { return onEdit === null || onEdit === void 0 ? void 0 : onEdit(workOrder); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }), "Edit"] })), canCreateJob && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: handleCreateJobClick, className: "flex items-center gap-2 print:hidden", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Create Job"] })), canEdit && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "danger", onClick: function () { return setShowDeleteDialog(true); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }), "Delete"] })), onClose && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onClose, className: "flex items-center gap-2 print:hidden", children: "Close" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-".concat((0, work_orders_2.getStatusColor)(workOrder.status), "-100"), children: getStatusIcon(workOrder.status) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Status" }), (0, jsx_runtime_1.jsx)("p", { className: "text-".concat((0, work_orders_2.getStatusColor)(workOrder.status), "-600 font-medium"), children: (0, work_orders_2.getStatusLabel)(workOrder.status) })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-".concat((0, work_orders_2.getPriorityColor)(workOrder.priority), "-100"), children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Priority" }), (0, jsx_runtime_1.jsx)("p", { className: "text-".concat((0, work_orders_2.getPriorityColor)(workOrder.priority), "-600 font-medium"), children: (0, work_orders_2.getPriorityLabel)(workOrder.priority) })] })] }) })] }), (0, jsx_runtime_1.jsx)(WorkOrderStatusManager_1.default, __assign({ workOrder: workOrder }, (onStatusChange ? { onStatusChange: onStatusChange } : {}), { mode: "single" })), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5" }), "Work Order Details"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: workOrder.description })] }), workOrder.service_type && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Service Type" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: workOrder.service_type })] })), workOrder.estimated_duration && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Estimated Duration" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), workOrder.estimated_duration, " minutes"] })] })), workOrder.service_price !== null && workOrder.service_price !== undefined && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Service Price" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-4 w-4" }), formatCurrency(workOrder.service_price)] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [workOrder.scheduled_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Scheduled Date" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }), formatDateTime(workOrder.scheduled_date)] })] })), workOrder.completion_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Completion Date" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), formatDateTime(workOrder.completion_date)] })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Created" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: formatDateTime(workOrder.created_at) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Last Updated" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: formatDateTime(workOrder.updated_at) })] })] })] }), workOrder.notes && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 rounded-md p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900 whitespace-pre-wrap", children: workOrder.notes }) })] }))] }), workOrder.account && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5" }), "Customer Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Customer Name" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-2", children: [getAccountTypeIcon(workOrder.account.account_type), workOrder.account.name] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Account Type" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: workOrder.account.account_type })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [workOrder.account.phone && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Phone" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4" }), workOrder.account.phone] })] })), workOrder.account.email && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4" }), workOrder.account.email] })] }))] })] })] })), workOrder.assignedTechnician && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5" }), "Assigned Technician"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Technician Name" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900", children: [workOrder.assignedTechnician.first_name, " ", workOrder.assignedTechnician.last_name] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4" }), workOrder.assignedTechnician.email] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: workOrder.assignedTechnician.phone && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Phone" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4" }), workOrder.assignedTechnician.phone] })] })) })] })] })), workOrder.jobs && workOrder.jobs.length > 0 && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "h-5 w-5" }), "Related Jobs"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: workOrder.jobs.map(function (job) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-gray-900", children: ["Job #", job.id.slice(-8)] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Scheduled: ", formatDateTime(job.scheduled_date)] })] }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-".concat((0, work_orders_2.getStatusColor)(job.status), "-100 text-").concat((0, work_orders_2.getStatusColor)(job.status), "-800"), children: (0, work_orders_2.getStatusLabel)(job.status) })] }, job.id)); }) })] })), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showCreateJobDialog, onOpenChange: setShowCreateJobDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-5 w-5" }), "Create Job from Work Order"] }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Create a scheduled job for this work order. The job will appear on the schedule." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-blue-900", children: "Work Order Details" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-700 mt-1", children: workOrder.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-600 mt-1", children: ["Customer: ", ((_c = workOrder.account) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown', " | Priority: ", (0, work_orders_2.getPriorityLabel)(workOrder.priority)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Scheduled Date ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: jobFormData.scheduled_date || '', onChange: function (e) { return setJobFormData(__assign(__assign({}, jobFormData), { scheduled_date: e.target.value })); }, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assigned Technician" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 py-2", children: workOrder.assignedTechnician
                                                                ? "".concat(workOrder.assignedTechnician.first_name, " ").concat(workOrder.assignedTechnician.last_name)
                                                                : 'No technician assigned' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: jobFormData.scheduled_start_time || '09:00', onChange: function (e) { return setJobFormData(__assign(__assign({}, jobFormData), { scheduled_start_time: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Time" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "time", value: jobFormData.scheduled_end_time || '10:00', onChange: function (e) { return setJobFormData(__assign(__assign({}, jobFormData), { scheduled_end_time: e.target.value })); } })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }), (0, jsx_runtime_1.jsx)("textarea", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent", rows: 3, value: jobFormData.notes || '', onChange: function (e) { return setJobFormData(__assign(__assign({}, jobFormData), { notes: e.target.value })); }, placeholder: "Additional notes for this job..." })] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowCreateJobDialog(false); }, disabled: createJobMutation.isPending, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleCreateJobSubmit, disabled: createJobMutation.isPending || !jobFormData.scheduled_date, className: "flex items-center gap-2", children: createJobMutation.isPending ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Creating..." }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Create Job"] })) })] })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5 text-red-500" }), "Delete Work Order"] }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Are you sure you want to delete this work order? This action cannot be undone." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-50 rounded-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: workOrder.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Customer: ", ((_d = workOrder.account) === null || _d === void 0 ? void 0 : _d.name) || 'Unknown'] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Status: ", (0, work_orders_2.getStatusLabel)(workOrder.status)] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowDeleteDialog(false); }, disabled: deleteWorkOrderMutation.isPending, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "danger", onClick: handleDelete, disabled: deleteWorkOrderMutation.isPending, children: deleteWorkOrderMutation.isPending ? 'Deleting...' : 'Delete Work Order' })] })] }) })] })] }));
}
