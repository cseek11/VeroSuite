/**
 * CRM Service Unit Tests
 * Tests for account operations and customer notes CRUD
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CrmService } from '../../../src/crm/crm.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { CreateNoteDto, UpdateNoteDto } from '../../../src/crm/dto';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('CrmService', () => {
  let service: CrmService;
  let databaseService: DatabaseService;
  let mockSupabaseClient: any;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockCustomerId = 'customer-123';
  const mockNoteId = 'note-123';

  const mockAccount = {
    id: 'account-123',
    name: 'Test Account',
    email: 'test@example.com',
    phone: '123-456-7890',
    tenant_id: mockTenantId,
  };

  const mockNote = {
    id: mockNoteId,
    customer_id: mockCustomerId,
    tenant_id: mockTenantId,
    note_type: 'general',
    note_content: 'Test note content',
    created_by: 'John Doe',
    priority: 'low',
    is_alert: false,
    is_internal: false,
    created_at: new Date(),
  };

  const mockUser = {
    id: mockUserId,
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [mockAccount], error: null }),
      limit: jest.fn().mockResolvedValue({ data: null, error: null }),
    };

    mockSupabaseClient = {
      from: jest.fn().mockReturnValue(queryBuilder),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        {
          provide: DatabaseService,
          useValue: {
            account: {
              create: jest.fn(),
            },
            customerNote: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CrmService>(CrmService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return accounts from Supabase', async () => {
      const connectionTestBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      const accountsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockAccount], error: null }),
      };
      
      mockSupabaseClient.from
        .mockReturnValueOnce(connectionTestBuilder) // Connection test
        .mockReturnValueOnce(accountsQueryBuilder); // Actual query

      const result = await service.getAccounts(mockTenantId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('accounts');
    });

    it('should filter by tenant when tenantId provided', async () => {
      const accounts = [
        { ...mockAccount, tenant_id: mockTenantId },
        { ...mockAccount, id: 'account-456', tenant_id: 'other-tenant' },
      ];

      const connectionTestBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      const accountsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: accounts, error: null }),
      };
      
      mockSupabaseClient.from
        .mockReturnValueOnce(connectionTestBuilder)
        .mockReturnValueOnce(accountsQueryBuilder);

      const result = await service.getAccounts(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0].tenant_id).toBe(mockTenantId);
    });

    it('should handle Supabase errors', async () => {
      const connectionTestBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Connection failed' } }),
      };
      mockSupabaseClient.from.mockReturnValue(connectionTestBuilder);

      await expect(service.getAccounts(mockTenantId)).rejects.toThrow(BadRequestException);
    });

    it('should return empty array when no accounts', async () => {
      const connectionTestBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      const accountsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      
      mockSupabaseClient.from
        .mockReturnValueOnce(connectionTestBuilder)
        .mockReturnValueOnce(accountsQueryBuilder);

      const result = await service.getAccounts(mockTenantId);

      expect(result).toEqual([]);
    });
  });

  describe('createAccount', () => {
    const accountData = {
      name: 'New Account',
      email: 'new@example.com',
      phone: '123-456-7890',
    };

    it('should create account successfully', async () => {
      jest.spyOn(databaseService.account, 'create').mockResolvedValue(mockAccount as any);

      const result = await service.createAccount(accountData, mockTenantId);

      expect(result).toEqual(mockAccount);
      expect(databaseService.account.create).toHaveBeenCalledWith({
        data: {
          ...accountData,
          tenant_id: mockTenantId,
        },
      });
    });

    it('should handle creation errors', async () => {
      jest.spyOn(databaseService.account, 'create').mockRejectedValue(new Error('Database error'));

      await expect(service.createAccount(accountData, mockTenantId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('testSupabaseConnection', () => {
    it('should return success when connection works', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await service.testSupabaseConnection();

      expect(result).toEqual({ success: true, message: 'Supabase connection working' });
    });

    it('should throw error when connection fails', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Connection failed' } }),
      };
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(service.testSupabaseConnection()).rejects.toThrow();
    });
  });

  describe('getCustomerNotes', () => {
    it('should return customer notes', async () => {
      jest.spyOn(databaseService.customerNote, 'findMany').mockResolvedValue([mockNote] as any);

      const result = await service.getCustomerNotes(mockCustomerId, mockTenantId);

      expect(result).toEqual([mockNote]);
      expect(databaseService.customerNote.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenantId,
          customer_id: mockCustomerId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('should return empty array when no notes', async () => {
      jest.spyOn(databaseService.customerNote, 'findMany').mockResolvedValue([]);

      const result = await service.getCustomerNotes(mockCustomerId, mockTenantId);

      expect(result).toEqual([]);
    });
  });

  describe('getCustomerNote', () => {
    it('should return note by ID', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(mockNote as any);

      const result = await service.getCustomerNote(mockNoteId, mockTenantId);

      expect(result).toEqual(mockNote);
      expect(databaseService.customerNote.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockNoteId,
          tenant_id: mockTenantId,
        },
      });
    });

    it('should throw NotFoundException when note not found', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(null);

      await expect(service.getCustomerNote('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createCustomerNote', () => {
    const createNoteDto: CreateNoteDto = {
      note_type: 'general',
      note_content: 'Test note',
      priority: 'high',
      is_alert: true,
    };

    it('should create note successfully', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.customerNote, 'create').mockResolvedValue(mockNote as any);

      const result = await service.createCustomerNote(
        mockCustomerId,
        createNoteDto,
        mockTenantId,
        mockUserId
      );

      expect(result).toBeDefined();
      expect(databaseService.customerNote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customer_id: mockCustomerId,
            tenant_id: mockTenantId,
            note_content: createNoteDto.note_content,
            created_by: 'John Doe',
          }),
        })
      );
    });

    it('should throw BadRequestException when user not found', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.createCustomerNote(mockCustomerId, createNoteDto, mockTenantId, 'non-existent')
      ).rejects.toThrow(BadRequestException);
    });

    it('should use default values for optional fields', async () => {
      const minimalDto: CreateNoteDto = {
        note_type: 'general',
        note_content: 'Test note',
      };

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.customerNote, 'create').mockResolvedValue(mockNote as any);

      await service.createCustomerNote(mockCustomerId, minimalDto, mockTenantId, mockUserId);

      expect(databaseService.customerNote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            note_source: 'office',
            priority: 'low',
            is_alert: false,
            is_internal: false,
          }),
        })
      );
    });
  });

  describe('updateCustomerNote', () => {
    const updateNoteDto: UpdateNoteDto = {
      note_content: 'Updated content',
      priority: 'high',
    };

    it('should update note successfully', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(mockNote as any);
      jest
        .spyOn(databaseService.customerNote, 'update')
        .mockResolvedValue({ ...mockNote, ...updateNoteDto } as any);

      const result = await service.updateCustomerNote(mockNoteId, updateNoteDto, mockTenantId);

      expect(result).toBeDefined();
      expect(result.note_content).toBe('Updated content');
      expect(databaseService.customerNote.update).toHaveBeenCalledWith({
        where: { id: mockNoteId },
        data: updateNoteDto,
      });
    });

    it('should throw NotFoundException when note not found', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateCustomerNote('non-existent', updateNoteDto, mockTenantId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle null values for optional fields', async () => {
      const updateWithNulls: UpdateNoteDto = {
        technician_id: null,
        work_order_id: null,
      };

      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(mockNote as any);
      jest.spyOn(databaseService.customerNote, 'update').mockResolvedValue(mockNote as any);

      await service.updateCustomerNote(mockNoteId, updateWithNulls, mockTenantId);

      expect(databaseService.customerNote.update).toHaveBeenCalledWith({
        where: { id: mockNoteId },
        data: {
          technician_id: null,
          work_order_id: null,
        },
      });
    });
  });

  describe('deleteCustomerNote', () => {
    it('should delete note successfully', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(mockNote as any);
      jest.spyOn(databaseService.customerNote, 'delete').mockResolvedValue(mockNote as any);

      const result = await service.deleteCustomerNote(mockNoteId, mockTenantId);

      expect(result).toEqual(mockNote);
      expect(databaseService.customerNote.delete).toHaveBeenCalledWith({
        where: { id: mockNoteId },
      });
    });

    it('should throw NotFoundException when note not found', async () => {
      jest.spyOn(databaseService.customerNote, 'findFirst').mockResolvedValue(null);

      await expect(service.deleteCustomerNote('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

