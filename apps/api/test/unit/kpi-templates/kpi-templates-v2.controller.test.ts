/**
 * KPI Templates V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced response format
 */

import { Test, TestingModule } from '@nestjs/testing';
import { KpiTemplatesV2Controller } from '../../../src/kpi-templates/kpi-templates-v2.controller';
import { KpiTemplatesService } from '../../../src/kpi-templates/kpi-templates.service';
import {
  CreateKpiTemplateDto,
  UpdateKpiTemplateDto,
  UseKpiTemplateDto,
  TrackTemplateUsageDto,
  KpiTemplateFiltersDto,
} from '../../../src/kpi-templates/dto';

describe('KpiTemplatesV2Controller', () => {
  let controller: KpiTemplatesV2Controller;
  let kpiTemplatesService: KpiTemplatesService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockTemplate = {
    id: 'template-123',
    name: 'Jobs Completed Template',
    description: 'Template for tracking completed jobs',
    category: 'operational',
    template_type: 'counter',
    status: 'active',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpiTemplatesV2Controller],
      providers: [
        {
          provide: KpiTemplatesService,
          useValue: {
            createTemplate: jest.fn(),
            getTemplates: jest.fn(),
            getTemplateById: jest.fn(),
            updateTemplate: jest.fn(),
            deleteTemplate: jest.fn(),
            useTemplate: jest.fn(),
            trackTemplateUsage: jest.fn(),
            getPopularTemplates: jest.fn(),
            getTemplateAnalytics: jest.fn(),
            getTemplateFields: jest.fn(),
            getFavoritedTemplates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KpiTemplatesV2Controller>(KpiTemplatesV2Controller);
    kpiTemplatesService = module.get<KpiTemplatesService>(KpiTemplatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create template with V2 response format', async () => {
      const createTemplateDto: CreateKpiTemplateDto = {
        name: 'Test Template',
        category: 'operational',
        template_type: 'counter',
        formula_expression: 'COUNT(*)',
        formula_fields: [],
      };

      jest.spyOn(kpiTemplatesService, 'createTemplate').mockResolvedValue(mockTemplate as any);

      const result = await controller.createTemplate({ user: mockUser } as any, createTemplateDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockTemplate);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
      expect(kpiTemplatesService.createTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        createTemplateDto
      );
    });
  });

  describe('getTemplates', () => {
    it('should return templates with V2 response format', async () => {
      const filters: KpiTemplateFiltersDto = {
        page: 1,
        limit: 20,
      };

      const mockResponse = {
        data: [mockTemplate],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      jest.spyOn(kpiTemplatesService, 'getTemplates').mockResolvedValue(mockResponse as any);

      const result = await controller.getTemplates({ user: mockUser } as any, filters);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockResponse);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
    });
  });

  describe('getTemplateById', () => {
    it('should return template with V2 response format', async () => {
      jest.spyOn(kpiTemplatesService, 'getTemplateById').mockResolvedValue(mockTemplate as any);

      const result = await controller.getTemplateById({ user: mockUser } as any, 'template-123');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockTemplate);
      expect(result.meta.version).toBe('2.0');
      expect(kpiTemplatesService.getTemplateById).toHaveBeenCalledWith(
        mockUser.tenantId,
        'template-123'
      );
    });
  });

  describe('updateTemplate', () => {
    it('should update template with V2 response format', async () => {
      const updateTemplateDto: UpdateKpiTemplateDto = {
        name: 'Updated Template',
      };

      const updatedTemplate = { ...mockTemplate, ...updateTemplateDto };
      jest
        .spyOn(kpiTemplatesService, 'updateTemplate')
        .mockResolvedValue(updatedTemplate as any);

      const result = await controller.updateTemplate(
        { user: mockUser } as any,
        'template-123',
        updateTemplateDto
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(updatedTemplate);
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template with V2 response format', async () => {
      jest.spyOn(kpiTemplatesService, 'deleteTemplate').mockResolvedValue(undefined);

      const result = await controller.deleteTemplate({ user: mockUser } as any, 'template-123');

      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
      expect(kpiTemplatesService.deleteTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        'template-123'
      );
    });
  });

  describe('useTemplate', () => {
    it('should use template with V2 response format', async () => {
      const useTemplateDto: UseKpiTemplateDto = {
        template_id: 'template-123',
        name: 'My KPI',
        customizations: {},
      };

      const mockResult = {
        kpi: { id: 'kpi-123', name: 'My KPI' },
        usage: { id: 'usage-123' },
      };

      jest.spyOn(kpiTemplatesService, 'useTemplate').mockResolvedValue(mockResult as any);

      const result = await controller.useTemplate({ user: mockUser } as any, useTemplateDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockResult);
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('trackTemplateUsage', () => {
    it('should track template usage with V2 response format', async () => {
      const trackUsageDto: TrackTemplateUsageDto = {
        template_id: 'template-123',
        action: 'viewed',
      };

      const mockUsage = {
        id: 'usage-123',
        template_id: 'template-123',
        action: 'viewed',
      };

      jest.spyOn(kpiTemplatesService, 'trackTemplateUsage').mockResolvedValue(mockUsage as any);

      const result = await controller.trackTemplateUsage({ user: mockUser } as any, trackUsageDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockUsage);
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('getPopularTemplates', () => {
    it('should return popular templates with V2 response format', async () => {
      jest.spyOn(kpiTemplatesService, 'getPopularTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getPopularTemplates({ user: mockUser } as any, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockTemplate]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
    });
  });

  describe('getTemplateAnalytics', () => {
    it('should return template analytics with V2 response format', async () => {
      const mockAnalytics = {
        usage_count: 5,
        views: 10,
        favorites: 2,
      };

      jest.spyOn(kpiTemplatesService, 'getTemplateAnalytics').mockResolvedValue(mockAnalytics as any);

      const result = await controller.getTemplateAnalytics(
        { user: mockUser } as any,
        'template-123'
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockAnalytics);
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('getTemplateFields', () => {
    it('should return template fields with V2 response format', async () => {
      const mockFields = [
        {
          id: 'field-1',
          field_name: 'job_id',
          field_type: 'number',
          table_name: 'jobs',
          column_name: 'id',
        },
      ];

      jest.spyOn(kpiTemplatesService, 'getTemplateFields').mockResolvedValue(mockFields as any);

      const result = await controller.getTemplateFields({ user: mockUser } as any, 'template-123');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockFields);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
    });
  });

  describe('getFavoritedTemplates', () => {
    it('should return favorited templates with V2 response format', async () => {
      jest.spyOn(kpiTemplatesService, 'getFavoritedTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getFavoritedTemplates({ user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockTemplate]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
    });
  });
});

