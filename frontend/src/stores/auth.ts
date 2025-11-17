import { create } from 'zustand';
import { logger } from '@/utils/logger';

interface AuthState {
  token: string | null;
  tenantId: string | null;
  user: any | null;
  isAuthenticated: boolean | null;
  setAuth: (data: { token: string; user: any }) => void;
  clear: () => void;
  validateTenantAccess: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

// Add tenant resolution logic
const resolveTenantId = (user: any): string | null => {
  // Try multiple sources for tenant ID
  return user?.user_metadata?.tenant_id || 
         user?.app_metadata?.tenant_id || 
         null;
};

function loadPersisted(): Pick<AuthState, 'token' | 'tenantId' | 'user' | 'isAuthenticated'> {
  try {
    const raw = localStorage.getItem('verofield_auth');
    if (!raw) return { token: null, tenantId: null, user: null, isAuthenticated: null } as any;
    const parsed = JSON.parse(raw);
    
    // Validate that we have both token and user
    if (!parsed.token || !parsed.user) {
      return { token: null, tenantId: null, user: null, isAuthenticated: null } as any;
    }
    
    return { ...parsed, isAuthenticated: true };
  } catch {
    return { token: null, tenantId: null, user: null, isAuthenticated: null } as any;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadPersisted(),
  setAuth: async ({ token, user }) => {
    // Validate required fields
    if (!token || !user) {
      logger.error('setAuth: Missing required fields', new Error('Token or user missing'), 'auth-store');
      return;
    }
    
    // Get tenant ID from JWT token (already validated by backend)
    try {
      const tenantId = user.tenant_id;
      
      if (!tenantId) {
        console.error('No tenant ID found in user data');
        throw new Error('No tenant ID found in user data');
      }
      
      console.log('✅ User tenant ID from JWT token:', tenantId);
      console.log('✅ User permissions on login:', {
        hasPermissions: !!user.permissions,
        permissionsCount: user.permissions?.length || 0,
        permissions: user.permissions
      });
      
      // Store auth data with tenant ID from JWT
      localStorage.setItem('verofield_auth', JSON.stringify({ token, tenantId, user }));
      set({ token, tenantId, user, isAuthenticated: true });
      
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  },
  clear: () => {
    // Clear all possible auth storage
    localStorage.removeItem('verofield_auth');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    
    // Clear Supabase-specific storage
    const supabaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    );
    supabaseKeys.forEach(key => localStorage.removeItem(key));
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear state
    set({ token: null, tenantId: null, user: null, isAuthenticated: null });
    
    console.log('🧹 Auth store cleared completely');
  },

  forceLogout: async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log('✅ Supabase auth signed out');
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    }
    
    // Clear local storage and state
    get().clear();
    
    // Clear ALL possible Supabase storage
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
        localStorage.removeItem(key);
        console.log('🗑️ Removed:', key);
      }
    });
    
    // Clear session storage completely
    sessionStorage.clear();
    
    // Clear cookies (if any)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear any remaining auth state
    try {
      // Force clear any remaining Supabase session
      await supabase.auth.setSession(null);
      console.log('✅ Supabase session cleared');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
    
    console.log('🧹 Complete cleanup done');
    
    // Force page reload to clear any remaining state
    window.location.reload();
  },

  nuclearLogout: async () => {
    console.log('🚨 NUCLEAR LOGOUT - Complete system reset');
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log('✅ Supabase auth signed out');
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    }
    
    // Clear ALL storage without exceptions
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear state
    set({ token: null, tenantId: null, user: null, isAuthenticated: null });
    
    console.log('🧨 Nuclear cleanup complete - redirecting to login');
    
    // Redirect to login page instead of reload
    window.location.href = '/login';
  },
  validateTenantAccess: async () => {
    const { user, tenantId } = get();
    
    if (!user) {
      console.error('Cannot validate tenant access: missing user');
      set({ isAuthenticated: false });
      return false;
    }
    
    // If no tenantId in state, get it from database
    let currentTenantId = tenantId;
    if (!currentTenantId) {
      try {
        // Get the user's valid tenant ID from database
        const { data: validTenantId, error: tenantError } = await supabase
          .rpc('get_user_tenant_id', {
            user_email: user.email
          });
        
        if (tenantError) {
          console.error('Failed to get user tenant ID:', tenantError.message);
          set({ isAuthenticated: false });
          return false;
        }
        
        if (validTenantId) {
          currentTenantId = validTenantId;
          set({ tenantId: validTenantId });
        } else {
          console.error('No tenant ID found for user in database');
          set({ isAuthenticated: false });
          return false;
        }
      } catch (error) {
        console.error('Error getting user tenant ID:', error);
        set({ isAuthenticated: false });
        return false;
      }
    }
    
    // Now validate that the user has access to this tenant
    try {
      // Validate the user has access to this tenant
      const { data: validationResult, error: validationError } = await supabase
        .rpc('validate_user_tenant_access', {
          user_email: user.email,
          claimed_tenant_id: currentTenantId
        });
      
      if (validationError) {
        console.error('Tenant validation failed:', validationError.message);
        set({ isAuthenticated: false });
        return false;
      }
      
      if (validationResult) {
        console.log('✅ User tenant access validated for:', currentTenantId);
        set({ isAuthenticated: true, tenantId: currentTenantId });
        return true;
      } else {
        console.error('Tenant validation returned false');
        set({ isAuthenticated: false });
        return false;
      }
    } catch (error) {
      console.error('Error validating tenant access:', error);
      set({ isAuthenticated: false });
      return false;
    }
  },
  refreshToken: async (): Promise<string | null> => {
    const { token } = get();
    
    if (!token) {
      logger.warn('Cannot refresh token: no token', {}, 'auth-store');
      return null;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${baseUrl}/v1/auth/refresh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newToken = data.access_token;

      // Update the stored token
      const currentAuth = localStorage.getItem('verofield_auth');
      if (currentAuth) {
        const parsed = JSON.parse(currentAuth);
        const updatedAuth = {
          ...parsed,
          token: newToken,
        };
        localStorage.setItem('verofield_auth', JSON.stringify(updatedAuth));
        set({ token: newToken });
        logger.debug('Token refreshed', {}, 'auth-store');
      }

      return newToken;
    } catch (error) {
      logger.error('Error refreshing token', error, 'auth-store');
      return null;
    }
  },
  refreshUser: async () => {
    const { token, user: currentUser } = get();
    
    if (!token) {
      logger.warn('Cannot refresh user: no token', {}, 'auth-store');
      return;
    }

    // Don't refresh if we don't have a user yet (might be during login)
    if (!currentUser) {
      logger.debug('Skipping refresh - no user in store yet', {}, 'auth-store');
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      
      // First, get latest user data
      const userResponse = await fetch(`${baseUrl}/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        // If we get 401, the token might be invalid - don't clear auth, just log and return
        // Don't throw an error as this will cause issues
        if (userResponse.status === 401) {
          logger.warn('Token invalid during refresh - user may need to re-login', {}, 'auth-store');
          // Don't clear auth here - let the user continue with their current session
          // They'll be prompted to login when they try to access protected resources
          return;
        }
        // For other errors, log but don't throw - preserve current auth state
        logger.warn('Failed to refresh user data (non-critical)', { 
          status: userResponse.status 
        }, 'auth-store');
        return;
      }

      const userData = await userResponse.json();
      const updatedUser = userData.user;

      // Then, refresh the token to get updated roles/permissions in JWT
      // This is optional - if it fails, we still update user data
      let newToken = token;
      try {
        const tokenResponse = await fetch(`${baseUrl}/v1/auth/refresh`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          // RefreshTokenResponseDto returns { data: { access_token, ... }, token: { access_token, ... } }
          newToken = tokenData.token?.access_token || tokenData.data?.access_token || tokenData.access_token;
        } else {
          // Token refresh failed, but we still have user data - use existing token
          logger.debug('Token refresh failed, using existing token', { status: tokenResponse.status }, 'auth-store');
        }
      } catch (tokenError) {
        // Token refresh failed, but continue with user data update
        logger.debug('Token refresh error (non-critical)', tokenError, 'auth-store');
      }

      // Update the stored user data and token
      // Only update if we successfully got new data
      if (updatedUser && newToken) {
        const currentAuth = localStorage.getItem('verofield_auth');
        if (currentAuth) {
          try {
            const parsed = JSON.parse(currentAuth);
            const updatedAuth = {
              ...parsed,
              user: updatedUser,
              token: newToken,
            };
            localStorage.setItem('verofield_auth', JSON.stringify(updatedAuth));
            set({ user: updatedUser, token: newToken });
            logger.debug('User data and token refreshed', { 
              userId: updatedUser.id,
              roles: updatedUser.roles,
              permissionsCount: updatedUser.permissions?.length || 0,
              permissions: updatedUser.permissions
            }, 'auth-store');
          } catch (error) {
            // If localStorage update fails, don't clear auth - just log
            logger.warn('Failed to update localStorage during refresh (non-critical)', error, 'auth-store');
          }
        } else {
          // If no stored auth, create it with the refreshed data
          localStorage.setItem('verofield_auth', JSON.stringify({ 
            token: newToken, 
            user: updatedUser,
            tenantId: updatedUser.tenant_id 
          }));
          set({ user: updatedUser, token: newToken });
          logger.debug('Created new auth storage with refreshed data', { 
            userId: updatedUser.id,
            roles: updatedUser.roles,
            permissionsCount: updatedUser.permissions?.length || 0
          }, 'auth-store');
        }
      } else {
        logger.warn('Refresh completed but no user data or token to update', {
          hasUpdatedUser: !!updatedUser,
          hasNewToken: !!newToken
        }, 'auth-store');
      }
    } catch (error) {
      // Don't clear auth on refresh error - just log it
      logger.error('Error refreshing user data (non-critical)', error, 'auth-store');
    }
  },
}));
