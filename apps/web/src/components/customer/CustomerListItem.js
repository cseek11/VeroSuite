"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerListItem = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var CustomerListItem = function (_a) {
    var customer = _a.customer, onClick = _a.onClick, isSelected = _a.isSelected;
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
            case 'suspended': return 'bg-orange-100 text-orange-800';
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
    return ((0, jsx_runtime_1.jsxs)("div", { onClick: onClick, className: "grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ".concat(isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''), children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900 truncate text-base", children: customer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 truncate", children: [(customer.address || customer.city || customer.state) && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: [customer.address, customer.city, customer.state].filter(Boolean).join(', ') }) })), customer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: formatPhone(customer.phone) })] })), customer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] }))] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(customer.status)), children: customer.status }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium ".concat(getBalanceColor(customer.ar_balance || 0)), children: ["$", (customer.ar_balance || 0).toFixed(2)] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: formatDate(customer.created_at || '') })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center justify-end", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 capitalize", children: customer.account_type }) })] }));
};
exports.CustomerListItem = CustomerListItem;
