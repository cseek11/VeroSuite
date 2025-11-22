/**
 * Tenant Middleware Unit Tests
 * Tests for tenant context extraction, validation, and database session setup
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { TenantMiddleware } from '../../../../src/common/middleware/tenant.middleware';
import { DatabaseService } from '../../../../src/common/services/database.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let databaseService: DatabaseService;
  let jwtService: JwtService;
  let mockDatabaseService: any;
  let mockJwtService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const validTenantId = '123e4567-e89b-12d3-a456-426614174000';
  const validUserId = '123e4567-e89b-12d3-a456-426614174001';

  beforeEach(async () => {
    mockDatabaseService = {
      query: jest.fn().mockResolvedValue([]),
    };

    mockJwtService = {
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantMiddleware,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    middleware = module.get<TenantMiddleware>(TenantMiddleware);
    databaseService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);

    mockRequest = {
      headers: {},
      url: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      user: undefined,
    };

    mockResponse = {
      setHeader: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('should extract tenant ID from req.user.tenantId', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin'],
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.tenant_id = $1',
        [validTenantId]
      );
      expect(mockRequest.tenantId).toBe(validTenantId);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should extract tenant ID from X-Tenant-ID header', async () => {
      // Arrange
      mockRequest.headers = {
        'x-tenant-id': validTenantId,
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.tenant_id = $1',
        [validTenantId]
      );
      expect(mockRequest.tenantId).toBe(validTenantId);
    });

    it('should extract tenant ID from JWT token when not in user or headers', async () => {
      // Arrange
      const token = 'Bearer valid-token';
      mockRequest.headers = {
        authorization: token,
      };
      mockJwtService.decode.mockReturnValue({
        tenant_id: validTenantId,
      });

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtService.decode).toHaveBeenCalledWith('valid-token');
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.tenant_id = $1',
        [validTenantId]
      );
      expect(mockRequest.tenantId).toBe(validTenantId);
    });

    it('should prioritize req.user.tenantId over header', async () => {
      // Arrange
      const userTenantId = '123e4567-e89b-12d3-a456-426614174000';
      const headerTenantId = '123e4567-e89b-12d3-a456-426614174001';
      mockRequest.user = {
        userId: validUserId,
        tenantId: userTenantId,
        roles: ['admin'],
      };
      mockRequest.headers = {
        'x-tenant-id': headerTenantId,
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.tenant_id = $1',
        [userTenantId]
      );
      expect(mockRequest.tenantId).toBe(userTenantId);
    });

    it('should allow request to proceed when no tenant ID found (unauthenticated)', async () => {
      // Arrange
      mockRequest.user = undefined;
      mockRequest.headers = {};

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.tenantId).toBeUndefined();
    });

    it('should throw UnauthorizedException for invalid tenant ID format', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: 'invalid-tenant-id',
        roles: ['admin'],
      };

      // Act & Assert
      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should validate UUID format correctly', async () => {
      // Arrange
      const invalidTenantIds = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-12d3-a456',
        '123e4567e89b12d3a456426614174000',
      ];

      for (const invalidId of invalidTenantIds) {
        mockRequest.user = {
          userId: validUserId,
          tenantId: invalidId,
          roles: ['admin'],
        };

        // Act & Assert
        await expect(
          middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
        ).rejects.toThrow(UnauthorizedException);
      }
    });

    it('should set user_id in database session when user is present', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin'],
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.user_id = $1',
        [validUserId]
      );
    });

    it('should set user_roles in database session when roles are present', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin', 'technician'],
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.user_roles = $1',
        ['admin,technician']
      );
    });

    it('should set user_teams in database session when teams are present', async () => {
      // Arrange
      const teams = ['team-1', 'team-2'];
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin'],
        teams: teams as any,
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SET LOCAL app.user_teams = $1',
        ['team-1,team-2']
      );
    });

    it('should not set user_id when user is not present', async () => {
      // Arrange
      mockRequest.headers = {
        'x-tenant-id': validTenantId,
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).not.toHaveBeenCalledWith(
        'SET LOCAL app.user_id = $1',
        expect.anything()
      );
    });

    it('should not set user_roles when roles are empty', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: [],
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDatabaseService.query).not.toHaveBeenCalledWith(
        'SET LOCAL app.user_roles = $1',
        expect.anything()
      );
    });

    it('should handle JWT decode errors gracefully', async () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };
      mockJwtService.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled(); // Should proceed without tenant
      expect(mockRequest.tenantId).toBeUndefined();
    });

    it('should handle JWT token without tenant_id', async () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer token',
      };
      mockJwtService.decode.mockReturnValue({
        userId: validUserId,
        // No tenant_id
      });

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.tenantId).toBeUndefined();
    });

    it('should handle database query errors', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin'],
      };
      mockDatabaseService.query.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
      ).rejects.toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle Bearer token extraction correctly', async () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer token-with-tenant',
      };
      mockJwtService.decode.mockReturnValue({
        tenant_id: validTenantId,
      });

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtService.decode).toHaveBeenCalledWith('token-with-tenant');
    });

    it('should ignore non-Bearer authorization headers', async () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Basic dXNlcjpwYXNz',
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtService.decode).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle case-insensitive X-Tenant-ID header', async () => {
      // Arrange
      // Express normalizes headers to lowercase, so we need to set both to ensure it works
      mockRequest.headers = {
        'X-TENANT-ID': validTenantId,
        'x-tenant-id': validTenantId, // Express normalized version
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      // Note: Express normalizes headers to lowercase, so 'X-TENANT-ID' becomes 'x-tenant-id'
      // This test verifies the middleware works with the normalized header
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('should set tenantId on request object for easy access', async () => {
      // Arrange
      mockRequest.user = {
        userId: validUserId,
        tenantId: validTenantId,
        roles: ['admin'],
      };

      // Act
      await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockRequest.tenantId).toBe(validTenantId);
    });
  });

  describe('isValidUuid', () => {
    it('should validate correct UUID format', () => {
      // Arrange
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '00000000-0000-0000-0000-000000000000',
        'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
        '123E4567-E89B-12D3-A456-426614174000', // Uppercase
      ];

      for (const uuid of validUuids) {
        // Act
        const result = (middleware as any).isValidUuid(uuid);

        // Assert
        expect(result).toBe(true);
      }
    });

    it('should reject invalid UUID formats', () => {
      // Arrange
      const invalidUuids = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-12d3-a456',
        '123e4567e89b12d3a456426614174000',
        '123e4567-e89b-12d3-a456-426614174000-extra',
        '',
        '123e4567-e89b-12d3-a456-42661417400g', // Invalid character
      ];

      for (const uuid of invalidUuids) {
        // Act
        const result = (middleware as any).isValidUuid(uuid);

        // Assert
        expect(result).toBe(false);
      }
    });
  });
});

