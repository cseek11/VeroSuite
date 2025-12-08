"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentConfirmation;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * PaymentConfirmation Component
 *
 * Displays payment success confirmation screen with:
 * - Payment success message
 * - Payment details
 * - Receipt download
 * - Email confirmation notice
 *
 * Last Updated: 2025-11-16
 */
// React import removed (not needed with new JSX transform)
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function PaymentConfirmation(_a) {
    var _b;
    var invoice = _a.invoice, paymentIntent = _a.paymentIntent, paymentMethod = _a.paymentMethod, onDownloadReceipt = _a.onDownloadReceipt, onClose = _a.onClose;
    var handleDownloadReceipt = function () {
        try {
            // Create receipt content
            var receiptContent = "\nPayment Receipt\n================\n\nInvoice Number: ".concat(invoice.invoice_number, "\nPayment Date: ").concat(new Date().toLocaleDateString(), "\nAmount Paid: $").concat(Number(invoice.total_amount).toFixed(2), "\n\n").concat((paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id) ? "Payment Intent ID: ".concat(paymentIntent.id) : '', "\n").concat(paymentMethod ? "Payment Method: ".concat(paymentMethod.payment_name || 'N/A') : '', "\n\nThank you for your payment!\n      ").trim();
            var blob = new Blob([receiptContent], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "Receipt-".concat(invoice.invoice_number, "-").concat(new Date().toISOString().split('T')[0], ".txt");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('Receipt downloaded', { invoiceNumber: invoice.invoice_number }, 'PaymentConfirmation');
            toast_1.toast.success('Receipt downloaded');
            if (onDownloadReceipt) {
                onDownloadReceipt();
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to download receipt', error, 'PaymentConfirmation');
            toast_1.toast.error('Failed to download receipt. Please try again.');
        }
    };
    var handleCopyInvoiceNumber = function () {
        try {
            navigator.clipboard.writeText(invoice.invoice_number);
            toast_1.toast.success('Invoice number copied to clipboard');
        }
        catch (error) {
            logger_1.logger.error('Failed to copy invoice number', error, 'PaymentConfirmation');
            toast_1.toast.error('Failed to copy. Please try again.');
        }
    };
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block mb-6", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-20 h-20 text-green-600 mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-1 -right-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-6 h-6 text-green-500 bg-white rounded-full" }) })] }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "font-bold text-green-800 mb-2", children: "Payment Successful!" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-gray-700 mb-4", children: ["Your payment of $", Number(invoice.total_amount).toFixed(2), " has been processed"] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-6", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 inline mr-1" }), "A confirmation email has been sent to ", ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.email) || 'your email address'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6 mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4 text-green-800", children: "Payment Details" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Invoice Number:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: invoice.invoice_number }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCopyInvoiceNumber, className: "p-1 hover:bg-green-100 rounded transition-colors", title: "Copy invoice number", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-4 h-4 text-gray-600" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Amount Paid:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-bold text-green-800", children: ["$", Number(invoice.total_amount).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Payment Date:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: new Date().toLocaleDateString() })] }), paymentMethod && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Payment Method:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: paymentMethod.payment_name ||
                                                (paymentMethod.card_type && paymentMethod.card_last4
                                                    ? "".concat(paymentMethod.card_type, " ending in ").concat(paymentMethod.card_last4)
                                                    : 'N/A') })] })), (paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Payment Intent ID:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-mono text-xs font-medium", children: [paymentIntent.id.slice(0, 20), "..."] })] })), paymentIntent &&
                                    typeof paymentIntent.charges === 'object' &&
                                    paymentIntent.charges !== null &&
                                    'data' in paymentIntent.charges &&
                                    Array.isArray(paymentIntent.charges.data) &&
                                    paymentIntent.charges.data.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Charge ID:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-mono text-xs font-medium", children: [typeof paymentIntent.charges.data[0] === 'object' &&
                                                    paymentIntent.charges.data[0] !== null &&
                                                    'id' in paymentIntent.charges.data[0] &&
                                                    typeof paymentIntent.charges.data[0].id === 'string'
                                                    ? paymentIntent.charges.data[0].id.slice(0, 20)
                                                    : 'N/A', "..."] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleDownloadReceipt, children: "Download Receipt" }), onClose && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: onClose, children: "Close" }))] })] }) }));
}
