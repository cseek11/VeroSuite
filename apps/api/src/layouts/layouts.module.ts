import { Module } from '@nestjs/common';
import { LayoutsController } from './layouts.controller';
import { LayoutsService } from './layouts.service';
import { SupabaseService } from '../common/services/supabase.service';

@Module({
  controllers: [LayoutsController],
  providers: [LayoutsService, SupabaseService],
  exports: [LayoutsService],
})
export class LayoutsModule {}
