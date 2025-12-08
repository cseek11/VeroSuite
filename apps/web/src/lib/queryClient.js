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
exports.invalidateQueries = exports.queryKeys = exports.queryClient = void 0;
var react_query_1 = require("@tanstack/react-query");
var config_1 = require("./config");
exports.queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            // Time before data is considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Time before inactive queries are garbage collected
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests
            retry: function (failureCount, error) {
                // Don't retry on 4xx errors (client errors)
                if ((error === null || error === void 0 ? void 0 : error.status) >= 400 && (error === null || error === void 0 ? void 0 : error.status) < 500) {
                    return false;
                }
                // Retry up to 3 times for other errors
                return failureCount < 3;
            },
            // Retry delay with exponential backoff
            retryDelay: function (attemptIndex) { return Math.min(1000 * Math.pow(2, attemptIndex), 30000); },
            // Refetch on window focus (only in production)
            refetchOnWindowFocus: config_1.config.app.environment === 'production',
            // Refetch on reconnect
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry failed mutations
            retry: function (failureCount, error) {
                // Don't retry on 4xx errors
                if ((error === null || error === void 0 ? void 0 : error.status) >= 400 && (error === null || error === void 0 ? void 0 : error.status) < 500) {
                    return false;
                }
                return failureCount < 2;
            },
            // Retry delay for mutations
            retryDelay: function (attemptIndex) { return Math.min(1000 * Math.pow(2, attemptIndex), 10000); },
        },
    },
});
// Query keys factory for consistent cache keys
exports.queryKeys = {
    // Auth related queries
    auth: {
        user: ['auth', 'user'],
        session: ['auth', 'session'],
    },
    // Jobs related queries
    jobs: {
        all: ['jobs'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.jobs.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.jobs.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.jobs.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.jobs.details(), true), [id], false); },
        today: function (technicianId) { return __spreadArray(__spreadArray([], exports.queryKeys.jobs.all, true), ['today', technicianId], false); },
    },
    // Accounts related queries
    accounts: {
        all: ['accounts'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.accounts.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.accounts.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.accounts.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.accounts.details(), true), [id], false); },
    },
    // Locations related queries
    locations: {
        all: ['locations'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.locations.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.locations.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.locations.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.locations.details(), true), [id], false); },
        byAccount: function (accountId) { return __spreadArray(__spreadArray([], exports.queryKeys.locations.all, true), ['byAccount', accountId], false); },
    },
    // Users related queries
    users: {
        all: ['users'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.users.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.users.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.users.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.users.details(), true), [id], false); },
    },
    // KPI Templates related queries
    kpiTemplates: {
        all: ['kpiTemplates'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.details(), true), [id], false); },
        popular: function (limit) { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.all, true), ['popular', limit], false); },
        featured: function () { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.all, true), ['featured'], false); },
        favorites: function () { return __spreadArray(__spreadArray([], exports.queryKeys.kpiTemplates.all, true), ['favorites'], false); },
    },
    // User KPIs related queries
    userKpis: {
        all: ['userKpis'],
        lists: function () { return __spreadArray(__spreadArray([], exports.queryKeys.userKpis.all, true), ['list'], false); },
        list: function (filters) { return __spreadArray(__spreadArray([], exports.queryKeys.userKpis.lists(), true), [filters], false); },
        details: function () { return __spreadArray(__spreadArray([], exports.queryKeys.userKpis.all, true), ['detail'], false); },
        detail: function (id) { return __spreadArray(__spreadArray([], exports.queryKeys.userKpis.details(), true), [id], false); },
    },
    // Dashboard related queries
    dashboard: {
        metrics: ['dashboard', 'metrics'],
        recentActivity: ['dashboard', 'recentActivity'],
        charts: ['dashboard', 'charts'],
    },
    // File upload related queries
    uploads: {
        all: ['uploads'],
        presignedUrl: function (filename) { return __spreadArray(__spreadArray([], exports.queryKeys.uploads.all, true), ['presigned', filename], false); },
    },
};
// Utility function to invalidate related queries
exports.invalidateQueries = {
    jobs: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.jobs.all }); },
    accounts: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.accounts.all }); },
    locations: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.locations.all }); },
    users: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.users.all }); },
    dashboard: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.dashboard.metrics }); },
    uploads: function () { return exports.queryClient.invalidateQueries({ queryKey: exports.queryKeys.uploads.all }); },
    all: function () { return exports.queryClient.invalidateQueries(); },
};
