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
exports.CustomerList = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var userPreferences_1 = require("@/stores/userPreferences");
var useDensityMode_1 = require("@/hooks/useDensityMode");
var useSearchLogging_1 = require("@/hooks/useSearchLogging");
var AdvancedSearchBar_1 = require("@/components/search/AdvancedSearchBar");
var CustomerStatusBar_1 = require("./CustomerStatusBar");
var CustomerCard_1 = require("./CustomerCard");
var CustomerListItem_1 = require("./CustomerListItem");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var secure_api_client_1 = require("@/lib/secure-api-client");
var search_service_1 = require("@/lib/search-service");
var CustomerList = function (_a) {
    var onCustomerClick = _a.onCustomerClick, selectedCustomerId = _a.selectedCustomerId;
    var _b = (0, userPreferences_1.useUserPreferences)(), preferences = _b.preferences, setViewMode = _b.setViewMode;
    var densityMode = (0, useDensityMode_1.useDensityMode)().densityMode;
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('name'), sortBy = _d[0], setSortBy = _d[1];
    var _e = (0, react_1.useState)('asc'), sortOrder = _e[0], setSortOrder = _e[1];
    var _f = (0, react_1.useState)(false), showFilters = _f[0], setShowFilters = _f[1];
    var _g = (0, react_1.useState)('all'), statusFilter = _g[0], setStatusFilter = _g[1];
    var _h = (0, react_1.useState)('all'), typeFilter = _h[0], setTypeFilter = _h[1];
    var _j = (0, react_1.useState)(false), useAdvancedSearch = _j[0], setUseAdvancedSearch = _j[1];
    // Search logging hook
    var _k = (0, useSearchLogging_1.useSearchLogging)({
        enableLogging: true,
        enableAnalytics: true,
        enableSuggestions: true
    }), startSearchLog = _k.startSearchLog, completeSearchLog = _k.completeSearchLog, logSearchClick = _k.logSearchClick, _getSearchSuggestions = _k.getSearchSuggestions, _getSuggestedCorrection = _k.getSuggestedCorrection, _recentSearches = _k.recentSearches, _popularSearches = _k.popularSearches;
    // Fetch customers with search logging
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['customers', searchTerm, statusFilter, typeFilter],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var results, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Start logging the search
                        if (searchTerm.trim()) {
                            startSearchLog(searchTerm, {
                                status: statusFilter !== 'all' ? statusFilter : undefined,
                                type: typeFilter !== 'all' ? typeFilter : undefined
                            });
                        }
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.getAll()];
                    case 1:
                        results = _a.sent();
                        if (!searchTerm.trim()) return [3 /*break*/, 3];
                        return [4 /*yield*/, completeSearchLog(searchTerm, results.length, {
                                status: statusFilter !== 'all' ? statusFilter : undefined,
                                type: typeFilter !== 'all' ? typeFilter : undefined
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, results];
                    case 4:
                        err_1 = _a.sent();
                        logger_1.logger.error('Failed to load customers', err_1, 'CustomerList');
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        }); },
    }), _m = _l.data, customers = _m === void 0 ? [] : _m, isLoading = _l.isLoading, error = _l.error;
    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('CustomerList Debug', {
            isLoading: isLoading,
            error: error === null || error === void 0 ? void 0 : error.message,
            customersCount: customers === null || customers === void 0 ? void 0 : customers.length,
            searchTerm: searchTerm,
            statusFilter: statusFilter,
            typeFilter: typeFilter
        }, 'CustomerList');
    }
    // Sort customers (API handles filtering)
    var sortedCustomers = (0, react_1.useMemo)(function () {
        var filtered = __spreadArray([], customers, true);
        // Sort
        filtered.sort(function (a, b) {
            var aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
                    break;
                case 'balance':
                    aValue = a.ar_balance || 0;
                    bValue = b.ar_balance || 0;
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at || '').getTime();
                    bValue = new Date(b.created_at || '').getTime();
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        return filtered;
    }, [customers, sortBy, sortOrder]);
    var toggleSort = function (field) {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    // Enhanced customer click handler with logging
    var handleCustomerClick = function (customer) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!searchTerm) return [3 /*break*/, 2];
                    return [4 /*yield*/, search_service_1.enhancedSearch.logResultClick(customer.id, searchTerm)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    // Log the click using the new search logging service
                    logSearchClick(customer.id);
                    // Call the original click handler
                    onCustomerClick(customer);
                    return [2 /*return*/];
            }
        });
    }); };
    var getSortIcon = function (field) {
        if (sortBy !== field)
            return null;
        return sortOrder === 'asc' ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-4 h-4" });
    };
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-600 mb-4", children: "Failed to load customers" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return window.location.reload(); }, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Retry" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Customers" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: ["(", sortedCustomers.length, ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('list'); }, className: "p-2 rounded ".concat(preferences.viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'), title: "List view", children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('cards'); }, className: "p-2 rounded ".concat(preferences.viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'), title: "Card view", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid3X3, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('dense'); }, className: "p-2 rounded ".concat(preferences.viewMode === 'dense' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'), title: "Dense view", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Rows, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowFilters(!showFilters); }, className: "p-2 rounded ".concat(showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setUseAdvancedSearch(!useAdvancedSearch); }, className: "px-3 py-1 rounded-full text-sm font-medium transition-colors ".concat(useAdvancedSearch
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'), children: useAdvancedSearch ? '🔍 Advanced Search' : '🔍 Standard Search' }), useAdvancedSearch && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Fuzzy matching, typo tolerance, and suggestions enabled" }))] }) }), useAdvancedSearch ? ((0, jsx_runtime_1.jsx)(AdvancedSearchBar_1.AdvancedSearchBar, { onResultsChange: function (results) {
                                    // Handle advanced search results
                                    logger_1.logger.debug('Advanced search results', { resultsCount: results.length }, 'CustomerList');
                                }, placeholder: "Search with fuzzy matching and suggestions...", showModeSelector: true, showSuggestions: true, enableAutoCorrection: true })) : ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { id: "customer-search", name: "customer-search", type: "text", placeholder: "Search customers...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "w-full pl-10 pr-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors" })] }))] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: function (e) { return setStatusFilter(e.target.value); }, className: "w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "active", children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: "inactive", children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "suspended", children: "Suspended" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), (0, jsx_runtime_1.jsxs)("select", { value: typeFilter, onChange: function (e) { return setTypeFilter(e.target.value); }, className: "w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "residential", children: "Residential" }), (0, jsx_runtime_1.jsx)("option", { value: "commercial", children: "Commercial" }), (0, jsx_runtime_1.jsx)("option", { value: "industrial", children: "Industrial" }), (0, jsx_runtime_1.jsx)("option", { value: "healthcare", children: "Healthcare" }), (0, jsx_runtime_1.jsx)("option", { value: "property_management", children: "Property Management" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                        setStatusFilter('all');
                                        setTypeFilter('all');
                                        setSearchTerm('');
                                    }, className: "w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700", children: "Clear Filters" }) })] }))] }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) })), !isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "".concat(preferences.viewMode === 'cards'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-2'), children: [preferences.viewMode === 'list' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-4 flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return toggleSort('name'); }, className: "flex items-center gap-1 hover:text-purple-600", children: ["Name ", getSortIcon('name')] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return toggleSort('status'); }, className: "flex items-center gap-1 hover:text-purple-600", children: ["Status ", getSortIcon('status')] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return toggleSort('balance'); }, className: "flex items-center gap-1 hover:text-purple-600", children: ["Balance ", getSortIcon('balance')] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2 flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return toggleSort('created_at'); }, className: "flex items-center gap-1 hover:text-purple-600", children: ["Created ", getSortIcon('created_at')] }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-2", children: "Actions" })] }), (0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-gray-200", children: sortedCustomers.map(function (customer) { return ((0, jsx_runtime_1.jsx)(CustomerListItem_1.CustomerListItem, { customer: customer, onClick: function () { return handleCustomerClick(customer); }, isSelected: selectedCustomerId === customer.id }, customer.id)); }) })] })), preferences.viewMode === 'cards' && (sortedCustomers.map(function (customer) { return ((0, jsx_runtime_1.jsx)(CustomerCard_1.CustomerCard, { customer: customer, onClick: function () { return handleCustomerClick(customer); }, isSelected: selectedCustomerId === customer.id, densityMode: densityMode }, customer.id)); })), preferences.viewMode === 'dense' && ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-gray-200", children: sortedCustomers.map(function (customer) { return ((0, jsx_runtime_1.jsx)("div", { onClick: function () { return handleCustomerClick(customer); }, className: "p-2 hover:bg-gray-50 cursor-pointer ".concat(selectedCustomerId === customer.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''), children: (0, jsx_runtime_1.jsx)(CustomerStatusBar_1.CustomerStatusBar, { customer: customer, variant: "compact" }) }, customer.id)); }) }) }))] })), !isLoading && sortedCustomers.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 mb-4", children: "No customers found" }), searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? ((0, jsx_runtime_1.jsx)("button", { onClick: function () {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setTypeFilter('all');
                        }, className: "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700", children: "Clear filters" })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Try adding some customers to get started" }))] }))] }));
};
exports.CustomerList = CustomerList;
