/**
 * CRM Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CrmController } from '../../../src/crm/crm.controller';
import { CrmService } from '../../../src/crm/crm.service';
import { CreateNoteDto, UpdateNoteDto } from '../../../src/crm/dto';

describe('CrmController', () => {
  let controller: CrmController;
  let crmService: CrmService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
    id: 'user-123',
  };

  const mockAccount = {
    id: 'account-123',
    name: 'Test Account',
    email: 'test@example.com',
    tenant_id: mockUser.tenantId,
  };

  const mockNote = {
    id: 'note-123',
    customer_id: 'customer-123',
    note_content: 'Test note',
    created_by: 'John Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrmController],
      providers: [
        {
          provide: CrmService,
          useValue: {
            getAccounts: jest.fn(),
            createAccount: jest.fn(),
            testSupabaseConnection: jest.fn(),
            getCustomerNotes: jest.fn(),
            getCustomerNote: jest.fn(),
            createCustomerNote: jest.fn(),
            updateCustomerNote: jest.fn(),
            deleteCustomerNote: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CrmController>(CrmController);
    crmService = module.get<CrmService>(CrmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return accounts', async () => {
      jest.spyOn(crmService, 'getAccounts').mockResolvedValue([mockAccount] as any);

      const result = await controller.getAccounts({ user: mockUser } as any);

      expect(result).toEqual([mockAccount]);
      expect(crmService.getAccounts).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      const accountData = {
        name: 'New Account',
        email: 'new@example.com',
      };

      jest.spyOn(crmService, 'createAccount').mockResolvedValue(mockAccount as any);

      const result = await controller.createAccount(accountData, { user: mockUser } as any);

      expect(result).toEqual(mockAccount);
      expect(crmService.createAccount).toHaveBeenCalledWith(accountData, mockUser.tenantId);
    });
  });

  describe('test', () => {
    it('should return test message', async () => {
      const result = await controller.test();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result.message).toBe('CRM Controller is working');
    });
  });

  describe('testSupabase', () => {
    it('should return success when connection works', async () => {
      jest.spyOn(crmService, 'testSupabaseConnection').mockResolvedValue({
        success: true,
        message: 'Supabase connection working',
      });

      const result = await controller.testSupabase();

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('successful');
    });

    it('should return error when connection fails', async () => {
      jest.spyOn(crmService, 'testSupabaseConnection').mockRejectedValue(new Error('Connection failed'));

      const result = await controller.testSupabase();

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('failed');
    });
  });

  describe('getCustomerNotes', () => {
    it('should return customer notes', async () => {
      jest.spyOn(crmService, 'getCustomerNotes').mockResolvedValue([mockNote] as any);

      const result = await controller.getCustomerNotes('customer-123', { user: mockUser } as any);

      expect(result).toEqual([mockNote]);
      expect(crmService.getCustomerNotes).toHaveBeenCalledWith('customer-123', mockUser.tenantId);
    });
  });

  describe('getCustomerNote', () => {
    it('should return note by ID', async () => {
      jest.spyOn(crmService, 'getCustomerNote').mockResolvedValue(mockNote as any);

      const result = await controller.getCustomerNote('note-123', { user: mockUser } as any);

      expect(result).toEqual(mockNote);
      expect(crmService.getCustomerNote).toHaveBeenCalledWith('note-123', mockUser.tenantId);
    });
  });

  describe('createCustomerNote', () => {
    it('should create note successfully', async () => {
      const createNoteDto: CreateNoteDto = {
        note_type: 'general',
        note_content: 'Test note',
        priority: 'high',
      };

      jest.spyOn(crmService, 'createCustomerNote').mockResolvedValue(mockNote as any);

      const result = await controller.createCustomerNote(
        'customer-123',
        createNoteDto,
        { user: mockUser } as any
      );

      expect(result).toEqual(mockNote);
      expect(crmService.createCustomerNote).toHaveBeenCalledWith(
        'customer-123',
        createNoteDto,
        mockUser.tenantId,
        mockUser.id
      );
    });
  });

  describe('updateCustomerNote', () => {
    it('should update note successfully', async () => {
      const updateNoteDto: UpdateNoteDto = {
        note_content: 'Updated content',
        priority: 'high',
      };

      const updatedNote = { ...mockNote, ...updateNoteDto };
      jest.spyOn(crmService, 'updateCustomerNote').mockResolvedValue(updatedNote as any);

      const result = await controller.updateCustomerNote(
        'note-123',
        updateNoteDto,
        { user: mockUser } as any
      );

      expect(result).toEqual(updatedNote);
      expect(crmService.updateCustomerNote).toHaveBeenCalledWith(
        'note-123',
        updateNoteDto,
        mockUser.tenantId
      );
    });
  });

  describe('deleteCustomerNote', () => {
    it('should delete note successfully', async () => {
      jest.spyOn(crmService, 'deleteCustomerNote').mockResolvedValue(mockNote as any);

      const result = await controller.deleteCustomerNote('note-123', { user: mockUser } as any);

      expect(result).toEqual(mockNote);
      expect(crmService.deleteCustomerNote).toHaveBeenCalledWith('note-123', mockUser.tenantId);
    });
  });
});

