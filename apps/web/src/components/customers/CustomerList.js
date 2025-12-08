"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerList;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var secure_api_client_1 = require("@/lib/secure-api-client");
var supabase_client_1 = require("@/lib/supabase-client");
var lucide_react_1 = require("lucide-react");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var logger_1 = require("@/utils/logger");
function CustomerList(_a) {
    var _this = this;
    var onViewCustomer = _a.onViewCustomer, onEditCustomer = _a.onEditCustomer, onCreateCustomer = _a.onCreateCustomer;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), selectedSegment = _c[0], setSelectedSegment = _c[1];
    var _d = (0, react_1.useState)('all'), selectedType = _d[0], setSelectedType = _d[1];
    var _e = (0, react_1.useState)(1), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = (0, react_1.useState)('name'), sortBy = _f[0], setSortBy = _f[1];
    var _g = (0, react_1.useState)('asc'), sortOrder = _g[0], setSortOrder = _g[1];
    var itemsPerPage = 10;
    // Fetch customers from backend API
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['secure-customers'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var customers_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getAll()];
                    case 1:
                        customers_1 = _a.sent();
                        // Ensure we have an array
                        if (!Array.isArray(customers_1)) {
                            logger_1.logger.warn('Backend API returned non-array data', { customers: customers_1 }, 'CustomerList');
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, customers_1];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('Error fetching customers from secure API', error_1, 'CustomerList');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    }), _j = _h.data, allCustomers = _j === void 0 ? [] : _j, isLoading = _h.isLoading, error = _h.error;
    // Apply client-side filtering and sorting
    var customers = (0, react_1.useMemo)(function () {
        var filteredCustomers = __spreadArray([], allCustomers, true); // Create a copy to avoid mutating the original
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filteredCustomers = filteredCustomers.filter(function (customer) {
                var _a, _b, _c;
                return ((_a = customer.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_b = customer.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_c = customer.phone) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply segment filter (simplified - would need proper data structure)
        if (selectedSegment !== 'all') {
            // Note: This would need proper customer_profiles data structure
            // For now, we'll skip this filter
        }
        // Apply type filter
        if (selectedType !== 'all') {
            filteredCustomers = filteredCustomers.filter(function (customer) {
                return customer.account_type === selectedType;
            });
        }
        // Apply sorting
        filteredCustomers.sort(function (a, b) {
            var aValue = a[sortBy] || '';
            var bValue = b[sortBy] || '';
            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
            else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
        // Apply pagination
        var from = (currentPage - 1) * itemsPerPage;
        var to = from + itemsPerPage;
        return filteredCustomers.slice(from, to);
    }, [allCustomers, searchTerm, selectedSegment, selectedType, sortBy, sortOrder, currentPage, itemsPerPage]);
    // Fetch segments for filter dropdown
    var segments = (0, react_query_1.useQuery)({
        queryKey: ['customer-segments'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_segments')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Fetch total count for pagination
    var totalCount = (0, react_query_1.useQuery)({
        queryKey: ['customers-count', searchTerm, selectedSegment, selectedType],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var query, _a, count, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase_client_1.supabase
                            .from('accounts')
                            .select('*', { count: 'exact', head: true })
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');
                        if (searchTerm) {
                            query = query.or("name.ilike.%".concat(searchTerm, "%,email.ilike.%").concat(searchTerm, "%,phone.ilike.%").concat(searchTerm, "%"));
                        }
                        if (selectedSegment !== 'all') {
                            query = query.eq('customer_profiles.customer_segments.segment_code', selectedSegment);
                        }
                        if (selectedType !== 'all') {
                            query = query.eq('account_type', selectedType);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), count = _a.count, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, count || 0];
                }
            });
        }); },
    }).data;
    var totalPages = Math.ceil((totalCount || 0) / itemsPerPage);
    var handleSort = function (column) {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };
    var getSegmentColor = function (segmentCode) {
        var colors = {
            'RES_BASIC': 'bg-blue-100 text-blue-800',
            'RES_STD': 'bg-green-100 text-green-800',
            'RES_PREM': 'bg-purple-100 text-purple-800',
            'COM_BASIC': 'bg-yellow-100 text-yellow-800',
            'COM_STD': 'bg-orange-100 text-orange-800',
            'COM_PREM': 'bg-red-100 text-red-800',
            'IND': 'bg-gray-100 text-gray-800',
        };
        return colors[segmentCode] || 'bg-gray-100 text-gray-800';
    };
    var getTypeColor = function (type) {
        var colors = {
            'residential': 'bg-blue-100 text-blue-800',
            'commercial': 'bg-green-100 text-green-800',
            'industrial': 'bg-purple-100 text-purple-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading customers..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800", children: ["Error loading customers: ", error.message] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Customers" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [totalCount, " total customers"] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onCreateCustomer, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Customer"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { id: "customer-list-search", name: "customer-list-search", type: "text", placeholder: "Search customers by name, email, or phone...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onFocus: function () { return logger_1.logger.debug('CustomerList search focused', {}, 'CustomerList'); }, onBlur: function (_event) { return logger_1.logger.debug('CustomerList search blurred', {}, 'CustomerList'); }, onKeyDown: function (e) {
                                            logger_1.logger.debug('CustomerList search keyDown', { key: e.key }, 'CustomerList');
                                        }, "data-search-input": "true", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:w-48", children: (0, jsx_runtime_1.jsxs)("select", { value: selectedSegment, onChange: function (e) { return setSelectedSegment(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Segments" }), segments === null || segments === void 0 ? void 0 : segments.map(function (segment) { return ((0, jsx_runtime_1.jsx)("option", { value: segment.segment_code, children: segment.segment_name }, segment.id)); })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:w-48", children: (0, jsx_runtime_1.jsxs)("select", { value: selectedType, onChange: function (e) { return setSelectedType(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "residential", children: "Residential" }), (0, jsx_runtime_1.jsx)("option", { value: "commercial", children: "Commercial" }), (0, jsx_runtime_1.jsx)("option", { value: "industrial", children: "Industrial" })] }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('name'); }, className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Name", sortBy === 'name' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('account_type'); }, className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Type", sortBy === 'account_type' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('segment'); }, className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Segment", sortBy === 'segment' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Location" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) {
                                var _a, _b, _c, _d;
                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: customer.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: ((_b = (_a = customer.customer_profiles) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.business_name) || 'N/A' })] }) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getTypeColor(customer.account_type)), children: customer.account_type }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: ((_d = (_c = customer.customer_profiles) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.customer_segments) && ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getSegmentColor(customer.customer_profiles[0].customer_segments.segment_code)), children: customer.customer_profiles[0].customer_segments.segment_name })) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: customer.email }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: customer.phone })] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-900", children: [customer.city, ", ", customer.state] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: customer.zip_code })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'), children: customer.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return onViewCustomer(customer); }, className: "text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50", title: "View Customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onEditCustomer(customer); }, className: "text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50", title: "Edit Customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) })] }) })] }, customer.id));
                            }) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-t border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: ["Showing ", ((currentPage - 1) * itemsPerPage) + 1, " to ", Math.min(currentPage * itemsPerPage, totalCount || 0), " of ", totalCount, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage - 1); }, disabled: currentPage === 1, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (page) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(page); }, className: "px-3 py-2 text-sm font-medium rounded-md ".concat(currentPage === page
                                        ? 'text-white bg-purple-600 border border-purple-600'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'), children: page }, page)); }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage + 1); }, disabled: currentPage === totalPages, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }) }))] }));
}
