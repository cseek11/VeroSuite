import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { ComplianceQueueService } from './compliance-queue.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ComplianceController],
  providers: [ComplianceService, ComplianceQueueService],
  exports: [ComplianceService, ComplianceQueueService],
})
export class ComplianceModule {}

