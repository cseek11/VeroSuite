import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service';
import { JwtService } from '@nestjs/jwt';

// Extend Express Request with user context (populated by auth guard)
declare global {
  namespace Express {
    interface UserContext {
      userId: string;
      tenantId: string;
      roles: string[];
      permissions?: string[];
    }
    interface Request {
      user?: UserContext;
      tenantId?: string; // Add tenantId directly to request for easy access
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      // Debug logging to understand the request structure
      this.logger.debug('=== TENANT MIDDLEWARE DEBUG ===');
      this.logger.debug('Request URL:', req.url);
      this.logger.debug('Request Method:', req.method);
      this.logger.debug('Request Headers:', JSON.stringify(req.headers, null, 2));
      this.logger.debug('Request User:', JSON.stringify(req.user, null, 2));
      this.logger.debug('Request User TenantId:', req.user?.tenantId);
      this.logger.debug('X-Tenant-ID Header:', req.headers['x-tenant-id']);
      this.logger.debug('================================');

      // Extract tenant ID from JWT token, user context, or headers (development)
      let tenantId = req.user?.tenantId || (req.headers['x-tenant-id'] as string);
      
      // If no tenant ID found, try to extract from JWT token
      if (!tenantId) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          try {
            const token = authHeader.substring(7);
            const payload = this.jwtService.decode(token) as any;
            if (payload && payload.tenant_id) {
              tenantId = payload.tenant_id;
              this.logger.debug('Extracted tenant ID from JWT token:', tenantId);
            }
          } catch (error) {
            this.logger.debug('Failed to decode JWT token:', (error as Error).message);
          }
        }
      }

      if (!tenantId) {
        // Allow unauthenticated endpoints to proceed (e.g., health checks, public endpoints)
        this.logger.debug('No tenant ID found, allowing request to proceed (unauthenticated endpoint)');
        return next();
      }

      // Validate tenant ID format (should be UUID)
      if (!this.isValidUuid(tenantId)) {
        this.logger.error(`Invalid tenant ID format: ${tenantId}`);
        throw new UnauthorizedException('Invalid tenant ID format');
      }

      // Set tenant context in database session
      await this.setTenantContext(tenantId);

      // Set tenant ID in request for easy access by services
      req.tenantId = tenantId;

      this.logger.debug(`Tenant context established for tenant: ${tenantId}`);
      next();
    } catch (err) {
      this.logger.error('Failed to establish tenant context:', err);
      throw new UnauthorizedException('Unable to establish tenant context');
    }
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    try {
      // Set PostgreSQL session variable for RLS
      await this.databaseService.query(`SET LOCAL app.tenant_id = $1`, [tenantId]);
      
      // Skip setting the role for now - we'll rely on RLS policies instead
      // This avoids the permission issue with role setting
      // await this.databaseService.query(`SET LOCAL ROLE verosuite_app`);
      
      this.logger.debug(`Database tenant context set for tenant: ${tenantId}`);
    } catch (err) {
      this.logger.error(`Failed to set database tenant context for tenant ${tenantId}:`, err);
      throw err;
    }
  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
