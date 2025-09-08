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
    try {
      // Try to use the auth service to get backend API token
      if (authService.isAuthenticated()) {
        return await authService.getAuthHeaders();
      }
    } catch (error) {
      console.log('🔄 Backend auth failed, trying to exchange Supabase token:', error);
    }

    // Fallback: Try to exchange Supabase token for backend token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found. Please login first.');
    }

    try {
      // Exchange Supabase token for backend token
      console.log('🔄 Exchanging Supabase token for backend token...');
      const backendAuth = await authService.exchangeSupabaseToken(session.access_token);
      
      return {
        'Authorization': `Bearer ${backendAuth.token}`,
        'Content-Type': 'application/json',
        'x-tenant-id': '7193113e-ece2-4f7b-ae8c-176df4367e28', // Development tenant ID
      };
    } catch (error) {
      console.error('❌ Token exchange failed:', error);
      throw new Error('Failed to authenticate with backend. Please login again.');
    }
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
    console.log('🔍 secureApiClient.post - endpoint:', endpoint);
    console.log('🔍 secureApiClient.post - data:', data);
    
    const headers = await this.getAuthHeaders();
    console.log('🔍 secureApiClient.post - headers:', headers);
    
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🔍 secureApiClient.post - full URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('🔍 secureApiClient.post - response status:', response.status);
    console.log('🔍 secureApiClient.post - response headers:', response.headers);

    return this.handleResponse<T>(response);
  }

  /**
   * Secure PUT request with automatic tenant context
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    console.log('🔧 secureApiClient.put - endpoint:', endpoint);
      console.log('🔧 secureApiClient.put - data:', data);
      console.log('🔧 secureApiClient.put - data phone:', data?.phone);
    
    const headers = await this.getAuthHeaders();
    console.log('🔧 secureApiClient.put - headers:', headers);
    
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🔧 secureApiClient.put - full URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

      console.log('🔧 secureApiClient.put - response status:', response.status);
      console.log('🔧 secureApiClient.put - response headers:', response.headers);
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
      }
      
      // Get the response data for debugging
      const responseData = await response.clone().json();
      console.log('🔧 secureApiClient.put - response data:', responseData);
      console.log('🔧 secureApiClient.put - response data phone:', responseData?.phone);
      
      // Return the response data directly instead of calling handleResponse
      return responseData;
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
    return this.get<any[]>('/accounts');
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(id: string): Promise<any> {
    return this.get<any>(`/accounts/${id}`);
  }

  /**
   * Create a new account
   */
  async createAccount(accountData: any): Promise<any> {
    return this.post<any>('/accounts', accountData);
  }

  /**
   * Update an existing account
   */
  async updateAccount(id: string, accountData: any): Promise<any> {
    return this.put<any>(`/accounts/${id}`, accountData);
  }

  /**
   * Delete an account
   */
  async deleteAccount(id: string): Promise<void> {
    return this.delete<void>(`/accounts/${id}`);
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


