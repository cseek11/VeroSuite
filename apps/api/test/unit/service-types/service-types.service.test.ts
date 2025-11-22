/**
 * Service Types Service Unit Tests
 * Tests for service type CRUD operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServiceTypesService } from '../../../src/service-types/service-types.service';
import { DatabaseService } from '../../../src/common/services/database.service';

describe('ServiceTypesService', () => {
  let service: ServiceTypesService;
  let databaseService: DatabaseService;
  let mockDatabaseService: any;

  const tenantId = 'tenant-123';
  const serviceTypeId = 'service-type-123';

  beforeEach(async () => {
    mockDatabaseService = {
      serviceType: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ServiceTypesService>(ServiceTypesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new service type', async () => {
      // Arrange
      const createDto = {
        service_name: 'Pest Control',
        description: 'General pest control service',
        is_active: true,
      };
      const expectedServiceType = {
        id: serviceTypeId,
        ...createDto,
        tenant_id: tenantId,
      };
      mockDatabaseService.serviceType.create.mockResolvedValue(expectedServiceType);

      // Act
      const result = await service.create(createDto, tenantId);

      // Assert
      expect(result).toEqual(expectedServiceType);
      expect(mockDatabaseService.serviceType.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          tenant_id: tenantId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated service types', async () => {
      // Arrange
      const serviceTypes = [
        { id: '1', service_name: 'Service 1', tenant_id: tenantId },
        { id: '2', service_name: 'Service 2', tenant_id: tenantId },
      ];
      mockDatabaseService.serviceType.findMany.mockResolvedValue(serviceTypes);
      mockDatabaseService.serviceType.count.mockResolvedValue(2);

      // Act
      const result = await service.findAll(tenantId);

      // Assert
      expect(result.serviceTypes).toEqual(serviceTypes);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(100);
      expect(mockDatabaseService.serviceType.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        skip: 0,
        take: 100,
        orderBy: { service_name: 'asc' },
      });
    });

    it('should handle pagination parameters', async () => {
      // Arrange
      const serviceTypes = [{ id: '1', service_name: 'Service 1' }];
      mockDatabaseService.serviceType.findMany.mockResolvedValue(serviceTypes);
      mockDatabaseService.serviceType.count.mockResolvedValue(25);

      // Act
      const result = await service.findAll(tenantId, '2', '10');

      // Assert
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.pages).toBe(3);
      expect(mockDatabaseService.serviceType.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        skip: 10,
        take: 10,
        orderBy: { service_name: 'asc' },
      });
    });

    it('should filter by is_active when provided', async () => {
      // Arrange
      const serviceTypes = [{ id: '1', service_name: 'Service 1', is_active: true }];
      mockDatabaseService.serviceType.findMany.mockResolvedValue(serviceTypes);
      mockDatabaseService.serviceType.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(tenantId, undefined, undefined, 'true');

      // Assert
      expect(mockDatabaseService.serviceType.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId, is_active: true },
        skip: 0,
        take: 100,
        orderBy: { service_name: 'asc' },
      });
    });

    it('should filter by is_active false when provided', async () => {
      // Arrange
      const serviceTypes = [{ id: '1', service_name: 'Service 1', is_active: false }];
      mockDatabaseService.serviceType.findMany.mockResolvedValue(serviceTypes);
      mockDatabaseService.serviceType.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(tenantId, undefined, undefined, 'false');

      // Assert
      expect(mockDatabaseService.serviceType.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId, is_active: false },
        skip: 0,
        take: 100,
        orderBy: { service_name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return service type when found', async () => {
      // Arrange
      const serviceType = {
        id: serviceTypeId,
        service_name: 'Pest Control',
        tenant_id: tenantId,
      };
      mockDatabaseService.serviceType.findFirst.mockResolvedValue(serviceType);

      // Act
      const result = await service.findOne(serviceTypeId, tenantId);

      // Assert
      expect(result).toEqual(serviceType);
      expect(mockDatabaseService.serviceType.findFirst).toHaveBeenCalledWith({
        where: {
          id: serviceTypeId,
          tenant_id: tenantId,
        },
      });
    });

    it('should throw NotFoundException when service type not found', async () => {
      // Arrange
      mockDatabaseService.serviceType.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(serviceTypeId, tenantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne(serviceTypeId, tenantId)).rejects.toThrow(
        `Service type with ID ${serviceTypeId} not found`
      );
    });
  });

  describe('update', () => {
    it('should update service type when found', async () => {
      // Arrange
      const existingServiceType = {
        id: serviceTypeId,
        service_name: 'Old Name',
        tenant_id: tenantId,
      };
      const updateDto = { service_name: 'New Name' };
      const updatedServiceType = { ...existingServiceType, ...updateDto };

      mockDatabaseService.serviceType.findFirst.mockResolvedValue(existingServiceType);
      mockDatabaseService.serviceType.update.mockResolvedValue(updatedServiceType);

      // Act
      const result = await service.update(serviceTypeId, updateDto, tenantId);

      // Assert
      expect(result).toEqual(updatedServiceType);
      expect(mockDatabaseService.serviceType.update).toHaveBeenCalledWith({
        where: { id: serviceTypeId },
        data: updateDto,
      });
    });

    it('should throw NotFoundException when service type not found', async () => {
      // Arrange
      mockDatabaseService.serviceType.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update(serviceTypeId, { service_name: 'New Name' }, tenantId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete service type when found', async () => {
      // Arrange
      const existingServiceType = {
        id: serviceTypeId,
        service_name: 'Service',
        tenant_id: tenantId,
      };
      mockDatabaseService.serviceType.findFirst.mockResolvedValue(existingServiceType);
      mockDatabaseService.serviceType.delete.mockResolvedValue(existingServiceType);

      // Act
      const result = await service.remove(serviceTypeId, tenantId);

      // Assert
      expect(result).toEqual({ message: 'Service type deleted successfully' });
      expect(mockDatabaseService.serviceType.delete).toHaveBeenCalledWith({
        where: { id: serviceTypeId },
      });
    });

    it('should throw NotFoundException when service type not found', async () => {
      // Arrange
      mockDatabaseService.serviceType.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(serviceTypeId, tenantId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

