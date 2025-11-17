import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/lib/auth-service';
import { logger } from '@/utils/logger';

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
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Backend auth failed, trying to exchange Supabase token', { error }, 'secure-api-client');
      }
    }

    // Fallback: Try to exchange Supabase token for backend token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found. Please login first.');
    }

    try {
      // Exchange Supabase token for backend token
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Exchanging Supabase token for backend token', {}, 'secure-api-client');
      }
      const backendAuth = await authService.exchangeSupabaseToken(session.access_token);
      
      return {
        'Authorization': `Bearer ${backendAuth.token}`,
        'Content-Type': 'application/json',
        'x-tenant-id': '7193113e-ece2-4f7b-ae8c-176df4367e28', // Development tenant ID
      };
    } catch (error: unknown) {
      logger.error('Token exchange failed', error, 'secure-api-client');
      throw new Error('Failed to authenticate with backend. Please login again.');
    }
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - only clear if we're not on login page
        // This prevents clearing auth during the login flow
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          useAuthStore.getState().clear();
        }
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
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.post', { endpoint, data }, 'secure-api-client');
    }
    
    const headers = await this.getAuthHeaders();
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.post headers', { headers }, 'secure-api-client');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.post full URL', { url }, 'secure-api-client');
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.post response', { status: response.status, headers: Object.fromEntries(response.headers.entries()) }, 'secure-api-client');
    }

    return this.handleResponse<T>(response);
  }

  /**
   * Secure PUT request with automatic tenant context
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.put', { endpoint, data, phone: data?.phone }, 'secure-api-client');
    }
    
    const headers = await this.getAuthHeaders();
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.put headers', { headers }, 'secure-api-client');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.put full URL', { url }, 'secure-api-client');
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (process.env.NODE_ENV === 'development') {
      logger.debug('secureApiClient.put response', { status: response.status, headers: Object.fromEntries(response.headers.entries()) }, 'secure-api-client');
    }
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
      }
      
      // Get the response data for debugging
      const responseData = await response.clone().json();
      if (process.env.NODE_ENV === 'development') {
        logger.debug('secureApiClient.put response data', { responseData, phone: responseData?.phone }, 'secure-api-client');
      }
      
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
    return this.get<any[]>('/v1/accounts');
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(id: string): Promise<any> {
    return this.get<any>(`/v1/accounts/${id}`);
  }

  /**
   * Create a new account
   */
  async createAccount(accountData: any): Promise<any> {
    return this.post<any>('/v1/accounts', accountData);
  }

  /**
   * Update an existing account
   */
  async updateAccount(id: string, accountData: any): Promise<any> {
    return this.put<any>(`/v1/accounts/${id}`, accountData);
  }

  /**
   * Delete an account
   */
  async deleteAccount(id: string): Promise<void> {
    return this.delete<void>(`/v1/accounts/${id}`);
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


