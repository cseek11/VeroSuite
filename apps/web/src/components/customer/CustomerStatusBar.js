"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerStatusBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var CustomerStatusBar = function (_a) {
    var customer = _a.customer, _b = _a.variant, variant = _b === void 0 ? 'standard' : _b;
    var formatPhone = function (phone) {
        if (!phone)
            return '';
        var cleaned = phone.replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return "(".concat(match[1], ") ").concat(match[2], "-").concat(match[3]);
        }
        return phone;
    };
    var getStatusIcon = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'active': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'inactive': return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "w-4 h-4 text-red-500" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4 h-4 text-gray-500" });
        }
    };
    var getPropertyIcon = function (type) {
        switch (type === null || type === void 0 ? void 0 : type.toLowerCase()) {
            case 'residential': return (0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "w-4 h-4 text-blue-500" });
            case 'commercial': return (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4 text-purple-500" });
            case 'healthcare': return (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "w-4 h-4 text-red-500" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "w-4 h-4 text-gray-500" });
        }
    };
    if (variant === 'compact') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-900 truncate max-w-xs font-medium", children: [customer.name, " \u2022 ", customer.phone && formatPhone(customer.phone), " \u2022 ", [customer.address, customer.city].filter(Boolean).join(', ')] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getStatusIcon(customer.status), (0, jsx_runtime_1.jsx)("span", { className: customer.status === 'active' ? 'text-green-600' : 'text-red-600', children: customer.status }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "|" }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { className: customer.ar_balance === 0 ? 'text-green-600' : 'text-red-600', children: ["$", (customer.ar_balance || 0).toFixed(2)] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "|" }), getPropertyIcon(customer.account_type), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 capitalize", children: customer.account_type })] })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getStatusIcon(customer.status), (0, jsx_runtime_1.jsx)("span", { className: customer.status === 'active' ? 'text-green-600' : 'text-red-600', children: customer.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: customer.ar_balance === 0 ? 'text-green-600' : 'text-red-600', children: ["$", (customer.ar_balance || 0).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getPropertyIcon(customer.account_type), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 capitalize", children: customer.account_type })] })] }) }));
};
exports.CustomerStatusBar = CustomerStatusBar;
