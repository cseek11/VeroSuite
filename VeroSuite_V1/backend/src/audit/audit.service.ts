import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async getLogs() {
    // TODO: Fetch audit logs from DB
    return [{ id: 'demo-log', action: 'login' }];
  }
}
