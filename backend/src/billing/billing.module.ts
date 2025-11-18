import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { MetricsService } from '../common/services/metrics.service';

@Module({
  imports: [ConfigModule],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService, StripeService, DatabaseService, StructuredLoggerService, MetricsService],
  exports: [BillingService, StripeService],
})
export class BillingModule {}
