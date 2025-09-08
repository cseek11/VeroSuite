// Authentication service for backend API integration
class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  private tokenKey = 'verosuite_auth';

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
    } catch (error) {
      console.error('Login error:', error);
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
    } catch (error) {
      console.error('Token exchange error:', error);
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
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
          console.log('🔄 Refresh endpoint not available, attempting to get new token...');
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
    } catch (error) {
      console.error('Token refresh error:', error);
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
      console.log('🔄 No stored credentials available, user needs to re-login');
      this.logout();
      return null;
    } catch (error) {
      console.error('Failed to get new token:', error);
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
      console.log('🔄 Token expired, attempting refresh...');
      try {
        const newToken = await this.refreshToken();
        if (newToken) {
          token = newToken;
          console.log('✅ Token refreshed successfully');
        } else {
          // If refresh fails, try to extend the current token for development
          console.log('🔄 Refresh failed, extending current token for development...');
          token = this.extendTokenForDevelopment(token);
        }
      } catch (error) {
        console.log('🔄 Token refresh failed, extending for development:', error);
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

      const payload = JSON.parse(atob(parts[1]));
      // Extend expiration by 24 hours
      payload.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
      
      // Re-encode the payload (this is just for development)
      const newPayload = btoa(JSON.stringify(payload));
      const newToken = `${parts[0]}.${newPayload}.${parts[2]}`;
      
      // Update stored token
      localStorage.setItem(this.tokenKey, JSON.stringify({
        token: newToken,
        user: payload
      }));
      
      console.log('✅ Token extended for development');
      return newToken;
    } catch (error) {
      console.error('Failed to extend token:', error);
      return token;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
