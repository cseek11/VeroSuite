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
exports.default = InvoiceView;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Invoice View Component
 * Comprehensive invoice viewing interface with list, detail, and actions
 *
 * Last Updated: 2025-12-07
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Dialog_1 = require("@/components/ui/Dialog");
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var InvoiceList_1 = __importDefault(require("./InvoiceList"));
var InvoiceDetail_1 = __importDefault(require("./InvoiceDetail"));
var InvoiceViewer_1 = __importDefault(require("./InvoiceViewer"));
var PaymentForm_1 = __importDefault(require("./PaymentForm"));
var BillingSkeletons_1 = require("./BillingSkeletons");
function InvoiceView(_a) {
    var _this = this;
    var customerId = _a.customerId, initialInvoiceId = _a.initialInvoiceId, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(null), selectedInvoice = _c[0], setSelectedInvoice = _c[1];
    var _d = (0, react_1.useState)('list'), viewMode = _d[0], setViewMode = _d[1];
    var _e = (0, react_1.useState)(false), showPaymentForm = _e[0], setShowPaymentForm = _e[1];
    var _f = (0, react_1.useState)('all'), statusFilter = _f[0], setStatusFilter = _f[1];
    var _g = (0, react_1.useState)(''), searchTerm = _g[0], setSearchTerm = _g[1];
    // Fetch invoices
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'invoices', customerId || 'all'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.billing.getInvoices(customerId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) ? result : []];
                }
            });
        }); },
    }), invoicesData = _h.data, isLoading = _h.isLoading, error = _h.error, refetch = _h.refetch;
    if (error) {
        logger_1.logger.error('Failed to fetch invoices', error, 'InvoiceView');
        toast_1.toast.error('Failed to load invoices. Please try again.');
    }
    var invoices = Array.isArray(invoicesData) ? invoicesData : [];
    // Fetch payment methods for payment form
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-methods', customerId || 'all'],
        queryFn: function () { return enhanced_api_1.billing.getPaymentMethods(customerId); },
        enabled: showPaymentForm && !!selectedInvoice,
    }).data, paymentMethods = _j === void 0 ? [] : _j;
    // Set initial invoice if provided
    (0, react_1.useEffect)(function () {
        if (initialInvoiceId && invoices.length > 0 && !selectedInvoice) {
            var invoice = invoices.find(function (inv) { return inv.id === initialInvoiceId; });
            if (invoice) {
                setSelectedInvoice(invoice);
                setViewMode('detail');
            }
        }
    }, [initialInvoiceId, invoices, selectedInvoice]);
    // Filter invoices based on search and status
    var filteredInvoices = (0, react_1.useMemo)(function () {
        if (!Array.isArray(invoices)) {
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
                var _a, _b;
                return invoice.invoice_number.toLowerCase().includes(searchLower_1) ||
                    ((_b = (_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    invoice.total_amount.toString().includes(searchTerm);
            });
        }
        return filtered;
    }, [invoices, statusFilter, searchTerm]);
    var handleInvoiceSelect = function (invoice) {
        setSelectedInvoice(invoice);
        setViewMode('detail');
    };
    // const _handleViewInvoice = (invoice: Invoice) => {
    //   setSelectedInvoice(invoice);
    //   setViewMode('viewer');
    // };
    var handlePayInvoice = function (invoice) {
        setSelectedInvoice(invoice);
        setShowPaymentForm(true);
    };
    var handlePaymentSuccess = function () {
        setShowPaymentForm(false);
        setSelectedInvoice(null);
        refetch();
        toast_1.toast.success('Payment processed successfully');
    };
    var handlePaymentCancel = function () {
        setShowPaymentForm(false);
    };
    var handleBackToList = function () {
        setViewMode('list');
        setSelectedInvoice(null);
    };
    var handleDownloadPDF = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!selectedInvoice)
                return [2 /*return*/];
            try {
                // Use InvoiceViewer's PDF download functionality
                // This will be handled by the InvoiceViewer component
                toast_1.toast.info('Preparing PDF download...');
            }
            catch (error) {
                logger_1.logger.error('Failed to download PDF', error, 'InvoiceView');
                toast_1.toast.error('Failed to download invoice PDF');
            }
            return [2 /*return*/];
        });
    }); };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: className, children: (0, jsx_runtime_1.jsx)(BillingSkeletons_1.InvoiceListSkeleton, {}) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "mb-2", children: "Failed to Load Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mb-4", children: "There was an error loading invoices. Please try again." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return refetch(); }, children: "Retry" })] }) }));
    }
    // Detail/Viewer Mode
    if (viewMode === 'detail' && selectedInvoice) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.ArrowLeft, onClick: handleBackToList, children: "Back to Invoices" }) }), (0, jsx_runtime_1.jsx)(InvoiceDetail_1.default, { invoice: selectedInvoice, onPayNow: function () { return handlePayInvoice(selectedInvoice); }, onDownloadPDF: handleDownloadPDF, showActions: true })] }));
    }
    // Viewer Mode (Modal)
    if (viewMode === 'viewer' && selectedInvoice) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(InvoiceViewer_1.default, { invoice: selectedInvoice, isOpen: true, onClose: handleBackToList, onPayNow: function () {
                    setViewMode('list');
                    handlePayInvoice(selectedInvoice);
                } }) }));
    }
    // List Mode (Default)
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4 sm:p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mb-2", children: "Invoices" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-gray-600", children: [filteredInvoices.length, " ", filteredInvoices.length === 1 ? 'invoice' : 'invoices', " found"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2 w-full sm:w-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 sm:flex-initial min-w-[200px]", children: (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search invoices...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, icon: lucide_react_1.Search }) }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: function (e) { return setStatusFilter(e.target.value); }, className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "draft", children: "Draft" }), (0, jsx_runtime_1.jsx)("option", { value: "sent", children: "Sent" }), (0, jsx_runtime_1.jsx)("option", { value: "paid", children: "Paid" }), (0, jsx_runtime_1.jsx)("option", { value: "overdue", children: "Overdue" })] })] })] }) }) }), (0, jsx_runtime_1.jsx)(InvoiceList_1.default, __assign({}, (customerId ? { customerId: customerId } : {}), { onInvoiceSelect: handleInvoiceSelect, onInvoicePay: handlePayInvoice, showActions: true })), showPaymentForm && selectedInvoice && ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showPaymentForm, onOpenChange: setShowPaymentForm, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { children: ["Pay Invoice ", selectedInvoice.invoice_number] }) }), (0, jsx_runtime_1.jsx)(PaymentForm_1.default, { invoice: selectedInvoice, paymentMethods: paymentMethods, onSuccess: handlePaymentSuccess, onCancel: handlePaymentCancel })] }) }))] }));
}
