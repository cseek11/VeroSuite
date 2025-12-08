import { User } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password?: string;
  employee_id?: string;
  hire_date?: string;
  position?: string;
  department?: string;
  employment_type?: 'full_time' | 'part_time' | 'contractor' | 'temporary';
  roles?: string[];
  custom_permissions?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  social_security_number?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  driver_license_expiry?: string;
  qualifications?: string[];
  technician_number?: string;
  pesticide_license_number?: string;
  license_expiration_date?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface UserListResponse {
  users: User[];
}

class UserApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    let token = null;
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      }
    } catch (error: unknown) {
      logger.error('Error parsing auth data', error, 'user-api');
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
    const url = `${API_BASE_URL}/v1/users`;
    const headers = await this.getAuthHeaders();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('User API Request', { url, headers }, 'user-api');
    }

    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers,
      });
    } catch (error) {
      logger.error('Failed to fetch from user API', {
        error: error instanceof Error ? error.message : String(error),
        url
      });
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('User API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, 'user-api');
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  }

  async createUser(userData: CreateUserDto): Promise<{ user: User; message: string }> {
    const url = `${API_BASE_URL}/v1/users`;
    const headers = await this.getAuthHeaders();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Create User API Request', { url, headers, userData }, 'user-api');
    }

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Create User API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, 'user-api');

      // Try to parse error message from response
      let errorMessage = `Failed to create user: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          // Handle array of messages or single message
          if (Array.isArray(errorJson.message)) {
            errorMessage = errorJson.message.join(', ');
          } else {
            errorMessage = errorJson.message;
          }
        } else if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // If parsing fails, use the raw error text if available
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
    } catch (error) {
      logger.error('Failed to create user via API', {
        error: error instanceof Error ? error.message : String(error),
        url
      });
      throw error;
    }
  }

  async syncUsers(): Promise<{ synced: number; users: User[]; message: string }> {
    const url = `${API_BASE_URL}/v1/users/sync`;
    const headers = await this.getAuthHeaders();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Sync Users API Request', { url, headers }, 'user-api');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Sync Users API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, 'user-api');
      throw new Error(`Failed to sync users: ${response.statusText}`);
    }

    return response.json();
  }

  async getNextEmployeeId(role: string = 'technician'): Promise<string> {
    const url = `${API_BASE_URL}/v1/users/next-employee-id?role=${encodeURIComponent(role)}`;
    const headers = await this.getAuthHeaders();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Get Next Employee ID API Request', { url, headers, role }, 'user-api');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Get Next Employee ID API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, 'user-api');
      throw new Error(`Failed to get next employee ID: ${response.statusText}`);
    }

    const data = await response.json();
    return data.employee_id;
  }

  async updateUser(userId: string, userData: UpdateUserDto): Promise<{ user: User; message: string }> {
    const url = `${API_BASE_URL}/v1/users/${userId}`;
    const headers = await this.getAuthHeaders();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Update User API Request', { url, headers, userData }, 'user-api');
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Update User API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, 'user-api');
      
      // Try to parse error message from response
      let errorMessage = `Failed to update user: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          // Handle array of messages or single message
          if (Array.isArray(errorJson.message)) {
            errorMessage = errorJson.message.join(', ');
          } else {
            errorMessage = errorJson.message;
          }
        } else if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // If parsing fails, use the raw error text if available
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<any[]> {
    const url = `${API_BASE_URL}/v1/users/${userId}/activity?limit=${limit}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user activity: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserHierarchy(userId: string): Promise<any> {
    const url = `${API_BASE_URL}/v1/users/${userId}/hierarchy`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user hierarchy: ${response.statusText}`);
    }

    return response.json();
  }
}

export const userApi = new UserApiService();
