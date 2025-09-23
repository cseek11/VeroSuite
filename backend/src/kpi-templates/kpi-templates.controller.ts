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
  HttpStatus
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

@ApiTags('KPI Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/kpi-templates')
export class KpiTemplatesController {
  constructor(private readonly kpiTemplatesService: KpiTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new KPI template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTemplate(
    @Request() req: any,
    @Body() createTemplateDto: CreateKpiTemplateDto
  ) {
    return this.kpiTemplatesService.createTemplate(
      req.user.tenantId,
      req.user.userId,
      createTemplateDto
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get KPI templates with filtering and pagination' })
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
  async getTemplates(
    @Request() req: any,
    @Query() filters: KpiTemplateFiltersDto
  ) {
    return this.kpiTemplatesService.getTemplates(req.user.tenantId, filters);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular KPI templates' })
  @ApiResponse({ status: 200, description: 'Popular templates retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of templates to return' })
  async getPopularTemplates(
    @Request() req: any,
    @Query('limit') limit?: number
  ) {
    return this.kpiTemplatesService.getPopularTemplates(req.user.tenantId, limit);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user\'s favorited templates' })
  @ApiResponse({ status: 200, description: 'Favorited templates retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFavoritedTemplates(@Request() req: any) {
    try {
      console.log('🔍 Controller getFavoritedTemplates called with user:', req.user);
      console.log('🔍 TenantId type:', typeof req.user.tenantId, 'value:', req.user.tenantId);
      console.log('🔍 UserId type:', typeof req.user.userId, 'value:', req.user.userId);
      
      // Validate UUIDs before calling service (use same regex as tenant middleware)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(req.user.tenantId)) {
        console.error('❌ Invalid tenantId format:', req.user.tenantId);
        return [];
      }
      if (!uuidRegex.test(req.user.userId)) {
        console.error('❌ Invalid userId format:', req.user.userId);
        return [];
      }
      
      const result = await this.kpiTemplatesService.getFavoritedTemplates(
        req.user.tenantId,
        req.user.userId
      );
      console.log('🔍 Controller returning:', result.length, 'favorited templates');
      return result;
    } catch (e) {
      console.error('❌ Controller error in getFavoritedTemplates:', e);
      // Log full error details to capture 400 details
      console.error('❌ Full error object:', JSON.stringify(e, null, 2));
      // Return empty list instead of 400 to avoid UX breakage
      return [];
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific KPI template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  async getTemplateById(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.kpiTemplatesService.getTemplateById(req.user.tenantId, id);
  }

  @Get(':id/fields')
  @ApiOperation({ summary: 'Get template fields' })
  @ApiResponse({ status: 200, description: 'Template fields retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  async getTemplateFields(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.kpiTemplatesService.getTemplateFields(id, req.user.tenantId);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get template usage analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  async getTemplateAnalytics(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.kpiTemplatesService.getTemplateAnalytics(id, req.user.tenantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a KPI template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  async updateTemplate(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: UpdateKpiTemplateDto
  ) {
    return this.kpiTemplatesService.updateTemplate(
      req.user.tenantId,
      req.user.userId,
      id,
      updateTemplateDto
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a KPI template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - template is being used' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  async deleteTemplate(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.kpiTemplatesService.deleteTemplate(
      req.user.tenantId,
      req.user.userId,
      id
    );
  }

  @Post('use')
  @ApiOperation({ summary: 'Use a template to create a user KPI' })
  @ApiResponse({ status: 201, description: 'KPI created from template successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async useTemplate(
    @Request() req: any,
    @Body() useTemplateDto: UseKpiTemplateDto
  ) {
    return this.kpiTemplatesService.useTemplate(
      req.user.tenantId,
      req.user.userId,
      useTemplateDto
    );
  }

  @Post('track-usage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track template usage for analytics' })
  @ApiResponse({ status: 200, description: 'Usage tracked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async trackTemplateUsage(
    @Request() req: any,
    @Body() trackUsageDto: TrackTemplateUsageDto
  ) {
    return this.kpiTemplatesService.trackTemplateUsage(
      req.user.tenantId,
      req.user.userId,
      trackUsageDto
    );
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate template data without saving' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async validateTemplate(
    @Request() req: any,
    @Body() templateData: Partial<CreateKpiTemplateDto>
  ) {
    return this.kpiTemplatesService.validateTemplate(req.user.tenantId, templateData);
  }

  @Get(':id/favorite-status')
  @ApiOperation({ summary: 'Check if template is favorited by user' })
  @ApiResponse({ status: 200, description: 'Favorite status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplateFavoriteStatus(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) templateId: string
  ) {
    try {
      console.log('🔍 getTemplateFavoriteStatus called with templateId:', templateId, 'userId:', req.user.userId);
      console.log('🔍 UserId type:', typeof req.user.userId, 'value:', req.user.userId);
      
      const isFavorited = await this.kpiTemplatesService.isTemplateFavorited(
        templateId,
        req.user.userId
      );
      console.log('🔍 Favorite status result:', isFavorited);
      return { isFavorited };
    } catch (e) {
      console.error('❌ Error in getTemplateFavoriteStatus:', e);
      return { isFavorited: false };
    }
  }
}
