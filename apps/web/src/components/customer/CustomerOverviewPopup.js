"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_leaflet_1 = require("react-leaflet");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var ui_1 = require("@/components/ui");
var logger_1 = require("@/utils/logger");
var CustomerOverviewPopup = function (_a) {
    var _b;
    var customerId = _a.customerId;
    var _c = (0, react_1.useState)(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = (0, react_1.useState)(null), editedCustomer = _d[0], setEditedCustomer = _d[1];
    var _e = (0, react_1.useState)(''), newTag = _e[0], setNewTag = _e[1];
    var _f = (0, react_1.useState)(['VIP', 'Quarterly Service', 'High Priority']), customerTags = _f[0], setCustomerTags = _f[1];
    // Fetch customer data
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['customer', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.customers.getById(customerId); },
        enabled: !!customerId
    }), customer = _g.data, isLoading = _g.isLoading, error = _g.error;
    // Initialize edited customer when data loads
    react_1.default.useEffect(function () {
        if (customer && !editedCustomer) {
            setEditedCustomer(customer);
        }
    }, [customer, editedCustomer]);
    // Analytics calculations
    var analytics = (0, react_1.useMemo)(function () {
        var _a, _b;
        if (!customer)
            return {
                totalServices: 0,
                totalSpend: 0,
                lastServiceDate: null,
                averageServiceCost: 0,
                servicesThisYear: 0,
                activeContracts: 0,
                totalContractValue: 0,
                daysSinceLastService: null
            };
        var completedServices = (customer.serviceHistory || []).filter(function (s) {
            return s.status === 'completed' && !!s.service_date;
        });
        var totalSpend = completedServices.reduce(function (sum, service) { return sum + (service.cost || 0); }, 0);
        var lastService = __spreadArray([], completedServices, true).sort(function (a, b) { return new Date(b.service_date).getTime() - new Date(a.service_date).getTime(); })[0];
        var currentYear = new Date().getFullYear();
        var servicesThisYear = completedServices.filter(function (s) { return new Date(s.service_date).getFullYear() === currentYear; }).length;
        var activeContracts = ((_a = customer.contracts) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c.status === 'active'; }).length) || 0;
        var totalContractValue = ((_b = customer.contracts) === null || _b === void 0 ? void 0 : _b.reduce(function (sum, contract) { return sum + (contract.value || 0); }, 0)) || 0;
        return {
            totalServices: completedServices.length,
            totalSpend: totalSpend,
            lastServiceDate: (lastService === null || lastService === void 0 ? void 0 : lastService.service_date) || null,
            averageServiceCost: completedServices.length > 0 ? totalSpend / completedServices.length : 0,
            servicesThisYear: servicesThisYear,
            activeContracts: activeContracts,
            totalContractValue: totalContractValue,
            daysSinceLastService: lastService
                ? Math.floor((Date.now() - new Date(lastService.service_date).getTime()) / (1000 * 60 * 60 * 24))
                : null
        };
    }, [customer]);
    // Get customer coordinates for map
    var getCustomerCoordinates = function () {
        // Default coordinates (you can replace with actual geocoding)
        return [40.7128, -74.0060];
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editedCustomer)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.customers.update(customerId, editedCustomer)];
                case 2:
                    _a.sent();
                    setIsEditing(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Error updating customer', error_1, 'CustomerOverviewPopup');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () {
        if (customer) {
            setEditedCustomer(customer);
        }
        setIsEditing(false);
    };
    var addTag = function () {
        if (newTag.trim() && !customerTags.includes(newTag.trim())) {
            setCustomerTags(__spreadArray(__spreadArray([], customerTags, true), [newTag.trim()], false));
            setNewTag('');
        }
    };
    var removeTag = function (tagToRemove) {
        setCustomerTags(customerTags.filter(function (tag) { return tag !== tagToRemove; }));
    };
    // Loading state
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-6 h-6 animate-spin text-purple-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Loading customer information..." })] }) }));
    }
    // Error state
    if (error || !customer) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Error Loading Customer" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Unable to load customer information. Please try again." })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "overview-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overview-main", children: [(0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-blue-100/70 hover:bg-blue-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-card-header", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Customer Information" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: !isEditing ? ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsEditing(true); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-3 w-3 mr-1" }), "Edit"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleSave, className: "bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-md hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3 mr-1" }), "Save"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleCancel, className: "px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3 mr-1" }), "Cancel"] })] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "Name" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.name) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { name: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.name }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "Email" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.email) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { email: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.email }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "Phone" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.phone) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { phone: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.phone }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "Address" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.address) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { address: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.address || 'Not provided' }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "City" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.city) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { city: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.city }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-field", children: [(0, jsx_runtime_1.jsx)("label", { className: "info-label", children: "State" }), isEditing ? ((0, jsx_runtime_1.jsx)(ui_1.Input, { value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.state) || '', onChange: function (value) { return setEditedCustomer(editedCustomer ? __assign(__assign({}, editedCustomer), { state: value }) : null); } })) : ((0, jsx_runtime_1.jsx)("div", { className: "info-value", children: customer.state }))] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Card, { className: "info-card bg-white hover:bg-gray-50/50 transition-all duration-200", children: (0, jsx_runtime_1.jsx)("div", { className: "map-container", style: { height: '400px', width: '100%' }, children: (0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: getCustomerCoordinates(), zoom: 13, style: { height: '100%', width: '100%' }, children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), (0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: getCustomerCoordinates(), children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Popup, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: customer.name }), (0, jsx_runtime_1.jsx)("br", {}), customer.address, (0, jsx_runtime_1.jsx)("br", {}), customer.city, ", ", customer.state, " ", customer.zip_code] }) }) })] }) }) }), customer.locations && customer.locations.length > 0 && ((0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-red-100/70 hover:bg-red-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "info-card-header", children: (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Service Locations" }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: customer.locations.map(function (location, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: location.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [location.address_line1, ", ", location.city, ", ", location.state] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", children: location.service_area_id ? 'Service Area' : 'Primary' })] }, location.id || index)); }) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-sidebar", children: [(0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-green-100/70 hover:bg-green-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "info-card-header", children: (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Quick Stats" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Total Services" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900", children: analytics.totalServices })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Total Spend" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: ["$", analytics.totalSpend.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Active Contracts" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900", children: analytics.activeContracts })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "AR Balance" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold ".concat((customer === null || customer === void 0 ? void 0 : customer.ar_balance) > 0 ? 'text-red-600' : 'text-green-600'), children: ["$", ((_b = customer === null || customer === void 0 ? void 0 : customer.ar_balance) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '0.00'] })] })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-orange-100/70 hover:bg-orange-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "info-card-header", children: (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Recent Activity" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [analytics.lastServiceDate && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-blue-500" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: "Last Service" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600 text-sm", children: new Date(analytics.lastServiceDate).toLocaleDateString() })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4 text-green-500" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: "This Year" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600 text-sm", children: analytics.servicesThisYear })] })] })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-yellow-100/70 hover:bg-yellow-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "info-card-header", children: (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Tags" }) }), (0, jsx_runtime_1.jsx)("div", { className: "tags-container mb-3", children: customerTags.map(function (tag, index) { return ((0, jsx_runtime_1.jsx)(ui_1.Chip, { variant: "outline", className: "tag", onRemove: function () { return removeTag(tag); }, children: tag }, index)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Add tag...", value: newTag, onChange: function (value) {
                                            setNewTag(value);
                                            if (value.endsWith('\n')) {
                                                addTag();
                                            }
                                        }, className: "flex-1" }), (0, jsx_runtime_1.jsx)("button", { onClick: addTag, className: "px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-sm", children: "Add" })] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "info-card bg-amber-100/70 hover:bg-amber-100/90 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "info-card-header", children: (0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h6", className: "info-card-title", children: "Property Info" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Type" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-sm", children: (customer === null || customer === void 0 ? void 0 : customer.property_type) || 'Not specified' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Size" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-sm", children: (customer === null || customer === void 0 ? void 0 : customer.property_size) || 'Not specified' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Account" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: (customer === null || customer === void 0 ? void 0 : customer.account_type) === 'commercial' ? 'default' : 'outline', children: customer === null || customer === void 0 ? void 0 : customer.account_type })] })] })] })] })] }));
};
exports.default = CustomerOverviewPopup;
