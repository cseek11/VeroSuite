import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // TODO: Extract tenant from JWT/session and set context
    (req as any).tenant_id = req.headers['x-tenant-id'] || 'demo-tenant';
    next();
  }
}
