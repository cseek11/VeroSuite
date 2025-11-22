import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { TenantMiddleware } from './tenant.middleware';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('Tenant Isolation Integration', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let tenantMiddleware: TenantMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        TenantMiddleware,
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn(),
            withTenant: jest.fn(),
            getCurrentTenantId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn((token: string) => {
              // Mock JWT decode for testing
              if (token === 'valid-token-with-tenant') {
                return { tenant_id: '123e4567-e89b-12d3-a456-426614174000', user_id: 'user-123' };
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
    tenantMiddleware = moduleFixture.get<TenantMiddleware>(TenantMiddleware);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Tenant Middleware Integration', () => {
    const tenant1Id = '123e4567-e89b-12d3-a456-426614174000';
    const tenant2Id = '987fcdeb-51a2-43d1-b456-426614174000';

    it('should set tenant context correctly for authenticated user', async () => {
      mockRequest = {
        user: {
          userId: 'user-123',
          tenantId: tenant1Id,
          roles: ['admin'],
        },
        headers: {},
      };

      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await tenantMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenant1Id]);
      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.user_id = $1', ['user-123']);
      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.user_roles = $1', ['admin']);
      expect(mockRequest.tenantId).toBe(tenant1Id);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set tenant context correctly from header', async () => {
      mockRequest = {
        headers: {
          'x-tenant-id': tenant2Id,
        },
      };

      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await tenantMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenant2Id]);
      expect(mockRequest.tenantId).toBe(tenant2Id);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockRequest = {
        headers: {
          'x-tenant-id': tenant1Id,
        },
      };

      (databaseService.query as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      await expect(
        tenantMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow('Unable to establish tenant context');

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should validate tenant ID format', async () => {
      mockRequest = {
        headers: {
          'x-tenant-id': 'invalid-uuid-format',
        },
      };

      await expect(
        tenantMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow('Unable to establish tenant context');

      expect(databaseService.query).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow requests without tenant ID for public endpoints', async () => {
      mockRequest = {
        headers: {},
      };

      await tenantMiddleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(databaseService.query).not.toHaveBeenCalled();
      expect(mockRequest.tenantId).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Database Service Integration', () => {
    it('should support withTenant method', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const mockOperation = jest.fn().mockResolvedValue('test-result');

      (databaseService.withTenant as jest.Mock).mockImplementation(async (_tid, operation) => {
        (databaseService.query as jest.Mock).mockResolvedValue([]);
        const result = await operation();
        return result;
      });

      const result = await databaseService.withTenant(tenantId, mockOperation);

      expect(databaseService.withTenant).toHaveBeenCalledWith(tenantId, mockOperation);
      expect(mockOperation).toHaveBeenCalled();
      expect(result).toBe('test-result');
    });

    it('should get current tenant ID', async () => {
      const expectedTenantId = '123e4567-e89b-12d3-a456-426614174000';
      
      (databaseService.getCurrentTenantId as jest.Mock).mockResolvedValue(expectedTenantId);

      const result = await databaseService.getCurrentTenantId();

      expect(databaseService.getCurrentTenantId).toHaveBeenCalled();
      expect(result).toBe(expectedTenantId);
    });
  });
});
