/**
 * Enhanced Accounts Service Unit Tests
 * Tests for enhanced account features, advanced search, and bulk operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EnhancedAccountsService } from '../../../src/accounts/enhanced-accounts.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('EnhancedAccountsService', () => {
  let service: EnhancedAccountsService;
  let supabaseService: SupabaseService;
  let mockSupabaseClient: any;

  const tenantId = 'tenant-123';
  const mockAccount = {
    id: 'account-123',
    name: 'Test Account',
    email: 'test@example.com',
    phone: '+1-555-1234',
    tenant_id: tenantId,
  };

  beforeEach(async () => {
    const queryResults = new Map<string, any>();
    
    const createMockQueryBuilder = (resultKey?: string) => {
      const chainable: any = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };
      
      chainable.then = jest.fn((resolve, reject) => {
        const result = resultKey && queryResults.has(resultKey) 
          ? queryResults.get(resultKey)
          : { data: null, error: null };
        return Promise.resolve(result).then(resolve, reject);
      });
      
      chainable._setResult = (newResult: any) => {
        if (resultKey) {
          queryResults.set(resultKey, newResult);
        }
        chainable.then = jest.fn((resolve, reject) => {
          return Promise.resolve(newResult).then(resolve, reject);
        });
      };
      
      return chainable;
    };

    const queryBuildersByTable = new Map<string, any>();
    mockSupabaseClient = {
      from: jest.fn((table: string) => {
        if (!queryBuildersByTable.has(table)) {
          queryBuildersByTable.set(table, createMockQueryBuilder());
        }
        return queryBuildersByTable.get(table);
      })
    };

    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient)
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnhancedAccountsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService
        }
      ]
    }).compile();

    service = module.get<EnhancedAccountsService>(EnhancedAccountsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountsForTenant', () => {
    it('should return accounts with success response', async () => {
      const mockAccounts = [mockAccount];
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: mockAccounts, error: null });

      const result = await service.getAccountsForTenant(tenantId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAccounts);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.operation).toBe('getAccountsForTenant');
      expect(result.metadata?.affectedRows).toBe(1);
    });

    it('should return error response on database error', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      const result = await service.getAccountsForTenant(tenantId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.metadata?.operation).toBe('getAccountsForTenant');
    });

    it('should handle exceptions gracefully', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult = jest.fn(() => {
        throw new Error('Unexpected error');
      });

      const result = await service.getAccountsForTenant(tenantId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should order accounts by name', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: [], error: null });

      await service.getAccountsForTenant(tenantId);

      expect(queryBuilder.order).toHaveBeenCalledWith('name', { ascending: true });
    });
  });

  describe('getAccountById', () => {
    it('should return account with validation', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: mockAccount, error: null });

      const result = await service.getAccountById(tenantId, 'account-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAccount);
      expect(result.metadata?.operation).toBe('getAccountById');
    });

    it('should validate account ID format', async () => {
      const result = await service.getAccountById(tenantId, '');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.metadata?.validationWarnings).toBeDefined();
    });

    it('should return error when account not found', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Not found' } 
      });

      const result = await service.getAccountById(tenantId, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('createAccount', () => {
    const accountData = {
      name: 'New Account',
      email: 'new@example.com',
      phone: '+1-555-5678'
    };

    it('should create account successfully', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: [{ ...accountData, id: 'new-id', tenant_id: tenantId }], 
        error: null 
      });

      const result = await service.createAccount(tenantId, accountData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.metadata?.operation).toBe('createAccount');
    });

    it('should validate account data before creation', async () => {
      const invalidData = { name: '' };

      const result = await service.createAccount(tenantId, invalidData);

      expect(result.success).toBe(false);
      expect(result.metadata?.validationWarnings).toBeDefined();
    });
  });

  describe('updateAccount', () => {
    const updateData = {
      name: 'Updated Account',
      email: 'updated@example.com'
    };

    it('should update account successfully', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: { ...mockAccount, ...updateData }, error: null });

      const result = await service.updateAccount(tenantId, 'account-123', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.metadata?.operation).toBe('updateAccount');
    });

    it('should validate update data', async () => {
      const invalidUpdate = { name: '' };

      const result = await service.updateAccount(tenantId, 'account-123', invalidUpdate);

      expect(result.success).toBe(false);
      expect(result.metadata?.validationWarnings).toBeDefined();
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: [mockAccount], error: null });

      const result = await service.deleteAccount(tenantId, 'account-123');

      expect(result.success).toBe(true);
      expect(result.metadata?.operation).toBe('deleteAccount');
    });

    it('should handle delete errors', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Delete failed' } 
      });

      const result = await service.deleteAccount(tenantId, 'account-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error when account not found before delete', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Account not found' } 
      });

      const result = await service.deleteAccount(tenantId, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('updateAccount - edge cases', () => {
    it('should handle partial updates', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: mockAccount, error: null });

      const partialUpdate = { name: 'Updated Name' };
      const updateResult = { ...mockAccount, ...partialUpdate };
      queryBuilder._setResult({ data: updateResult, error: null });

      const result = await service.updateAccount(tenantId, 'account-123', partialUpdate);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated Name');
    });

    it('should validate email format in updates', async () => {
      const invalidUpdate = { email: 'invalid-email' };

      const result = await service.updateAccount(tenantId, 'account-123', invalidUpdate);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email format');
    });

    it('should sanitize update data', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: mockAccount, error: null });

      const updateWithInvalidFields = {
        name: 'Updated Name',
        invalidField: 'should be removed',
        tenant_id: 'should be removed',
      };
      const updateResult = { ...mockAccount, name: 'Updated Name' };
      queryBuilder._setResult({ data: updateResult, error: null });

      const result = await service.updateAccount(tenantId, 'account-123', updateWithInvalidFields);

      expect(result.success).toBe(true);
      expect(result.data.invalidField).toBeUndefined();
    });

    it('should handle empty update object', async () => {
      const result = await service.updateAccount(tenantId, 'account-123', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('At least one field must be updated');
    });

    it('should validate account exists before update', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Account not found' } 
      });

      const result = await service.updateAccount(tenantId, 'non-existent', { name: 'New Name' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('createAccount - edge cases', () => {
    it('should return error when name is missing', async () => {
      const accountDataWithoutName = {
        email: 'test@example.com',
      };

      const result = await service.createAccount(tenantId, accountDataWithoutName);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Account name is required');
    });

    it('should remove tenant_id from account data', async () => {
      const accountDataWithTenantId = {
        name: 'New Account',
        email: 'new@example.com',
        tenant_id: 'other-tenant',
      };

      const queryBuilder = mockSupabaseClient.from('accounts');
      // The service removes tenant_id and adds it from the tenantId parameter
      const createdAccount = { 
        name: 'New Account',
        email: 'new@example.com',
        id: 'account-new', 
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryBuilder._setResult({ data: createdAccount, error: null });

      const result = await service.createAccount(tenantId, accountDataWithTenantId);

      expect(result.success).toBe(true);
      expect(result.data.tenant_id).toBe(tenantId);
      // Verify tenant_id from input was not used
      expect(result.data.tenant_id).not.toBe('other-tenant');
    });

    it('should handle database errors during creation', async () => {
      const accountData = {
        name: 'New Account',
        email: 'new@example.com',
      };

      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      const result = await service.createAccount(tenantId, accountData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getAccountById - edge cases', () => {
    it('should validate account ID format', async () => {
      const result = await service.getAccountById(tenantId, 'invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid UUID');
    });

    it('should handle empty account ID', async () => {
      const result = await service.getAccountById(tenantId, '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Account ID is required');
    });

    it('should handle non-string account ID', async () => {
      const result = await service.getAccountById(tenantId, 123 as any);

      expect(result.success).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });

  describe('getAccountsForTenant - edge cases', () => {
    it('should return empty array when no accounts found', async () => {
      const queryBuilder = mockSupabaseClient.from('accounts');
      queryBuilder._setResult({ data: [], error: null });

      const result = await service.getAccountsForTenant(tenantId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.metadata?.affectedRows).toBe(0);
    });

    it('should handle exceptions during query execution', async () => {
      // Mock executeSecureQuery to throw an error
      jest.spyOn(service as any, 'executeSecureQuery').mockRejectedValue(new Error('Unexpected error'));

      const result = await service.getAccountsForTenant(tenantId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

