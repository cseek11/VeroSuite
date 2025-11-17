/**
 * User Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/user/user.controller';
import { UserService } from '../../../src/user/user.service';
import { UserMetricsService } from '../../../src/user/user-metrics.service';
import { ImportExportService } from '../../../src/user/import-export.service';
import { SessionService } from '../../../src/auth/session.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let metricsService: UserMetricsService;
  let importExportService: ImportExportService;
  let sessionService: SessionService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
    email: 'test@example.com',
  };

  const mockUsersResponse = {
    users: [
      {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            syncAuthUsersToDatabase: jest.fn(),
          },
        },
        {
          provide: UserMetricsService,
          useValue: {
            getUserMetrics: jest.fn(),
          },
        },
        {
          provide: ImportExportService,
          useValue: {
            exportUsers: jest.fn(),
            importUsers: jest.fn(),
          },
        },
        {
          provide: SessionService,
          useValue: {
            getActiveSessions: jest.fn(),
            revokeSession: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    metricsService = module.get<UserMetricsService>(UserMetricsService);
    importExportService = module.get<ImportExportService>(ImportExportService);
    sessionService = module.get<SessionService>(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users for tenant', async () => {
      jest.spyOn(userService, 'getUsers').mockResolvedValue(mockUsersResponse as any);

      const result = await controller.getUsers({ user: mockUser, tenantId: mockUser.tenantId } as any);

      expect(result).toEqual(mockUsersResponse);
      expect(userService.getUsers).toHaveBeenCalledWith(mockUser.tenantId);
    });

    it('should use tenantId from request', async () => {
      jest.spyOn(userService, 'getUsers').mockResolvedValue(mockUsersResponse as any);

      await controller.getUsers({ user: mockUser, tenantId: 'different-tenant' } as any);

      expect(userService.getUsers).toHaveBeenCalledWith('different-tenant');
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User',
      password: 'password123',
    };

    it('should create user successfully', async () => {
      const mockCreatedUser = { id: 'new-user-id', ...createUserDto };
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockCreatedUser as any);

      const result = await controller.createUser(
        { user: mockUser, tenantId: mockUser.tenantId } as any,
        createUserDto
      );

      expect(result).toEqual(mockCreatedUser);
      expect(userService.createUser).toHaveBeenCalledWith(mockUser.tenantId, createUserDto);
    });
  });

  describe('syncUsers', () => {
    it('should sync users from Supabase Auth', async () => {
      const mockSyncResult = { synced: 5, users: [] };
      jest.spyOn(userService, 'syncAuthUsersToDatabase').mockResolvedValue(mockSyncResult as any);

      const result = await controller.syncUsers({ user: mockUser, tenantId: mockUser.tenantId } as any);

      expect(result).toEqual(mockSyncResult);
      expect(userService.syncAuthUsersToDatabase).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });
});

