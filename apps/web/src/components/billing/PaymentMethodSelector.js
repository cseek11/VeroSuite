"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentMethodSelector;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
function PaymentMethodSelector(_a) {
    var accountId = _a.accountId, value = _a.value, onChange = _a.onChange, onAddNew = _a.onAddNew, error = _a.error, _b = _a.required, required = _b === void 0 ? false : _b, _c = _a.label, label = _c === void 0 ? 'Payment Method' : _c, _d = _a.showAddNew, showAddNew = _d === void 0 ? true : _d;
    var _e = (0, react_1.useState)(value), selectedId = _e[0], setSelectedId = _e[1];
    // Sync internal state with value prop
    (0, react_1.useEffect)(function () {
        setSelectedId(value);
    }, [value]);
    // Fetch payment methods for the account
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-methods', accountId],
        queryFn: function () { return enhanced_api_1.billing.getPaymentMethods(accountId); },
        enabled: !!accountId,
    }), _g = _f.data, paymentMethods = _g === void 0 ? [] : _g, isLoading = _f.isLoading, fetchError = _f.error;
    var handleSelect = function (method) {
        if (method === 'new') {
            setSelectedId('new');
            onChange('new');
            if (onAddNew) {
                onAddNew();
            }
        }
        else {
            setSelectedId(method.id);
            onChange(method);
        }
    };
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
    var getPaymentMethodIcon = function (method) {
        var _a;
        var type = ((_a = method.payment_type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (type.includes('card')) {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5" });
        }
        return (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5" });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700", children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-5 h-5 text-gray-400 animate-spin mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Loading payment methods..." })] })] }));
    }
    if (fetchError) {
        var errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
        logger_1.logger.error("Failed to load payment methods for account ".concat(accountId, " in PaymentMethodSelector. ").concat(errorMessage, ". This may be due to network issues, authentication problems, or server errors. Please check your connection and try again."), fetchError, 'PaymentMethodSelector');
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700", children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center p-4 border border-red-200 rounded-lg bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-semibold text-red-900", children: "Failed to load payment methods" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-red-700 mt-1", children: [errorMessage, ". Please check your connection and try again."] })] })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700", children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [paymentMethods.length > 0 ? (paymentMethods.map(function (method) { return ((0, jsx_runtime_1.jsx)("div", { className: "border-2 rounded-lg p-4 cursor-pointer transition-all ".concat(selectedId === method.id
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'), onClick: function () { return handleSelect(method); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(selectedId === method.id
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-600'), children: getPaymentMethodIcon(method) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: getPaymentMethodDisplay(method) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mt-1", children: [method.card_expiry && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Expires ", method.card_expiry] })), method.payment_type && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: method.payment_type
                                                                .replace('_', ' ')
                                                                .replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }))] })] })] }), selectedId === method.id && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-purple-600 flex-shrink-0" }))] }) }, method.id)); })) : ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6 text-center bg-gray-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "No saved payment methods" })] })), showAddNew && ((0, jsx_runtime_1.jsx)("div", { className: "border-2 rounded-lg p-4 cursor-pointer transition-all ".concat(selectedId === 'new'
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50'), onClick: function () { return handleSelect('new'); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(selectedId === 'new'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-600'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: "Add New Payment Method" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Add a credit card or other payment method" })] })] }), selectedId === 'new' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-purple-600 flex-shrink-0" }))] }) })), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center pt-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600 text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-3 h-3 mr-1" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-green-600", children: "Secure payment processing" })] }) })] }), error && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-red-600 mt-1", children: error }))] }));
}
