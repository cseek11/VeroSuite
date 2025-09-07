import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/lib/auth-service';

class SecureApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  }

  /**
   * Get authentication headers with JWT token
   */
  private async getAuthHeaders() {
    // Use the auth service to get backend API token
    if (authService.isAuthenticated()) {
      return authService.getAuthHeaders();
    }

    // Fallback to Supabase session for backward compatibility
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found. Please login first.');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - force logout
        useAuthStore.getState().clear();
        throw new Error('Authentication failed');
      }
      
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
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

    return this.handleResponse<T>(response);
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

    return this.handleResponse<T>(response);
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

    return this.handleResponse<T>(response);
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

    return this.handleResponse<T>(response);
  }

  // ============================================================================
  // ACCOUNTS API METHODS
  // ============================================================================

  /**
   * Get all accounts for the authenticated user's tenant
   */
  async getAllAccounts(): Promise<any[]> {
    return this.get<any[]>('/v1/crm/accounts');
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(id: string): Promise<any> {
    return this.get<any>(`/v1/crm/accounts/${id}`);
  }

  /**
   * Create a new account
   */
  async createAccount(accountData: any): Promise<any> {
    return this.post<any>('/v1/crm/accounts', accountData);
  }

  /**
   * Update an existing account
   */
  async updateAccount(id: string, accountData: any): Promise<any> {
    return this.put<any>(`/v1/crm/accounts/${id}`, accountData);
  }

  /**
   * Delete an account
   */
  async deleteAccount(id: string): Promise<void> {
    return this.delete<void>(`/v1/crm/accounts/${id}`);
  }

  // ============================================================================
  // CONVENIENCE METHODS (for backward compatibility)
  // ============================================================================

  /**
   * Accounts namespace for backward compatibility
   */
  get accounts() {
    return {
      getAll: () => this.getAllAccounts(),
      getById: (id: string) => this.getAccountById(id),
      create: (data: any) => this.createAccount(data),
      update: (id: string, data: any) => this.updateAccount(id, data),
      delete: (id: string) => this.deleteAccount(id),
    };
  }
}

// Create singleton instance
export const secureApiClient = new SecureApiClient();


