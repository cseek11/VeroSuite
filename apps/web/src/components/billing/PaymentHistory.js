"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentHistory;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function PaymentHistory(_a) {
    var _b, _c, _d, _e;
    var payments = _a.payments, isLoading = _a.isLoading, customerId = _a.customerId;
    var _f = (0, react_1.useState)(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = (0, react_1.useState)('all'), dateFilter = _g[0], setDateFilter = _g[1];
    var _h = (0, react_1.useState)('all'), statusFilter = _h[0], setStatusFilter = _h[1];
    var _j = (0, react_1.useState)(null), selectedPayment = _j[0], setSelectedPayment = _j[1];
    // Determine payment status based on invoice status and payment data
    var getPaymentStatus = function (payment) {
        var _a;
        // If invoice is paid, payment is completed
        if (((_a = payment.Invoice) === null || _a === void 0 ? void 0 : _a.status) === 'paid') {
            return 'completed';
        }
        // If payment has reference number (Stripe transaction ID), it's likely completed
        if (payment.reference_number && payment.reference_number.startsWith('pi_')) {
            return 'completed';
        }
        // If payment date is in the future, it's pending
        var paymentDate = new Date(payment.payment_date);
        if (paymentDate > new Date()) {
            return 'pending';
        }
        // Default to completed if payment exists
        return 'completed';
    };
    // Filter payments based on search, date, and status filters
    var filteredPayments = payments.filter(function (payment) {
        var _a, _b, _c, _d;
        // Search filter
        var matchesSearch = ((_a = payment.reference_number) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((_c = (_b = payment.Invoice) === null || _b === void 0 ? void 0 : _b.invoice_number) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((_d = payment.notes) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchTerm.toLowerCase()));
        // Date filter
        var matchesDate = true;
        if (dateFilter !== 'all') {
            var paymentDate = new Date(payment.payment_date);
            var now = new Date();
            var daysAgo = dateFilter === '30days' ? 30 : dateFilter === '90days' ? 90 : 365;
            var filterDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
            matchesDate = paymentDate >= filterDate;
        }
        // Status filter
        var matchesStatus = statusFilter === 'all' || getPaymentStatus(payment) === statusFilter;
        return matchesSearch && matchesDate && matchesStatus;
    });
    // Calculate totals
    var totalPaid = filteredPayments.reduce(function (sum, payment) { return sum + Number(payment.amount); }, 0);
    var paymentsThisMonth = payments.filter(function (payment) {
        var paymentDate = new Date(payment.payment_date);
        var now = new Date();
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    });
    var totalThisMonth = paymentsThisMonth.reduce(function (sum, payment) { return sum + Number(payment.amount); }, 0);
    var getPaymentMethodDisplay = function (payment) {
        if (payment.payment_methods) {
            return payment.payment_methods.payment_name ||
                "".concat(payment.payment_methods.card_type, " ****").concat(payment.payment_methods.card_last4);
        }
        return 'Payment Method';
    };
    var getStatusBadge = function (payment) {
        var status = getPaymentStatus(payment);
        var statusConfig = {
            completed: {
                variant: 'success',
                icon: lucide_react_1.CheckCircle,
                label: 'Completed',
                className: 'bg-green-100 text-green-800'
            },
            pending: {
                variant: 'warning',
                icon: lucide_react_1.Clock,
                label: 'Pending',
                className: 'bg-yellow-100 text-yellow-800'
            },
            failed: {
                variant: 'error',
                icon: lucide_react_1.XCircle,
                label: 'Failed',
                className: 'bg-red-100 text-red-800'
            },
            refunded: {
                variant: 'info',
                icon: lucide_react_1.AlertCircle,
                label: 'Refunded',
                className: 'bg-blue-100 text-blue-800'
            },
            all: {
                variant: 'info',
                icon: lucide_react_1.History,
                label: 'All',
                className: 'bg-gray-100 text-gray-800'
            }
        };
        var config = status === 'all' ? statusConfig.all : statusConfig[status] || statusConfig.completed;
        var Icon = config.icon;
        return ((0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: config.variant, className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3" }), config.label] }));
    };
    var handleDownloadReceipt = function (payment) {
        var _a;
        try {
            // Generate receipt data
            var receiptData = {
                paymentId: payment.id,
                referenceNumber: payment.reference_number || payment.id.slice(-8),
                invoiceNumber: ((_a = payment.Invoice) === null || _a === void 0 ? void 0 : _a.invoice_number) || 'N/A',
                amount: Number(payment.amount).toFixed(2),
                date: new Date(payment.payment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                paymentMethod: getPaymentMethodDisplay(payment),
                customer: customerId,
                notes: payment.notes || 'N/A'
            };
            // Create receipt text
            var receiptText = "\nPAYMENT RECEIPT\n================\n\nPayment ID: ".concat(receiptData.paymentId, "\nReference Number: ").concat(receiptData.referenceNumber, "\nInvoice Number: ").concat(receiptData.invoiceNumber, "\nAmount Paid: $").concat(receiptData.amount, "\nPayment Date: ").concat(receiptData.date, "\nPayment Method: ").concat(receiptData.paymentMethod, "\nStatus: ").concat(getPaymentStatus(payment).toUpperCase(), "\n\n").concat(receiptData.notes !== 'N/A' ? "Notes: ".concat(receiptData.notes) : '', "\n\nThank you for your payment!\n      ").trim();
            // Create and download file
            var blob = new Blob([receiptText], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "Receipt-".concat(receiptData.referenceNumber, "-").concat(Date.now(), ".txt");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('Receipt downloaded', { paymentId: payment.id }, 'PaymentHistory');
            toast_1.toast.success('Receipt downloaded successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to download receipt', error, 'PaymentHistory');
            toast_1.toast.error('Failed to download receipt. Please try again.');
        }
    };
    var renderPaymentCard = function (payment) {
        var _a;
        return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full flex items-center justify-center ".concat(getPaymentStatus(payment) === 'completed'
                                                ? 'bg-green-100'
                                                : getPaymentStatus(payment) === 'pending'
                                                    ? 'bg-yellow-100'
                                                    : 'bg-red-100'), children: getPaymentStatus(payment) === 'completed' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" })) : getPaymentStatus(payment) === 'pending' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-yellow-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-5 h-5 text-red-600" })) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h4", className: "font-semibold", children: ["Payment #", payment.reference_number || payment.id.slice(-8)] }), getStatusBadge(payment)] }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-gray-600", children: new Date(payment.payment_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Amount Paid" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-lg text-green-800", children: ["$", Number(payment.amount).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Invoice" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: ((_a = payment.Invoice) === null || _a === void 0 ? void 0 : _a.invoice_number) || 'N/A' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Payment Method" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-4 h-4 mr-1" }), getPaymentMethodDisplay(payment)] })] })] }), payment.notes && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-3 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: payment.notes })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2 ml-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Receipt, onClick: function () { return handleDownloadReceipt(payment); }, children: "Receipt" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", icon: lucide_react_1.Eye, onClick: function () { return setSelectedPayment(payment); }, children: "Details" })] })] }) }, payment.id));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-green-700 font-medium", children: "Total Paid" }), (0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h2", className: "text-green-800 font-bold mt-1", children: ["$", totalPaid.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-blue-700 font-medium", children: "This Month" }), (0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h2", className: "text-blue-800 font-bold mt-1", children: ["$", totalThisMonth.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-purple-700 font-medium", children: "Total Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h2", className: "text-purple-800 font-bold mt-1", children: filteredPayments.length })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-6 h-6 text-purple-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "font-semibold", children: "Payment History" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-3 w-full md:w-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search payments...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10 w-full md:w-64" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: function (e) { return setStatusFilter(e.target.value); }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "failed", children: "Failed" }), (0, jsx_runtime_1.jsx)("option", { value: "refunded", children: "Refunded" })] })] }), (0, jsx_runtime_1.jsxs)("select", { value: dateFilter, onChange: function (e) { return setDateFilter(e.target.value); }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Time" }), (0, jsx_runtime_1.jsx)("option", { value: "30days", children: "Last 30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "90days", children: "Last 90 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "1year", children: "Last Year" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, children: "Export" })] })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading payment history..." })] })) : filteredPayments.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h4", className: "text-gray-500 mb-2", children: payments.length === 0 ? 'No payments found' : 'No payments match your filters' }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-gray-400", children: payments.length === 0
                                    ? "You haven't made any payments yet."
                                    : "Try adjusting your search or date filters." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredPayments.map(renderPaymentCard) })) }) }), selectedPayment && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "font-semibold", children: "Payment Details" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: function () { return setSelectedPayment(null); }, children: "\u00D7" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Payment ID" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: selectedPayment.id })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Reference Number" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: selectedPayment.reference_number || 'N/A' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-lg text-green-800", children: ["$", Number(selectedPayment.amount).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Payment Date" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: new Date(selectedPayment.payment_date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Invoice" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: ((_b = selectedPayment.Invoice) === null || _b === void 0 ? void 0 : _b.invoice_number) || 'N/A' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Payment Method" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: ((_c = selectedPayment.payment_methods) === null || _c === void 0 ? void 0 : _c.payment_name) ||
                                                        "".concat((_d = selectedPayment.payment_methods) === null || _d === void 0 ? void 0 : _d.card_type, " ****").concat((_e = selectedPayment.payment_methods) === null || _e === void 0 ? void 0 : _e.card_last4) ||
                                                        'Payment Method' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-1", children: "Status" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: getStatusBadge(selectedPayment) })] })] }), selectedPayment.notes && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-2", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 rounded-lg p-3", children: selectedPayment.notes })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return handleDownloadReceipt(selectedPayment); }, icon: lucide_react_1.Download, children: "Download Receipt" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return setSelectedPayment(null); }, children: "Close" })] })] })] }) }))] }));
}
