import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';
import { DatabaseService } from '../common/services/database.service';
import { PermissionsService } from '../common/services/permissions.service';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
    private permissionsService: PermissionsService,
  ) {
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

      // Fetch user from database to get actual roles and permissions
      const dbUser = await this.db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          tenant_id: true,
          roles: true,
          custom_permissions: true,
        },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found in database');
      }

      // Extract tenant_id from database user
      const tenant_id = dbUser.tenant_id;
      
      if (!tenant_id) {
        throw new UnauthorizedException('User does not have a tenant_id assigned');
      }

      // Get roles from database (fallback to metadata if not in DB)
      const roles = dbUser.roles && dbUser.roles.length > 0 
        ? dbUser.roles 
        : (user.user_metadata?.roles || user.app_metadata?.roles || ['user']);

      // Get custom permissions from database - ensure it's always an array
      let customPermissions = dbUser.custom_permissions || [];
      if (!Array.isArray(customPermissions)) {
        // Handle case where it might be stored as JSON string
        try {
          customPermissions = typeof customPermissions === 'string' 
            ? JSON.parse(customPermissions) 
            : [];
        } catch (e) {
          console.warn('Failed to parse custom_permissions, using empty array:', e);
          customPermissions = [];
        }
      }
      
      console.log('Login - Custom permissions from DB:', {
        userId: dbUser.id,
        email: dbUser.email,
        customPermissions,
        customPermissionsType: Array.isArray(customPermissions) ? 'array' : typeof customPermissions,
        customPermissionsLength: Array.isArray(customPermissions) ? customPermissions.length : 'N/A'
      });

      // Combine role-based permissions with custom permissions
      const permissions = this.permissionsService.getCombinedPermissions(roles, customPermissions);
      
      console.log('Login - Combined permissions:', {
        userId: dbUser.id,
        email: dbUser.email,
        roles,
        customPermissionsCount: customPermissions.length,
        combinedPermissionsCount: permissions.length,
        combinedPermissions: permissions
      });

      // Create JWT payload for our backend
      const payload = {
        sub: dbUser.id,
        email: dbUser.email,
        tenant_id: tenant_id,
        roles: roles,
        permissions: permissions,
      };

      console.log('JWT Payload:', JSON.stringify(payload, null, 2));

      // Generate our own JWT token for backend API access
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          tenant_id: tenant_id,
          roles: roles,
          permissions: permissions,
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

      // Fetch user from database to get actual roles and permissions
      const dbUser = await this.db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          tenant_id: true,
          roles: true,
          custom_permissions: true,
        },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found in database');
      }

      // Extract tenant_id from database user
      const tenant_id = dbUser.tenant_id;
      
      if (!tenant_id) {
        throw new UnauthorizedException('User does not have a tenant_id assigned');
      }

      // Get roles from database (fallback to metadata if not in DB)
      const roles = dbUser.roles && dbUser.roles.length > 0 
        ? dbUser.roles 
        : (user.user_metadata?.roles || user.app_metadata?.roles || ['user']);

      // Get custom permissions from database
      const customPermissions = dbUser.custom_permissions || [];

      // Combine role-based permissions with custom permissions
      const permissions = this.permissionsService.getCombinedPermissions(roles, customPermissions);

      // Create JWT payload for our backend
      const payload = {
        sub: dbUser.id,
        email: dbUser.email,
        tenant_id: tenant_id,
        roles: roles,
        permissions: permissions,
      };

      console.log('JWT Payload:', JSON.stringify(payload, null, 2));

      // Generate our own JWT token for backend API access
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          tenant_id: tenant_id,
          roles: roles,
          permissions: permissions,
        },
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new UnauthorizedException('Token exchange failed');
    }
  }

  async getCurrentUser(userId: string) {
    try {
      // Fetch user from database to get latest roles and permissions
      const dbUser = await this.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          tenant_id: true,
          roles: true,
          custom_permissions: true,
          status: true,
        },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found in database');
      }

      // Combine role-based permissions with custom permissions
      const roles = dbUser.roles || [];
      let customPermissions = dbUser.custom_permissions || [];
      if (!Array.isArray(customPermissions)) {
        // Handle case where it might be stored as JSON string
        try {
          customPermissions = typeof customPermissions === 'string' 
            ? JSON.parse(customPermissions) 
            : [];
        } catch (e) {
          console.warn('Failed to parse custom_permissions, using empty array:', e);
          customPermissions = [];
        }
      }
      
      console.log('getCurrentUser - Custom permissions from DB:', {
        userId: dbUser.id,
        customPermissions,
        customPermissionsType: Array.isArray(customPermissions) ? 'array' : typeof customPermissions,
        customPermissionsLength: Array.isArray(customPermissions) ? customPermissions.length : 'N/A'
      });
      
      const combinedPermissions = this.permissionsService.getCombinedPermissions(roles, customPermissions);
      
      console.log('getCurrentUser - Combined permissions:', {
        userId: dbUser.id,
        roles,
        customPermissionsCount: customPermissions.length,
        combinedPermissionsCount: combinedPermissions.length,
        combinedPermissions: combinedPermissions
      });

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          tenant_id: dbUser.tenant_id,
          roles: roles,
          permissions: combinedPermissions,
          status: dbUser.status,
        },
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new UnauthorizedException('Failed to get user profile');
    }
  }
}
