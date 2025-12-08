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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var CustomerBilling = function (_a) {
    var customer = _a.customer;
    var _b = (0, react_1.useState)('overview'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(false), showAddPaymentMethod = _c[0], setShowAddPaymentMethod = _c[1];
    var _d = (0, react_1.useState)(null), selectedInvoice = _d[0], setSelectedInvoice = _d[1];
    var _e = (0, react_1.useState)(false), showInvoiceDetails = _e[0], setShowInvoiceDetails = _e[1];
    var _f = (0, react_1.useState)([]), invoices = _f[0], setInvoices = _f[1];
    var _g = (0, react_1.useState)([]), payments = _g[0], setPayments = _g[1];
    var _h = (0, react_1.useState)([]), paymentMethods = _h[0], setPaymentMethods = _h[1];
    var _j = (0, react_1.useState)(true), loading = _j[0], setLoading = _j[1];
    var _k = (0, react_1.useState)(null), error = _k[0], setError = _k[1];
    // Load customer billing data
    (0, react_1.useEffect)(function () {
        var loadCustomerBillingData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, invoicesData_1, paymentsData, paymentMethodsData, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, Promise.all([
                                enhanced_api_1.enhancedApi.billing.getInvoices(customer.id),
                                enhanced_api_1.enhancedApi.billing.getPayments(),
                                enhanced_api_1.enhancedApi.billing.getPaymentMethods(customer.id)
                            ])];
                    case 1:
                        _a = _b.sent(), invoicesData_1 = _a[0], paymentsData = _a[1], paymentMethodsData = _a[2];
                        setInvoices(invoicesData_1);
                        setPayments(paymentsData.filter(function (payment) {
                            return invoicesData_1.some(function (invoice) { return invoice.id === payment.invoice_id; });
                        }));
                        setPaymentMethods(paymentMethodsData);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        logger_1.logger.error('Error loading customer billing data', err_1, 'CustomerBilling');
                        setError(err_1 instanceof Error ? err_1.message : 'Failed to load billing data');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (customer.id) {
            loadCustomerBillingData();
        }
    }, [customer.id]);
    // Calculate billing statistics
    var billingStats = (0, react_1.useMemo)(function () {
        var totalInvoiced = invoices.reduce(function (sum, inv) { return sum + (inv.total_amount || 0); }, 0);
        var totalPaid = payments.reduce(function (sum, payment) { return sum + payment.amount; }, 0);
        var outstanding = totalInvoiced - totalPaid;
        var overdue = invoices.filter(function (inv) { return inv.status === 'overdue'; }).reduce(function (sum, inv) {
            var paidForInvoice = payments
                .filter(function (p) { return p.invoice_id === inv.id; })
                .reduce(function (sum, p) { return sum + p.amount; }, 0);
            return sum + ((inv.total_amount || 0) - paidForInvoice);
        }, 0);
        var paidInvoices = invoices.filter(function (inv) { return inv.status === 'paid'; }).length;
        var overdueInvoices = invoices.filter(function (inv) { return inv.status === 'overdue'; }).length;
        return {
            totalInvoiced: totalInvoiced,
            totalPaid: totalPaid,
            outstanding: outstanding,
            overdue: overdue,
            paidInvoices: paidInvoices,
            overdueInvoices: overdueInvoices,
            totalInvoices: invoices.length
        };
    }, [invoices, payments]);
    var getStatusBadge = function (status) {
        switch (status) {
            case 'draft':
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", children: "Draft" });
            case 'sent':
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "secondary", children: "Sent" });
            case 'paid':
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "service-status-completed", children: "Paid" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "destructive", className: "service-status-cancelled", children: "Overdue" });
            case 'cancelled':
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "destructive", children: "Cancelled" });
            default:
                return (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", children: status });
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    var openInvoiceDetails = function (invoice) {
        setSelectedInvoice(invoice);
        setShowInvoiceDetails(true);
    };
    // Show loading state
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Loading billing data..." })] }) }) }));
    }
    // Show error state
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-8 w-8 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Error Loading Billing Data" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: error }), (0, jsx_runtime_1.jsx)(ui_1.Button, { onClick: function () { return window.location.reload(); }, variant: "outline", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "billing-overview", children: [(0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "billing-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "billing-amount", children: formatCurrency(billingStats.outstanding) }), (0, jsx_runtime_1.jsx)("div", { className: "billing-label", children: "Outstanding Balance" }), billingStats.outstanding > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "billing-status billing-status-overdue", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), billingStats.overdueInvoices, " overdue invoices"] }))] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "billing-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "billing-amount", children: formatCurrency(billingStats.totalPaid) }), (0, jsx_runtime_1.jsx)("div", { className: "billing-label", children: "Total Paid" }), (0, jsx_runtime_1.jsxs)("div", { className: "billing-status billing-status-current", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), billingStats.paidInvoices, " paid invoices"] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "billing-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "billing-amount", children: billingStats.totalInvoices }), (0, jsx_runtime_1.jsx)("div", { className: "billing-label", children: "Total Invoices" }), (0, jsx_runtime_1.jsxs)("div", { className: "billing-status billing-status-current", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), billingStats.overdueInvoices, " overdue"] })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [(0, jsx_runtime_1.jsxs)(ui_1.TabsList, { className: "grid w-full grid-cols-3", children: [(0, jsx_runtime_1.jsx)(ui_1.TabsTrigger, { value: "overview", children: "Overview" }), (0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "invoices", children: ["Invoices (", invoices.length, ")"] }), (0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "payments", children: ["Payment Methods (", paymentMethods.length, ")"] })] }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "overview", className: "mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "mb-4", children: "Recent Billing Activity" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: invoices.slice(0, 5).map(function (invoice) {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: invoice.invoice_number }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: ((_b = (_a = invoice.InvoiceItem) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) || 'Service' }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: formatDate(invoice.issue_date) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: formatCurrency(invoice.total_amount) }), getStatusBadge(invoice.status)] })] }, invoice.id));
                                            }) })] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", children: "Payment Methods" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { size: "sm", variant: "outline", onClick: function () { return setShowAddPaymentMethod(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-2" }), "Add Method"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: paymentMethods.map(function (method) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: method.payment_name || 'Payment Method' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: method.payment_type === 'credit_card' ? "".concat(method.card_type, " \u2022\u2022\u2022\u2022 ").concat(method.card_last4) : method.payment_type })] })] }), method.is_default && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "secondary", children: "Default" }))] }, method.id)); }) })] })] }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "invoices", className: "mt-6", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: invoices.map(function (invoice) {
                                var _a, _b;
                                var paidAmount = payments
                                    .filter(function (p) { return p.invoice_id === invoice.id; })
                                    .reduce(function (sum, p) { return sum + p.amount; }, 0);
                                return ((0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "invoice-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "invoice-header", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "invoice-number", children: invoice.invoice_number }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: ((_b = (_a = invoice.InvoiceItem) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) || 'Service' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "invoice-amount", children: formatCurrency(invoice.total_amount) }), getStatusBadge(invoice.status)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "invoice-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Issued: ", formatDate(invoice.issue_date)] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Due: ", formatDate(invoice.due_date)] }), paidAmount > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Paid: ", formatCurrency(paidAmount)] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", variant: "outline", onClick: function () { return openInvoiceDetails(invoice); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }) })] })] })] }, invoice.id));
                            }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "payments", className: "mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", children: "Payment Methods" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "default", onClick: function () { return setShowAddPaymentMethod(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-2" }), "Add Payment Method"] })] }), paymentMethods.map(function (method) { return ((0, jsx_runtime_1.jsx)(ui_1.Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-8 bg-gray-200 rounded flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-gray-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: method.payment_name || 'Payment Method' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: method.payment_type === 'credit_card' ? "".concat(method.card_type, " \u2022\u2022\u2022\u2022 ").concat(method.card_last4) : method.payment_type }), method.card_expiry && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Expires ", method.card_expiry] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [method.is_default && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "secondary", children: "Default" })), (0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", variant: "outline", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                                            var updatedMethods, err_2;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        _a.trys.push([0, 3, , 4]);
                                                                        return [4 /*yield*/, enhanced_api_1.enhancedApi.billing.deletePaymentMethod(method.id)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [4 /*yield*/, enhanced_api_1.enhancedApi.billing.getPaymentMethods(customer.id)];
                                                                    case 2:
                                                                        updatedMethods = _a.sent();
                                                                        setPaymentMethods(updatedMethods);
                                                                        return [3 /*break*/, 4];
                                                                    case 3:
                                                                        err_2 = _a.sent();
                                                                        logger_1.logger.error('Error deleting payment method', err_2, 'CustomerBilling');
                                                                        return [3 /*break*/, 4];
                                                                    case 4: return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] })] }) }, method.id)); })] }) })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showInvoiceDetails, onOpenChange: setShowInvoiceDetails, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Invoice Details" }) }), selectedInvoice && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Invoice Number" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1 font-medium", children: selectedInvoice.invoice_number })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Status" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1", children: getStatusBadge(selectedInvoice.status) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Issue Date" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1", children: formatDate(selectedInvoice.issue_date) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Due Date" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1", children: formatDate(selectedInvoice.due_date) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Total Amount" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1 font-semibold text-lg", children: formatCurrency(selectedInvoice.total_amount || 0) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Paid Amount" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1", children: formatCurrency(payments
                                                        .filter(function (p) { return p.invoice_id === selectedInvoice.id; })
                                                        .reduce(function (sum, p) { return sum + p.amount; }, 0)) })] })] }), selectedInvoice.InvoiceItem && selectedInvoice.InvoiceItem.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-600", children: "Invoice Items" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 space-y-2", children: selectedInvoice.InvoiceItem.map(function (item) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: item.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Qty: ", item.quantity] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: formatCurrency(item.unit_price) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Total: ", formatCurrency(item.total_price)] })] })] }, item.id)); }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 pt-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", onClick: function () { return setShowInvoiceDetails(false); }, children: "Close" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Download PDF"] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "default", children: "Send Invoice" })] })] }))] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showAddPaymentMethod, onOpenChange: setShowAddPaymentMethod, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Add Payment Method" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Payment Type" }), (0, jsx_runtime_1.jsxs)(ui_1.Select, { children: [(0, jsx_runtime_1.jsx)(ui_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(ui_1.SelectValue, { placeholder: "Select payment type" }) }), (0, jsx_runtime_1.jsxs)(ui_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "card", children: "Credit/Debit Card" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "ach", children: "Bank Account (ACH)" }), (0, jsx_runtime_1.jsx)(ui_1.SelectItem, { value: "check", children: "Check" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Card Number" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "1234 5678 9012 3456" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Expiry Date" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "MM/YY" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "CVV" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "123" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Name on Card" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "John Doe" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "default" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "default", className: "text-sm", children: "Set as default payment method" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 mt-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", onClick: function () { return setShowAddPaymentMethod(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { children: "Add Payment Method" })] })] }) })] }));
};
exports.default = CustomerBilling;
