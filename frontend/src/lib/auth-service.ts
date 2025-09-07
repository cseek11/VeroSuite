// Authentication service for backend API integration
class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  private tokenKey = 'auth_token';

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
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
