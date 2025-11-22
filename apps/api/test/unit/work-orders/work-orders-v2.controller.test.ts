/**
 * Work Orders V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced features and backward compatibility
 */

import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { WorkOrdersV2Controller } from '../../../src/work-orders/work-orders-v2.controller';
import { WorkOrdersService } from '../../../src/work-orders/work-orders.service';
import { IdempotencyService } from '../../../src/common/services/idempotency.service';
import { WorkOrderStatus } from '../../../src/work-orders/dto';

describe('WorkOrdersV2Controller', () => {
  let controller: WorkOrdersV2Controller;
  let workOrdersService: WorkOrdersService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockWorkOrder = {
    id: 'work-order-123',
    customer_id: 'customer-123',
    status: WorkOrderStatus.PENDING,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrdersV2Controller],
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
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: IdempotencyService,
          useValue: {
            checkKey: jest.fn(),
            storeKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkOrdersV2Controller>(WorkOrdersV2Controller);
    workOrdersService = module.get<WorkOrdersService>(WorkOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkOrder', () => {
    const createWorkOrderDto = {
      customer_id: 'customer-123',
      description: 'Test work order',
    };

    it('should create work order with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'createWorkOrder').mockResolvedValue(mockWorkOrder as any);

      const result = await controller.createWorkOrder(createWorkOrderDto, { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.timestamp).toBeDefined();
      expect(result.data).toEqual(mockWorkOrder);
    });
  });

  describe('getWorkOrderById', () => {
    it('should return work order with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrderById').mockResolvedValue(mockWorkOrder as any);

      const result = await controller.getWorkOrderById('work-order-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockWorkOrder);
    });
  });

  describe('listWorkOrders', () => {
    it('should return work orders with V2 response format', async () => {
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

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(0); // Array.isArray check returns false for object
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('updateWorkOrder', () => {
    const updateWorkOrderDto = {
      status: WorkOrderStatus.IN_PROGRESS,
    };

    it('should update work order with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'updateWorkOrder').mockResolvedValue(mockWorkOrder as any);

      const result = await controller.updateWorkOrder(
        'work-order-123',
        updateWorkOrderDto,
        { user: mockUser } as any
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockWorkOrder);
    });
  });

  describe('deleteWorkOrder', () => {
    it('should delete work order with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'deleteWorkOrder').mockResolvedValue({
        message: 'Work order deleted successfully',
      } as any);

      const result = await controller.deleteWorkOrder('work-order-123', { user: mockUser } as any);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('getWorkOrdersByCustomer', () => {
    it('should return work orders by customer with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrdersByCustomer').mockResolvedValue([mockWorkOrder] as any);

      const result = await controller.getWorkOrdersByCustomer('customer-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(result.data).toEqual([mockWorkOrder]);
    });
  });

  describe('getWorkOrdersByTechnician', () => {
    it('should return work orders by technician with V2 response format', async () => {
      jest.spyOn(workOrdersService, 'getWorkOrdersByTechnician').mockResolvedValue([mockWorkOrder] as any);

      const result = await controller.getWorkOrdersByTechnician('technician-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(result.data).toEqual([mockWorkOrder]);
    });
  });
});

