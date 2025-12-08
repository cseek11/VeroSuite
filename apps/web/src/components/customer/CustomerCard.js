"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var CustomerStatusBar_1 = require("./CustomerStatusBar");
var lucide_react_1 = require("lucide-react");
var CustomerCard = function (_a) {
    var customer = _a.customer, onClick = _a.onClick, isSelected = _a.isSelected, densityMode = _a.densityMode;
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
    var formatDate = function (dateString) {
        if (!dateString)
            return 'Not scheduled';
        return new Date(dateString).toLocaleDateString();
    };
    var getStatusColor = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getBalanceColor = function (balance) {
        if (balance === 0)
            return 'text-green-600';
        if (balance > 0)
            return 'text-red-600';
        return 'text-gray-600';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { onClick: onClick, className: "bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ".concat(isSelected
            ? 'border-purple-500 shadow-lg'
            : 'border-gray-200 hover:border-purple-300'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-100 ".concat(densityMode === 'dense' ? 'pb-2' : 'pb-4'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900 truncate ".concat(densityMode === 'dense' ? 'text-sm' : 'text-base'), children: customer.name }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(customer.status)), children: customer.status })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 capitalize ".concat(densityMode === 'dense' ? 'text-xs' : 'text-sm'), children: customer.account_type })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-3 ".concat(densityMode === 'dense' ? 'py-2 space-y-2' : 'py-4 space-y-3'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [customer.address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "truncate", children: [customer.address, customer.city && ", ".concat(customer.city), customer.state && ", ".concat(customer.state)] })] })), customer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: formatPhone(customer.phone) })] })), customer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 pt-2 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium ".concat(getBalanceColor(customer.ar_balance || 0)), children: ["$", (customer.ar_balance || 0).toFixed(2)] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: customer.ar_balance === 0 ? 'Current' : 'Balance' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: formatDate(customer.next_service_date || '') }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Next Service" })] })] })] }), densityMode === 'standard' && ((0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t border-gray-100", children: (0, jsx_runtime_1.jsx)(CustomerStatusBar_1.CustomerStatusBar, { customer: customer, variant: "compact" }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-purple-500 opacity-0 hover:opacity-5 transition-opacity duration-200 rounded-lg pointer-events-none" })] }));
};
exports.CustomerCard = CustomerCard;
