import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SupabaseService } from '../common/services/supabase.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, SupabaseService],
  exports: [DashboardService],
})
export class DashboardModule {}

