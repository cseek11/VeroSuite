import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private jwtService: JwtService) {
    // Initialize Supabase client for auth operations
    const supabaseUrl = process.env.SUPABASE_URL;
    // Use the new Supabase secret key (server-side only)
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    
    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    console.log('Auth Service - Initializing Supabase client with URL:', supabaseUrl);
    console.log('Auth Service - Using secret key type:', supabaseSecretKey.startsWith('sb_secret_') ? 'New Secret Key' : 'Legacy Key');
    
    this.supabase = createClient(supabaseUrl, supabaseSecretKey);
  }

  async login(email: string, password: string) {
    try {
      // Use Supabase auth to validate credentials
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = authData.user;

      // Create JWT payload for our backend
      const payload = {
        sub: user.id,
        email: user.email,
        tenant_id: user.user_metadata?.tenant_id,
        roles: user.user_metadata?.roles || ['user'],
        permissions: [],
      };

      // Generate our own JWT token for backend API access
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          tenant_id: user.user_metadata?.tenant_id,
          roles: user.user_metadata?.roles || ['user'],
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async exchangeSupabaseToken(supabaseToken: string) {
    try {
      // Verify the Supabase token and get user info
      const { data: { user }, error } = await this.supabase.auth.getUser(supabaseToken);

      if (error || !user) {
        throw new UnauthorizedException('Invalid Supabase token');
      }

      // Create JWT payload for our backend
      const payload = {
        sub: user.id,
        email: user.email,
        tenant_id: user.user_metadata?.tenant_id,
        roles: user.user_metadata?.roles || ['user'],
        permissions: [],
      };

      // Generate our own JWT token for backend API access
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          tenant_id: user.user_metadata?.tenant_id,
          roles: user.user_metadata?.roles || ['user'],
        },
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new UnauthorizedException('Token exchange failed');
    }
  }
}
