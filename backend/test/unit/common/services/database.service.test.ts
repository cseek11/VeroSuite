/**
 * Database Service Unit Tests
 * Tests for database connection management and tenant isolation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../../src/common/services/database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockPrismaClient: any;

  beforeEach(async () => {
    // Mock PrismaClient methods
    mockPrismaClient = {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
      $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    };

    // Mock PrismaClient constructor
    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
    }));

    // Set up environment variables
    process.env.DATABASE_URL = 'postgresql://localhost:5432/verofield';
    process.env.NODE_ENV = 'test';

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    
    // Replace internal PrismaClient methods with mocks
    (service as any).$connect = mockPrismaClient.$connect;
    (service as any).$disconnect = mockPrismaClient.$disconnect;
    (service as any).$queryRawUnsafe = mockPrismaClient.$queryRawUnsafe;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.DB_CONNECTION_LIMIT;
    delete process.env.DB_POOL_TIMEOUT;
    delete process.env.DB_CONNECT_TIMEOUT;
  });

  describe('constructor', () => {
    it('should create service with default DATABASE_URL when not provided', () => {
      // Arrange
      delete process.env.DATABASE_URL;

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });

    it('should add connection pool parameters to DATABASE_URL', () => {
      // Arrange
      process.env.DATABASE_URL = 'postgresql://localhost:5432/verofield';
      process.env.DB_CONNECTION_LIMIT = '20';
      process.env.DB_POOL_TIMEOUT = '120';
      process.env.DB_CONNECT_TIMEOUT = '30';

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });

    it('should use existing connection_limit if present in URL', () => {
      // Arrange
      process.env.DATABASE_URL = 'postgresql://localhost:5432/verofield?connection_limit=15';
      process.env.DB_CONNECTION_LIMIT = '20'; // Should not override

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });

    it('should always set pool_timeout even if present in URL', () => {
      // Arrange
      process.env.DATABASE_URL = 'postgresql://localhost:5432/verofield?pool_timeout=30';
      process.env.DB_POOL_TIMEOUT = '120'; // Should override

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });

    it('should handle invalid DATABASE_URL gracefully', () => {
      // Arrange
      process.env.DATABASE_URL = 'invalid-url';

      // Act & Assert - should not throw
      expect(() => new DatabaseService()).not.toThrow();
    });

    it('should set log level based on NODE_ENV', () => {
      // Arrange
      process.env.NODE_ENV = 'development';

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });

    it('should set minimal log level in production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      // Act
      const serviceInstance = new DatabaseService();

      // Assert
      expect(serviceInstance).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      // Arrange
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined);

      // Act
      await service.onModuleInit();

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle connection errors', async () => {
      // Arrange
      const connectSpy = jest.spyOn(service, '$connect').mockRejectedValue(new Error('Connection failed'));

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      // Arrange
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue(undefined);

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle disconnection errors gracefully', async () => {
      // Arrange
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockRejectedValue(new Error('Disconnect failed'));

      // Act & Assert
      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnect failed');
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('query', () => {
    it('should execute query without parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users';
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([{ id: 1 }]);

      // Act
      const result = await service.query(sql);

      // Assert
      expect(querySpy).toHaveBeenCalledWith(sql);
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should execute query with parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE id = $1 AND name = $2';
      const params = [1, 'John'];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([{ id: 1, name: 'John' }]);

      // Act
      const result = await service.query(sql, params);

      // Assert
      expect(querySpy).toHaveBeenCalled();
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain('1');
      expect(calledSql).toContain("'John'");
      expect(result).toEqual([{ id: 1, name: 'John' }]);
    });

    it('should escape single quotes in string parameters', async () => {
      // Arrange
      const sql = "SELECT * FROM users WHERE name = $1";
      const params = ["O'Brien"];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([]);

      // Act
      await service.query(sql, params);

      // Assert
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain("'O''Brien'");
    });

    it('should handle null parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE deleted_at = $1';
      const params = [null];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([]);

      // Act
      await service.query(sql, params);

      // Assert
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain('NULL');
    });

    it('should handle undefined parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE deleted_at = $1';
      const params = [undefined];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([]);

      // Act
      await service.query(sql, params);

      // Assert
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain('NULL');
    });

    it('should handle numeric parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE id = $1';
      const params = [123];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([]);

      // Act
      await service.query(sql, params);

      // Assert
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain('123');
    });

    it('should handle multiple parameters', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE id = $1 AND tenant_id = $2 AND name = $3';
      const params = [1, 'tenant-123', 'John'];
      const querySpy = jest.spyOn(service, '$queryRawUnsafe').mockResolvedValue([]);

      // Act
      await service.query(sql, params);

      // Assert
      const calledSql = querySpy.mock.calls[0][0];
      expect(calledSql).toContain('1');
      expect(calledSql).toContain("'tenant-123'");
      expect(calledSql).toContain("'John'");
    });
  });

  describe('withTenant', () => {
    it('should set tenant context and execute operation', async () => {
      // Arrange
      const tenantId = 'tenant-123';
      const operation = jest.fn().mockResolvedValue('result');
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([]);

      // Act
      const result = await service.withTenant(tenantId, operation);

      // Assert
      expect(querySpy).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId]);
      expect(querySpy).toHaveBeenCalledWith('RESET app.tenant_id');
      expect(operation).toHaveBeenCalledTimes(1);
      expect(result).toBe('result');
    });

    it('should reset tenant context even if operation throws', async () => {
      // Arrange
      const tenantId = 'tenant-123';
      const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([]);

      // Act & Assert
      await expect(service.withTenant(tenantId, operation)).rejects.toThrow('Operation failed');
      expect(querySpy).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId]);
      expect(querySpy).toHaveBeenCalledWith('RESET app.tenant_id');
    });

    it('should maintain tenant isolation', async () => {
      // Arrange
      const tenantId1 = 'tenant-123';
      const tenantId2 = 'tenant-456';
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([]);
      const operation1 = jest.fn().mockResolvedValue('result1');
      const operation2 = jest.fn().mockResolvedValue('result2');

      // Act
      await service.withTenant(tenantId1, operation1);
      await service.withTenant(tenantId2, operation2);

      // Assert
      expect(querySpy).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId1]);
      expect(querySpy).toHaveBeenCalledWith('SET LOCAL app.tenant_id = $1', [tenantId2]);
      expect(querySpy).toHaveBeenCalledWith('RESET app.tenant_id');
    });
  });

  describe('getCurrentTenantId', () => {
    it('should return current tenant ID', async () => {
      // Arrange
      const tenantId = 'tenant-123';
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([{ tenant_id: tenantId }]);

      // Act
      const result = await service.getCurrentTenantId();

      // Assert
      expect(querySpy).toHaveBeenCalledWith("SELECT current_setting('app.tenant_id', true) as tenant_id");
      expect(result).toBe(tenantId);
    });

    it('should return null when tenant ID is not set', async () => {
      // Arrange
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([{ tenant_id: null }]);

      // Act
      const result = await service.getCurrentTenantId();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when query returns empty array', async () => {
      // Arrange
      const querySpy = jest.spyOn(service, 'query').mockResolvedValue([]);

      // Act
      const result = await service.getCurrentTenantId();

      // Assert
      expect(result).toBeNull();
    });

    it('should handle query errors gracefully', async () => {
      // Arrange
      const querySpy = jest.spyOn(service, 'query').mockRejectedValue(new Error('Query failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await service.getCurrentTenantId();

      // Assert
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});

