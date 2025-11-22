/**
 * Billing Service Tenant Context Tests
 * 
 * Regression tests for TENANT_CONTEXT_NOT_FOUND pattern
 * Tests verify that service methods require tenantId parameter
 * and don't rely on getCurrentTenantId() which fails with connection pooling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from '../billing.service';
import { DatabaseService } from '../../common/services/database.service';
import { StripeService } from '../stripe.service';
import { EmailService } from '../../common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('BillingService - Tenant Context (Regression Tests)', () => {
  let service: BillingService;
  let databaseService: DatabaseService;

  const mockTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  const mockAccountId = 'cfbcbad5-87d1-4fb0-91c7-761045378104';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: DatabaseService,
          useValue: {
            invoice: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            paymentMethod: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            getCurrentTenantId: jest.fn().mockResolvedValue(null), // Simulate connection pooling issue
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
            getSubscription: jest.fn(),
          },
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
  });

  describe('getInvoices - Tenant Context', () => {
    it('should require tenantId parameter and not call getCurrentTenantId()', async () => {
      // getCurrentTenantId returns null (simulating connection pooling issue)
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getInvoices(mockAccountId, undefined, undefined) // No tenantId provided
      ).rejects.toThrow(BadRequestException);

      expect(databaseService.getCurrentTenantId).not.toHaveBeenCalled();
    });

    it('should work correctly when tenantId is provided', async () => {
      (databaseService.invoice.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getInvoices(mockAccountId, undefined, mockTenantId);

      expect(result).toEqual([]);
      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: mockAccountId,
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
      // Should not call getCurrentTenantId when tenantId is provided
      expect(databaseService.getCurrentTenantId).not.toHaveBeenCalled();
    });

    it('should throw clear error message when tenantId is missing', async () => {
      await expect(
        service.getInvoices(mockAccountId, undefined, undefined)
      ).rejects.toThrow('Tenant ID is required but not found');
    });
  });

  describe('getPaymentMethods - Tenant Context', () => {
    it('should require tenantId parameter and not call getCurrentTenantId()', async () => {
      // getCurrentTenantId returns null (simulating connection pooling issue)
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getPaymentMethods(mockAccountId, undefined) // No tenantId provided
      ).rejects.toThrow(BadRequestException);

      expect(databaseService.getCurrentTenantId).not.toHaveBeenCalled();
    });

    it('should work correctly when tenantId is provided', async () => {
      (databaseService.paymentMethod.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getPaymentMethods(mockAccountId, mockTenantId);

      expect(result).toEqual([]);
      expect(databaseService.paymentMethod.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          account_id: mockAccountId,
          is_active: true,
        },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
      // Should not call getCurrentTenantId when tenantId is provided
      expect(databaseService.getCurrentTenantId).not.toHaveBeenCalled();
    });

    it('should throw clear error message when tenantId is missing', async () => {
      await expect(
        service.getPaymentMethods(mockAccountId, undefined)
      ).rejects.toThrow('Tenant ID is required but not found');
    });
  });
});

