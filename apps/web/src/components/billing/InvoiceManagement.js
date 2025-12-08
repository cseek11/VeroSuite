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
exports.default = InvoiceManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var InvoiceForm_1 = __importDefault(require("./InvoiceForm"));
var InvoiceViewer_1 = __importDefault(require("./InvoiceViewer"));
var logger_1 = require("@/utils/logger");
function InvoiceManagement() {
    var _this = this;
    var _a = (0, react_1.useState)('all'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('date'), sortField = _c[0], setSortField = _c[1];
    var _d = (0, react_1.useState)('desc'), sortOrder = _d[0], setSortOrder = _d[1];
    var _e = (0, react_1.useState)(false), showInvoiceForm = _e[0], setShowInvoiceForm = _e[1];
    var _f = (0, react_1.useState)(null), selectedInvoice = _f[0], setSelectedInvoice = _f[1];
    var _g = (0, react_1.useState)(null), editingInvoice = _g[0], setEditingInvoice = _g[1];
    var _h = (0, react_1.useState)(false), showInvoiceViewer = _h[0], setShowInvoiceViewer = _h[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch all invoices
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'invoices', 'admin'],
        queryFn: function () { return enhanced_api_1.billing.getInvoices(); },
    }), _k = _j.data, invoices = _k === void 0 ? [] : _k, isLoading = _j.isLoading, error = _j.error, refetch = _j.refetch;
    // Delete invoice mutation
    var deleteInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: function (invoiceId) { return enhanced_api_1.billing.deleteInvoice(invoiceId); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['billing'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete invoice', error, 'InvoiceManagement');
        }
    });
    // Update invoice status mutation
    var updateInvoiceStatusMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var invoiceId = _a.invoiceId, status = _a.status;
            return enhanced_api_1.billing.updateInvoice(invoiceId, { status: status });
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['billing'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update invoice status', error, 'InvoiceManagement');
        }
    });
    // Filter and sort invoices
    var filteredAndSortedInvoices = (0, react_1.useMemo)(function () {
        // Filter by tab and search
        var filtered = invoices.filter(function (invoice) {
            var _a, _b;
            var matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ((_b = (_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase())) ||
                invoice.total_amount.toString().includes(searchTerm);
            var matchesTab = activeTab === 'all' || invoice.status === activeTab;
            return matchesSearch && matchesTab;
        });
        // Sort invoices
        filtered.sort(function (a, b) {
            var _a, _b;
            var aValue;
            var bValue;
            switch (sortField) {
                case 'date':
                    aValue = new Date(a.issue_date).getTime();
                    bValue = new Date(b.issue_date).getTime();
                    break;
                case 'due_date':
                    aValue = new Date(a.due_date).getTime();
                    bValue = new Date(b.due_date).getTime();
                    break;
                case 'amount':
                    aValue = Number(a.total_amount);
                    bValue = Number(b.total_amount);
                    break;
                case 'customer':
                    aValue = ((_a = a.accounts) === null || _a === void 0 ? void 0 : _a.name) || '';
                    bValue = ((_b = b.accounts) === null || _b === void 0 ? void 0 : _b.name) || '';
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    return 0;
            }
            if (aValue < bValue)
                return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue)
                return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [invoices, activeTab, searchTerm, sortField, sortOrder]);
    // Calculate statistics
    var stats = {
        total: invoices.length,
        draft: invoices.filter(function (inv) { return inv.status === 'draft'; }).length,
        sent: invoices.filter(function (inv) { return inv.status === 'sent'; }).length,
        paid: invoices.filter(function (inv) { return inv.status === 'paid'; }).length,
        overdue: invoices.filter(function (inv) { return inv.status === 'overdue'; }).length,
        totalAmount: invoices.reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0),
        paidAmount: invoices.filter(function (inv) { return inv.status === 'paid'; })
            .reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0),
        outstandingAmount: invoices.filter(function (inv) { return inv.status === 'sent' || inv.status === 'overdue'; })
            .reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0)
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-600" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-600" });
            case 'sent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-gray-600" });
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'sent':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    var handleDeleteInvoice = function (invoice) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to delete invoice ".concat(invoice.invoice_number, "?"))) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteInvoiceMutation.mutateAsync(invoice.id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdateStatus = function (invoice, newStatus) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateInvoiceStatusMutation.mutateAsync({
                        invoiceId: invoice.id,
                        status: newStatus
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleEditInvoice = function (invoice) {
        setEditingInvoice(invoice);
        setShowInvoiceForm(true);
    };
    var handleViewInvoice = function (invoice) {
        setSelectedInvoice(invoice);
        setShowInvoiceViewer(true);
    };
    var tabs = [
        { id: 'all', label: 'All Invoices', count: stats.total },
        { id: 'draft', label: 'Draft', count: stats.draft },
        { id: 'sent', label: 'Sent', count: stats.sent },
        { id: 'paid', label: 'Paid', count: stats.paid },
        { id: 'overdue', label: 'Overdue', count: stats.overdue }
    ];
    var renderInvoiceCard = function (invoice) {
        var _a, _b;
        return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-gray-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: invoice.invoice_number }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium border ".concat(getStatusColor(invoice.status)), children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Issue Date" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1" }), new Date(invoice.issue_date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Due Date" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1" }), new Date(invoice.due_date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-lg flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 mr-1" }), "$", Number(invoice.total_amount).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Customer" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 mr-1" }), ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.name) || 'N/A'] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 ml-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Eye, onClick: function () { return handleViewInvoice(invoice); }, children: "View" }), invoice.status === 'draft' && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Edit, onClick: function () { return handleEditInvoice(invoice); }, children: "Edit" })), (0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10", children: [invoice.status === 'draft' && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleUpdateStatus(invoice, 'sent'); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4 mr-2" }), "Send Invoice"] })), invoice.status === 'sent' && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleUpdateStatus(invoice, 'paid'); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 mr-2" }), "Mark as Paid"] })), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleDeleteInvoice(invoice); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4 mr-2" }), "Delete"] })] })] })] })] }) }, invoice.id));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Invoice Management" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mt-2", children: "Create, manage, and track all customer invoices" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () {
                            setEditingInvoice(null);
                            setShowInvoiceForm(true);
                        }, icon: lucide_react_1.Plus, children: "Create Invoice" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-blue-700 font-medium", children: "Total Revenue" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-blue-800 font-bold mt-1", children: ["$", stats.totalAmount.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-green-700 font-medium", children: "Paid Amount" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-green-800 font-bold mt-1", children: ["$", stats.paidAmount.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-orange-700 font-medium", children: "Outstanding" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-orange-800 font-bold mt-1", children: ["$", stats.outstandingAmount.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-6 h-6 text-orange-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-purple-700 font-medium", children: "Total Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-purple-800 font-bold mt-1", children: stats.total })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-purple-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: tabs.map(function (tab) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === tab.id
                                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'), children: [tab.label, " (", tab.count, ")"] }, tab.id)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 w-full md:w-auto flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 md:flex-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search invoices...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10 w-full md:w-64" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Select_1.default, { value: sortField, onChange: function (value) { return setSortField(value); }, className: "w-32", options: [
                                                    { value: 'date', label: 'Date' },
                                                    { value: 'due_date', label: 'Due Date' },
                                                    { value: 'amount', label: 'Amount' },
                                                    { value: 'customer', label: 'Customer' },
                                                    { value: 'status', label: 'Status' },
                                                ], placeholder: "Sort by" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.ArrowUpDown, onClick: function () { return setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }, children: sortOrder === 'asc' ? '↑' : '↓' })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, children: "Export" })] })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading invoices..." })] })) : error ? ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: "Error Loading Invoices" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mb-3", children: "Unable to load invoices. Please try again later." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return refetch(); }, children: "Retry" })] })) : filteredAndSortedInvoices.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-500 mb-2", children: invoices.length === 0 ? 'No invoices found' : 'No invoices match your filters' }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400 mb-6", children: invoices.length === 0
                                    ? "Get started by creating your first invoice."
                                    : "Try adjusting your search or filter criteria." }), invoices.length === 0 && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return setShowInvoiceForm(true); }, icon: lucide_react_1.Plus, children: "Create First Invoice" }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredAndSortedInvoices.map(renderInvoiceCard) })) }) }), showInvoiceForm && ((0, jsx_runtime_1.jsx)(InvoiceForm_1.default, { invoice: editingInvoice, isOpen: showInvoiceForm, onClose: function () {
                    setShowInvoiceForm(false);
                    setEditingInvoice(null);
                }, onSuccess: function () {
                    setShowInvoiceForm(false);
                    setEditingInvoice(null);
                    queryClient.invalidateQueries({ queryKey: ['billing'] });
                } })), showInvoiceViewer && selectedInvoice && ((0, jsx_runtime_1.jsx)(InvoiceViewer_1.default, { invoice: selectedInvoice, isOpen: showInvoiceViewer, onClose: function () {
                    setShowInvoiceViewer(false);
                    setSelectedInvoice(null);
                } }))] }));
}
