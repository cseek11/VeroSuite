/**
 * Billing Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from '../../../src/billing/billing.controller';
import { BillingService } from '../../../src/billing/billing.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BillingController', () => {
  let controller: BillingController;
  let billingService: BillingService;

  const mockUser = {
    userId: 'user-123',
    email: 'test@example.com',
    tenantId: 'tenant-123',
  };

  const mockInvoice = {
    id: 'invoice-123',
    invoice_number: 'INV-2025-001',
    total_amount: 100.0,
    status: 'DRAFT',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        {
          provide: BillingService,
          useValue: {
            createInvoice: jest.fn(),
            getInvoices: jest.fn(),
            getInvoiceById: jest.fn(),
            updateInvoice: jest.fn(),
            deleteInvoice: jest.fn(),
            createPayment: jest.fn(),
            getPayments: jest.fn(),
            createPaymentMethod: jest.fn(),
            getPaymentMethods: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    billingService = module.get<BillingService>(BillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    const createInvoiceDto = {
      account_id: 'account-123',
      items: [
        {
          service_type_id: 'service-1',
          description: 'Test Service',
          quantity: 1,
          unit_price: 100.0,
        },
      ],
      issue_date: new Date().toISOString(),
      due_date: new Date().toISOString(),
    };

    it('should create invoice successfully', async () => {
      jest.spyOn(billingService, 'createInvoice').mockResolvedValue(mockInvoice as any);

      const result = await controller.createInvoice(createInvoiceDto, { user: mockUser } as any);

      expect(result).toEqual(mockInvoice);
      expect(billingService.createInvoice).toHaveBeenCalledWith(
        createInvoiceDto,
        mockUser.userId,
        mockUser.tenantId
      );
    });

    it('should handle service errors', async () => {
      jest.spyOn(billingService, 'createInvoice').mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.createInvoice(createInvoiceDto, { user: mockUser } as any)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getInvoices', () => {
    it('should return invoices', async () => {
      jest.spyOn(billingService, 'getInvoices').mockResolvedValue([mockInvoice] as any);

      // Create proper request object with user property
      const mockRequest = { user: mockUser } as any;
      const result = await controller.getInvoices(mockRequest, undefined, undefined);

      expect(result).toEqual([mockInvoice]);
      expect(billingService.getInvoices).toHaveBeenCalledWith(undefined, undefined, mockUser.tenantId);
    });

    it('should filter by account ID', async () => {
      jest.spyOn(billingService, 'getInvoices').mockResolvedValue([mockInvoice] as any);

      const mockRequest = { user: mockUser } as any;
      await controller.getInvoices(mockRequest, 'account-123', undefined);

      expect(billingService.getInvoices).toHaveBeenCalledWith('account-123', undefined, mockUser.tenantId);
    });

    it('should filter by status', async () => {
      jest.spyOn(billingService, 'getInvoices').mockResolvedValue([mockInvoice] as any);

      const mockRequest = { user: mockUser } as any;
      await controller.getInvoices(mockRequest, undefined, 'PAID');

      expect(billingService.getInvoices).toHaveBeenCalledWith(undefined, 'PAID', mockUser.tenantId);
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice by ID', async () => {
      jest.spyOn(billingService, 'getInvoiceById').mockResolvedValue(mockInvoice as any);

      const result = await controller.getInvoiceById('invoice-123');

      expect(result).toEqual(mockInvoice);
      expect(billingService.getInvoiceById).toHaveBeenCalledWith('invoice-123');
    });

    it('should throw NotFoundException when invoice not found', async () => {
      jest.spyOn(billingService, 'getInvoiceById').mockRejectedValue(new NotFoundException('Invoice not found'));

      await expect(controller.getInvoiceById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('processPayment', () => {
    const createPaymentDto = {
      payment_method_id: 'payment-method-123',
      amount: 100.0,
      payment_date: new Date().toISOString(),
    };

    const mockPayment = {
      id: 'payment-123',
      amount: 100.0,
      invoice_id: 'invoice-123',
    };

    it('should process payment successfully', async () => {
      jest.spyOn(billingService, 'createPayment').mockResolvedValue(mockPayment as any);

      const result = await controller.processPayment(
        'invoice-123',
        createPaymentDto,
        { user: mockUser } as any
      );

      expect(result).toEqual(mockPayment);
      expect(billingService.createPayment).toHaveBeenCalledWith(
        { ...createPaymentDto, invoice_id: 'invoice-123' },
        mockUser.userId
      );
    });

    it('should override invoice_id from URL parameter', async () => {
      jest.spyOn(billingService, 'createPayment').mockResolvedValue(mockPayment as any);

      const dtoWithInvoiceId = {
        ...createPaymentDto,
        invoice_id: 'different-invoice',
      };

      await controller.processPayment('invoice-123', dtoWithInvoiceId, { user: mockUser } as any);

      expect(billingService.createPayment).toHaveBeenCalledWith(
        { ...createPaymentDto, invoice_id: 'invoice-123' },
        mockUser.userId
      );
    });
  });
});

