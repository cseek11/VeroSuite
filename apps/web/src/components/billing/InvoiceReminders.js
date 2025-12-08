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
exports.default = InvoiceReminders;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * InvoiceReminders Component
 *
 * Dedicated UI for managing invoice reminders.
 * Enhanced version with better organization and bulk operations.
 *
 * Features:
 * - View all reminders
 * - Send individual reminders
 * - Bulk reminder operations
 * - Reminder scheduling
 * - Reminder history
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function InvoiceReminders(_a) {
    var _this = this;
    var onReminderSent = _a.onReminderSent;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), filterType = _c[0], setFilterType = _c[1];
    var _d = (0, react_1.useState)(new Set()), selectedInvoices = _d[0], setSelectedInvoices = _d[1];
    var _e = (0, react_1.useState)(false), showBulkDialog = _e[0], setShowBulkDialog = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch overdue invoices
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'overdue-invoices'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.billing.getOverdueInvoices()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) ? result : []];
                }
            });
        }); },
    }), overdueInvoicesData = _f.data, invoicesLoading = _f.isLoading, invoicesError = _f.error;
    if (invoicesError) {
        logger_1.logger.error('Failed to fetch overdue invoices', invoicesError, 'InvoiceReminders');
        toast_1.toast.error('Failed to load overdue invoices. Please try again.');
    }
    var overdueInvoices = Array.isArray(overdueInvoicesData) ? overdueInvoicesData : [];
    // Fetch reminder history
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'reminder-history'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock data for now
                return [2 /*return*/, [
                        {
                            id: '1',
                            invoice_id: 'inv-1',
                            invoice_number: 'INV-001',
                            customer_name: 'Acme Corporation',
                            sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            reminder_type: 'email',
                            status: 'sent',
                            message: 'Payment reminder for overdue invoice',
                        },
                    ]];
            });
        }); },
    }), reminderHistoryData = _g.data, historyLoading = _g.isLoading, historyError = _g.error;
    if (historyError) {
        logger_1.logger.error('Failed to fetch reminder history', historyError, 'InvoiceReminders');
    }
    var reminderHistory = Array.isArray(reminderHistoryData) ? reminderHistoryData : [];
    // Filter invoices
    var filteredInvoices = (0, react_1.useMemo)(function () {
        var filtered = overdueInvoices;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (invoice) {
                var _a, _b, _c, _d;
                return ((_a = invoice.invoice_number) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_c = (_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_1)) ||
                    ((_d = invoice.id) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower_1));
            });
        }
        return filtered;
    }, [overdueInvoices, searchTerm]);
    // Filter reminder history
    var filteredHistory = (0, react_1.useMemo)(function () {
        var filtered = reminderHistory;
        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(function (reminder) { return reminder.reminder_type === filterType; });
        }
        return filtered;
    }, [reminderHistory, filterType]);
    var handleSelectInvoice = function (invoiceId) {
        var newSelection = new Set(selectedInvoices);
        if (newSelection.has(invoiceId)) {
            newSelection.delete(invoiceId);
        }
        else {
            newSelection.add(invoiceId);
        }
        setSelectedInvoices(newSelection);
    };
    var handleSelectAll = function () {
        if (selectedInvoices.size === filteredInvoices.length) {
            setSelectedInvoices(new Set());
        }
        else {
            setSelectedInvoices(new Set(filteredInvoices.map(function (inv) { var _a; return (_a = inv.id) !== null && _a !== void 0 ? _a : ''; }).filter(function (id) { return id !== ''; })));
        }
    };
    var handleSendReminder = function (invoiceId) { return __awaiter(_this, void 0, void 0, function () {
        var result, errorMsg, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    logger_1.logger.debug('Sending reminder for invoice', { invoiceId: invoiceId }, 'InvoiceReminders');
                    return [4 /*yield*/, enhanced_api_1.billing.sendInvoiceReminder([invoiceId])];
                case 1:
                    result = _c.sent();
                    if (!(result.successful > 0)) return [3 /*break*/, 4];
                    toast_1.toast.success('Reminder sent successfully');
                    logger_1.logger.info('Reminder sent successfully', { invoiceId: invoiceId, result: result }, 'InvoiceReminders');
                    // Invalidate queries to refresh data
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['billing', 'reminder-history'] })];
                case 2:
                    // Invalidate queries to refresh data
                    _c.sent();
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['billing', 'overdue-invoices'] })];
                case 3:
                    _c.sent();
                    if (onReminderSent) {
                        onReminderSent();
                    }
                    return [3 /*break*/, 5];
                case 4:
                    errorMsg = ((_b = (_a = result.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to send reminder';
                    toast_1.toast.error(errorMsg);
                    logger_1.logger.error('Failed to send reminder', { invoiceId: invoiceId, result: result }, 'InvoiceReminders');
                    _c.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    logger_1.logger.error('Error sending reminder', error_1, 'InvoiceReminders');
                    toast_1.toast.error('Failed to send reminder. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleSendBulkReminders = function () { return __awaiter(_this, void 0, void 0, function () {
        var invoiceIds, result, errorMsg, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (selectedInvoices.size === 0) {
                        toast_1.toast.error('Please select at least one invoice');
                        return [2 /*return*/];
                    }
                    invoiceIds = Array.from(selectedInvoices);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    logger_1.logger.debug('Sending bulk reminders', { count: invoiceIds.length }, 'InvoiceReminders');
                    return [4 /*yield*/, enhanced_api_1.billing.sendInvoiceReminder(invoiceIds)];
                case 2:
                    result = _c.sent();
                    if (!(result.successful > 0)) return [3 /*break*/, 5];
                    toast_1.toast.success("Reminders sent to ".concat(result.successful, " customer").concat(result.successful !== 1 ? 's' : ''));
                    logger_1.logger.info('Bulk reminders sent successfully', { count: result.successful, total: result.total }, 'InvoiceReminders');
                    // Clear selection
                    setSelectedInvoices(new Set());
                    setShowBulkDialog(false);
                    // Invalidate queries
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['billing', 'reminder-history'] })];
                case 3:
                    // Invalidate queries
                    _c.sent();
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['billing', 'overdue-invoices'] })];
                case 4:
                    _c.sent();
                    if (onReminderSent) {
                        onReminderSent();
                    }
                    return [3 /*break*/, 6];
                case 5:
                    errorMsg = ((_b = (_a = result.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to send reminders';
                    toast_1.toast.error("Failed to send reminders: ".concat(errorMsg));
                    logger_1.logger.error('Failed to send bulk reminders', { result: result }, 'InvoiceReminders');
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _c.sent();
                    logger_1.logger.error('Error sending bulk reminders', error_2, 'InvoiceReminders');
                    toast_1.toast.error('Failed to send reminders. Please try again.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
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
    var getDaysOverdue = function (dueDate) {
        var due = new Date(dueDate);
        var now = new Date();
        var diffTime = now.getTime() - due.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-6 h-6 mr-2 text-purple-600" }), "Invoice Reminders"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-2", children: "Send reminders for overdue invoices" })] }), selectedInvoices.size > 0 && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", icon: lucide_react_1.Send, onClick: function () { return setShowBulkDialog(true); }, children: ["Send Bulk Reminders (", selectedInvoices.size, ")"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search invoices...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) }), invoicesLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading overdue invoices..." })] })), !invoicesLoading && filteredInvoices.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-12 h-12 text-green-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: "No overdue invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: "All invoices are up to date!" })] }) })), !invoicesLoading && filteredInvoices.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-medium", children: [filteredInvoices.length, " overdue invoice", filteredInvoices.length !== 1 ? 's' : ''] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleSelectAll, children: selectedInvoices.size === filteredInvoices.length ? 'Deselect All' : 'Select All' })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredInvoices.map(function (invoice) {
                                        var _a, _b, _c;
                                        var isSelected = selectedInvoices.has((_a = invoice.id) !== null && _a !== void 0 ? _a : '');
                                        var daysOverdue = invoice.due_date ? getDaysOverdue(invoice.due_date) : 0;
                                        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-2 transition-colors ".concat(isSelected
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'), children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3 flex-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isSelected, onChange: function () { var _a; return handleSelectInvoice((_a = invoice.id) !== null && _a !== void 0 ? _a : ''); }, className: "mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: invoice.invoice_number || "Invoice ".concat(invoice.id.slice(0, 8)) }), (0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium", children: [daysOverdue, " day", daysOverdue !== 1 ? 's' : '', " overdue"] })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 mb-2", children: ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1" }), "Due: ", formatDate(invoice.due_date)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 mr-1" }), "Amount: ", formatCurrency(invoice.total_amount)] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Send, onClick: function () { return handleSendReminder(invoice.id); }, children: "Send Reminder" }) })] }) }) }, (_c = invoice.id) !== null && _c !== void 0 ? _c : "invoice-".concat(Math.random())));
                                    }) })] }))] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-6 h-6 mr-2 text-purple-600" }), "Reminder History"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("select", { value: filterType, onChange: function (e) { return setFilterType(e.target.value); }, className: "text-sm border border-gray-300 rounded px-2 py-1", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "email", children: "Email" }), (0, jsx_runtime_1.jsx)("option", { value: "sms", children: "SMS" }), (0, jsx_runtime_1.jsx)("option", { value: "letter", children: "Letter" })] })] })] }), historyLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading reminder history..." })] })), !historyLoading && filteredHistory.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: "No reminder history" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: "Reminders you send will appear here" })] }) })), !historyLoading && filteredHistory.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredHistory.map(function (reminder) { return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: reminder.invoice_number }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium ".concat(reminder.status === 'sent'
                                                                ? 'bg-green-100 text-green-800'
                                                                : reminder.status === 'failed'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'), children: reminder.status }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium", children: reminder.reminder_type })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 mb-2", children: reminder.customer_name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 mr-1" }), "Sent: ", formatDate(reminder.sent_at)] }), reminder.message && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: reminder.message }))] })] }) }) }) }, reminder.id)); }) }))] }) }), showBulkDialog && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "bg-white p-6 max-w-md", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-4", children: "Send Bulk Reminders" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "mb-4", children: ["Are you sure you want to send reminders for ", selectedInvoices.size, " invoice", selectedInvoices.size !== 1 ? 's' : '', "?"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowBulkDialog(false); }, className: "flex-1", children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleSendBulkReminders, className: "flex-1", children: "Send Reminders" })] })] }) }))] }));
}
