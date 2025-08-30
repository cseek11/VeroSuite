import { Module } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  providers: [WorkOrdersService, DatabaseService, AuditService],
  controllers: [WorkOrdersController],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
