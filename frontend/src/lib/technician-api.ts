import { 
  TechnicianProfile, 
  TechnicianListResponse, 
  CreateTechnicianProfileDto, 
  UpdateTechnicianProfileDto,
  TechnicianQueryParams 
} from '../types/technician';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class TechnicianApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
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
    if (!token) {
      token = localStorage.getItem('jwt'); // Fallback
    }
    const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  }

  async getTechnicians(params: TechnicianQueryParams = {}): Promise<TechnicianListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.department) searchParams.append('department', params.department);
    if (params.position) searchParams.append('position', params.position);
    if (params.employment_type) searchParams.append('employment_type', params.employment_type);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);

    const url = `${API_BASE_URL}/technicians${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const headers = await this.getAuthHeaders();
    
    console.log('🔍 Technician API Request:', { url, headers });
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Technician API Error:', { 
        status: response.status, 
        statusText: response.statusText, 
        error: errorText 
      });
      throw new Error(`Failed to fetch technicians: ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/technicians/dashboard/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
    }

    return response.json();
  }

  async getPerformanceMetrics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/technicians/dashboard/performance`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch performance metrics: ${response.statusText}`);
    }

    return response.json();
  }

  async getAvailabilityData(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/technicians/dashboard/availability`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch availability data: ${response.statusText}`);
    }

    return response.json();
  }

  async getTechnician(id: string): Promise<TechnicianProfile> {
    const response = await fetch(`${API_BASE_URL}/technicians/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch technician: ${response.statusText}`);
    }

    return response.json();
  }

  async createTechnician(data: CreateTechnicianProfileDto): Promise<TechnicianProfile> {
    const response = await fetch(`${API_BASE_URL}/technicians`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create technician: ${response.statusText}`);
    }

    return response.json();
  }

  async updateTechnician(id: string, data: UpdateTechnicianProfileDto): Promise<TechnicianProfile> {
    const response = await fetch(`${API_BASE_URL}/technicians/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update technician: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteTechnician(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/technicians/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete technician: ${response.statusText}`);
    }
  }
}

export const technicianApi = new TechnicianApiService();
