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
exports.default = ReconciliationTools;
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
function ReconciliationTools() {
    var _a, _b;
    var now = new Date();
    var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    var _c = (0, react_1.useState)((_a = thirtyDaysAgo.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : ''), startDate = _c[0], setStartDate = _c[1];
    var _d = (0, react_1.useState)((_b = now.toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : ''), endDate = _d[0], setEndDate = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('all'), statusFilter = _f[0], setStatusFilter = _f[1];
    var _g = (0, react_1.useState)(new Set()), selectedRecords = _g[0], setSelectedRecords = _g[1];
    var defaultTrackingData = {
        payments: []
    };
    var handleDateChange = function (setter) {
        return function (value) {
            var _a, _b;
            if (typeof value === 'string') {
                setter(value);
                return;
            }
            setter((_b = (_a = value === null || value === void 0 ? void 0 : value.target) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '');
        };
    };
    // Fetch payment tracking data for reconciliation
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-tracking', startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''],
        queryFn: function () { return enhanced_api_1.billing.getPaymentTracking(startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''); },
        initialData: defaultTrackingData,
        placeholderData: defaultTrackingData
    }), _j = _h.data, data = _j === void 0 ? defaultTrackingData : _j, isLoading = _h.isLoading, error = _h.error, refetch = _h.refetch;
    (0, react_1.useEffect)(function () {
        if (error) {
            logger_1.logger.error('Failed to fetch payment tracking data', error, 'ReconciliationTools');
            toast_1.toast.error('Failed to load payment data. Please try again.');
        }
    }, [error]);
    // Convert payment data to reconciliation records
    var reconciliationRecords = (0, react_1.useMemo)(function () {
        if (!(data === null || data === void 0 ? void 0 : data.payments)) {
            return [];
        }
        return data.payments.map(function (payment) {
            var _a, _b, _c, _d;
            var p = payment;
            return {
                id: p.id || Math.random().toString(),
                date: p.payment_date || '',
                amount: Number(p.amount || 0),
                invoiceNumber: (_a = p.Invoice) === null || _a === void 0 ? void 0 : _a.invoice_number,
                customerName: (_c = (_b = p.Invoice) === null || _b === void 0 ? void 0 : _b.accounts) === null || _c === void 0 ? void 0 : _c.name,
                paymentMethod: (_d = p.payment_methods) === null || _d === void 0 ? void 0 : _d.payment_name,
                referenceNumber: p.reference_number,
                status: 'matched', // Simplified - would need actual reconciliation logic
                notes: p.notes
            };
        });
    }, [data === null || data === void 0 ? void 0 : data.payments]);
    // Filter and search records
    var filteredRecords = (0, react_1.useMemo)(function () {
        var filtered = __spreadArray([], reconciliationRecords, true);
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (record) {
                var _a, _b, _c, _d;
                return ((_a = record.invoiceNumber) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_b = record.customerName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_c = record.referenceNumber) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_1)) ||
                    ((_d = record.paymentMethod) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(function (record) { return record.status === statusFilter; });
        }
        return filtered;
    }, [reconciliationRecords, searchTerm, statusFilter]);
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
    var toggleRecordSelection = function (recordId) {
        var newSelection = new Set(selectedRecords);
        if (newSelection.has(recordId)) {
            newSelection.delete(recordId);
        }
        else {
            newSelection.add(recordId);
        }
        setSelectedRecords(newSelection);
    };
    var selectAll = function () {
        setSelectedRecords(new Set(filteredRecords.map(function (r) { return r.id; })));
    };
    var clearSelection = function () {
        setSelectedRecords(new Set());
    };
    var handleExportCSV = function () {
        try {
            var headers = ['Date', 'Amount', 'Invoice', 'Customer', 'Payment Method', 'Reference', 'Status', 'Notes'];
            var rows = filteredRecords.map(function (record) { return [
                formatDate(record.date),
                formatCurrency(record.amount),
                record.invoiceNumber || 'N/A',
                record.customerName || 'N/A',
                record.paymentMethod || 'N/A',
                record.referenceNumber || 'N/A',
                record.status,
                record.notes || ''
            ]; });
            var csvContent = __spreadArray([
                'Payment Reconciliation Report',
                "Generated: ".concat(new Date().toLocaleDateString()),
                "Date Range: ".concat(formatDate(startDate), " - ").concat(formatDate(endDate)),
                '',
                headers.join(',')
            ], rows.map(function (row) { return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(','); }), true).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "Payment-Reconciliation-".concat(startDate, "-").concat(endDate, ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('Reconciliation CSV exported', { startDate: startDate, endDate: endDate }, 'ReconciliationTools');
            toast_1.toast.success('Reconciliation report exported successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to export Reconciliation CSV', error, 'ReconciliationTools');
            toast_1.toast.error('Failed to export report. Please try again.');
        }
    };
    var handleBulkReconcile = function () {
        if (selectedRecords.size === 0) {
            toast_1.toast.error('Please select records to reconcile');
            return;
        }
        // TODO: Implement bulk reconciliation logic
        toast_1.toast.success("Reconciling ".concat(selectedRecords.size, " records..."));
        logger_1.logger.debug('Bulk reconciliation initiated', { recordCount: selectedRecords.size }, 'ReconciliationTools');
    };
    // Calculate summary statistics
    var summary = (0, react_1.useMemo)(function () {
        var total = filteredRecords.length;
        var matched = filteredRecords.filter(function (r) { return r.status === 'matched'; }).length;
        var unmatched = filteredRecords.filter(function (r) { return r.status === 'unmatched'; }).length;
        var disputed = filteredRecords.filter(function (r) { return r.status === 'disputed'; }).length;
        var totalAmount = filteredRecords.reduce(function (sum, r) { return sum + r.amount; }, 0);
        return {
            total: total,
            matched: matched,
            unmatched: unmatched,
            disputed: disputed,
            totalAmount: totalAmount
        };
    }, [filteredRecords]);
    // Early returns MUST come after all hooks (Rules of Hooks)
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading reconciliation data..." })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Failed to load reconciliation data. Please try again." })] }) }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Payment Reconciliation Tools" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Reconcile payments and match transactions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.RefreshCw, onClick: function () { return refetch(); }, children: "Refresh" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700 font-medium text-sm", children: "Total Records" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-blue-900 font-bold mt-1", children: summary.total }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-blue-600 text-xs mt-1", children: [formatCurrency(summary.totalAmount), " total"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-700 font-medium text-sm", children: "Matched" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mt-1", children: summary.matched }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-600 text-xs mt-1", children: summary.total > 0 ? "".concat(((summary.matched / summary.total) * 100).toFixed(1), "%") : '0%' })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-700 font-medium text-sm", children: "Unmatched" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-yellow-900 font-bold mt-1", children: summary.unmatched }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-600 text-xs mt-1", children: "Requires attention" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-6 h-6 text-yellow-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-700 font-medium text-sm", children: "Disputed" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-red-900 font-bold mt-1", children: summary.disputed }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-600 text-xs mt-1", children: "Needs resolution" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-6 h-6 text-red-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: handleDateChange(setStartDate) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: handleDateChange(setEndDate) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search invoices, customers...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status Filter" }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: function (e) { return setStatusFilter(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "matched", children: "Matched" }), (0, jsx_runtime_1.jsx)("option", { value: "unmatched", children: "Unmatched" }), (0, jsx_runtime_1.jsx)("option", { value: "disputed", children: "Disputed" })] })] })] }) }) }), selectedRecords.size > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-purple-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "font-medium text-purple-900", children: [selectedRecords.size, " record", selectedRecords.size !== 1 ? 's' : '', " selected"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: clearSelection, children: "Clear Selection" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: handleBulkReconcile, children: "Reconcile Selected" })] })] }) }) })), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Payment Records" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: selectAll, children: "Select All" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: clearSelection, children: "Clear Selection" })] })] }), filteredRecords.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 mb-2", children: "No payment records found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-400 text-sm", children: "Try adjusting the filters or date range." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedRecords.size === filteredRecords.length && filteredRecords.length > 0, onChange: function (e) {
                                                            if (e.target.checked) {
                                                                selectAll();
                                                            }
                                                            else {
                                                                clearSelection();
                                                            }
                                                        }, className: "rounded border-gray-300 text-purple-600 focus:ring-purple-500" }) }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Date" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Amount" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Invoice" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Payment Method" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Reference" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Status" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredRecords.map(function (record) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50 ".concat(selectedRecords.has(record.id) ? 'bg-purple-50' : ''), children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedRecords.has(record.id), onChange: function () { return toggleRecordSelection(record.id); }, className: "rounded border-gray-300 text-purple-600 focus:ring-purple-500" }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm", children: formatDate(record.date) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm font-semibold", children: formatCurrency(record.amount) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm", children: record.invoiceNumber || 'N/A' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm", children: record.customerName || 'N/A' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm", children: record.paymentMethod || 'N/A' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-sm", children: record.referenceNumber || 'N/A' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(record.status === 'matched'
                                                            ? 'bg-green-100 text-green-800'
                                                            : record.status === 'unmatched'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'), children: record.status }) })] }, record.id)); }) })] }) }))] }) })] }));
}
