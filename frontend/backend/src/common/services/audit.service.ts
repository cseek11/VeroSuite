import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

interface AuditLogEntry {
  tenantId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  beforeState?: any;
  afterState?: any;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private db: DatabaseService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.db.auditLog.create({
        data: {
          tenant_id: entry.tenantId,
          user_id: entry.userId,
          action: entry.action,
          resource_type: entry.resourceType,
          resource_id: entry.resourceId,
          before_state: entry.beforeState,
          after_state: entry.afterState,
          request_id: entry.requestId || 'system',
          ip_address: entry.ipAddress,
          user_agent: entry.userAgent,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Audit log failed:', err);
    }
  }
}
