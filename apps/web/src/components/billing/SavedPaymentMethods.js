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
exports.default = SavedPaymentMethods;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Form validation schema
var paymentMethodSchema = zod_2.z.object({
    payment_type: zod_2.z.enum(['credit_card', 'debit_card', 'ach', 'check', 'cash', 'cod'], {
        required_error: 'Payment type is required',
    }),
    payment_name: zod_2.z.string().min(1, 'Payment method name is required').optional(),
    account_number: zod_2.z.string().optional(),
    routing_number: zod_2.z.string().optional(),
    card_type: zod_2.z.string().optional(),
    card_last4: zod_2.z.string().optional(),
    card_expiry: zod_2.z.string().optional(),
});
function SavedPaymentMethods(_a) {
    var _this = this;
    var accountId = _a.accountId, onSelect = _a.onSelect;
    var _b = (0, react_1.useState)(false), showAddDialog = _b[0], setShowAddDialog = _b[1];
    var _c = (0, react_1.useState)(null), editingMethod = _c[0], setEditingMethod = _c[1];
    var _d = (0, react_1.useState)(null), _deletingMethod = _d[0], setDeletingMethod = _d[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch payment methods
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-methods', accountId],
        queryFn: function () { return enhanced_api_1.billing.getPaymentMethods(accountId); },
        enabled: !!accountId,
    }), _f = _e.data, paymentMethods = _f === void 0 ? [] : _f, isLoading = _e.isLoading, fetchError = _e.error;
    // Form setup
    var _g = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(paymentMethodSchema),
        defaultValues: {
            payment_type: 'credit_card',
        },
    }), control = _g.control, handleSubmit = _g.handleSubmit, _h = _g.formState, errors = _h.errors, isSubmitting = _h.isSubmitting, reset = _g.reset, watch = _g.watch;
    var paymentType = watch('payment_type');
    // Create payment method mutation
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) {
            var _a;
            var payload = __assign(__assign(__assign(__assign(__assign({ account_id: accountId, payment_type: data.payment_type, payment_name: (_a = data.payment_name) !== null && _a !== void 0 ? _a : '' }, (data.account_number !== undefined ? { account_number: data.account_number } : {})), (data.routing_number !== undefined ? { routing_number: data.routing_number } : {})), (data.card_type !== undefined ? { card_type: data.card_type } : {})), (data.card_last4 !== undefined ? { card_last4: data.card_last4 } : {})), (data.card_expiry !== undefined ? { card_expiry: data.card_expiry } : {}));
            return enhanced_api_1.billing.createPaymentMethod(payload);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
            toast_1.toast.success('Payment method added successfully');
            setShowAddDialog(false);
            reset();
        },
        onError: function (error) {
            var errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error("Failed to create payment method for account ".concat(accountId, ". ").concat(errorMessage, ". This may be due to invalid payment details, network issues, or Stripe API errors. Please verify the payment information and try again."), error, 'SavedPaymentMethods');
            toast_1.toast.error("Failed to add payment method. ".concat(errorMessage, ". Please check your payment details and try again."));
        },
    });
    // Delete payment method mutation
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: function (methodId) { return enhanced_api_1.billing.deletePaymentMethod(methodId); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
            toast_1.toast.success('Payment method deleted successfully');
            setDeletingMethod(null);
        },
        onError: function (error, variables) {
            var errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error("Failed to delete payment method ".concat(variables, " for account ").concat(accountId, ". ").concat(errorMessage, ". This may be due to the payment method being in use, network issues, or permission errors."), error, 'SavedPaymentMethods');
            toast_1.toast.error("Failed to delete payment method. ".concat(errorMessage, ". Please ensure the payment method is not in use and try again."));
        },
    });
    var handleAdd = function () {
        setEditingMethod(null);
        reset({
            payment_type: 'credit_card',
        });
        setShowAddDialog(true);
    };
    var handleEdit = function (method) {
        setEditingMethod(method);
        reset({
            payment_type: method.payment_type || 'credit_card',
            payment_name: method.payment_name || '',
            account_number: method.account_number || '',
            routing_number: method.routing_number || '',
            card_type: method.card_type || '',
            card_last4: method.card_last4 || '',
            card_expiry: method.card_expiry || '',
        });
        setShowAddDialog(true);
    };
    var handleDelete = function (method) {
        if (window.confirm("Are you sure you want to delete this payment method? This action cannot be undone.")) {
            deleteMutation.mutate(method.id);
        }
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createMutation.mutateAsync(data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getPaymentMethodDisplay = function (method) {
        if (method.payment_name) {
            return method.payment_name;
        }
        if (method.card_type && method.card_last4) {
            return "".concat(method.card_type, " ending in ").concat(method.card_last4);
        }
        if (method.payment_type) {
            return method.payment_type.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
        }
        return 'Payment Method';
    };
    var getPaymentTypeColor = function (type) {
        switch (type === null || type === void 0 ? void 0 : type.toLowerCase()) {
            case 'credit_card':
            case 'debit_card':
                return 'info';
            case 'ach':
                return 'success';
            case 'check':
                return 'secondary';
            default:
                return 'default';
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-5 h-5 text-gray-400 animate-spin mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Loading payment methods..." })] }) }) }));
    }
    if (fetchError) {
        var errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
        logger_1.logger.error("Failed to load payment methods for account ".concat(accountId, ". ").concat(errorMessage, ". This may be due to network issues, authentication problems, or server errors. Please check your connection and try again."), fetchError, 'SavedPaymentMethods');
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center p-4 border border-red-200 rounded-lg bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-semibold text-red-900", children: "Failed to load payment methods" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-red-700 mt-1", children: [errorMessage, ". Please check your connection and try again."] })] })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 mr-2 text-purple-600" }), "Saved Payment Methods"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: "Manage your payment methods for quick checkout" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: handleAdd, size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-1" }), "Add Method"] })] }), paymentMethods.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12 border-2 border-dashed border-gray-300 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mb-2", children: "No payment methods saved" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mb-4", children: "Add a payment method to speed up future payments" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: handleAdd, size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-1" }), "Add Payment Method"] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: paymentMethods.map(function (method) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-100 text-purple-700 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-semibold", children: getPaymentMethodDisplay(method) }), method.payment_type && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: getPaymentTypeColor(method.payment_type), children: method.payment_type
                                                                    .replace('_', ' ')
                                                                    .replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [method.card_expiry && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Expires ", method.card_expiry] })), method.card_last4 && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500 font-mono", children: ["\u2022\u2022\u2022\u2022 ", method.card_last4] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [onSelect && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return onSelect(method); }, children: "Use" })), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handleEdit(method); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handleDelete(method); }, className: "text-red-600 hover:text-red-700 hover:border-red-300", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] })] }, method.id)); }) })), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-6 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4 mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-green-600", children: "Your payment information is securely encrypted and stored" })] }) })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: editingMethod ? 'Edit Payment Method' : 'Add Payment Method' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: ["Payment Type ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "payment_type", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)("select", __assign({}, field, { className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "credit_card", children: "Credit Card" }), (0, jsx_runtime_1.jsx)("option", { value: "debit_card", children: "Debit Card" }), (0, jsx_runtime_1.jsx)("option", { value: "ach", children: "ACH (Bank Transfer)" }), (0, jsx_runtime_1.jsx)("option", { value: "check", children: "Check" }), (0, jsx_runtime_1.jsx)("option", { value: "cash", children: "Cash" }), (0, jsx_runtime_1.jsx)("option", { value: "cod", children: "Cash on Delivery" })] })));
                                            } }), errors.payment_type && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-red-600 mt-1", children: errors.payment_type.message }))] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "payment_name", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Payment Method Name", placeholder: "e.g., My Business Credit Card", error: (_b = errors.payment_name) === null || _b === void 0 ? void 0 : _b.message })));
                                    } }), (paymentType === 'credit_card' || paymentType === 'debit_card') && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "card_type", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Card Type", placeholder: "e.g., Visa, Mastercard", error: (_b = errors.card_type) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "card_last4", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Last 4 Digits", placeholder: "1234", maxLength: 4, error: (_b = errors.card_last4) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "card_expiry", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Expiry Date", placeholder: "MM/YY", error: (_b = errors.card_expiry) === null || _b === void 0 ? void 0 : _b.message })));
                                            } })] })), paymentType === 'ach' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "account_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Account Number", placeholder: "Account number", error: (_b = errors.account_number) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "routing_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Routing Number", placeholder: "Routing number", error: (_b = errors.routing_number) === null || _b === void 0 ? void 0 : _b.message })));
                                            } })] })), (0, jsx_runtime_1.jsxs)(ui_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: function () {
                                                setShowAddDialog(false);
                                                reset();
                                                setEditingMethod(null);
                                            }, disabled: isSubmitting, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: isSubmitting, children: isSubmitting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Saving..."] })) : editingMethod ? ('Update Method') : ('Add Method') })] })] })] }) })] }));
}
