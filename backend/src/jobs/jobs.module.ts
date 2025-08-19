import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  providers: [JobsService, DatabaseService, AuditService],
  controllers: [JobsController],
})
export class JobsModule {}
