/**
 * User Service Unit Tests
 * Tests for user CRUD operations, search, filtering, and tenant isolation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/user.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { EncryptionService } from '../../../src/common/services/encryption.service';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let databaseService: DatabaseService;
  let encryptionService: EncryptionService;
  let mockSupabaseClient: any;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';

  const mockUser = {
    id: mockUserId,
    tenant_id: mockTenantId,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    phone: '123-456-7890',
    roles: ['technician'],
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    mockSupabaseClient = {
      auth: {
        admin: {
          listUsers: jest.fn(),
          createUser: jest.fn(),
          updateUserById: jest.fn(),
        },
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            auditLog: {
              findMany: jest.fn(),
            },
            job: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
            },
            workOrder: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            encrypt: jest.fn((data: string) => `encrypted_${data}`),
            decrypt: jest.fn((data: string) => data.replace('encrypted_', '')),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email from Supabase', async () => {
      const mockAuthUsers = {
        users: [
          {
            id: mockUserId,
            email: 'test@example.com',
            user_metadata: {
              first_name: 'Test',
              last_name: 'User',
              tenant_id: mockTenantId,
              roles: ['technician'],
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      };

      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: mockAuthUsers,
        error: null,
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(result?.id).toBe(mockUserId);
    });

    it('should return null when user not found', async () => {
      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: { users: [] },
        error: null,
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return null when Supabase returns error', async () => {
      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: null,
        error: { message: 'Error fetching users' },
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockRejectedValue(new Error('Network error'));

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('should return users for tenant', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([mockUser] as any);

      const result = await service.getUsers(mockTenantId);

      expect(result.users).toHaveLength(1);
      expect(result.users[0].id).toBe(mockUserId);
      expect(databaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenant_id: mockTenantId },
        })
      );
    });

    it('should format dates correctly', async () => {
      const userWithDates = {
        ...mockUser,
        license_expiration_date: new Date('2025-12-31'),
        hire_date: new Date('2025-01-01'),
      };

      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([userWithDates] as any);

      const result = await service.getUsers(mockTenantId);

      expect(result.users[0].license_expiration_date).toBe('2025-12-31T00:00:00.000Z');
      expect(result.users[0].hire_date).toBe('2025-01-01T00:00:00.000Z');
    });

    it('should handle null dates', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([mockUser] as any);

      const result = await service.getUsers(mockTenantId);

      expect(result.users[0].license_expiration_date).toBeNull();
      expect(result.users[0].hire_date).toBeNull();
    });

    it('should order users by first name', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([mockUser] as any);

      await service.getUsers(mockTenantId);

      expect(databaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { first_name: 'asc' },
        })
      );
    });

    it('should handle database errors', async () => {
      jest.spyOn(databaseService.user, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getUsers(mockTenantId)).rejects.toThrow('Database error');
    });
  });

  describe('getUserHierarchy', () => {
    it('should return user hierarchy with manager and direct reports', async () => {
      const manager = {
        id: 'manager-123',
        first_name: 'Manager',
        last_name: 'User',
        email: 'manager@example.com',
        position: 'Manager',
        department: 'Operations',
      };

      const directReport = {
        id: 'report-123',
        first_name: 'Report',
        last_name: 'User',
        email: 'report@example.com',
        position: 'Technician',
        department: 'Operations',
        status: 'active',
      };

      jest.spyOn(databaseService.user, 'findUnique')
        .mockResolvedValueOnce({
          ...mockUser,
          manager_id: 'manager-123',
        } as any)
        .mockResolvedValueOnce(manager as any);

      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([directReport] as any);

      const result = await service.getUserHierarchy(mockTenantId, mockUserId);

      expect(result).toBeDefined();
      expect(result?.user.id).toBe(mockUserId);
      expect(result?.manager).toEqual(manager);
      expect(result?.directReports).toHaveLength(1);
      expect(result?.directReports[0]).toEqual(directReport);
    });

    it('should return null when user not found', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUserHierarchy(mockTenantId, 'non-existent');

      expect(result).toBeNull();
    });

    it('should return null when user belongs to different tenant', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        tenant_id: 'different-tenant',
      } as any);

      const result = await service.getUserHierarchy(mockTenantId, mockUserId);

      expect(result).toBeNull();
    });

    it('should handle user without manager', async () => {
      jest.spyOn(databaseService.user, 'findUnique')
        .mockResolvedValueOnce({
          ...mockUser,
          manager_id: null,
        } as any);

      jest.spyOn(databaseService.user, 'findMany').mockResolvedValue([]);

      const result = await service.getUserHierarchy(mockTenantId, mockUserId);

      expect(result?.manager).toBeNull();
    });
  });

  describe('getUserActivity', () => {
    const mockActivity = {
      id: 'activity-123',
      action: 'login',
      resource_type: 'user',
      resource_id: mockUserId,
      timestamp: new Date(),
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
    };

    it('should return user activity', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue([mockActivity] as any);

      const result = await service.getUserActivity(mockTenantId, mockUserId, 50);

      expect(result).toHaveLength(1);
      expect(result[0].action).toBe('login');
      expect(result[0].timestamp).toBeDefined();
      expect(databaseService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenant_id: mockTenantId,
            user_id: mockUserId,
          },
          take: 50,
        })
      );
    });

    it('should use default limit when not specified', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue([]);

      await service.getUserActivity(mockTenantId, mockUserId);

      expect(databaseService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        })
      );
    });

    it('should use custom limit when specified', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue([]);

      await service.getUserActivity(mockTenantId, mockUserId, 100);

      expect(databaseService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      );
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User',
      password: 'password123',
      roles: ['technician'],
    };

    const mockAuthUser = {
      id: 'new-user-id',
      email: 'newuser@example.com',
    };

    it('should create user successfully', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(mockSupabaseClient.auth.admin, 'createUser').mockResolvedValue({
        data: { user: mockAuthUser },
        error: null,
      });
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.user, 'create').mockResolvedValue(mockUser as any);

      const result = await service.createUser(mockTenantId, createUserDto);

      expect(result).toBeDefined();
      expect(mockSupabaseClient.auth.admin.createUser).toHaveBeenCalled();
      expect(databaseService.user.create).toHaveBeenCalled();
    });

    it('should throw error when user already exists', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser as any);

      await expect(service.createUser(mockTenantId, createUserDto)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should encrypt sensitive fields', async () => {
      const dtoWithSensitiveData = {
        ...createUserDto,
        social_security_number: '123-45-6789',
        driver_license_number: 'DL123456',
      };

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(mockSupabaseClient.auth.admin, 'createUser').mockResolvedValue({
        data: { user: mockAuthUser },
        error: null,
      });
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.user, 'create').mockResolvedValue(mockUser as any);

      await service.createUser(mockTenantId, dtoWithSensitiveData);

      expect(encryptionService.encrypt).toHaveBeenCalledWith('123-45-6789');
      expect(encryptionService.encrypt).toHaveBeenCalledWith('DL123456');
    });

    it('should generate employee ID when not provided', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(mockSupabaseClient.auth.admin, 'createUser').mockResolvedValue({
        data: { user: mockAuthUser },
        error: null,
      });
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.user, 'create').mockResolvedValue(mockUser as any);

      await service.createUser(mockTenantId, createUserDto);

      expect(databaseService.user.findFirst).toHaveBeenCalled();
    });

    it('should handle Supabase auth errors', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(mockSupabaseClient.auth.admin, 'createUser').mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      });

      await expect(service.createUser(mockTenantId, createUserDto)).rejects.toThrow(
        'Failed to create user in authentication system'
      );
    });
  });

  describe('generateEmployeeId', () => {
    it('should generate employee ID for technician', async () => {
      const currentYear = new Date().getFullYear();
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.generateEmployeeId(mockTenantId, 'technician');

      expect(result).toMatch(new RegExp(`^TECH-${currentYear}-\\d{4}$`));
    });

    it('should generate employee ID for admin', async () => {
      const currentYear = new Date().getFullYear();
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.generateEmployeeId(mockTenantId, 'admin');

      expect(result).toMatch(new RegExp(`^ADMIN-${currentYear}-\\d{4}$`));
    });

    it('should generate employee ID for dispatcher', async () => {
      const currentYear = new Date().getFullYear();
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.generateEmployeeId(mockTenantId, 'dispatcher');

      expect(result).toMatch(new RegExp(`^DISP-${currentYear}-\\d{4}$`));
    });

    it('should use EMP prefix for unknown roles', async () => {
      const currentYear = new Date().getFullYear();
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.generateEmployeeId(mockTenantId, 'unknown');

      expect(result).toMatch(new RegExp(`^EMP-${currentYear}-\\d{4}$`));
    });

    it('should increment employee ID when previous exists', async () => {
      const currentYear = new Date().getFullYear();
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue({
        employee_id: `TECH-${currentYear}-0001`,
      } as any);

      const result = await service.generateEmployeeId(mockTenantId, 'technician');

      expect(result).toBe(`TECH-${currentYear}-0002`);
    });
  });

  describe('syncAuthUsersToDatabase', () => {
    it('should sync users from Supabase Auth to database', async () => {
      const authUsers = {
        users: [
          {
            id: 'auth-user-1',
            email: 'auth1@example.com',
            user_metadata: {
              first_name: 'Auth',
              last_name: 'User1',
              tenant_id: mockTenantId,
              roles: ['technician'],
            },
          },
        ],
      };

      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: authUsers,
        error: null,
      });
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(databaseService.user, 'create').mockResolvedValue(mockUser as any);

      const result = await service.syncAuthUsersToDatabase(mockTenantId);

      expect(result.synced).toBe(1);
      expect(databaseService.user.create).toHaveBeenCalled();
    });

    it('should skip users from other tenants', async () => {
      const authUsers = {
        users: [
          {
            id: 'auth-user-1',
            email: 'auth1@example.com',
            user_metadata: {
              tenant_id: 'other-tenant',
            },
          },
        ],
      };

      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: authUsers,
        error: null,
      });

      const result = await service.syncAuthUsersToDatabase(mockTenantId);

      expect(result.synced).toBe(0);
      expect(databaseService.user.create).not.toHaveBeenCalled();
    });

    it('should skip users that already exist in database', async () => {
      const authUsers = {
        users: [
          {
            id: mockUserId,
            email: 'test@example.com',
            user_metadata: {
              tenant_id: mockTenantId,
            },
          },
        ],
      };

      jest.spyOn(mockSupabaseClient.auth.admin, 'listUsers').mockResolvedValue({
        data: authUsers,
        error: null,
      });
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.syncAuthUsersToDatabase(mockTenantId);

      expect(result.synced).toBe(0);
      expect(databaseService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateUserDto = {
      first_name: 'Updated',
      last_name: 'Name',
      phone: '555-1234',
      roles: ['admin'],
    };

    it('should update user successfully', async () => {
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        updated_at: new Date(),
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue(updatedUser as any);
      jest.spyOn(mockSupabaseClient.auth.admin, 'updateUserById').mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      const result = await service.updateUser(mockTenantId, mockUserId, updateUserDto);

      expect(result.user).toBeDefined();
      expect(result.message).toBe('User updated successfully');
      expect(databaseService.user.update).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateUser(mockTenantId, 'non-existent', updateUserDto)
      ).rejects.toThrow('User not found or does not belong to tenant');
    });

    it('should encrypt sensitive fields when updating', async () => {
      const updateDtoWithSensitive = {
        ...updateUserDto,
        social_security_number: '123-45-6789',
        driver_license_number: 'DL123456',
      };

      const updatedUser = {
        ...mockUser,
        ...updateDtoWithSensitive,
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue(updatedUser as any);

      await service.updateUser(mockTenantId, mockUserId, updateDtoWithSensitive);

      expect(encryptionService.encrypt).toHaveBeenCalledWith('123-45-6789');
      expect(encryptionService.encrypt).toHaveBeenCalledWith('DL123456');
    });

    it('should update Supabase Auth metadata when roles change', async () => {
      const updateDtoWithRoles = {
        ...updateUserDto,
        roles: ['admin', 'supervisor'],
      };

      const updatedUser = {
        ...mockUser,
        ...updateDtoWithRoles,
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue(updatedUser as any);
      jest.spyOn(mockSupabaseClient.auth.admin, 'updateUserById').mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      await service.updateUser(mockTenantId, mockUserId, updateDtoWithRoles);

      expect(mockSupabaseClient.auth.admin.updateUserById).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          user_metadata: expect.objectContaining({
            roles: ['admin', 'supervisor'],
          }),
        })
      );
    });

    it('should handle Supabase Auth update failure gracefully', async () => {
      const updateDtoWithRoles = {
        ...updateUserDto,
        roles: ['admin'],
      };

      const updatedUser = {
        ...mockUser,
        ...updateDtoWithRoles,
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue(updatedUser as any);
      jest.spyOn(mockSupabaseClient.auth.admin, 'updateUserById').mockResolvedValue({
        data: null,
        error: { message: 'Auth update failed' },
      });

      // Should not throw error, should continue with database update
      const result = await service.updateUser(mockTenantId, mockUserId, updateDtoWithRoles);

      expect(result.user).toBeDefined();
    });

    it('should handle date fields correctly', async () => {
      const updateDtoWithDates = {
        hire_date: '2025-01-15',
        date_of_birth: '1990-01-01',
        driver_license_expiry: '2026-12-31',
        license_expiration_date: '2025-06-30',
      };

      const updatedUser = {
        ...mockUser,
        hire_date: new Date('2025-01-15'),
        date_of_birth: new Date('1990-01-01'),
        driver_license_expiry: new Date('2026-12-31'),
        license_expiration_date: new Date('2025-06-30'),
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue(updatedUser as any);

      const result = await service.updateUser(mockTenantId, mockUserId, updateDtoWithDates);

      expect(result.user.hire_date).toBe('2025-01-15T00:00:00.000Z');
      expect(result.user.date_of_birth).toBe('1990-01-01T00:00:00.000Z');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user and reassign jobs when reassignToUserId provided', async () => {
      const reassignToUserId = 'user-456';
      const openJobs = [
        { id: 'job-1', technician_id: mockUserId },
        { id: 'job-2', technician_id: mockUserId },
      ];
      const openWorkOrders = [
        { id: 'wo-1', assigned_to: mockUserId },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(openJobs as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue(openWorkOrders as any);
      jest.spyOn(databaseService.job, 'updateMany').mockResolvedValue({ count: 2 } as any);
      jest.spyOn(databaseService.workOrder, 'updateMany').mockResolvedValue({ count: 1 } as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      } as any);

      const result = await service.deactivateUser(mockTenantId, mockUserId, reassignToUserId);

      expect(result.user.status).toBe('inactive');
      expect(result.reassigned.jobs).toBe(2);
      expect(result.reassigned.workOrders).toBe(1);
      expect(result.unassigned.jobs).toBe(0);
      expect(databaseService.job.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { technician_id: reassignToUserId },
        })
      );
    });

    it('should deactivate user and unassign jobs when no reassignToUserId', async () => {
      const openJobs = [
        { id: 'job-1', technician_id: mockUserId },
      ];
      const openWorkOrders = [
        { id: 'wo-1', assigned_to: mockUserId },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(openJobs as any);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue(openWorkOrders as any);
      jest.spyOn(databaseService.job, 'updateMany').mockResolvedValue({ count: 1 } as any);
      jest.spyOn(databaseService.workOrder, 'updateMany').mockResolvedValue({ count: 1 } as any);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      } as any);

      const result = await service.deactivateUser(mockTenantId, mockUserId);

      expect(result.user.status).toBe('inactive');
      expect(result.reassigned.jobs).toBe(0);
      expect(result.unassigned.jobs).toBe(1);
      expect(databaseService.job.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { technician_id: null, status: 'unassigned' },
        })
      );
    });

    it('should handle user with no open jobs or work orders', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.workOrder, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.user, 'update').mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      } as any);

      const result = await service.deactivateUser(mockTenantId, mockUserId);

      expect(result.user.status).toBe('inactive');
      expect(result.reassigned.jobs).toBe(0);
      expect(result.unassigned.jobs).toBe(0);
      expect(databaseService.job.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('decryptSensitiveFields', () => {
    it('should decrypt social security number', () => {
      const userWithEncryptedSSN = {
        ...mockUser,
        social_security_number: 'encrypted_123-45-6789',
      };

      const result = service.decryptSensitiveFields(userWithEncryptedSSN);

      expect(result.social_security_number).toBe('123-45-6789');
      expect(encryptionService.decrypt).toHaveBeenCalledWith('encrypted_123-45-6789');
    });

    it('should decrypt driver license number', () => {
      const userWithEncryptedDL = {
        ...mockUser,
        driver_license_number: 'encrypted_DL123456',
      };

      const result = service.decryptSensitiveFields(userWithEncryptedDL);

      expect(result.driver_license_number).toBe('DL123456');
      expect(encryptionService.decrypt).toHaveBeenCalledWith('encrypted_DL123456');
    });

    it('should handle decryption errors gracefully', () => {
      const userWithEncryptedSSN = {
        ...mockUser,
        social_security_number: 'encrypted_123-45-6789',
      };

      jest.spyOn(encryptionService, 'decrypt').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      const result = service.decryptSensitiveFields(userWithEncryptedSSN);

      expect(result.social_security_number).toBeNull();
    });

    it('should return user unchanged when no encrypted fields', () => {
      const result = service.decryptSensitiveFields(mockUser);

      expect(result).toEqual(mockUser);
      expect(encryptionService.decrypt).not.toHaveBeenCalled();
    });
  });
});

