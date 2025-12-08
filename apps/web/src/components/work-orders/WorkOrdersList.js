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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkOrdersList;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var work_orders_1 = require("@/types/work-orders");
var work_orders_2 = require("@/types/work-orders");
var WorkOrderStatusManager_1 = __importDefault(require("./WorkOrderStatusManager"));
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var logger_1 = require("@/utils/logger");
function WorkOrdersList(_a) {
    var onCreateWorkOrder = _a.onCreateWorkOrder, onViewWorkOrder = _a.onViewWorkOrder, onEditWorkOrder = _a.onEditWorkOrder, onDeleteWorkOrder = _a.onDeleteWorkOrder;
    var _b = (0, react_1.useState)({
        page: 1,
        limit: 20,
    }), filters = _b[0], setFilters = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)(false), showFilters = _d[0], setShowFilters = _d[1];
    var _e = (0, react_1.useState)([]), selectedWorkOrders = _e[0], setSelectedWorkOrders = _e[1];
    var _f = (0, react_1.useState)('created_at'), sortField = _f[0], setSortField = _f[1];
    var _g = (0, react_1.useState)('desc'), sortDirection = _g[0], setSortDirection = _g[1];
    var _h = (0, useWorkOrders_1.useWorkOrders)(filters), data = _h.data, isLoading = _h.isLoading, error = _h.error, refetch = _h.refetch;
    // Filter and sort work orders
    var filteredAndSortedWorkOrders = (0, react_1.useMemo)(function () {
        if (!(data === null || data === void 0 ? void 0 : data.data))
            return [];
        var filtered = data.data;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (workOrder) {
                var _a, _b, _c, _d;
                return workOrder.description.toLowerCase().includes(searchLower_1) ||
                    (((_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.name) || workOrder.customer_name || '').toLowerCase().includes(searchLower_1) ||
                    ((_b = workOrder.work_order_number) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_c = workOrder.assignedTechnician) === null || _c === void 0 ? void 0 : _c.first_name.toLowerCase().includes(searchLower_1)) ||
                    ((_d = workOrder.assignedTechnician) === null || _d === void 0 ? void 0 : _d.last_name.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply sorting
        filtered.sort(function (a, b) {
            var aValue = a[sortField];
            var bValue = b[sortField];
            if (aValue === bValue)
                return 0;
            if (aValue === undefined || aValue === null)
                return 1;
            if (bValue === undefined || bValue === null)
                return -1;
            var comparison = aValue < bValue ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
        return filtered;
    }, [data === null || data === void 0 ? void 0 : data.data, searchTerm, sortField, sortDirection]);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    var handleSelectWorkOrder = function (workOrderId) {
        setSelectedWorkOrders(function (prev) {
            return prev.includes(workOrderId)
                ? prev.filter(function (id) { return id !== workOrderId; })
                : __spreadArray(__spreadArray([], prev, true), [workOrderId], false);
        });
    };
    var handleSelectAll = function () {
        if (selectedWorkOrders.length === filteredAndSortedWorkOrders.length) {
            setSelectedWorkOrders([]);
        }
        else {
            setSelectedWorkOrders(filteredAndSortedWorkOrders.map(function (wo) { return wo.id; }));
        }
    };
    var handleFilterChange = function (key, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a.page = 1, _a)));
        });
    };
    var handlePageChange = function (page) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { page: page })); });
    };
    var formatDateTime = function (dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading work orders..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Error Loading Work Orders" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: error.message }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return refetch(); }, variant: "outline", children: "Try Again" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Work Orders" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: [(data === null || data === void 0 ? void 0 : data.pagination.total) || 0, " total work orders"] })] }), onCreateWorkOrder && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: onCreateWorkOrder, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Create Work Order"] }))] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search work orders...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: function () { return setShowFilters(!showFilters); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4" }), "Filters", showFilters ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4" })] })] }), showFilters && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.status || '', onChange: function (e) { return handleFilterChange('status', e.target.value || undefined); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderStatus.PENDING, children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderStatus.IN_PROGRESS, children: "In Progress" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderStatus.COMPLETED, children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderStatus.CANCELED, children: "Canceled" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.priority || '', onChange: function (e) { return handleFilterChange('priority', e.target.value || undefined); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Priorities" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.LOW, children: "Low" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.MEDIUM, children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.HIGH, children: "High" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.URGENT, children: "Urgent" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: filters.start_date || '', onChange: function (e) { return handleFilterChange('start_date', e.target.value || undefined); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: filters.end_date || '', onChange: function (e) { return handleFilterChange('end_date', e.target.value || undefined); } })] })] }) }))] }), selectedWorkOrders.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4 bg-blue-50 border-blue-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-blue-900", children: [selectedWorkOrders.length, " work order(s) selected"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { size: "sm", variant: "outline", onClick: function () { return setSelectedWorkOrders([]); }, children: "Clear Selection" })] }) }), (0, jsx_runtime_1.jsx)(WorkOrderStatusManager_1.default, { workOrderIds: selectedWorkOrders, onBulkStatusChange: function (workOrderIds, newStatus) {
                            logger_1.logger.debug('Bulk status change', { workOrderIds: workOrderIds, newStatus: newStatus }, 'WorkOrdersList');
                            setSelectedWorkOrders([]);
                        }, mode: "bulk" })] })), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedWorkOrders.length === filteredAndSortedWorkOrders.length && filteredAndSortedWorkOrders.length > 0, onChange: handleSelectAll, className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }) }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('work_order_number'); }, children: "Work Order #" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('description'); }, children: "Description" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('account'); }, children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('status'); }, children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('priority'); }, children: "Priority" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('assignedTechnician'); }, children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () { return handleSort('scheduled_date'); }, children: "Scheduled" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredAndSortedWorkOrders.map(function (workOrder) {
                                        var _a, _b;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50 cursor-pointer", onClick: function () { return onViewWorkOrder === null || onViewWorkOrder === void 0 ? void 0 : onViewWorkOrder(workOrder); }, children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", onClick: function (e) { return e.stopPropagation(); }, children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedWorkOrders.includes(workOrder.id), onChange: function () { return handleSelectWorkOrder(workOrder.id); }, className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: workOrder.work_order_number || "WO-".concat(workOrder.id.slice(-8)) }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900 max-w-xs truncate", children: workOrder.description }), workOrder.service_type && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: workOrder.service_type }))] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: workOrder.customer_name || ((_a = workOrder.account) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: (_b = workOrder.account) === null || _b === void 0 ? void 0 : _b.account_type })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-".concat((0, work_orders_2.getStatusColor)(workOrder.status), "-100 text-").concat((0, work_orders_2.getStatusColor)(workOrder.status), "-800"), children: (0, work_orders_2.getStatusLabel)(workOrder.status) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-".concat((0, work_orders_2.getPriorityColor)(workOrder.priority), "-100 text-").concat((0, work_orders_2.getPriorityColor)(workOrder.priority), "-800"), children: (0, work_orders_2.getPriorityLabel)(workOrder.priority) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: workOrder.assignedTechnician ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-900", children: [workOrder.assignedTechnician.first_name, " ", workOrder.assignedTechnician.last_name] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "Unassigned" })) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: workOrder.scheduled_date ? ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: formatDateTime(workOrder.scheduled_date) })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "Not scheduled" })) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", onClick: function (e) { return e.stopPropagation(); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return onViewWorkOrder === null || onViewWorkOrder === void 0 ? void 0 : onViewWorkOrder(workOrder); }, className: "text-blue-600 hover:text-blue-900", title: "View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onEditWorkOrder === null || onEditWorkOrder === void 0 ? void 0 : onEditWorkOrder(workOrder); }, className: "text-gray-600 hover:text-gray-900", title: "Edit", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onDeleteWorkOrder === null || onDeleteWorkOrder === void 0 ? void 0 : onDeleteWorkOrder(workOrder); }, className: "text-red-600 hover:text-red-900", title: "Delete", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) })] }, workOrder.id));
                                    }) })] }) }), filteredAndSortedWorkOrders.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-12 w-12 mx-auto" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No work orders found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: searchTerm || Object.values(filters).some(function (f) { return f !== undefined && f !== ''; })
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first work order' }), !searchTerm && !Object.values(filters).some(function (f) { return f !== undefined && f !== ''; }) && onCreateWorkOrder && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: onCreateWorkOrder, children: "Create Work Order" }))] }))] }), (data === null || data === void 0 ? void 0 : data.pagination) && data.pagination.totalPages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: ["Showing ", ((data.pagination.page - 1) * data.pagination.limit) + 1, " to", ' ', Math.min(data.pagination.page * data.pagination.limit, data.pagination.total), " of", ' ', data.pagination.total, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handlePageChange(data.pagination.page - 1); }, disabled: data.pagination.page === 1, children: "Previous" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-700", children: ["Page ", data.pagination.page, " of ", data.pagination.totalPages] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return handlePageChange(data.pagination.page + 1); }, disabled: data.pagination.page === data.pagination.totalPages, children: "Next" })] })] }))] }));
}
