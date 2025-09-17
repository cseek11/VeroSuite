import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface CreatePaymentIntentDto {
  amount: number;
  currency: string;
  invoiceId: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      this.logger.error('STRIPE_SECRET_KEY not found in environment variables');
      throw new Error('Stripe configuration is required. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  /**
   * Create a payment intent for an invoice
   */
  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
    this.logger.log(`Creating payment intent for invoice ${createPaymentIntentDto.invoiceId}`);

    try {

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(createPaymentIntentDto.amount * 100), // Convert to cents
        currency: createPaymentIntentDto.currency.toLowerCase(),
        metadata: {
          invoiceId: createPaymentIntentDto.invoiceId,
          customerEmail: createPaymentIntentDto.customerEmail,
          customerName: createPaymentIntentDto.customerName,
          ...createPaymentIntentDto.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        amount: createPaymentIntentDto.amount,
        currency: createPaymentIntentDto.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      this.logger.error(`Failed to create payment intent: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  /**
   * Retrieve a payment intent by ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.logger.log(`Retrieving payment intent: ${paymentIntentId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Failed to retrieve payment intent: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to retrieve payment intent');
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.logger.log(`Confirming payment intent: ${paymentIntentId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Failed to confirm payment intent: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to confirm payment intent');
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.logger.log(`Cancelling payment intent: ${paymentIntentId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Failed to cancel payment intent: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to cancel payment intent');
    }
  }

  /**
   * Create a customer in Stripe
   */
  async createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    this.logger.log(`Creating Stripe customer for: ${email}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });

      this.logger.log(`Stripe customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error(`Failed to create Stripe customer: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create Stripe customer');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new BadRequestException('Stripe webhook secret not configured');
      }

      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${(error as Error).message}`);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return !!this.stripe;
  }
}
