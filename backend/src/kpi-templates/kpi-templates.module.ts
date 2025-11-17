import { Module } from '@nestjs/common';
import { KpiTemplatesController } from './kpi-templates.controller';
import { KpiTemplatesV2Controller } from './kpi-templates-v2.controller';
import { KpiTemplatesService } from './kpi-templates.service';
import { DatabaseService } from '../common/services/database.service';

@Module({
  controllers: [KpiTemplatesController, KpiTemplatesV2Controller],
  providers: [KpiTemplatesService, DatabaseService],
  exports: [KpiTemplatesService]
})
export class KpiTemplatesModule {}














