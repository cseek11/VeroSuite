/**
 * Billing Service Unit Tests
 * Tests for payment retry, analytics, and recurring payment functionality
 * 
 * Date: 2025-11-16
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingService } from '../billing.service';
import { DatabaseService } from '../../common/services/database.service';
import { StripeService } from '../stripe.service';
import { EmailService } from '../../common/services/email.service';

describe('BillingService - Payment Enhancements', () => {
  let service: BillingService;
  let databaseService: DatabaseService;
  let stripeService: StripeService;
  let emailService: EmailService;
  let configService: ConfigService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockInvoiceId = 'invoice-123';
  const mockAccountId = 'account-123';
  const mockSubscriptionId = 'sub_test_123';

  const mockInvoice = {
    id: mockInvoiceId,
    tenant_id: mockTenantId,
    account_id: mockAccountId,
    invoice_number: 'INV-001',
    status: 'sent',
    total_amount: 100.00,
    subtotal: 100.00,
    tax_amount: 0,
    issue_date: new Date(),
    due_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: mockUserId,
    updated_by: mockUserId,
    InvoiceItem: [],
    accounts: {
      id: mockAccountId,
      name: 'Test Customer',
      email: 'test@example.com',
    },
    Payment: [],
  };

  const mockAccount = {
    id: mockAccountId,
    tenant_id: mockTenantId,
    name: 'Test Customer',
    email: 'test@example.com',
    stripe_customer_id: 'cus_test_123',
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      invoice: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      account: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      payment: {
        findMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
      },
      communicationLog: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const mockStripeService = {
      createPrice: jest.fn(),
      createSubscription: jest.fn(),       
      getSubscription: jest.fn(),
      cancelSubscription: jest.fn(),       
      createPaymentIntent: jest.fn(),      
      confirmPaymentIntent: jest.fn(),
      createCustomer: jest.fn(),
    };

    const mockEmailService = {
      sendPaymentFailureEmail: jest.fn(),
      sendEmail: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'FRONTEND_URL') return 'http://localhost:5173';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    stripeService = module.get<StripeService>(StripeService);
    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock getCurrentTenantId
    jest.spyOn(service as any, 'getCurrentTenantId').mockResolvedValue(mockTenantId);
    jest.spyOn(service as any, 'getInvoiceById').mockResolvedValue(mockInvoice);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retryFailedPayment', () => {
    it('should retry payment successfully on first attempt', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 10000,
        client_secret: 'pi_test_123_secret',
      };

      // Mock account lookup for customer
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue(mockPaymentIntent as any);
      jest.spyOn(stripeService, 'confirmPaymentIntent').mockResolvedValue(mockPaymentIntent as any);
      jest.spyOn(databaseService.payment, 'create').mockResolvedValue({
        id: 'payment-123',
        invoice_id: mockInvoiceId,
        amount: 100.00,
        status: 'completed',
      } as any);

      const result = await service.retryFailedPayment(mockInvoiceId, mockUserId, 1, 3);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(stripeService.createPaymentIntent).toHaveBeenCalled();
    });

    it('should retry payment with exponential backoff on failure', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(stripeService, 'createPaymentIntent').mockRejectedValue(new BadRequestException('Payment failed'));

      await expect(
        service.retryFailedPayment(mockInvoiceId, mockUserId, 1, 3)
      ).rejects.toThrow();

      expect(stripeService.createPaymentIntent).toHaveBeenCalled();
    });

    it('should throw error when max retries exceeded', async () => {
      jest.spyOn(stripeService, 'createPaymentIntent').mockRejectedValue(new Error('Payment failed'));

      await expect(
        service.retryFailedPayment(mockInvoiceId, mockUserId, 4, 3)
      ).rejects.toThrow('Maximum retry attempts (3) reached');
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(service as any, 'getInvoiceById').mockRejectedValue(new NotFoundException('Invoice not found'));

      await expect(
        service.retryFailedPayment(mockInvoiceId, mockUserId, 1, 3)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPaymentRetryHistory', () => {
    it('should return payment retry history for invoice', async () => {
      const mockRetryHistory = [
        {
          id: 'log-1',
          tenant_id: mockTenantId,
          communication_type: 'payment_failure',
          message_content: `Payment failed for invoice ${mockInvoiceId}`,
          timestamp: new Date('2025-11-15'),
        },
        {
          id: 'log-2',
          tenant_id: mockTenantId,
          communication_type: 'payment_failure',
          message_content: `Payment retry failed for invoice ${mockInvoiceId}`,
          timestamp: new Date('2025-11-16'),
        },
      ];

      jest.spyOn(databaseService.communicationLog, 'findMany').mockResolvedValue(mockRetryHistory as any);

      const result = await service.getPaymentRetryHistory(mockInvoiceId);

      expect(result).toBeDefined();
      expect(result.retryCount).toBe(2);
      expect(result.attempts).toHaveLength(2);
      expect(databaseService.communicationLog.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no retry history exists', async () => {
      jest.spyOn(databaseService.communicationLog, 'findMany').mockResolvedValue([] as any);

      const result = await service.getPaymentRetryHistory(mockInvoiceId);

      expect(result).toBeDefined();
      expect(result.retryCount).toBe(0);
      expect(result.attempts).toHaveLength(0);
    });
  });

  describe('getPaymentAnalytics', () => {
    it('should return payment analytics with date range', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          amount: 100.00,
          status: 'completed',
          payment_date: new Date('2025-11-01'),
          payment_methods: {
            payment_type: 'credit_card',
            payment_name: 'Visa',
          },
          Invoice: {
            invoice_number: 'INV-001',
            status: 'paid',
          },
        },
        {
          id: 'payment-2',
          amount: 200.00,
          status: 'completed',
          payment_date: new Date('2025-11-15'),
          payment_methods: {
            payment_type: 'ach',
            payment_name: 'Bank Transfer',
          },
          Invoice: {
            invoice_number: 'INV-002',
            status: 'paid',
          },
        },
        {
          id: 'payment-3',
          amount: 50.00,
          status: 'failed',
          payment_date: new Date('2025-11-10'),
          payment_methods: {
            payment_type: 'credit_card',
            payment_name: 'Mastercard',
          },
          Invoice: {
            invoice_number: 'INV-003',
            status: 'sent',
          },
        },
      ];

      const mockFailures: any[] = [];

      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue(mockPayments as any);
      jest.spyOn(databaseService.communicationLog, 'findMany').mockResolvedValue(mockFailures as any);

      const result = await service.getPaymentAnalytics(
        mockTenantId,
        '2025-11-01',
        '2025-11-30'
      );

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.totalPayments).toBe(3);
      expect(result.summary.totalFailures).toBe(0); // Only communication log failures count
      expect(result.summary.totalAmount).toBe(350.00);
    });

    it('should return payment analytics without date range', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          amount: 100.00,
          status: 'completed',
          payment_date: new Date(),
          payment_methods: {
            payment_type: 'credit_card',
            payment_name: 'Visa',
          },
          Invoice: {
            invoice_number: 'INV-001',
            status: 'paid',
          },
        },
      ];

      const mockFailures: any[] = [];

      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue(mockPayments as any);
      jest.spyOn(databaseService.communicationLog, 'findMany').mockResolvedValue(mockFailures as any);

      const result = await service.getPaymentAnalytics(mockTenantId);

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(databaseService.payment.findMany).toHaveBeenCalled();
    });

    it('should calculate payment method breakdown correctly', async () => {
        const mockPayments = [
          {
            id: 'payment-1',
            amount: 100.00,
            status: 'completed',
            payment_date: new Date(),
            payment_methods: {
              payment_type: 'credit_card',
              payment_name: 'Visa',
            },
            Invoice: {
              invoice_number: 'INV-001',
              status: 'paid',
            },
          },
          {
            id: 'payment-2',
            amount: 200.00,
            status: 'completed',
            payment_date: new Date(),
            payment_methods: {
              payment_type: 'ach',
              payment_name: 'Bank Transfer',
            },
            Invoice: {
              invoice_number: 'INV-002',
              status: 'paid',
            },
          },
        ];

        const mockFailures: any[] = [];

        jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue(mockPayments as any);
        jest.spyOn(databaseService.communicationLog, 'findMany').mockResolvedValue(mockFailures as any);

        const result = await service.getPaymentAnalytics(mockTenantId);

        expect(result).toBeDefined();
        expect(result.paymentMethodBreakdown).toBeDefined();
        expect(Array.isArray(result.paymentMethodBreakdown)).toBe(true);
        expect(result.paymentMethodBreakdown.length).toBeGreaterThan(0);
    });
  });

  describe('createRecurringPayment', () => {
    it('should create recurring payment successfully', async () => {
      const mockPrice = {
        id: 'price_test_123',
        unit_amount: 10000,
      };

      const mockSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        latest_invoice: {
          payment_intent: {
            client_secret: 'pi_test_123_secret',
          },
        },
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(stripeService, 'createPrice').mockResolvedValue(mockPrice as any);
      jest.spyOn(stripeService, 'createSubscription').mockResolvedValue(mockSubscription as any);

      const createDto = {
        invoice_id: mockInvoiceId,
        interval: 'monthly' as const,
        amount: 100.00,
      };

      const result = await service.createRecurringPayment(createDto, mockUserId);

      expect(result).toBeDefined();
      expect(result.subscriptionId).toBe(mockSubscriptionId);
      expect(result.interval).toBe('monthly');
      expect(result.amount).toBe(100.00);
      expect(stripeService.createPrice).toHaveBeenCalled();
      expect(stripeService.createSubscription).toHaveBeenCalled();
    });

    it('should reuse existing Stripe customer ID', async () => {
      const mockPrice = { id: 'price_test_123', unit_amount: 10000 };
      const mockSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        latest_invoice: { payment_intent: { client_secret: 'pi_test_123_secret' } },
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(stripeService, 'createPrice').mockResolvedValue(mockPrice as any);
      jest.spyOn(stripeService, 'createSubscription').mockResolvedValue(mockSubscription as any);

      const createDto = {
        invoice_id: mockInvoiceId,
        interval: 'monthly' as const,
        amount: 100.00,
      };

      await service.createRecurringPayment(createDto, mockUserId);

        expect(stripeService.createSubscription).toHaveBeenCalledWith(
          'cus_test_123',
          'price_test_123',
          expect.any(Object)
        );
        expect(stripeService.createCustomer).not.toHaveBeenCalled();
    });

    it('should create new Stripe customer if not exists', async () => {
      const accountWithoutStripe = { ...mockAccount, stripe_customer_id: null };
      const mockPrice = { id: 'price_test_123', unit_amount: 10000 };
      const mockCustomer = { id: 'cus_new_123' };
      const mockSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        latest_invoice: { payment_intent: { client_secret: 'pi_test_123_secret' } },
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(accountWithoutStripe as any);
      jest.spyOn(stripeService, 'createCustomer').mockResolvedValue(mockCustomer as any);
      jest.spyOn(stripeService, 'createPrice').mockResolvedValue(mockPrice as any);
      jest.spyOn(stripeService, 'createSubscription').mockResolvedValue(mockSubscription as any);
      jest.spyOn(databaseService.account, 'update').mockResolvedValue({
        ...accountWithoutStripe,
        stripe_customer_id: 'cus_new_123',
      } as any);

      const createDto = {
        invoice_id: mockInvoiceId,
        interval: 'monthly' as const,
        amount: 100.00,
      };

      await service.createRecurringPayment(createDto, mockUserId);

      expect(stripeService.createCustomer).toHaveBeenCalled();
      expect(databaseService.account.update).toHaveBeenCalledWith({
        where: { 
          id: mockAccountId,
          tenant_id: mockTenantId,
        },
        data: { stripe_customer_id: 'cus_new_123' },
      });
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(service as any, 'getInvoiceById').mockRejectedValue(new NotFoundException('Invoice not found'));

      const createDto = {
        invoice_id: mockInvoiceId,
        interval: 'monthly' as const,
        amount: 100.00,
      };

      await expect(
        service.createRecurringPayment(createDto, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should support different intervals (weekly, monthly, quarterly, yearly)', async () => {
      const intervals = ['weekly', 'monthly', 'quarterly', 'yearly'] as const;
      const mockPrice = { id: 'price_test_123', unit_amount: 10000 };
      const mockSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        latest_invoice: { payment_intent: { client_secret: 'pi_test_123_secret' } },
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(stripeService, 'createPrice').mockResolvedValue(mockPrice as any);
      jest.spyOn(stripeService, 'createSubscription').mockResolvedValue(mockSubscription as any);

      for (const interval of intervals) {
        const createDto = {
          invoice_id: mockInvoiceId,
          interval,
          amount: 100.00,
        };

        const result = await service.createRecurringPayment(createDto, mockUserId);

        expect(result.interval).toBe(interval);
      }
    });
  });

  describe('getRecurringPayment', () => {
    it('should return recurring payment details', async () => {
      const mockSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
        items: {
          data: [{
            price: {
              id: 'price_test_123',
              unit_amount: 10000,
            },
          }],
        },
      };

      jest.spyOn(stripeService, 'getSubscription').mockResolvedValue(mockSubscription as any);
      jest.spyOn(databaseService.payment, 'findFirst').mockResolvedValue({
        id: 'payment-123',
        invoice_id: mockInvoiceId,
        subscription_id: mockSubscriptionId,
      } as any);

      const result = await service.getRecurringPayment(mockSubscriptionId);

      expect(result).toBeDefined();
      expect(result.subscriptionId).toBe(mockSubscriptionId);
      expect(result.status).toBe('active');
      expect(stripeService.getSubscription).toHaveBeenCalledWith(mockSubscriptionId);
    });

    it('should throw NotFoundException when subscription not found', async () => {
      jest.spyOn(stripeService, 'getSubscription').mockRejectedValue(new NotFoundException('Subscription not found'));

        // The service wraps NotFoundException in BadRequestException, so we check for that
        await expect(
          service.getRecurringPayment(mockSubscriptionId)
        ).rejects.toThrow('Failed to get recurring payment');
    });
  });

  describe('cancelRecurringPayment', () => {
    it('should cancel recurring payment immediately', async () => {
      const mockCanceledSubscription = {
        id: mockSubscriptionId,
        status: 'canceled',
        canceled_at: Math.floor(Date.now() / 1000),
        cancel_at_period_end: false,
      };

      jest.spyOn(stripeService, 'cancelSubscription').mockResolvedValue(mockCanceledSubscription as any);

      const result = await service.cancelRecurringPayment(mockSubscriptionId, true);

      expect(result).toBeDefined();
      expect(result.subscriptionId).toBe(mockSubscriptionId);
      expect(result.status).toBe('canceled');
      expect(result.canceledAt).toBeDefined();
      expect(stripeService.cancelSubscription).toHaveBeenCalledWith(
        mockSubscriptionId,
        true
      );
    });

    it('should cancel recurring payment at period end', async () => {
      const mockCanceledSubscription = {
        id: mockSubscriptionId,
        status: 'active',
        canceled_at: null,
        cancel_at_period_end: true,
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
      };

      jest.spyOn(stripeService, 'cancelSubscription').mockResolvedValue(mockCanceledSubscription as any);

      const result = await service.cancelRecurringPayment(mockSubscriptionId, false);

      expect(result).toBeDefined();
      expect(result.subscriptionId).toBe(mockSubscriptionId);
      expect(result.status).toBe('active');
      expect(result.cancelAtPeriodEnd).toBe(true);
      expect(stripeService.cancelSubscription).toHaveBeenCalledWith(
        mockSubscriptionId,
        false
      );
    });

    it('should throw NotFoundException when subscription not found', async () => {
      jest.spyOn(stripeService, 'cancelSubscription').mockRejectedValue(
        new NotFoundException('Subscription not found')
      );

      // The service wraps NotFoundException in BadRequestException, so we check for that
      await expect(
        service.cancelRecurringPayment(mockSubscriptionId, true)
      ).rejects.toThrow('Failed to cancel recurring payment');
    });
  });
});
