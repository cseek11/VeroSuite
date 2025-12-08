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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptimisticWorkOrderUpdate = exports.useBulkUpdateStatus = exports.useAssignWorkOrder = exports.useChangeWorkOrderStatus = exports.useDeleteWorkOrder = exports.useUpdateWorkOrder = exports.useCreateWorkOrder = exports.useWorkOrdersByTechnician = exports.useWorkOrdersByCustomer = exports.useWorkOrder = exports.useWorkOrders = exports.workOrderKeys = void 0;
var react_query_1 = require("@tanstack/react-query");
var work_orders_api_1 = require("@/lib/work-orders-api");
// Query keys
exports.workOrderKeys = {
    all: ['workOrders'],
    lists: function () { return __spreadArray(__spreadArray([], exports.workOrderKeys.all, true), ['list'], false); },
    list: function (filters) { return __spreadArray(__spreadArray([], exports.workOrderKeys.lists(), true), [filters], false); },
    details: function () { return __spreadArray(__spreadArray([], exports.workOrderKeys.all, true), ['detail'], false); },
    detail: function (id) { return __spreadArray(__spreadArray([], exports.workOrderKeys.details(), true), [id], false); },
    byCustomer: function (customerId) { return __spreadArray(__spreadArray([], exports.workOrderKeys.all, true), ['customer', customerId], false); },
    byTechnician: function (technicianId) { return __spreadArray(__spreadArray([], exports.workOrderKeys.all, true), ['technician', technicianId], false); },
};
// Hooks for fetching work orders
var useWorkOrders = function (filters) {
    if (filters === void 0) { filters = {}; }
    return (0, react_query_1.useQuery)({
        queryKey: exports.workOrderKeys.list(filters),
        queryFn: function () { return work_orders_api_1.workOrdersApi.getWorkOrders(filters); },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useWorkOrders = useWorkOrders;
var useWorkOrder = function (id) {
    // Validate UUID format before enabling query
    var isValidUUID = function (str) {
        if (!str || typeof str !== 'string')
            return false;
        var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    };
    return (0, react_query_1.useQuery)({
        queryKey: exports.workOrderKeys.detail(id),
        queryFn: function () { return work_orders_api_1.workOrdersApi.getWorkOrderById(id); },
        enabled: !!id && isValidUUID(id), // Only enable if ID is valid UUID
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
exports.useWorkOrder = useWorkOrder;
var useWorkOrdersByCustomer = function (customerId) {
    // Validate UUID format before enabling query
    var isValidUUID = function (str) {
        if (!str || typeof str !== 'string')
            return false;
        var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    };
    return (0, react_query_1.useQuery)({
        queryKey: exports.workOrderKeys.byCustomer(customerId),
        queryFn: function () { return work_orders_api_1.workOrdersApi.getWorkOrdersByCustomer(customerId); },
        enabled: !!customerId && isValidUUID(customerId), // Only enable if ID is valid UUID
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
exports.useWorkOrdersByCustomer = useWorkOrdersByCustomer;
var useWorkOrdersByTechnician = function (technicianId) {
    // Validate UUID format before enabling query
    var isValidUUID = function (str) {
        if (!str || typeof str !== 'string')
            return false;
        var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    };
    return (0, react_query_1.useQuery)({
        queryKey: exports.workOrderKeys.byTechnician(technicianId),
        queryFn: function () { return work_orders_api_1.workOrdersApi.getWorkOrdersByTechnician(technicianId); },
        enabled: !!technicianId && isValidUUID(technicianId), // Only enable if ID is valid UUID
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
exports.useWorkOrdersByTechnician = useWorkOrdersByTechnician;
// Hooks for mutations
var useCreateWorkOrder = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (data) { return work_orders_api_1.workOrdersApi.createWorkOrder(data); },
        onSuccess: function (newWorkOrder) {
            // Invalidate and refetch work order lists
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
            // Add the new work order to the cache
            queryClient.setQueryData(exports.workOrderKeys.detail(newWorkOrder.id), newWorkOrder);
            // If it's assigned to a technician, invalidate their work orders
            if (newWorkOrder.assigned_to) {
                queryClient.invalidateQueries({
                    queryKey: exports.workOrderKeys.byTechnician(newWorkOrder.assigned_to)
                });
            }
            // Invalidate customer work orders
            queryClient.invalidateQueries({
                queryKey: exports.workOrderKeys.byCustomer(newWorkOrder.customer_id)
            });
        },
    });
};
exports.useCreateWorkOrder = useCreateWorkOrder;
var useUpdateWorkOrder = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            // Validate UUID before making API call
            if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
                throw new Error("Invalid work order ID: \"".concat(id, "\". ID must be a valid UUID."));
            }
            return work_orders_api_1.workOrdersApi.updateWorkOrder(id, data);
        },
        onSuccess: function (updatedWorkOrder) {
            // Update the work order in cache
            queryClient.setQueryData(exports.workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
            // Invalidate related queries
            if (updatedWorkOrder.assigned_to) {
                queryClient.invalidateQueries({
                    queryKey: exports.workOrderKeys.byTechnician(updatedWorkOrder.assigned_to)
                });
            }
            queryClient.invalidateQueries({
                queryKey: exports.workOrderKeys.byCustomer(updatedWorkOrder.customer_id)
            });
        },
    });
};
exports.useUpdateWorkOrder = useUpdateWorkOrder;
var useDeleteWorkOrder = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) {
            // Validate UUID before making API call
            if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
                throw new Error("Invalid work order ID: \"".concat(id, "\". ID must be a valid UUID."));
            }
            return work_orders_api_1.workOrdersApi.deleteWorkOrder(id);
        },
        onSuccess: function (_, deletedId) {
            // Remove from cache
            queryClient.removeQueries({ queryKey: exports.workOrderKeys.detail(deletedId) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
        },
    });
};
exports.useDeleteWorkOrder = useDeleteWorkOrder;
var useChangeWorkOrderStatus = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var workOrderId = _a.workOrderId, newStatus = _a.newStatus, notes = _a.notes;
            // Validate UUID before making API call
            if (!workOrderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workOrderId)) {
                throw new Error("Invalid work order ID: \"".concat(workOrderId, "\". ID must be a valid UUID."));
            }
            return work_orders_api_1.workOrdersApi.changeWorkOrderStatus(workOrderId, newStatus, notes);
        },
        onSuccess: function (updatedWorkOrder) {
            // Update the work order in cache
            queryClient.setQueryData(exports.workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
            // Invalidate lists to reflect status changes
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
            // Invalidate related queries
            if (updatedWorkOrder.assigned_to) {
                queryClient.invalidateQueries({
                    queryKey: exports.workOrderKeys.byTechnician(updatedWorkOrder.assigned_to)
                });
            }
            queryClient.invalidateQueries({
                queryKey: exports.workOrderKeys.byCustomer(updatedWorkOrder.customer_id)
            });
        },
    });
};
exports.useChangeWorkOrderStatus = useChangeWorkOrderStatus;
var useAssignWorkOrder = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var workOrderId = _a.workOrderId, technicianId = _a.technicianId, scheduledDate = _a.scheduledDate;
            // Validate UUIDs before making API call
            if (!workOrderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workOrderId)) {
                throw new Error("Invalid work order ID: \"".concat(workOrderId, "\". ID must be a valid UUID."));
            }
            if (!technicianId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(technicianId)) {
                throw new Error("Invalid technician ID: \"".concat(technicianId, "\". ID must be a valid UUID."));
            }
            return work_orders_api_1.workOrdersApi.assignWorkOrder(workOrderId, technicianId, scheduledDate);
        },
        onSuccess: function (updatedWorkOrder) {
            // Update the work order in cache
            queryClient.setQueryData(exports.workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
            // Invalidate technician work orders
            queryClient.invalidateQueries({
                queryKey: exports.workOrderKeys.byTechnician(updatedWorkOrder.assigned_to)
            });
        },
    });
};
exports.useAssignWorkOrder = useAssignWorkOrder;
var useBulkUpdateStatus = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var workOrderIds = _a.workOrderIds, newStatus = _a.newStatus, notes = _a.notes;
            return work_orders_api_1.workOrdersApi.bulkUpdateStatus(workOrderIds, newStatus, notes);
        },
        onSuccess: function (updatedWorkOrders) {
            // Update each work order in cache
            updatedWorkOrders.forEach(function (workOrder) {
                queryClient.setQueryData(exports.workOrderKeys.detail(workOrder.id), workOrder);
            });
            // Invalidate all lists
            queryClient.invalidateQueries({ queryKey: exports.workOrderKeys.lists() });
            // Invalidate related queries for all affected work orders
            updatedWorkOrders.forEach(function (workOrder) {
                if (workOrder.assigned_to) {
                    queryClient.invalidateQueries({
                        queryKey: exports.workOrderKeys.byTechnician(workOrder.assigned_to)
                    });
                }
                queryClient.invalidateQueries({
                    queryKey: exports.workOrderKeys.byCustomer(workOrder.customer_id)
                });
            });
        },
    });
};
exports.useBulkUpdateStatus = useBulkUpdateStatus;
// Utility hook for optimistic updates
var useOptimisticWorkOrderUpdate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    var updateWorkOrderOptimistically = function (id, updates) {
        queryClient.setQueryData(exports.workOrderKeys.detail(id), function (old) {
            if (!old)
                return old;
            return __assign(__assign({}, old), updates);
        });
    };
    return { updateWorkOrderOptimistically: updateWorkOrderOptimistically };
};
exports.useOptimisticWorkOrderUpdate = useOptimisticWorkOrderUpdate;
