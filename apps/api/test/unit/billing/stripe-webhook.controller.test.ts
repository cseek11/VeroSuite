/**
 * Stripe Webhook Controller Unit Tests
 * Tests for webhook signature validation and event handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StripeWebhookController } from '../../../src/billing/stripe-webhook.controller';
import { StripeService } from '../../../src/billing/stripe.service';
import { BillingService } from '../../../src/billing/billing.service';

describe('StripeWebhookController', () => {
  let controller: StripeWebhookController;
  let stripeService: StripeService;
  let billingService: BillingService;

  const mockEvent = {
    id: 'evt_test_123',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_123',
        amount: 10000,
        currency: 'usd',
        status: 'succeeded',
        metadata: {
          invoiceId: 'invoice-123',
        },
        created: Math.floor(Date.now() / 1000),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeWebhookController],
      providers: [
        {
          provide: StripeService,
          useValue: {
            verifyWebhookSignature: jest.fn(),
          },
        },
        {
          provide: BillingService,
          useValue: {
            createPaymentFromStripe: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StripeWebhookController>(StripeWebhookController);
    stripeService = module.get<StripeService>(StripeService);
    billingService = module.get<BillingService>(BillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWebhook', () => {
    const mockRequest = {
      rawBody: Buffer.from(JSON.stringify(mockEvent)),
    } as any;

    it('should process webhook successfully', async () => {
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(mockEvent as any);
      jest.spyOn(billingService, 'createPaymentFromStripe').mockResolvedValue(undefined);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result).toEqual({
        received: true,
        eventId: 'evt_test_123',
        eventType: 'payment_intent.succeeded',
      });
      expect(stripeService.verifyWebhookSignature).toHaveBeenCalledWith(
        JSON.stringify(mockEvent),
        'valid-signature'
      );
    });

    it('should throw BadRequestException when signature header is missing', async () => {
      await expect(controller.handleWebhook(mockRequest, '')).rejects.toThrow(BadRequestException);
      await expect(controller.handleWebhook(mockRequest, '')).rejects.toThrow(
        'Missing stripe-signature header'
      );
    });

    it('should throw BadRequestException when payload is missing', async () => {
      const requestWithoutBody = {} as any;

      await expect(controller.handleWebhook(requestWithoutBody, 'signature')).rejects.toThrow(
        BadRequestException
      );
      await expect(controller.handleWebhook(requestWithoutBody, 'signature')).rejects.toThrow(
        'No payload received'
      );
    });

    it('should throw BadRequestException when signature is invalid', async () => {
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockImplementation(() => {
        throw new BadRequestException('Invalid webhook signature');
      });

      await expect(controller.handleWebhook(mockRequest, 'invalid-signature')).rejects.toThrow(
        BadRequestException
      );
      await expect(controller.handleWebhook(mockRequest, 'invalid-signature')).rejects.toThrow(
        'Invalid webhook signature'
      );
    });

    it('should handle payment_intent.succeeded event', async () => {
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(mockEvent as any);
      jest.spyOn(billingService, 'createPaymentFromStripe').mockResolvedValue(undefined);

      await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(billingService.createPaymentFromStripe).toHaveBeenCalledWith(
        expect.objectContaining({
          invoice_id: 'invoice-123',
          amount: 100.0,
          reference_number: 'pi_test_123',
        })
      );
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const failedEvent = {
        ...mockEvent,
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            ...mockEvent.data.object,
            status: 'requires_payment_method',
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(failedEvent as any);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(true);
      expect(result.eventType).toBe('payment_intent.payment_failed');
    });

    it('should handle payment_intent.canceled event', async () => {
      const canceledEvent = {
        ...mockEvent,
        type: 'payment_intent.canceled',
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(canceledEvent as any);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(true);
      expect(result.eventType).toBe('payment_intent.canceled');
    });

    it('should handle unhandled event types gracefully', async () => {
      const unhandledEvent = {
        ...mockEvent,
        type: 'customer.created',
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(unhandledEvent as any);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(true);
      expect(result.eventType).toBe('customer.created');
    });

    it('should handle errors gracefully and return error response', async () => {
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(false);
      expect(result.error).toBe('Webhook processing failed');
    });

    it('should handle payment intent without invoice ID in metadata', async () => {
      const eventWithoutInvoiceId = {
        ...mockEvent,
        data: {
          object: {
            ...mockEvent.data.object,
            metadata: {},
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(eventWithoutInvoiceId as any);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(true);
      expect(billingService.createPaymentFromStripe).not.toHaveBeenCalled();
    });

    it('should handle payment intent with non-succeeded status', async () => {
      const eventWithWrongStatus = {
        ...mockEvent,
        data: {
          object: {
            ...mockEvent.data.object,
            status: 'requires_payment_method',
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(eventWithWrongStatus as any);

      const result = await controller.handleWebhook(mockRequest, 'valid-signature');

      expect(result.received).toBe(true);
      expect(billingService.createPaymentFromStripe).not.toHaveBeenCalled();
    });
  });
});

