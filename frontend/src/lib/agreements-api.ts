import { createClient } from '@/lib/supabase';

export interface ServiceAgreement {
  id: string;
  tenant_id: string;
  account_id: string;
  service_type_id: string;
  agreement_number: string;
  title: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
  terms?: string;
  pricing?: number;
  billing_frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  auto_renewal?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  accounts: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  service_types: {
    id: string;
    name: string;
    description?: string;
  };
  Invoice?: Array<{
    id: string;
    invoice_number: string;
    status: string;
    total_amount: number;
    due_date: string;
  }>;
}

export interface CreateAgreementData {
  account_id: string;
  service_type_id: string;
  agreement_number: string;
  title: string;
  start_date: string;
  end_date?: string;
  status?: 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
  terms?: string;
  pricing?: number;
  billing_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  auto_renewal?: boolean;
}

export interface UpdateAgreementData extends Partial<CreateAgreementData> {}

export interface AgreementListParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
  customerId?: string;
}

export interface AgreementListResponse {
  agreements: ServiceAgreement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AgreementStats {
  totalAgreements: number;
  activeAgreements: number;
  expiredAgreements: number;
  pendingAgreements: number;
  totalValue: number;
}

class AgreementsApi {
  private baseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/agreements`;

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
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  }

  async getAgreements(params: AgreementListParams = {}): Promise<AgreementListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.customerId) searchParams.append('customerId', params.customerId);

    const response = await fetch(`${this.baseUrl}?${searchParams}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agreements: ${response.statusText}`);
    }

    return response.json();
  }

  async getAgreement(id: string): Promise<ServiceAgreement> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agreement: ${response.statusText}`);
    }

    return response.json();
  }

  async createAgreement(data: CreateAgreementData): Promise<ServiceAgreement> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create agreement: ${response.statusText}`);
    }

    return response.json();
  }

  async updateAgreement(id: string, data: UpdateAgreementData): Promise<ServiceAgreement> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update agreement: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteAgreement(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete agreement: ${response.statusText}`);
    }
  }

  async getAgreementStats(): Promise<AgreementStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agreement stats: ${response.statusText}`);
    }

    return response.json();
  }

  async getExpiringAgreements(days: number = 30): Promise<ServiceAgreement[]> {
    const response = await fetch(`${this.baseUrl}/expiring?days=${days}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch expiring agreements: ${response.statusText}`);
    }

    return response.json();
  }
}

export const agreementsApi = new AgreementsApi();
