/**
 * Billing Service Unit Tests
 * Tests for invoice creation, payment processing, and subscription management
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BillingService } from '../../../src/billing/billing.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { StripeService } from '../../../src/billing/stripe.service';
import { InvoiceStatus } from '../../../src/billing/dto';

describe('BillingService', () => {
  let service: BillingService;
  let databaseService: DatabaseService;
  let stripeService: StripeService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockAccountId = 'account-123';

  const mockInvoice = {
    id: 'invoice-123',
    tenant_id: mockTenantId,
    account_id: mockAccountId,
    invoice_number: 'INV-2025-001',
    status: InvoiceStatus.DRAFT,
    subtotal: 100.0,
    tax_amount: 0,
    total_amount: 100.0,
    issue_date: new Date(),
    due_date: new Date(),
    created_by: mockUserId,
    updated_by: mockUserId,
    InvoiceItem: [],
    accounts: {
      id: mockAccountId,
      name: 'Test Account',
      email: 'test@example.com',
    },
    Payment: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: DatabaseService,
          useValue: {
            invoice: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              aggregate: jest.fn(),
            },
            payment: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            paymentMethod: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              updateMany: jest.fn(),
              delete: jest.fn(),
            },
            account: {
              findFirst: jest.fn(),
            },
            getCurrentTenantId: jest.fn().mockResolvedValue(mockTenantId),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
            getPaymentIntent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    stripeService = module.get<StripeService>(StripeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    const createInvoiceDto = {
      account_id: mockAccountId,
      items: [
        {
          service_type_id: 'service-1',
          description: 'Test Service',
          quantity: 1,
          unit_price: 100.0,
        },
      ],
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    it('should create invoice successfully', async () => {
      jest.spyOn(databaseService.invoice, 'create').mockResolvedValue(mockInvoice as any);

      const result = await service.createInvoice(createInvoiceDto, mockUserId, mockTenantId);

      expect(result).toBeDefined();
      expect(databaseService.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenant_id: mockTenantId,
            account_id: mockAccountId,
            status: InvoiceStatus.DRAFT,
            total_amount: 100.0,
          }),
        })
      );
    });

    it('should generate invoice number when not provided', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.invoice, 'create').mockResolvedValue(mockInvoice as any);

      await service.createInvoice(createInvoiceDto, mockUserId, mockTenantId);

      expect(databaseService.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            invoice_number: expect.stringMatching(/^INV-\d{4}-\d{3}$/),
          }),
        })
      );
    });

    it('should use provided invoice number', async () => {
      const dtoWithNumber = {
        ...createInvoiceDto,
        invoice_number: 'CUSTOM-001',
      };
      jest.spyOn(databaseService.invoice, 'create').mockResolvedValue(mockInvoice as any);

      await service.createInvoice(dtoWithNumber, mockUserId, mockTenantId);

      expect(databaseService.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            invoice_number: 'CUSTOM-001',
          }),
        })
      );
    });

    it('should calculate totals correctly', async () => {
      const dtoWithMultipleItems = {
        ...createInvoiceDto,
        items: [
          { service_type_id: 'service-1', description: 'Item 1', quantity: 2, unit_price: 50.0 },
          { service_type_id: 'service-2', description: 'Item 2', quantity: 1, unit_price: 30.0 },
        ],
      };
      jest.spyOn(databaseService.invoice, 'create').mockResolvedValue(mockInvoice as any);

      await service.createInvoice(dtoWithMultipleItems, mockUserId, mockTenantId);

      expect(databaseService.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subtotal: 130.0,
            total_amount: 130.0,
          }),
        })
      );
    });

    it('should get tenant ID from context when not provided', async () => {
      jest.spyOn(databaseService.invoice, 'create').mockResolvedValue(mockInvoice as any);

      await service.createInvoice(createInvoiceDto, mockUserId);

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
      expect(databaseService.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenant_id: mockTenantId,
          }),
        })
      );
    });

    it('should throw BadRequestException when tenant context not found', async () => {
      jest.spyOn(databaseService, 'getCurrentTenantId').mockResolvedValue(null);

      await expect(service.createInvoice(createInvoiceDto, mockUserId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createInvoice(createInvoiceDto, mockUserId)).rejects.toThrow(
        'Tenant context not found'
      );
    });

    it('should handle duplicate invoice number error', async () => {
      const error: any = new Error('Duplicate');
      error.code = 'P2002';
      jest.spyOn(databaseService.invoice, 'create').mockRejectedValue(error);

      await expect(service.createInvoice(createInvoiceDto, mockUserId, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createInvoice(createInvoiceDto, mockUserId, mockTenantId)).rejects.toThrow(
        'Duplicate invoice number or constraint violation'
      );
    });

    it('should handle invalid reference error', async () => {
      const error: any = new Error('Invalid reference');
      error.code = 'P2003';
      jest.spyOn(databaseService.invoice, 'create').mockRejectedValue(error);

      await expect(service.createInvoice(createInvoiceDto, mockUserId, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createInvoice(createInvoiceDto, mockUserId, mockTenantId)).rejects.toThrow(
        'Invalid reference - customer or service type not found'
      );
    });
  });

  describe('getInvoices', () => {
    it('should return invoices for tenant', async () => {
      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([mockInvoice] as any);

      const result = await service.getInvoices(undefined, undefined, mockTenantId);

      expect(result).toHaveLength(1);
      expect(databaseService.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenant_id: mockTenantId },
        })
      );
    });

    it('should filter by account ID', async () => {
      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([mockInvoice] as any);

      await service.getInvoices(mockAccountId, undefined, mockTenantId);

      expect(databaseService.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            account_id: mockAccountId,
          }),
        })
      );
    });

    it('should filter by status', async () => {
      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([mockInvoice] as any);

      await service.getInvoices(undefined, InvoiceStatus.PAID, mockTenantId);

      expect(databaseService.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: InvoiceStatus.PAID,
          }),
        })
      );
    });

    it('should get tenant ID from context when not provided', async () => {
      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([]);

      await service.getInvoices();

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      jest.spyOn(databaseService.invoice, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getInvoices(undefined, undefined, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice by ID', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);

      const result = await service.getInvoiceById('invoice-123');

      expect(result).toBeDefined();
      expect(result.id).toBe('invoice-123');
      expect(databaseService.invoice.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'invoice-123',
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(service.getInvoiceById('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getInvoiceById('non-existent')).rejects.toThrow('Invoice not found');
    });

    it('should handle database errors', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockRejectedValue(new Error('Database error'));

      await expect(service.getInvoiceById('invoice-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateInvoice', () => {
    const updateDto = {
      status: InvoiceStatus.PAID,
      notes: 'Updated notes',
    };

    it('should update invoice successfully', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);
      jest.spyOn(databaseService.invoice, 'update').mockResolvedValue({
        ...mockInvoice,
        ...updateDto,
      } as any);

      const result = await service.updateInvoice('invoice-123', updateDto, mockUserId);

      expect(result.status).toBe(InvoiceStatus.PAID);
      expect(databaseService.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'invoice-123' },
          data: expect.objectContaining({
            status: InvoiceStatus.PAID,
            notes: 'Updated notes',
            updated_by: mockUserId,
          }),
        })
      );
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(service.updateInvoice('non-existent', updateDto, mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should update only provided fields', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);
      jest.spyOn(databaseService.invoice, 'update').mockResolvedValue(mockInvoice as any);

      await service.updateInvoice('invoice-123', { status: InvoiceStatus.PAID }, mockUserId);

      expect(databaseService.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: InvoiceStatus.PAID,
            updated_by: mockUserId,
          }),
        })
      );
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);
      jest.spyOn(databaseService.invoice, 'delete').mockResolvedValue(mockInvoice as any);

      await service.deleteInvoice('invoice-123');

      expect(databaseService.invoice.delete).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
      });
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(service.deleteInvoice('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPayment', () => {
    const createPaymentDto = {
      invoice_id: 'invoice-123',
      payment_method_id: 'payment-method-123',
      amount: 100.0,
      payment_date: new Date().toISOString(),
    };

    const mockPaymentMethod = {
      id: 'payment-method-123',
      tenant_id: mockTenantId,
      payment_type: 'credit_card',
    };

    it('should create payment successfully', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue(mockPaymentMethod as any);
      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.payment, 'create').mockResolvedValue({
        id: 'payment-123',
        ...createPaymentDto,
      } as any);

      const result = await service.createPayment(createPaymentDto, mockUserId);

      expect(result).toBeDefined();
      expect(databaseService.payment.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(service.createPayment(createPaymentDto, mockUserId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createPayment(createPaymentDto, mockUserId)).rejects.toThrow(
        'Invoice not found'
      );
    });

    it('should throw NotFoundException when payment method not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(mockInvoice as any);
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue(null);

      await expect(service.createPayment(createPaymentDto, mockUserId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createPayment(createPaymentDto, mockUserId)).rejects.toThrow(
        'Payment method not found'
      );
    });

    it('should update invoice status to PAID when fully paid', async () => {
      const paidInvoice = { ...mockInvoice, total_amount: 100.0 };
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(paidInvoice as any);
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue(mockPaymentMethod as any);
      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([
        { amount: 100.0 },
      ] as any);
      jest.spyOn(databaseService.payment, 'create').mockResolvedValue({
        id: 'payment-123',
        ...createPaymentDto,
      } as any);
      jest.spyOn(databaseService.invoice, 'update').mockResolvedValue(paidInvoice as any);

      await service.createPayment(createPaymentDto, mockUserId);

      expect(databaseService.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'invoice-123' },
          data: expect.objectContaining({
            status: InvoiceStatus.PAID,
          }),
        })
      );
    });
  });

  describe('getPayments', () => {
    const mockPayment = {
      id: 'payment-123',
      invoice_id: 'invoice-123',
      amount: 100.0,
      payment_method_id: 'pm-123',
      status: 'completed',
      created_at: new Date(),
    };

    it('should return payments for tenant', async () => {
      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([mockPayment] as any);

      const result = await service.getPayments(undefined, mockTenantId);

      expect(result).toHaveLength(1);
      expect(databaseService.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
          }),
        })
      );
    });

    it('should filter by invoice ID', async () => {
      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([mockPayment] as any);

      await service.getPayments('invoice-123', mockTenantId);

      expect(databaseService.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            invoice_id: 'invoice-123',
          }),
        })
      );
    });

    it('should get tenant ID from context when not provided', async () => {
      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService, 'getCurrentTenantId').mockResolvedValue(mockTenantId);

      await service.getPayments();

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
    });
  });

  describe('createPaymentMethod', () => {
    const createPaymentMethodDto = {
      account_id: mockAccountId,
      payment_type: 'card',
      card_last4: '4242',
      card_type: 'visa',
      card_expiry: '12/2025',
    };

    it('should create payment method successfully', async () => {
      const mockPaymentMethod = {
        id: 'pm-123',
        ...createPaymentMethodDto,
        tenant_id: mockTenantId,
        is_default: false,
      };

      jest.spyOn(databaseService.paymentMethod, 'create').mockResolvedValue(mockPaymentMethod as any);

      const result = await service.createPaymentMethod(createPaymentMethodDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('pm-123');
      expect(databaseService.paymentMethod.create).toHaveBeenCalled();
    });

    it('should set as default when is_default is true', async () => {
      const dtoWithDefault = {
        ...createPaymentMethodDto,
        is_default: true,
      };

      const mockPaymentMethod = {
        id: 'pm-123',
        ...dtoWithDefault,
        tenant_id: mockTenantId,
      };

      jest.spyOn(databaseService.paymentMethod, 'create').mockResolvedValue(mockPaymentMethod as any);
      jest.spyOn(databaseService.paymentMethod, 'updateMany').mockResolvedValue({ count: 1 } as any);

      await service.createPaymentMethod(dtoWithDefault);

      expect(databaseService.paymentMethod.updateMany).toHaveBeenCalled();
    });
  });

  describe('getPaymentMethods', () => {
    const mockPaymentMethod = {
      id: 'pm-123',
      account_id: mockAccountId,
      type: 'card',
      last4: '4242',
      brand: 'visa',
      is_default: true,
    };

    it('should return payment methods for account', async () => {
      jest.spyOn(databaseService.paymentMethod, 'findMany').mockResolvedValue([mockPaymentMethod] as any);

      const result = await service.getPaymentMethods(mockAccountId);

      expect(result).toHaveLength(1);
      expect(databaseService.paymentMethod.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            account_id: mockAccountId,
          }),
        })
      );
    });

    it('should return all payment methods when account ID not provided', async () => {
      jest.spyOn(databaseService.paymentMethod, 'findMany').mockResolvedValue([mockPaymentMethod] as any);

      await service.getPaymentMethods();

      expect(databaseService.paymentMethod.findMany).toHaveBeenCalled();
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete payment method successfully', async () => {
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue({
        id: 'pm-123',
      } as any);
      jest.spyOn(databaseService.paymentMethod, 'delete').mockResolvedValue({} as any);

      await service.deletePaymentMethod('pm-123');

      expect(databaseService.paymentMethod.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pm-123' },
        })
      );
    });

    it('should throw NotFoundException when payment method not found', async () => {
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue(null);

      await expect(service.deletePaymentMethod('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createStripePaymentIntent', () => {
    it('should create Stripe payment intent successfully', async () => {
      const invoiceWithStripe = {
        ...mockInvoice,
        total_amount: 100.0,
        accounts: {
          id: mockAccountId,
          stripe_customer_id: 'cus_123',
        },
      };

      // Mock getInvoiceById call (which calls findFirst internally)
      jest.spyOn(service, 'getInvoiceById').mockResolvedValue(invoiceWithStripe as any);
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue({
        id: mockAccountId,
        email: 'customer@example.com',
        name: 'Test Customer',
      } as any);
      jest.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue({
        paymentIntentId: 'pi_123',
        clientSecret: 'pi_123_secret',
      } as any);

      const result = await service.createStripePaymentIntent('invoice-123', mockUserId);

      expect(result).toBeDefined();
      expect(result.paymentIntentId).toBe('pi_123');
      expect(stripeService.createPaymentIntent).toHaveBeenCalled();
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(
        service.createStripePaymentIntent('non-existent', mockUserId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStripePaymentStatus', () => {
    it('should return payment status from Stripe', async () => {
      jest.spyOn(stripeService, 'getPaymentIntent').mockResolvedValue({
        id: 'pi_123',
        status: 'succeeded',
      } as any);

      const result = await service.getStripePaymentStatus('pi_123');

      expect(result).toBeDefined();
      expect(result.status).toBe('succeeded');
    });
  });

  describe('getBillingAnalytics', () => {
    it('should return billing analytics for tenant', async () => {
      jest.spyOn(databaseService.invoice, 'count')
        .mockResolvedValueOnce(10) // totalInvoices
        .mockResolvedValueOnce(2); // overdueInvoices
      jest.spyOn(databaseService.invoice, 'aggregate')
        .mockResolvedValueOnce({ _sum: { total_amount: 1000.0 } } as any) // revenue
        .mockResolvedValueOnce({ _sum: { total_amount: 500.0 } } as any); // outstanding

      const result = await service.getBillingAnalytics(mockTenantId);

      expect(result).toBeDefined();
      expect(result.totalRevenue).toBe(1000.0);
      expect(result.outstandingAmount).toBe(500.0);
      expect(result.totalInvoices).toBe(10);
      expect(result.overdueInvoices).toBe(2);
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should return revenue analytics for date range', async () => {
      const paidInvoice1 = {
        ...mockInvoice,
        total_amount: 100.0,
        status: InvoiceStatus.PAID,
        issue_date: new Date('2025-01-15'),
        Payment: [{
          payment_date: new Date('2025-01-15'),
        }],
      };
      const paidInvoice2 = {
        ...mockInvoice,
        total_amount: 200.0,
        status: InvoiceStatus.PAID,
        issue_date: new Date('2025-01-16'),
        Payment: [{
          payment_date: new Date('2025-01-16'),
        }],
      };

      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([
        paidInvoice1,
        paidInvoice2,
      ] as any);

      const result = await service.getRevenueAnalytics(
        mockTenantId,
        '2025-01-01',
        '2025-01-31'
      );

      expect(result).toBeDefined();
      expect(result.totalRevenue).toBe(300.0);
      expect(result.monthlyRevenue).toBeDefined();
    });
  });

  describe('getARSummary', () => {
    it('should return accounts receivable summary', async () => {
      const pendingInvoice = {
        ...mockInvoice,
        id: 'invoice-1',
        total_amount: 100.0,
        status: InvoiceStatus.SENT,
        due_date: new Date('2025-01-20'),
        account_id: mockAccountId,
        Payment: [{ amount: 0 }],
        accounts: {
          id: mockAccountId,
          name: 'Test Account',
          email: 'test@example.com',
        },
      };
      const overdueInvoice = {
        ...mockInvoice,
        id: 'invoice-2',
        total_amount: 200.0,
        status: InvoiceStatus.OVERDUE,
        due_date: new Date('2025-01-01'),
        account_id: mockAccountId,
        Payment: [{ amount: 50.0 }],
        accounts: {
          id: mockAccountId,
          name: 'Test Account',
          email: 'test@example.com',
        },
      };

      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([
        pendingInvoice,
        overdueInvoice,
      ] as any);

      const result = await service.getARSummary(mockTenantId);

      expect(result).toBeDefined();
      expect(result.totalAR).toBeDefined();
      expect(result.agingBuckets).toBeDefined();
      expect(result.customerAR).toBeDefined();
    });
  });

  describe('getOverdueInvoices', () => {
    it('should return overdue invoices', async () => {
      const overdueInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.OVERDUE,
        due_date: new Date('2025-01-01'),
      };

      jest.spyOn(databaseService.invoice, 'findMany').mockResolvedValue([overdueInvoice] as any);

      const result = await service.getOverdueInvoices(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(InvoiceStatus.OVERDUE);
    });
  });

  describe('getPaymentTracking', () => {
    it('should return payment tracking data', async () => {
      const mockPayment = {
        id: 'payment-1',
        invoice_id: 'invoice-123',
        amount: 100.0,
        status: 'completed',
        payment_date: new Date('2025-01-15'),
        Invoice: {
          id: 'invoice-123',
          invoice_number: 'INV-001',
          accounts: {
            name: 'Test Account',
          },
        },
      };

      jest.spyOn(databaseService.payment, 'findMany').mockResolvedValue([mockPayment] as any);

      const result = await service.getPaymentTracking(
        mockTenantId,
        '2025-01-01',
        '2025-01-31'
      );

      expect(result).toBeDefined();
      expect(result.payments).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.dailyTrends).toBeDefined();
    });
  });

  describe('createPaymentFromStripe', () => {
    it('should create payment record from Stripe webhook data', async () => {
      const paymentData = {
        invoice_id: 'invoice-123',
        amount: 100.0,
        payment_date: new Date(),
        reference_number: 'pi_123',
        notes: 'Stripe payment',
        stripe_payment_intent_id: 'pi_123',
        stripe_charge_id: 'ch_123',
      };

      const invoiceWithId = {
        ...mockInvoice,
        id: 'invoice-123',
        total_amount: 100.0,
      };

      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(invoiceWithId as any);
      jest.spyOn(databaseService.payment, 'findFirst').mockResolvedValue(null); // No existing payment
      jest.spyOn(databaseService.paymentMethod, 'findFirst').mockResolvedValue(null); // No existing payment method
      jest.spyOn(databaseService.paymentMethod, 'create').mockResolvedValue({
        id: 'pm-stripe-123',
      } as any);
      jest.spyOn(service, 'getTotalPaidAmount').mockResolvedValue(100.0);
      jest.spyOn(databaseService.payment, 'create').mockResolvedValue({
        id: 'payment-123',
        ...paymentData,
      } as any);
      jest.spyOn(databaseService.invoice, 'update').mockResolvedValue(invoiceWithId as any);

      const result = await service.createPaymentFromStripe(paymentData);

      expect(result).toBeDefined();
      expect(databaseService.payment.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when invoice ID is missing', async () => {
      const paymentData = {
        invoice_id: '',
        amount: 100.0,
        payment_date: new Date(),
        reference_number: 'pi_123',
        notes: 'Stripe payment',
        stripe_payment_intent_id: 'pi_123',
      };

      await expect(service.createPaymentFromStripe(paymentData)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when invoice not found', async () => {
      const paymentData = {
        invoice_id: 'non-existent',
        amount: 100.0,
        payment_date: new Date(),
        reference_number: 'pi_123',
        notes: 'Stripe payment',
        stripe_payment_intent_id: 'pi_123',
      };

      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);

      await expect(service.createPaymentFromStripe(paymentData)).rejects.toThrow(NotFoundException);
    });
  });
});

