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
exports.default = ARManagement;
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
var toast_1 = require("@/utils/toast");
function ARManagement() {
    var _a = (0, react_1.useState)(null), selectedCustomer = _a[0], setSelectedCustomer = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), agingFilter = _c[0], setAgingFilter = _c[1];
    var _d = (0, react_1.useState)('totalAR'), sortField = _d[0], setSortField = _d[1];
    var _e = (0, react_1.useState)('desc'), sortDirection = _e[0], setSortDirection = _e[1];
    var _f = (0, react_1.useState)(false), showFilters = _f[0], setShowFilters = _f[1];
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'ar-summary'],
        queryFn: function () { return enhanced_api_1.billing.getARSummary(); },
    }), arSummary = _g.data, isLoading = _g.isLoading, error = _g.error, refetch = _g.refetch;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var getAgingColor = function (bucket) {
        switch (bucket) {
            case '0-30':
                return 'bg-green-50 border-green-200 text-green-800';
            case '31-60':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case '61-90':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case '90+':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };
    // Filter and sort customer AR
    // CRITICAL: This hook MUST be called before any early returns to comply with React's Rules of Hooks
    // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
    var filteredAndSortedCustomerAR = (0, react_1.useMemo)(function () {
        // Guard: Handle case when data is not yet available
        if (!(arSummary === null || arSummary === void 0 ? void 0 : arSummary.customerAR)) {
            return [];
        }
        var filtered = __spreadArray([], arSummary.customerAR, true);
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (customer) {
                return customer.customerName.toLowerCase().includes(searchLower_1) ||
                    customer.customerId.toLowerCase().includes(searchLower_1);
            });
        }
        // Apply aging filter
        if (agingFilter !== 'all') {
            filtered = filtered.filter(function (customer) {
                var oldestDays = Math.max.apply(Math, customer.invoices.map(function (inv) { return inv.daysPastDue || 0; }));
                switch (agingFilter) {
                    case '0-30':
                        return oldestDays >= 0 && oldestDays <= 30;
                    case '31-60':
                        return oldestDays >= 31 && oldestDays <= 60;
                    case '61-90':
                        return oldestDays >= 61 && oldestDays <= 90;
                    case '90+':
                        return oldestDays > 90;
                    default:
                        return true;
                }
            });
        }
        // Apply sorting
        filtered.sort(function (a, b) {
            var aValue;
            var bValue;
            switch (sortField) {
                case 'customerName':
                    aValue = a.customerName.toLowerCase();
                    bValue = b.customerName.toLowerCase();
                    break;
                case 'totalAR':
                    aValue = a.totalAR;
                    bValue = b.totalAR;
                    break;
                case 'invoiceCount':
                    aValue = a.invoices.length;
                    bValue = b.invoices.length;
                    break;
                case 'oldestDays':
                    aValue = Math.max.apply(Math, a.invoices.map(function (inv) { return inv.daysPastDue || 0; }));
                    bValue = Math.max.apply(Math, b.invoices.map(function (inv) { return inv.daysPastDue || 0; }));
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
    }, [arSummary === null || arSummary === void 0 ? void 0 : arSummary.customerAR, searchTerm, agingFilter, sortField, sortDirection]);
    // Early returns AFTER all hooks are called
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading AR data..." })] }));
    }
    if (error) {
        var errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error('Failed to load AR summary data. This may be due to network issues, authentication problems, or server errors. Please check your connection and try again.', error, 'ARManagement');
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold text-red-900", children: "Failed to load AR data" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-sm text-red-700 mt-1", children: [errorMessage, ". Please check your connection and try again."] })] })] }) }) }) }));
    }
    if (!arSummary) {
        return null;
    }
    var totalAR = arSummary.totalAR, agingBuckets = arSummary.agingBuckets, customerAR = arSummary.customerAR, totalCustomers = arSummary.totalCustomers, totalInvoices = arSummary.totalInvoices;
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
    var handleExportCSV = function () {
        try {
            var headers = ['Customer Name', 'Customer ID', 'Total AR', 'Invoice Count', 'Oldest Days Overdue'];
            var rows = filteredAndSortedCustomerAR.map(function (customer) { return [
                customer.customerName,
                customer.customerId,
                formatCurrency(customer.totalAR),
                customer.invoices.length.toString(),
                Math.max.apply(Math, customer.invoices.map(function (inv) { return inv.daysPastDue || 0; })).toString()
            ]; });
            var csvContent = __spreadArray([
                'AR Management Report',
                "Generated: ".concat(new Date().toLocaleDateString()),
                "Total AR: ".concat(formatCurrency(totalAR)),
                "Total Customers: ".concat(totalCustomers),
                '',
                headers.join(',')
            ], rows.map(function (row) { return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(','); }), true).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "AR-Management-".concat(new Date().toISOString().split('T')[0], ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('AR Management CSV exported', {}, 'ARManagement');
            toast_1.toast.success('AR Management report exported successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to export AR Management CSV', error, 'ARManagement');
            toast_1.toast.error('Failed to export report. Please try again.');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Accounts Receivable Management" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Track and manage outstanding receivables" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return refetch(); }, children: "Refresh" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-purple-700 font-medium text-sm", children: "Total AR" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-purple-900 font-bold mt-1", children: formatCurrency(totalAR) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700 font-medium text-sm", children: "Customers" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-blue-900 font-bold mt-1", children: totalCustomers })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-700 font-medium text-sm", children: "Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mt-1", children: totalInvoices })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-orange-700 font-medium text-sm", children: "Avg per Customer" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-orange-900 font-bold mt-1", children: formatCurrency(totalCustomers > 0 ? totalAR / totalCustomers : 0) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-6 h-6 text-orange-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "AR Aging Analysis" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.BarChart3, children: "View Chart" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: agingBuckets.map(function (bucket) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border-2 rounded-lg p-4 ".concat(getAgingColor(bucket.bucket)), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1", children: bucket.bucket === '90+' ? '90+ Days' : "".concat(bucket.bucket, " Days") }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: formatCurrency(bucket.amount) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs mt-1 opacity-75", children: [totalAR > 0 ? "".concat(((bucket.amount / totalAR) * 100).toFixed(1), "%") : '0%', " of total AR"] })] }, bucket.bucket)); }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Customer AR Breakdown" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Filter, onClick: function () { return setShowFilters(!showFilters); }, children: showFilters ? 'Hide Filters' : 'Filters' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search customers...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSearchTerm(''); }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), showFilters && ((0, jsx_runtime_1.jsx)("div", { className: "pt-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Aging Bucket" }), (0, jsx_runtime_1.jsxs)("select", { value: agingFilter, onChange: function (e) { return setAgingFilter(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Aging Buckets" }), (0, jsx_runtime_1.jsx)("option", { value: "0-30", children: "0-30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "31-60", children: "31-60 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "61-90", children: "61-90 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "90+", children: "90+ Days" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Sort By" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: ([
                                                            { field: 'totalAR', label: 'Total AR' },
                                                            { field: 'customerName', label: 'Customer Name' },
                                                            { field: 'invoiceCount', label: 'Invoice Count' },
                                                            { field: 'oldestDays', label: 'Oldest Days' },
                                                        ]).map(function (_a) {
                                                            var field = _a.field, label = _a.label;
                                                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSort(field); }, className: "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(sortField === field
                                                                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'), children: [label, getSortIcon(field)] }, field));
                                                        }) })] })] }) }))] }), filteredAndSortedCustomerAR.length !== customerAR.length && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4 text-sm text-gray-600", children: ["Showing ", filteredAndSortedCustomerAR.length, " of ", customerAR.length, " customers"] })), filteredAndSortedCustomerAR.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 mb-2", children: "No outstanding receivables" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-400 text-sm", children: "All invoices have been paid." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredAndSortedCustomerAR.map(function (customer) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 hover:border-purple-300 transition-colors ".concat(selectedCustomer === customer.customerId ? 'border-purple-500 bg-purple-50' : ''), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: customer.customerName }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium", children: formatCurrency(customer.totalAR) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [customer.invoices.length, " invoice", customer.invoices.length !== 1 ? 's' : '', " \u2022", ' ', "Oldest: ", Math.max.apply(Math, customer.invoices.map(function (inv) { return inv.daysPastDue; })), " days overdue"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-2", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Eye, onClick: function () { return setSelectedCustomer(selectedCustomer === customer.customerId ? null : customer.customerId); }, children: selectedCustomer === customer.customerId ? 'Hide' : 'View' }) })] }), selectedCustomer === customer.customerId && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: customer.invoices.map(function (invoice) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: invoice.invoice_number }), (0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-0.5 rounded text-xs font-medium ".concat(invoice.daysPastDue > 90
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : invoice.daysPastDue > 60
                                                                                ? 'bg-orange-100 text-orange-800'
                                                                                : invoice.daysPastDue > 30
                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                    : 'bg-green-100 text-green-800'), children: [invoice.daysPastDue, " days"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-600 mt-1", children: ["Due: ", new Date(invoice.due_date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: formatCurrency(invoice.total_amount) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-600", children: ["of ", formatCurrency(Number(invoice.total_amount))] })] })] }, invoice.id)); }) }) }))] }, customer.customerId)); }) }))] }) })] }));
}
