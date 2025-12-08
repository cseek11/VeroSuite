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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkOrders;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ui_1 = require("@/components/ui");
var logger_1 = require("@/utils/logger");
// Real API using enhanced-api
var enhanced_api_1 = require("@/lib/enhanced-api");
var useDialog_1 = require("@/hooks/useDialog");
var workOrdersApi = {
    list: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.workOrders.list(filters)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    create: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.workOrders.create(data)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    update: function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.workOrders.update(id, data)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.workOrders.delete(id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};
// Real customer search API
var customerSearchApi = {
    search: function (query) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.accounts.search({ query: query, limit: 10 })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};
// Real technicians API - use enhancedApi.technicians.list() for proper technician data
var techniciansApi = {
    list: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};
function WorkOrders() {
    var _this = this;
    var _a;
    var _b = (0, useDialog_1.useDialog)(), showConfirm = _b.showConfirm, _DialogComponents = _b.DialogComponents;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_1.useState)({
        status: '',
        priority: '',
        assigned_to: '',
        customer_id: '',
        start_date: '',
        end_date: '',
        page: 1,
        limit: 20
    }), filters = _c[0], setFilters = _c[1];
    var _d = (0, react_1.useState)(false), showCreateModal = _d[0], setShowCreateModal = _d[1];
    var _e = (0, react_1.useState)(false), showEditModal = _e[0], setShowEditModal = _e[1];
    var _f = (0, react_1.useState)(null), selectedWorkOrder = _f[0], setSelectedWorkOrder = _f[1];
    // Customer search state
    var _g = (0, react_1.useState)(''), customerSearchQuery = _g[0], setCustomerSearchQuery = _g[1];
    var _h = (0, react_1.useState)(false), showCustomerDropdown = _h[0], setShowCustomerDropdown = _h[1];
    var _j = (0, react_1.useState)(null), selectedCustomer = _j[0], setSelectedCustomer = _j[1];
    // Technician selection state
    var _k = (0, react_1.useState)(false), showTechnicianDropdown = _k[0], setShowTechnicianDropdown = _k[1];
    var _l = (0, react_1.useState)(null), selectedTechnician = _l[0], setSelectedTechnician = _l[1];
    var _m = (0, react_query_1.useQuery)({
        queryKey: ['work-orders', filters],
        queryFn: function () { return workOrdersApi.list(filters); },
    }), data = _m.data, isLoading = _m.isLoading, isError = _m.isError, error = _m.error;
    // Customer search query
    var customerSearchResults = (0, react_query_1.useQuery)({
        queryKey: ['customer-search', customerSearchQuery],
        queryFn: function () { return customerSearchApi.search(customerSearchQuery); },
        enabled: customerSearchQuery.length > 0 || showCustomerDropdown,
    }).data;
    // Technicians query
    var technicians = (0, react_query_1.useQuery)({
        queryKey: ['technicians'],
        queryFn: function () { return techniciansApi.list(); },
    }).data;
    // Populate selected values when editing
    react_1.default.useEffect(function () {
        if (selectedWorkOrder && showEditModal) {
            // Find and set the selected customer
            if (selectedWorkOrder.customer_id && customerSearchResults) {
                var customer = customerSearchResults.find(function (c) { return c.id === selectedWorkOrder.customer_id; });
                if (customer) {
                    setSelectedCustomer(customer);
                }
            }
            // Find and set the selected technician
            if (selectedWorkOrder.assigned_to && technicians) {
                var technician = technicians.find(function (t) { return t.id === selectedWorkOrder.assigned_to; });
                if (technician) {
                    setSelectedTechnician(technician);
                }
            }
        }
    }, [selectedWorkOrder, showEditModal, customerSearchResults, technicians]);
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: workOrdersApi.create,
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['work-orders'] });
            setShowCreateModal(false);
        },
    });
    var updateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return workOrdersApi.update(id, data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['work-orders'] });
            setShowEditModal(false);
            setSelectedWorkOrder(null);
        },
    });
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: workOrdersApi.delete,
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['work-orders'] });
        },
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'completed':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            case 'in-progress':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-500" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-yellow-500" });
            case 'canceled':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-red-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-gray-500" });
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Close dropdowns when clicking outside
    react_1.default.useEffect(function () {
        var handleClickOutside = function (event) {
            var target = event.target;
            if (!target.closest('.customer-search-dropdown') && !target.closest('.technician-dropdown')) {
                setShowCustomerDropdown(false);
                setShowTechnicianDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading work orders..." }) }) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-red-800", children: ["Error loading work orders: ", error === null || error === void 0 ? void 0 : error.message] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "Work Orders" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Manage and track work orders for pest control services." })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowCreateModal(true); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Create Work Order"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [(0, jsx_runtime_1.jsxs)("select", { value: filters.status, onChange: function (e) { return setFilters(__assign(__assign({}, filters), { status: e.target.value })); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "in-progress", children: "In Progress" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "canceled", children: "Canceled" })] }), (0, jsx_runtime_1.jsxs)("select", { value: filters.priority, onChange: function (e) { return setFilters(__assign(__assign({}, filters), { priority: e.target.value })); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Priorities" }), (0, jsx_runtime_1.jsx)("option", { value: "urgent", children: "Urgent" }), (0, jsx_runtime_1.jsx)("option", { value: "high", children: "High" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: "low", children: "Low" })] }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: filters.start_date, onChange: function (e) { return setFilters(__assign(__assign({}, filters), { start_date: e.target.value })); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", placeholder: "Start Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: filters.end_date, onChange: function (e) { return setFilters(__assign(__assign({}, filters), { end_date: e.target.value })); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", placeholder: "End Date" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: filters.customer_id, onChange: function (e) { return setFilters(__assign(__assign({}, filters), { customer_id: e.target.value })); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", placeholder: "Customer ID" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setFilters({ status: '', priority: '', assigned_to: '', customer_id: '', start_date: '', end_date: '', page: 1, limit: 20 }); }, className: "px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-200 text-sm flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }), "Clear"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-slate-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Priority" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Description" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Assigned To" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Scheduled" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Created" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.map(function (workOrder) {
                                        var _a, _b;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-slate-100 hover:bg-slate-50/50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getStatusIcon(workOrder.status), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(workOrder.status)), children: workOrder.status })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getPriorityColor(workOrder.priority)), children: workOrder.priority }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-900", children: (_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-500", children: (_b = workOrder.account) === null || _b === void 0 ? void 0 : _b.account_type })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-900 truncate", children: workOrder.description }), workOrder.notes && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-500 truncate", children: workOrder.notes }))] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: workOrder.assignedTechnician ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-slate-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm", children: [workOrder.assignedTechnician.first_name, " ", workOrder.assignedTechnician.last_name] })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-400", children: "Unassigned" })) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: workOrder.scheduled_date ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-slate-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: formatDate(workOrder.scheduled_date) })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-400", children: "Not scheduled" })) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-500", children: formatDate(workOrder.created_at) }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                                    setSelectedWorkOrder(workOrder);
                                                                    setShowEditModal(true);
                                                                }, className: "p-1 hover:bg-slate-100 rounded transition-colors", title: "Edit", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 text-slate-600" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                                    // View details - implement modal or navigation
                                                                }, className: "p-1 hover:bg-slate-100 rounded transition-colors", title: "View Details", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4 text-slate-600" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var confirmed, error_1;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                _a.trys.push([0, 2, , 3]);
                                                                                return [4 /*yield*/, showConfirm({
                                                                                        title: 'Delete Work Order',
                                                                                        message: 'Are you sure you want to delete this work order?',
                                                                                        type: 'danger',
                                                                                        confirmText: 'Delete',
                                                                                        cancelText: 'Cancel',
                                                                                    })];
                                                                            case 1:
                                                                                confirmed = _a.sent();
                                                                                if (confirmed) {
                                                                                    deleteMutation.mutate(workOrder.id);
                                                                                }
                                                                                return [3 /*break*/, 3];
                                                                            case 2:
                                                                                error_1 = _a.sent();
                                                                                logger_1.logger.error('Failed to delete work order', { workOrderId: workOrder.id, error: error_1 }, 'WorkOrders');
                                                                                return [3 /*break*/, 3];
                                                                            case 3: return [2 /*return*/];
                                                                        }
                                                                    });
                                                                }); }, className: "p-1 hover:bg-red-100 rounded transition-colors", title: "Delete", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4 text-red-600" }) })] }) })] }, workOrder.id));
                                    }) })] }) }), (data === null || data === void 0 ? void 0 : data.pagination) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-4 pt-4 border-t border-slate-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-slate-600", children: ["Showing ", ((data.pagination.page - 1) * data.pagination.limit) + 1, " to ", Math.min(data.pagination.page * data.pagination.limit, data.pagination.total), " of ", data.pagination.total, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setFilters(__assign(__assign({}, filters), { page: Math.max(1, filters.page - 1) })); }, disabled: filters.page <= 1, className: "px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm", children: "Previous" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-slate-600", children: ["Page ", filters.page, " of ", data.pagination.totalPages] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setFilters(__assign(__assign({}, filters), { page: Math.min(data.pagination.totalPages, filters.page + 1) })); }, disabled: filters.page >= data.pagination.totalPages, className: "px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm", children: "Next" })] })] }))] }), (0, jsx_runtime_1.jsx)(ui_1.ReusablePopup, { isOpen: showCreateModal || showEditModal, onClose: function () {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedWorkOrder(null);
                }, title: showCreateModal ? 'Create Work Order' : 'Edit Work Order', subtitle: showCreateModal ? 'Add a new work order to the system' : 'Update work order details', size: { width: 800, height: 600 }, children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: function (e) {
                        e.preventDefault();
                        var formData = new FormData(e.currentTarget);
                        var data = {
                            customer_id: formData.get('customer_id'),
                            assigned_to: formData.get('assigned_to') || null,
                            status: formData.get('status'),
                            priority: formData.get('priority'),
                            scheduled_date: formData.get('scheduled_date') || null,
                            description: formData.get('description'),
                            notes: formData.get('notes') || null,
                            // Service details - location_id will be handled by backend based on customer_id
                            service_type: formData.get('service_type') || null,
                            recurrence_rule: formData.get('recurrence_rule') || null,
                            estimated_duration: formData.get('estimated_duration') ? parseInt(formData.get('estimated_duration')) : null,
                            service_price: formData.get('service_price') ? parseFloat(formData.get('service_price')) : null,
                        };
                        if (showCreateModal) {
                            createMutation.mutate(data);
                        }
                        else {
                            updateMutation.mutate({ id: selectedWorkOrder.id, data: data });
                        }
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 text-indigo-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), "Basic Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative customer-search-dropdown", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Customer *" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: selectedCustomer ? "".concat(selectedCustomer.name, " (").concat(selectedCustomer.account_type, ")") : customerSearchQuery, onChange: function (e) {
                                                                setCustomerSearchQuery(e.target.value);
                                                                setSelectedCustomer(null);
                                                                setShowCustomerDropdown(true);
                                                            }, onFocus: function () { return setShowCustomerDropdown(true); }, className: "w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", placeholder: "Search by name, address, phone, or ID...", required: true }), selectedCustomer && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () {
                                                                setSelectedCustomer(null);
                                                                setCustomerSearchQuery('');
                                                            }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) }))] }), (0, jsx_runtime_1.jsx)("input", { type: "hidden", name: "customer_id", value: (selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id) || (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.customer_id) || '' }), selectedCustomer && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("svg", { className: "w-3 h-3 text-indigo-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900 text-sm mb-0.5", children: selectedCustomer.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700 text-sm mb-0.5 font-medium", children: selectedCustomer.address }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600", children: [selectedCustomer.account_type, " \u2022 ", selectedCustomer.phone] })] })] }) })), showCustomerDropdown && customerSearchResults && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto", children: customerSearchResults.length > 0 ? (customerSearchResults.map(function (customer) { return ((0, jsx_runtime_1.jsxs)("div", { onClick: function () {
                                                            setSelectedCustomer(customer);
                                                            setCustomerSearchQuery('');
                                                            setShowCustomerDropdown(false);
                                                        }, className: "px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-900", children: customer.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 font-medium", children: customer.address }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 mt-1", children: [customer.account_type, " \u2022 ", customer.phone, " \u2022 ID: ", customer.id] })] }, customer.id)); })) : ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 text-gray-500", children: "No customers found" })) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative technician-dropdown", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Assigned To" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: selectedTechnician ? "".concat(selectedTechnician.first_name, " ").concat(selectedTechnician.last_name) : '', onClick: function () { return setShowTechnicianDropdown(!showTechnicianDropdown); }, readOnly: true, className: "w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm", placeholder: "Select technician..." }), selectedTechnician && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () {
                                                                setSelectedTechnician(null);
                                                            }, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) }))] }), (0, jsx_runtime_1.jsx)("input", { type: "hidden", name: "assigned_to", value: (selectedTechnician === null || selectedTechnician === void 0 ? void 0 : selectedTechnician.id) || (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.assigned_to) || '' }), showTechnicianDropdown && technicians && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto", children: technicians.length > 0 ? (technicians.map(function (technician) { return ((0, jsx_runtime_1.jsxs)("div", { onClick: function () {
                                                            setSelectedTechnician(technician);
                                                            setShowTechnicianDropdown(false);
                                                        }, className: "px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-gray-900", children: [technician.first_name, " ", technician.last_name] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: technician.email }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: technician.phone })] }, technician.id)); })) : ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 text-gray-500", children: "No technicians available" })) }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { name: "status", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.status) || 'pending', className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "in-progress", children: "In Progress" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "canceled", children: "Canceled" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Priority" }), (0, jsx_runtime_1.jsxs)("select", { name: "priority", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.priority) || 'medium', className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "low", children: "Low" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: "high", children: "High" }), (0, jsx_runtime_1.jsx)("option", { value: "urgent", children: "Urgent" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Scheduled Date" }), (0, jsx_runtime_1.jsx)("input", { type: "datetime-local", name: "scheduled_date", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.scheduled_date) ? selectedWorkOrder.scheduled_date.slice(0, 16) : '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), "Description & Notes"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Description *" }), (0, jsx_runtime_1.jsx)("textarea", { name: "description", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.description) || '', required: true, rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none", placeholder: "Describe the work order in detail..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Notes" }), (0, jsx_runtime_1.jsx)("textarea", { name: "notes", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.notes) || '', rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none", placeholder: "Additional notes, special instructions, or internal comments..." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" }) }) }), "Service Details"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Service Type" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "service_type", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.service_type) || '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", placeholder: "e.g., Pest Control, Termite Treatment" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Recurrence Rule" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "recurrence_rule", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.recurrence_rule) || '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", placeholder: "e.g., Monthly, Quarterly" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Estimated Duration (minutes)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", name: "estimated_duration", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.estimated_duration) || 60, min: "1", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Service Price ($)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", name: "service_price", defaultValue: (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.service_price) || '', min: "0", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm", placeholder: "0.00" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t border-slate-200", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () {
                                        setShowCreateModal(false);
                                        setShowEditModal(false);
                                        setSelectedWorkOrder(null);
                                    }, className: "px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: createMutation.isPending || updateMutation.isPending, className: "px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm", children: createMutation.isPending || updateMutation.isPending ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), showCreateModal ? 'Creating...' : 'Updating...'] })) : (showCreateModal ? 'Create Work Order' : 'Update Work Order') })] })] }) })] }));
}
