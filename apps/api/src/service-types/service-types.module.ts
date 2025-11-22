import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ServiceTypesController } from './service-types.controller';
import { DatabaseService } from '../common/services/database.service';

@Module({
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService, DatabaseService],
  exports: [ServiceTypesService],
})
export class ServiceTypesModule {}
