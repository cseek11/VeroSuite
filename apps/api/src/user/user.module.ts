import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserV2Controller } from './user-v2.controller';
import { UserMetricsService } from './user-metrics.service';
import { ImportExportService } from './import-export.service';
import { DatabaseService } from '../common/services/database.service';
import { EncryptionService } from '../common/services/encryption.service';
import { SessionService } from '../auth/session.service';

@Module({ 
  providers: [UserService, UserMetricsService, ImportExportService, EncryptionService, SessionService, DatabaseService], 
  controllers: [UserController, UserV2Controller],
  exports: [UserService, UserMetricsService, ImportExportService, EncryptionService, SessionService] 
})
export class UserModule {}
