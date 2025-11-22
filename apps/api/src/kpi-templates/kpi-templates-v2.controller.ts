import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Header,
  UseInterceptors
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KpiTemplatesService } from './kpi-templates.service';
import { 
  CreateKpiTemplateDto, 
  UpdateKpiTemplateDto, 
  UseKpiTemplateDto,
  TrackTemplateUsageDto,
  KpiTemplateFiltersDto
} from './dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * KPI Templates API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('KPI Templates V2')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'kpi-templates', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class KpiTemplatesV2Controller {
  constructor(private readonly kpiTemplatesService: KpiTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new KPI template (V2)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Header('API-Version', '2.0')
  async createTemplate(@Request() req: any, @Body() createTemplateDto: CreateKpiTemplateDto) {
    const result = await this.kpiTemplatesService.createTemplate(
      req.user.tenantId,
      req.user.userId,
      createTemplateDto
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get KPI templates with filtering and pagination (V2)' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'category', required: false, description: 'Template category' })
  @ApiQuery({ name: 'template_type', required: false, description: 'Template type' })
  @ApiQuery({ name: 'status', required: false, description: 'Template status' })
  @ApiQuery({ name: 'tags', required: false, description: 'Comma-separated tags' })
  @ApiQuery({ name: 'is_public', required: false, description: 'Filter public templates' })
  @ApiQuery({ name: 'is_featured', required: false, description: 'Filter featured templates' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'sort_by', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sort_order', required: false, description: 'Sort order' })
  @Header('API-Version', '2.0')
  async getTemplates(@Request() req: any, @Query() filters: KpiTemplateFiltersDto) {
    const result = await this.kpiTemplatesService.getTemplates(req.user.tenantId, filters);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular KPI templates (V2)' })
  @ApiResponse({ status: 200, description: 'Popular templates retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of templates to return' })
  @Header('API-Version', '2.0')
  async getPopularTemplates(@Request() req: any, @Query('limit') limit?: number) {
    const result = await this.kpiTemplatesService.getPopularTemplates(req.user.tenantId, limit);
    return {
      data: result,
      meta: {
        version: '2.0',
        count: Array.isArray(result) ? result.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user\'s favorited templates (V2)' })
  @ApiResponse({ status: 200, description: 'Favorited templates retrieved successfully' })
  @Header('API-Version', '2.0')
  async getFavoritedTemplates(@Request() req: any) {
    try {
      const result = await this.kpiTemplatesService.getFavoritedTemplates(
        req.user.tenantId,
        req.user.userId
      );
      return {
        data: result,
        meta: {
          version: '2.0',
          count: Array.isArray(result) ? result.length : 0,
          timestamp: new Date().toISOString()
        }
      };
    } catch (e) {
      return {
        data: [],
        meta: {
          version: '2.0',
          count: 0,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific KPI template by ID (V2)' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async getTemplateById(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const result = await this.kpiTemplatesService.getTemplateById(req.user.tenantId, id);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/fields')
  @ApiOperation({ summary: 'Get template fields (V2)' })
  @ApiResponse({ status: 200, description: 'Template fields retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async getTemplateFields(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const result = await this.kpiTemplatesService.getTemplateFields(id, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get template usage analytics (V2)' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async getTemplateAnalytics(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const result = await this.kpiTemplatesService.getTemplateAnalytics(id, req.user.tenantId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a KPI template (V2)' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async updateTemplate(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: UpdateKpiTemplateDto
  ) {
    const result = await this.kpiTemplatesService.updateTemplate(
      req.user.tenantId,
      req.user.userId,
      id,
      updateTemplateDto
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a KPI template (V2)' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async deleteTemplate(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    await this.kpiTemplatesService.deleteTemplate(
      req.user.tenantId,
      req.user.userId,
      id
    );
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('use')
  @ApiOperation({ summary: 'Use a template to create a user KPI (V2)' })
  @ApiResponse({ status: 201, description: 'KPI created from template successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Header('API-Version', '2.0')
  async useTemplate(@Request() req: any, @Body() useTemplateDto: UseKpiTemplateDto) {
    const result = await this.kpiTemplatesService.useTemplate(
      req.user.tenantId,
      req.user.userId,
      useTemplateDto
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('track-usage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track template usage for analytics (V2)' })
  @ApiResponse({ status: 200, description: 'Usage tracked successfully' })
  @Header('API-Version', '2.0')
  async trackTemplateUsage(
    @Request() req: any,
    @Body() trackUsageDto: TrackTemplateUsageDto
  ) {
    const result = await this.kpiTemplatesService.trackTemplateUsage(
      req.user.tenantId,
      req.user.userId,
      trackUsageDto
    );
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate template data without saving (V2)' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  @Header('API-Version', '2.0')
  async validateTemplate(
    @Request() req: any,
    @Body() templateData: Partial<CreateKpiTemplateDto>
  ) {
    const result = await this.kpiTemplatesService.validateTemplate(req.user.tenantId, templateData);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get(':id/favorite-status')
  @ApiOperation({ summary: 'Check if template is favorited by user (V2)' })
  @ApiResponse({ status: 200, description: 'Favorite status retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @Header('API-Version', '2.0')
  async getTemplateFavoriteStatus(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) templateId: string
  ) {
    try {
      const isFavorited = await this.kpiTemplatesService.isTemplateFavorited(
        templateId,
        req.user.userId
      );
      return {
        data: { isFavorited },
        meta: {
          version: '2.0',
          timestamp: new Date().toISOString()
        }
      };
    } catch (e) {
      return {
        data: { isFavorited: false },
        meta: {
          version: '2.0',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}


