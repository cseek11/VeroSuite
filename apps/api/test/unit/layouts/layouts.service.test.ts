/**
 * Layouts Service Unit Tests
 * Tests for layout management operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { LayoutsService } from '../../../src/layouts/layouts.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('LayoutsService', () => {
  let service: LayoutsService;
  let supabaseService: SupabaseService;
  let mockSupabaseService: any;
  let mockSupabaseClient: any;
  let mockStorage: any;
  let mockQueryBuilder: any;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const layoutId = 'layout-123';

  beforeEach(async () => {
    mockStorage = {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
    };

    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    mockSupabaseClient = {
      from: jest.fn().mockReturnValue(mockQueryBuilder),
      storage: mockStorage,
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LayoutsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<LayoutsService>(LayoutsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLayout', () => {
    it('should create a new layout successfully', async () => {
      // Arrange
      const createDto = {
        name: 'Test Layout',
        description: 'Test description',
        layout: { regions: [] },
        tags: ['test'],
        is_public: false,
      };
      const layoutData = {
        id: layoutId,
        name: 'Test Layout',
        storage_path: `${mockUser.userId}/Test_Layout_${layoutId}.json`,
      };

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: null });
      mockQueryBuilder.insert.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: layoutData, error: null });

      // Act
      const result = await service.createLayout(createDto, mockUser);

      // Assert
      expect(result).toEqual(layoutData);
      expect(mockStorage.upload).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });

    it('should handle upload error', async () => {
      // Arrange
      const createDto = {
        name: 'Test Layout',
        layout: { regions: [] },
      };
      const uploadError = { message: 'Upload failed' };

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: uploadError });

      // Act & Assert
      await expect(service.createLayout(createDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createLayout(createDto, mockUser)).rejects.toThrow(
        'Failed to upload layout file: Upload failed'
      );
    });

    it('should cleanup uploaded file when database insert fails', async () => {
      // Arrange
      const createDto = {
        name: 'Test Layout',
        layout: { regions: [] },
      };
      const dbError = { message: 'Database error' };

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: null });
      mockStorage.remove.mockResolvedValue({ error: null });
      mockQueryBuilder.insert.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: null, error: dbError });

      // Act & Assert
      await expect(service.createLayout(createDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      // Storage path includes a UUID, so we check that remove was called with an array containing a path matching the pattern
      expect(mockStorage.remove).toHaveBeenCalled();
      const removeCall = mockStorage.remove.mock.calls[0];
      expect(Array.isArray(removeCall[0])).toBe(true);
      expect(removeCall[0][0]).toMatch(new RegExp(`${mockUser.userId}/Test_Layout_.*\\.json`));
    });

    it('should sanitize layout name in filename', async () => {
      // Arrange
      const createDto = {
        name: 'Test Layout @#$%',
        layout: { regions: [] },
      };

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: null });
      mockQueryBuilder.insert.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({
        data: { id: layoutId },
        error: null,
      });

      // Act
      await service.createLayout(createDto, mockUser);

      // Assert
      const uploadCall = mockStorage.upload.mock.calls[0][0];
      expect(uploadCall).toContain('Test_Layout_');
      expect(uploadCall).not.toContain('@');
    });
  });

  describe('getUserLayouts', () => {
    it('should return user layouts', async () => {
      // Arrange
      const layouts = [
        { id: 'layout-1', name: 'Layout 1', user_id: mockUser.userId },
        { id: 'layout-2', name: 'Layout 2', user_id: mockUser.userId },
      ];

      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.order.mockResolvedValue({ data: layouts, error: null });

      // Act
      const result = await service.getUserLayouts(mockUser);

      // Assert
      expect(result).toEqual(layouts);
      expect(mockQueryBuilder.or).toHaveBeenCalledWith(
        expect.stringContaining(mockUser.userId)
      );
    });

    it('should handle database error', async () => {
      // Arrange
      const dbError = { message: 'Database error' };
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.order.mockResolvedValue({ data: null, error: dbError });

      // Act & Assert
      await expect(service.getUserLayouts(mockUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getLayout', () => {
    it('should return layout when found', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        name: 'Test Layout',
        user_id: mockUser.userId,
      };

      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: layout, error: null });

      // Act
      const result = await service.getLayout(layoutId, mockUser);

      // Assert
      expect(result).toEqual(layout);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', layoutId);
    });

    it('should throw NotFoundException when layout not found', async () => {
      // Arrange
      const error = { code: 'PGRST116', message: 'Not found' };
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(service.getLayout(layoutId, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      // Arrange
      const error = { message: 'Database error' };
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(service.getLayout(layoutId, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getLayoutData', () => {
    it('should return layout data from storage', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        storage_path: 'user-123/layout.json',
      };
      const layoutContent = {
        version: '2.0',
        layout: { regions: [] },
      };
      const mockBlob = {
        text: jest.fn().mockResolvedValue(JSON.stringify(layoutContent)),
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.download.mockResolvedValue({
        data: mockBlob,
        error: null,
      });

      // Act
      const result = await service.getLayoutData(layoutId, mockUser);

      // Assert
      expect(result).toEqual(layoutContent.layout);
      expect(mockStorage.download).toHaveBeenCalledWith(layout.storage_path);
    });

    it('should handle old format layout data', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        storage_path: 'user-123/layout.json',
      };
      const layoutContent = { regions: [] }; // Old format without layout wrapper
      const mockBlob = {
        text: jest.fn().mockResolvedValue(JSON.stringify(layoutContent)),
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.download.mockResolvedValue({
        data: mockBlob,
        error: null,
      });

      // Act
      const result = await service.getLayoutData(layoutId, mockUser);

      // Assert
      expect(result).toEqual(layoutContent);
    });

    it('should handle download error', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        storage_path: 'user-123/layout.json',
      };
      const downloadError = { message: 'Download failed' };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.download.mockResolvedValue({
        data: null,
        error: downloadError,
      });

      // Act & Assert
      await expect(service.getLayoutData(layoutId, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('updateLayout', () => {
    it('should update layout successfully', async () => {
      // Arrange
      const updateDto = { name: 'Updated Layout' };
      const updatedLayout = {
        id: layoutId,
        name: 'Updated Layout',
        user_id: mockUser.userId,
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue({
        id: layoutId,
        user_id: mockUser.userId,
      } as any);
      mockQueryBuilder.update.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({
        data: updatedLayout,
        error: null,
      });

      // Act
      const result = await service.updateLayout(layoutId, updateDto, mockUser);

      // Assert
      expect(result).toEqual(updatedLayout);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', mockUser.userId);
    });

    it('should throw error when update fails', async () => {
      // Arrange
      const updateDto = { name: 'Updated Layout' };
      const error = { message: 'Update failed' };

      jest.spyOn(service, 'getLayout').mockResolvedValue({
        id: layoutId,
        user_id: mockUser.userId,
      } as any);
      mockQueryBuilder.update.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(
        service.updateLayout(layoutId, updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteLayout', () => {
    it('should delete layout successfully', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        user_id: mockUser.userId,
        storage_path: 'user-123/layout.json',
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      // Setup chain: delete().eq().eq() - all return builder, final call returns promise
      mockQueryBuilder.delete.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      // Make the builder thenable so it can be awaited
      (mockQueryBuilder as any).then = jest.fn((resolve) => {
        resolve({ data: null, error: null });
      });
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.remove.mockResolvedValue({ error: null });

      // Act
      const result = await service.deleteLayout(layoutId, mockUser);

      // Assert
      expect(result).toEqual({ success: true });
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockStorage.remove).toHaveBeenCalledWith([layout.storage_path]);
    });

    it('should throw UnauthorizedException when user does not own layout', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        user_id: 'other-user',
        storage_path: 'other-user/layout.json',
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);

      // Act & Assert
      await expect(service.deleteLayout(layoutId, mockUser)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should handle storage deletion error gracefully', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        user_id: mockUser.userId,
        storage_path: 'user-123/layout.json',
      };
      const storageError = { message: 'Storage error' };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      // Setup chain: delete().eq().eq() - all return builder, final call returns promise
      mockQueryBuilder.delete.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
      // Make the builder thenable so it can be awaited
      (mockQueryBuilder as any).then = jest.fn((resolve) => {
        resolve({ data: null, error: null });
      });
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.remove.mockResolvedValue({ error: storageError });

      // Act
      const result = await service.deleteLayout(layoutId, mockUser);

      // Assert - Should still succeed even if storage deletion fails
      expect(result).toEqual({ success: true });
    });
  });

  describe('searchLayouts', () => {
    it('should search layouts with query', async () => {
      // Arrange
      const searchDto = { q: 'test' };
      const layouts = [
        { id: 'layout-1', name: 'Test Layout', description: 'test description' },
      ];

      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.order.mockResolvedValue({ data: layouts, error: null });

      // Act
      const result = await service.searchLayouts(searchDto, mockUser);

      // Assert
      expect(result).toEqual(layouts);
      expect(mockQueryBuilder.or).toHaveBeenCalledTimes(2); // Access check + search
    });

    it('should search layouts without query', async () => {
      // Arrange
      const searchDto = {};
      const layouts = [{ id: 'layout-1', name: 'Layout' }];

      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.or.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.order.mockResolvedValue({ data: layouts, error: null });

      // Act
      const result = await service.searchLayouts(searchDto, mockUser);

      // Assert
      expect(result).toEqual(layouts);
    });
  });

  describe('downloadLayout', () => {
    it('should download layout file', async () => {
      // Arrange
      const layout = {
        id: layoutId,
        name: 'Test Layout',
        storage_path: 'user-123/layout.json',
      };
      const layoutContent = { version: '2.0', layout: { regions: [] } };
      const arrayBuffer = Buffer.from(JSON.stringify(layoutContent)).buffer;
      const mockBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      };

      jest.spyOn(service, 'getLayout').mockResolvedValue(layout as any);
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.download.mockResolvedValue({
        data: mockBlob,
        error: null,
      });

      // Act
      const result = await service.downloadLayout(layoutId, mockUser);

      // Assert
      expect(result.filename).toContain('Test_Layout');
      expect(result.filename).toContain('.json');
      expect(result.data).toBeInstanceOf(Buffer);
    });
  });
});

