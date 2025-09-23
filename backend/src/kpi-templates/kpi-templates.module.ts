import { Module } from '@nestjs/common';
import { KpiTemplatesController } from './kpi-templates.controller';
import { KpiTemplatesService } from './kpi-templates.service';
import { DatabaseService } from '../common/services/database.service';

@Module({
  controllers: [KpiTemplatesController],
  providers: [KpiTemplatesService, DatabaseService],
  exports: [KpiTemplatesService]
})
export class KpiTemplatesModule {}




