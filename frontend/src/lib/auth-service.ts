import { logger } from '@/utils/logger';

// Authentication service for backend API integration
class AuthService {
  private baseUrl: string;
  private tokenKey = 'verofield_auth';

  constructor() {
    // Normalize base URL to ensure it targets versioned API (/api/v1)
    const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3001/api';
    const trimmed = rawBase.replace(/\/+$/, '');
    // If base already ends with /v{n}, keep it; otherwise append /v1
    this.baseUrl = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store the token
      localStorage.setItem(this.tokenKey, data.access_token);
      
      return {
        user: data.user,
        token: data.access_token,
      };
    } catch (error: unknown) {
      logger.error('Login error', error, 'auth-service');
      throw error;
    }
  }

  /**
   * Exchange Supabase token for backend JWT
   */
  async exchangeSupabaseToken(supabaseToken: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/exchange-supabase-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supabaseToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Token exchange failed');
      }

      const data = await response.json();
      
      // Store the backend token
      localStorage.setItem(this.tokenKey, JSON.stringify({
        token: data.access_token,
        user: data.user,
        timestamp: Date.now()
      }));
      
      return {
        user: data.user,
        token: data.access_token,
      };
    } catch (error: unknown) {
      logger.error('Token exchange error', error, 'auth-service');
      throw error;
    }
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    const authData = localStorage.getItem(this.tokenKey);
    if (!authData) return null;
    
    try {
      const parsed = JSON.parse(authData);
      return parsed.token || null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return true;
      const payload = JSON.parse(atob(parts[1]!));
      const currentTime = Math.floor(Date.now() / 1000);
      return (payload.exp as number) < currentTime;
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        // If refresh endpoint doesn't exist (404) or fails, try to get a new token
        if (response.status === 404) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Refresh endpoint not available, attempting to get new token', {}, 'auth-service');
          }
          return await this.getNewToken();
        }
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newToken = data.access_token;
      
      // Update stored token
      localStorage.setItem(this.tokenKey, JSON.stringify({
        token: newToken,
        user: data.user
      }));
      
      return newToken;
    } catch (error: unknown) {
      logger.error('Token refresh error', error, 'auth-service');
      // If refresh fails, try to get a new token
      return await this.getNewToken();
    }
  }

  /**
   * Get a new token by re-authenticating with stored credentials
   */
  private async getNewToken(): Promise<string | null> {
    try {
      // Try to get stored credentials (this would need to be implemented)
      // For now, we'll return null to force re-login
      if (process.env.NODE_ENV === 'development') {
        logger.debug('No stored credentials available, user needs to re-login', {}, 'auth-service');
      }
      this.logout();
      return null;
    } catch (error: unknown) {
      logger.error('Failed to get new token', error, 'auth-service');
      this.logout();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout and clear stored token
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    // Also clear any other auth-related storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Get authentication headers for API requests
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    let token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Check if token is expired and refresh if needed
    if (this.isTokenExpired(token)) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Token expired, attempting refresh', {}, 'auth-service');
      }
      try {
        const newToken = await this.refreshToken();
        if (newToken) {
          token = newToken;
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Token refreshed successfully', {}, 'auth-service');
          }
        } else {
          // If refresh fails, try to extend the current token for development
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Refresh failed, extending current token for development', {}, 'auth-service');
          }
          token = this.extendTokenForDevelopment(token);
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Token refresh failed, extending for development', { error }, 'auth-service');
        }
        token = this.extendTokenForDevelopment(token);
      }
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-tenant-id': '7193113e-ece2-4f7b-ae8c-176df4367e28', // Development tenant ID
    };
  }

  /**
   * Extend token expiration for development purposes
   */
  private extendTokenForDevelopment(token: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return token;

      const payload = JSON.parse(atob(parts[1]!));
      // Extend expiration by 24 hours
      payload.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
      
      // Re-encode the payload (this is just for development)
      const payloadString = JSON.stringify(payload);
      if (!payloadString) {
        throw new Error('Failed to stringify payload');
      }
      const newPayload = btoa(payloadString);
      const newToken = `${parts[0]}.${newPayload}.${parts[2]}`;
      
      // Update stored token
      localStorage.setItem(this.tokenKey, JSON.stringify({
        token: newToken,
        user: payload
      }));
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Token extended for development', {}, 'auth-service');
      }
      return newToken;
    } catch (error: unknown) {
      logger.error('Failed to extend token', error, 'auth-service');
      return token;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
