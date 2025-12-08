"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSearch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var CustomerSearch = function (_a) {
    var customers = _a.customers, selectedCustomerId = _a.selectedCustomerId, onCustomerSelect = _a.onCustomerSelect, error = _a.error, _b = _a.placeholder, placeholder = _b === void 0 ? "Search customers..." : _b;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)(customers), filteredCustomers = _e[0], setFilteredCustomers = _e[1];
    var dropdownRef = (0, react_1.useRef)(null);
    var inputRef = (0, react_1.useRef)(null);
    // Get selected customer for display
    var selectedCustomer = customers.find(function (c) { return c.id === selectedCustomerId; });
    // Filter customers based on search term
    (0, react_1.useEffect)(function () {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers);
        }
        else {
            var filtered = customers.filter(function (customer) {
                var _a, _b, _c, _d, _e;
                var searchLower = searchTerm.toLowerCase();
                return (((_a = customer.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) ||
                    ((_b = customer.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) ||
                    ((_c = customer.phone) === null || _c === void 0 ? void 0 : _c.includes(searchTerm)) ||
                    ((_d = customer.address) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower)) ||
                    ((_e = customer.city) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(searchLower)));
            });
            setFilteredCustomers(filtered);
        }
    }, [searchTerm, customers]);
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var handleCustomerSelect = function (customer) {
        onCustomerSelect(customer.id);
        setSearchTerm('');
        setIsOpen(false);
    };
    var handleInputFocus = function () {
        setIsOpen(true);
    };
    var handleInputChange = function (e) {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };
    var getDisplayName = function (customer) {
        if (customer.name && customer.name.trim()) {
            return customer.name;
        }
        return customer.email || customer.phone || 'Unnamed Customer';
    };
    var getSubtitle = function (customer) {
        var parts = [];
        if (customer.email)
            parts.push(customer.email);
        if (customer.phone)
            parts.push(customer.phone);
        if (customer.city && customer.state)
            parts.push("".concat(customer.city, ", ").concat(customer.state));
        return parts.join(' • ');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: "Customer" }), (0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: isOpen ? searchTerm : (selectedCustomer ? getDisplayName(selectedCustomer) : ''), onChange: handleInputChange, onFocus: handleInputFocus, placeholder: placeholder, className: "crm-input pl-10 ".concat(error ? 'crm-input-error' : ''), style: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'rgb(30, 41, 59)',
                                    backdropFilter: 'blur(4px)'
                                } })] }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto", children: filteredCustomers.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 text-gray-500 text-sm", children: searchTerm ? 'No customers found' : "No customers available (".concat((customers === null || customers === void 0 ? void 0 : customers.length) || 0, " total)") })) : (filteredCustomers.map(function (customer) { return ((0, jsx_runtime_1.jsx)("div", { onClick: function () { return handleCustomerSelect(customer); }, className: "px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-purple-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: getDisplayName(customer) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: getSubtitle(customer) }), customer.address && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 mt-1", children: customer.address }))] })] }) }, customer.id)); })) }))] }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
};
exports.CustomerSearch = CustomerSearch;
