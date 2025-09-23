import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../common/services/database.service';
import { 
  CreateKpiTemplateDto, 
  UpdateKpiTemplateDto, 
  KpiTemplateFiltersDto,
  UseKpiTemplateDto,
  TrackTemplateUsageDto,
  TemplateStatus,
  TemplateUsageAction
} from './dto';

@Injectable()
export class KpiTemplatesService {
  constructor(private prisma: DatabaseService) {}

  async createTemplate(
    tenantId: string,
    userId: string,
    createTemplateDto: CreateKpiTemplateDto
  ) {
    try {
      const template = await this.prisma.kpiTemplate.create({
        data: {
          name: createTemplateDto.name,
          description: createTemplateDto.description || null,
          category: createTemplateDto.category,
          template_type: createTemplateDto.template_type,
          formula_expression: createTemplateDto.formula_expression,
          formula_fields: createTemplateDto.formula_fields as any,
          threshold_config: createTemplateDto.threshold_config as any,
          chart_config: createTemplateDto.chart_config as any,
          data_source_config: createTemplateDto.data_source_config as any,
          tags: createTemplateDto.tags || [],
          is_public: createTemplateDto.is_public || false,
          is_featured: createTemplateDto.is_featured || false,
          ...(createTemplateDto.version && { version: createTemplateDto.version }),
          status: createTemplateDto.status || 'draft',
          tenant_id: tenantId,
          created_by: userId,
          templateFields: {
            create: createTemplateDto.formula_fields.map(field => ({
              field_name: field.field_name,
              field_type: field.field_type,
              table_name: field.table_name,
              column_name: field.column_name,
              aggregation_type: field.aggregation_type || null,
              display_name: field.display_name,
              description: field.description || null,
              is_required: field.is_required || false,
              sort_order: field.sort_order || 0
            }))
          }
        },
        include: {
          templateFields: true,
          creator: {
            select: { id: true, first_name: true, last_name: true, email: true }
          }
        }
      });

      return template;
    } catch (error) {
      throw new BadRequestException(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplates(tenantId: string, filters: KpiTemplateFiltersDto) {
    const {
      search,
      category,
      template_type,
      status,
      tags,
      is_public,
      is_featured,
      created_by,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Debug logging
    console.log('🔍 getTemplates called with:');
    console.log('  - tenantId:', tenantId);
    console.log('  - filters:', filters);

    // Build where clause - include both tenant-specific and public templates
    const where: any = {
      OR: [
        { tenant_id: tenantId },  // Templates for this tenant
        { is_public: true }       // Public templates available to all tenants
      ],
      ...(template_type && { template_type }),
      ...(category && { category }),
      ...(status && { status }),
      ...(is_public !== undefined && { is_public }),
      ...(is_featured !== undefined && { is_featured }),
      ...(created_by && { created_by })
    };

    console.log('🔍 where clause:', JSON.stringify(where, null, 2));

    // Add search functionality
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
      delete where.OR; // Remove the tenant/public OR clause since we're using AND now
    }

    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { hasSome: tagArray };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sort_by] = sort_order;

    const [templates, total] = await Promise.all([
      this.prisma.kpiTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          templateFields: true,
          creator: {
            select: { id: true, first_name: true, last_name: true, email: true }
          },
          _count: {
            select: {
              userKpis: true,
              templateUsage: true
            }
          }
        }
      }),
      this.prisma.kpiTemplate.count({ where })
    ]);

