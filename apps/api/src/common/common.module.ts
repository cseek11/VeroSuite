import { Module, Global } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { RedisPubSubService } from './services/redis-pubsub.service';
import { StructuredLoggerService } from './services/logger.service';
import { MetricsService } from './services/metrics.service';
import { MetricsController } from './controllers/metrics.controller';
import { FeatureFlagService } from './services/feature-flag.service';
import { AuthorizationService } from './services/authorization.service';
import { DatabaseService } from './services/database.service';
import { PrismaService } from './services/prisma.service';
import { PermissionsService } from './services/permissions.service';
import { SentryService } from './services/sentry.service';
import { IdempotencyService } from './services/idempotency.service';
import { SupabaseService } from './services/supabase.service';
import { EmailService } from './services/email.service';

/**
 * Common module for shared services
 * Marked as @Global() so these services are available throughout the app
 */
@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    CacheService,
    RedisPubSubService,
    StructuredLoggerService,
    MetricsService,
    FeatureFlagService,
    DatabaseService,
    PrismaService,
    PermissionsService,
    AuthorizationService,
    SentryService,
    IdempotencyService,
    SupabaseService,
    EmailService,
  ],
  exports: [
    CacheService,
    RedisPubSubService,
    StructuredLoggerService,
    MetricsService,
    FeatureFlagService,
    DatabaseService,
    PrismaService,
    PermissionsService,
    AuthorizationService,
    SentryService,
    IdempotencyService,
    SupabaseService,
    EmailService,
  ],
})
export class CommonModule {}

