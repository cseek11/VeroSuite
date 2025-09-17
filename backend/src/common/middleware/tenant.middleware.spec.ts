import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantMiddleware } from './tenant.middleware';
import { DatabaseService } from '../services/database.service';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let databaseService: jest.Mocked<DatabaseService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(async () => {
    const mockDatabaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantMiddleware,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    middleware = module.get<TenantMiddleware>(TenantMiddleware);
    databaseService = module.get(DatabaseService);

    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('should allow requests without tenant ID to proceed (unauthenticated endpoints)', async () => {
      mockRequest = {
        headers: {},
      };

      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(databaseService.query).not.toHaveBeenCalled();
    });

    it('should set tenant context from authenticated user', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        user: {
          userId: 'user-123',
          tenantId,
          roles: ['admin'],
        },
      };

      databaseService.query.mockResolvedValue([]);

      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId]);
      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL ROLE verosuite_app');
      expect(mockRequest.tenantId).toBe(tenantId);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set tenant context from x-tenant-id header (development)', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        headers: {
          'x-tenant-id': tenantId,
        },
      };

      databaseService.query.mockResolvedValue([]);

      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId]);
      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL ROLE verosuite_app');
      expect(mockRequest.tenantId).toBe(tenantId);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid tenant ID format', async () => {
      const invalidTenantId = 'invalid-uuid';
      mockRequest = {
        headers: {
          'x-tenant-id': invalidTenantId,
        },
      };

      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockNext).not.toHaveBeenCalled();
      expect(databaseService.query).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when database context setting fails', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        headers: {
          'x-tenant-id': tenantId,
        },
      };

      databaseService.query.mockRejectedValue(new Error('Database error'));

      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should prioritize user context over header', async () => {
      const userTenantId = '123e4567-e89b-12d3-a456-426614174000';
      const headerTenantId = '987fcdeb-51a2-43d1-b456-426614174000';
      
      mockRequest = {
        user: {
          userId: 'user-123',
          tenantId: userTenantId,
          roles: ['admin'],
        },
        headers: {
          'x-tenant-id': headerTenantId,
        },
      };

      databaseService.query.mockResolvedValue([]);

      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [userTenantId]);
      expect(mockRequest.tenantId).toBe(userTenantId);
    });
  });

  describe('isValidUuid', () => {
    it('should validate correct UUID format', () => {
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      ];

      validUuids.forEach(uuid => {
        expect((middleware as any).isValidUuid(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUID format', () => {
      const invalidUuids = [
        'invalid-uuid',
        '123e4567-e89b-12d3-a456',
        '123e4567-e89b-12d3-a456-426614174000-extra',
        '',
        'not-a-uuid-at-all',
      ];

      invalidUuids.forEach(uuid => {
        expect((middleware as any).isValidUuid(uuid)).toBe(false);
      });
    });
  });
});
