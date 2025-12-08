"use strict";
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
exports.technicianKeys = void 0;
exports.useTechnicians = useTechnicians;
exports.useTechnician = useTechnician;
exports.useCreateTechnician = useCreateTechnician;
exports.useUpdateTechnician = useUpdateTechnician;
exports.useDeleteTechnician = useDeleteTechnician;
exports.useTechnicianDashboardStats = useTechnicianDashboardStats;
exports.useTechnicianPerformanceMetrics = useTechnicianPerformanceMetrics;
exports.useTechnicianAvailabilityData = useTechnicianAvailabilityData;
var react_query_1 = require("@tanstack/react-query");
var technician_api_1 = require("../lib/technician-api");
// Query keys
exports.technicianKeys = {
    all: ['technicians'],
    lists: function () { return __spreadArray(__spreadArray([], exports.technicianKeys.all, true), ['list'], false); },
    list: function (params) { return __spreadArray(__spreadArray([], exports.technicianKeys.lists(), true), [params], false); },
    details: function () { return __spreadArray(__spreadArray([], exports.technicianKeys.all, true), ['detail'], false); },
    detail: function (id) { return __spreadArray(__spreadArray([], exports.technicianKeys.details(), true), [id], false); },
};
// Get technicians list
function useTechnicians(params) {
    if (params === void 0) { params = {}; }
    return (0, react_query_1.useQuery)({
        queryKey: exports.technicianKeys.list(params),
        queryFn: function () { return technician_api_1.technicianApi.getTechnicians(params); },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
// Get single technician
function useTechnician(id) {
    return (0, react_query_1.useQuery)({
        queryKey: exports.technicianKeys.detail(id),
        queryFn: function () { return technician_api_1.technicianApi.getTechnician(id); },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
// Create technician
function useCreateTechnician() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (data) { return technician_api_1.technicianApi.createTechnician(data); },
        onSuccess: function () {
            // Invalidate and refetch technicians list
            queryClient.invalidateQueries({ queryKey: exports.technicianKeys.lists() });
        },
    });
}
// Update technician
function useUpdateTechnician() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return technician_api_1.technicianApi.updateTechnician(id, data);
        },
        onSuccess: function (updatedTechnician) {
            // Update the specific technician in cache
            queryClient.setQueryData(exports.technicianKeys.detail(updatedTechnician.id), updatedTechnician);
            // Invalidate and refetch technicians list
            queryClient.invalidateQueries({ queryKey: exports.technicianKeys.lists() });
        },
    });
}
// Delete technician
function useDeleteTechnician() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) { return technician_api_1.technicianApi.deleteTechnician(id); },
        onSuccess: function (_, deletedId) {
            // Remove the technician from cache
            queryClient.removeQueries({ queryKey: exports.technicianKeys.detail(deletedId) });
            // Invalidate and refetch technicians list
            queryClient.invalidateQueries({ queryKey: exports.technicianKeys.lists() });
        },
    });
}
// Get dashboard stats
function useTechnicianDashboardStats() {
    return (0, react_query_1.useQuery)({
        queryKey: __spreadArray(__spreadArray([], exports.technicianKeys.all, true), ['dashboard', 'stats'], false),
        queryFn: function () { return technician_api_1.technicianApi.getDashboardStats(); },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
// Get performance metrics
function useTechnicianPerformanceMetrics() {
    return (0, react_query_1.useQuery)({
        queryKey: __spreadArray(__spreadArray([], exports.technicianKeys.all, true), ['dashboard', 'performance'], false),
        queryFn: function () { return technician_api_1.technicianApi.getPerformanceMetrics(); },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
// Get availability data
function useTechnicianAvailabilityData() {
    return (0, react_query_1.useQuery)({
        queryKey: __spreadArray(__spreadArray([], exports.technicianKeys.all, true), ['dashboard', 'availability'], false),
        queryFn: function () { return technician_api_1.technicianApi.getAvailabilityData(); },
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
