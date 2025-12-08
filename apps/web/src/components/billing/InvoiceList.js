"use strict";
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
exports.default = InvoiceList;
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
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var billing_analytics_1 = require("@/lib/billing-analytics");
var BillingSkeletons_1 = require("./BillingSkeletons");
function InvoiceList(_a) {
    var customerId = _a.customerId, onInvoiceSelect = _a.onInvoiceSelect, onInvoicePay = _a.onInvoicePay, _b = _a.showActions, showActions = _b === void 0 ? true : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, react_1.useState)('all'), statusFilter = _d[0], setStatusFilter = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('due_date'), sortField = _f[0], setSortField = _f[1];
    var _g = (0, react_1.useState)('desc'), sortDirection = _g[0], setSortDirection = _g[1];
    var _h = (0, react_1.useState)(false), showFilters = _h[0], setShowFilters = _h[1];
    var _j = (0, react_1.useState)(''), dateRangeStart = _j[0], setDateRangeStart = _j[1];
    var _k = (0, react_1.useState)(''), dateRangeEnd = _k[0], setDateRangeEnd = _k[1];
    // Fetch invoices
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'invoices', customerId || 'all'],
        queryFn: function () { return enhanced_api_1.billing.getInvoices(customerId); },
    }), invoicesData = _l.data, isLoading = _l.isLoading, error = _l.error, refetch = _l.refetch;
    var invoices = Array.isArray(invoicesData) ? invoicesData : [];
    // Handle query errors
    if (error) {
        logger_1.logger.error('Failed to fetch invoices', error, 'InvoiceList');
        toast_1.toast.error('Failed to load invoices. Please try again.');
    }
    // Filter and sort invoices
    var filteredAndSortedInvoices = (0, react_1.useMemo)(function () {
        // Guard against undefined invoices array
        if (!Array.isArray(invoices)) {
            logger_1.logger.warn('Invoices data is not an array', { invoices: invoices }, 'InvoiceList');
            return [];
        }
        var filtered = __spreadArray([], invoices, true);
        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(function (invoice) { return invoice.status === statusFilter; });
        }
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (invoice) {
                var _a, _b, _c;
                return invoice.invoice_number.toLowerCase().includes(searchLower_1) ||
                    ((_b = (_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    invoice.total_amount.toString().includes(searchTerm) ||
                    ((_c = invoice.InvoiceItem) === null || _c === void 0 ? void 0 : _c.some(function (item) { var _a; return (_a = item.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1); })) ||
                    (invoice.notes && invoice.notes.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply date range filter
        if (dateRangeStart) {
            var startDate_1 = new Date(dateRangeStart);
            filtered = filtered.filter(function (invoice) {
                return new Date(invoice.issue_date) >= startDate_1;
            });
        }
        if (dateRangeEnd) {
            var endDate_1 = new Date(dateRangeEnd);
            endDate_1.setHours(23, 59, 59, 999); // Include entire end date
            filtered = filtered.filter(function (invoice) {
                return new Date(invoice.issue_date) <= endDate_1;
            });
        }
        // Apply sorting
        filtered.sort(function (a, b) {
            var aValue;
            var bValue;
            switch (sortField) {
                case 'issue_date':
                    aValue = new Date(a.issue_date).getTime();
                    bValue = new Date(b.issue_date).getTime();
                    break;
                case 'due_date':
                    aValue = new Date(a.due_date).getTime();
                    bValue = new Date(b.due_date).getTime();
                    break;
                case 'total_amount':
                    aValue = Number(a.total_amount);
                    bValue = Number(b.total_amount);
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'invoice_number':
                    aValue = a.invoice_number;
                    bValue = b.invoice_number;
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
    }, [invoices, statusFilter, searchTerm, sortField, sortDirection, dateRangeStart, dateRangeEnd]);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
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
            case 'draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    // Calculate statistics
    var stats = (0, react_1.useMemo)(function () {
        var total = invoices.length;
        var draft = invoices.filter(function (inv) { return inv.status === 'draft'; }).length;
        var sent = invoices.filter(function (inv) { return inv.status === 'sent'; }).length;
        var paid = invoices.filter(function (inv) { return inv.status === 'paid'; }).length;
        var overdue = invoices.filter(function (inv) { return inv.status === 'overdue'; }).length;
        var totalAmount = invoices.reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0);
        var paidAmount = invoices.filter(function (inv) { return inv.status === 'paid'; })
            .reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0);
        var outstandingAmount = invoices.filter(function (inv) {
            return inv.status === 'sent' || inv.status === 'overdue';
        }).reduce(function (sum, inv) { return sum + Number(inv.total_amount); }, 0);
        return {
            total: total,
            draft: draft,
            sent: sent,
            paid: paid,
            overdue: overdue,
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            outstandingAmount: outstandingAmount,
        };
    }, [invoices]);
    // Track search
    (0, react_1.useEffect)(function () {
        if (searchTerm) {
            (0, billing_analytics_1.trackInvoiceSearch)(searchTerm, { statusFilter: statusFilter, dateRangeStart: dateRangeStart, dateRangeEnd: dateRangeEnd });
        }
    }, [searchTerm, statusFilter, dateRangeStart, dateRangeEnd]);
    // Track filter changes
    (0, react_1.useEffect)(function () {
        if (statusFilter !== 'all') {
            (0, billing_analytics_1.trackInvoiceFilter)('status', statusFilter);
        }
    }, [statusFilter]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(BillingSkeletons_1.InvoiceListSkeleton, {});
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-red-800 mb-1", children: "Error loading invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: error instanceof Error ? error.message : 'An unexpected error occurred' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return refetch(); }, className: "mt-3", children: "Try Again" })] }) }));
    }
    var statusOptions = [
        { value: 'all', label: 'All Invoices' },
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1", children: stats.total })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-8 h-8 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Outstanding" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1 text-orange-600", children: formatCurrency(stats.outstandingAmount) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-8 h-8 text-orange-400" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Paid" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1 text-green-600", children: formatCurrency(stats.paidAmount) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-8 h-8 text-green-400" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Overdue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1 text-red-600", children: stats.overdue })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-8 h-8 text-red-400" })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Invoices" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Filter, onClick: function () { return setShowFilters(!showFilters); }, children: showFilters ? 'Hide Filters' : 'Filters' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search by invoice number, customer, amount, or description...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSearchTerm(''); }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: statusFilter, onChange: function (value) { return setStatusFilter(value); }, options: statusOptions })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeStart, onChange: function (e) { return setDateRangeStart(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeEnd, onChange: function (e) { return setDateRangeEnd(e.target.value); } })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                            setDateRangeStart('');
                                            setDateRangeEnd('');
                                            setStatusFilter('all');
                                            setSearchTerm('');
                                        }, children: "Clear Filters" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Sort by:" }), ['issue_date', 'due_date', 'total_amount', 'status'].map(function (field) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSort(field); }, className: "px-3 py-1 rounded-md text-sm font-medium transition-colors ".concat(sortField === field
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'), children: [field.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }), sortField === field && ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpDown, { className: "w-3 h-3 inline-block ml-1" }))] }, field)); })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: filteredAndSortedInvoices.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-600 mb-2", children: "No invoices found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-500", children: searchTerm || statusFilter !== 'all' || dateRangeStart || dateRangeEnd
                                    ? 'Try adjusting your filters'
                                    : 'No invoices available' })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredAndSortedInvoices.map(function (invoice) {
                            var _a, _b;
                            return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-gray-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: invoice.invoice_number }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium border ".concat(getStatusColor(invoice.status)), children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mt-1", children: ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Issue Date" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1 text-gray-400" }), formatDate(invoice.issue_date)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Due Date" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-1 text-gray-400" }), formatDate(invoice.due_date)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center mt-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 mr-1 text-gray-400" }), formatCurrency(Number(invoice.total_amount))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Items" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium mt-1", children: [((_b = invoice.InvoiceItem) === null || _b === void 0 ? void 0 : _b.length) || 0, " item(s)"] })] })] })] }), showActions && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 ml-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Eye, onClick: function () {
                                                        (0, billing_analytics_1.trackInvoiceView)(invoice.id, customerId);
                                                        onInvoiceSelect === null || onInvoiceSelect === void 0 ? void 0 : onInvoiceSelect(invoice);
                                                    }, children: "View" }), (invoice.status === 'sent' || invoice.status === 'overdue') && onInvoicePay && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return onInvoicePay(invoice); }, children: "Pay" }))] }))] }) }, invoice.id));
                        }) })) }) })] }));
}
