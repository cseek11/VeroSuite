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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerSearchSelector;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var ErrorMessage_1 = require("./ErrorMessage");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var secure_api_client_1 = require("@/lib/secure-api-client");
var logger_1 = require("@/utils/logger");
function CustomerSearchSelector(_a) {
    var _this = this;
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? "Search customers by name, email, phone, or address..." : _b, error = _a.error, _c = _a.required, required = _c === void 0 ? false : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.label, label = _e === void 0 ? 'Customer' : _e, _f = _a.showSelectedBox, showSelectedBox = _f === void 0 ? false : _f, _g = _a.apiSource, apiSource = _g === void 0 ? 'secure' : _g;
    var _h = (0, react_1.useState)(''), searchTerm = _h[0], setSearchTerm = _h[1];
    var _j = (0, react_1.useState)(false), isOpen = _j[0], setIsOpen = _j[1];
    var _k = (0, react_1.useState)(null), selectedCustomer = _k[0], setSelectedCustomer = _k[1];
    var inputRef = (0, react_1.useRef)(null);
    var dropdownRef = (0, react_1.useRef)(null);
    // Use simple local search to avoid Supabase authentication issues
    var _l = (0, react_1.useState)([]), localSearchResults = _l[0], setLocalSearchResults = _l[1];
    var _m = (0, react_1.useState)(false), searchLoading = _m[0], setSearchLoading = _m[1];
    // Fetch all customers for local filtering
    var _o = (0, react_query_1.useQuery)({
        queryKey: apiSource === 'secure' ? ['secure-customers'] : ['direct-customers'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var getAuthToken, token, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(apiSource === 'secure')) return [3 /*break*/, 1];
                        return [2 /*return*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        getAuthToken = function () {
                            var _a, _b;
                            try {
                                var authData = localStorage.getItem('verofield_auth');
                                if (authData) {
                                    var parsed = JSON.parse(authData);
                                    if (typeof (parsed === null || parsed === void 0 ? void 0 : parsed.token) === 'string')
                                        return parsed.token;
                                    if (typeof (parsed === null || parsed === void 0 ? void 0 : parsed.accessToken) === 'string')
                                        return parsed.accessToken;
                                    if (typeof ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.state) === null || _a === void 0 ? void 0 : _a.token) === 'string')
                                        return parsed.state.token;
                                    if (typeof ((_b = parsed === null || parsed === void 0 ? void 0 : parsed.state) === null || _b === void 0 ? void 0 : _b.accessToken) === 'string')
                                        return parsed.state.accessToken;
                                }
                            }
                            catch (e) {
                                logger_1.logger.error('Error parsing verofield_auth', e, 'CustomerSearchSelector');
                            }
                            return localStorage.getItem('jwt') || null;
                        };
                        token = getAuthToken();
                        return [4 /*yield*/, fetch('http://localhost:3001/api/v1/crm/accounts', {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'x-tenant-id': localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28',
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 4:
                        logger_1.logger.error('Failed to load customers', new Error("HTTP ".concat(response.status)), 'CustomerSearchSelector');
                        return [2 /*return*/, []];
                }
            });
        }); },
    }), _p = _o.data, allCustomers = _p === void 0 ? [] : _p, customersLoading = _o.isLoading;
    // Enhanced local search with multiple field matching
    var performLocalSearch = function (term) {
        if (!term.trim())
            return allCustomers.slice(0, 10); // Show first 10 when no search
        var searchTerm = term.toLowerCase();
        return allCustomers.filter(function (customer) {
            var _a, _b, _c, _d, _e, _f;
            return (customer.name.toLowerCase().includes(searchTerm) ||
                ((_a = customer.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm)) ||
                ((_b = customer.phone) === null || _b === void 0 ? void 0 : _b.includes(term)) ||
                ((_c = customer.address) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchTerm)) ||
                ((_d = customer.city) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchTerm)) ||
                ((_e = customer.state) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(searchTerm)) ||
                ((_f = customer.zip_code) === null || _f === void 0 ? void 0 : _f.includes(term)) ||
                customer.account_type.toLowerCase().includes(searchTerm));
        }).slice(0, 20); // Limit to 20 results for performance
    };
    var displayCustomers = localSearchResults;
    // Find selected customer when value changes
    (0, react_1.useEffect)(function () {
        if (value && allCustomers.length > 0) {
            var customer = allCustomers.find(function (c) { return c.id === value; });
            setSelectedCustomer(customer || null);
            if (customer) {
                setSearchTerm(customer.name);
            }
        }
        else {
            setSelectedCustomer(null);
            setSearchTerm('');
        }
    }, [value, allCustomers]);
    // Handle click outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            var _a;
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var handleInputChange = function (e) {
        var term = e.target.value;
        setSearchTerm(term);
        setIsOpen(true);
        // Clear selection if user is typing
        if (selectedCustomer && term !== selectedCustomer.name) {
            setSelectedCustomer(null);
            onChange('', null);
        }
        // Perform local search
        setSearchLoading(true);
        var results = performLocalSearch(term);
        setLocalSearchResults(results);
        setSearchLoading(false);
    };
    var handleCustomerSelect = function (customer) {
        setSelectedCustomer(customer);
        setSearchTerm(customer.name);
        setIsOpen(false);
        onChange(customer.id, customer);
    };
    var handleClear = function () {
        var _a;
        setSearchTerm('');
        setSelectedCustomer(null);
        setIsOpen(false);
        onChange('', null);
        setLocalSearchResults([]);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var handleInputFocus = function () {
        setIsOpen(true);
        // Initialize with current search results
        var results = performLocalSearch(searchTerm);
        setLocalSearchResults(results);
    };
    var getCustomerTypeIcon = function (accountType) {
        return accountType === 'commercial' ? (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" });
    };
    var getCustomerTypeColor = function (accountType) {
        return accountType === 'commercial'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800';
    };
    var formatAddress = function (customer) {
        var parts = [
            customer.address,
            customer.city,
            customer.state,
            customer.zip_code
        ].filter(Boolean);
        return parts.join(', ') || 'No address on file';
    };
    var isLoading = searchLoading || customersLoading;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full ".concat(className), children: [label && ((0, jsx_runtime_1.jsxs)("label", { className: "crm-label", children: [label, " ", required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: searchTerm, onChange: handleInputChange, onFocus: handleInputFocus, placeholder: placeholder, className: "crm-input pl-10 pr-10 ".concat(error ? 'border-red-500' : '', " w-full"), "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? 'customer-search-error' : undefined }), searchTerm && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleClear, className: "text-gray-400 hover:text-gray-600 transition-colors", "data-testid": "clear-button", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4", "data-testid": "x-icon" }) }) })), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 right-8 pr-3 flex items-center", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" }) }))] }), error && ((0, jsx_runtime_1.jsx)("div", { id: "customer-search-error", className: "mt-2", children: (0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: error, type: "error" }) })), showSelectedBox && value && selectedCustomer && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-blue-900", children: selectedCustomer.name || 'Selected Customer' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-700", children: selectedCustomer.account_type })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleClear, className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "Change" })] }) })), isOpen && ((0, jsx_runtime_1.jsx)("div", { ref: dropdownRef, className: "absolute z-[9999] w-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto", children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-8 text-center", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "md", text: "Searching customers..." }) })) : displayCustomers.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-8 h-8 mx-auto text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: searchTerm ? 'No customers found' : 'Start typing to search customers' }), searchTerm && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: "Try searching by name, email, phone, or address" }))] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-gray-50 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium text-gray-500", children: [displayCustomers.length, " customer", displayCustomers.length !== 1 ? 's' : '', " found"] }) }), displayCustomers.map(function (customer) { return ((0, jsx_runtime_1.jsx)("div", { onClick: function () { return handleCustomerSelect(customer); }, className: "px-4 py-4 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [getCustomerTypeIcon(customer.account_type), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 truncate", children: customer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700 mt-1 flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 mr-1 mt-0.5 text-gray-500 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "break-words", children: formatAddress(customer) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 flex items-center space-x-2 mt-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium ".concat(getCustomerTypeColor(customer.account_type)), children: customer.account_type }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium ".concat(customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'), children: customer.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 mt-2 flex items-center space-x-4", children: [customer.email && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-3 h-3 mr-1 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] })), customer.phone && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-3 h-3 mr-1 flex-shrink-0" }), customer.phone] }))] })] }), customer.ar_balance > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-right ml-3 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Balance" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium text-orange-600", children: ["$", customer.ar_balance.toFixed(2)] })] }))] }) }, customer.id)); }), allCustomers.length > displayCustomers.length && searchTerm.length < 2 && ((0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 bg-gray-50 text-center border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: ["Type at least 2 characters to search ", allCustomers.length, " customers"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: "Search by name, email, phone, or address" })] }))] })) }))] }));
}
