import { 
  Controller, 
  Post, 
  Headers, 
  RawBodyRequest, 
  Req,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { BillingService } from './billing.service';
import { EmailService } from '../common/services/email.service';
import { DatabaseService } from '../common/services/database.service';

@ApiTags('Stripe Webhooks')
@Controller({ path: 'billing/stripe', version: '1' })
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly billingService: BillingService,
    private readonly emailService: EmailService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received Stripe webhook request');

    try {
      // Validate signature header
      if (!signature) {
        this.logger.error('Missing stripe-signature header');
        throw new BadRequestException('Missing stripe-signature header');
      }

      // Get the raw body
      const payload = req.rawBody?.toString() || '';
      
      if (!payload) {
        this.logger.error('No payload received in webhook');
        throw new BadRequestException('No payload received');
      }

      this.logger.debug(`Webhook payload length: ${payload.length} bytes`);

      // Verify webhook signature
      let event;
      try {
        event = this.stripeService.verifyWebhookSignature(payload, signature);
      } catch (signatureError) {
        this.logger.error(`Webhook signature verification failed: ${(signatureError as Error).message}`);
        throw new BadRequestException('Invalid webhook signature');
      }
      
      this.logger.log(`Processing webhook event: ${event.type} (ID: ${event.id})`);

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event);
          break;
        
        case 'payment_intent.canceled':
          await this.handlePaymentIntentCanceled(event);
          break;
        
        case 'payment_method.attached':
          await this.handlePaymentMethodAttached(event);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event);
          break;
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event);
          break;
        
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await this.handleSubscriptionEvent(event);
          break;
        
        default:
          this.logger.log(`Unhandled event type: ${event.type} (ID: ${event.id})`);
      }

      this.logger.log(`Webhook event ${event.id} processed successfully`);
      return { received: true, eventId: event.id, eventType: event.type };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Webhook processing failed: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined
      );
      
      // Return error response but don't throw (Stripe expects 200 status)
      return { 
        error: 'Webhook processing failed',
        message: errorMessage,
        received: false
      };
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(event: any) {
    const paymentIntent = event.data.object;
    this.logger.log(`Payment succeeded: ${paymentIntent.id} (Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()})`);

    try {
      const invoiceId = paymentIntent.metadata?.invoiceId;
      if (!invoiceId) {
        this.logger.error(`No invoice ID found in payment intent ${paymentIntent.id} metadata`);
        this.logger.error(`Payment intent metadata: ${JSON.stringify(paymentIntent.metadata)}`);
        return;
      }

      // Validate payment intent status
      if (paymentIntent.status !== 'succeeded') {
        this.logger.warn(`Payment intent ${paymentIntent.id} status is ${paymentIntent.status}, not succeeded`);
        return;
      }

      // Get invoice details for email notification
      const invoice = await this.billingService.getInvoiceById(invoiceId);
      if (!invoice) {
        this.logger.error(`Invoice ${invoiceId} not found for payment confirmation`);
      }

      // Use payment completion time if available, otherwise use created time
      const paymentDate = paymentIntent.latest_charge 
        ? new Date() // Use current time as payment completion time
        : new Date(paymentIntent.created * 1000);

      // Create payment record in database
      const payment = await this.billingService.createPaymentFromStripe({
        invoice_id: invoiceId,
        amount: paymentIntent.amount / 100, // Convert from cents
        payment_date: paymentDate,
        reference_number: paymentIntent.id,
        notes: `Stripe payment: ${paymentIntent.id}${paymentIntent.latest_charge ? ` (Charge: ${paymentIntent.latest_charge})` : ''}`,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_charge_id: paymentIntent.latest_charge,
      });

      this.logger.log(`Payment record created successfully for invoice: ${invoiceId}`);

      // Send payment confirmation email if invoice and customer email exist
      if (invoice && invoice.accounts?.email) {
        try {
          const emailContent = this.emailService.generatePaymentConfirmationEmail({
            customerName: invoice.accounts.name,
            invoiceNumber: invoice.invoice_number,
            amount: paymentIntent.amount / 100,
            paymentDate: paymentDate,
            transactionId: paymentIntent.id,
            paymentMethod: 'Credit Card',
          });

          const emailResult = await this.emailService.sendEmail({
            to: invoice.accounts.email,
            toName: invoice.accounts.name,
            subject: `Payment Confirmation - Invoice ${invoice.invoice_number}`,
            htmlContent: emailContent,
          });

          if (emailResult.success) {
            this.logger.log(`Payment confirmation email sent to ${invoice.accounts.email} for invoice ${invoiceId}`);
          } else {
            this.logger.warn(`Failed to send payment confirmation email: ${emailResult.error}`);
          }
        } catch (emailError) {
          // Log but don't fail webhook if email fails
          this.logger.error(
            `Failed to send payment confirmation email: ${(emailError as Error).message}`,
            (emailError as Error).stack
          );
        }
      } else {
        this.logger.warn(`Skipping payment confirmation email - invoice or customer email not found for invoice ${invoiceId}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to process payment success for payment intent ${paymentIntent.id}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined
      );
      // Don't throw - log the error but don't fail the webhook
    }
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(event: any) {
    const paymentIntent = event.data.object;
    this.logger.log(`Payment failed: ${paymentIntent.id}`);

    try {
      const invoiceId = paymentIntent.metadata?.invoiceId;
      if (!invoiceId) {
        this.logger.error('No invoice ID found in payment intent metadata');
        return;
      }

      const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error';
      const errorCode = paymentIntent.last_payment_error?.code || 'unknown';
      const declineCode = paymentIntent.last_payment_error?.decline_code || null;

      this.logger.warn(`Payment failed for invoice ${invoiceId}: ${errorMessage} (Code: ${errorCode}${declineCode ? `, Decline: ${declineCode}` : ''})`);

      // Get invoice details for notification
      const invoice = await this.billingService.getInvoiceById(invoiceId);
      if (!invoice) {
        this.logger.error(`Invoice ${invoiceId} not found for payment failure notification`);
        return;
      }

      // Log failure to communication log
      if (invoice.accounts?.id) {
        try {
          // Get tenant ID from invoice
          const tenantId = (invoice as any).tenant_id;
          if (tenantId) {
            await this.databaseService.communicationLog.create({
              data: {
                tenant_id: tenantId,
                customer_id: invoice.accounts.id,
                communication_type: 'payment_failure',
                direction: 'outbound',
                subject: `Payment Failed - Invoice ${invoice.invoice_number}`,
                message_content: `Payment attempt failed for invoice ${invoice.invoice_number}. Error: ${errorMessage}${declineCode ? ` (Decline code: ${declineCode})` : ''}. Please update your payment method or contact support.`,
                staff_member: 'system',
                timestamp: new Date(),
                follow_up_required: true,
                follow_up_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Follow up in 1 day
              }
            });
          }
        } catch (logError) {
          this.logger.warn(`Failed to log payment failure to communication log: ${(logError as Error).message}`);
        }
      }

      // Send payment failure notification email if customer email exists
      if (invoice.accounts?.email) {
        try {
          const emailContent = this.emailService.generatePaymentFailureEmail({
            customerName: invoice.accounts.name,
            invoiceNumber: invoice.invoice_number,
            amount: paymentIntent.amount / 100,
            errorMessage: errorMessage,
            errorCode: errorCode,
            declineCode: declineCode,
            transactionId: paymentIntent.id,
            paymentLink: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/billing/${invoice.accounts.id}`,
          });

          const emailResult = await this.emailService.sendEmail({
            to: invoice.accounts.email,
            toName: invoice.accounts.name,
            subject: `Payment Failed - Invoice ${invoice.invoice_number}`,
            htmlContent: emailContent,
          });

          if (emailResult.success) {
            this.logger.log(`Payment failure notification sent to ${invoice.accounts.email} for invoice ${invoiceId}`);
          } else {
            this.logger.warn(`Failed to send payment failure notification: ${emailResult.error}`);
          }
        } catch (emailError) {
          // Log but don't fail webhook if email fails
          this.logger.error(
            `Failed to send payment failure notification: ${(emailError as Error).message}`,
            (emailError as Error).stack
          );
        }
      } else {
        this.logger.warn(`Skipping payment failure notification - customer email not found for invoice ${invoiceId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process payment failure: ${(error as Error).message}`, (error as Error).stack);
    }
  }

  /**
   * Handle successful invoice payment (from subscription)
   */
  private async handleInvoicePaymentSucceeded(event: any) {
    const invoice = event.data.object;
    this.logger.log(`Invoice payment succeeded: ${invoice.id}`);

    try {
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;
      const invoiceId = invoice.metadata?.invoiceId;

      if (!invoiceId) {
        this.logger.warn(`No invoice ID found in invoice metadata: ${invoice.id}`);
        return;
      }

      // Get invoice details
      const dbInvoice = await this.billingService.getInvoiceById(invoiceId);
      if (!dbInvoice) {
        this.logger.error(`Invoice ${invoiceId} not found for subscription payment`);
        return;
      }

      // Create payment record
      const paymentDate = new Date(invoice.created * 1000);
      const amount = invoice.amount_paid / 100; // Convert from cents

      await this.billingService.createPaymentFromStripe({
        invoice_id: invoiceId,
        amount: amount,
        payment_date: paymentDate,
        reference_number: invoice.id,
        notes: `Stripe subscription payment: ${subscriptionId ? `Subscription ${subscriptionId}` : 'One-time'} (Invoice: ${invoice.id})`,
        stripe_payment_intent_id: invoice.payment_intent,
        stripe_charge_id: invoice.charge,
      });

      this.logger.log(`Subscription payment recorded successfully for invoice: ${invoiceId}`);

      // Send payment confirmation email if customer email exists
      if (dbInvoice.accounts?.email) {
        try {
          const emailContent = this.emailService.generatePaymentConfirmationEmail({
            customerName: dbInvoice.accounts.name,
            invoiceNumber: dbInvoice.invoice_number,
            amount: amount,
            paymentDate: paymentDate,
            transactionId: invoice.id,
            paymentMethod: 'Recurring Payment',
          });

          const emailResult = await this.emailService.sendEmail({
            to: dbInvoice.accounts.email,
            toName: dbInvoice.accounts.name,
            subject: `Payment Received - Invoice ${dbInvoice.invoice_number}`,
            htmlContent: emailContent,
          });

          if (emailResult.success) {
            this.logger.log(`Payment confirmation email sent to ${dbInvoice.accounts.email} for subscription payment`);
          }
        } catch (emailError) {
          this.logger.warn(`Failed to send payment confirmation email: ${(emailError as Error).message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to process invoice payment success: ${(error as Error).message}`, (error as Error).stack);
    }
  }

  /**
   * Handle failed invoice payment (from subscription)
   */
  private async handleInvoicePaymentFailed(event: any) {
    const invoice = event.data.object;
    this.logger.log(`Invoice payment failed: ${invoice.id}`);

    try {
      const subscriptionId = invoice.subscription;
      const invoiceId = invoice.metadata?.invoiceId;

      if (!invoiceId) {
        this.logger.warn(`No invoice ID found in invoice metadata: ${invoice.id}`);
        return;
      }

      // Get invoice details
      const dbInvoice = await this.billingService.getInvoiceById(invoiceId);
      if (!dbInvoice) {
        this.logger.error(`Invoice ${invoiceId} not found for subscription payment failure`);
        return;
      }

      const errorMessage = invoice.last_payment_error?.message || 'Payment failed';
      const errorCode = invoice.last_payment_error?.code || 'unknown';
      const declineCode = invoice.last_payment_error?.decline_code || null;

      // Log failure to communication log
      if (dbInvoice.accounts?.id) {
        try {
          const tenantId = (dbInvoice as any).tenant_id;
          if (tenantId) {
            await this.databaseService.communicationLog.create({
              data: {
                tenant_id: tenantId,
                customer_id: dbInvoice.accounts.id,
                communication_type: 'subscription_payment_failure',
                direction: 'outbound',
                subject: `Recurring Payment Failed - Invoice ${dbInvoice.invoice_number}`,
                message_content: `Recurring payment failed for invoice ${dbInvoice.invoice_number}. Subscription: ${subscriptionId}. Error: ${errorMessage}${declineCode ? ` (Decline code: ${declineCode})` : ''}. Please update your payment method.`,
                staff_member: 'system',
                timestamp: new Date(),
                follow_up_required: true,
                follow_up_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
              }
            });
          }
        } catch (logError) {
          this.logger.warn(`Failed to log subscription payment failure: ${(logError as Error).message}`);
        }
      }

      // Send payment failure notification email
      if (dbInvoice.accounts?.email) {
        try {
          const emailContent = this.emailService.generatePaymentFailureEmail({
            customerName: dbInvoice.accounts.name,
            invoiceNumber: dbInvoice.invoice_number,
            amount: invoice.amount_due / 100,
            errorMessage: errorMessage,
            errorCode: errorCode,
            declineCode: declineCode,
            transactionId: invoice.id,
            paymentLink: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/billing/${dbInvoice.accounts.id}`,
          });

          const emailResult = await this.emailService.sendEmail({
            to: dbInvoice.accounts.email,
            toName: dbInvoice.accounts.name,
            subject: `Recurring Payment Failed - Invoice ${dbInvoice.invoice_number}`,
            htmlContent: emailContent,
          });

          if (emailResult.success) {
            this.logger.log(`Subscription payment failure notification sent to ${dbInvoice.accounts.email}`);
          }
        } catch (emailError) {
          this.logger.warn(`Failed to send subscription payment failure notification: ${(emailError as Error).message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to process invoice payment failure: ${(error as Error).message}`, (error as Error).stack);
    }
  }

  /**
   * Handle subscription events (created, updated, deleted)
   */
  private async handleSubscriptionEvent(event: any) {
    const subscription = event.data.object;
    this.logger.log(`Subscription event: ${event.type} for subscription ${subscription.id}`);

    try {
      const invoiceId = subscription.metadata?.invoiceId;
      const accountId = subscription.metadata?.accountId;
      const tenantId = subscription.metadata?.tenantId;

      if (!invoiceId || !accountId || !tenantId) {
        this.logger.warn(`Missing metadata in subscription ${subscription.id}`);
        return;
      }

      // Log subscription event to communication log
      try {
        await this.databaseService.communicationLog.create({
          data: {
            tenant_id: tenantId,
            customer_id: accountId,
            communication_type: 'subscription_event',
            direction: 'inbound',
            subject: `Subscription ${event.type.replace('customer.subscription.', '')} - ${subscription.id}`,
            message_content: `Subscription ${subscription.id} ${event.type.replace('customer.subscription.', '')}. Status: ${subscription.status}. Current period end: ${new Date(subscription.current_period_end * 1000).toISOString()}.`,
            staff_member: 'system',
            timestamp: new Date(),
            follow_up_required: event.type === 'customer.subscription.deleted',
            follow_up_date: event.type === 'customer.subscription.deleted' ? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) : null,
          }
        });
      } catch (logError) {
        this.logger.warn(`Failed to log subscription event: ${(logError as Error).message}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process subscription event: ${(error as Error).message}`, (error as Error).stack);
    }
  }

  /**
   * Handle canceled payment intent
   */
  private async handlePaymentIntentCanceled(event: any) {
    const paymentIntent = event.data.object;
    this.logger.log(`Payment canceled: ${paymentIntent.id}`);

    try {
      const invoiceId = paymentIntent.metadata?.invoiceId;
      if (!invoiceId) {
        this.logger.error('No invoice ID found in payment intent metadata');
        return;
      }

      // Log the cancellation
      this.logger.warn(`Payment canceled for invoice ${invoiceId}`);
    } catch (error) {
      this.logger.error(`Failed to process payment cancellation: ${(error as Error).message}`, (error as Error).stack);
    }
  }

  /**
   * Handle payment method attached
   */
  private async handlePaymentMethodAttached(event: any) {
    const paymentMethod = event.data.object;
    this.logger.log(`Payment method attached: ${paymentMethod.id}`);

    try {
      // You might want to store payment method information for future use
      this.logger.log(`Payment method ${paymentMethod.id} attached to customer ${paymentMethod.customer}`);
    } catch (error) {
      this.logger.error(`Failed to process payment method attachment: ${(error as Error).message}`, (error as Error).stack);
    }
  }
}
