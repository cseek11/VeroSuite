import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // TODO: Extract tenant from JWT/session and set context
    req['tenant_id'] = req.headers['x-tenant-id'] || 'demo-tenant';
    next();
  }
}
