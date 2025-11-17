import { Module } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { GeocodingService } from '../common/services/geocoding.service';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { CrmV2Controller } from './crm-v2.controller';


// Module
@Module({
  providers: [CrmService, DatabaseService, GeocodingService],
  controllers: [CrmController, CrmV2Controller],
})
export class CrmModule {}
