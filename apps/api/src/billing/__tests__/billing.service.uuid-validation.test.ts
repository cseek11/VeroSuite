/**
 * Billing Service UUID Validation Tests
 * 
 * Regression tests for INVALID_UUID_FORMAT pattern
 * Tests verify that service methods validate and clean UUID format
 * before using in database queries
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from '../billing.service';
import { DatabaseService } from '../../common/services/database.service';
import { StripeService } from '../stripe.service';
import { EmailService } from '../../common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('BillingService - UUID Validation (Regression Tests)', () => {
  let service: BillingService;
  let databaseService: DatabaseService;
  let loggerSpy: jest.SpyInstance;

  const mockTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  const validAccountId = 'cfbcbad5-87d1-4fb0-91c7-761045378104';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: DatabaseService,
          useValue: {
            invoice: {
              findMany: jest.fn(),
            },
            paymentMethod: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: StripeService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
            sendInvoiceEmail: jest.fn(),
            generateInvoiceReminderEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FRONTEND_URL') return 'http://localhost:5173';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    
    // Spy on logger
    loggerSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  describe('getInvoices - UUID Validation', () => {
    it('should clean UUID with leading colon and trailing brace', async () => {
      const malformedAccountId = ':cfbcbad5-87d1-4fb0-91c7-761045378104}';
      (databaseService.invoice.findMany as jest.Mock).mockResolvedValue([]);

      await service.getInvoices(malformedAccountId, undefined, mockTenantId);

      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: validAccountId, // Should be cleaned
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });

    it('should skip account filter for invalid UUID format', async () => {
      const invalidAccountId = 'not-a-uuid';
      (databaseService.invoice.findMany as jest.Mock).mockResolvedValue([]);

      await service.getInvoices(invalidAccountId, undefined, mockTenantId);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid accountId format after cleaning')
      );
      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          // account_id should not be in where clause
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
      expect(databaseService.invoice.findMany).not.toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            account_id: invalidAccountId,
          }),
        })
      );
    });

    it('should handle valid UUID correctly', async () => {
      (databaseService.invoice.findMany as jest.Mock).mockResolvedValue([]);

      await service.getInvoices(validAccountId, undefined, mockTenantId);

      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: validAccountId,
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
      expect(loggerSpy).not.toHaveBeenCalled();
    });

    it('should trim whitespace from UUID', async () => {
      const accountIdWithSpaces = '  cfbcbad5-87d1-4fb0-91c7-761045378104  ';
      (databaseService.invoice.findMany as jest.Mock).mockResolvedValue([]);

      await service.getInvoices(accountIdWithSpaces, undefined, mockTenantId);

      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: validAccountId, // Should be trimmed
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });
  });

  describe('getPaymentMethods - UUID Validation', () => {
    it('should clean UUID with leading colon and trailing brace', async () => {
      const malformedAccountId = ':cfbcbad5-87d1-4fb0-91c7-761045378104}';
      (databaseService.paymentMethod.findMany as jest.Mock).mockResolvedValue([]);

      await service.getPaymentMethods(malformedAccountId, mockTenantId);

      expect(databaseService.paymentMethod.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: validAccountId, // Should be cleaned
          is_active: true,
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });

    it('should skip account filter for invalid UUID format', async () => {
      const invalidAccountId = 'not-a-uuid';
      (databaseService.paymentMethod.findMany as jest.Mock).mockResolvedValue([]);

      await service.getPaymentMethods(invalidAccountId, mockTenantId);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid accountId format after cleaning')
      );
      expect(databaseService.paymentMethod.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          is_active: true,
          // account_id should not be in where clause
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });

    it('should handle valid UUID correctly', async () => {
      (databaseService.paymentMethod.findMany as jest.Mock).mockResolvedValue([]);

      await service.getPaymentMethods(validAccountId, mockTenantId);

      expect(databaseService.paymentMethod.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: validAccountId,
          is_active: true,
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});

