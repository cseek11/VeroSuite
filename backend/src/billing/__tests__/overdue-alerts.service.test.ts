/**
 * OverdueAlertsService Unit Tests
 * 
 * Tests for OverdueAlertsService including:
 * - Overdue invoice detection
 * - Alert processing with configuration
 * - Email alert sending
 * - Alert statistics
 * - Error handling
 * 
 * Last Updated: 2025-11-18
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OverdueAlertsService } from '../overdue-alerts.service';
import { DatabaseService } from '../../common/services/database.service';
import { StructuredLoggerService } from '../../common/services/logger.service';
import { EmailService } from '../../common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { InvoiceStatus } from '@prisma/client';

describe('OverdueAlertsService', () => {
  let service: OverdueAlertsService;
  let databaseService: jest.Mocked<DatabaseService>;
  let structuredLogger: jest.Mocked<StructuredLoggerService>;
  let emailService: jest.Mocked<EmailService>;
  let configService: jest.Mocked<ConfigService>;

  const mockTenantId = 'test-tenant-id';
  const mockUserId = 'test-user-id';
  const mockInvoiceId = 'test-invoice-id';
  const mockAccountId = 'test-account-id';

  const mockInvoice = {
    id: mockInvoiceId,
    invoice_number: 'INV-001',
    tenant_id: mockTenantId,
    account_id: mockAccountId,
    total_amount: 1000,
    due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: InvoiceStatus.SENT,
    accounts: {
      id: mockAccountId,
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '555-1234',
    },
    Payment: [],
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      invoice: {
        findMany: jest.fn(),
      },
      communicationLog: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const mockStructuredLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      setRequestContext: jest.fn(),
      clearRequestContext: jest.fn(),
      getRequestContext: jest.fn(),
    };

    const mockEmailService = {
      generateInvoiceReminderEmail: jest.fn().mockReturnValue('<html>Email content</html>'),
      sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'msg-123' }),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('reply@example.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OverdueAlertsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: StructuredLoggerService,
          useValue: mockStructuredLogger,
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

    service = module.get<OverdueAlertsService>(OverdueAlertsService);
    databaseService = module.get(DatabaseService);
    structuredLogger = module.get(StructuredLoggerService);
    emailService = module.get(EmailService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverdueInvoices', () => {
    it('should return overdue invoices', async () => {
      const mockInvoices = [
        {
          ...mockInvoice,
          Payment: [],
        },
      ];

      databaseService.invoice.findMany.mockResolvedValue(mockInvoices as any);

      const result = await service.getOverdueInvoices(mockTenantId, 0);

      expect(result).toHaveLength(1);
      expect(result[0].daysPastDue).toBeGreaterThan(0);
      expect(result[0].balanceDue).toBe(1000);
      expect(databaseService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
          due_date: { lt: expect.any(Date) },
        },
        include: expect.any(Object),
        orderBy: { due_date: 'asc' },
      });
    });

    it('should filter by minimum days overdue', async () => {
      const mockInvoices = [
        {
          ...mockInvoice,
          due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          Payment: [],
        },
      ];

      databaseService.invoice.findMany.mockResolvedValue(mockInvoices as any);

      const result = await service.getOverdueInvoices(mockTenantId, 7);

      expect(result).toHaveLength(0); // Should be filtered out (only 5 days overdue)
    });

    it('should calculate balance due correctly', async () => {
      const mockInvoices = [
        {
          ...mockInvoice,
          Payment: [
            { amount: 300 },
            { amount: 200 },
          ],
        },
      ];

      databaseService.invoice.findMany.mockResolvedValue(mockInvoices as any);

      const result = await service.getOverdueInvoices(mockTenantId, 0);

      expect(result[0].balanceDue).toBe(500); // 1000 - 500
    });

    it('should throw BadRequestException on error', async () => {
      databaseService.invoice.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.getOverdueInvoices(mockTenantId)).rejects.toThrow(BadRequestException);
      expect(structuredLogger.error).toHaveBeenCalled();
    });
  });

  describe('processOverdueAlerts', () => {
    beforeEach(() => {
      databaseService.invoice.findMany.mockResolvedValue([mockInvoice] as any);
      databaseService.communicationLog.create.mockResolvedValue({} as any);
      databaseService.user.findUnique.mockResolvedValue({
        first_name: 'Test',
        last_name: 'User',
      } as any);
    });

    it('should process alerts with default configuration', async () => {
      const result = await service.processOverdueAlerts(mockTenantId, undefined, mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].alertSent).toBe(true);
      expect(result[0].alertType).toBe('email');
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should respect disabled configuration', async () => {
      const config = {
        enabled: false,
        alertThresholds: [],
      };

      const result = await service.processOverdueAlerts(mockTenantId, config, mockUserId);

      expect(result).toHaveLength(0);
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should apply escalation rules', async () => {
      const config = {
        enabled: true,
        alertThresholds: [
          { daysOverdue: 1, alertFrequency: 'daily' },
        ],
        escalationRules: [
          { daysOverdue: 30, escalationLevel: 'both' },
        ],
      };

      const oldInvoice = {
        ...mockInvoice,
        due_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      };

      databaseService.invoice.findMany.mockResolvedValue([oldInvoice] as any);

      const result = await service.processOverdueAlerts(mockTenantId, config, mockUserId);

      expect(result[0].alertType).toBe('both');
    });

    it('should handle missing customer email', async () => {
      const invoiceWithoutEmail = {
        ...mockInvoice,
        accounts: {
          ...mockInvoice.accounts,
          email: null,
        },
      };

      databaseService.invoice.findMany.mockResolvedValue([invoiceWithoutEmail] as any);

      const result = await service.processOverdueAlerts(mockTenantId, undefined, mockUserId);

      expect(result[0].alertSent).toBe(false);
      expect(result[0].error).toContain('email');
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should log alert to communication log', async () => {
      await service.processOverdueAlerts(mockTenantId, undefined, mockUserId);

      expect(databaseService.communicationLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenant_id: mockTenantId,
          customer_id: mockAccountId,
          communication_type: 'overdue_alert',
          direction: 'outbound',
        }),
      });
    });

    it('should handle email sending failure', async () => {
      emailService.sendEmail.mockResolvedValue({
        success: false,
        error: 'Email service unavailable',
      });

      const result = await service.processOverdueAlerts(mockTenantId, undefined, mockUserId);

      expect(result[0].alertSent).toBe(false);
      expect(result[0].error).toBeDefined();
    });

    it('should throw BadRequestException on error', async () => {
      databaseService.invoice.findMany.mockRejectedValue(new Error('Database error'));

      await expect(
        service.processOverdueAlerts(mockTenantId, undefined, mockUserId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAlertStatistics', () => {
    it('should return alert statistics', async () => {
      const mockAlerts = [
        {
          message_content: 'Automated overdue alert sent. Days overdue: 15. Alert type: email.',
          timestamp: new Date(),
        },
        {
          message_content: 'Automated overdue alert sent. Days overdue: 45. Alert type: email.',
          timestamp: new Date(),
        },
      ];

      databaseService.communicationLog.findMany.mockResolvedValue(mockAlerts as any);

      const result = await service.getAlertStatistics(mockTenantId);

      expect(result.totalAlerts).toBe(2);
      expect(result.alertsByType.email).toBe(2);
      expect(result.alertsByDaysOverdue['0-30']).toBe(1);
      expect(result.alertsByDaysOverdue['31-60']).toBe(1);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const mockAlerts = [
        {
          message_content: 'Automated overdue alert sent. Days overdue: 15. Alert type: email.',
          timestamp: new Date('2025-01-15'),
        },
      ];

      databaseService.communicationLog.findMany.mockResolvedValue(mockAlerts as any);

      await service.getAlertStatistics(mockTenantId, startDate, endDate);

      expect(databaseService.communicationLog.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        }),
        orderBy: { timestamp: 'desc' },
      });
    });

    it('should throw BadRequestException on error', async () => {
      databaseService.communicationLog.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.getAlertStatistics(mockTenantId)).rejects.toThrow(BadRequestException);
    });
  });
});