    console.log('🔍 Query results:');
    console.log('  - templates found:', templates.length);
    console.log('  - total count:', total);
    console.log('  - first template:', templates[0] ? { id: templates[0].id, name: templates[0].name, tenant_id: templates[0].tenant_id, is_public: templates[0].is_public } : 'none');

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTemplateById(tenantId: string, templateId: string) {
    const template = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: templateId,
        tenant_id: tenantId
      },
      include: {
        templateFields: true,
        creator: {
          select: { id: true, first_name: true, last_name: true, email: true }
        },
        approver: {
          select: { id: true, first_name: true, last_name: true, email: true }
        },
        _count: {
          select: {
            userKpis: true,
            templateUsage: true
          }
        }
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async updateTemplate(
    tenantId: string,
    userId: string,
    templateId: string,
    updateTemplateDto: UpdateKpiTemplateDto
  ) {
    // Check if template exists and user has permission
    const existingTemplate = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: templateId,
        tenant_id: tenantId
      }
    });

    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }

    // Check permissions (only creator or admin can update)
    if (existingTemplate.created_by !== userId) {
      throw new ForbiddenException('You can only update templates you created');
    }

    try {
      const template = await this.prisma.kpiTemplate.update({
        where: { id: templateId },
        data: {
          ...(updateTemplateDto.name && { name: updateTemplateDto.name }),
          ...(updateTemplateDto.description !== undefined && { description: updateTemplateDto.description }),
          ...(updateTemplateDto.category && { category: updateTemplateDto.category }),
          ...(updateTemplateDto.template_type && { template_type: updateTemplateDto.template_type }),
          ...(updateTemplateDto.formula_expression && { formula_expression: updateTemplateDto.formula_expression }),
          ...(updateTemplateDto.threshold_config && { threshold_config: updateTemplateDto.threshold_config as any }),
          ...(updateTemplateDto.chart_config && { chart_config: updateTemplateDto.chart_config as any }),
          ...(updateTemplateDto.data_source_config && { data_source_config: updateTemplateDto.data_source_config as any }),
          ...(updateTemplateDto.tags && { tags: updateTemplateDto.tags }),
          ...(updateTemplateDto.is_public !== undefined && { is_public: updateTemplateDto.is_public }),
          ...(updateTemplateDto.is_featured !== undefined && { is_featured: updateTemplateDto.is_featured }),
          ...(updateTemplateDto.version && { version: updateTemplateDto.version }),
          ...(updateTemplateDto.status && { status: updateTemplateDto.status }),
          updated_at: new Date()
        },
        include: {
          templateFields: true,
          creator: {
            select: { id: true, first_name: true, last_name: true, email: true }
          }
        }
      });

      return template;
    } catch (error) {
      throw new BadRequestException(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTemplate(tenantId: string, userId: string, templateId: string) {
    // Check if template exists and user has permission
    const existingTemplate = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: templateId,
        tenant_id: tenantId
      }
    });

    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }

    // Check permissions (only creator or admin can delete)
    if (existingTemplate.created_by !== userId) {
      throw new ForbiddenException('You can only delete templates you created');
    }

    // Check if template is being used
    const usageCount = await this.prisma.userKpi.count({
      where: { template_id: templateId }
    });

    if (usageCount > 0) {
      throw new BadRequestException('Cannot delete template that is being used by KPIs');
    }

    await this.prisma.kpiTemplate.delete({
      where: { id: templateId }
    });

    return { message: 'Template deleted successfully' };
  }

  async useTemplate(tenantId: string, userId: string, useTemplateDto: UseKpiTemplateDto) {
    const { template_id, custom_name, custom_description, custom_threshold_config, custom_chart_config, custom_data_source_config } = useTemplateDto;

    // Get the template
    const template = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: template_id,
        OR: [
          { tenant_id: tenantId },
          { is_public: true }
        ]
      },
      include: {
        templateFields: true
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found or not accessible');
    }

    try {
      // Create user KPI from template
      const userKpi = await this.prisma.userKpi.create({
        data: {
          tenant_id: tenantId,
          user_id: userId,
          template_id: template_id,
          name: custom_name || template.name,
          description: custom_description || template.description,
          formula_expression: template.formula_expression,
          formula_fields: template.formula_fields as any,
          threshold_config: (custom_threshold_config || template.threshold_config) as any,
          chart_config: (custom_chart_config || template.chart_config) as any,
          data_source_config: (custom_data_source_config || template.data_source_config) as any
        }
      });

      // Increment usage count
      await this.prisma.kpiTemplate.update({
        where: { id: template_id },
        data: {
          usage_count: { increment: 1 }
        }
      });

      // Track usage
      await this.trackTemplateUsage(tenantId, userId, {
        template_id,
        action: TemplateUsageAction.USED
      });

      return userKpi;
    } catch (error) {
      throw new BadRequestException(`Failed to use template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async trackTemplateUsage(tenantId: string, userId: string, trackUsageDto: TrackTemplateUsageDto) {
    const { template_id, action } = trackUsageDto;

    // Verify template exists and is accessible
    const template = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: template_id,
        OR: [
          { tenant_id: tenantId },
          { is_public: true }
        ]
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found or not accessible');
    }

    try {
      // Handle favoriting/unfavoriting specially
      if (action === TemplateUsageAction.FAVORITED) {
        // Check if already favorited
        const existingFavorite = await this.prisma.kpiTemplateUsage.findFirst({
          where: {
            template_id,
            user_id: userId,
            tenant_id: tenantId,
            action: TemplateUsageAction.FAVORITED
          }
        });

        if (!existingFavorite) {
          // Create favorite record (ignore duplicate unique errors if index exists)
          try {
            await this.prisma.kpiTemplateUsage.create({
              data: {
                template_id,
                user_id: userId,
                tenant_id: tenantId,
                action: TemplateUsageAction.FAVORITED
              }
            });
          } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
              // Unique constraint violation – safe to ignore for idempotency
            } else {
              throw err;
            }
          }
        }
      } else if (action === TemplateUsageAction.UNFAVORITED) {
        // Remove favorite record
        await this.prisma.kpiTemplateUsage.deleteMany({
          where: {
            template_id,
            user_id: userId,
            tenant_id: tenantId,
            action: TemplateUsageAction.FAVORITED
          }
        });
      } else {
        // For other actions, create a new record
        await this.prisma.kpiTemplateUsage.create({
          data: {
            template_id,
            user_id: userId,
            tenant_id: tenantId,
            action
          }
        });
      }

      return { message: 'Usage tracked successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to track usage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPopularTemplates(tenantId: string, limit: number = 10) {
    return this.prisma.kpiTemplate.findMany({
      where: {
        OR: [
          { tenant_id: tenantId },
          { is_public: true }
        ],
        status: TemplateStatus.PUBLISHED
      },
      orderBy: [
        { is_featured: 'desc' },
        { usage_count: 'desc' }
      ],
      take: limit,
      include: {
        templateFields: true,
        creator: {
          select: { id: true, first_name: true, last_name: true, email: true }
        },
        _count: {
          select: {
            userKpis: true
          }
        }
      }
    });
  }

  async getTemplateAnalytics(templateId: string, tenantId: string) {
    const template = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: templateId,
        tenant_id: tenantId
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const [
      totalUsage,
      recentUsage,
      usageByAction
    ] = await Promise.all([
      this.prisma.kpiTemplateUsage.count({
        where: { template_id: templateId }
      }),
      this.prisma.kpiTemplateUsage.findMany({
        where: { template_id: templateId },
        orderBy: { created_at: 'desc' },
        take: 10,
        include: {
          user: {
            select: { id: true, first_name: true, last_name: true, email: true }
          }
        }
      }),
      this.prisma.kpiTemplateUsage.groupBy({
        by: ['action'],
        where: { template_id: templateId },
        _count: { action: true }
      })
    ]);

    return {
      template: {
        id: template.id,
        name: template.name,
        usage_count: template.usage_count
      },
      analytics: {
        total_usage: totalUsage,
        recent_usage: recentUsage,
        usage_by_action: usageByAction
      }
    };
  }

  async getTemplateFields(templateId: string, tenantId: string) {
    const template = await this.prisma.kpiTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { tenant_id: tenantId },
          { is_public: true }
        ]
      },
      include: {
        templateFields: {
          orderBy: { sort_order: 'asc' }
        }
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found or not accessible');
    }

    return template.templateFields;
  }

  async validateTemplate(_tenantId: string, templateData: Partial<CreateKpiTemplateDto>) {
    // Basic validation logic
    const errors: string[] = [];

    if (!templateData.name || templateData.name.trim().length === 0) {
      errors.push('Template name is required');
    }

    if (!templateData.formula_expression || templateData.formula_expression.trim().length === 0) {
      errors.push('Formula expression is required');
    }

    if (!templateData.formula_fields || templateData.formula_fields.length === 0) {
      errors.push('At least one field is required');
    }

    // Validate formula syntax (basic check)
    if (templateData.formula_expression) {
      try {
        // Simple validation - check for balanced parentheses and basic syntax
        const expression = templateData.formula_expression;
        const openParens = (expression.match(/\(/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
          errors.push('Formula has unbalanced parentheses');
        }
      } catch (error) {
        errors.push('Invalid formula syntax');
      }
    }

    return {
      is_valid: errors.length === 0,
      errors
    };
  }

  async getFavoritedTemplates(tenantId: string, userId: string) {
    try {
      console.log('🔍 getFavoritedTemplates called with:', { tenantId, userId });
      
      // Get templates that the user has favorited
      const favoritedTemplates = await this.prisma.kpiTemplateUsage.findMany({
        where: {
          tenant_id: tenantId,
          user_id: userId,
          action: TemplateUsageAction.FAVORITED
        },
        include: {
          template: {
            include: {
              creator: {
                select: { id: true, first_name: true, last_name: true, email: true }
              },
              templateFields: true,
              _count: {
                select: {
                  userKpis: true,
                  templateUsage: true
                }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      console.log('🔍 Found favorited templates:', favoritedTemplates.length);
      
      const result = favoritedTemplates.map(usage => usage.template);
      console.log('🔍 Returning templates:', result.length);
      
      return result;
    } catch (error) {
      console.error('❌ Error in getFavoritedTemplates:', error);
      throw error;
    }
  }

  async isTemplateFavorited(templateId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.kpiTemplateUsage.findFirst({
      where: {
        template_id: templateId,
        user_id: userId,
        action: TemplateUsageAction.FAVORITED
      }
    });

    return !!favorite;
  }
}
