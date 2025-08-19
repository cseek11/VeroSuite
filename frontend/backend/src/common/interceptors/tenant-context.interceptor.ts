import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(private readonly db: DatabaseService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    if (tenantId) {
      await this.db.query(`SET LOCAL app.tenant_id = $1`, [tenantId]);
      await this.db.query(`SET LOCAL ROLE verosuite_app`);
    }
    return next.handle();
  }
}
