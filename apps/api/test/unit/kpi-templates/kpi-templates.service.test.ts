/**
 * KPI Templates Service Unit Tests
 * Tests for template CRUD operations, usage tracking, and analytics
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { KpiTemplatesService } from '../../../src/kpi-templates/kpi-templates.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import {
  CreateKpiTemplateDto,
  UpdateKpiTemplateDto,
  KpiTemplateFiltersDto,
  UseKpiTemplateDto,
  TrackTemplateUsageDto,
} from '../../../src/kpi-templates/dto';

describe('KpiTemplatesService', () => {
  let service: KpiTemplatesService;
  let databaseService: DatabaseService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockTemplateId = 'template-123';

  const mockTemplate = {
    id: mockTemplateId,
    name: 'Jobs Completed Template',
    description: 'Template for tracking completed jobs',
    category: 'operational',
    template_type: 'counter',
    formula_expression: 'COUNT(*)',
    formula_fields: [],
    threshold_config: { min: 0, max: 100 },
    chart_config: { type: 'line' },
    data_source_config: { table: 'jobs' },
    tags: ['jobs', 'completion'],
    is_public: false,
    is_featured: false,
    status: 'active',
    tenant_id: mockTenantId,
    created_by: mockUserId,
    created_at: new Date(),
    updated_at: new Date(),
    templateFields: [],
    creator: {
      id: mockUserId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KpiTemplatesService,
        {
          provide: DatabaseService,
          useValue: {
            kpiTemplate: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              aggregate: jest.fn(),
            },
            templateUsage: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              aggregate: jest.fn(),
            },
            kpiTemplateUsage: {
              findFirst: jest.fn(),
            },
            templateFavorite: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<KpiTemplatesService>(KpiTemplatesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    const createTemplateDto: CreateKpiTemplateDto = {
      name: 'Test Template',
      description: 'Test description',
      category: 'operational',
      template_type: 'counter',
      formula_expression: 'COUNT(*)',
      formula_fields: [
        {
          field_name: 'job_id',
          field_type: 'number',
          table_name: 'jobs',
          column_name: 'id',
          aggregation_type: 'count',
          display_name: 'Job ID',
          is_required: true,
          sort_order: 0,
        },
      ],
      threshold_config: { min: 0, max: 100 },
      chart_config: { type: 'line' },
      data_source_config: { table: 'jobs' },
      tags: ['test'],
      is_public: false,
      is_featured: false,
      status: 'draft',
    };

    it('should create template successfully', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'create').mockResolvedValue(mockTemplate as any);

      const result = await service.createTemplate(mockTenantId, mockUserId, createTemplateDto);

      expect(result).toEqual(mockTemplate);
      expect(databaseService.kpiTemplate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: createTemplateDto.name,
            tenant_id: mockTenantId,
            created_by: mockUserId,
          }),
        })
      );
    });

    it('should handle creation errors', async () => {
      jest
        .spyOn(databaseService.kpiTemplate, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.createTemplate(mockTenantId, mockUserId, createTemplateDto)
      ).rejects.toThrow(BadRequestException);
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

      jest.spyOn(databaseService.kpiTemplate, 'findMany').mockResolvedValue([mockTemplate] as any);
      jest.spyOn(databaseService.kpiTemplate, 'count').mockResolvedValue(1);

      const result = await service.getTemplates(mockTenantId, filters);

      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(databaseService.kpiTemplate.findMany).toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      const filters: KpiTemplateFiltersDto = {
        page: 2,
        limit: 10,
      };

      jest.spyOn(databaseService.kpiTemplate, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.kpiTemplate, 'count').mockResolvedValue(0);

      const result = await service.getTemplates(mockTenantId, filters);

      expect(result).toBeDefined();
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });

    it('should include public templates', async () => {
      const filters: KpiTemplateFiltersDto = {
        is_public: true,
      };

      jest.spyOn(databaseService.kpiTemplate, 'findMany').mockResolvedValue([mockTemplate] as any);
      jest.spyOn(databaseService.kpiTemplate, 'count').mockResolvedValue(1);

      await service.getTemplates(mockTenantId, filters);

      expect(databaseService.kpiTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([{ is_public: true }]),
          }),
        })
      );
    });
  });

  describe('getTemplateById', () => {
    it('should return template by ID', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);

      const result = await service.getTemplateById(mockTenantId, mockTemplateId);

      expect(result).toEqual(mockTemplate);
      expect(databaseService.kpiTemplate.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockTemplateId,
            OR: [{ tenant_id: mockTenantId }, { is_public: true }],
          },
        })
      );
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(service.getTemplateById(mockTenantId, 'non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateTemplate', () => {
    const updateTemplateDto: UpdateKpiTemplateDto = {
      name: 'Updated Template',
      description: 'Updated description',
    };

    it('should update template successfully', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);
      jest
        .spyOn(databaseService.kpiTemplate, 'update')
        .mockResolvedValue({ ...mockTemplate, ...updateTemplateDto } as any);

      const result = await service.updateTemplate(mockTenantId, mockUserId, mockTemplateId, updateTemplateDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Template');
      expect(databaseService.kpiTemplate.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateTemplate(mockTenantId, mockUserId, 'non-existent', updateTemplateDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not creator', async () => {
      const otherUserTemplate = { ...mockTemplate, created_by: 'other-user' };
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(otherUserTemplate as any);

      await expect(
        service.updateTemplate(mockTenantId, mockUserId, mockTemplateId, updateTemplateDto)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template successfully', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);
      jest.spyOn(databaseService.kpiTemplate, 'delete').mockResolvedValue(mockTemplate as any);

      await service.deleteTemplate(mockTenantId, mockUserId, mockTemplateId);

      expect(databaseService.kpiTemplate.delete).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(
        service.deleteTemplate(mockTenantId, mockUserId, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not creator', async () => {
      const otherUserTemplate = { ...mockTemplate, created_by: 'other-user' };
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(otherUserTemplate as any);

      await expect(
        service.deleteTemplate(mockTenantId, mockUserId, mockTemplateId)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('useTemplate', () => {
    const useTemplateDto: UseKpiTemplateDto = {
      template_id: mockTemplateId,
      name: 'My KPI',
      customizations: {},
    };

    it('should use template successfully', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);
      jest.spyOn(databaseService.templateUsage, 'create').mockResolvedValue({
        id: 'usage-123',
        template_id: mockTemplateId,
        user_id: mockUserId,
        tenant_id: mockTenantId,
        action: 'created',
      } as any);

      const result = await service.useTemplate(mockTenantId, mockUserId, useTemplateDto);

      expect(result).toBeDefined();
      expect(databaseService.templateUsage.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(service.useTemplate(mockTenantId, mockUserId, useTemplateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('trackTemplateUsage', () => {
    const trackUsageDto: TrackTemplateUsageDto = {
      template_id: mockTemplateId,
      action: 'viewed',
    };

    it('should track template usage successfully', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);
      jest.spyOn(databaseService.templateUsage, 'create').mockResolvedValue({
        id: 'usage-123',
        template_id: mockTemplateId,
        user_id: mockUserId,
        tenant_id: mockTenantId,
        action: 'viewed',
      } as any);

      const result = await service.trackTemplateUsage(mockTenantId, mockUserId, trackUsageDto);

      expect(result).toBeDefined();
      expect(databaseService.templateUsage.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(
        service.trackTemplateUsage(mockTenantId, mockUserId, trackUsageDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPopularTemplates', () => {
    it('should return popular templates', async () => {
      jest.spyOn(databaseService.templateUsage, 'aggregate').mockResolvedValue([
        { template_id: mockTemplateId, _count: { id: 10 } },
      ] as any);
      jest.spyOn(databaseService.kpiTemplate, 'findMany').mockResolvedValue([mockTemplate] as any);

      const result = await service.getPopularTemplates(mockTenantId, 10);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should use default limit when not provided', async () => {
      jest.spyOn(databaseService.templateUsage, 'aggregate').mockResolvedValue([]);
      jest.spyOn(databaseService.kpiTemplate, 'findMany').mockResolvedValue([]);

      await service.getPopularTemplates(mockTenantId);

      expect(databaseService.kpiTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      );
    });
  });

  describe('getTemplateAnalytics', () => {
    it('should return template analytics', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(mockTemplate as any);
      jest.spyOn(databaseService.templateUsage, 'count').mockResolvedValue(5);
      jest.spyOn(databaseService.templateUsage, 'aggregate').mockResolvedValue({
        _count: { id: 5 },
      } as any);

      const result = await service.getTemplateAnalytics(mockTemplateId, mockTenantId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('usage_count');
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(
        service.getTemplateAnalytics('non-existent', mockTenantId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTemplateFields', () => {
    it('should return template fields', async () => {
      const templateWithFields = {
        ...mockTemplate,
        templateFields: [
          {
            id: 'field-1',
            field_name: 'job_id',
            field_type: 'number',
            table_name: 'jobs',
            column_name: 'id',
          },
        ],
      };

      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(templateWithFields as any);

      const result = await service.getTemplateFields(mockTemplateId, mockTenantId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(databaseService.kpiTemplate, 'findFirst').mockResolvedValue(null);

      await expect(service.getTemplateFields('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getFavoritedTemplates', () => {
    it('should return favorited templates', async () => {
      jest.spyOn(databaseService.templateFavorite, 'findMany').mockResolvedValue([
        {
          id: 'fav-1',
          template_id: mockTemplateId,
          user_id: mockUserId,
          template: mockTemplate,
        },
      ] as any);

      const result = await service.getFavoritedTemplates(mockTenantId, mockUserId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no favorites', async () => {
      jest.spyOn(databaseService.templateFavorite, 'findMany').mockResolvedValue([]);

      const result = await service.getFavoritedTemplates(mockTenantId, mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('isTemplateFavorited', () => {
    it('should return true when template is favorited', async () => {
      jest.spyOn(databaseService.kpiTemplateUsage, 'findFirst').mockResolvedValue({
        id: 'fav-1',
        template_id: mockTemplateId,
        user_id: mockUserId,
        action: 'favorited',
      } as any);

      const result = await service.isTemplateFavorited(mockTemplateId, mockUserId);

      expect(result).toBe(true);
    });

    it('should return false when template is not favorited', async () => {
      jest.spyOn(databaseService.kpiTemplateUsage, 'findFirst').mockResolvedValue(null);

      const result = await service.isTemplateFavorited(mockTemplateId, mockUserId);

      expect(result).toBe(false);
    });
  });
});

