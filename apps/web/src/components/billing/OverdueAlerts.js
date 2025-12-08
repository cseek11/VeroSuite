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
exports.default = OverdueAlerts;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var useDialog_1 = require("@/hooks/useDialog");
var toast_1 = require("@/utils/toast");
function OverdueAlerts() {
    var _this = this;
    var _a = (0, react_1.useState)(new Set()), selectedInvoices = _a[0], setSelectedInvoices = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), overdueFilter = _c[0], setOverdueFilter = _c[1];
    var _d = (0, react_1.useState)('daysPastDue'), sortField = _d[0], setSortField = _d[1];
    var _e = (0, react_1.useState)('desc'), sortDirection = _e[0], setSortDirection = _e[1];
    var _f = (0, react_1.useState)(false), showFilters = _f[0], setShowFilters = _f[1];
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'overdue-invoices'],
        queryFn: function () { return enhanced_api_1.billing.getOverdueInvoices(); },
    }), overdueInvoices = _g.data, isLoading = _g.isLoading, error = _g.error, refetch = _g.refetch;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var formatDate = function (date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var toggleInvoiceSelection = function (invoiceId) {
        var newSelection = new Set(selectedInvoices);
        if (newSelection.has(invoiceId)) {
            newSelection.delete(invoiceId);
        }
        else {
            newSelection.add(invoiceId);
        }
        setSelectedInvoices(newSelection);
    };
    var selectAll = function () {
        if (filteredAndSortedInvoices && filteredAndSortedInvoices.length > 0) {
            setSelectedInvoices(new Set(filteredAndSortedInvoices.map(function (inv) { return inv.id; })));
        }
    };
    var selectByFilter = function (filter) {
        var invoicesToSelect = filteredAndSortedInvoices.filter(function (inv) {
            if (filter === 'all')
                return true;
            switch (filter) {
                case '0-30':
                    return inv.daysPastDue >= 0 && inv.daysPastDue <= 30;
                case '31-60':
                    return inv.daysPastDue >= 31 && inv.daysPastDue <= 60;
                case '61-90':
                    return inv.daysPastDue >= 61 && inv.daysPastDue <= 90;
                case '90+':
                    return inv.daysPastDue > 90;
                default:
                    return false;
            }
        });
        setSelectedInvoices(new Set(invoicesToSelect.map(function (inv) { return inv.id; })));
    };
    var clearSelection = function () {
        setSelectedInvoices(new Set());
    };
    var _h = (0, useDialog_1.useDialog)(), showAlert = _h.showAlert, showConfirm = _h.showConfirm, DialogComponents = _h.DialogComponents;
    var handleSendReminder = function (invoiceId) { return __awaiter(_this, void 0, void 0, function () {
        var result, errorMsg, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logger_1.logger.debug('Sending reminder for invoice', { invoiceId: invoiceId }, 'OverdueAlerts');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.billing.sendInvoiceReminder([invoiceId])];
                case 2:
                    result = _c.sent();
                    if (result.successful > 0) {
                        toast_1.toast.success('Reminder sent successfully');
                        logger_1.logger.info('Reminder sent successfully', { invoiceId: invoiceId, result: result }, 'OverdueAlerts');
                    }
                    else {
                        errorMsg = ((_b = (_a = result.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to send reminder';
                        toast_1.toast.error(errorMsg);
                        logger_1.logger.error('Failed to send reminder', { invoiceId: invoiceId, result: result }, 'OverdueAlerts');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    logger_1.logger.error('Error sending reminder', error_1, 'OverdueAlerts');
                    toast_1.toast.error('Failed to send reminder. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSendBulkReminders = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2, confirmed, error_3, invoiceIds, result, error_4, failedResults, errorMessages, error_5, errorMsg, error_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 20, , 21]);
                    if (!(selectedInvoices.size === 0)) return [3 /*break*/, 5];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, showAlert({
                            title: 'No Selection',
                            message: 'Please select at least one invoice',
                            type: 'warning',
                        })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    logger_1.logger.error('Failed to display no selection alert', error_2, 'OverdueAlerts');
                    throw error_2;
                case 4: return [2 /*return*/];
                case 5:
                    confirmed = false;
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, showConfirm({
                            title: 'Send Bulk Reminders',
                            message: "Are you sure you want to send reminders for ".concat(selectedInvoices.size, " invoice").concat(selectedInvoices.size !== 1 ? 's' : '', "?"),
                        })];
                case 7:
                    confirmed = _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_3 = _c.sent();
                    logger_1.logger.error('Failed to show confirmation dialog for bulk reminders', error_3, 'OverdueAlerts');
                    throw error_3;
                case 9:
                    if (!confirmed)
                        return [2 /*return*/];
                    logger_1.logger.debug('Sending bulk reminders', { count: selectedInvoices.size }, 'OverdueAlerts');
                    invoiceIds = Array.from(selectedInvoices);
                    result = void 0;
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, enhanced_api_1.billing.sendInvoiceReminder(invoiceIds)];
                case 11:
                    result = _c.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_4 = _c.sent();
                    logger_1.logger.error('Failed to send invoice reminders', error_4, 'OverdueAlerts');
                    throw error_4;
                case 13:
                    if (!(result.successful > 0)) return [3 /*break*/, 18];
                    toast_1.toast.success("Reminders sent to ".concat(result.successful, " customer").concat(result.successful !== 1 ? 's' : ''));
                    logger_1.logger.info('Bulk reminders sent successfully', { count: result.successful, total: result.total }, 'OverdueAlerts');
                    if (!(result.failed > 0)) return [3 /*break*/, 17];
                    failedResults = result.results.filter(function (r) { return !r.success; });
                    errorMessages = failedResults.map(function (r) { return r.error || 'Unknown error'; }).join(', ');
                    _c.label = 14;
                case 14:
                    _c.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, showAlert({
                            title: 'Partial Success',
                            message: "".concat(result.successful, " reminder").concat(result.successful !== 1 ? 's' : '', " sent successfully. ").concat(result.failed, " failed: ").concat(errorMessages),
                            type: 'warning',
                        })];
                case 15:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 16:
                    error_5 = _c.sent();
                    logger_1.logger.error('Failed to show partial success alert', error_5, 'OverdueAlerts');
                    throw error_5;
                case 17:
                    // Clear selection after successful send
                    setSelectedInvoices(new Set());
                    return [3 /*break*/, 19];
                case 18:
                    errorMsg = ((_b = (_a = result.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to send reminders';
                    toast_1.toast.error("Failed to send reminders: ".concat(errorMsg));
                    logger_1.logger.error('Failed to send bulk reminders', { result: result }, 'OverdueAlerts');
                    _c.label = 19;
                case 19: return [3 /*break*/, 21];
                case 20:
                    error_6 = _c.sent();
                    logger_1.logger.error('Error sending bulk reminders', error_6, 'OverdueAlerts');
                    toast_1.toast.error('Failed to send reminders. Please try again.');
                    throw error_6;
                case 21: return [2 /*return*/];
            }
        });
    }); };
    var handleExportCSV = function () {
        try {
            var headers = ['Invoice Number', 'Customer', 'Email', 'Phone', 'Due Date', 'Days Overdue', 'Balance Due'];
            var rows = filteredAndSortedInvoices.map(function (inv) {
                var _a, _b, _c;
                return [
                    inv.invoice_number,
                    ((_a = inv.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    ((_b = inv.accounts) === null || _b === void 0 ? void 0 : _b.email) || 'N/A',
                    ((_c = inv.accounts) === null || _c === void 0 ? void 0 : _c.phone) || 'N/A',
                    formatDate(inv.due_date),
                    inv.daysPastDue.toString(),
                    formatCurrency(inv.balanceDue)
                ];
            });
            var csvContent = __spreadArray([
                'Overdue Invoices Report',
                "Generated: ".concat(new Date().toLocaleDateString()),
                "Total Overdue: ".concat(formatCurrency(totalOverdue)),
                "Total Invoices: ".concat(filteredAndSortedInvoices.length),
                "Critical (90+ days): ".concat(criticalOverdue.length),
                '',
                headers.join(',')
            ], rows.map(function (row) { return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(','); }), true).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "Overdue-Invoices-".concat(new Date().toISOString().split('T')[0], ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('Overdue Invoices CSV exported', {}, 'OverdueAlerts');
            toast_1.toast.success('Overdue invoices report exported successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to export Overdue Invoices CSV', error, 'OverdueAlerts');
            toast_1.toast.error('Failed to export report. Please try again.');
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading overdue invoices..." })] })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Failed to load overdue invoices. Please try again." }) }) }) })] }));
    }
    if (!overdueInvoices || overdueInvoices.length === 0) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-8 h-8 text-green-600" }) }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "font-semibold text-gray-900 mb-2", children: "No Overdue Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "All invoices are up to date. Great job!" })] }) })] }));
    }
    // Filter and sort overdue invoices
    var filteredAndSortedInvoices = (0, react_1.useMemo)(function () {
        var filtered = __spreadArray([], overdueInvoices, true);
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (inv) {
                var _a, _b, _c, _d;
                return inv.invoice_number.toLowerCase().includes(searchLower_1) ||
                    ((_b = (_a = inv.accounts) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_d = (_c = inv.accounts) === null || _c === void 0 ? void 0 : _c.email) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply overdue filter
        if (overdueFilter !== 'all') {
            filtered = filtered.filter(function (inv) {
                switch (overdueFilter) {
                    case '0-30':
                        return inv.daysPastDue >= 0 && inv.daysPastDue <= 30;
                    case '31-60':
                        return inv.daysPastDue >= 31 && inv.daysPastDue <= 60;
                    case '61-90':
                        return inv.daysPastDue >= 61 && inv.daysPastDue <= 90;
                    case '90+':
                        return inv.daysPastDue > 90;
                    default:
                        return true;
                }
            });
        }
        // Apply sorting
        filtered.sort(function (a, b) {
            var _a, _b;
            var aValue;
            var bValue;
            switch (sortField) {
                case 'invoice_number':
                    aValue = a.invoice_number.toLowerCase();
                    bValue = b.invoice_number.toLowerCase();
                    break;
                case 'customerName':
                    aValue = (((_a = a.accounts) === null || _a === void 0 ? void 0 : _a.name) || '').toLowerCase();
                    bValue = (((_b = b.accounts) === null || _b === void 0 ? void 0 : _b.name) || '').toLowerCase();
                    break;
                case 'balanceDue':
                    aValue = a.balanceDue;
                    bValue = b.balanceDue;
                    break;
                case 'daysPastDue':
                    aValue = a.daysPastDue;
                    bValue = b.daysPastDue;
                    break;
                case 'due_date':
                    aValue = new Date(a.due_date).getTime();
                    bValue = new Date(b.due_date).getTime();
                    break;
                default:
                    return 0;
            }
            if (aValue === bValue)
                return 0;
            var comparison = aValue < bValue ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
        return filtered;
    }, [overdueInvoices, searchTerm, overdueFilter, sortField, sortDirection]);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('desc');
        }
    };
    var getSortIcon = function (field) {
        if (sortField !== field) {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpDown, { className: "w-4 h-4 text-gray-400" });
        }
        return sortDirection === 'asc'
            ? (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "w-4 h-4 text-purple-600" })
            : (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "w-4 h-4 text-purple-600" });
    };
    var totalOverdue = filteredAndSortedInvoices.reduce(function (sum, inv) { return sum + inv.balanceDue; }, 0);
    var criticalOverdue = filteredAndSortedInvoices.filter(function (inv) { return inv.daysPastDue > 90; });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Overdue Account Alerts" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Manage and send reminders for overdue invoices" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [selectedInvoices.size > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: clearSelection, children: ["Clear Selection (", selectedInvoices.size, ")"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Send, onClick: handleSendBulkReminders, children: "Send Bulk Reminders" })] })), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return refetch(); }, children: "Refresh" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-700 font-medium text-sm", children: "Total Overdue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-red-900 font-bold mt-1", children: formatCurrency(totalOverdue) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-red-600 text-xs mt-1", children: [overdueInvoices.length, " invoice", overdueInvoices.length !== 1 ? 's' : ''] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-6 h-6 text-red-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-orange-700 font-medium text-sm", children: "Critical (90+ days)" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-orange-900 font-bold mt-1", children: criticalOverdue.length }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-orange-600 text-xs mt-1", children: "Require immediate attention" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-6 h-6 text-orange-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-700 font-medium text-sm", children: "Avg Days Overdue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-yellow-900 font-bold mt-1", children: Math.round(overdueInvoices.reduce(function (sum, inv) { return sum + inv.daysPastDue; }, 0) /
                                                            overdueInvoices.length) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-600 text-xs mt-1", children: "Days past due date" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-6 h-6 text-yellow-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Overdue Invoices" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Filter, onClick: function () { return setShowFilters(!showFilters); }, children: showFilters ? 'Hide Filters' : 'Filters' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: selectAll, children: "Select All" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search invoices, customers...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSearchTerm(''); }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Days Overdue" }), (0, jsx_runtime_1.jsxs)("select", { value: overdueFilter, onChange: function (e) { return setOverdueFilter(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Overdue" }), (0, jsx_runtime_1.jsx)("option", { value: "0-30", children: "0-30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "31-60", children: "31-60 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "61-90", children: "61-90 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "90+", children: "90+ Days (Critical)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Sort By" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 flex-wrap", children: ([
                                                                        { field: 'daysPastDue', label: 'Days Overdue' },
                                                                        { field: 'balanceDue', label: 'Balance' },
                                                                        { field: 'customerName', label: 'Customer' },
                                                                        { field: 'invoice_number', label: 'Invoice #' },
                                                                        { field: 'due_date', label: 'Due Date' },
                                                                    ]).map(function (_a) {
                                                                        var field = _a.field, label = _a.label;
                                                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSort(field); }, className: "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(sortField === field
                                                                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'), children: [label, getSortIcon(field)] }, field));
                                                                    }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Quick Select" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return selectByFilter('90+'); }, children: "Select Critical (90+)" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return selectByFilter('61-90'); }, children: "Select 61-90 Days" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return selectByFilter('31-60'); }, children: "Select 31-60 Days" })] })] })] }))] }), filteredAndSortedInvoices.length !== overdueInvoices.length && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4 text-sm text-gray-600", children: ["Showing ", filteredAndSortedInvoices.length, " of ", overdueInvoices.length, " overdue invoices"] })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredAndSortedInvoices.map(function (invoice) {
                                        var _a, _b, _c;
                                        return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 hover:border-purple-300 transition-colors ".concat(selectedInvoices.has(invoice.id) ? 'border-purple-500 bg-purple-50' : '', " ").concat(invoice.daysPastDue > 90 ? 'border-red-300 bg-red-50' : ''), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedInvoices.has(invoice.id), onChange: function () { return toggleInvoiceSelection(invoice.id); }, className: "mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: invoice.invoice_number }), (0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 rounded text-xs font-medium ".concat(invoice.daysPastDue > 90
                                                                                    ? 'bg-red-100 text-red-800'
                                                                                    : invoice.daysPastDue > 60
                                                                                        ? 'bg-orange-100 text-orange-800'
                                                                                        : 'bg-yellow-100 text-yellow-800'), children: [invoice.daysPastDue, " days overdue"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.email) && ((0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-3 h-3 mr-1" }), invoice.accounts.email] })), ((_c = invoice.accounts) === null || _c === void 0 ? void 0 : _c.phone) && ((0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-3 h-3 mr-1" }), invoice.accounts.phone] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-3 h-3 mr-1" }), "Due: ", formatDate(invoice.due_date)] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-3 h-3 mr-1" }), "Balance: ", formatCurrency(invoice.balanceDue)] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Send, onClick: function () { return handleSendReminder(invoice.id); }, children: "Send Reminder" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.FileText, onClick: function () {
                                                                    // TODO: Open invoice details
                                                                    logger_1.logger.debug('View invoice', { invoiceId: invoice.id }, 'OverdueAlerts');
                                                                }, children: "View" })] })] }) }, invoice.id));
                                    }) })] }) })] })] }));
}
