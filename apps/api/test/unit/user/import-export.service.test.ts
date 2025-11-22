/**
 * Import Export Service Unit Tests
 * Tests for data import, export, and format validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ImportExportService, ImportUserRow } from '../../../src/user/import-export.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { UserService } from '../../../src/user/user.service';

describe('ImportExportService', () => {
  let service: ImportExportService;
  let databaseService: DatabaseService;
  let userService: UserService;

  const mockTenantId = 'tenant-123';

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    phone: '123-456-7890',
    roles: ['technician'],
    status: 'active',
    employee_id: 'TECH-2025-0001',
    department: 'Operations',
    position: 'Technician',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportExportService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImportExportService>(ImportExportService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exportUsers', () => {
    it('should export users to CSV format', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([mockUser] as any);

      const result = await service.exportUsers(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone: '123-456-7890',
        roles: 'technician',
        status: 'active',
        employee_id: 'TECH-2025-0001',
      });
    });

    it('should format roles as semicolon-separated string', async () => {
      const userWithMultipleRoles = {
        ...mockUser,
        roles: ['technician', 'admin'],
      };

      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([userWithMultipleRoles] as any);

      const result = await service.exportUsers(mockTenantId);

      expect(result[0].roles).toBe('technician;admin');
    });

    it('should handle null values with empty strings', async () => {
      const userWithNulls = {
        ...mockUser,
        phone: null,
        employee_id: null,
      };

      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([userWithNulls] as any);

      const result = await service.exportUsers(mockTenantId);

      expect(result[0].phone).toBe('');
      expect(result[0].employee_id).toBe('');
    });

    it('should filter by tenant', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([]);

      await service.exportUsers(mockTenantId);

      expect(databaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenant_id: mockTenantId },
        })
      );
    });

    it('should order users by first name', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([]);

      await service.exportUsers(mockTenantId);

      expect(databaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { first_name: 'asc' },
        })
      );
    });
  });

  describe('importUsers', () => {
    const validUserRow: ImportUserRow = {
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User',
      phone: '123-456-7890',
      roles: 'technician',
    };

    it('should import users successfully', async () => {
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser as any);

      const result = await service.importUsers(mockTenantId, [validUserRow]);

      expect(result.total).toBe(1);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should reject users with missing required fields', async () => {
      const invalidRow: ImportUserRow = {
        email: '',
        first_name: 'Test',
        last_name: 'User',
      };

      const result = await service.importUsers(mockTenantId, [invalidRow]);

      expect(result.total).toBe(1);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toContain('Missing required fields');
    });

    it('should handle multiple users with some failures', async () => {
      const validRow2: ImportUserRow = {
        email: 'user2@example.com',
        first_name: 'User',
        last_name: 'Two',
      };

      jest.spyOn(userService, 'createUser')
        .mockResolvedValueOnce(mockUser as any)
        .mockRejectedValueOnce(new Error('Duplicate email'));

      const result = await service.importUsers(mockTenantId, [validUserRow, validRow2]);

      expect(result.total).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should parse roles from semicolon-separated string', async () => {
      const rowWithMultipleRoles: ImportUserRow = {
        ...validUserRow,
        roles: 'technician;admin',
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser as any);

      await service.importUsers(mockTenantId, [rowWithMultipleRoles]);

      expect(userService.createUser).toHaveBeenCalledWith(
        mockTenantId,
        expect.objectContaining({
          roles: ['technician', 'admin'],
        })
      );
    });

    it('should handle empty roles', async () => {
      const rowWithoutRoles: ImportUserRow = {
        ...validUserRow,
        roles: undefined,
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser as any);

      await service.importUsers(mockTenantId, [rowWithoutRoles]);

      expect(userService.createUser).toHaveBeenCalledWith(
        mockTenantId,
        expect.objectContaining({
          roles: ['technician'], // Default role
        })
      );
    });
  });
});

