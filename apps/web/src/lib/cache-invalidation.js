"use strict";
// ============================================================================
// CACHE INVALIDATION UTILITIES
// ============================================================================
// This file provides utilities for invalidating React Query caches
// when customer data is updated, ensuring real-time updates across the app
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCustomerQueries = invalidateCustomerQueries;
exports.invalidateAllCustomerQueries = invalidateAllCustomerQueries;
exports.invalidateSearchQueries = invalidateSearchQueries;
exports.invalidateCustomerListQueries = invalidateCustomerListQueries;
exports.useUpdateCustomer = useUpdateCustomer;
exports.useCreateCustomer = useCreateCustomer;
exports.useDeleteCustomer = useDeleteCustomer;
exports.setupCustomerUpdateListeners = setupCustomerUpdateListeners;
var logger_1 = require("@/utils/logger");
// ============================================================================
// CACHE INVALIDATION FUNCTIONS
// ============================================================================
/**
 * Invalidate all customer-related queries after an update
 */
function invalidateCustomerQueries(queryClient, customerId) {
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Invalidating customer queries', { customerId: customerId }, 'cache-invalidation');
    }
    // Invalidate specific customer queries
    queryClient.invalidateQueries({
        queryKey: ['customer', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['crm', 'customer', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['enhanced-customer', customerId]
    });
    // Invalidate customer list queries
    queryClient.invalidateQueries({
        queryKey: ['customers']
    });
    queryClient.invalidateQueries({
        queryKey: ['secure-customers']
    });
    queryClient.invalidateQueries({
        queryKey: ['enhanced-customers']
    });
    // Invalidate search-related queries
    queryClient.invalidateQueries({
        queryKey: ['search']
    });
    queryClient.invalidateQueries({
        queryKey: ['unified-search']
    });
    // Invalidate customer profile queries
    queryClient.invalidateQueries({
        queryKey: ['customer-profile', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['customer-notes', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['customer-photos', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['customer-contracts', customerId]
    });
    queryClient.invalidateQueries({
        queryKey: ['service-history', customerId]
    });
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('All customer queries invalidated', {}, 'cache-invalidation');
    }
}
/**
 * Invalidate all customer queries (for global updates)
 */
function invalidateAllCustomerQueries(queryClient) {
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Invalidating all customer queries', {}, 'cache-invalidation');
    }
    // Invalidate all customer-related queries
    queryClient.invalidateQueries({
        queryKey: ['customer']
    });
    queryClient.invalidateQueries({
        queryKey: ['customers']
    });
    queryClient.invalidateQueries({
        queryKey: ['crm']
    });
    queryClient.invalidateQueries({
        queryKey: ['enhanced-customer']
    });
    queryClient.invalidateQueries({
        queryKey: ['search']
    });
    queryClient.invalidateQueries({
        queryKey: ['unified-search']
    });
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('All customer queries invalidated', {}, 'cache-invalidation');
    }
}
/**
 * Invalidate search queries specifically
 */
function invalidateSearchQueries(queryClient) {
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Invalidating search queries', {}, 'cache-invalidation');
    }
    queryClient.invalidateQueries({
        queryKey: ['search']
    });
    queryClient.invalidateQueries({
        queryKey: ['unified-search']
    });
    queryClient.invalidateQueries({
        queryKey: ['search-results']
    });
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Search queries invalidated', {}, 'cache-invalidation');
    }
}
/**
 * Invalidate customer list queries specifically
 */
function invalidateCustomerListQueries(queryClient) {
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Invalidating customer list queries', {}, 'cache-invalidation');
    }
    queryClient.invalidateQueries({
        queryKey: ['customers']
    });
    queryClient.invalidateQueries({
        queryKey: ['secure-customers']
    });
    queryClient.invalidateQueries({
        queryKey: ['enhanced-customers']
    });
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Customer list queries invalidated', {}, 'cache-invalidation');
    }
}
// ============================================================================
// MUTATION HOOKS WITH CACHE INVALIDATION
// ============================================================================
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("./enhanced-api");
/**
 * Hook for updating a customer with automatic cache invalidation
 */
function useUpdateCustomer() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, updates = _a.updates;
            return enhanced_api_1.enhancedApi.customers.update(id, updates);
        },
        onSuccess: function (data, variables) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Customer updated successfully', { name: data.name }, 'cache-invalidation');
            }
            // Invalidate all related queries
            invalidateCustomerQueries(queryClient, variables.id);
            // Also invalidate search queries to refresh search results
            invalidateSearchQueries(queryClient);
            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('customerUpdated', {
                detail: { customerId: variables.id, customer: data }
            }));
        },
        onError: function (error) {
            logger_1.logger.error('Customer update failed', error, 'cache-invalidation');
        }
    });
}
/**
 * Hook for creating a customer with automatic cache invalidation
 */
function useCreateCustomer() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (customerData) {
            return enhanced_api_1.enhancedApi.customers.create(customerData);
        },
        onSuccess: function (data) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Customer created successfully', { name: data.name }, 'cache-invalidation');
            }
            // Invalidate all customer queries
            invalidateAllCustomerQueries(queryClient);
            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('customerCreated', {
                detail: { customer: data }
            }));
        },
        onError: function (error) {
            logger_1.logger.error('Customer creation failed', error, 'cache-invalidation');
        }
    });
}
/**
 * Hook for deleting a customer with automatic cache invalidation
 */
function useDeleteCustomer() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) { return enhanced_api_1.enhancedApi.customers.delete(id); },
        onSuccess: function (_, customerId) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Customer deleted successfully', { customerId: customerId }, 'cache-invalidation');
            }
            // Invalidate all customer queries
            invalidateAllCustomerQueries(queryClient);
            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('customerDeleted', {
                detail: { customerId: customerId }
            }));
        },
        onError: function (error) {
            logger_1.logger.error('Customer deletion failed', error, 'cache-invalidation');
        }
    });
}
// ============================================================================
// REAL-TIME UPDATE LISTENERS
// ============================================================================
/**
 * Set up real-time update listeners for customer changes
 */
function setupCustomerUpdateListeners(queryClient) {
    var handleCustomerUpdate = function (event) {
        var customerId = event.detail.customerId;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Real-time customer update received', { customerId: customerId }, 'cache-invalidation');
        }
        invalidateCustomerQueries(queryClient, customerId);
    };
    var handleCustomerCreate = function (_event) {
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Real-time customer creation received', {}, 'cache-invalidation');
        }
        invalidateAllCustomerQueries(queryClient);
    };
    var handleCustomerDelete = function (_event) {
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Real-time customer deletion received', {}, 'cache-invalidation');
        }
        invalidateAllCustomerQueries(queryClient);
    };
    // Add event listeners
    window.addEventListener('customerUpdated', handleCustomerUpdate);
    window.addEventListener('customerCreated', handleCustomerCreate);
    window.addEventListener('customerDeleted', handleCustomerDelete);
    // Return cleanup function
    return function () {
        window.removeEventListener('customerUpdated', handleCustomerUpdate);
        window.removeEventListener('customerCreated', handleCustomerCreate);
        window.removeEventListener('customerDeleted', handleCustomerDelete);
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    invalidateCustomerQueries: invalidateCustomerQueries,
    invalidateAllCustomerQueries: invalidateAllCustomerQueries,
    invalidateSearchQueries: invalidateSearchQueries,
    invalidateCustomerListQueries: invalidateCustomerListQueries,
    useUpdateCustomer: useUpdateCustomer,
    useCreateCustomer: useCreateCustomer,
    useDeleteCustomer: useDeleteCustomer,
    setupCustomerUpdateListeners: setupCustomerUpdateListeners
};
