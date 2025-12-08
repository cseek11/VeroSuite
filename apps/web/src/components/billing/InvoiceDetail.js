"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InvoiceDetail;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var billing_analytics_1 = require("@/lib/billing-analytics");
var BillingSkeletons_1 = require("./BillingSkeletons");
function InvoiceDetail(_a) {
    var _b, _c, _d, _e;
    var invoice = _a.invoice, onPayNow = _a.onPayNow, onDownloadPDF = _a.onDownloadPDF, _f = _a.showActions, showActions = _f === void 0 ? true : _f, _g = _a.className, className = _g === void 0 ? '' : _g;
    // Track invoice view
    (0, react_1.useEffect)(function () {
        if (invoice === null || invoice === void 0 ? void 0 : invoice.id) {
            (0, billing_analytics_1.trackInvoiceView)(invoice.id);
        }
    }, [invoice === null || invoice === void 0 ? void 0 : invoice.id]);
    // Fetch company settings for display
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['company', 'settings'],
        queryFn: enhanced_api_1.company.getSettings,
    }), companySettings = _h.data, companyLoading = _h.isLoading, companyError = _h.error;
    // Fetch payment history for this invoice
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payments', invoice.id],
        queryFn: function () { return enhanced_api_1.billing.getPayments(invoice.id); },
        enabled: !!invoice.id,
    }), _k = _j.data, payments = _k === void 0 ? [] : _k, paymentsLoading = _j.isLoading, paymentsError = _j.error;
    // Handle errors
    react_1.default.useEffect(function () {
        if (companyError) {
            logger_1.logger.error('Failed to fetch company settings', companyError, 'InvoiceDetail');
        }
    }, [companyError]);
    react_1.default.useEffect(function () {
        if (paymentsError) {
            logger_1.logger.error('Failed to fetch payment history', paymentsError, 'InvoiceDetail');
        }
    }, [paymentsError]);
    if (companyLoading || paymentsLoading) {
        return (0, jsx_runtime_1.jsx)(BillingSkeletons_1.InvoiceDetailSkeleton, {});
    }
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600" });
            case 'sent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-gray-600" });
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
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    var isPayable = invoice.status === 'sent' || invoice.status === 'overdue';
    var isOverdue = invoice.status === 'overdue' ||
        (invoice.status === 'sent' && new Date(invoice.due_date) < new Date());
    // Calculate total paid
    var totalPaid = payments.reduce(function (sum, payment) { return sum + Number(payment.amount); }, 0);
    var remainingBalance = Number(invoice.total_amount) - totalPaid;
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(companySettings === null || companySettings === void 0 ? void 0 : companySettings.invoice_logo_url) && ((0, jsx_runtime_1.jsx)("img", { src: companySettings.invoice_logo_url, alt: "Company Logo", className: "w-auto h-16 max-w-[180px] object-contain mb-4", onError: function (e) {
                                                var target = e.target;
                                                target.style.display = 'none';
                                            } })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "font-bold", children: ["Invoice ", invoice.invoice_number] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getStatusIcon(invoice.status), (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 rounded-full text-sm font-medium border ".concat(getStatusColor(invoice.status)), children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-gray-600", children: ["Issued on ", formatDate(invoice.issue_date)] })] }), showActions && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [onDownloadPDF && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, onClick: function () {
                                                (0, billing_analytics_1.trackInvoiceDownload)(invoice.id);
                                                onDownloadPDF();
                                            }, children: "Download PDF" })), isPayable && onPayNow && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", icon: lucide_react_1.CreditCard, onClick: onPayNow, children: "Pay Now" }))] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-5 h-5 mr-2 text-gray-600" }), "Bill To"] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold mb-2", children: ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Customer' }), ((_c = invoice.accounts) === null || _c === void 0 ? void 0 : _c.address) && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: [invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
                                                                        .filter(Boolean).join(', ') })] }), ((_d = invoice.accounts) === null || _d === void 0 ? void 0 : _d.email) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 mr-2 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: invoice.accounts.email })] })), ((_e = invoice.accounts) === null || _e === void 0 ? void 0 : _e.phone) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 mr-2 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: invoice.accounts.phone })] }))] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 mr-2 text-gray-600" }), "Payment Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Due Date:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold ".concat(isOverdue ? 'text-red-600' : ''), children: formatDate(invoice.due_date) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Invoice Total:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold", children: formatCurrency(Number(invoice.total_amount)) })] }), totalPaid > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Amount Paid:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold text-green-600", children: formatCurrency(totalPaid) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between border-t border-gray-200 pt-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold", children: "Remaining Balance:" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-bold text-orange-600", children: formatCurrency(remainingBalance) })] })] }))] })] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "mb-4", children: "Invoice Items" }), !invoice.InvoiceItem || invoice.InvoiceItem.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "No items found" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Description" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Quantity" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Unit Price" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Total" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: invoice.InvoiceItem.map(function (item) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: item.description }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: item.quantity }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatCurrency(item.unit_price) }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold", children: formatCurrency(item.total_price) }) })] }, item.id)); }) }), (0, jsx_runtime_1.jsxs)("tfoot", { children: [(0, jsx_runtime_1.jsxs)("tr", { className: "border-t-2 border-gray-300", children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-3 px-4 text-right font-semibold", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Subtotal:" }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right font-semibold", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatCurrency(Number(invoice.subtotal)) }) })] }), Number(invoice.tax_amount) > 0 && ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Tax:" }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatCurrency(Number(invoice.tax_amount)) }) })] })), (0, jsx_runtime_1.jsxs)("tr", { className: "bg-purple-50", children: [(0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-3 px-4 text-right font-bold", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Total:" }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right font-bold", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-purple-600", children: formatCurrency(Number(invoice.total_amount)) }) })] })] })] }) }))] }) }), payments.length > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "w-5 h-5 mr-2" }), "Payment History"] }), paymentsLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-6 h-6 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "ml-3 text-gray-600", children: "Loading payment history..." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: payments.map(function (payment) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold", children: formatCurrency(Number(payment.amount)) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Paid on ", formatDate(payment.payment_date)] }), payment.payment_methods && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: ["via ", payment.payment_methods.payment_name || payment.payment_methods.payment_type] }))] })] }), payment.reference_number && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: ["Ref: ", payment.reference_number] }))] }, payment.id)); }) }))] }) })), invoice.notes && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "mb-3", children: "Notes" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 whitespace-pre-wrap", children: invoice.notes })] }) }))] }));
}
