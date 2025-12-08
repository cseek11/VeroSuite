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
exports.default = CustomerSearchCard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Customer Search Card Component
 *
 * Dashboard card for searching and displaying customers.
 * Supports drag-and-drop interactions with other cards.
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var secure_api_client_1 = require("@/lib/secure-api-client");
var components_1 = require("@/routes/dashboard/components");
var CardInteractionRegistry_1 = require("@/routes/dashboard/utils/CardInteractionRegistry");
var auth_1 = require("@/stores/auth");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var logger_1 = require("@/utils/logger");
function CustomerSearchCard(_a) {
    var _this = this;
    var _b = _a.cardId, cardId = _b === void 0 ? 'customer-search' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var user = (0, auth_1.useAuthStore)().user;
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)(null), selectedCustomer = _e[0], setSelectedCustomer = _e[1];
    // Fetch customers
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['customers', 'search', searchTerm],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var allCustomers, searchLower;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                    case 1:
                        allCustomers = _a.sent();
                        if (!searchTerm.trim()) {
                            return [2 /*return*/, allCustomers.slice(0, 10)]; // Show first 10 when no search
                        }
                        searchLower = searchTerm.toLowerCase();
                        return [2 /*return*/, allCustomers.filter(function (customer) {
                                var _a, _b, _c, _d;
                                return ((_a = customer.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) ||
                                    ((_b = customer.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) ||
                                    ((_c = customer.phone) === null || _c === void 0 ? void 0 : _c.includes(searchTerm)) ||
                                    ((_d = customer.address) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower));
                            })];
                }
            });
        }); },
        staleTime: 2 * 60 * 1000, // 2 minutes
    }), _g = _f.data, customers = _g === void 0 ? [] : _g, isLoading = _f.isLoading;
    // Register card for interactions
    (0, react_1.useEffect)(function () {
        var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
        var config = {
            id: cardId,
            type: 'customer-search',
            canDrag: true,
            dragConfig: {
                dataType: 'customer',
                supportsMultiSelect: false,
                getDragPayload: function (customer) { return ({
                    sourceCardId: cardId,
                    sourceCardType: 'customer-search',
                    sourceDataType: 'customer',
                    data: {
                        id: customer.id,
                        type: 'customer',
                        entity: customer
                    },
                    dragPreview: {
                        title: customer.name || 'Customer',
                        icon: '👤',
                        color: '#3b82f6'
                    },
                    timestamp: Date.now(),
                    userId: (user === null || user === void 0 ? void 0 : user.id) || 'anonymous'
                }); },
                getDragPreview: function (customer) { return ({
                    title: customer.name || 'Customer',
                    icon: '👤',
                    color: '#3b82f6'
                }); }
            }
        };
        registry.registerCard(config);
        logger_1.logger.debug('Registered Customer Search Card for interactions', { cardId: cardId });
        return function () {
            registry.unregisterCard(cardId);
        };
    }, [cardId, user]);
    var handleCustomerClick = function (customer) {
        setSelectedCustomer(customer);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "customer-search-card ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Customer Search" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: [customers.length, " found"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search customers...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 overflow-y-auto", style: { maxHeight: '400px' }, children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" }) })) : customers.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-500", children: searchTerm ? 'No customers found' : 'Start typing to search customers' })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: customers.map(function (customer) { return ((0, jsx_runtime_1.jsx)(components_1.DraggableContent, { cardId: cardId, dataType: "customer", data: customer, className: "cursor-grab active:cursor-grabbing", getDragPreview: function (data) {
                            var customer = data;
                            return {
                                title: (customer === null || customer === void 0 ? void 0 : customer.name) || 'Customer',
                                icon: '👤',
                                color: '#3b82f6'
                            };
                        }, children: (0, jsx_runtime_1.jsxs)("div", { onClick: function (e) {
                                // Only handle click if not dragging
                                if (!e.defaultPrevented) {
                                    handleCustomerClick(customer);
                                }
                            }, onMouseDown: function (e) {
                                // Allow drag to start without triggering click
                                if (e.button === 0) {
                                    // Left click - allow drag
                                }
                            }, className: "\n                    p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 \n                    transition-all duration-200\n                    ".concat((selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id) === customer.id ? 'border-blue-500 bg-blue-50' : '', "\n                  "), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-blue-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 truncate", children: customer.name || 'Unnamed Customer' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 mt-1 space-y-1", children: [customer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] })), customer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: customer.phone })] })), customer.address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.address })] }))] }), customer.account_type && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800", children: customer.account_type }) }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 text-xs text-gray-400 italic", children: "Drag to schedule, create invoice, or generate report" })] }) }, customer.id)); }) })) }), selectedCustomer && ((0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 mb-1", children: "Selected Customer" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600", children: selectedCustomer.name })] }) }))] }));
}
