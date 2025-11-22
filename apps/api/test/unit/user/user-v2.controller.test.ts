/**
 * User V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced features and backward compatibility
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserV2Controller } from '../../../src/user/user-v2.controller';
import { UserService } from '../../../src/user/user.service';
import { UserMetricsService } from '../../../src/user/user-metrics.service';
import { ImportExportService } from '../../../src/user/import-export.service';
import { SessionService } from '../../../src/auth/session.service';

describe('UserV2Controller', () => {
  let controller: UserV2Controller;
  let userService: UserService;

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
      controllers: [UserV2Controller],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            createUser: jest.fn(),
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
          },
        },
      ],
    }).compile();

    controller = module.get<UserV2Controller>(UserV2Controller);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users with V2 response format', async () => {
      jest.spyOn(userService, 'getUsers').mockResolvedValue(mockUsersResponse as any);

      const result = await controller.getUsers({ user: mockUser, tenantId: mockUser.tenantId } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.timestamp).toBeDefined();
      expect(result.data).toEqual(mockUsersResponse);
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User',
    };

    it('should create user with V2 response format', async () => {
      const mockCreatedUser = { id: 'new-user-id', ...createUserDto };
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockCreatedUser as any);

      const result = await controller.createUser(
        { user: mockUser, tenantId: mockUser.tenantId } as any,
        createUserDto
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockCreatedUser);
    });
  });
});

