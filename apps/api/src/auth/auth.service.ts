import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../common/services/database.service';
import { PermissionsService } from '../common/services/permissions.service';

@Injectable()
export class AuthService {
  private supabase;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private db: DatabaseService,
    private permissionsService: PermissionsService,
  ) {
    // Initialize Supabase client for auth operations
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Use the new Supabase secret key (server-side only)
    const supabaseSecretKey = this.configService.get<string>('SUPABASE_SECRET_KEY');
    
    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    this.logger.log('Initializing Supabase client', {
      operation: 'auth-service-init',
      url: supabaseUrl,
      keyType: supabaseSecretKey.startsWith('sb_secret_') ? 'New Secret Key' : 'Legacy Key',
    });
    
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
          const traceId = randomUUID();
          this.logger.warn('Failed to parse custom_permissions, using empty array', {
            operation: 'login',
            traceId,
            userId: dbUser.id,
            error: e instanceof Error ? e.message : 'Unknown error',
            errorCode: 'PARSE_PERMISSIONS_WARNING',
          });
          customPermissions = [];
        }
      }
      
      const traceId = randomUUID();
      this.logger.debug('Custom permissions from DB', {
        operation: 'login',
        traceId,
        userId: dbUser.id,
        email: dbUser.email,
        customPermissionsCount: Array.isArray(customPermissions) ? customPermissions.length : 0,
      });

      // Combine role-based permissions with custom permissions
      const permissions = this.permissionsService.getCombinedPermissions(roles, customPermissions);
      
      this.logger.debug('Combined permissions calculated', {
        operation: 'login',
        traceId,
        userId: dbUser.id,
        rolesCount: roles.length,
        customPermissionsCount: customPermissions.length,
        combinedPermissionsCount: permissions.length,
      });

      // Create JWT payload for our backend
      const payload = {
        sub: dbUser.id,
        email: dbUser.email,
        tenant_id: tenant_id,
        roles: roles,
        permissions: permissions,
      };

      this.logger.debug('JWT payload created', {
        operation: 'login',
        traceId,
        userId: payload.sub,
        tenantId: payload.tenant_id,
        rolesCount: payload.roles.length,
        permissionsCount: payload.permissions.length,
      });

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
      const traceId = randomUUID();
      this.logger.error('Login failed', {
        operation: 'login',
        traceId,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
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

      const traceId = randomUUID();
      this.logger.debug('JWT payload created for token exchange', {
        operation: 'exchange-supabase-token',
        traceId,
        userId: payload.sub,
        tenantId: payload.tenant_id,
      });

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
      const traceId = randomUUID();
      this.logger.error('Token exchange failed', {
        operation: 'exchange-supabase-token',
        traceId,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
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
          this.logger.warn('Failed to parse custom_permissions, using empty array', {
            operation: 'get-current-user',
            userId: dbUser.id,
            error: e instanceof Error ? e.message : String(e),
          });
          customPermissions = [];
        }
      }
      
      const traceId = randomUUID();
      this.logger.debug('Custom permissions from DB', {
        operation: 'get-current-user',
        traceId,
        userId: dbUser.id,
        customPermissionsCount: Array.isArray(customPermissions) ? customPermissions.length : 0,
      });
      
      const combinedPermissions = this.permissionsService.getCombinedPermissions(roles, customPermissions);
      
      this.logger.debug('Combined permissions calculated', {
        operation: 'get-current-user',
        traceId,
        userId: dbUser.id,
        rolesCount: roles.length,
        customPermissionsCount: customPermissions.length,
        combinedPermissionsCount: combinedPermissions.length,
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
      const traceId = randomUUID();
      this.logger.error('Failed to get user profile', {
        operation: 'get-current-user',
        traceId,
        userId,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw new UnauthorizedException('Failed to get user profile');
    }
  }
}
