/**
 * Work Orders Service Unit Tests
 * Tests for work order creation, status management, and assignment logic
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrdersService } from '../../../src/work-orders/work-orders.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { AuditService } from '../../../src/common/services/audit.service';
import { WorkOrderStatus, WorkOrderPriority } from '../../../src/work-orders/dto';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;
  let databaseService: DatabaseService;
  let auditService: AuditService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockCustomerId = 'customer-123';
  const mockTechnicianId = 'technician-123';
  const mockWorkOrderId = 'work-order-123';

  const mockCustomer = {
    id: mockCustomerId,
    tenant_id: mockTenantId,
    name: 'Test Customer',
    email: 'customer@example.com',
    address: '123 Main St',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
  };

  const mockTechnician = {
    id: mockTechnicianId,
    tenant_id: mockTenantId,
    email: 'technician@example.com',
    first_name: 'Test',
    last_name: 'Technician',
  };

  const mockWorkOrder = {
    id: mockWorkOrderId,
    tenant_id: mockTenantId,
    customer_id: mockCustomerId,
    account_id: mockCustomerId,
    assigned_to: mockTechnicianId,
    status: WorkOrderStatus.PENDING,
    priority: WorkOrderPriority.MEDIUM,
    scheduled_date: new Date(),
    description: 'Test work order',
    location: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        {
          provide: DatabaseService,
          useValue: {
            account: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
            },
            location: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            workOrder: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            job: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    auditService = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkOrder', () => {
    const createWorkOrderDto = {
      customer_id: mockCustomerId,
      description: 'Test work order',
      service_type: 'Pest Control',
      priority: WorkOrderPriority.HIGH,
    };

    it('should create work order successfully', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.location, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue(mockWorkOrder),
            update: jest.fn(),
          },
          location: {
            create: jest.fn().mockResolvedValue({ id: 'location-123' }),
          },
          job: {
            create: jest.fn(),
          },
        };
        return await callback(mockTx);
      });

      const result = await service.createWorkOrder(createWorkOrderDto, mockTenantId, mockUserId);

      expect(result).toBeDefined();
      expect(databaseService.account.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockCustomerId,
            tenant_id: mockTenantId,
          },
        })
      );
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer not found', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(null);

      await expect(service.createWorkOrder(createWorkOrderDto, mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createWorkOrder(createWorkOrderDto, mockTenantId, mockUserId)).rejects.toThrow(
        'Customer not found'
      );
    });

    it('should throw NotFoundException when assigned technician not found', async () => {
      const dtoWithTechnician = {
        ...createWorkOrderDto,
        assigned_to: mockTechnicianId,
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.createWorkOrder(dtoWithTechnician, mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createWorkOrder(dtoWithTechnician, mockTenantId, mockUserId)).rejects.toThrow(
        'Assigned technician not found'
      );
    });

    it('should throw BadRequestException when scheduled date is in past', async () => {
      const dtoWithPastDate = {
        ...createWorkOrderDto,
        scheduled_date: new Date('2020-01-01').toISOString(),
      };

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);

      await expect(service.createWorkOrder(dtoWithPastDate, mockTenantId, mockUserId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createWorkOrder(dtoWithPastDate, mockTenantId, mockUserId)).rejects.toThrow(
        'Scheduled date cannot be in the past'
      );
    });

    it('should auto-create job when scheduled date provided', async () => {
      const dtoWithSchedule = {
        ...createWorkOrderDto,
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        estimated_duration: 120,
      };

      const mockLocation = { id: 'location-123' };
      let jobCreated = false;

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.location, 'findFirst').mockResolvedValue(mockLocation as any);
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue({
              ...mockWorkOrder,
              location_id: mockLocation.id,
              estimated_duration: 120,
            }),
            update: jest.fn(),
          },
          location: {
            create: jest.fn(),
          },
          job: {
            create: jest.fn().mockImplementation(() => {
              jobCreated = true;
              return Promise.resolve({ id: 'job-123' });
            }),
          },
        };
        return await callback(mockTx);
      });

      await service.createWorkOrder(dtoWithSchedule, mockTenantId, mockUserId);

      expect(jobCreated).toBe(true);
    });

    it('should create default location when none exists', async () => {
      const dtoWithSchedule = {
        ...createWorkOrderDto,
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      let locationCreated = false;

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.location, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue({
              ...mockWorkOrder,
              location_id: null,
            }),
            update: jest.fn(),
          },
          location: {
            create: jest.fn().mockImplementation(() => {
              locationCreated = true;
              return Promise.resolve({ id: 'new-location-123' });
            }),
          },
          job: {
            create: jest.fn(),
          },
        };
        return await callback(mockTx);
      });

      await service.createWorkOrder(dtoWithSchedule, mockTenantId, mockUserId);

      expect(locationCreated).toBe(true);
    });
  });

  describe('getWorkOrderById', () => {
    it('should return work order by ID', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);

      const result = await service.getWorkOrderById(mockWorkOrderId, mockTenantId);

      expect(result).toBeDefined();
      expect(result.customer_name).toBe('Test Customer');
      expect(result.customer_email).toBe('customer@example.com');
      expect(databaseService.workOrder.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockWorkOrderId,
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when work order not found', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(null);

      await expect(service.getWorkOrderById('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getWorkOrderById('non-existent', mockTenantId)).rejects.toThrow(
        'Work order not found'
      );
    });

    it('should handle missing customer gracefully', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(null);

      const result = await service.getWorkOrderById(mockWorkOrderId, mockTenantId);

      expect(result.customer_name).toBe('Unknown Customer');
    });
  });

  describe('listWorkOrders', () => {
    it('should return paginated work orders', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([mockWorkOrder] as any);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(1);
      jest.spyOn(databaseService.account, 'findMany').mockResolvedValue([mockCustomer] as any);

      const filters = {
        page: 1,
        limit: 20,
      };

      const result = await service.listWorkOrders(filters, mockTenantId);

      expect(result.data).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should filter by status', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(0);
      jest.spyOn(databaseService.account, 'findMany').mockResolvedValue([]);

      const filters = {
        status: WorkOrderStatus.PENDING,
      };

      await service.listWorkOrders(filters, mockTenantId);

      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: WorkOrderStatus.PENDING,
          }),
        })
      );
    });

    it('should filter by priority', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(0);
      jest.spyOn(databaseService.account, 'findMany').mockResolvedValue([]);

      const filters = {
        priority: WorkOrderPriority.HIGH,
      };

      await service.listWorkOrders(filters, mockTenantId);

      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priority: WorkOrderPriority.HIGH,
          }),
        })
      );
    });

    it('should filter by date range', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(0);
      jest.spyOn(databaseService.account, 'findMany').mockResolvedValue([]);

      const filters = {
        start_date: '2025-01-01',
        end_date: '2025-01-31',
      };

      await service.listWorkOrders(filters, mockTenantId);

      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            scheduled_date: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      );
    });

    it('should enrich work orders with customer info', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([mockWorkOrder] as any);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(1);
      jest.spyOn(databaseService.account, 'findMany').mockResolvedValue([mockCustomer] as any);

      const result = await service.listWorkOrders({}, mockTenantId);

      expect(result.data[0].customer_name).toBe('Test Customer');
      expect(result.data[0].customer_email).toBe('customer@example.com');
    });
  });

  describe('updateWorkOrder', () => {
    const updateWorkOrderDto = {
      status: WorkOrderStatus.IN_PROGRESS,
      priority: WorkOrderPriority.HIGH,
    };

    it('should update work order successfully', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue({
        ...mockWorkOrder,
        ...updateWorkOrderDto,
      } as any);

      const result = await service.updateWorkOrder(mockWorkOrderId, updateWorkOrderDto, mockTenantId, mockUserId);

      expect(result.status).toBe(WorkOrderStatus.IN_PROGRESS);
      expect(result.priority).toBe(WorkOrderPriority.HIGH);
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'updated',
          resourceType: 'work_order',
        })
      );
    });

    it('should throw NotFoundException when work order not found', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(null);

      await expect(service.updateWorkOrder(mockWorkOrderId, updateWorkOrderDto, mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should validate customer when updated', async () => {
      const updateWithCustomer = {
        customer_id: 'new-customer-id',
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithCustomer, mockTenantId, mockUserId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithCustomer, mockTenantId, mockUserId)
      ).rejects.toThrow('Customer not found');
    });

    it('should validate technician when updated', async () => {
      const updateWithTechnician = {
        assigned_to: 'new-technician-id',
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithTechnician, mockTenantId, mockUserId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithTechnician, mockTenantId, mockUserId)
      ).rejects.toThrow('Assigned technician not found');
    });

    it('should throw BadRequestException when scheduled date is in past', async () => {
      const updateWithPastDate = {
        scheduled_date: new Date('2020-01-01').toISOString(),
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);

      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithPastDate, mockTenantId, mockUserId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when completion date set without completed status', async () => {
      const updateWithCompletionDate = {
        completion_date: new Date().toISOString(),
        status: WorkOrderStatus.PENDING,
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);

      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithCompletionDate, mockTenantId, mockUserId)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateWorkOrder(mockWorkOrderId, updateWithCompletionDate, mockTenantId, mockUserId)
      ).rejects.toThrow('Completion date can only be set when status is completed');
    });
  });

  describe('deleteWorkOrder', () => {
    it('should soft delete work order', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue({
        ...mockWorkOrder,
        status: WorkOrderStatus.CANCELED,
      } as any);

      const result = await service.deleteWorkOrder(mockWorkOrderId, mockTenantId, mockUserId);

      expect(result).toHaveProperty('message', 'Work order deleted successfully');
      expect(databaseService.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockWorkOrderId },
          data: expect.objectContaining({
            status: WorkOrderStatus.CANCELED,
          }),
        })
      );
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'deleted',
          resourceType: 'work_order',
        })
      );
    });

    it('should throw NotFoundException when work order not found', async () => {
      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(null);

      await expect(service.deleteWorkOrder('non-existent', mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getWorkOrdersByCustomer', () => {
    it('should return work orders for customer', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([mockWorkOrder] as any);

      const result = await service.getWorkOrdersByCustomer(mockCustomerId, mockTenantId);

      expect(result).toHaveLength(1);
      expect(databaseService.account.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockCustomerId,
            tenant_id: mockTenantId,
          },
        })
      );
      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            customer_id: mockCustomerId,
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(null);

      await expect(service.getWorkOrdersByCustomer('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getWorkOrdersByCustomer('non-existent', mockTenantId)).rejects.toThrow(
        'Customer not found'
      );
    });
  });

  describe('getWorkOrdersByTechnician', () => {
    it('should return work orders for technician', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockTechnician as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([mockWorkOrder] as any);

      const result = await service.getWorkOrdersByTechnician(mockTechnicianId, mockTenantId);

      expect(result).toHaveLength(1);
      expect(databaseService.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockTechnicianId,
            tenant_id: mockTenantId,
          },
        })
      );
      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            assigned_to: mockTechnicianId,
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when technician not found', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.getWorkOrdersByTechnician('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getWorkOrdersByTechnician('non-existent', mockTenantId)).rejects.toThrow(
        'Technician not found'
      );
    });
  });

  // Additional edge case tests for improved coverage

  describe('createWorkOrder - edge cases', () => {
    const createWorkOrderDto = {
      customer_id: mockCustomerId,
      description: 'Test work order',
      service_type: 'Pest Control',
      priority: WorkOrderPriority.HIGH,
    };

    it('should handle audit logging failure gracefully', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.location, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue(mockWorkOrder),
            update: jest.fn(),
          },
          location: {
            create: jest.fn(),
          },
          job: {
            create: jest.fn(),
          },
        };
        return await callback(mockTx);
      });
      jest.spyOn(auditService, 'log').mockRejectedValue(new Error('Audit service unavailable'));

      // Should not throw even if audit fails
      const result = await service.createWorkOrder(createWorkOrderDto, mockTenantId, mockUserId);
      expect(result).toBeDefined();
    });

    it('should handle location lookup failure gracefully', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.location, 'findFirst').mockRejectedValue(new Error('Location table unavailable'));
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue(mockWorkOrder),
            update: jest.fn(),
          },
          location: {
            create: jest.fn(),
          },
          job: {
            create: jest.fn(),
          },
        };
        return await callback(mockTx);
      });

      const result = await service.createWorkOrder(createWorkOrderDto, mockTenantId, mockUserId);
      expect(result).toBeDefined();
    });

    it('should skip job creation when no location available', async () => {
      const dtoWithSchedule = {
        ...createWorkOrderDto,
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const customerWithoutAddress = {
        ...mockCustomer,
        address: null,
        city: null,
        state: null,
      };

      let jobCreated = false;

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(customerWithoutAddress as any);
      jest.spyOn(databaseService.location, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          workOrder: {
            create: jest.fn().mockResolvedValue({
              ...mockWorkOrder,
              location_id: null,
            }),
            update: jest.fn(),
          },
          location: {
            create: jest.fn(),
          },
          job: {
            create: jest.fn().mockImplementation(() => {
              jobCreated = true;
              return Promise.resolve({ id: 'job-123' });
            }),
          },
        };
        return await callback(mockTx);
      });

      await service.createWorkOrder(dtoWithSchedule, mockTenantId, mockUserId);

      // Job should not be created when no location is available
      expect(jobCreated).toBe(false);
    });
  });

  describe('listWorkOrders - edge cases', () => {
    it('should handle empty results', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(0);

      const result = await service.listWorkOrders({}, mockTenantId);

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should handle multiple filter combinations', async () => {
      const filters = {
        status: WorkOrderStatus.PENDING,
        priority: WorkOrderPriority.HIGH,
        assigned_to: mockTechnicianId,
        customer_id: mockCustomerId,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        page: 2,
        limit: 10,
      };

      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(0);

      await service.listWorkOrders(filters, mockTenantId);

      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: WorkOrderStatus.PENDING,
            priority: WorkOrderPriority.HIGH,
            assigned_to: mockTechnicianId,
            customer_id: mockCustomerId,
            scheduled_date: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
          skip: 10, // (page - 1) * limit
          take: 10,
        })
      );
    });

    it('should handle pagination edge cases', async () => {
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'count').mockResolvedValue(25);

      const result = await service.listWorkOrders({ page: 3, limit: 10 }, mockTenantId);

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3); // Math.ceil(25/10)
    });
  });

  describe('updateWorkOrder - edge cases', () => {
    it('should handle partial updates', async () => {
      const partialUpdate = {
        description: 'Updated description only',
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue({
        ...mockWorkOrder,
        ...partialUpdate,
      } as any);

      const result = await service.updateWorkOrder(mockWorkOrderId, partialUpdate, mockTenantId);

      expect(result.description).toBe('Updated description only');
      expect(databaseService.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: 'Updated description only',
            special_instructions: 'Updated description only', // Should sync legacy field
          }),
        })
      );
    });

    it('should handle status transition to completed with completion date', async () => {
      const updateData = {
        status: WorkOrderStatus.COMPLETED,
        completion_date: new Date().toISOString(),
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue({
        ...mockWorkOrder,
        ...updateData,
      } as any);

      const result = await service.updateWorkOrder(mockWorkOrderId, updateData, mockTenantId);

      expect(result.status).toBe(WorkOrderStatus.COMPLETED);
      expect(result.completion_date).toBeDefined();
    });

    it('should sync account_id when customer_id is updated', async () => {
      const updateData = {
        customer_id: 'new-customer-123',
      };

      const newCustomer = {
        ...mockCustomer,
        id: 'new-customer-123',
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(mockWorkOrder as any);
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(newCustomer as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue({
        ...mockWorkOrder,
        customer_id: 'new-customer-123',
        account_id: 'new-customer-123',
      } as any);

      await service.updateWorkOrder(mockWorkOrderId, updateData, mockTenantId);

      expect(databaseService.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customer_id: 'new-customer-123',
            account_id: 'new-customer-123', // Should sync
          }),
        })
      );
    });
  });

  describe('deleteWorkOrder - edge cases', () => {
    it('should handle already canceled work order', async () => {
      const canceledWorkOrder = {
        ...mockWorkOrder,
        status: WorkOrderStatus.CANCELED,
      };

      jest.spyOn(databaseService.workOrder, 'findFirst').mockResolvedValue(canceledWorkOrder as any);
      jest.spyOn(databaseService.workOrder, 'update').mockResolvedValue(canceledWorkOrder as any);

      const result = await service.deleteWorkOrder(mockWorkOrderId, mockTenantId);

      expect(result.message).toBe('Work order deleted successfully');
      expect(databaseService.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: WorkOrderStatus.CANCELED,
          }),
        })
      );
    });
  });

  describe('getWorkOrdersByCustomer - edge cases', () => {
    it('should return empty array when customer has no work orders', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);

      const result = await service.getWorkOrdersByCustomer(mockCustomerId, mockTenantId);

      expect(result).toEqual([]);
    });

    it('should order results correctly', async () => {
      const workOrders = [
        { ...mockWorkOrder, id: 'wo-1', priority: WorkOrderPriority.LOW, scheduled_date: new Date('2025-01-15') },
        { ...mockWorkOrder, id: 'wo-2', priority: WorkOrderPriority.HIGH, scheduled_date: new Date('2025-01-10') },
        { ...mockWorkOrder, id: 'wo-3', priority: WorkOrderPriority.MEDIUM, scheduled_date: new Date('2025-01-20') },
      ];

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockCustomer as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue(workOrders as any);

      await service.getWorkOrdersByCustomer(mockCustomerId, mockTenantId);

      expect(databaseService.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [
            { priority: 'desc' },
            { scheduled_date: 'asc' },
            { created_at: 'desc' },
          ],
        })
      );
    });
  });

  describe('getWorkOrdersByTechnician - edge cases', () => {
    it('should return empty array when technician has no work orders', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockTechnician as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);

      const result = await service.getWorkOrdersByTechnician(mockTechnicianId, mockTenantId);

      expect(result).toEqual([]);
    });
  });
});

