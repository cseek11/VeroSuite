"use strict";
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
exports.default = InvoiceScheduler;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * InvoiceScheduler Component
 *
 * Manages automated invoice scheduling and recurring invoices.
 * Allows users to create, edit, and manage scheduled invoice generation.
 *
 * Features:
 * - Create recurring invoice schedules
 * - Schedule one-time invoices
 * - Manage automation rules
 * - View scheduled invoices
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var Dialog_1 = require("@/components/ui/Dialog");
function InvoiceScheduler(_a) {
    var _this = this;
    var _onScheduleCreated = _a.onScheduleCreated;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), filterStatus = _c[0], setFilterStatus = _c[1];
    var _d = (0, react_1.useState)(false), showScheduleForm = _d[0], setShowScheduleForm = _d[1];
    var _e = (0, react_1.useState)(null), editingSchedule = _e[0], setEditingSchedule = _e[1];
    var _f = (0, react_1.useState)(null), _selectedCustomer = _f[0], setSelectedCustomer = _f[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Mock scheduled invoices - In production, this would fetch from API
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['invoice-schedules'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock data for now
                return [2 /*return*/, [
                        {
                            id: '1',
                            customer_id: 'cust-1',
                            customer_name: 'Acme Corporation',
                            schedule_type: 'recurring',
                            frequency: 'monthly',
                            start_date: '2025-01-01',
                            next_run_date: '2025-12-01',
                            is_active: true,
                            amount: 150.00,
                            description: 'Monthly pest control service',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                        {
                            id: '2',
                            customer_id: 'cust-2',
                            customer_name: 'Tech Solutions Inc',
                            schedule_type: 'one-time',
                            start_date: '2025-12-20',
                            next_run_date: '2025-12-20',
                            is_active: true,
                            amount: 500.00,
                            description: 'Quarterly deep cleaning',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                    ]];
            });
        }); },
    }), schedulesData = _g.data, isLoading = _g.isLoading, schedulesError = _g.error;
    if (schedulesError) {
        logger_1.logger.error('Failed to fetch invoice schedules', schedulesError, 'InvoiceScheduler');
        toast_1.toast.error('Failed to load schedules. Please try again.');
    }
    var schedules = Array.isArray(schedulesData) ? schedulesData : [];
    // Filter schedules
    var filteredSchedules = (0, react_1.useMemo)(function () {
        var filtered = schedules;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (schedule) {
                var _a, _b;
                return ((_a = schedule.customer_name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_b = schedule.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    schedule.customer_id.toLowerCase().includes(searchLower_1);
            });
        }
        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(function (schedule) {
                return filterStatus === 'active' ? schedule.is_active : !schedule.is_active;
            });
        }
        return filtered;
    }, [schedules, searchTerm, filterStatus]);
    var handleCreateSchedule = function () {
        setEditingSchedule(null);
        setSelectedCustomer(null);
        setShowScheduleForm(true);
    };
    var handleEditSchedule = function (schedule) {
        setEditingSchedule(schedule);
        setShowScheduleForm(true);
    };
    var handleDeleteSchedule = function (scheduleId) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this schedule?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    logger_1.logger.debug('Schedule deleted', { scheduleId: scheduleId }, 'InvoiceScheduler');
                    toast_1.toast.success('Schedule deleted successfully');
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete schedule', error_1, 'InvoiceScheduler');
                    toast_1.toast.error('Failed to delete schedule. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleActive = function (schedule) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    logger_1.logger.debug('Schedule toggled', { scheduleId: schedule.id, newStatus: !schedule.is_active }, 'InvoiceScheduler');
                    toast_1.toast.success("Schedule ".concat(!schedule.is_active ? 'activated' : 'paused'));
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['invoice-schedules'] })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to toggle schedule', error_2, 'InvoiceScheduler');
                    toast_1.toast.error('Failed to update schedule. Please try again.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    var getFrequencyLabel = function (frequency) {
        var labels = {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            yearly: 'Yearly',
        };
        return frequency ? labels[frequency] || frequency : 'One-time';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-6 h-6 mr-2 text-purple-600" }), "Invoice Scheduler"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-2", children: "Schedule recurring and one-time invoice generation" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Plus, onClick: handleCreateSchedule, children: "Create Schedule" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search schedules...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Status:" }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: filterStatus, onChange: function (value) { return setFilterStatus(value); }, className: "w-32", options: [
                                                { value: 'all', label: 'All' },
                                                { value: 'active', label: 'Active' },
                                                { value: 'inactive', label: 'Inactive' },
                                            ] })] })] }), isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading schedules..." })] })), !isLoading && filteredSchedules.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: searchTerm || filterStatus !== 'all' ? 'No schedules found' : 'No schedules yet' }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: searchTerm || filterStatus !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'Create your first schedule to automate invoice generation' })] }) })), !isLoading && filteredSchedules.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredSchedules.map(function (schedule) { return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-2 transition-colors ".concat(schedule.is_active
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200'), children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: schedule.customer_name || "Customer ".concat(schedule.customer_id.slice(0, 8)) }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium flex items-center ".concat(schedule.is_active
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'), children: schedule.is_active ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 mr-1" }), "Active"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3 mr-1" }), "Inactive"] })) }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium", children: schedule.schedule_type === 'recurring'
                                                                    ? getFrequencyLabel(schedule.frequency)
                                                                    : 'One-time' })] }), schedule.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 mb-3", children: schedule.description })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Amount" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: formatCurrency(schedule.amount) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Start Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(schedule.start_date) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Next Run" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(schedule.next_run_date) })] }), schedule.end_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "End Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(schedule.end_date) })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4 flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: schedule.is_active ? lucide_react_1.Pause : lucide_react_1.Play, onClick: function () { return handleToggleActive(schedule); }, children: schedule.is_active ? 'Pause' : 'Activate' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Edit, onClick: function () { return handleEditSchedule(schedule); }, children: "Edit" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Trash2, onClick: function () { return handleDeleteSchedule(schedule.id); }, children: "Delete" })] })] }) }) }, schedule.id)); }) }))] }) }), showScheduleForm && ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showScheduleForm, onOpenChange: setShowScheduleForm, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: editingSchedule ? 'Edit Schedule' : 'Create Schedule' }) }), (0, jsx_runtime_1.jsx)("div", { className: "py-4", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-yellow-50 border-yellow-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-yellow-600 mr-2 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-800 font-medium", children: "Schedule Editor Coming Soon" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-yellow-700 mt-1", children: "Schedule creation and editing will be available in the next update. For now, schedules are managed via the API." })] })] }) }) }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowScheduleForm(false); }, children: "Close" }) })] }) }))] }));
}
