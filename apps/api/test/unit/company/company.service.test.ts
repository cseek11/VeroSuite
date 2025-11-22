/**
 * Company Service Unit Tests
 * Tests for company settings management and logo operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../../src/company/company.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let databaseService: DatabaseService;
  let supabaseService: SupabaseService;
  let mockDatabaseService: any;
  let mockSupabaseService: any;
  let mockSupabaseClient: any;
  let mockStorage: any;

  const tenantId = 'tenant-123';

  beforeEach(async () => {
    mockStorage = {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
    };

    mockSupabaseClient = {
      storage: mockStorage,
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    };

    mockDatabaseService = {
      tenantBranding: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCompanySettings', () => {
    it('should return company settings when found', async () => {
      // Arrange
      const settings = {
        id: 'settings-123',
        tenant_id: tenantId,
        company_name: 'Test Company',
        address: '123 Main St',
        city: 'City',
        state: 'State',
        zip_code: '12345',
        country: 'USA',
        phone: '555-1234',
        email: 'test@example.com',
        website: 'https://example.com',
        logo_url: 'https://example.com/logo.png',
        header_logo_url: 'https://example.com/header.png',
        invoice_logo_url: 'https://example.com/invoice.png',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue(settings);

      // Act
      const result = await service.getCompanySettings(tenantId);

      // Assert
      expect(result).toEqual({
        ...settings,
        header_logo_url: settings.header_logo_url,
        invoice_logo_url: settings.invoice_logo_url,
      });
      expect(mockDatabaseService.tenantBranding.findUnique).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        select: expect.objectContaining({
          id: true,
          tenant_id: true,
          company_name: true,
        }),
      });
    });

    it('should return default settings when not found', async () => {
      // Arrange
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.getCompanySettings(tenantId);

      // Assert
      expect(result).toEqual({
        id: '',
        tenant_id: tenantId,
        company_name: 'VeroField Pest Control',
        address: null,
        city: null,
        state: null,
        zip_code: null,
        country: 'USA',
        phone: null,
        email: null,
        website: null,
        logo_url: null,
        header_logo_url: null,
        invoice_logo_url: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle null logo URLs', async () => {
      // Arrange
      const settings = {
        id: 'settings-123',
        tenant_id: tenantId,
        company_name: 'Test Company',
        header_logo_url: null,
        invoice_logo_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue(settings);

      // Act
      const result = await service.getCompanySettings(tenantId);

      // Assert
      expect(result?.header_logo_url).toBeNull();
      expect(result?.invoice_logo_url).toBeNull();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockDatabaseService.tenantBranding.findUnique.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getCompanySettings(tenantId)).rejects.toThrow(error);
    });
  });

  describe('updateCompanySettings', () => {
    it('should update existing company settings', async () => {
      // Arrange
      const updateDto = {
        company_name: 'Updated Company',
        address: '456 New St',
      };
      const updatedSettings = {
        id: 'settings-123',
        tenant_id: tenantId,
        ...updateDto,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue(updatedSettings);

      // Act
      const result = await service.updateCompanySettings(tenantId, updateDto);

      // Assert
      expect(result).toEqual({
        ...updatedSettings,
        header_logo_url: updatedSettings.header_logo_url || null,
        invoice_logo_url: updatedSettings.invoice_logo_url || null,
      });
      expect(mockDatabaseService.tenantBranding.upsert).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        update: expect.objectContaining({
          company_name: updateDto.company_name,
          address: updateDto.address,
          updated_at: expect.any(Date),
        }),
        create: expect.any(Object),
        select: expect.any(Object),
      });
    });

    it('should create new settings when they do not exist', async () => {
      // Arrange
      const updateDto = {
        company_name: 'New Company',
      };
      const newSettings = {
        id: 'settings-123',
        tenant_id: tenantId,
        company_name: 'New Company',
        country: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue(newSettings);

      // Act
      const result = await service.updateCompanySettings(tenantId, updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockDatabaseService.tenantBranding.upsert).toHaveBeenCalled();
    });

    it('should handle empty string logo URLs as null', async () => {
      // Arrange
      const updateDto = {
        header_logo_url: '',
        invoice_logo_url: '',
      };
      const updatedSettings = {
        id: 'settings-123',
        tenant_id: tenantId,
        header_logo_url: null,
        invoice_logo_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue(updatedSettings);

      // Act
      await service.updateCompanySettings(tenantId, updateDto);

      // Assert
      expect(mockDatabaseService.tenantBranding.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({
            header_logo_url: null,
            invoice_logo_url: null,
          }),
        })
      );
    });

    it('should only update provided fields', async () => {
      // Arrange
      const updateDto = {
        company_name: 'Updated Name',
      };
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue({
        id: 'settings-123',
        tenant_id: tenantId,
        company_name: 'Updated Name',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      await service.updateCompanySettings(tenantId, updateDto);

      // Assert
      const upsertCall = mockDatabaseService.tenantBranding.upsert.mock.calls[0][0];
      expect(upsertCall.update).not.toHaveProperty('address');
      expect(upsertCall.update).toHaveProperty('company_name');
    });

    it('should throw error when update fails', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockDatabaseService.tenantBranding.upsert.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.updateCompanySettings(tenantId, { company_name: 'Test' })
      ).rejects.toThrow(error);
    });
  });

  describe('uploadLogo', () => {
    it('should upload logo and return public URL', async () => {
      // Arrange
      const file = {
        originalname: 'logo.png',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-image-data'),
      };
      const fileName = `company-logos/${tenantId}/logo-${Date.now()}.png`;
      const publicUrl = 'https://example.com/storage/logo.png';

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: null });
      mockStorage.getPublicUrl.mockReturnValue({ data: { publicUrl } });

      // Act
      const result = await service.uploadLogo(tenantId, file);

      // Assert
      expect(result).toBe(publicUrl);
      expect(mockStorage.from).toHaveBeenCalledWith('company-assets');
      expect(mockStorage.upload).toHaveBeenCalledWith(
        expect.stringContaining(`company-logos/${tenantId}/logo-`),
        file.buffer,
        {
          contentType: 'image/png',
          upsert: true,
        }
      );
      expect(mockStorage.getPublicUrl).toHaveBeenCalled();
    });

    it('should handle different file extensions', async () => {
      // Arrange
      const file = {
        originalname: 'logo.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-image-data'),
      };
      const publicUrl = 'https://example.com/storage/logo.jpg';

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: null });
      mockStorage.getPublicUrl.mockReturnValue({ data: { publicUrl } });

      // Act
      const result = await service.uploadLogo(tenantId, file);

      // Assert
      expect(result).toBe(publicUrl);
      expect(mockStorage.upload).toHaveBeenCalledWith(
        expect.stringContaining('.jpg'),
        file.buffer,
        expect.any(Object)
      );
    });

    it('should throw error when upload fails', async () => {
      // Arrange
      const file = {
        originalname: 'logo.png',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-image-data'),
      };
      const uploadError = { message: 'Upload failed' };

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockResolvedValue({ error: uploadError });

      // Act & Assert
      await expect(service.uploadLogo(tenantId, file)).rejects.toThrow(
        'Logo upload failed: Upload failed'
      );
    });

    it('should throw error when upload throws exception', async () => {
      // Arrange
      const file = {
        originalname: 'logo.png',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-image-data'),
      };
      const error = new Error('Network error');

      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.upload.mockRejectedValue(error);

      // Act & Assert
      await expect(service.uploadLogo(tenantId, file)).rejects.toThrow(error);
    });
  });

  describe('deleteLogo', () => {
    it('should delete header logo successfully', async () => {
      // Arrange
      const logoUrl =
        'https://example.supabase.co/storage/v1/object/public/company-assets/company-logos/tenant-123/logo-123.png';
      const filePath = 'company-logos/tenant-123/logo-123.png';

      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: logoUrl,
        invoice_logo_url: null,
      });
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.remove.mockResolvedValue({ data: null, error: null });
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue({
        id: 'settings-123',
        tenant_id: tenantId,
        header_logo_url: '',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      await service.deleteLogo(tenantId, 'header');

      // Assert
      expect(mockStorage.from).toHaveBeenCalledWith('company-assets');
      expect(mockStorage.remove).toHaveBeenCalledWith([filePath]);
      expect(mockDatabaseService.tenantBranding.upsert).toHaveBeenCalled();
    });

    it('should delete invoice logo successfully', async () => {
      // Arrange
      const logoUrl =
        'https://example.supabase.co/storage/v1/object/public/company-assets/company-logos/tenant-123/invoice-123.png';
      const filePath = 'company-logos/tenant-123/invoice-123.png';

      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: null,
        invoice_logo_url: logoUrl,
      });
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.remove.mockResolvedValue({ data: null, error: null });
      mockDatabaseService.tenantBranding.upsert.mockResolvedValue({
        id: 'settings-123',
        tenant_id: tenantId,
        invoice_logo_url: '',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      await service.deleteLogo(tenantId, 'invoice');

      // Assert
      expect(mockStorage.remove).toHaveBeenCalledWith([filePath]);
    });

    it('should return early when no tenant branding found', async () => {
      // Arrange
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue(null);

      // Act
      await service.deleteLogo(tenantId, 'header');

      // Assert
      expect(mockStorage.remove).not.toHaveBeenCalled();
      expect(mockDatabaseService.tenantBranding.upsert).not.toHaveBeenCalled();
    });

    it('should return early when no logo URL found', async () => {
      // Arrange
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: null,
        invoice_logo_url: null,
      });

      // Act
      await service.deleteLogo(tenantId, 'header');

      // Assert
      expect(mockStorage.remove).not.toHaveBeenCalled();
    });

    it('should throw error for invalid logo URL format', async () => {
      // Arrange
      const invalidUrl = 'https://example.com/invalid-url';
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: invalidUrl,
        invoice_logo_url: null,
      });

      // Act & Assert
      await expect(service.deleteLogo(tenantId, 'header')).rejects.toThrow(
        'Invalid logo URL format'
      );
    });

    it('should throw error when file path cannot be extracted', async () => {
      // Arrange
      const invalidUrl =
        'https://example.supabase.co/storage/v1/object/public/company-assets/';
      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: invalidUrl,
        invoice_logo_url: null,
      });

      // Act & Assert
      await expect(service.deleteLogo(tenantId, 'header')).rejects.toThrow(
        'Could not extract file path from logo URL'
      );
    });

    it('should throw error when storage deletion fails', async () => {
      // Arrange
      const logoUrl =
        'https://example.supabase.co/storage/v1/object/public/company-assets/company-logos/tenant-123/logo.png';
      const filePath = 'company-logos/tenant-123/logo.png';
      const deleteError = { message: 'Deletion failed' };

      mockDatabaseService.tenantBranding.findUnique.mockResolvedValue({
        header_logo_url: logoUrl,
        invoice_logo_url: null,
      });
      mockStorage.from.mockReturnValue(mockStorage);
      mockStorage.remove.mockResolvedValue({ data: null, error: deleteError });

      // Act & Assert
      await expect(service.deleteLogo(tenantId, 'header')).rejects.toThrow(
        'Logo deletion failed: Deletion failed'
      );
    });
  });
});

