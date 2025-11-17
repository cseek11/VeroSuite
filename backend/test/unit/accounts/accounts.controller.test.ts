/**
 * Accounts Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from '../../../src/accounts/accounts.controller';
import { AccountsService } from '../../../src/accounts/accounts.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockAccount = {
    id: 'account-123',
    name: 'Test Account',
    email: 'test@example.com',
    tenant_id: mockUser.tenantId,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            getAccountsForTenant: jest.fn(),
            getAccountById: jest.fn(),
            createAccount: jest.fn(),
            updateAccount: jest.fn(),
            deleteAccount: jest.fn(),
            searchAccounts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return accounts for tenant', async () => {
      jest.spyOn(accountsService, 'getAccountsForTenant').mockResolvedValue({
        data: [mockAccount],
        total: 1,
      } as any);

      const result = await controller.getAccounts({ user: mockUser } as any);

      expect(result).toBeDefined();
      expect(accountsService.getAccountsForTenant).toHaveBeenCalledWith(mockUser.tenantId);
    });

    it('should use default tenant ID when not in user context', async () => {
      jest.spyOn(accountsService, 'getAccountsForTenant').mockResolvedValue({
        data: [],
        total: 0,
      } as any);

      await controller.getAccounts({ user: {} } as any);

      expect(accountsService.getAccountsForTenant).toHaveBeenCalled();
    });
  });

  describe('searchAccounts', () => {
    it('should search accounts by term', async () => {
      jest.spyOn(accountsService, 'searchAccounts').mockResolvedValue([mockAccount] as any);

      const result = await controller.searchAccounts(
        { user: mockUser } as any,
        'test'
      );

      expect(result).toEqual([mockAccount]);
      expect(accountsService.searchAccounts).toHaveBeenCalledWith(mockUser.tenantId, 'test');
    });
  });

  describe('createAccount', () => {
    const createAccountDto = {
      name: 'New Account',
      email: 'new@example.com',
    };

    it('should create account successfully', async () => {
      jest.spyOn(accountsService, 'createAccount').mockResolvedValue([mockAccount] as any);

      const result = await controller.createAccount(
        { user: mockUser } as any,
        createAccountDto
      );

      expect(result).toBeDefined();
      expect(accountsService.createAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        createAccountDto
      );
    });
  });

  describe('updateAccount', () => {
    const updateData = {
      name: 'Updated Account',
    };

    it('should update account successfully', async () => {
      jest.spyOn(accountsService, 'updateAccount').mockResolvedValue(mockAccount as any);

      const result = await controller.updateAccount(
        { user: mockUser } as any,
        'account-123',
        updateData
      );

      expect(result).toBeDefined();
      expect(accountsService.updateAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        'account-123',
        expect.objectContaining(updateData)
      );
    });

    it('should sanitize update fields', async () => {
      const updateDataWithInvalidFields = {
        name: 'Updated',
        invalid_field: 'should be removed',
        tenant_id: 'should be removed',
      };

      jest.spyOn(accountsService, 'updateAccount').mockResolvedValue(mockAccount as any);

      await controller.updateAccount(
        { user: mockUser } as any,
        'account-123',
        updateDataWithInvalidFields
      );

      expect(accountsService.updateAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        'account-123',
        expect.not.objectContaining({
          invalid_field: expect.anything(),
          tenant_id: expect.anything(),
        })
      );
    });

    it('should normalize phone_number to phone', async () => {
      const updateData = {
        phone_number: '+1-555-1234',
      };

      jest.spyOn(accountsService, 'updateAccount').mockResolvedValue(mockAccount as any);

      await controller.updateAccount(
        { user: mockUser } as any,
        'account-123',
        updateData
      );

      expect(accountsService.updateAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        'account-123',
        expect.objectContaining({
          phone: '+1-555-1234',
        })
      );
    });

    it('should normalize zipCode to zip_code', async () => {
      const updateData = {
        zipCode: '12345',
      };

      jest.spyOn(accountsService, 'updateAccount').mockResolvedValue(mockAccount as any);

      await controller.updateAccount(
        { user: mockUser } as any,
        'account-123',
        updateData
      );

      expect(accountsService.updateAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        'account-123',
        expect.objectContaining({
          zip_code: '12345',
        })
      );
    });

    it('should return error response when update fails', async () => {
      jest.spyOn(accountsService, 'updateAccount').mockResolvedValue({
        error: 'Update failed',
      } as any);

      const result = await controller.updateAccount(
        { user: mockUser } as any,
        'account-123',
        { name: 'Updated' }
      );

      expect(result).toHaveProperty('statusCode', 400);
      expect(result).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      jest.spyOn(accountsService, 'deleteAccount').mockResolvedValue([mockAccount] as any);

      const result = await controller.deleteAccount(
        { user: mockUser } as any,
        'account-123'
      );

      expect(result).toBeDefined();
      expect(accountsService.deleteAccount).toHaveBeenCalledWith(
        mockUser.tenantId,
        'account-123'
      );
    });
  });
});

