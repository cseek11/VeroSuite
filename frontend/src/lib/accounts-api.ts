import { createClient } from '@/lib/supabase';

export interface Account {
  id: string;
  tenant_id: string;
  name: string;
  account_type: string;
  status: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  billing_address?: any;
  payment_method?: string;
  billing_cycle?: string;
  property_type?: string;
  property_size?: string;
  access_instructions?: string;
  emergency_contact?: string;
  preferred_contact_method?: string;
  ar_balance: number;
  created_at: string;
  updated_at: string;
}

export interface AccountListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  account_type?: string;
}

export interface AccountListResponse {
  accounts: Account[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class AccountsApi {
  private baseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/accounts`;

  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get token from auth store (stored as JSON)
    let token = null;
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
    
    // Fallback to direct jwt key
    if (!token) {
      token = localStorage.getItem('jwt');
    }
    
    const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    
    // Debug logging
    console.log('AccountsApi - Token found:', !!token);
    console.log('AccountsApi - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('AccountsApi - Tenant ID:', tenantId);
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  }

  async getAccounts(params: AccountListParams = {}): Promise<AccountListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.account_type) searchParams.append('account_type', params.account_type);

    const response = await fetch(`${this.baseUrl}?${searchParams}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    console.log('AccountsApi - Response status:', response.status);
    console.log('AccountsApi - Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AccountsApi - Error response:', errorText);
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('AccountsApi - Response data:', data);
    
    // Handle the backend response format: { value: [...], Count: number }
    if (data.value && Array.isArray(data.value)) {
      return {
        accounts: data.value,
        pagination: {
          page: 1,
          limit: data.value.length,
          total: data.Count || data.value.length,
          pages: 1,
        },
      };
    }
    
    // Fallback for other response formats
    return data;
  }

  async getAccount(id: string): Promise<Account> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.statusText}`);
    }

    return response.json();
  }

  async createAccount(data: Partial<Account>): Promise<Account> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create account: ${response.statusText}`);
    }

    return response.json();
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update account: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteAccount(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete account: ${response.statusText}`);
    }
  }
}

export const accountsApi = new AccountsApi();
