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
      // Validate inputs
      if (!createPaymentIntentDto.invoiceId) {
        throw new BadRequestException('Invoice ID is required');
      }

      if (!createPaymentIntentDto.amount || createPaymentIntentDto.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      if (!createPaymentIntentDto.currency) {
        throw new BadRequestException('Currency is required');
      }

      // Validate amount is within Stripe's limits (minimum $0.50, maximum varies by currency)
      const amountInCents = Math.round(createPaymentIntentDto.amount * 100);
      if (amountInCents < 50) {
        throw new BadRequestException('Amount must be at least $0.50');
      }

      // Create payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: createPaymentIntentDto.currency.toLowerCase(),
        metadata: {
          invoiceId: createPaymentIntentDto.invoiceId,
          customerEmail: createPaymentIntentDto.customerEmail || '',
          customerName: createPaymentIntentDto.customerName || '',
          ...createPaymentIntentDto.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (!paymentIntent.client_secret) {
        throw new BadRequestException('Payment intent created but no client secret returned');
      }

      this.logger.log(`Payment intent created successfully: ${paymentIntent.id} (Status: ${paymentIntent.status})`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: createPaymentIntentDto.amount,
        currency: createPaymentIntentDto.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle Stripe-specific errors
      const stripeError = error as any;
      if (stripeError?.type === 'StripeInvalidRequestError') {
        this.logger.error(`Stripe API error: ${stripeError.message}`, stripeError.stack);
        throw new BadRequestException(`Stripe error: ${stripeError.message}`);
      }

      // Log and wrap unknown errors
      this.logger.error(
        `Failed to create payment intent for invoice ${createPaymentIntentDto.invoiceId}: ${(error as Error).message}`,
        (error as Error).stack
      );
      throw new BadRequestException(`Failed to create payment intent: ${(error as Error).message}`);
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
   * Create a Stripe subscription for recurring payments
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    this.logger.log(`Creating Stripe subscription for customer ${customerId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: metadata || {},
        expand: ['latest_invoice.payment_intent'],
      });

      this.logger.log(`Stripe subscription created: ${subscription.id}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to create Stripe subscription: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create subscription');
    }
  }

  /**
   * Create a Stripe price for recurring payments
   */
  async createPrice(
    amount: number,
    currency: string,
    interval: 'month' | 'year' | 'week' | 'day',
    productName: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Price> {
    this.logger.log(`Creating Stripe price: ${amount} ${currency} per ${interval}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      // Create or get product
      const products = await this.stripe.products.list({ limit: 100 });
      let product = products.data.find(p => p.name === productName);

      if (!product) {
        product = await this.stripe.products.create({
          name: productName,
          metadata: metadata || {},
        });
      }

      // Create price
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        recurring: {
          interval: interval,
        },
        product: product.id,
        metadata: metadata || {},
      });

      this.logger.log(`Stripe price created: ${price.id}`);
      return price;
    } catch (error) {
      this.logger.error(`Failed to create Stripe price: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create price');
    }
  }

  /**
   * Cancel a Stripe subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Stripe.Subscription> {
    this.logger.log(`Canceling Stripe subscription: ${subscriptionId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const subscription = immediately
        ? await this.stripe.subscriptions.cancel(subscriptionId)
        : await this.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });

      this.logger.log(`Stripe subscription canceled: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to cancel Stripe subscription: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  /**
   * Get a Stripe subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    this.logger.log(`Retrieving Stripe subscription: ${subscriptionId}`);

    try {
      if (!this.stripe) {
        throw new BadRequestException('Stripe not configured');
      }

      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to retrieve Stripe subscription: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to retrieve subscription');
    }
  }

  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return !!this.stripe;
  }
}
