import { createClient } from '@/lib/supabase';

export interface ServiceType {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  category_id?: string;
  service_price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class ServiceTypesApi {
  private baseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/service-types`;

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

  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service types: ${response.statusText}`);
    }

    const data = await response.json();
    return data.serviceTypes || [];
  }

  async getServiceType(id: string): Promise<ServiceType> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service type: ${response.statusText}`);
    }

    return response.json();
  }

  async createServiceType(data: Partial<ServiceType>): Promise<ServiceType> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create service type: ${response.statusText}`);
    }

    return response.json();
  }

  async updateServiceType(id: string, data: Partial<ServiceType>): Promise<ServiceType> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update service type: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteServiceType(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete service type: ${response.statusText}`);
    }
  }
}

export const serviceTypesApi = new ServiceTypesApi();
