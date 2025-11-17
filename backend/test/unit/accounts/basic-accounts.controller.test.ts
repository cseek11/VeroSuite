/**
 * Basic Accounts Controller Unit Tests
 * Tests for basic API endpoints and simplified operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BasicAccountsController } from '../../../src/accounts/basic-accounts.controller';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('BasicAccountsController', () => {
  let controller: BasicAccountsController;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    mockSupabaseClient = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        or: jest.fn().mockReturnThis(),
      })),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasicAccountsController],
    }).compile();

    controller = module.get<BasicAccountsController>(BasicAccountsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return error when no authorization token provided', async () => {
      const result = await controller.getAccounts({
        headers: {},
      } as any);

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('No valid authorization token');
    });

    it('should return error when token format is invalid', async () => {
      const result = await controller.getAccounts({
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as any);

      expect(result).toHaveProperty('error');
    });

    it('should extract tenant ID from JWT token', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJ0ZW5hbnQtMTIzIn0.signature';
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await controller.getAccounts({
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      } as any);

      expect(queryBuilder.eq).toHaveBeenCalledWith('tenant_id', 'tenant-123');
    });

    it('should return accounts for tenant', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJ0ZW5hbnQtMTIzIn0.signature';
      const mockAccounts = [{ id: 'account-123', name: 'Test Account' }];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockAccounts, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.getAccounts({
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      } as any);

      expect(result).toEqual(mockAccounts);
    });

    it('should handle database errors', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJ0ZW5hbnQtMTIzIn0.signature';
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.getAccounts({
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      } as any);

      expect(result).toHaveProperty('error');
    });
  });

  describe('searchAccounts', () => {
    it('should search accounts by term', async () => {
      const mockAccounts = [{ id: 'account-123', name: 'Test Account' }];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockAccounts, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.searchAccounts('test');

      expect(result).toEqual(mockAccounts);
      expect(queryBuilder.or).toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Search failed' } }),
      };

      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await controller.searchAccounts('test');

      expect(result).toHaveProperty('error');
    });
  });
});

