"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = CustomerPaymentPortal;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var billing_analytics_1 = require("@/lib/billing-analytics");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var InvoiceViewer_1 = __importDefault(require("./InvoiceViewer"));
var PaymentForm_1 = __importDefault(require("./PaymentForm"));
var InvoiceList_1 = __importDefault(require("./InvoiceList"));
var InvoiceDetail_1 = __importDefault(require("./InvoiceDetail"));
var PaymentMethodManager_1 = __importDefault(require("./PaymentMethodManager"));
var CustomerPaymentHistory_1 = __importDefault(require("./CustomerPaymentHistory"));
var BillingErrorBoundary_1 = require("./BillingErrorBoundary");
function CustomerPaymentPortal(_a) {
    var _this = this;
    var customerId = _a.customerId, onClose = _a.onClose;
    var _b = (0, react_1.useState)('invoices'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(null), selectedInvoice = _c[0], setSelectedInvoice = _c[1];
    var _d = (0, react_1.useState)(false), showPaymentForm = _d[0], setShowPaymentForm = _d[1];
    var _e = (0, react_1.useState)(false), showInvoiceDetail = _e[0], setShowInvoiceDetail = _e[1];
    var _f = (0, react_1.useState)(false), showInvoiceViewer = _f[0], setShowInvoiceViewer = _f[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch customer invoices (for finding invoice by ID in handlers)
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'invoices', customerId],
        queryFn: function () { return enhanced_api_1.billing.getInvoices(customerId); },
        enabled: !!customerId,
        retry: 2,
        retryDelay: function (attemptIndex) { return Math.min(1000 * Math.pow(2, attemptIndex), 30000); },
    }), _h = _g.data, invoices = _h === void 0 ? [] : _h, invoicesError = _g.error, invoicesLoading = _g.isLoading;
    // Fetch payment methods
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-methods', customerId],
        queryFn: function () { return enhanced_api_1.billing.getPaymentMethods(customerId); },
        enabled: !!customerId,
        retry: 2,
        retryDelay: function (attemptIndex) { return Math.min(1000 * Math.pow(2, attemptIndex), 30000); },
    }), _k = _j.data, paymentMethods = _k === void 0 ? [] : _k, paymentMethodsError = _j.error, paymentMethodsLoading = _j.isLoading;
    // Handle payment methods error
    if (paymentMethodsError) {
        var errorMessage = paymentMethodsError instanceof Error ? paymentMethodsError.message : 'Failed to load payment methods';
        logger_1.logger.error('Failed to fetch payment methods', paymentMethodsError, 'CustomerPaymentPortal');
        toast_1.toast.error("Unable to load payment methods. ".concat(errorMessage, ". Please try again or contact support."));
    }
    // Calculate outstanding balance
    var outstandingInvoices = invoices.filter(function (invoice) {
        return invoice.status === 'sent' || invoice.status === 'overdue';
    });
    var totalOutstanding = outstandingInvoices.reduce(function (sum, invoice) {
        return sum + Number(invoice.total_amount);
    }, 0);
    // Get overdue invoices
    var overdueInvoices = invoices.filter(function (invoice) {
        if (invoice.status !== 'sent' && invoice.status !== 'overdue')
            return false;
        return new Date(invoice.due_date) < new Date();
    });
    var handlePaymentSuccess = function () {
        setShowPaymentForm(false);
        setSelectedInvoice(null);
        queryClient.invalidateQueries({ queryKey: ['billing'] });
        setActiveTab('history');
    };
    var handleInvoiceSelect = function (invoice) {
        setSelectedInvoice(invoice);
        setShowInvoiceDetail(true);
    };
    var handleInvoicePay = function (invoice) {
        (0, billing_analytics_1.trackPaymentInitiated)(invoice.id, Number(invoice.total_amount), undefined, customerId);
        setSelectedInvoice(invoice);
        setShowPaymentForm(true);
        setActiveTab('payment');
    };
    var handleInvoiceView = function (invoice) {
        setSelectedInvoice(invoice);
        setShowInvoiceViewer(true);
    };
    var handleDownloadPDF = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (selectedInvoice) {
                // Trigger PDF download from InvoiceViewer
                setShowInvoiceViewer(true);
            }
            return [2 /*return*/];
        });
    }); };
    var tabs = [
        {
            id: 'invoices',
            label: 'Invoices',
            icon: lucide_react_1.FileText,
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [totalOutstanding > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-l-4 border-l-orange-500 bg-orange-50", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h4", className: "text-orange-800 font-semibold", children: "Outstanding Balance" }), (0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h2", className: "text-orange-900 font-bold mt-2", children: ["$", totalOutstanding.toFixed(2)] }), (0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "body2", className: "text-orange-700 mt-1", children: [outstandingInvoices.length, " unpaid invoice", outstandingInvoices.length !== 1 ? 's' : '', overdueInvoices.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-red-600 font-medium", children: [' • ', overdueInvoices.length, " overdue"] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "lg", icon: lucide_react_1.CreditCard, onClick: function () { return setActiveTab('payment'); }, className: "shadow-lg", children: "Pay Now" }) })] }) }) })), invoicesError ? ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-red-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5 text-red-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-3 flex-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-red-800 mb-2", children: "Failed to Load Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-700 mb-4", children: invoicesError instanceof Error ? invoicesError.message : 'Unable to load invoices. Please try refreshing the page or contact support.' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return queryClient.invalidateQueries({ queryKey: ['billing', 'invoices', customerId] }); }, children: "Retry" })] })] }) }) })) : ((0, jsx_runtime_1.jsx)(InvoiceList_1.default, { customerId: customerId, onInvoiceSelect: handleInvoiceSelect, onInvoicePay: handleInvoicePay, showActions: true }))] }))
        },
        {
            id: 'payment',
            label: 'Make Payment',
            icon: lucide_react_1.CreditCard,
            component: ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: showPaymentForm && selectedInvoice ? ((0, jsx_runtime_1.jsx)(PaymentForm_1.default, { invoice: selectedInvoice, paymentMethods: paymentMethods, onSuccess: handlePaymentSuccess, onCancel: function () {
                        setShowPaymentForm(false);
                        setSelectedInvoice(null);
                        setActiveTab('invoices');
                    } })) : ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h4", className: "text-gray-500 mb-2", children: "Select an invoice to pay" }), (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "body2", className: "text-gray-400 mb-4", children: "Go to the Invoices tab to select an invoice for payment." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return setActiveTab('invoices'); }, children: "View Invoices" })] }) }) })) }))
        },
        {
            id: 'history',
            label: 'Payment History',
            icon: lucide_react_1.History,
            component: ((0, jsx_runtime_1.jsx)(CustomerPaymentHistory_1.default, { customerId: customerId, onInvoiceClick: function (invoiceId) {
                    var invoice = invoices.find(function (inv) { return inv.id === invoiceId; });
                    if (invoice) {
                        handleInvoiceView(invoice);
                    }
                } }))
        },
        {
            id: 'payment-methods',
            label: 'Payment Methods',
            icon: lucide_react_1.Settings,
            component: ((0, jsx_runtime_1.jsx)("div", { children: paymentMethodsError ? ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-red-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5 text-red-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-3 flex-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-red-800 mb-2", children: "Failed to Load Payment Methods" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-700 mb-4", children: paymentMethodsError instanceof Error ? paymentMethodsError.message : 'Unable to load payment methods. Please try refreshing the page or contact support.' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods', customerId] }); }, children: "Retry" })] })] }) }) })) : ((0, jsx_runtime_1.jsx)(PaymentMethodManager_1.default, { customerId: customerId, onPaymentMethodSelected: function () {
                        // When a payment method is selected, switch to payment tab
                        setActiveTab('payment');
                    } })) }))
        }
    ];
    // Show loading state while initial data is being fetched
    if (invoicesLoading || paymentMethodsLoading) {
        return ((0, jsx_runtime_1.jsx)(BillingErrorBoundary_1.BillingErrorBoundary, __assign({ context: "CustomerPaymentPortal" }, (onClose ? { onBack: onClose } : {}), { children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full", children: [onClose && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.ArrowLeft, onClick: onClose, children: "Back" }) })), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600", children: "Loading customer billing information..." })] }) })] }) })));
    }
    return ((0, jsx_runtime_1.jsx)(BillingErrorBoundary_1.BillingErrorBoundary, __assign({ context: "CustomerPaymentPortal" }, (onClose ? { onBack: onClose } : {}), { children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full", children: [onClose && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.ArrowLeft, onClick: onClose, children: "Back" }) })), (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); }, children: [(0, jsx_runtime_1.jsx)(ui_1.TabsList, { children: tabs.map(function (tab) { return ((0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: tab.id, children: [tab.icon && (0, jsx_runtime_1.jsx)(tab.icon, { className: "w-4 h-4 mr-2" }), tab.label] }, tab.id)); }) }), tabs.map(function (tab) { return ((0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: tab.id, children: tab.component }, tab.id)); })] }), showInvoiceDetail && selectedInvoice && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Invoice Details" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setShowInvoiceDetail(false);
                                            setSelectedInvoice(null);
                                        }, className: "p-2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: selectedInvoice, onPayNow: function () {
                                        setShowInvoiceDetail(false);
                                        handleInvoicePay(selectedInvoice);
                                    }, onDownloadPDF: handleDownloadPDF, showActions: true }) })] }) })), showInvoiceViewer && selectedInvoice && ((0, jsx_runtime_1.jsx)(InvoiceViewer_1.default, { invoice: selectedInvoice, isOpen: showInvoiceViewer, onClose: function () {
                        setShowInvoiceViewer(false);
                        setSelectedInvoice(null);
                    }, onPayNow: function () {
                        setShowInvoiceViewer(false);
                        handleInvoicePay(selectedInvoice);
                    } }))] }) })));
}
