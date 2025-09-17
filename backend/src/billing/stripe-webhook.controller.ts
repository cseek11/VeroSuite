import { 
  Controller, 
  Post, 
  Headers, 
  RawBodyRequest, 
  Req,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { BillingService } from './billing.service';

@ApiTags('Stripe Webhooks')
@Controller('v1/billing/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly billingService: BillingService,
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
    this.logger.log('Received Stripe webhook');

    try {
      // Get the raw body
      const payload = req.rawBody?.toString() || '';
      
      if (!payload) {
        this.logger.error('No payload received in webhook');
        return { error: 'No payload received' };
      }

      // Verify webhook signature
      const event = this.stripeService.verifyWebhookSignature(payload, signature);
      
      this.logger.log(`Processing webhook event: ${event.type}`);

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
        
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${(error as Error).message}`, (error as Error).stack);
      return { error: 'Webhook processing failed' };
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(event: any) {
    const paymentIntent = event.data.object;
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);

    try {
      const invoiceId = paymentIntent.metadata?.invoiceId;
      if (!invoiceId) {
        this.logger.error('No invoice ID found in payment intent metadata');
        return;
      }

      // Create payment record in database
      await this.billingService.createPaymentFromStripe({
        invoice_id: invoiceId,
        amount: paymentIntent.amount / 100, // Convert from cents
        payment_date: new Date(),
        reference_number: paymentIntent.id,
        notes: `Stripe payment: ${paymentIntent.id}`,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_charge_id: paymentIntent.latest_charge,
      });

      this.logger.log(`Payment record created for invoice: ${invoiceId}`);
    } catch (error) {
      this.logger.error(`Failed to process payment success: ${(error as Error).message}`, (error as Error).stack);
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

      // Log the failure - you might want to update invoice status or send notifications
      this.logger.warn(`Payment failed for invoice ${invoiceId}: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`);
    } catch (error) {
      this.logger.error(`Failed to process payment failure: ${(error as Error).message}`, (error as Error).stack);
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
