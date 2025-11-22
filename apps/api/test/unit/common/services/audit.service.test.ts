/**
 * Audit Service Unit Tests
 * Tests for audit logging functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../../../../src/common/services/audit.service';
import { DatabaseService } from '../../../../src/common/services/database.service';

describe('AuditService', () => {
  let service: AuditService;
  let databaseService: DatabaseService;
  let mockDatabaseService: any;

  beforeEach(async () => {
    mockDatabaseService = {
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-123' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log audit entry successfully', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        userId: 'user-123',
        action: 'create',
        resourceType: 'job',
        resourceId: 'job-123',
        beforeState: null,
        afterState: { status: 'pending' },
        requestId: 'request-123',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };

      // Act
      await service.log(entry);

      // Assert
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenant_id: entry.tenantId,
          user_id: entry.userId,
          action: entry.action,
          resource_type: entry.resourceType,
          resource_id: entry.resourceId,
          before_state: entry.beforeState,
          after_state: entry.afterState,
          request_id: entry.requestId,
          ip_address: entry.ipAddress,
          user_agent: entry.userAgent,
        }),
      });
      expect(mockDatabaseService.auditLog.create.mock.calls[0][0].data.id).toBeDefined();
    });

    it('should generate UUID for id when not provided', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'update',
        resourceType: 'user',
      };

      // Act
      await service.log(entry);

      // Assert
      const createCall = mockDatabaseService.auditLog.create.mock.calls[0][0];
      expect(createCall.data.id).toBeDefined();
      expect(typeof createCall.data.id).toBe('string');
      expect(createCall.data.id.length).toBeGreaterThan(0);
    });

    it('should handle optional fields as null', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'delete',
        resourceType: 'account',
      };

      // Act
      await service.log(entry);

      // Assert
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenant_id: entry.tenantId,
          user_id: null,
          resource_id: null,
          before_state: undefined,
          after_state: undefined,
          ip_address: null,
          user_agent: null,
        }),
      });
      // request_id should be generated if not provided
      expect(mockDatabaseService.auditLog.create.mock.calls[0][0].data.request_id).toBeDefined();
    });

    it('should generate request_id when not provided', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'view',
        resourceType: 'dashboard',
      };

      // Act
      await service.log(entry);

      // Assert
      const createCall = mockDatabaseService.auditLog.create.mock.calls[0][0];
      expect(createCall.data.request_id).toBeDefined();
      expect(typeof createCall.data.request_id).toBe('string');
    });

    it('should use provided request_id when available', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'view',
        resourceType: 'dashboard',
        requestId: 'custom-request-id',
      };

      // Act
      await service.log(entry);

      // Assert
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          request_id: 'custom-request-id',
        }),
      });
    });

    it('should handle complex beforeState and afterState objects', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'update',
        resourceType: 'job',
        resourceId: 'job-123',
        beforeState: {
          status: 'pending',
          assignedTo: null,
          priority: 'normal',
        },
        afterState: {
          status: 'in-progress',
          assignedTo: 'technician-123',
          priority: 'high',
        },
      };

      // Act
      await service.log(entry);

      // Assert
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          before_state: entry.beforeState,
          after_state: entry.afterState,
        }),
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        action: 'create',
        resourceType: 'job',
      };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockDatabaseService.auditLog.create.mockRejectedValueOnce(new Error('Database error'));

      // Act
      await service.log(entry);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Audit log failed:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it('should handle all required fields', async () => {
      // Arrange
      const entry = {
        tenantId: 'tenant-123',
        userId: 'user-123',
        action: 'create',
        resourceType: 'job',
        resourceId: 'job-123',
        beforeState: { old: 'value' },
        afterState: { new: 'value' },
        requestId: 'request-123',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };

      // Act
      await service.log(entry);

      // Assert
      expect(mockDatabaseService.auditLog.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          tenant_id: 'tenant-123',
          user_id: 'user-123',
          action: 'create',
          resource_type: 'job',
          resource_id: 'job-123',
          before_state: { old: 'value' },
          after_state: { new: 'value' },
          request_id: 'request-123',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
        },
      });
    });
  });
});

