import { User } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password?: string;
}

export interface UserListResponse {
  users: User[];
}

class UserApiService {
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

  async getUsers(): Promise<UserListResponse> {
    const url = `${API_BASE_URL}/users`;
    const headers = await this.getAuthHeaders();

    console.log('🔍 User API Request:', { url, headers });

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ User API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  }

  async createUser(userData: CreateUserDto): Promise<{ user: User; message: string }> {
    const url = `${API_BASE_URL}/users`;
    const headers = await this.getAuthHeaders();

    console.log('🔍 Create User API Request:', { url, headers, userData });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Create User API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  async syncUsers(): Promise<{ synced: number; users: User[]; message: string }> {
    const url = `${API_BASE_URL}/users/sync`;
    const headers = await this.getAuthHeaders();

    console.log('🔍 Sync Users API Request:', { url, headers });

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Sync Users API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to sync users: ${response.statusText}`);
    }

    return response.json();
  }
}

export const userApi = new UserApiService();
