/**
 * Billing Service - Invoice Templates, Schedules, and Reminder History Tests
 * 
 * Regression tests for billing automation API integration
 * Tests all 10 new service methods with comprehensive coverage
 *
 * Date: 2025-11-18
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingService } from '../billing.service';
import { DatabaseService } from '../../common/services/database.service';
import { StripeService } from '../stripe.service';
import { EmailService } from '../../common/services/email.service';
import { StructuredLoggerService } from '../../common/services/logger.service';
import { MetricsService } from '../../common/services/metrics.service';

describe('BillingService - Invoice Templates, Schedules, Reminder History', () => {
  let service: BillingService;
  let databaseService: DatabaseService;
  let structuredLogger: StructuredLoggerService;
  let metricsService: MetricsService;

  const mockTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  const mockUserId = 'cfbcbad5-87d1-4fb0-91c7-761045378104';
  const mockAccountId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const mockTemplateId = 'template-123';
  const mockScheduleId = 'schedule-123';
  const mockInvoiceId = 'invoice-123';

  const mockTemplate = {
    id: mockTemplateId,
    tenant_id: mockTenantId,
    name: 'Monthly Service Template',
    description: 'Template for monthly pest control service',
    items: [
      { description: 'Monthly Service', quantity: 1, unit_price: 150.00 }
    ],
    tags: ['monthly', 'recurring'],
    created_at: new Date(),
    updated_at: new Date(),
    created_by: mockUserId,
    updated_by: mockUserId,
  };

  const mockSchedule = {
    id: mockScheduleId,
    tenant_id: mockTenantId,
    account_id: mockAccountId,
    template_id: mockTemplateId,
    schedule_type: 'recurring',
    frequency: 'monthly',
    start_date: new Date('2025-01-01'),
    end_date: null,
    next_run_date: new Date('2025-01-01'),
    is_active: true,
    amount: null,
    description: 'Monthly invoice schedule',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: mockUserId,
    updated_by: mockUserId,
    account: {
      id: mockAccountId,
      name: 'Test Customer',
      email: 'test@example.com',
    },
  };

  const mockReminder = {
    id: 'reminder-123',
    tenant_id: mockTenantId,
    invoice_id: mockInvoiceId,
    reminder_type: 'email',
    status: 'sent',
    message: 'Payment reminder',
    sent_at: new Date(),
    created_by: mockUserId,
    invoice: {
      invoice_number: 'INV-001',
      account_id: mockAccountId,
      accounts: {
        name: 'Test Customer',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: DatabaseService,
          useValue: {
            invoiceTemplate: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            invoiceSchedule: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            invoiceReminderHistory: {
              findMany: jest.fn(),
            },
            getCurrentTenantId: jest.fn(),
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
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FRONTEND_URL') return 'http://localhost:5173';
              if (key === 'NODE_ENV') return 'test';
              return null;
            }),
          },
        },
        {
          provide: StructuredLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: MetricsService,
          useValue: {
            incrementCounter: jest.fn(),
            recordHistogram: jest.fn(),
            recordGauge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    structuredLogger = module.get<StructuredLoggerService>(StructuredLoggerService);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // INVOICE TEMPLATE TESTS
  // ============================================================================

  describe('createInvoiceTemplate', () => {
    const createDto = {
      name: 'Monthly Service Template',
      description: 'Template for monthly service',
      items: [{ description: 'Service', quantity: 1, unit_price: 150.00 }],
      tags: ['monthly'],
    };

    it('should create invoice template successfully', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.create as jest.Mock).mockResolvedValue(mockTemplate);

      const result = await service.createInvoiceTemplate(createDto, mockUserId, mockTenantId);

      expect(result).toMatchObject({
        id: mockTemplateId,
        name: createDto.name,
        tenant_id: mockTenantId,
      });
      expect(databaseService.invoiceTemplate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenant_id: mockTenantId,
          name: createDto.name,
          created_by: mockUserId,
          updated_by: mockUserId,
        }),
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_template_created',
        expect.any(Object)
      );
    });

    it('should get tenant ID from context if not provided', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.create as jest.Mock).mockResolvedValue(mockTemplate);

      await service.createInvoiceTemplate(createDto, mockUserId);

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
      expect(databaseService.invoiceTemplate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenant_id: mockTenantId,
        }),
      });
    });

    it('should handle database errors', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createInvoiceTemplate(createDto, mockUserId, mockTenantId)
      ).rejects.toThrow(BadRequestException);

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create invoice template'),
        expect.any(String),
        'BillingService',
        undefined,
        'createInvoiceTemplate',
        'TEMPLATE_CREATE_FAILED',
        expect.any(String),
        expect.any(Object)
      );
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_template_create_failed',
        expect.any(Object)
      );
    });

    it('should validate required fields', async () => {
      const invalidDto = { name: '', items: [] };

      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.create as jest.Mock).mockRejectedValue(
        new Error('Validation error')
      );

      await expect(
        service.createInvoiceTemplate(invalidDto as any, mockUserId, mockTenantId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getInvoiceTemplates', () => {
    it('should retrieve all templates for tenant', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.findMany as jest.Mock).mockResolvedValue([mockTemplate]);

      const result = await service.getInvoiceTemplates(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockTemplateId,
        name: mockTemplate.name,
      });
      expect(databaseService.invoiceTemplate.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        orderBy: { created_at: 'desc' },
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.recordHistogram).toHaveBeenCalledWith(
        'billing_templates_fetched',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should get tenant ID from context if not provided', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.findMany as jest.Mock).mockResolvedValue([]);

      await service.getInvoiceTemplates();

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceTemplate.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getInvoiceTemplates(mockTenantId)).rejects.toThrow(
        BadRequestException
      );

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get invoice templates'),
        expect.any(String),
        'BillingService',
        undefined,
        'getInvoiceTemplates',
        'TEMPLATE_FETCH_FAILED',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('updateInvoiceTemplate', () => {
    const updateDto = {
      name: 'Updated Template Name',
      description: 'Updated description',
    };

    it('should update template successfully', async () => {
      const updatedTemplate = { ...mockTemplate, ...updateDto };
      (databaseService.invoiceTemplate.update as jest.Mock).mockResolvedValue(updatedTemplate);

      const result = await service.updateInvoiceTemplate(mockTemplateId, updateDto, mockUserId);

      expect(result.name).toBe(updateDto.name);
      expect(databaseService.invoiceTemplate.update).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
        data: expect.objectContaining({
          name: updateDto.name,
          updated_by: mockUserId,
        }),
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_template_updated',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      (databaseService.invoiceTemplate.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(
        service.updateInvoiceTemplate(mockTemplateId, updateDto, mockUserId)
      ).rejects.toThrow(NotFoundException);

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update invoice template'),
        expect.any(String),
        'BillingService',
        undefined,
        'updateInvoiceTemplate',
        'TEMPLATE_UPDATE_FAILED',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('deleteInvoiceTemplate', () => {
    it('should delete template successfully', async () => {
      (databaseService.invoiceTemplate.delete as jest.Mock).mockResolvedValue(mockTemplate);

      await service.deleteInvoiceTemplate(mockTemplateId);

      expect(databaseService.invoiceTemplate.delete).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_template_deleted',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      (databaseService.invoiceTemplate.delete as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(service.deleteInvoiceTemplate(mockTemplateId)).rejects.toThrow(
        NotFoundException
      );

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to delete invoice template'),
        expect.any(String),
        'BillingService',
        undefined,
        'deleteInvoiceTemplate',
        'TEMPLATE_DELETE_FAILED',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  // ============================================================================
  // INVOICE SCHEDULE TESTS
  // ============================================================================

  describe('createInvoiceSchedule', () => {
    const createDto = {
      account_id: mockAccountId,
      template_id: mockTemplateId,
      schedule_type: 'recurring',
      frequency: 'monthly',
      start_date: '2025-01-01',
      is_active: true,
    };

    it('should create invoice schedule successfully', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceSchedule.create as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await service.createInvoiceSchedule(createDto, mockUserId, mockTenantId);

      expect(result).toMatchObject({
        id: mockScheduleId,
        account_id: mockAccountId,
        schedule_type: 'recurring',
      });
      expect(databaseService.invoiceSchedule.create).toHaveBeenCalled();
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_schedule_created',
        expect.any(Object)
      );
    });

    it('should calculate next_run_date for recurring schedules', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceSchedule.create as jest.Mock).mockResolvedValue(mockSchedule);

      await service.createInvoiceSchedule(createDto, mockUserId, mockTenantId);

      const createCall = (databaseService.invoiceSchedule.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.next_run_date).toBeInstanceOf(Date);
    });

    it('should handle database errors', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceSchedule.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createInvoiceSchedule(createDto, mockUserId, mockTenantId)
      ).rejects.toThrow(BadRequestException);

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create invoice schedule'),
        expect.any(String),
        'BillingService',
        undefined,
        'createInvoiceSchedule',
        'SCHEDULE_CREATE_FAILED',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('getInvoiceSchedules', () => {
    it('should retrieve all schedules for tenant', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceSchedule.findMany as jest.Mock).mockResolvedValue([mockSchedule]);

      const result = await service.getInvoiceSchedules(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockScheduleId,
        account_id: mockAccountId,
      });
      expect(databaseService.invoiceSchedule.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        include: expect.any(Object),
        orderBy: { next_run_date: 'asc' },
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.recordHistogram).toHaveBeenCalledWith(
        'billing_schedules_fetched',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should handle database errors', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceSchedule.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getInvoiceSchedules(mockTenantId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('updateInvoiceSchedule', () => {
    const updateDto = {
      frequency: 'weekly',
      is_active: false,
    };

    it('should update schedule successfully', async () => {
      const updatedSchedule = { ...mockSchedule, ...updateDto };
      (databaseService.invoiceSchedule.update as jest.Mock).mockResolvedValue(updatedSchedule);

      const result = await service.updateInvoiceSchedule(mockScheduleId, updateDto, mockUserId);

      expect(result.frequency).toBe(updateDto.frequency);
      expect(databaseService.invoiceSchedule.update).toHaveBeenCalled();
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_schedule_updated',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (databaseService.invoiceSchedule.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(
        service.updateInvoiceSchedule(mockScheduleId, updateDto, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteInvoiceSchedule', () => {
    it('should delete schedule successfully', async () => {
      (databaseService.invoiceSchedule.delete as jest.Mock).mockResolvedValue(mockSchedule);

      await service.deleteInvoiceSchedule(mockScheduleId);

      expect(databaseService.invoiceSchedule.delete).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_schedule_deleted',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (databaseService.invoiceSchedule.delete as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(service.deleteInvoiceSchedule(mockScheduleId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('toggleInvoiceSchedule', () => {
    it('should toggle schedule active status', async () => {
      const inactiveSchedule = { ...mockSchedule, is_active: false };
      (databaseService.invoiceSchedule.findUnique as jest.Mock).mockResolvedValue(mockSchedule);
      (databaseService.invoiceSchedule.update as jest.Mock).mockResolvedValue(inactiveSchedule);

      const result = await service.toggleInvoiceSchedule(mockScheduleId, mockUserId);

      expect(result.is_active).toBe(false);
      expect(databaseService.invoiceSchedule.update).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
        data: {
          is_active: false,
          updated_by: mockUserId,
          updated_at: expect.any(Date),
        },
        include: expect.any(Object),
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.incrementCounter).toHaveBeenCalledWith(
        'billing_schedule_toggled',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (databaseService.invoiceSchedule.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.toggleInvoiceSchedule(mockScheduleId, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================================================
  // REMINDER HISTORY TESTS
  // ============================================================================

  describe('getReminderHistory', () => {
    it('should retrieve reminder history for tenant', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceReminderHistory.findMany as jest.Mock).mockResolvedValue([
        mockReminder,
      ]);

      const result = await service.getReminderHistory(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        invoice_id: mockInvoiceId,
        reminder_type: 'email',
        status: 'sent',
      });
      expect(databaseService.invoiceReminderHistory.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        include: expect.any(Object),
        orderBy: { sent_at: 'desc' },
      });
      expect(structuredLogger.log).toHaveBeenCalled();
      expect(metricsService.recordHistogram).toHaveBeenCalledWith(
        'billing_reminders_fetched',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should get tenant ID from context if not provided', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceReminderHistory.findMany as jest.Mock).mockResolvedValue([]);

      await service.getReminderHistory();

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(mockTenantId);
      (databaseService.invoiceReminderHistory.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getReminderHistory(mockTenantId)).rejects.toThrow(
        BadRequestException
      );

      expect(structuredLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get reminder history'),
        expect.any(String),
        'BillingService',
        undefined,
        'getReminderHistory',
        'REMINDER_HISTORY_FETCH_FAILED',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  // ============================================================================
  // TENANT ISOLATION TESTS
  // ============================================================================

  describe('Tenant Isolation', () => {
    const otherTenantId = 'other-tenant-id';

    it('should only retrieve templates for specified tenant', async () => {
      (databaseService.invoiceTemplate.findMany as jest.Mock).mockResolvedValue([mockTemplate]);

      await service.getInvoiceTemplates(mockTenantId);

      expect(databaseService.invoiceTemplate.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        orderBy: expect.any(Object),
      });
    });

    it('should only retrieve schedules for specified tenant', async () => {
      (databaseService.invoiceSchedule.findMany as jest.Mock).mockResolvedValue([mockSchedule]);

      await service.getInvoiceSchedules(mockTenantId);

      expect(databaseService.invoiceSchedule.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });

    it('should only retrieve reminders for specified tenant', async () => {
      (databaseService.invoiceReminderHistory.findMany as jest.Mock).mockResolvedValue([
        mockReminder,
      ]);

      await service.getReminderHistory(mockTenantId);

      expect(databaseService.invoiceReminderHistory.findMany).toHaveBeenCalledWith({
        where: { tenant_id: mockTenantId },
        include: expect.any(Object),
        orderBy: expect.any(Object),
      });
    });
  });
});

