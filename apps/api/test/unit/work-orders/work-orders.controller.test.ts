/**
 * Work Orders Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrdersController } from '../../../src/work-orders/work-orders.controller';
import { WorkOrdersService } from '../../../src/work-orders/work-orders.service';
import { WorkOrderStatus, WorkOrderPriority } from '../../../src/work-orders/dto';

describe('WorkOrdersController', () => {
  let controller: WorkOrdersController;
  let workOrdersService: WorkOrdersService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockWorkOrder = {
    id: 'work-order-123',
    customer_id: 'customer-123',
    status: WorkOrderStatus.PENDING,
    priority: WorkOrderPriority.MEDIUM,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrdersController],
      providers: [
        {
          provide: WorkOrdersService,
          useValue: {
            createWorkOrder: jest.fn(),
            getWorkOrderById: jest.fn(),
            listWorkOrders: jest.fn(),
            updateWorkOrder: jest.fn(),
            deleteWorkOrder: jest.fn(),
            getWorkOrdersByCustomer: jest.fn(),
            getWorkOrdersByTechnician: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkOrdersController>(WorkOrdersController);
    workOrdersService = module.get<WorkOrdersService>(WorkOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkOrder', () => {
    const createWorkOrderDto = {
      customer_id: 'customer-123',
      description: 'Test work order',
      service_type: 'Pest Control',
    };

    it('should create work order successfully', async () => {
      jest.spyOn(workOrdersService, 'createWorkOrder').mockResolvedValue(mockWorkOrder as any);

      const result = await controller.createWorkOrder(createWorkOrderDto, { user: mockUser } as any);

      expect(result).toEqual(mockWorkOrder);
      expect(workOrdersService.createWorkOrder).toHaveBeenCalledWith(
        createWorkOrderDto,
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });

  describe('getWorkOrderById', () => {
    it('should return work order by ID', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrderById').mockResolvedValue(mockWorkOrder as any);

      const result = await controller.getWorkOrderById('work-order-123', { user: mockUser } as any);

      expect(result).toEqual(mockWorkOrder);
      expect(workOrdersService.getWorkOrderById).toHaveBeenCalledWith('work-order-123', mockUser.tenantId);
    });
  });

  describe('listWorkOrders', () => {
    it('should return paginated work orders', async () => {
      const mockResponse = {
        data: [mockWorkOrder],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      jest.spyOn(workOrdersService, 'listWorkOrders').mockResolvedValue(mockResponse as any);

      const result = await controller.listWorkOrders({}, { user: mockUser } as any);

      expect(result).toEqual(mockResponse);
      expect(workOrdersService.listWorkOrders).toHaveBeenCalledWith({}, mockUser.tenantId);
    });

    it('should apply filters', async () => {
      const filters = {
        status: WorkOrderStatus.PENDING,
        priority: WorkOrderPriority.HIGH,
        assigned_to: 'technician-123',
      };

      jest.spyOn(workOrdersService, 'listWorkOrders').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      } as any);

      await controller.listWorkOrders(filters, { user: mockUser } as any);

      expect(workOrdersService.listWorkOrders).toHaveBeenCalledWith(filters, mockUser.tenantId);
    });
  });

  describe('updateWorkOrder', () => {
    const updateWorkOrderDto = {
      status: WorkOrderStatus.IN_PROGRESS,
      priority: WorkOrderPriority.HIGH,
    };

    it('should update work order successfully', async () => {
      jest.spyOn(workOrdersService, 'updateWorkOrder').mockResolvedValue({
        ...mockWorkOrder,
        ...updateWorkOrderDto,
      } as any);

      const result = await controller.updateWorkOrder(
        'work-order-123',
        updateWorkOrderDto,
        { user: mockUser } as any
      );

      expect(result.status).toBe(WorkOrderStatus.IN_PROGRESS);
      expect(workOrdersService.updateWorkOrder).toHaveBeenCalledWith(
        'work-order-123',
        updateWorkOrderDto,
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });

  describe('deleteWorkOrder', () => {
    it('should delete work order successfully', async () => {
      jest.spyOn(workOrdersService, 'deleteWorkOrder').mockResolvedValue({
        message: 'Work order deleted successfully',
      } as any);

      const result = await controller.deleteWorkOrder('work-order-123', { user: mockUser } as any);

      expect(result).toHaveProperty('message');
      expect(workOrdersService.deleteWorkOrder).toHaveBeenCalledWith(
        'work-order-123',
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });

  describe('getWorkOrdersByCustomer', () => {
    it('should return work orders for customer', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrdersByCustomer').mockResolvedValue([mockWorkOrder] as any);

      const result = await controller.getWorkOrdersByCustomer('customer-123', { user: mockUser } as any);

      expect(result).toEqual([mockWorkOrder]);
      expect(workOrdersService.getWorkOrdersByCustomer).toHaveBeenCalledWith(
        'customer-123',
        mockUser.tenantId
      );
    });
  });

  describe('getWorkOrdersByTechnician', () => {
    it('should return work orders for technician', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrdersByTechnician').mockResolvedValue([mockWorkOrder] as any);

      const result = await controller.getWorkOrdersByTechnician('technician-123', { user: mockUser } as any);

      expect(result).toEqual([mockWorkOrder]);
      expect(workOrdersService.getWorkOrdersByTechnician).toHaveBeenCalledWith(
        'technician-123',
        mockUser.tenantId
      );
    });
  });
});

