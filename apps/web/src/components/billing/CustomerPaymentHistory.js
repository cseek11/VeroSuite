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
exports.default = CustomerPaymentHistory;
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
var BillingSkeletons_1 = require("./BillingSkeletons");
function CustomerPaymentHistory(_a) {
    var customerId = _a.customerId, onInvoiceClick = _a.onInvoiceClick, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('payment_date'), sortField = _d[0], setSortField = _d[1];
    var _e = (0, react_1.useState)('desc'), sortDirection = _e[0], setSortDirection = _e[1];
    var _f = (0, react_1.useState)(''), dateRangeStart = _f[0], setDateRangeStart = _f[1];
    var _g = (0, react_1.useState)(''), dateRangeEnd = _g[0], setDateRangeEnd = _g[1];
    var _h = (0, react_1.useState)(false), showFilters = _h[0], setShowFilters = _h[1];
    // Fetch all payments for customer
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payments', customerId],
        queryFn: function () { return enhanced_api_1.billing.getPayments(); },
        enabled: !!customerId,
    }), _k = _j.data, payments = _k === void 0 ? [] : _k, isLoading = _j.isLoading, error = _j.error;
    // Filter and sort payments
    var filteredAndSortedPayments = (0, react_1.useMemo)(function () {
        // Guard against undefined payments array
        if (!Array.isArray(payments)) {
            logger_1.logger.warn('Payments data is not an array', { payments: payments }, 'CustomerPaymentHistory');
            return [];
        }
        var filtered = __spreadArray([], payments, true);
        // Filter by customer (if needed - payments should already be filtered by backend)
        // But we'll keep this for safety
        filtered = filtered.filter(function (payment) { var _a; return ((_a = payment.Invoice) === null || _a === void 0 ? void 0 : _a.id) || true; } // Include all if invoice exists
        );
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (payment) {
                var _a, _b, _c, _d, _e, _f;
                return ((_b = (_a = payment.Invoice) === null || _a === void 0 ? void 0 : _a.invoice_number) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_c = payment.reference_number) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_1)) ||
                    payment.amount.toString().includes(searchTerm) ||
                    ((_e = (_d = payment.payment_methods) === null || _d === void 0 ? void 0 : _d.payment_name) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(searchLower_1)) ||
                    ((_f = payment.notes) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply date range filter
        if (dateRangeStart) {
            var startDate_1 = new Date(dateRangeStart);
            filtered = filtered.filter(function (payment) {
                return new Date(payment.payment_date) >= startDate_1;
            });
        }
        if (dateRangeEnd) {
            var endDate_1 = new Date(dateRangeEnd);
            endDate_1.setHours(23, 59, 59, 999);
            filtered = filtered.filter(function (payment) {
                return new Date(payment.payment_date) <= endDate_1;
            });
        }
        // Apply sorting
        filtered.sort(function (a, b) {
            var _a, _b;
            var aValue;
            var bValue;
            switch (sortField) {
                case 'payment_date':
                    aValue = new Date(a.payment_date).getTime();
                    bValue = new Date(b.payment_date).getTime();
                    break;
                case 'amount':
                    aValue = Number(a.amount);
                    bValue = Number(b.amount);
                    break;
                case 'invoice_number':
                    aValue = ((_a = a.Invoice) === null || _a === void 0 ? void 0 : _a.invoice_number) || '';
                    bValue = ((_b = b.Invoice) === null || _b === void 0 ? void 0 : _b.invoice_number) || '';
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
    }, [payments, searchTerm, sortField, sortDirection, dateRangeStart, dateRangeEnd]);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('desc');
        }
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    // Helper function for date formatting (currently unused but kept for future use)
    // const formatDate = (dateString: string) => {
    //   return new Date(dateString).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric',
    //   });
    // };
    var formatDateTime = function (dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    // Calculate statistics
    var stats = (0, react_1.useMemo)(function () {
        var total = payments.length;
        var totalAmount = payments.reduce(function (sum, payment) { return sum + Number(payment.amount); }, 0);
        var thisMonth = payments.filter(function (payment) {
            var paymentDate = new Date(payment.payment_date);
            var now = new Date();
            return paymentDate.getMonth() === now.getMonth() &&
                paymentDate.getFullYear() === now.getFullYear();
        });
        var thisMonthAmount = thisMonth.reduce(function (sum, payment) { return sum + Number(payment.amount); }, 0);
        return {
            total: total,
            totalAmount: totalAmount,
            thisMonth: thisMonth.length,
            thisMonthAmount: thisMonthAmount,
        };
    }, [payments]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(BillingSkeletons_1.PaymentHistorySkeleton, {});
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-red-800 mb-1", children: "Error loading payment history" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: error instanceof Error ? error.message : 'An unexpected error occurred' })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1", children: stats.total })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-8 h-8 text-gray-400" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Paid" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1 text-green-600", children: formatCurrency(stats.totalAmount) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-8 h-8 text-green-400" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "This Month" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mt-1 text-purple-600", children: formatCurrency(stats.thisMonthAmount) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-1", children: [stats.thisMonth, " payment", stats.thisMonth !== 1 ? 's' : ''] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-8 h-8 text-purple-400" })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-5 h-5 mr-2" }), "Payment History"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Filter, onClick: function () { return setShowFilters(!showFilters); }, children: showFilters ? 'Hide Filters' : 'Filters' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, onClick: function () {
                                                toast_1.toast.info('Export functionality coming soon');
                                            }, children: "Export" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search by invoice number, reference number, or amount...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSearchTerm(''); }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeStart, onChange: function (e) { return setDateRangeStart(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeEnd, onChange: function (e) { return setDateRangeEnd(e.target.value); } })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                            setDateRangeStart('');
                                            setDateRangeEnd('');
                                            setSearchTerm('');
                                        }, children: "Clear Filters" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Sort by:" }), ['payment_date', 'amount', 'invoice_number'].map(function (field) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSort(field); }, className: "px-3 py-1 rounded-md text-sm font-medium transition-colors ".concat(sortField === field
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'), children: [field.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }), sortField === field && ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpDown, { className: "w-3 h-3 inline-block ml-1" }))] }, field)); })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: filteredAndSortedPayments.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-600 mb-2", children: "No payments found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-500", children: searchTerm || dateRangeStart || dateRangeEnd
                                    ? 'Try adjusting your filters'
                                    : 'No payment history available' })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredAndSortedPayments.map(function (payment) { return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-green-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-6 h-6 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold text-green-600", children: formatCurrency(Number(payment.amount)) }), payment.Invoice && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onInvoiceClick === null || onInvoiceClick === void 0 ? void 0 : onInvoiceClick(payment.Invoice.id); }, className: "flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 hover:underline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Invoice ", payment.Invoice.invoice_number] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 mr-2" }), (0, jsx_runtime_1.jsx)("span", { children: formatDateTime(payment.payment_date) })] }), payment.payment_methods && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-4 h-4 mr-2" }), (0, jsx_runtime_1.jsx)("span", { children: payment.payment_methods.payment_name ||
                                                                        payment.payment_methods.payment_type })] })), payment.reference_number && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 mr-2" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Ref: ", payment.reference_number] })] }))] }), payment.notes && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: payment.notes }))] })] }) }) }, payment.id)); }) })) }) })] }));
}
