import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../common/services/database.service';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    admin: {
      listUsers: jest.fn(),
      createUser: jest.fn(),
    },
  },
};

// Mock createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// Mock DatabaseService
const mockDatabaseService = {
  public_users: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
      tenant_id: 'tenant-123',
      roles: ['dispatcher'],
      first_name: 'Test',
      last_name: 'User',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
        data: { users: [mockUser] },
        error: null,
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        password_hash: '',
        first_name: mockUser.user_metadata.first_name,
        last_name: mockUser.user_metadata.last_name,
        tenant_id: mockUser.user_metadata.tenant_id,
        roles: mockUser.user_metadata.roles,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      });

      expect(mockSupabaseClient.auth.admin.listUsers).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
        data: { users: [] },
        error: null,
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return null when database error occurs', async () => {
      mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
        data: { users: [] },
        error: { message: 'Database error' },
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.auth.admin.listUsers.mockRejectedValue(new Error('Network error'));

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });
});