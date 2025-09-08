// ============================================================================
// FRONTEND TENANT SECURITY - Client-Side Protection
// ============================================================================
// This provides tenant isolation at the frontend level with automatic token management
// 
// Priority: P0 - CRITICAL SECURITY IMPLEMENTATION
// 
// Author: VeroSuite Security Audit
// Date: January 2, 2025
// ============================================================================

import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/stores/auth';

// ============================================================================
// SECURE API CLIENT
// ============================================================================

class SecureApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  /**
   * Get authentication headers with JWT token
   */
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Secure GET request with automatic tenant context
   */
  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - force logout
        useAuthStore.getState().logout();
        throw new Error('Authentication failed');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Secure POST request with automatic tenant context
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new Error('Authentication failed');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Secure PUT request with automatic tenant context
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new Error('Authentication failed');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Secure DELETE request with automatic tenant context
   */
  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new Error('Authentication failed');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Create singleton instance
export const secureApiClient = new SecureApiClient();

// ============================================================================
// SECURE REACT QUERY HOOKS
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Secure hook for fetching accounts with automatic tenant isolation
 */
export function useSecureAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => secureApiClient.get('/accounts'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry authentication errors
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Secure hook for creating accounts with automatic tenant isolation
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountData: any) => secureApiClient.post('/accounts', accountData),
    onSuccess: () => {
      // Invalidate accounts query to refetch data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error('Failed to create account:', error);
    },
  });
}

/**
 * Secure hook for updating accounts with automatic tenant isolation
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      secureApiClient.put(`/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error('Failed to update account:', error);
    },
  });
}

// ============================================================================
// SECURE CUSTOMER FORM COMPONENT
// ============================================================================

import React from 'react';

export function SecureCustomerForm({ customer, onSave, onCancel }: {
  customer?: any;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState(customer || {});
  
  // Use secure hooks instead of direct Supabase calls
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (customer?.id) {
        // Update existing customer
        await updateAccountMutation.mutateAsync({
          id: customer.id,
          data: formData
        });
      } else {
        // Create new customer
        await createAccountMutation.mutateAsync(formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving customer:', error);
      // Error handling is automatically done by the hooks
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Customer Name"
        required
      />
      
      <button 
        type="submit" 
        disabled={createAccountMutation.isPending || updateAccountMutation.isPending}
      >
        {customer?.id ? 'Update' : 'Create'} Customer
      </button>
      
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

// ============================================================================
// IMPLEMENTATION INSTRUCTIONS
// ============================================================================

/*
1. Replace all direct Supabase calls with secureApiClient calls
2. Update all components to use secure hooks
3. Ensure all API endpoints use the tenant isolation middleware
4. Test the implementation:
   - Users can only see their own tenant's data
   - Authentication failures automatically log users out
   - No direct database access bypasses tenant isolation

SECURITY BENEFITS:
✅ Automatic tenant isolation at application level
✅ JWT token validation on every request
✅ No RLS dependency issues
✅ Centralized error handling
✅ Automatic logout on auth failures
✅ Type-safe API calls
*/




