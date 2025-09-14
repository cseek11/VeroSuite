import { Module } from '@nestjs/common';
import { TechnicianController } from './technician.controller';
import { TechnicianService } from './technician.service';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  providers: [TechnicianService, DatabaseService, AuditService],
  controllers: [TechnicianController],
  exports: [TechnicianService],
})
export class TechnicianModule {}
