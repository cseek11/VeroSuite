/**
 * CRM V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced response format
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CrmV2Controller } from '../../../src/crm/crm-v2.controller';
import { CrmService } from '../../../src/crm/crm.service';
import { CreateNoteDto, UpdateNoteDto } from '../../../src/crm/dto';

describe('CrmV2Controller', () => {
  let controller: CrmV2Controller;
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
      controllers: [CrmV2Controller],
      providers: [
        {
          provide: CrmService,
          useValue: {
            getAccounts: jest.fn(),
            createAccount: jest.fn(),
            getCustomerNotes: jest.fn(),
            getCustomerNote: jest.fn(),
            createCustomerNote: jest.fn(),
            updateCustomerNote: jest.fn(),
            deleteCustomerNote: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CrmV2Controller>(CrmV2Controller);
    crmService = module.get<CrmService>(CrmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return accounts with V2 response format', async () => {
      jest.spyOn(crmService, 'getAccounts').mockResolvedValue([mockAccount] as any);

      const result = await controller.getAccounts({ user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockAccount]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(result.meta).toHaveProperty('timestamp');
      expect(crmService.getAccounts).toHaveBeenCalledWith(mockUser.tenantId);
    });

    it('should return count of 0 when no accounts', async () => {
      jest.spyOn(crmService, 'getAccounts').mockResolvedValue([]);

      const result = await controller.getAccounts({ user: mockUser } as any);

      expect(result.meta.count).toBe(0);
    });
  });

  describe('createAccount', () => {
    it('should create account with V2 response format', async () => {
      const accountData = {
        name: 'New Account',
        email: 'new@example.com',
      };

      jest.spyOn(crmService, 'createAccount').mockResolvedValue(mockAccount as any);

      const result = await controller.createAccount(accountData, { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockAccount);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
      expect(crmService.createAccount).toHaveBeenCalledWith(accountData, mockUser.tenantId);
    });
  });

  describe('getCustomerNotes', () => {
    it('should return customer notes with V2 response format', async () => {
      jest.spyOn(crmService, 'getCustomerNotes').mockResolvedValue([mockNote] as any);

      const result = await controller.getCustomerNotes('customer-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockNote]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(crmService.getCustomerNotes).toHaveBeenCalledWith('customer-123', mockUser.tenantId);
    });
  });

  describe('getCustomerNote', () => {
    it('should return note with V2 response format', async () => {
      jest.spyOn(crmService, 'getCustomerNote').mockResolvedValue(mockNote as any);

      const result = await controller.getCustomerNote('note-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockNote);
      expect(result.meta.version).toBe('2.0');
      expect(crmService.getCustomerNote).toHaveBeenCalledWith('note-123', mockUser.tenantId);
    });
  });

  describe('createCustomerNote', () => {
    it('should create note with V2 response format', async () => {
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

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockNote);
      expect(result.meta.version).toBe('2.0');
      expect(crmService.createCustomerNote).toHaveBeenCalledWith(
        'customer-123',
        createNoteDto,
        mockUser.tenantId,
        mockUser.id
      );
    });
  });

  describe('updateCustomerNote', () => {
    it('should update note with V2 response format', async () => {
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

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(updatedNote);
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('deleteCustomerNote', () => {
    it('should delete note with V2 response format', async () => {
      jest.spyOn(crmService, 'deleteCustomerNote').mockResolvedValue(mockNote as any);

      const result = await controller.deleteCustomerNote('note-123', { user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockNote);
      expect(result.meta.version).toBe('2.0');
      expect(crmService.deleteCustomerNote).toHaveBeenCalledWith('note-123', mockUser.tenantId);
    });
  });
});

