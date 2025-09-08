import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrdersService } from './work-orders.service';
import { DatabaseService } from '../common/services/database.service';
import { AuditService } from '../common/services/audit.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderStatus, WorkOrderPriority } from './dto';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;

  const mockDatabaseService = {
    account: {
      findFirst: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
    workOrder: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  const mockWorkOrder = {
    id: 'wo-123',
    tenant_id: 'tenant-123',
    customer_id: 'customer-123',
    assigned_to: 'tech-123',
    status: WorkOrderStatus.PENDING,
    priority: WorkOrderPriority.MEDIUM,
    scheduled_date: new Date('2025-01-15T10:00:00Z'),
    description: 'Test work order',
    notes: 'Test notes',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCustomer = {
    id: 'customer-123',
    name: 'Test Customer',
    tenant_id: 'tenant-123',
  };

  const mockTechnician = {
    id: 'tech-123',
    first_name: 'John',
    last_name: 'Doe',
    tenant_id: 'tenant-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkOrder', () => {
    it('should create work order successfully', async () => {
      const createData = {
        customer_id: 'customer-123',
        assigned_to: 'tech-123',
        status: WorkOrderStatus.PENDING,
        priority: WorkOrderPriority.MEDIUM,
        description: 'Test work order',
        notes: 'Test notes',
      };

      mockDatabaseService.account.findFirst.mockResolvedValue(mockCustomer);
      mockDatabaseService.user.findFirst.mockResolvedValue(mockTechnician);
      mockDatabaseService.workOrder.create.mockResolvedValue(mockWorkOrder);
      mockAuditService.log.mockResolvedValue(undefined);

      const result = await service.createWorkOrder(createData, 'tenant-123', 'user-123');

      expect(result).toEqual(mockWorkOrder);
      expect(mockDatabaseService.account.findFirst).toHaveBeenCalledWith({
        where: { id: 'customer-123', tenant_id: 'tenant-123' },
      });
      expect(mockDatabaseService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'tech-123', tenant_id: 'tenant-123' },
      });
      expect(mockDatabaseService.workOrder.create).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer not found', async () => {
      const createData = {
        customer_id: 'nonexistent-customer',
        description: 'Test work order',
      };

      mockDatabaseService.account.findFirst.mockResolvedValue(null);

      await expect(service.createWorkOrder(createData, 'tenant-123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when technician not found', async () => {
      const createData = {
        customer_id: 'customer-123',
        assigned_to: 'nonexistent-tech',
        description: 'Test work order',
      };

      mockDatabaseService.account.findFirst.mockResolvedValue(mockCustomer);
      mockDatabaseService.user.findFirst.mockResolvedValue(null);

      await expect(service.createWorkOrder(createData, 'tenant-123')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when scheduled date is in the past', async () => {
      const createData = {
        customer_id: 'customer-123',
        scheduled_date: '2020-01-01T10:00:00Z',
        description: 'Test work order',
      };

      mockDatabaseService.account.findFirst.mockResolvedValue(mockCustomer);

      await expect(service.createWorkOrder(createData, 'tenant-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getWorkOrderById', () => {
    it('should return work order when found', async () => {
      mockDatabaseService.workOrder.findFirst.mockResolvedValue(mockWorkOrder);

      const result = await service.getWorkOrderById('wo-123', 'tenant-123');

      expect(result).toEqual(mockWorkOrder);
      expect(mockDatabaseService.workOrder.findFirst).toHaveBeenCalledWith({
        where: { id: 'wo-123', tenant_id: 'tenant-123' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when work order not found', async () => {
      mockDatabaseService.workOrder.findFirst.mockResolvedValue(null);

      await expect(service.getWorkOrderById('nonexistent-wo', 'tenant-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listWorkOrders', () => {
    it('should return paginated work orders', async () => {
      const filters = {
        page: 1,
        limit: 20,
      };

      mockDatabaseService.workOrder.findMany.mockResolvedValue([mockWorkOrder]);
      mockDatabaseService.workOrder.count.mockResolvedValue(1);

      const result = await service.listWorkOrders(filters, 'tenant-123');

      expect(result).toEqual({
        data: [mockWorkOrder],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should apply filters correctly', async () => {
      const filters = {
        status: WorkOrderStatus.PENDING,
        priority: WorkOrderPriority.HIGH,
        assigned_to: 'tech-123',
        customer_id: 'customer-123',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
      };

      mockDatabaseService.workOrder.findMany.mockResolvedValue([]);
      mockDatabaseService.workOrder.count.mockResolvedValue(0);

      await service.listWorkOrders(filters, 'tenant-123');

      expect(mockDatabaseService.workOrder.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          tenant_id: 'tenant-123',
          status: WorkOrderStatus.PENDING,
          priority: WorkOrderPriority.HIGH,
          assigned_to: 'tech-123',
          customer_id: 'customer-123',
          scheduled_date: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        }),
        include: expect.any(Object),
        orderBy: expect.any(Array),
        skip: 0,
        take: 20,
      });
    });
  });

  describe('updateWorkOrder', () => {
    it('should update work order successfully', async () => {
      const updateData = {
        status: WorkOrderStatus.IN_PROGRESS,
        notes: 'Updated notes',
      };

      mockDatabaseService.workOrder.findFirst.mockResolvedValue(mockWorkOrder);
      mockDatabaseService.workOrder.update.mockResolvedValue({
        ...mockWorkOrder,
        ...updateData,
      });
      mockAuditService.log.mockResolvedValue(undefined);

      const result = await service.updateWorkOrder('wo-123', updateData, 'tenant-123', 'user-123');

      expect(result).toEqual({
        ...mockWorkOrder,
        ...updateData,
      });
      expect(mockDatabaseService.workOrder.update).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException when work order not found', async () => {
      const updateData = { status: WorkOrderStatus.COMPLETED };

      mockDatabaseService.workOrder.findFirst.mockResolvedValue(null);

      await expect(service.updateWorkOrder('nonexistent-wo', updateData, 'tenant-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteWorkOrder', () => {
    it('should soft delete work order successfully', async () => {
      mockDatabaseService.workOrder.findFirst.mockResolvedValue({
        ...mockWorkOrder,
        jobs: [],
      });
      mockDatabaseService.workOrder.update.mockResolvedValue(mockWorkOrder);
      mockAuditService.log.mockResolvedValue(undefined);

      const result = await service.deleteWorkOrder('wo-123', 'tenant-123', 'user-123');

      expect(result).toEqual({ message: 'Work order deleted successfully' });
      expect(mockDatabaseService.workOrder.update).toHaveBeenCalledWith({
        where: { id: 'wo-123' },
        data: {
          status: WorkOrderStatus.CANCELED,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should throw BadRequestException when work order has active jobs', async () => {
      mockDatabaseService.workOrder.findFirst.mockResolvedValue({
        ...mockWorkOrder,
        jobs: [{ id: 'job-1', status: 'scheduled' }],
      });

      await expect(service.deleteWorkOrder('wo-123', 'tenant-123')).rejects.toThrow(BadRequestException);
    });
  });
});