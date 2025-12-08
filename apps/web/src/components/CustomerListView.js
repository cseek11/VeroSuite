"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
var useCardResponsive_1 = require("@/hooks/useCardResponsive");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var react_query_1 = require("@tanstack/react-query");
var CustomerPagePopup_1 = __importDefault(require("./CustomerPagePopup"));
// Agreement configuration
var AGREEMENT_CONFIG = {
    annual_pest_control: { name: 'Annual Pest Control', color: 'bg-green-500', tooltip: 'Annual Pest Control Agreement' },
    monthly_pest_control: { name: 'Monthly Pest Control', color: 'bg-blue-500', tooltip: 'Monthly Pest Control Agreement' },
    annual_termite_renewal: { name: 'Annual Termite Renewal', color: 'bg-yellow-500', tooltip: 'Annual Termite Renewal Agreement' },
    termite_bait_stations: { name: 'Termite Bait Stations', color: 'bg-orange-500', tooltip: 'Termite Bait Stations Agreement' },
    rat_monitoring: { name: 'Active Rat Monitoring', color: 'bg-purple-500', tooltip: 'Active Rat Monitoring Agreement' }
};
var CustomerListView = function (_a) {
    var customers = _a.customers, onViewHistory = _a.onViewHistory, onEdit = _a.onEdit, _onViewDetails = _a.onViewDetails, onSelectionChange = _a.onSelectionChange, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.error, error = _c === void 0 ? null : _c;
    var _d = (0, react_1.useState)(new Set()), selectedCustomers = _d[0], setSelectedCustomers = _d[1];
    var _e = (0, react_1.useState)('overview'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_1.useState)(new Set()), expandedRows = _f[0], setExpandedRows = _f[1];
    var _g = (0, react_1.useState)(null), mapPopupCustomerId = _g[0], setMapPopupCustomerId = _g[1];
    var _h = (0, react_1.useState)(null), selectedCustomerForPopup = _h[0], setSelectedCustomerForPopup = _h[1];
    // Get responsive state - we'll need to pass cardId from parent
    var responsiveState = (0, useCardResponsive_1.useCardResponsive)({
        cardId: 'customers-page', // This should be passed as prop in real implementation
        threshold: 50
    });
    // Fetch account details using enhanced API
    var accountDetails = (0, react_query_1.useQuery)({
        queryKey: ['enhanced-account-details', customers === null || customers === void 0 ? void 0 : customers.length],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var customersCount, details;
            return __generator(this, function (_a) {
                if (!customers)
                    return [2 /*return*/, []];
                customersCount = Array.isArray(customers) ? customers.length : 0;
                logger_1.logger.debug('Fetching account details', { customersCount: customersCount }, 'CustomerListView');
                details = Array.isArray(customers) ? customers.map(function (customer) { return ({
                    accountId: customer.id,
                    agreements: [],
                    overdue_days: 0
                }); }) : [];
                return [2 /*return*/, details];
            });
        }); },
        enabled: !!customers && Array.isArray(customers) && customers.length > 0,
    }).data;
    // Agreement indicator component
    var AgreementIndicator = function (_a) {
        var agreementType = _a.agreementType;
        var config = AGREEMENT_CONFIG[agreementType];
        // If config is undefined, use a default fallback
        if (!config) {
            logger_1.logger.warn('Unknown agreement type', { agreementType: agreementType }, 'CustomerListView');
            return ((0, jsx_runtime_1.jsx)("div", { className: "cursor-help", title: "Unknown Agreement: ".concat(agreementType), children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 120", className: "w-4 h-4 bg-white shadow-sm", children: (0, jsx_runtime_1.jsx)("path", { d: "M50 0 L100 20 L100 70 L50 120 L0 70 L0 20 Z", fill: "currentColor", className: "text-gray-500" }) }) }));
        }
        return ((0, jsx_runtime_1.jsx)("div", { className: "cursor-help", title: config.tooltip, children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 120", className: "w-4 h-4 bg-white shadow-sm", children: (0, jsx_runtime_1.jsx)("path", { d: "M50 0 L100 20 L100 70 L50 120 L0 70 L0 20 Z", fill: "currentColor", className: config.color.replace('bg-', 'text-') }) }) }));
    };
    // Agreement indicators component
    var AgreementIndicators = function (_a) {
        var customer = _a.customer;
        var customerDetails = accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.find(function (d) { return d.accountId === customer.id; });
        var agreements = (customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.agreements) || [];
        var overdueDays = (customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.overdue_days) || 0;
        // More accurate overdue detection: consider both overdue payments AND positive AR balance
        var hasOverduePayments = overdueDays > 30;
        var hasOutstandingBalance = (customer.ar_balance || 0) > 0;
        var isOverdue = hasOverduePayments || hasOutstandingBalance;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('AgreementIndicators render', {
                customerName: customer.name,
                agreements: agreements,
                overdueDays: overdueDays,
                hasOverduePayments: hasOverduePayments,
                hasOutstandingBalance: hasOutstandingBalance,
                arBalance: customer.ar_balance,
                isOverdue: isOverdue
            }, 'CustomerListView');
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [agreements.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: agreements.map(function (agreementType, index) { return ((0, jsx_runtime_1.jsx)(AgreementIndicator, { agreementType: agreementType }, index)); }) })), isOverdue && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: hasOutstandingBalance && hasOverduePayments ? 'Overdue' :
                                hasOutstandingBalance ? 'Balance Due' : 'Overdue' })] }))] }));
    };
    // Use customers as they come in (filtering is handled by parent component)
    var filteredCustomers = customers;
    // Handle checkbox selection
    var handleSelectCustomer = function (customerId, checked) {
        var newSelected = new Set(selectedCustomers);
        if (checked) {
            newSelected.add(customerId);
        }
        else {
            newSelected.delete(customerId);
        }
        setSelectedCustomers(newSelected);
        onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(newSelected);
    };
    // Handle select all
    var handleSelectAll = function (checked) {
        var newSelected = checked ? new Set(filteredCustomers.map(function (c) { return c.id; })) : new Set();
        setSelectedCustomers(newSelected);
        onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(newSelected);
    };
    // Toggle row expansion
    var toggleRowExpansion = function (customerId) {
        var newExpanded = new Set(expandedRows);
        if (newExpanded.has(customerId)) {
            newExpanded.delete(customerId);
        }
        else {
            newExpanded.add(customerId);
        }
        setExpandedRows(newExpanded);
        // Dispatch custom event for auto-scroll
        setTimeout(function () {
            window.dispatchEvent(new CustomEvent('customerRowExpanded', {
                detail: { customerId: customerId, isExpanded: newExpanded.has(customerId) }
            }));
        }, 100);
    };
    // Get selected customers data
    var selectedCustomersData = (0, react_1.useMemo)(function () {
        if (!Array.isArray(customers)) {
            return [];
        }
        return customers.filter(function (customer) { return selectedCustomers.has(customer.id); });
    }, [customers, selectedCustomers]);
    // Tab configuration
    var tabs = [
        { id: 'overview', label: 'Overview', icon: lucide_react_1.Users, count: selectedCustomersData.length },
        { id: 'jobs', label: 'Jobs/Service History', icon: lucide_react_1.Calendar },
        { id: 'billing', label: 'Billing/AR', icon: lucide_react_1.DollarSign },
        { id: 'notes', label: 'Notes/Communications', icon: lucide_react_1.MessageSquare },
        { id: 'documents', label: 'Documents', icon: lucide_react_1.FolderOpen }
    ];
    // Check if all filtered customers are selected
    var allSelected = filteredCustomers.length > 0 &&
        filteredCustomers.every(function (customer) { return selectedCustomers.has(customer.id); });
    // Check if some filtered customers are selected (unused but kept for potential future use)
    // const someSelected = filteredCustomers.some(customer => selectedCustomers.has(customer.id));
    // Get customer coordinates
    var getCustomerCoordinates = function (customer) {
        var coordinates = {
            'Pittsburgh': [40.4406, -79.9959],
            'Monroeville': [40.4321, -79.7889],
            'Cranberry Twp': [40.6847, -80.1072],
            'Greensburg': [40.3015, -79.5389],
            'Butler': [40.8612, -79.8953],
            'Washington': [40.1734, -80.2462],
            'Beaver': [40.6953, -80.3109]
        };
        return coordinates[customer.city || ''] || [40.4406, -79.9959];
    };
    // Get the customer object for the map popup
    var mapPopupCustomer = Array.isArray(customers) ? customers.find(function (c) { return c.id === mapPopupCustomerId; }) || null : null;
    // Show loading state
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Loading Customers..." }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Please wait while we fetch your customer data." })] }) }) }));
    }
    // Show error state
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Error Loading Customers" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-4", children: (error === null || error === void 0 ? void 0 : error.message) || 'An error occurred while loading customer data.' }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return window.location.reload(); }, variant: "outline", className: "text-indigo-600 border-indigo-600 hover:bg-indigo-50", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col space-y-4", children: [selectedCustomers.size > 0 && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-0 sticky-tabs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 bg-gray-50", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-gray-900", children: [selectedCustomers.size, " Customer", selectedCustomers.size !== 1 ? 's' : '', " Selected"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                            var newSelected = new Set();
                                            setSelectedCustomers(newSelected);
                                            onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(newSelected);
                                        }, className: "h-8 px-3 text-sm", children: "Clear Selection" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex overflow-x-auto tab-navigation", children: tabs.map(function (tab) {
                                    var Icon = tab.icon;
                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "\n                      tab-button\n                      ".concat(activeTab === tab.id ? 'active' : '', "\n                    "), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), tab.label, tab.count && ((0, jsx_runtime_1.jsx)("span", { className: "tab-count", children: tab.count }))] }, tab.id));
                                }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tab-content", children: [activeTab === 'overview' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Selected Customers Overview" }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overview-card blue", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium", children: "Total Customers" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, children: selectedCustomersData.length })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-card green", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium", children: "Commercial" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, children: selectedCustomersData.filter(function (c) { return c.account_type === 'commercial'; }).length })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-card purple", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium", children: "Residential" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, children: selectedCustomersData.filter(function (c) { return c.account_type === 'residential'; }).length })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-card", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-2", children: "Selected Customers:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: selectedCustomersData.map(function (customer) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: customer.name }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: customer.account_type === 'commercial' ? 'default' : 'secondary', className: "text-xs", children: customer.account_type })] }, customer.id)); }) })] })] })), activeTab === 'jobs' && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Jobs & Service History" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Service history for selected customers will be displayed here." })] })), activeTab === 'billing' && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Billing & AR Information" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Billing and accounts receivable data for selected customers will be displayed here." })] })), activeTab === 'notes' && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Notes & Communications" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Notes and communication history for selected customers will be displayed here." })] })), activeTab === 'documents' && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "Documents" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Documents and files for selected customers will be displayed here." })] }))] })] })), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-0 flex-1 flex flex-col max-h-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full customer-table ".concat(responsiveState.isMobile ? 'table-auto' : 'table-fixed'), children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: responsiveState.isMobile ? 'w-8' : '', children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: allSelected, onChange: function (checked) { return handleSelectAll(checked); }, className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("th", { className: responsiveState.isMobile ? 'w-32' : '', children: "Customer" }), !responsiveState.isMobile && (0, jsx_runtime_1.jsx)("th", { children: "Type" }), !responsiveState.isMobile && (0, jsx_runtime_1.jsx)("th", { className: "contact-column", children: "Contact" }), !responsiveState.isMobile && (0, jsx_runtime_1.jsx)("th", { className: "location-column", children: "Location" }), !responsiveState.isMobile && (0, jsx_runtime_1.jsx)("th", { children: "AR Balance" }), (0, jsx_runtime_1.jsx)("th", { className: responsiveState.isMobile ? 'w-16' : '', children: "Actions" }), (0, jsx_runtime_1.jsx)("th", { className: "w-8" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredCustomers.map(function (customer) {
                                        var _a;
                                        var isExpanded = expandedRows.has(customer.id);
                                        var customerDetails = accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.find(function (d) { return d.accountId === customer.id; });
                                        var overdueDays = (customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.overdue_days) || 0;
                                        var hasOverduePayments = overdueDays > 30;
                                        var hasOutstandingBalance = (customer.ar_balance || 0) > 0;
                                        var isOverdue = hasOverduePayments || hasOutstandingBalance;
                                        return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsxs)("tr", { className: "".concat(selectedCustomers.has(customer.id) ? 'selected' : '', " ").concat(isExpanded ? 'expanded-main-row' : '', " ").concat(isOverdue ? 'border-l-4 border-l-red-500' : ''), children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: selectedCustomers.has(customer.id), onChange: function (checked) { return handleSelectCustomer(customer.id, checked); }, className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedCustomerForPopup(customer.id); }, className: "text-left hover:text-purple-600 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "h-4 w-4 text-blue-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900", children: customer.name })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1", children: (0, jsx_runtime_1.jsx)(AgreementIndicators, { customer: customer }) })] }) }), !responsiveState.isMobile && ((0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: customer.account_type === 'commercial' ? 'default' : 'secondary', className: "text-xs", children: customer.account_type }) })), !responsiveState.isMobile && ((0, jsx_runtime_1.jsx)("td", { className: "contact-column", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate max-w-32", children: customer.email || 'No email' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: customer.phone || 'No phone' })] })] }) })), !responsiveState.isMobile && ((0, jsx_runtime_1.jsx)("td", { className: "location-column", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [customer.city, ", ", customer.state] })] }) })), !responsiveState.isMobile && ((0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-3 w-3 text-gray-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium ".concat(customer.ar_balance > 0 ? 'text-red-600' : 'text-green-600'), children: ["$", ((_a = customer.ar_balance) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '0.00'] })] }) })), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("div", { className: "action-buttons ".concat(responsiveState.isMobile ? 'flex flex-col gap-1' : 'flex gap-2'), children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return onViewHistory(customer); }, className: "action-button ".concat(responsiveState.isMobile ? 'w-full text-xs px-2 py-1' : ''), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-3 w-3" }), !responsiveState.isMobile && 'History'] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return onEdit(customer); }, className: "action-button ".concat(responsiveState.isMobile ? 'w-full text-xs px-2 py-1' : ''), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-3 w-3" }), !responsiveState.isMobile && 'Edit'] })] }) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return toggleRowExpansion(customer.id); }, className: "p-1 hover:bg-gray-100 rounded transition-colors", children: isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "h-4 w-4 text-gray-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-gray-500" })) }) })] }), isExpanded && ((0, jsx_runtime_1.jsx)("tr", { className: "expanded-row expanded-active ".concat(isOverdue ? 'border-l-4 border-l-red-500' : ''), "data-customer-id": customer.id, children: (0, jsx_runtime_1.jsx)("td", { colSpan: 8, className: "p-0", children: (0, jsx_runtime_1.jsx)("div", { className: "expanded-content max-h-48 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900 mb-1 text-xs", children: "Quick Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-1", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", className: "justify-start h-5 text-xs px-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3 mr-1" }), "Schedule"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", className: "justify-start h-5 text-xs px-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-3 w-3 mr-1" }), "Invoice"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", className: "justify-start h-5 text-xs px-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "h-3 w-3 mr-1" }), "Message"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", className: "justify-start h-5 text-xs px-2", onClick: function () {
                                                                                                        if (mapPopupCustomerId === customer.id) {
                                                                                                            setMapPopupCustomerId(null);
                                                                                                        }
                                                                                                        else {
                                                                                                            setMapPopupCustomerId(customer.id);
                                                                                                        }
                                                                                                    }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3 mr-1" }), mapPopupCustomerId === customer.id ? 'Hide' : 'Map'] })] })] }), mapPopupCustomerId !== customer.id && ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-2 grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900 mb-1 text-xs", children: "Recent Activity" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsx)("div", { children: "Last service: 2 weeks ago" }), (0, jsx_runtime_1.jsx)("div", { children: "Last payment: 1 month ago" }), (0, jsx_runtime_1.jsx)("div", { children: "Next scheduled: Next week" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900 mb-1 text-xs", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: (0, jsx_runtime_1.jsx)("p", { children: "Customer prefers morning appointments. Has a dog in the backyard." }) })] })] }))] }) }), mapPopupCustomerId === customer.id && ((0, jsx_runtime_1.jsxs)("div", { className: "w-48 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900 text-xs", children: "Customer Location" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setMapPopupCustomerId(null); }, className: "p-1 hover:bg-gray-100 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 text-gray-600" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-32 rounded-lg overflow-hidden border border-gray-200", children: mapPopupCustomer && ((0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: getCustomerCoordinates(mapPopupCustomer), zoom: 13, style: { height: '100%', width: '100%' }, className: "rounded-lg", children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), (0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: getCustomerCoordinates(mapPopupCustomer), children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Popup, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-1", children: mapPopupCustomer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { children: [mapPopupCustomer.city, ", ", mapPopupCustomer.state] }), (0, jsx_runtime_1.jsx)("div", { children: mapPopupCustomer.email }), (0, jsx_runtime_1.jsx)("div", { children: mapPopupCustomer.phone })] })] }) }) })] })) })] }))] }) }) }) }))] }, customer.id));
                                    }) })] }) }), filteredCustomers.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "No Customers Found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "No customers have been added yet." })] }))] }), selectedCustomerForPopup && ((0, jsx_runtime_1.jsx)(CustomerPagePopup_1.default, { customerId: selectedCustomerForPopup, isOpen: !!selectedCustomerForPopup, onClose: function () { return setSelectedCustomerForPopup(null); } }))] }));
};
exports.default = CustomerListView;
