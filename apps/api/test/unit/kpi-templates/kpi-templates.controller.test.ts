/**
 * KPI Templates Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { KpiTemplatesController } from '../../../src/kpi-templates/kpi-templates.controller';
import { KpiTemplatesService } from '../../../src/kpi-templates/kpi-templates.service';
import {
  CreateKpiTemplateDto,
  UpdateKpiTemplateDto,
  UseKpiTemplateDto,
  TrackTemplateUsageDto,
  KpiTemplateFiltersDto,
} from '../../../src/kpi-templates/dto';

describe('KpiTemplatesController', () => {
  let controller: KpiTemplatesController;
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
      controllers: [KpiTemplatesController],
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

    controller = module.get<KpiTemplatesController>(KpiTemplatesController);
    kpiTemplatesService = module.get<KpiTemplatesService>(KpiTemplatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create template successfully', async () => {
      const createTemplateDto: CreateKpiTemplateDto = {
        name: 'Test Template',
        category: 'operational',
        template_type: 'counter',
        formula_expression: 'COUNT(*)',
        formula_fields: [],
      };

      jest.spyOn(kpiTemplatesService, 'createTemplate').mockResolvedValue(mockTemplate as any);

      const result = await controller.createTemplate({ user: mockUser } as any, createTemplateDto);

      expect(result).toEqual(mockTemplate);
      expect(kpiTemplatesService.createTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        createTemplateDto
      );
    });
  });

  describe('getTemplates', () => {
    it('should return templates with filters', async () => {
      const filters: KpiTemplateFiltersDto = {
        search: 'jobs',
        category: 'operational',
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

      expect(result).toEqual(mockResponse);
      expect(kpiTemplatesService.getTemplates).toHaveBeenCalledWith(mockUser.tenantId, filters);
    });
  });

  describe('getTemplateById', () => {
    it('should return template by ID', async () => {
      jest.spyOn(kpiTemplatesService, 'getTemplateById').mockResolvedValue(mockTemplate as any);

      const result = await controller.getTemplateById({ user: mockUser } as any, 'template-123');

      expect(result).toEqual(mockTemplate);
      expect(kpiTemplatesService.getTemplateById).toHaveBeenCalledWith(
        mockUser.tenantId,
        'template-123'
      );
    });
  });

  describe('updateTemplate', () => {
    it('should update template successfully', async () => {
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

      expect(result).toEqual(updatedTemplate);
      expect(kpiTemplatesService.updateTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        'template-123',
        updateTemplateDto
      );
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template successfully', async () => {
      jest.spyOn(kpiTemplatesService, 'deleteTemplate').mockResolvedValue(undefined);

      await controller.deleteTemplate({ user: mockUser } as any, 'template-123');

      expect(kpiTemplatesService.deleteTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        'template-123'
      );
    });
  });

  describe('useTemplate', () => {
    it('should use template successfully', async () => {
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

      expect(result).toEqual(mockResult);
      expect(kpiTemplatesService.useTemplate).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        useTemplateDto
      );
    });
  });

  describe('trackTemplateUsage', () => {
    it('should track template usage successfully', async () => {
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

      expect(result).toEqual(mockUsage);
      expect(kpiTemplatesService.trackTemplateUsage).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        trackUsageDto
      );
    });
  });

  describe('getPopularTemplates', () => {
    it('should return popular templates', async () => {
      jest.spyOn(kpiTemplatesService, 'getPopularTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getPopularTemplates({ user: mockUser } as any, 10);

      expect(result).toEqual([mockTemplate]);
      expect(kpiTemplatesService.getPopularTemplates).toHaveBeenCalledWith(mockUser.tenantId, 10);
    });

    it('should use default limit when not provided', async () => {
      jest.spyOn(kpiTemplatesService, 'getPopularTemplates').mockResolvedValue([mockTemplate] as any);

      await controller.getPopularTemplates({ user: mockUser } as any, undefined);

      expect(kpiTemplatesService.getPopularTemplates).toHaveBeenCalledWith(mockUser.tenantId, 10);
    });
  });

  describe('getTemplateAnalytics', () => {
    it('should return template analytics', async () => {
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

      expect(result).toEqual(mockAnalytics);
      expect(kpiTemplatesService.getTemplateAnalytics).toHaveBeenCalledWith(
        'template-123',
        mockUser.tenantId
      );
    });
  });

  describe('getTemplateFields', () => {
    it('should return template fields', async () => {
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

      expect(result).toEqual(mockFields);
      expect(kpiTemplatesService.getTemplateFields).toHaveBeenCalledWith(
        'template-123',
        mockUser.tenantId
      );
    });
  });

  describe('getFavoritedTemplates', () => {
    it('should return favorited templates', async () => {
      jest.spyOn(kpiTemplatesService, 'getFavoritedTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getFavoritedTemplates({ user: mockUser } as any);

      expect(result).toEqual([mockTemplate]);
      expect(kpiTemplatesService.getFavoritedTemplates).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });
});

