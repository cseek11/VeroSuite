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
exports.default = ServiceHistory;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var supabase_client_1 = require("@/lib/supabase-client");
var lucide_react_1 = require("lucide-react");
function ServiceHistory() {
    var _this = this;
    var _a = (0, react_1.useState)('all'), selectedCustomer = _a[0], setSelectedCustomer = _a[1];
    var _b = (0, react_1.useState)('all'), selectedStatus = _b[0], setSelectedStatus = _b[1];
    var _c = (0, react_1.useState)('30'), selectedDateRange = _c[0], setSelectedDateRange = _c[1];
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    // Fetch service history
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['service-history', selectedCustomer, selectedStatus, selectedDateRange, searchTerm],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var query, daysAgo, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase_client_1.supabase
                            .from('service_history')
                            .select("\n          *,\n          customers (\n            id,\n            name,\n            account_type\n          ),\n          service_types (\n            id,\n            type_name,\n            type_code,\n            base_price\n          ),\n          technicians (\n            id,\n            name,\n            email\n          )\n        ")
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');
                        // Apply customer filter
                        if (selectedCustomer !== 'all') {
                            query = query.eq('customer_id', selectedCustomer);
                        }
                        // Apply status filter
                        if (selectedStatus !== 'all') {
                            query = query.eq('status', selectedStatus);
                        }
                        // Apply date range filter
                        if (selectedDateRange !== 'all') {
                            daysAgo = new Date();
                            daysAgo.setDate(daysAgo.getDate() - parseInt(selectedDateRange));
                            query = query.gte('scheduled_date', daysAgo.toISOString());
                        }
                        // Apply search filter
                        if (searchTerm) {
                            query = query.or("notes.ilike.%".concat(searchTerm, "%,customer_feedback.ilike.%").concat(searchTerm, "%"));
                        }
                        query = query.order('scheduled_date', { ascending: false });
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceHistory = _e.data, isLoading = _e.isLoading;
    // Fetch customers for filter
    var customers = (0, react_query_1.useQuery)({
        queryKey: ['customers-for-filter'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .select('id, name, account_type')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    var getStatusColor = function (status) {
        var colors = {
            'scheduled': 'bg-blue-100 text-blue-800',
            'in_progress': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'no_show': 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    var getStatusIcon = function (status) {
        var icons = {
            'scheduled': (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }),
            'in_progress': (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }),
            'completed': (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
            'cancelled': (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }),
            'no_show': (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }),
        };
        return icons[status] || (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" });
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    var calculateDuration = function (startDate, endDate) {
        if (!endDate)
            return 'N/A';
        var start = new Date(startDate);
        var end = new Date(endDate);
        var diffMs = end.getTime() - start.getTime();
        var diffMins = Math.round(diffMs / 60000);
        return "".concat(diffMins, " min");
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Service History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Track and analyze service execution records, customer feedback, and technician performance" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: (serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Total Services" })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Filters" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Customer" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCustomer, onChange: function (e) { return setSelectedCustomer(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Customers" }), customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ((0, jsx_runtime_1.jsx)("option", { value: customer.id, children: customer.name }, customer.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedStatus, onChange: function (e) { return setSelectedStatus(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "scheduled", children: "Scheduled" }), (0, jsx_runtime_1.jsx)("option", { value: "in_progress", children: "In Progress" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "cancelled", children: "Cancelled" }), (0, jsx_runtime_1.jsx)("option", { value: "no_show", children: "No Show" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date Range" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedDateRange, onChange: function (e) { return setSelectedDateRange(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "7", children: "Last 7 days" }), (0, jsx_runtime_1.jsx)("option", { value: "30", children: "Last 30 days" }), (0, jsx_runtime_1.jsx)("option", { value: "90", children: "Last 90 days" }), (0, jsx_runtime_1.jsx)("option", { value: "365", children: "Last year" }), (0, jsx_runtime_1.jsx)("option", { value: "all", children: "All time" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search notes, feedback...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-8 w-8 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: (serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.filter(function (s) { return s.status === 'completed'; }).length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Completed" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-8 w-8 text-yellow-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: (serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.filter(function (s) { return s.status === 'scheduled'; }).length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Scheduled" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-8 w-8 text-red-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: (serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.filter(function (s) { return s.status === 'cancelled'; }).length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Cancelled" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-8 w-8 text-gray-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: (serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.filter(function (s) { return s.status === 'no_show'; }).length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "No Shows" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Service Records" }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Service" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Scheduled" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Rating" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: serviceHistory === null || serviceHistory === void 0 ? void 0 : serviceHistory.map(function (service) {
                                        var _a, _b, _c, _d, _e;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: ((_a = service.customers) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 capitalize", children: ((_b = service.customers) === null || _b === void 0 ? void 0 : _b.account_type) || 'N/A' })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: ((_c = service.service_types) === null || _c === void 0 ? void 0 : _c.type_name) || 'N/A' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["$", ((_d = service.service_types) === null || _d === void 0 ? void 0 : _d.base_price) || '0.00'] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-gray-400 mr-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: ((_e = service.technicians) === null || _e === void 0 ? void 0 : _e.name) || 'N/A' })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: formatDate(service.scheduled_date) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [getStatusIcon(service.status), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(service.status)), children: service.status.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: calculateDuration(service.scheduled_date, service.completed_date) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: service.service_rating ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-900 mr-2", children: [service.service_rating, "/5"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex", children: [1, 2, 3, 4, 5].map(function (star) { return ((0, jsx_runtime_1.jsx)("svg", { className: "h-4 w-4 ".concat(star <= service.service_rating ? 'text-yellow-400' : 'text-gray-300'), fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) }, star)); }) })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "No rating" })) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: (0, jsx_runtime_1.jsx)("button", { className: "text-purple-600 hover:text-purple-900", children: "View Details" }) })] }, service.id));
                                    }) })] }) })] }), (!serviceHistory || serviceHistory.length === 0) && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No service history found" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "Try adjusting your filters or search criteria." })] }))] }));
}
