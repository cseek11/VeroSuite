import { Module } from '@nestjs/common';
import { TechnicianController } from './technician.controller';
import { TechnicianV2Controller } from './technician-v2.controller';
import { TechnicianService } from './technician.service';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  providers: [TechnicianService, DatabaseService, AuditService],
  controllers: [TechnicianController, TechnicianV2Controller],
  exports: [TechnicianService],
})
export class TechnicianModule {}
