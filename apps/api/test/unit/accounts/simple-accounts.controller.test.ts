/**
 * Simple Accounts Controller Unit Tests
 * Tests for simple operations and minimal API surface
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SimpleAccountsController } from '../../../src/accounts/simple-accounts.controller';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('SimpleAccountsController', () => {
  let controller: SimpleAccountsController;
  let supabaseService: SupabaseService;
  let mockSupabaseClient: any;

  const mockAccount = {
    id: 'account-123',
    name: 'Test Account',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockAccount, error: null }),
        limit: jest.fn().mockResolvedValue({ data: [mockAccount], error: null }),
        or: jest.fn().mockReturnThis(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimpleAccountsController],
      providers: [
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    controller = module.get<SimpleAccountsController>(SimpleAccountsController);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return all accounts', async () => {
      const result = await controller.getAccounts();

      expect(result).toEqual([mockAccount]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('accounts');
    });

    it('should handle database errors', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.getAccounts()).rejects.toThrow('Failed to fetch accounts');
    });
  });

  describe('searchAccounts', () => {
    it('should search accounts by term', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [mockAccount], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.searchAccounts('test');

      expect(result).toEqual([mockAccount]);
      expect(queryBuilder.or).toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Search failed' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.searchAccounts('test')).rejects.toThrow('Failed to search accounts');
    });
  });

  describe('getAccount', () => {
    it('should return account by ID', async () => {
      const result = await controller.getAccount('account-123');

      expect(result).toEqual(mockAccount);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('accounts');
    });

    it('should handle account not found', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.getAccount('non-existent')).rejects.toThrow('Failed to fetch account');
    });
  });

  describe('createAccount', () => {
    const accountData = {
      name: 'New Account',
      email: 'new@example.com',
    };

    it('should create account successfully', async () => {
      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...accountData, id: 'new-id' },
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.createAccount(accountData);

      expect(result).toBeDefined();
      expect(result.id).toBe('new-id');
    });

    it('should add default tenant_id when not provided', async () => {
      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...accountData, id: 'new-id' },
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await controller.createAccount(accountData);

      expect(queryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_id: expect.any(String),
        })
      );
    });

    it('should handle creation errors', async () => {
      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Creation failed' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.createAccount(accountData)).rejects.toThrow('Failed to create account');
    });
  });

  describe('updateAccount', () => {
    const updateData = {
      name: 'Updated Account',
    };

    it('should update account successfully', async () => {
      const queryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockAccount, ...updateData },
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.updateAccount('account-123', updateData);

      expect(result.name).toBe('Updated Account');
    });

    it('should handle update errors', async () => {
      const queryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.updateAccount('account-123', updateData)).rejects.toThrow(
        'Failed to update account'
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockAccount,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.deleteAccount('account-123');

      expect(result).toEqual(mockAccount);
    });

    it('should handle delete errors', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Delete failed' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(controller.deleteAccount('account-123')).rejects.toThrow('Failed to delete account');
    });
  });
});

