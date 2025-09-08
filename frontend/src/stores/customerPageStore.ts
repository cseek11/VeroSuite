import { create } from 'zustand';
import React from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { secureApiClient } from '@/lib/secure-api-client';
import { Account } from '@/types/enhanced-types';

interface CustomerPageState {
  customer: Account | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  changes: Partial<Account>;
  
  // Full CRUD operations
  loadCustomer: (customerId: string) => Promise<void>;
  updateCustomer: (updates: Partial<Account>) => Promise<void>;
  startEditing: () => void;
  cancelEditing: () => void;
  saveChanges: () => Promise<void>;
  clearCustomer: () => void;
}

export const useCustomerPageStore = create<CustomerPageState>((set, get) => ({
  customer: null,
  isLoading: false,
  error: null,
  isEditing: false,
  changes: {},

  loadCustomer: async (customerId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Full API call with complete data
      const customer = await enhancedApi.customers.getById(customerId);
      set({ customer, isLoading: false, changes: {} });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load customer',
        isLoading: false 
      });
    }
  },

  updateCustomer: async (updates: Partial<Account>) => {
    const { customer } = get();
    if (!customer) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Use secureApiClient for updates (which goes to our backend)
      const updatedCustomer = await secureApiClient.put(`/accounts/${customer.id}`, updates);
      set({ 
        customer: updatedCustomer, 
        isLoading: false, 
        isEditing: false,
        changes: {}
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update customer',
        isLoading: false 
      });
    }
  },

  startEditing: () => {
    const { customer } = get();
    if (customer) {
      set({ isEditing: true, changes: {} });
    }
  },

  cancelEditing: () => {
    set({ isEditing: false, changes: {} });
  },

  saveChanges: async () => {
    const { changes, updateCustomer } = get();
    if (Object.keys(changes).length > 0) {
      await updateCustomer(changes);
    }
  },

  clearCustomer: () => {
    set({ 
      customer: null, 
      error: null, 
      isEditing: false, 
      changes: {} 
    });
  },
}));

// Hook for page component
export const useCustomerPage = (customerId?: string) => {
  const { 
    customer, 
    isLoading, 
    error, 
    isEditing, 
    changes,
    loadCustomer, 
    updateCustomer,
    startEditing,
    cancelEditing,
    saveChanges,
    clearCustomer 
  } = useCustomerPageStore();
  
  // Auto-load customer when ID changes
  React.useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    } else {
      clearCustomer();
    }
  }, [customerId]);

  return {
    customer,
    isLoading,
    error,
    isEditing,
    changes,
    reload: () => customerId ? loadCustomer(customerId) : Promise.resolve(),
    updateCustomer,
    startEditing,
    cancelEditing,
    saveChanges,
  };
};
