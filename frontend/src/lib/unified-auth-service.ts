// ============================================================================
// UNIFIED AUTHENTICATION SERVICE
// ============================================================================
// Centralized authentication service for VeroSuite CRM

import { supabase } from './supabase-client';
import { searchErrorLogger } from './search-error-logger';

export interface AuthUser {
  id: string;
  email: string;
  tenant_id: string;
  role?: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

class UnifiedAuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: AuthSession | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Auth initialization error:', error);
        return;
      }

      if (session?.user) {
        await this.setCurrentUser(session.user);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.setCurrentUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.currentSession = null;
        }
      });
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'auth_initialization',
        error: error as Error,
        context: { timestamp: new Date().toISOString() }
      });
    }
  }

  private async setCurrentUser(user: any) {
    try {
      const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
      
      if (!tenantId) {
        throw new Error('No tenant_id found in user metadata');
      }

      this.currentUser = {
        id: user.id,
        email: user.email,
        tenant_id: tenantId,
        role: user.user_metadata?.role || 'user'
      };

      this.currentSession = {
        user: this.currentUser,
        access_token: user.access_token || '',
        refresh_token: user.refresh_token || ''
      };

      console.log('✅ User authenticated:', this.currentUser.email, 'Tenant:', this.currentUser.tenant_id);
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'set_current_user',
        error: error as Error,
        context: { 
          userId: user?.id,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(`Sign in failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('No user returned from sign in');
      }

      await this.setCurrentUser(data.user);
      return this.currentUser!;
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'sign_in',
        error: error as Error,
        context: { email, timestamp: new Date().toISOString() }
      });
      throw error;
    }
  }

  async signUp(email: string, password: string, tenantId: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tenant_id: tenantId
          }
        }
      });

      if (error) {
        throw new Error(`Sign up failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('No user returned from sign up');
      }

      await this.setCurrentUser(data.user);
      return this.currentUser!;
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'sign_up',
        error: error as Error,
        context: { email, tenantId, timestamp: new Date().toISOString() }
      });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Sign out failed: ${error.message}`);
      }

      this.currentUser = null;
      this.currentSession = null;
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'sign_out',
        error: error as Error,
        context: { timestamp: new Date().toISOString() }
      });
      throw error;
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getTenantId(): string | null {
    return this.currentUser?.tenant_id || null;
  }

  async refreshSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw new Error(`Session refresh failed: ${error.message}`);
      }

      if (data.session?.user) {
        await this.setCurrentUser(data.session.user);
        return this.currentSession;
      }

      return null;
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'refresh_session',
        error: error as Error,
        context: { timestamp: new Date().toISOString() }
      });
      return null;
    }
  }

  // Test authentication with default credentials
  async testAuth(): Promise<boolean> {
    try {
      const testEmail = 'test@veropest.com';
      const testPassword = 'TestPassword123!';
      const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

      // Try to sign in first
      try {
        await this.signIn(testEmail, testPassword);
        return true;
      } catch (signInError) {
        // If sign in fails, try to create the user
        try {
          await this.signUp(testEmail, testPassword, testTenantId);
          return true;
        } catch (signUpError) {
          console.warn('Test auth failed:', signUpError);
          return false;
        }
      }
    } catch (error) {
      searchErrorLogger.logError({
        operation: 'test_auth',
        error: error as Error,
        context: { timestamp: new Date().toISOString() }
      });
      return false;
    }
  }
}

export const unifiedAuthService = new UnifiedAuthService();
