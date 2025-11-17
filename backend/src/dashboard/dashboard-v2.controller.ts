import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { VersioningService } from './versioning.service';
// import { CollaborationService } from './collaboration.service';
// import { WidgetRegistryService } from './widget-registry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Idempotent } from '../common/decorators/idempotency.decorator';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { CreateDashboardLayoutDto, UpdateDashboardLayoutDto } from './dto';
import {
  CreateDashboardRegionDto,
  UpdateDashboardRegionDto,
  ReorderRegionsDto,
  CreateLayoutVersionDto,
  LayoutVersionStatus
} from './dto/dashboard-region.dto';
import { CreateDashboardTemplateDto, UpdateDashboardTemplateDto } from './dto/dashboard-template.dto';

/**
 * Dashboard API v2 Controller
 * 
 * This controller provides improved endpoints with:
 * - Better error responses with structured error codes
 * - Optimistic locking support (version field required)
 * - Batch operations support
 * - Enhanced metadata in responses
 * - Consistent response format
 */
@ApiTags('Dashboard V2')
@Controller({ path: 'dashboard', version: '2' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(IdempotencyInterceptor)
@ApiBearerAuth()
export class DashboardV2Controller {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly versioningService: VersioningService
    // TODO: Enable when collaboration and widget registry features are implemented
    // private readonly collaborationService: CollaborationService,
    // private readonly widgetRegistryService: WidgetRegistryService
  ) {}

  // Layout endpoints
  @Get('layouts/default')
  @ApiOperation({ summary: 'Get or create default layout for user (V2)' })
  @ApiResponse({ status: 200, description: 'Default layout retrieved or created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async getOrCreateDefaultLayout(@Request() req: any) {
    const layout = await this.dashboardService.getOrCreateDefaultLayout(req.user);
    return {
      data: layout,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('layouts')
  @ApiOperation({ summary: 'Create a new dashboard layout (V2)' })
  @ApiResponse({ status: 201, description: 'Layout created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid layout data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async createLayout(@Body() createLayoutDto: CreateDashboardLayoutDto, @Request() req: any) {
    const layout = await this.dashboardService.createLayout(createLayoutDto, req.user);
    return {
      data: layout,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('layouts/:id')
  @ApiOperation({ summary: 'Get a specific layout by ID (V2)' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async getLayout(@Param('id') id: string, @Request() req: any) {
    const layout = await this.dashboardService.getLayout(id, req.user);
    return {
      data: layout,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put('layouts/:id')
  @ApiOperation({ summary: 'Update a layout (V2)' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout updated successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async updateLayout(@Param('id') id: string, @Body() updateLayoutDto: UpdateDashboardLayoutDto, @Request() req: any) {
    const layout = await this.dashboardService.updateLayout(id, updateLayoutDto, req.user);
    return {
      data: layout,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete('layouts/:id')
  @ApiOperation({ summary: 'Delete a layout (V2)' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout deleted successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async deleteLayout(@Param('id') id: string, @Request() req: any) {
    await this.dashboardService.deleteLayout(id, req.user);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('layouts/:layoutId/undo')
  @ApiOperation({ summary: 'Undo last change to layout regions (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout changes undone successfully' })
  @ApiResponse({ status: 404, description: 'No undo history available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async undoLayout(@Param('layoutId') layoutId: string, @Request() req: any) {
    const result = await this.dashboardService.undoLayout(layoutId, req.user);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('layouts/:layoutId/redo')
  @ApiOperation({ summary: 'Redo last undone change to layout regions (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout changes redone successfully' })
  @ApiResponse({ status: 404, description: 'No redo history available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async redoLayout(@Param('layoutId') layoutId: string, @Request() req: any) {
    const result = await this.dashboardService.redoLayout(layoutId, req.user);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('layouts/:layoutId/history')
  @ApiOperation({ summary: 'Get undo/redo history for layout (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async getLayoutHistory(@Param('layoutId') layoutId: string, @Request() req: any) {
    const history = await this.dashboardService.getLayoutHistory(layoutId, req.user);
    return {
      data: history,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Region endpoints (V2 improvements: version required, better error codes)
  @Post('layouts/:layoutId/regions')
  @Idempotent()
  @ApiOperation({ summary: 'Create a new dashboard region (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiHeader({ name: 'Idempotency-Key', description: 'Optional: Unique key for idempotent requests', required: false })
  @ApiResponse({ status: 201, description: 'Region created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid region data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async createRegion(@Param('layoutId') layoutId: string, @Body() createRegionDto: CreateDashboardRegionDto, @Request() req: any) {
    try {
      const region = await this.dashboardService.createRegion({ ...createRegionDto, layout_id: layoutId }, req.user);
      return {
        data: region,
        meta: {
          version: '2.0',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        code: 'REGION_CREATE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to create region',
        timestamp: new Date().toISOString()
      });
    }
  }

  @Get('layouts/:layoutId/regions')
  @ApiOperation({ summary: 'Get all regions for a layout (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Regions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async getLayoutRegions(@Param('layoutId') layoutId: string, @Request() req: any) {
    const regions = await this.dashboardService.getLayoutRegions(layoutId, req.user);
    return {
      data: regions,
      meta: {
        version: '2.0',
        count: regions.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put('layouts/:layoutId/regions/:id')
  @ApiOperation({ summary: 'Update a dashboard region (V2 - requires version for optimistic locking)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region updated successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async updateRegion(@Param('id') id: string, @Body() updateRegionDto: UpdateDashboardRegionDto, @Request() req: any) {
    // V2 requires version field for optimistic locking
    if (!(updateRegionDto as any).version) {
      throw new BadRequestException({
        code: 'VERSION_REQUIRED',
        message: 'Version field is required for optimistic locking in API v2',
        timestamp: new Date().toISOString()
      });
    }

    try {
      const region = await this.dashboardService.updateRegion(id, updateRegionDto, req.user);
      return {
        data: region,
        meta: {
          version: '2.0',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      if (error.status === 409) {
        throw new BadRequestException({
          code: 'VERSION_CONFLICT',
          message: error.message || 'Version conflict detected',
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  }

  @Delete('layouts/:layoutId/regions/:id')
  @ApiOperation({ summary: 'Delete a dashboard region (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region deleted successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async deleteRegion(@Param('id') id: string, @Request() req: any) {
    await this.dashboardService.deleteRegion(id, req.user);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('layouts/:layoutId/regions/reorder')
  @ApiOperation({ summary: 'Reorder regions in a layout (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Regions reordered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async reorderRegions(@Param('layoutId') layoutId: string, @Body() reorderDto: ReorderRegionsDto, @Request() req: any) {
    await this.dashboardService.reorderRegions(layoutId, reorderDto, req.user);
    return {
      success: true,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Batch operations (V2 only)
  @Post('layouts/:layoutId/regions/batch')
  @ApiOperation({ summary: 'Batch create/update/delete regions (V2 only)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Batch operation completed' })
  @ApiResponse({ status: 400, description: 'Invalid batch operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async batchRegions(
    @Param('layoutId') layoutId: string,
    @Body() batchDto: {
      create?: CreateDashboardRegionDto[];
      update?: Array<{ id: string; data: UpdateDashboardRegionDto }>;
      delete?: string[];
    },
    @Request() req: any
  ) {
    const results = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as string[],
      errors: [] as any[]
    };

    // Batch create
    if (batchDto.create) {
      for (const createDto of batchDto.create) {
        try {
          const region = await this.dashboardService.createRegion({ ...createDto, layout_id: layoutId }, req.user);
          results.created.push(region);
        } catch (error) {
          results.errors.push({
            operation: 'create',
            data: createDto,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    // Batch update
    if (batchDto.update) {
      for (const updateOp of batchDto.update) {
        try {
          const region = await this.dashboardService.updateRegion(updateOp.id, updateOp.data, req.user);
          results.updated.push(region);
        } catch (error) {
          results.errors.push({
            operation: 'update',
            id: updateOp.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    // Batch delete
    if (batchDto.delete) {
      for (const id of batchDto.delete) {
        try {
          await this.dashboardService.deleteRegion(id, req.user);
          results.deleted.push(id);
        } catch (error) {
          results.errors.push({
            operation: 'delete',
            id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    return {
      data: results,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Versioning endpoints
  @Get('layouts/:layoutId/versions')
  @ApiOperation({ summary: 'Get all versions for a layout (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Versions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async getVersions(@Param('layoutId') layoutId: string, @Request() req: any) {
    const versions = await this.versioningService.getVersions(layoutId, req.user);
    return {
      data: versions,
      meta: {
        version: '2.0',
        count: Array.isArray(versions) ? versions.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('layouts/:layoutId/versions')
  @ApiOperation({ summary: 'Create a new layout version (V2)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 201, description: 'Version created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('API-Version', '2.0')
  async createVersion(@Param('layoutId') layoutId: string, @Body() createVersionDto: CreateLayoutVersionDto, @Request() req: any) {
    const version = await this.versioningService.createVersion(
      layoutId,
      req.user,
      createVersionDto.status || LayoutVersionStatus.DRAFT,
      createVersionDto.notes
    );
    return {
      data: version,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Template endpoints
  @Post('templates')
  @ApiOperation({ summary: 'Create a dashboard template (V2)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Header('API-Version', '2.0')
  async createTemplate(@Request() req: any, @Body() dto: CreateDashboardTemplateDto) {
    const template = await this.dashboardService.createTemplate(req.user, dto);
    return {
      data: template,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all templates (V2)' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  @Header('API-Version', '2.0')
  async getTemplates(@Request() req: any) {
    const templates = await this.dashboardService.getTemplates(req.user, true);
    return {
      data: templates,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString(),
        count: templates.length
      }
    };
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a template by ID (V2)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Header('API-Version', '2.0')
  async getTemplate(@Request() req: any, @Param('id') id: string) {
    const template = await this.dashboardService.getTemplate(req.user, id);
    return {
      data: template,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Put('templates/:id')
  @ApiOperation({ summary: 'Update a template (V2)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Header('API-Version', '2.0')
  async updateTemplate(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateDashboardTemplateDto) {
    const template = await this.dashboardService.updateTemplate(req.user, id, dto);
    return {
      data: template,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Delete('templates/:id')
  @ApiOperation({ summary: 'Delete a template (V2)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Header('API-Version', '2.0')
  async deleteTemplate(@Request() req: any, @Param('id') id: string) {
    await this.dashboardService.deleteTemplate(req.user, id);
    return {
      data: { id },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}


