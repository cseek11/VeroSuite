// ============================================================================
// CACHE INVALIDATION UTILITIES
// ============================================================================
// This file provides utilities for invalidating React Query caches
// when customer data is updated, ensuring real-time updates across the app

import { QueryClient } from '@tanstack/react-query';

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
  console.log('🔄 Invalidating customer queries for:', customerId);
  
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
  
  console.log('✅ All customer queries invalidated');
}

/**
 * Invalidate all customer queries (for global updates)
 */
export function invalidateAllCustomerQueries(queryClient: QueryClient): void {
  console.log('🔄 Invalidating all customer queries');
  
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
  
  console.log('✅ All customer queries invalidated');
}

/**
 * Invalidate search queries specifically
 */
export function invalidateSearchQueries(queryClient: QueryClient): void {
  console.log('🔄 Invalidating search queries');
  
  queryClient.invalidateQueries({ 
    queryKey: ['search'] 
  });
  
  queryClient.invalidateQueries({ 
    queryKey: ['unified-search'] 
  });
  
  queryClient.invalidateQueries({ 
    queryKey: ['search-results'] 
  });
  
  console.log('✅ Search queries invalidated');
}

/**
 * Invalidate customer list queries specifically
 */
export function invalidateCustomerListQueries(queryClient: QueryClient): void {
  console.log('🔄 Invalidating customer list queries');
  
  queryClient.invalidateQueries({ 
    queryKey: ['customers'] 
  });
  
  queryClient.invalidateQueries({ 
    queryKey: ['secure-customers'] 
  });
  
  queryClient.invalidateQueries({ 
    queryKey: ['enhanced-customers'] 
  });
  
  console.log('✅ Customer list queries invalidated');
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
      console.log('✅ Customer updated successfully:', data.name);
      
      // Invalidate all related queries
      invalidateCustomerQueries(queryClient, variables.id);
      
      // Also invalidate search queries to refresh search results
      invalidateSearchQueries(queryClient);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerUpdated', {
        detail: { customerId: variables.id, customer: data }
      }));
    },
    onError: (error) => {
      console.error('❌ Customer update failed:', error);
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
      console.log('✅ Customer created successfully:', data.name);
      
      // Invalidate all customer queries
      invalidateAllCustomerQueries(queryClient);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerCreated', {
        detail: { customer: data }
      }));
    },
    onError: (error) => {
      console.error('❌ Customer creation failed:', error);
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
      console.log('✅ Customer deleted successfully:', customerId);
      
      // Invalidate all customer queries
      invalidateAllCustomerQueries(queryClient);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerDeleted', {
        detail: { customerId }
      }));
    },
    onError: (error) => {
      console.error('❌ Customer deletion failed:', error);
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
    console.log('🔄 Real-time customer update received:', customerId);
    invalidateCustomerQueries(queryClient, customerId);
  };
  
  const handleCustomerCreate = (event: CustomEvent) => {
    console.log('🔄 Real-time customer creation received');
    invalidateAllCustomerQueries(queryClient);
  };
  
  const handleCustomerDelete = (event: CustomEvent) => {
    console.log('🔄 Real-time customer deletion received');
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
