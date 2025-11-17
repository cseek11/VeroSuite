// ============================================================================
// CACHE INVALIDATION UTILITIES
// ============================================================================
// This file provides utilities for invalidating React Query caches
// when customer data is updated, ensuring real-time updates across the app

import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

// ============================================================================
// CACHE INVALIDATION FUNCTIONS
// ============================================================================

/**
 * Invalidate all customer-related queries after an update
 */
export function invalidateCustomerQueries(
  queryClient: QueryClient, 
  customerId: string
): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Invalidating customer queries', { customerId }, 'cache-invalidation');
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
    logger.debug('All customer queries invalidated', {}, 'cache-invalidation');
  }
}

/**
 * Invalidate all customer queries (for global updates)
 */
export function invalidateAllCustomerQueries(queryClient: QueryClient): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Invalidating all customer queries', {}, 'cache-invalidation');
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
    logger.debug('All customer queries invalidated', {}, 'cache-invalidation');
  }
}

/**
 * Invalidate search queries specifically
 */
export function invalidateSearchQueries(queryClient: QueryClient): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Invalidating search queries', {}, 'cache-invalidation');
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
    logger.debug('Search queries invalidated', {}, 'cache-invalidation');
  }
}

/**
 * Invalidate customer list queries specifically
 */
export function invalidateCustomerListQueries(queryClient: QueryClient): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Invalidating customer list queries', {}, 'cache-invalidation');
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
    logger.debug('Customer list queries invalidated', {}, 'cache-invalidation');
  }
}

// ============================================================================
// MUTATION HOOKS WITH CACHE INVALIDATION
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from './enhanced-api';
import type { Account } from '@/types/enhanced-types';

/**
 * Hook for updating a customer with automatic cache invalidation
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Account> }) => 
      enhancedApi.customers.update(id, updates),
    onSuccess: (data, variables) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Customer updated successfully', { name: data.name }, 'cache-invalidation');
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
    onError: (error: unknown) => {
      logger.error('Customer update failed', error, 'cache-invalidation');
    }
  });
}

/**
 * Hook for creating a customer with automatic cache invalidation
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerData: Partial<Account>) => 
      enhancedApi.customers.create(customerData),
    onSuccess: (data) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Customer created successfully', { name: data.name }, 'cache-invalidation');
      }
      
      // Invalidate all customer queries
      invalidateAllCustomerQueries(queryClient);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerCreated', {
        detail: { customer: data }
      }));
    },
    onError: (error: unknown) => {
      logger.error('Customer creation failed', error, 'cache-invalidation');
    }
  });
}

/**
 * Hook for deleting a customer with automatic cache invalidation
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => enhancedApi.customers.delete(id),
    onSuccess: (_, customerId) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Customer deleted successfully', { customerId }, 'cache-invalidation');
      }
      
      // Invalidate all customer queries
      invalidateAllCustomerQueries(queryClient);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerDeleted', {
        detail: { customerId }
      }));
    },
    onError: (error: unknown) => {
      logger.error('Customer deletion failed', error, 'cache-invalidation');
    }
  });
}

// ============================================================================
// REAL-TIME UPDATE LISTENERS
// ============================================================================

/**
 * Set up real-time update listeners for customer changes
 */
export function setupCustomerUpdateListeners(queryClient: QueryClient): () => void {
  const handleCustomerUpdate = (event: CustomEvent) => {
    const { customerId } = event.detail;
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Real-time customer update received', { customerId }, 'cache-invalidation');
    }
    invalidateCustomerQueries(queryClient, customerId);
  };
  
  const handleCustomerCreate = (_event: CustomEvent) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Real-time customer creation received', {}, 'cache-invalidation');
    }
    invalidateAllCustomerQueries(queryClient);
  };
  
  const handleCustomerDelete = (_event: CustomEvent) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Real-time customer deletion received', {}, 'cache-invalidation');
    }
    invalidateAllCustomerQueries(queryClient);
  };
  
  // Add event listeners
  window.addEventListener('customerUpdated', handleCustomerUpdate as EventListener);
  window.addEventListener('customerCreated', handleCustomerCreate as EventListener);
  window.addEventListener('customerDeleted', handleCustomerDelete as EventListener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('customerUpdated', handleCustomerUpdate as EventListener);
    window.removeEventListener('customerCreated', handleCustomerCreate as EventListener);
    window.removeEventListener('customerDeleted', handleCustomerDelete as EventListener);
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  invalidateCustomerQueries,
  invalidateAllCustomerQueries,
  invalidateSearchQueries,
  invalidateCustomerListQueries,
  useUpdateCustomer,
  useCreateCustomer,
  useDeleteCustomer,
  setupCustomerUpdateListeners
};
