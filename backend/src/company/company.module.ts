import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DatabaseService } from '../common/services/database.service';
import { SupabaseService } from '../common/services/supabase.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, DatabaseService, SupabaseService],
  exports: [CompanyService],
})
export class CompanyModule {}
