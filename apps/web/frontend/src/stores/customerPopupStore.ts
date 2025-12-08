import { create } from 'zustand';
import { useEffect } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { Account } from '@/types/enhanced-types';

interface CustomerPopupState {
  customer: Account | null;
  isLoading: boolean;
  error: string | null;
  
  // Read-only operations only
  loadCustomer: (customerId: string) => Promise<void>;
  clearCustomer: () => void;
}

export const useCustomerPopupStore = create<CustomerPopupState>((set) => ({
  customer: null,
  isLoading: false,
  error: null,

  loadCustomer: async (customerId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Lightweight API call - minimal data only
      const customer = await enhancedApi.customers.getById(customerId);
      set({ customer, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load customer',
        isLoading: false 
      });
    }
  },

  clearCustomer: () => {
    set({ customer: null, error: null });
  },
}));

// Hook for popup component
export const useCustomerPopup = (customerId?: string) => {
  const { customer, isLoading, error, loadCustomer, clearCustomer } = useCustomerPopupStore();
  
  // Auto-load customer when ID changes
  useEffect(() => {
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
    reload: () => customerId ? loadCustomer(customerId) : Promise.resolve(),
  };
};
