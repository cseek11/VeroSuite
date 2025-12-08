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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomersPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
require("leaflet/dist/leaflet.css");
var CustomerListView_1 = __importDefault(require("./CustomerListView"));
var SearchBar_1 = __importDefault(require("./SearchBar"));
var CustomerSearchResults_1 = __importDefault(require("./CustomerSearchResults"));
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var secure_api_client_1 = require("@/lib/secure-api-client");
var search_integration_1 = require("@/lib/search-integration");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function CustomersPage() {
    var _this = this;
    var _a = (0, react_1.useState)(null), selectedCustomer = _a[0], setSelectedCustomer = _a[1];
    var _b = (0, react_1.useState)(false), showHistory = _b[0], setShowHistory = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('all'), filterType = _d[0], setFilterType = _d[1];
    // const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set()); // Unused - kept for potential future use
    var _e = (0, react_1.useState)('list'), viewMode = _e[0], setViewMode = _e[1];
    var _f = (0, react_1.useState)(false), showSearchResults = _f[0], setShowSearchResults = _f[1];
    var searchInputRef = (0, react_1.useRef)(null);
    // Search integration
    var _g = (0, search_integration_1.useSearchIntegration)({ debounceMs: 300 }), searchResults = _g.results, searchLoading = _g.loading, searchError = _g.error, search = _g.search, clearSearch = _g.clearAll, refreshCurrentSearch = _g.refreshCurrentSearch;
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch customers from backend API
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['secure-customers'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, secure_api_client_1.secureApiClient.getAllAccounts()];
            });
        }); },
    }), _j = _h.data, customers = _j === void 0 ? [] : _j, isLoading = _h.isLoading, error = _h.error, refetch = _h.refetch;
    // Listen for real-time customer updates
    (0, react_1.useEffect)(function () {
        var handleCustomerUpdate = function (event) {
            var customerId = event.detail.customerId;
            logger_1.logger.debug('Real-time customer update received', { customerId: customerId }, 'CustomersPage');
            // Invalidate and refetch customer data
            queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
            queryClient.invalidateQueries({ queryKey: ['search'] });
            queryClient.invalidateQueries({ queryKey: ['unified-search'] });
            // If we have a current search, refresh it
            if (searchTerm.trim()) {
                refreshCurrentSearch();
            }
        };
        var handleCustomerCreate = function (_event) {
            logger_1.logger.debug('Real-time customer creation received', {}, 'CustomersPage');
            queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
            queryClient.invalidateQueries({ queryKey: ['search'] });
            queryClient.invalidateQueries({ queryKey: ['unified-search'] });
        };
        var handleCustomerDelete = function (_event) {
            logger_1.logger.debug('Real-time customer deletion received', {}, 'CustomersPage');
            queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
            queryClient.invalidateQueries({ queryKey: ['search'] });
            queryClient.invalidateQueries({ queryKey: ['unified-search'] });
        };
        // Add event listeners
        window.addEventListener('customerUpdated', handleCustomerUpdate);
        window.addEventListener('customerCreated', handleCustomerCreate);
        window.addEventListener('customerDeleted', handleCustomerDelete);
        // Cleanup
        return function () {
            window.removeEventListener('customerUpdated', handleCustomerUpdate);
            window.removeEventListener('customerCreated', handleCustomerCreate);
            window.removeEventListener('customerDeleted', handleCustomerDelete);
        };
    }, [queryClient, search, searchTerm]);
    // ============================================================================
    // SEARCH HANDLERS
    // ============================================================================
    var handleSearch = function (term) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSearchTerm(term);
                    if (!term.trim()) return [3 /*break*/, 2];
                    setShowSearchResults(true);
                    return [4 /*yield*/, search(term)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    setShowSearchResults(false);
                    clearSearch();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSearchResultSelect = function (account) {
        setSelectedCustomer(account);
        setShowSearchResults(false);
        setSearchTerm('');
    };
    // Wrapper for SearchBar's onResultSelect which passes SearchResult
    var handleSearchBarResultSelect = function (result) {
        // Extract first account from SearchResult data array
        if (result.data && result.data.length > 0 && result.data[0]) {
            handleSearchResultSelect(result.data[0]);
        }
    };
    var handleViewCustomer = function (account) {
        handleSearchResultSelect(account);
    };
    var handleEditCustomer = function (account) {
        handleSearchResultSelect(account);
        // TODO: Open edit modal or navigate to edit page
    };
    var handleDeleteCustomer = function (account) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete ".concat(account.name, "?"))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, secure_api_client_1.secureApiClient.deleteAccount(account.id)];
                case 2:
                    _a.sent();
                    queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
                    setShowSearchResults(false);
                    setSearchTerm('');
                    // Dispatch custom event for real-time updates
                    window.dispatchEvent(new CustomEvent('customerDeleted', {
                        detail: { customerId: account.id }
                    }));
                    // Show success message
                    logger_1.logger.debug('Customer deleted successfully', { customerName: account.name }, 'CustomersPage');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete customer', error_1, 'CustomersPage');
                    toast_1.toast.error('Failed to delete customer. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCallCustomer = function (account) {
        if (account.phone) {
            window.open("tel:".concat(account.phone), '_self');
        }
    };
    var handleEmailCustomer = function (account) {
        if (account.email) {
            window.open("mailto:".concat(account.email), '_self');
        }
    };
    // Fetch service history for selected customer
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['service-history', selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!(selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id))
                    return [2 /*return*/, []];
                // TODO: Implement enhanced service history API
                return [2 /*return*/, []];
            });
        }); },
        enabled: !!(selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id),
    }).data, serviceHistory = _k === void 0 ? [] : _k;
    var handleViewHistory = function (customer) {
        setSelectedCustomer(customer);
        setShowHistory(true);
    };
    // Extract accounts from SearchResult[] - flatten all result.data arrays
    var searchAccounts = (0, react_1.useMemo)(function () {
        if (!Array.isArray(searchResults)) {
            return [];
        }
        return searchResults.flatMap(function (result) { return (result && 'data' in result && Array.isArray(result.data)) ? result.data : []; });
    }, [searchResults]);
    var filteredCustomers = (0, react_1.useMemo)(function () {
        if (!Array.isArray(customers)) {
            return [];
        }
        return customers.filter(function (customer) {
            var _a, _b;
            var matchesSearch = ((_a = customer.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((_b = customer.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase()));
            var matchesFilter = filterType === 'all' || customer.account_type === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [customers, searchTerm, filterType]);
    // Maintain focus on search input if it gets lost due to re-renders
    (0, react_1.useEffect)(function () {
        var _a;
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
            // Check if the search input was previously focused
            var wasSearchFocused = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.hasAttribute('data-search-input');
            if (wasSearchFocused) {
                searchInputRef.current.focus();
            }
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4 flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6 text-indigo-600" }), "Customers"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 mt-1 text-sm", children: "Manage your customer relationships and service history" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { className: "bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "h-4 w-4" }), "Add Customer"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return refetch(); }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-1 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-3 mb-3 flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(SearchBar_1.default, { placeholder: "Search customers by name, email, phone, or address...", onSearchChange: handleSearch, onResultSelect: handleSearchBarResultSelect, showHistory: true, showRecentSearches: true, maxResults: 10, debounceMs: 300, className: "w-full" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("select", { value: filterType, onChange: function (e) { return setFilterType(e.target.value); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "commercial", children: "Commercial" }), (0, jsx_runtime_1.jsx)("option", { value: "residential", children: "Residential" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('list'); }, className: "px-3 py-2 text-sm transition-colors ".concat(viewMode === 'list'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:text-gray-900'), title: "List View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('grid'); }, className: "px-3 py-2 text-sm transition-colors ".concat(viewMode === 'grid'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:text-gray-900'), title: "Grid View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid3X3, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('map'); }, className: "px-3 py-2 text-sm transition-colors ".concat(viewMode === 'map'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:text-gray-900'), title: "Map View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                        setSearchTerm('');
                                        setFilterType('all');
                                        setShowSearchResults(false);
                                        clearSearch();
                                    }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4" }), "Clear"] })] })] }) }), showSearchResults && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4 h-64 overflow-hidden flex flex-col flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900", children: ["Search Results", searchAccounts.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-2 text-sm font-normal text-gray-500", children: ["(", searchAccounts.length, " found)"] }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                    setShowSearchResults(false);
                                    setSearchTerm('');
                                    clearSearch();
                                }, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto min-h-0", children: (0, jsx_runtime_1.jsx)(CustomerSearchResults_1.default, { results: searchAccounts, loading: searchLoading, error: searchError, onView: handleViewCustomer, onEdit: handleEditCustomer, onDelete: handleDeleteCustomer, onCall: handleCallCustomer, onEmail: handleEmailCustomer, showActions: true, compact: viewMode === 'grid' }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-h-0", children: (0, jsx_runtime_1.jsx)(CustomerListView_1.default, { customers: filteredCustomers, onViewHistory: handleViewHistory, onEdit: function (customer) {
                        logger_1.logger.debug('Edit customer requested', { customerId: customer.id }, 'CustomersPage');
                        // TODO: Implement edit functionality
                    }, onViewDetails: function (customer) {
                        logger_1.logger.debug('View customer details requested', { customerId: customer.id }, 'CustomersPage');
                        // TODO: Implement view details functionality
                    }, 
                    // onSelectionChange={setSelectedCustomers} // Commented out - selectedCustomers is unused
                    isLoading: isLoading, error: error }) }), showHistory && selectedCustomer && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-900", children: ["Service History - ", selectedCustomer.name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Complete service and maintenance history" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowHistory(false); }, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 overflow-y-auto max-h-[calc(80vh-120px)]", children: serviceHistory.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: serviceHistory.map(function (service) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900", children: service.service_type || 'Service' }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(service.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : service.status === 'scheduled'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'), children: service.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Date:" }), " ", new Date(service.scheduled_date).toLocaleDateString()] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Technician:" }), " ", service.technician || 'Not assigned'] })] }), service.notes && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-700 mt-2", children: service.notes }))] }, service.id)); }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No Service History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "No service history found for this customer." })] })) })] }) }))] }));
}
