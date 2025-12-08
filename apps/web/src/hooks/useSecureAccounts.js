"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSecureAccounts = useSecureAccounts;
exports.useSecureAccount = useSecureAccount;
exports.useCreateAccount = useCreateAccount;
exports.useUpdateAccount = useUpdateAccount;
exports.useDeleteAccount = useDeleteAccount;
exports.useSearchAccounts = useSearchAccounts;
var react_query_1 = require("@tanstack/react-query");
var secure_api_client_1 = require("@/lib/secure-api-client");
var logger_1 = require("@/utils/logger");
/**
 * Secure hook for fetching accounts with automatic tenant isolation
 */
function useSecureAccounts() {
    return (0, react_query_1.useQuery)({
        queryKey: ['accounts'],
        queryFn: function () { return secure_api_client_1.secureApiClient.get('/accounts'); },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: function (failureCount, error) {
            // Don't retry authentication errors
            if (error.message.includes('Authentication failed')) {
                return false;
            }
            return failureCount < 3;
        },
    });
}
/**
 * Secure hook for fetching a single account by ID
 */
function useSecureAccount(accountId) {
    return (0, react_query_1.useQuery)({
        queryKey: ['accounts', accountId],
        queryFn: function () { return secure_api_client_1.secureApiClient.get("/accounts/".concat(accountId)); },
        enabled: !!accountId,
        staleTime: 5 * 60 * 1000,
    });
}
/**
 * Secure hook for creating accounts with automatic tenant isolation
 */
function useCreateAccount() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (accountData) { return secure_api_client_1.secureApiClient.post('/accounts', accountData); },
        onSuccess: function () {
            // Invalidate accounts query to refetch data
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create account', error, 'useSecureAccounts');
        },
    });
}
/**
 * Secure hook for updating accounts with automatic tenant isolation
 */
function useUpdateAccount() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return secure_api_client_1.secureApiClient.put("/accounts/".concat(id), data);
        },
        onSuccess: function (_, variables) {
            // Invalidate accounts queries
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['accounts', variables.id] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update account', error, 'useSecureAccounts');
        },
    });
}
/**
 * Secure hook for deleting accounts with automatic tenant isolation
 */
function useDeleteAccount() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (accountId) { return secure_api_client_1.secureApiClient.delete("/accounts/".concat(accountId)); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete account', error, 'useSecureAccounts');
        },
    });
}
/**
 * Secure hook for searching accounts with automatic tenant isolation
 */
function useSearchAccounts(searchTerm) {
    return (0, react_query_1.useQuery)({
        queryKey: ['accounts', 'search', searchTerm],
        queryFn: function () { return secure_api_client_1.secureApiClient.get("/accounts/search?q=".concat(encodeURIComponent(searchTerm))); },
        enabled: !!searchTerm && searchTerm.length > 2,
        staleTime: 2 * 60 * 1000, // 2 minutes for search results
    });
}
