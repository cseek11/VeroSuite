// ============================================================================
// TENANT ISOLATION MIDDLEWARE - Application-Level Security
// ============================================================================
// This provides tenant isolation at the application level instead of relying on RLS
// 
// Priority: P0 - CRITICAL SECURITY IMPLEMENTATION
// 
// Author: VeroSuite Security Audit
// Date: January 2, 2025
// ============================================================================

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../common/services/supabase.service';

// Extend Request interface to include tenant context
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: {
        id: string;
        tenant_id: string;
        roles: string[];
      };
    }
  }
}

@Injectable()
export class TenantIsolationMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No valid token provided');
      }

      const token = authHeader.substring(7);
      const supabase = this.supabaseService.getClient();

      // Verify and decode the JWT token
      const { data: user, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Extract tenant_id from user metadata
      const tenantId = user.user?.user_metadata?.tenant_id;
      
      if (!tenantId) {
        throw new UnauthorizedException('No tenant context found');
      }

      // Set tenant context on request
      req.tenantId = tenantId;
      req.user = {
        id: user.user.id,
        tenant_id: tenantId,
        roles: user.user?.user_metadata?.roles || []
      };

      // Set Supabase session context for this request
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: user.user?.refresh_token || ''
      });

      next();
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

// ============================================================================
// TENANT-AWARE SERVICE BASE CLASS
// ============================================================================

export abstract class TenantAwareService {
  constructor(protected readonly supabaseService: SupabaseService) {}

  /**
   * Get Supabase client with tenant context
   */
  protected getSupabaseWithTenant(tenantId: string) {
    const supabase = this.supabaseService.getClient();
    
    // All queries will automatically filter by tenant_id
    return {
      from: (table: string) => {
        return supabase
          .from(table)
          .select()
          .eq('tenant_id', tenantId);
      },
      
      insert: (table: string, data: any) => {
        return supabase
          .from(table)
          .insert({ ...data, tenant_id: tenantId });
      },
      
      update: (table: string, data: any) => {
        return supabase
          .from(table)
          .update(data)
          .eq('tenant_id', tenantId);
      },
      
      delete: (table: string) => {
        return supabase
          .from(table)
          .delete()
          .eq('tenant_id', tenantId);
      }
    };
  }
}

// ============================================================================
// EXAMPLE: SECURE ACCOUNTS SERVICE
// ============================================================================

@Injectable()
export class SecureAccountsService extends TenantAwareService {
  
  async getAccountsForTenant(tenantId: string) {
    const supabase = this.getSupabaseWithTenant(tenantId);
    
    const { data, error } = await supabase.from('accounts');
    
    if (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }
    
    return data;
  }
  
  async createAccount(tenantId: string, accountData: any) {
    const supabase = this.getSupabaseWithTenant(tenantId);
    
    const { data, error } = await supabase.insert('accounts', accountData);
    
    if (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
    
    return data;
  }
  
  async updateAccount(tenantId: string, accountId: string, updates: any) {
    const supabase = this.getSupabaseWithTenant(tenantId);
    
    const { data, error } = await supabase
      .update('accounts', updates)
      .eq('id', accountId);  // Additional filter by account ID
    
    if (error) {
      throw new Error(`Failed to update account: ${error.message}`);
    }
    
    return data;
  }
}

// ============================================================================
// USAGE IN CONTROLLERS
// ============================================================================

import { Controller, Get, Post, Put, Body, Param, Req } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: SecureAccountsService) {}

  @Get()
  async getAccounts(@Req() req: Request) {
    // Tenant context is automatically available from middleware
    return this.accountsService.getAccountsForTenant(req.tenantId!);
  }

  @Post()
  async createAccount(@Req() req: Request, @Body() accountData: any) {
    return this.accountsService.createAccount(req.tenantId!, accountData);
  }

  @Put(':id')
  async updateAccount(
    @Req() req: Request,
    @Param('id') accountId: string,
    @Body() updates: any
  ) {
    return this.accountsService.updateAccount(req.tenantId!, accountId, updates);
  }
}

// ============================================================================
// INSTALLATION INSTRUCTIONS
// ============================================================================

/*
1. Add this middleware to your main app module:

// app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TenantIsolationMiddleware } from './middleware/tenant-isolation.middleware';

@Module({
  // ... other config
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantIsolationMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}

2. Update your services to extend TenantAwareService

3. Update your controllers to use req.tenantId

4. Test the implementation:
   - All API calls require valid JWT with tenant context
   - All database queries automatically filter by tenant_id
   - No cross-tenant data leakage possible
*/


