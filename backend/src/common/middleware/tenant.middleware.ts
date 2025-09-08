import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service';

// Extend Express Request with user context (populated by auth guard in future)
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
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private databaseService: DatabaseService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    // In a fully implemented app, req.user comes from an auth guard (JWT)
    // For now, support a development override header 'x-tenant-id' for testing
    const tenantId = req.user?.tenantId || (req.headers['x-tenant-id'] as string);

    if (!tenantId) {
      // Allow unauthenticated endpoints to proceed (e.g., health), else enforce
      return next();
    }

    try {
      await this.databaseService.query(`SET LOCAL app.tenant_id = $1`, [tenantId]);
      // Note: Supabase manages database roles, so we don't need to set a custom role
      next();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to set tenant context:', err);
      throw new UnauthorizedException('Unable to establish tenant context');
    }
  }
}
