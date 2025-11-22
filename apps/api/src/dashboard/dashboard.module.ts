import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DashboardController } from './dashboard.controller';
import { DashboardV2Controller } from './dashboard-v2.controller';
import { DashboardService } from './dashboard.service';
import { VersioningService } from './versioning.service';
import { CollaborationService } from './collaboration.service';
import { WidgetRegistryService } from './widget-registry.service';
import { SSRService } from './ssr.service';
import { CardToRegionConverter } from './migrations/card-to-region.converter';
import { SupabaseService } from '../common/services/supabase.service';
// CacheService and RedisPubSubService are now provided by CommonModule (global)
import { DashboardPresenceGateway } from './dashboard-presence.gateway';
import { RegionValidationService } from './services/region-validation.service';
import { EventStoreService } from './services/event-store.service';
import { DashboardMetricsService } from './services/dashboard-metrics.service';
import { CacheWarmingService } from './services/cache-warming.service';
import { RegionRepository } from './repositories/region.repository';
import { SagaService } from './services/saga.service';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is required');
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [DashboardController, DashboardV2Controller],
  providers: [
    DashboardService,
    VersioningService,
    CollaborationService,
    WidgetRegistryService,
    SSRService,
    CardToRegionConverter,
    SupabaseService,
    // CacheService and RedisPubSubService are provided by CommonModule (global)
    DashboardPresenceGateway,
    RegionValidationService,
    EventStoreService,
    DashboardMetricsService,
    CacheWarmingService,
    RegionRepository,
    SagaService,
    IdempotencyInterceptor
  ],
  exports: [
    DashboardService,
    VersioningService,
    CollaborationService,
    WidgetRegistryService,
    SSRService,
    CardToRegionConverter,
    DashboardPresenceGateway,
    SagaService
  ],
})
export class DashboardModule {}

