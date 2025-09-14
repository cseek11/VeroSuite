import { Module } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';

@Module({
  providers: [AgreementsService, DatabaseService],
  controllers: [AgreementsController],
  exports: [AgreementsService],
})
export class AgreementsModule {}
