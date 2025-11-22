/**
 * Stripe Service Unit Tests
 * Tests for Stripe API integration and payment method management
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../../../src/billing/stripe.service';
import Stripe from 'stripe';

// Mock Stripe - must be a constructor function
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
      confirm: jest.fn(),
      cancel: jest.fn(),
    },
    customers: {
      create: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('StripeService', () => {
  let service: StripeService;
  let configService: ConfigService;
  let mockStripe: any;

  beforeEach(async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_1234567890';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_1234567890';

    mockStripe = {
      paymentIntents: {
        create: jest.fn(),
        retrieve: jest.fn(),
        confirm: jest.fn(),
        cancel: jest.fn(),
      },
      customers: {
        create: jest.fn(),
      },
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'STRIPE_SECRET_KEY') return 'sk_test_1234567890';
              if (key === 'STRIPE_WEBHOOK_SECRET') return 'whsec_test_1234567890';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    configService = module.get<ConfigService>(ConfigService);

    // Replace the internal stripe instance with our mock
    (service as any).stripe = mockStripe;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when STRIPE_SECRET_KEY is missing', async () => {
      delete process.env.STRIPE_SECRET_KEY;

      await expect(
        Test.createTestingModule({
          providers: [
            StripeService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn(() => null),
              },
            },
          ],
        }).compile()
      ).rejects.toThrow('Stripe configuration is required');
    });
  });

  describe('createPaymentIntent', () => {
    const createPaymentIntentDto = {
      invoiceId: 'invoice-123',
      amount: 100.0,
      currency: 'usd',
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
    };

    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
      amount: 10000,
      currency: 'usd',
      status: 'requires_payment_method',
    };

    it('should create payment intent successfully', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await service.createPaymentIntent(createPaymentIntentDto);

      expect(result).toEqual({
        clientSecret: 'pi_test_123_secret',
        paymentIntentId: 'pi_test_123',
        amount: 100.0,
        currency: 'usd',
        status: 'requires_payment_method',
      });
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10000,
          currency: 'usd',
          metadata: expect.objectContaining({
            invoiceId: 'invoice-123',
          }),
        })
      );
    });

    it('should throw BadRequestException when invoice ID is missing', async () => {
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          invoiceId: '',
        })
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          invoiceId: '',
        })
      ).rejects.toThrow('Invoice ID is required');
    });

    it('should throw BadRequestException when amount is zero', async () => {
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          amount: 0,
        })
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          amount: 0,
        })
      ).rejects.toThrow('Amount must be greater than 0');
    });

    it('should throw BadRequestException when amount is negative', async () => {
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          amount: -10,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when currency is missing', async () => {
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          currency: '',
        })
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          currency: '',
        })
      ).rejects.toThrow('Currency is required');
    });

    it('should throw BadRequestException when amount is less than $0.50', async () => {
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          amount: 0.49,
        })
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createPaymentIntent({
          ...createPaymentIntentDto,
          amount: 0.49,
        })
      ).rejects.toThrow('Amount must be at least $0.50');
    });

    it('should throw BadRequestException when client secret is missing', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue({
        ...mockPaymentIntent,
        client_secret: null,
      });

      await expect(service.createPaymentIntent(createPaymentIntentDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createPaymentIntent(createPaymentIntentDto)).rejects.toThrow(
        'Payment intent created but no client secret returned'
      );
    });

    it('should handle Stripe API errors', async () => {
      const stripeError: any = new Error('Stripe API error');
      stripeError.type = 'StripeInvalidRequestError';
      mockStripe.paymentIntents.create.mockRejectedValue(stripeError);

      await expect(service.createPaymentIntent(createPaymentIntentDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createPaymentIntent(createPaymentIntentDto)).rejects.toThrow(
        'Stripe error:'
      );
    });

    it('should convert currency to lowercase', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      await service.createPaymentIntent({
        ...createPaymentIntentDto,
        currency: 'USD',
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: 'usd',
        })
      );
    });
  });

  describe('getPaymentIntent', () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 10000,
    };

    it('should retrieve payment intent successfully', async () => {
      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const result = await service.getPaymentIntent('pi_test_123');

      expect(result).toEqual(mockPaymentIntent);
      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_123');
    });

    it('should throw BadRequestException when Stripe not configured', async () => {
      (service as any).stripe = null;

      await expect(service.getPaymentIntent('pi_test_123')).rejects.toThrow(BadRequestException);
      await expect(service.getPaymentIntent('pi_test_123')).rejects.toThrow('Stripe not configured');
    });

    it('should handle retrieval errors', async () => {
      mockStripe.paymentIntents.retrieve.mockRejectedValue(new Error('Not found'));

      await expect(service.getPaymentIntent('pi_test_123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmPaymentIntent', () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
    };

    it('should confirm payment intent successfully', async () => {
      mockStripe.paymentIntents.confirm.mockResolvedValue(mockPaymentIntent);

      const result = await service.confirmPaymentIntent('pi_test_123');

      expect(result).toEqual(mockPaymentIntent);
      expect(mockStripe.paymentIntents.confirm).toHaveBeenCalledWith('pi_test_123');
    });

    it('should throw BadRequestException when Stripe not configured', async () => {
      (service as any).stripe = null;

      await expect(service.confirmPaymentIntent('pi_test_123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelPaymentIntent', () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      status: 'canceled',
    };

    it('should cancel payment intent successfully', async () => {
      mockStripe.paymentIntents.cancel.mockResolvedValue(mockPaymentIntent);

      const result = await service.cancelPaymentIntent('pi_test_123');

      expect(result).toEqual(mockPaymentIntent);
      expect(mockStripe.paymentIntents.cancel).toHaveBeenCalledWith('pi_test_123');
    });

    it('should throw BadRequestException when Stripe not configured', async () => {
      (service as any).stripe = null;

      await expect(service.cancelPaymentIntent('pi_test_123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCustomer', () => {
    const mockCustomer = {
      id: 'cus_test_123',
      email: 'test@example.com',
      name: 'Test Customer',
    };

    it('should create customer successfully', async () => {
      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      const result = await service.createCustomer('test@example.com', 'Test Customer');

      expect(result).toEqual(mockCustomer);
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test Customer',
        metadata: {},
      });
    });

    it('should include metadata when provided', async () => {
      const metadata = { tenantId: 'tenant-123' };
      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      await service.createCustomer('test@example.com', 'Test Customer', metadata);

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test Customer',
        metadata,
      });
    });

    it('should throw BadRequestException when Stripe not configured', async () => {
      (service as any).stripe = null;

      await expect(service.createCustomer('test@example.com', 'Test Customer')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('verifyWebhookSignature', () => {
    const mockEvent = {
      id: 'evt_test_123',
      type: 'payment_intent.succeeded',
      data: { object: {} },
    };

    it('should verify webhook signature successfully', () => {
      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = service.verifyWebhookSignature('payload', 'signature');

      expect(result).toEqual(mockEvent);
      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        'payload',
        'signature',
        'whsec_test_1234567890'
      );
    });

    it('should throw BadRequestException when Stripe not configured', () => {
      (service as any).stripe = null;

      expect(() => service.verifyWebhookSignature('payload', 'signature')).toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException when webhook secret not configured', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);

      expect(() => service.verifyWebhookSignature('payload', 'signature')).toThrow(
        BadRequestException
      );
      expect(() => service.verifyWebhookSignature('payload', 'signature')).toThrow(
        'Stripe webhook secret not configured'
      );
    });

    it('should throw BadRequestException when signature is invalid', () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      expect(() => service.verifyWebhookSignature('payload', 'invalid-signature')).toThrow(
        BadRequestException
      );
      expect(() => service.verifyWebhookSignature('payload', 'invalid-signature')).toThrow(
        'Invalid webhook signature'
      );
    });
  });

  describe('isConfigured', () => {
    it('should return true when Stripe is configured', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should return false when Stripe is not configured', () => {
      (service as any).stripe = null;
      expect(service.isConfigured()).toBe(false);
    });
  });
});

