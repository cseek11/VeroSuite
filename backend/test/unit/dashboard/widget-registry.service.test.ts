/**
 * Widget Registry Service Unit Tests
 * Tests for widget registration, validation, and discovery
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WidgetRegistryService } from '../../../src/dashboard/widget-registry.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';
import { RegisterWidgetDto, WidgetManifestDto } from '../../../src/dashboard/dto/dashboard-region.dto';

describe('WidgetRegistryService', () => {
  let service: WidgetRegistryService;
  let supabaseService: SupabaseService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockManifest: WidgetManifestDto = {
    widget_id: 'test-widget',
    name: 'Test Widget',
    version: '1.0.0',
    entry_point: 'https://example.com/widget.js',
    description: 'A test widget',
  };

  const mockWidget = {
    id: 'widget-123',
    widget_id: 'test-widget',
    manifest: mockManifest,
    signature: 'abc123',
    is_approved: false,
    is_public: false,
    created_by: mockUser.userId,
  };

  // Create query builders per table - reuse same builder for same table
  const queryBuilders = new Map<string, any>();
  
  const createMockQueryBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      const builder: any = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };
      queryBuilders.set(table, builder);
    }
    return queryBuilders.get(table);
  };

  const mockSupabaseClient = {
    from: jest.fn((table: string) => {
      return getBuilder(table);
    }),
  };
  
  // Helper to get builders for test setup - creates if doesn't exist
  const getBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      createMockQueryBuilder(table);
    }
    return queryBuilders.get(table);
  };

  beforeEach(async () => {
    // Clear query builders before each test
    queryBuilders.clear();
    
    // Ensure from() always returns a builder
    mockSupabaseClient.from.mockImplementation((table: string) => getBuilder(table));
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetRegistryService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get<WidgetRegistryService>(WidgetRegistryService);
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset mocks but keep query builders (they'll be populated as from() is called)
    // Only clear call history, not implementations
    mockSupabaseClient.from.mockClear();
    // Re-setup the implementation after clearing
    mockSupabaseClient.from.mockImplementation((table: string) => getBuilder(table));
  });

  describe('registerWidget', () => {
    const registerDto: RegisterWidgetDto = {
      manifest: mockManifest,
      is_public: false,
    };

    it('should register widget successfully', async () => {
      // Pre-create builder so we can set up mocks
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      // Setup mock responses in order of service calls:
      // 1. Check existing widget: .select().eq().single()
      builder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }); // No existing widget
      // 2. Insert widget: .insert().select().single()
      builder.insert.mockImplementationOnce(() => builder);
      builder.single.mockResolvedValueOnce({ data: mockWidget, error: null }); // Widget creation

      const result = await service.registerWidget(registerDto, mockUser);

      expect(result).toBeDefined();
      expect(result.widget_id).toBe('test-widget');
      expect(builder.insert).toHaveBeenCalled();
    });

    it('should throw BadRequestException when widget already exists', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      // Mock the check query to return existing widget (this triggers the "already exists" error)
      builder.single.mockResolvedValueOnce({ data: mockWidget, error: null });

      await expect(service.registerWidget(registerDto, mockUser)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('already exists'),
        })
      );
    });

    it('should handle Supabase errors', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      builder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      builder.insert.mockImplementationOnce(() => builder);
      builder.single.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

      await expect(service.registerWidget(registerDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateWidgetManifest', () => {
    it('should validate valid manifest', () => {
      expect(() => service.validateWidgetManifest(mockManifest)).not.toThrow();
    });

    it('should throw BadRequestException when widget_id is missing', () => {
      const invalidManifest = { ...mockManifest };
      delete (invalidManifest as any).widget_id;

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow('widget_id');
    });

    it('should throw BadRequestException when name is missing', () => {
      const invalidManifest = { ...mockManifest };
      delete (invalidManifest as any).name;

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when version is missing', () => {
      const invalidManifest = { ...mockManifest };
      delete (invalidManifest as any).version;

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when entry_point is missing', () => {
      const invalidManifest = { ...mockManifest };
      delete (invalidManifest as any).entry_point;

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid widget_id format', () => {
      const invalidManifest = {
        ...mockManifest,
        widget_id: 'invalid widget id!',
      };

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow('alphanumeric');
    });

    it('should throw BadRequestException for invalid entry_point URL', () => {
      const invalidManifest = {
        ...mockManifest,
        entry_point: 'not-a-valid-url',
      };

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow('valid URL');
    });

    it('should throw BadRequestException for invalid config_schema', () => {
      const invalidManifest = {
        ...mockManifest,
        config_schema: 'not-an-object',
      };

      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow(BadRequestException);
      expect(() => service.validateWidgetManifest(invalidManifest)).toThrow('config_schema');
    });

    it('should accept valid config_schema', () => {
      const validManifest = {
        ...mockManifest,
        config_schema: { type: 'object', properties: {} },
      };

      expect(() => service.validateWidgetManifest(validManifest)).not.toThrow();
    });
  });

  describe('signWidgetManifest', () => {
    it('should generate signature for manifest', () => {
      const signature = service.signWidgetManifest(mockManifest);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should generate consistent signatures for same manifest', () => {
      const signature1 = service.signWidgetManifest(mockManifest);
      const signature2 = service.signWidgetManifest(mockManifest);

      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different manifests', () => {
      const manifest1 = { ...mockManifest };
      const manifest2 = { ...mockManifest, version: '2.0.0' };

      const signature1 = service.signWidgetManifest(manifest1);
      const signature2 = service.signWidgetManifest(manifest2);

      expect(signature1).not.toBe(signature2);
    });
  });

  describe('getApprovedWidgets', () => {
    it('should return approved widgets for tenant', async () => {
      const approvedWidgets = [{ ...mockWidget, is_approved: true }];

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      // getApprovedWidgets chain: .select().eq().or().order() - order() returns promise
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: approvedWidgets, error: null }));

      const result = await service.getApprovedWidgets(mockUser.tenantId);

      expect(result).toEqual(approvedWidgets);
      expect(builder.eq).toHaveBeenCalledWith('is_approved', true);
    });

    it('should handle Supabase errors', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: null, error: { message: 'Database error' } }));

      await expect(service.getApprovedWidgets(mockUser.tenantId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateWidgetConfig', () => {
    it('should validate widget config successfully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      // validateWidgetConfig chain: .select().eq().eq().single()
      builder.single.mockResolvedValueOnce({ data: { manifest: mockManifest }, error: null });

      const result = await service.validateWidgetConfig('test-widget', {});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors when widget not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      builder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const result = await service.validateWidgetConfig('non-existent', {});

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate required fields', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      const manifestWithSchema = {
        ...mockManifest,
        config_schema: {
          required: ['name'],
          properties: { name: { type: 'string' } }
        }
      };
      
      builder.single.mockResolvedValueOnce({ data: { manifest: manifestWithSchema }, error: null });

      const result = await service.validateWidgetConfig('test-widget', {});

      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('Missing required field'))).toBe(true);
    });
  });

  describe('approveWidget', () => {
    it('should approve widget successfully', async () => {
      const approvedWidget = { ...mockWidget, is_approved: true };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      // approveWidget chain: .update().eq().select().single()
      // update() returns builder, eq() returns builder, select() returns builder, single() returns promise
      builder.single.mockResolvedValueOnce({ data: approvedWidget, error: null });

      const result = await service.approveWidget('test-widget', mockUser);

      expect(result.is_approved).toBe(true);
      expect(builder.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when widget not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_widget_registry');
      const builder = getBuilder('dashboard_widget_registry');
      
      builder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.approveWidget('non-existent', mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});

