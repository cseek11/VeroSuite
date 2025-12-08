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
exports.default = RecurringPayments;
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
function RecurringPayments() {
    var _this = this;
    var _a = (0, react_1.useState)(false), showCreateForm = _a[0], setShowCreateForm = _a[1];
    var _b = (0, react_1.useState)(''), _selectedInvoiceId = _b[0], setSelectedInvoiceId = _b[1];
    var _c = (0, react_1.useState)({
        invoice_id: '',
        interval: 'monthly',
        amount: 0,
    }), formData = _c[0], setFormData = _c[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch invoices for dropdown
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'invoices', 'admin'],
        queryFn: function () { return enhanced_api_1.billing.getInvoices(); },
    }).data, invoices = _d === void 0 ? [] : _d;
    // Mock data for recurring payments - in production, this would come from an API
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'recurring-payments'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Replace with actual API call when endpoint is available
                // For now, return empty array
                return [2 /*return*/, []];
            });
        }); },
    }), _f = _e.data, recurringPayments = _f === void 0 ? [] : _f, isLoading = _e.isLoading;
    var createRecurringPaymentMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, enhanced_api_1.billing.createRecurringPayment(data.invoice_id, data)];
            });
        }); },
        onSuccess: function () {
            toast_1.toast.success('Recurring payment created successfully');
            setShowCreateForm(false);
            setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
            queryClient.invalidateQueries({ queryKey: ['billing', 'recurring-payments'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create recurring payment', error, 'RecurringPayments');
            toast_1.toast.error("Failed to create recurring payment: ".concat(error.message));
        },
    });
    var cancelRecurringPaymentMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var subscriptionId = _b.subscriptionId, immediately = _b.immediately;
            return __generator(this, function (_c) {
                return [2 /*return*/, enhanced_api_1.billing.cancelRecurringPayment(subscriptionId, immediately)];
            });
        }); },
        onSuccess: function () {
            toast_1.toast.success('Recurring payment canceled successfully');
            queryClient.invalidateQueries({ queryKey: ['billing', 'recurring-payments'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to cancel recurring payment', error, 'RecurringPayments');
            toast_1.toast.error("Failed to cancel recurring payment: ".concat(error.message));
        },
    });
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
    var getStatusBadge = function (status) {
        var statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }) },
            canceled: { color: 'bg-red-100 text-red-800', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) },
            past_due: { color: 'bg-orange-100 text-orange-800', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }) },
            trialing: { color: 'bg-blue-100 text-blue-800', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-4 h-4" }) },
        };
        var config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-4 h-4" }) };
        return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ".concat(config.color), children: [config.icon, status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')] }));
    };
    var handleCreate = function () {
        if (!formData.invoice_id || !formData.amount || formData.amount <= 0) {
            toast_1.toast.error('Please fill in all required fields');
            return;
        }
        createRecurringPaymentMutation.mutate(formData);
    };
    var handleCancel = function (subscriptionId, immediately) {
        if (immediately === void 0) { immediately = false; }
        if (window.confirm("Are you sure you want to ".concat(immediately ? 'immediately cancel' : 'cancel at period end', " this recurring payment?"))) {
            cancelRecurringPaymentMutation.mutate({ subscriptionId: subscriptionId, immediately: immediately });
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading recurring payments..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, children: "Recurring Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-1", children: "Manage subscription-based recurring payments" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Plus, onClick: function () {
                            setShowCreateForm(true);
                            setSelectedInvoiceId('');
                        }, children: "Create Recurring Payment" })] }), showCreateForm && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Create Recurring Payment" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", icon: lucide_react_1.X, onClick: function () {
                                        setShowCreateForm(false);
                                        setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
                                    }, children: "Close" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Invoice" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500", value: formData.invoice_id, onChange: function (e) {
                                                var invoiceId = e.target.value;
                                                setFormData(__assign(__assign({}, formData), { invoice_id: invoiceId }));
                                                var invoice = invoices.find(function (inv) { return inv.id === invoiceId; });
                                                if (invoice) {
                                                    setFormData(__assign(__assign({}, formData), { invoice_id: invoiceId, amount: Number(invoice.total_amount) }));
                                                }
                                            }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select an invoice" }), invoices
                                                    .filter(function (inv) { return inv.status !== 'paid'; })
                                                    .map(function (invoice) { return ((0, jsx_runtime_1.jsxs)("option", { value: invoice.id, children: [invoice.invoice_number, " - ", formatCurrency(Number(invoice.total_amount))] }, invoice.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Payment Interval" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500", value: formData.interval, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { interval: e.target.value })); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "weekly", children: "Weekly" }), (0, jsx_runtime_1.jsx)("option", { value: "monthly", children: "Monthly" }), (0, jsx_runtime_1.jsx)("option", { value: "quarterly", children: "Quarterly" }), (0, jsx_runtime_1.jsx)("option", { value: "yearly", children: "Yearly" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Amount per Payment" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "number", step: "0.01", min: "0.5", value: formData.amount, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { amount: parseFloat(e.target.value) || 0 })); }, placeholder: "0.00" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleCreate, disabled: createRecurringPaymentMutation.isPending, icon: createRecurringPaymentMutation.isPending ? lucide_react_1.Loader2 : lucide_react_1.Plus, children: createRecurringPaymentMutation.isPending ? 'Creating...' : 'Create Recurring Payment' }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () {
                                                setShowCreateForm(false);
                                                setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
                                            }, children: "Cancel" })] })] })] }) })), recurringPayments.length === 0 ? ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-500 mb-2", children: "No Recurring Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400 mb-6", children: "Create your first recurring payment to get started" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Plus, onClick: function () { return setShowCreateForm(true); }, children: "Create Recurring Payment" })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4", children: recurringPayments.map(function (payment) { return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-6 h-6 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, children: ["Subscription ", payment.subscriptionId.slice(0, 8), "..."] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: ["Invoice: ", payment.metadata.invoiceId || 'N/A'] })] })] }), getStatusBadge(payment.status)] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Current Period Start" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(payment.currentPeriodStart) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Current Period End" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(payment.currentPeriodEnd) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Status" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: payment.status })] }), payment.canceledAt && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Canceled At" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: formatDate(payment.canceledAt) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: payment.cancelAtPeriodEnd && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs", children: "Will cancel at period end" })) }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: payment.status === 'active' && !payment.cancelAtPeriodEnd && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.X, onClick: function () { return handleCancel(payment.subscriptionId, false); }, children: "Cancel at Period End" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Trash2, onClick: function () { return handleCancel(payment.subscriptionId, true); }, children: "Cancel Immediately" })] })) })] })] }) }, payment.subscriptionId)); }) }))] }));
}
