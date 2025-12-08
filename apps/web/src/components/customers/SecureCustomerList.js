"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SecureCustomerList;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useSecureAccounts_1 = require("@/hooks/useSecureAccounts");
function SecureCustomerList(_a) {
    var onViewCustomer = _a.onViewCustomer, onEditCustomer = _a.onEditCustomer, onCreateCustomer = _a.onCreateCustomer;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), selectedSegment = _c[0], setSelectedSegment = _c[1];
    var _d = (0, react_1.useState)('all'), selectedType = _d[0], setSelectedType = _d[1];
    var _e = (0, react_1.useState)(1), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = (0, react_1.useState)('name'), sortBy = _f[0], setSortBy = _f[1];
    var _g = (0, react_1.useState)('asc'), sortOrder = _g[0], setSortOrder = _g[1];
    var itemsPerPage = 10;
    // Use secure hooks for data fetching
    var _h = (0, useSecureAccounts_1.useSecureAccounts)(), allCustomers = _h.data, isLoading = _h.isLoading, error = _h.error;
    var searchResults = (0, useSecureAccounts_1.useSearchAccounts)(searchTerm).data;
    // Use search results if searching, otherwise use all customers
    var customers = Array.isArray(searchTerm ? searchResults : allCustomers)
        ? (searchTerm ? searchResults : allCustomers)
        : [];
    // Filter and sort customers
    var filteredAndSortedCustomers = (0, react_1.useMemo)(function () {
        var filtered = customers.filter(function (customer) {
            // Filter by segment
            if (selectedSegment !== 'all') {
                var segment = getCustomerSegment(customer);
                if (segment !== selectedSegment)
                    return false;
            }
            // Filter by type
            if (selectedType !== 'all' && customer.account_type !== selectedType) {
                return false;
            }
            return true;
        });
        // Sort customers
        filtered.sort(function (a, b) {
            var comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'account_type':
                    comparison = a.account_type.localeCompare(b.account_type);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'created_at':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });
        return filtered;
    }, [customers, selectedSegment, selectedType, sortBy, sortOrder]);
    // Pagination
    var totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
    var paginatedCustomers = filteredAndSortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Customer segment calculation
    function getCustomerSegment(customer) {
        var createdDate = customer.created_at;
        if (!createdDate)
            return 'new';
        var monthsActive = Math.floor((Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
        if (monthsActive < 6)
            return 'new';
        if (monthsActive < 24)
            return 'active';
        return 'veteran';
    }
    // Handle sort
    var handleSort = function (field) {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    // Handle search
    var handleSearch = function (e) {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: __spreadArray([], Array(5), true).map(function (_, i) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded" }, i)); }) })] }) }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-600 text-sm mb-2", children: "Error loading customers" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs", children: error.message })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold text-gray-900", children: "Customers" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: [filteredAndSortedCustomers.length, " total customers"] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onCreateCustomer, className: "inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Customer"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search customers...", value: searchTerm, onChange: handleSearch, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)("select", { value: selectedSegment, onChange: function (e) {
                                        setSelectedSegment(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Segments" }), (0, jsx_runtime_1.jsx)("option", { value: "new", children: "New (< 6 months)" }), (0, jsx_runtime_1.jsx)("option", { value: "active", children: "Active (6-24 months)" }), (0, jsx_runtime_1.jsx)("option", { value: "veteran", children: "Veteran (> 24 months)" })] }), (0, jsx_runtime_1.jsxs)("select", { value: selectedType, onChange: function (e) {
                                        setSelectedType(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "residential", children: "Residential" }), (0, jsx_runtime_1.jsx)("option", { value: "commercial", children: "Commercial" }), (0, jsx_runtime_1.jsx)("option", { value: "industrial", children: "Industrial" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('name'); }, children: ["Customer Name", sortBy === 'name' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }), (0, jsx_runtime_1.jsxs)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('account_type'); }, children: ["Type", sortBy === 'account_type' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Segment" }), (0, jsx_runtime_1.jsxs)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('status'); }, children: ["Status", sortBy === 'status' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: paginatedCustomers.map(function (customer) {
                                var segment = getCustomerSegment(customer);
                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: customer.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: customer.address })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(customer.account_type === 'residential'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : customer.account_type === 'commercial'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-purple-100 text-purple-800'), children: customer.account_type }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: [(0, jsx_runtime_1.jsx)("div", { children: customer.phone }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: customer.email })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(segment === 'new'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : segment === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'), children: segment }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat((customer.status === 'active')
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'), children: customer.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return onViewCustomer(customer); }, className: "text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50", title: "View customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onEditCustomer(customer); }, className: "text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50", title: "Edit customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) })] }) })] }, customer.id));
                            }) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: ["Showing ", (currentPage - 1) * itemsPerPage + 1, " to", ' ', Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length), " of", ' ', filteredAndSortedCustomers.length, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage - 1); }, disabled: currentPage === 1, className: "px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage + 1); }, disabled: currentPage === totalPages, className: "px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }) })), filteredAndSortedCustomers.length === 0 && !isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-sm", children: searchTerm || selectedSegment !== 'all' || selectedType !== 'all'
                            ? 'No customers match your search criteria.'
                            : 'No customers found. Create your first customer to get started.' }), (!searchTerm && selectedSegment === 'all' && selectedType === 'all') && ((0, jsx_runtime_1.jsxs)("button", { onClick: onCreateCustomer, className: "mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Your First Customer"] }))] }))] }));
}
