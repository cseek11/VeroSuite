import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { InvoicePdfService } from './invoice-pdf.service';
import { OverdueAlertsService } from './overdue-alerts.service';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { MetricsService } from '../common/services/metrics.service';
import { EmailService } from '../common/services/email.service';

@Module({
  imports: [ConfigModule],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService, StripeService, InvoicePdfService, OverdueAlertsService, DatabaseService, StructuredLoggerService, MetricsService, EmailService],
  exports: [BillingService, StripeService, InvoicePdfService, OverdueAlertsService],
})
export class BillingModule {}
