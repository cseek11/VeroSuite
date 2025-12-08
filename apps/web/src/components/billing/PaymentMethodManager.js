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
exports.default = PaymentMethodManager;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var billing_analytics_1 = require("@/lib/billing-analytics");
var BillingSkeletons_1 = require("./BillingSkeletons");
function PaymentMethodManager(_a) {
    var _this = this;
    var customerId = _a.customerId, onPaymentMethodSelected = _a.onPaymentMethodSelected, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), showAddModal = _c[0], setShowAddModal = _c[1];
    var _d = (0, react_1.useState)(null), editingMethod = _d[0], setEditingMethod = _d[1];
    var _e = (0, react_1.useState)({
        payment_type: 'credit_card',
        payment_name: '',
        card_type: '',
        card_last4: '',
        card_expiry: '',
        account_number: '',
        routing_number: '',
        is_default: false,
    }), formData = _e[0], setFormData = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch payment methods
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-methods', customerId],
        queryFn: function () { return enhanced_api_1.billing.getPaymentMethods(customerId); },
        enabled: !!customerId,
    }), _g = _f.data, paymentMethods = _g === void 0 ? [] : _g, isLoading = _f.isLoading, error = _f.error;
    // Create payment method mutation
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) {
            return enhanced_api_1.billing.createPaymentMethod(__assign({ account_id: customerId }, data));
        },
        onSuccess: function (_data) {
            queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
            setShowAddModal(false);
            resetForm();
            toast_1.toast.success('Payment method added successfully');
            logger_1.logger.info('Payment method created', { customerId: customerId }, 'PaymentMethodManager');
            (0, billing_analytics_1.trackPaymentMethodAdded)(formData.payment_type, customerId);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create payment method', error, 'PaymentMethodManager');
            toast_1.toast.error('Failed to add payment method. Please try again.');
        },
    });
    // Delete payment method mutation
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return enhanced_api_1.billing.deletePaymentMethod(id); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
            toast_1.toast.success('Payment method deleted successfully');
            logger_1.logger.info('Payment method deleted', { customerId: customerId }, 'PaymentMethodManager');
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete payment method', error, 'PaymentMethodManager');
            toast_1.toast.error('Failed to delete payment method. Please try again.');
        },
    });
    var resetForm = function () {
        setFormData({
            payment_type: 'credit_card',
            payment_name: '',
            card_type: '',
            card_last4: '',
            card_expiry: '',
            account_number: '',
            routing_number: '',
            is_default: false,
        });
        setEditingMethod(null);
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Validate form
                    if (!formData.payment_name) {
                        toast_1.toast.error('Please enter a payment method name');
                        return [2 /*return*/];
                    }
                    if (formData.payment_type === 'credit_card' && !formData.card_last4) {
                        toast_1.toast.error('Please enter the last 4 digits of the card');
                        return [2 /*return*/];
                    }
                    if (formData.payment_type === 'ach' && (!formData.account_number || !formData.routing_number)) {
                        toast_1.toast.error('Please enter account and routing numbers for ACH');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, createMutation.mutateAsync(formData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Form submission error', error_1, 'PaymentMethodManager');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (paymentMethod) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to delete ".concat(paymentMethod.payment_name || 'this payment method', "?"))) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteMutation.mutateAsync(paymentMethod.id)];
                case 2:
                    _a.sent();
                    (0, billing_analytics_1.trackPaymentMethodDeleted)(paymentMethod.id, customerId);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Delete error', error_2, 'PaymentMethodManager');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getPaymentTypeIcon = function (type) {
        switch (type) {
            case 'credit_card':
            case 'debit_card':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5" });
            case 'ach':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-5 h-5" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5" });
        }
    };
    var getPaymentTypeLabel = function (type) {
        switch (type) {
            case 'credit_card':
                return 'Credit Card';
            case 'debit_card':
                return 'Debit Card';
            case 'ach':
                return 'ACH';
            case 'check':
                return 'Check';
            case 'cash':
                return 'Cash';
            case 'cod':
                return 'COD';
            default:
                return type;
        }
    };
    var formatCardNumber = function (last4) {
        if (!last4)
            return '****';
        return "**** **** **** ".concat(last4);
    };
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(BillingSkeletons_1.PaymentMethodSkeleton, {});
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-red-800 mb-1", children: "Error loading payment methods" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: error instanceof Error ? error.message : 'An unexpected error occurred' })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Payment Methods" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", icon: lucide_react_1.Plus, onClick: function () {
                                        resetForm();
                                        setShowAddModal(true);
                                    }, children: "Add Payment Method" })] }), paymentMethods.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-600 mb-2", children: "No payment methods" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-500 mb-4", children: "Add a payment method to make payments faster" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "sm", icon: lucide_react_1.Plus, onClick: function () {
                                        resetForm();
                                        setShowAddModal(true);
                                    }, children: "Add Payment Method" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: paymentMethods.map(function (method) { return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 transition-colors ".concat(method.is_default
                                    ? 'border-purple-300 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg ".concat(method.is_default ? 'bg-purple-100' : 'bg-gray-100'), children: getPaymentTypeIcon(method.payment_type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold", children: method.payment_name || getPaymentTypeLabel(method.payment_type) }), method.is_default && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium", children: "Default" })), !method.is_active && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium", children: "Inactive" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 space-y-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: getPaymentTypeLabel(method.payment_type) }), method.card_last4 && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: formatCardNumber(method.card_last4) })), method.card_expiry && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Expires: ", method.card_expiry] })), method.account_number && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Account: ****", method.account_number.slice(-4)] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [onPaymentMethodSelected && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return onPaymentMethodSelected(method); }, children: "Use" })), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Trash2, onClick: function () { return handleDelete(method); }, className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: "Delete" })] })] }) }, method.id)); }) }))] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showAddModal, onOpenChange: setShowAddModal, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: editingMethod ? 'Edit Payment Method' : 'Add Payment Method' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Type *" }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: formData.payment_type, onChange: function (value) {
                                                        return setFormData(__assign(__assign({}, formData), { payment_type: (typeof value === 'string' ? value : '') }));
                                                    }, options: [
                                                        { value: 'credit_card', label: 'Credit Card' },
                                                        { value: 'debit_card', label: 'Debit Card' },
                                                        { value: 'ach', label: 'ACH' },
                                                        { value: 'check', label: 'Check' },
                                                    ] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Method Name *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: formData.payment_name, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { payment_name: e.target.value })); }, placeholder: "e.g., Visa ending in 1234", required: true })] }), formData.payment_type === 'credit_card' || formData.payment_type === 'debit_card' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Card Type" }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: formData.card_type, onChange: function (value) {
                                                                return setFormData(__assign(__assign({}, formData), { card_type: typeof value === 'string' ? value : '' }));
                                                            }, options: [
                                                                { value: 'visa', label: 'Visa' },
                                                                { value: 'mastercard', label: 'Mastercard' },
                                                                { value: 'amex', label: 'American Express' },
                                                                { value: 'discover', label: 'Discover' },
                                                            ] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last 4 Digits *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: formData.card_last4, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { card_last4: e.target.value.replace(/\D/g, '').slice(0, 4) })); }, placeholder: "1234", maxLength: 4, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Expiry Date (MM/YY)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: formData.card_expiry, onChange: function (e) {
                                                                var value = e.target.value.replace(/\D/g, '');
                                                                var formatted = value.length >= 2
                                                                    ? "".concat(value.slice(0, 2), "/").concat(value.slice(2, 4))
                                                                    : value;
                                                                setFormData(__assign(__assign({}, formData), { card_expiry: formatted }));
                                                            }, placeholder: "MM/YY", maxLength: 5 })] })] })) : formData.payment_type === 'ach' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Account Number *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: formData.account_number, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { account_number: e.target.value })); }, placeholder: "Account number", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Routing Number *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: formData.routing_number, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { routing_number: e.target.value.replace(/\D/g, '').slice(0, 9) })); }, placeholder: "Routing number", maxLength: 9, required: true })] })] })) : null, (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "is_default", checked: formData.is_default, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { is_default: e.target.checked })); }, className: "w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "is_default", className: "ml-2 text-sm text-gray-700", children: "Set as default payment method" })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.DialogFooter, { className: "mt-6", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: function () {
                                                setShowAddModal(false);
                                                resetForm();
                                            }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: createMutation.isPending, children: createMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Saving..."] })) : ('Save Payment Method') })] })] })] }) })] }));
}
