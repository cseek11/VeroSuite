import { Module } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { WorkOrdersV2Controller } from './work-orders-v2.controller';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  providers: [WorkOrdersService, DatabaseService, AuditService],
  controllers: [WorkOrdersController, WorkOrdersV2Controller],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
