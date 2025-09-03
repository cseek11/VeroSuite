import { create } from 'zustand';
import { supabase } from '@/lib/supabase-client';

interface AuthState {
  token: string | null;
  tenantId: string | null;
  user: any | null;
  isAuthenticated: boolean | null;
  setAuth: (data: { token: string; user: any }) => void;
  clear: () => void;
  validateTenantAccess: () => Promise<boolean>;
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
    const raw = localStorage.getItem('verosuite_auth');
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
      console.error('setAuth: Missing required fields');
      return;
    }
    
    // Get tenant ID from database (not from user metadata)
    try {
      // Get the user's valid tenant ID from database
      const { data: validTenantId, error: tenantError } = await supabase
        .rpc('get_user_tenant_id', {
          user_email: user.email
        });
      
      if (tenantError) {
        console.error('Failed to get user tenant ID:', tenantError.message);
        throw new Error(`Failed to get user tenant ID: ${tenantError.message}`);
      }
      
      if (!validTenantId) {
        console.error('No tenant ID found for user in database');
        throw new Error('No tenant ID found for user in database');
      }
      
      console.log('✅ User tenant ID validated from database:', validTenantId);
      
      // Store auth data with validated tenant ID
      localStorage.setItem('verosuite_auth', JSON.stringify({ token, tenantId: validTenantId, user }));
      set({ token, tenantId: validTenantId, user, isAuthenticated: true });
      
    } catch (error) {
      console.error('Error validating tenant ID during login:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  },
  clear: () => {
    // Clear all possible auth storage
    localStorage.removeItem('verosuite_auth');
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
}));
