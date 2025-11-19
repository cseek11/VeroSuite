import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AutoSchedulerService } from './auto-scheduler.service';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';
import { TechnicianModule } from '../technician/technician.module';

@Module({
  imports: [TechnicianModule],
  providers: [JobsService, AutoSchedulerService, DatabaseService, AuditService],
  controllers: [JobsController],
})
export class JobsModule {}
