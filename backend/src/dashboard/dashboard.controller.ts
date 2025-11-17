import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { VersioningService } from './versioning.service';
import { CollaborationService } from './collaboration.service';
import { WidgetRegistryService } from './widget-registry.service';
import { CardToRegionConverter } from './migrations/card-to-region.converter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDashboardLayoutDto, UpdateDashboardLayoutDto, CreateDashboardCardDto, UpdateDashboardCardDto } from './dto';
import {
  CreateDashboardRegionDto,
  UpdateDashboardRegionDto,
  ReorderRegionsDto,
  CreateLayoutVersionDto,
  PublishVersionDto,
  CreateRegionACLDto,
  RegisterWidgetDto,
  LayoutVersionStatus
} from './dto/dashboard-region.dto';

@ApiTags('Dashboard V1 (Deprecated)')
@Controller({ path: 'dashboard', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly versioningService: VersioningService,
    private readonly collaborationService: CollaborationService,
    private readonly widgetRegistryService: WidgetRegistryService,
    private readonly cardToRegionConverter: CardToRegionConverter
  ) {}

  // Layout endpoints
  @Get('layouts/default')
  @ApiOperation({ summary: 'Get or create default layout for user' })
  @ApiResponse({ status: 200, description: 'Default layout retrieved or created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrCreateDefaultLayout(@Request() req: any) {
    return this.dashboardService.getOrCreateDefaultLayout(req.user);
  }

  @Post('layouts')
  @ApiOperation({ summary: 'Create a new dashboard layout' })
  @ApiResponse({ status: 201, description: 'Layout created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid layout data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createLayout(@Body() createLayoutDto: CreateDashboardLayoutDto, @Request() req: any) {
    return this.dashboardService.createLayout(createLayoutDto, req.user);
  }

  @Get('layouts/:id')
  @ApiOperation({ summary: 'Get a specific layout by ID' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLayout(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.getLayout(id, req.user);
  }

  @Put('layouts/:id')
  @ApiOperation({ summary: 'Update a layout' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout updated successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateLayout(@Param('id') id: string, @Body() updateLayoutDto: UpdateDashboardLayoutDto, @Request() req: any) {
    return this.dashboardService.updateLayout(id, updateLayoutDto, req.user);
  }

  @Delete('layouts/:id')
  @ApiOperation({ summary: 'Delete a layout' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout deleted successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteLayout(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.deleteLayout(id, req.user);
  }

  // Card endpoints
  @Get('layouts/:layoutId/cards')
  @ApiOperation({ summary: 'Get all cards for a layout' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLayoutCards(@Param('layoutId') layoutId: string, @Request() req: any) {
    return this.dashboardService.getLayoutCards(layoutId, req.user);
  }

  @Put('cards')
  @ApiOperation({ summary: 'Create or update a dashboard card' })
  @ApiResponse({ status: 200, description: 'Card created or updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid card data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upsertCard(@Body() cardData: CreateDashboardCardDto, @Request() req: any) {
    return this.dashboardService.upsertCard(cardData, req.user);
  }

  @Put('cards/:id')
  @ApiOperation({ summary: 'Update a specific card' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateCard(@Param('id') id: string, @Body() updateCardDto: UpdateDashboardCardDto, @Request() req: any) {
    return this.dashboardService.updateCard(id, updateCardDto, req.user);
  }

  @Delete('cards/:id')
  @ApiOperation({ summary: 'Delete a dashboard card' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteCard(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.deleteCard(id, req.user);
  }

  // Region endpoints
  @Post('layouts/:layoutId/regions')
  @ApiOperation({ summary: 'Create a new dashboard region' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 201, description: 'Region created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid region data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRegion(@Param('layoutId') layoutId: string, @Body() createRegionDto: CreateDashboardRegionDto, @Request() req: any) {
    try {
      // Log the incoming data for debugging
      console.log('Creating region with data:', { layoutId, createRegionDto, userId: req.user?.userId });
      return await this.dashboardService.createRegion({ ...createRegionDto, layout_id: layoutId }, req.user);
    } catch (error) {
      console.error('Error creating region:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create region'
      );
    }
  }

  @Get('layouts/:layoutId/regions')
  @ApiOperation({ summary: 'Get all regions for a layout' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Regions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLayoutRegions(@Param('layoutId') layoutId: string, @Request() req: any) {
    return this.dashboardService.getLayoutRegions(layoutId, req.user);
  }

  @Put('layouts/:layoutId/regions/:id')
  @ApiOperation({ summary: 'Update a dashboard region (V1 - Deprecated)' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region updated successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('Deprecation', 'true')
  @Header('Sunset', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString())
  @Header('Link', '</api/v2/dashboard/layouts/:layoutId/regions/:id>; rel="successor-version"')
  async updateRegion(@Param('id') id: string, @Body() updateRegionDto: UpdateDashboardRegionDto, @Request() req: any) {
    return this.dashboardService.updateRegion(id, updateRegionDto, req.user);
  }

  @Delete('layouts/:layoutId/regions/:id')
  @ApiOperation({ summary: 'Delete a dashboard region' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region deleted successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteRegion(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.deleteRegion(id, req.user);
  }

  @Post('layouts/:layoutId/regions/reorder')
  @ApiOperation({ summary: 'Reorder regions in a layout' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Regions reordered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorderRegions(@Param('layoutId') layoutId: string, @Body() reorderDto: ReorderRegionsDto, @Request() req: any) {
    return this.dashboardService.reorderRegions(layoutId, reorderDto, req.user);
  }

  @Get('regions/defaults/:role')
  @ApiOperation({ summary: 'Get role-based default regions' })
  @ApiParam({ name: 'role', description: 'User role (technician, manager, admin)' })
  @ApiResponse({ status: 200, description: 'Default regions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoleDefaults(@Param('role') role: string) {
    return this.dashboardService.getRoleBasedDefaults(role);
  }

  // ACL endpoints
  @Get('regions/:id/acl')
  @ApiOperation({ summary: 'Get ACLs for a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'ACLs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRegionACL(@Param('id') id: string) {
    // Implementation would fetch ACLs from database
    return { region_id: id, acls: [] };
  }

  @Put('regions/:id/acl')
  @ApiOperation({ summary: 'Set ACL for a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'ACL set successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async setRegionACL(@Param('id') id: string, @Body() aclDto: CreateRegionACLDto, @Request() req: any) {
    return this.dashboardService.setRegionACL(id, { ...aclDto, region_id: id }, req.user);
  }

  // Versioning endpoints
  @Get('layouts/:layoutId/versions')
  @ApiOperation({ summary: 'Get all versions for a layout' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Versions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getVersions(@Param('layoutId') layoutId: string, @Request() req: any) {
    return this.versioningService.getVersions(layoutId, req.user);
  }

  @Post('layouts/:layoutId/versions')
  @ApiOperation({ summary: 'Create a new layout version' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 201, description: 'Version created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createVersion(@Param('layoutId') layoutId: string, @Body() createVersionDto: CreateLayoutVersionDto, @Request() req: any) {
    return this.versioningService.createVersion(
      layoutId,
      req.user,
      createVersionDto.status || LayoutVersionStatus.DRAFT,
      createVersionDto.notes
    );
  }

  @Post('layouts/:layoutId/publish')
  @ApiOperation({ summary: 'Publish a layout version' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Version published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async publishVersion(@Param('layoutId') layoutId: string, @Body() publishDto: PublishVersionDto, @Request() req: any) {
    return this.versioningService.publishVersion(layoutId, publishDto.version_id, req.user, publishDto.notes);
  }

  @Post('layouts/:layoutId/revert/:versionId')
  @ApiOperation({ summary: 'Revert layout to a specific version' })
  @ApiParam({ name: 'layoutId', description: 'Layout ID' })
  @ApiParam({ name: 'versionId', description: 'Version ID' })
  @ApiResponse({ status: 200, description: 'Layout reverted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revertToVersion(@Param('layoutId') layoutId: string, @Param('versionId') versionId: string, @Request() req: any) {
    return this.versioningService.revertToVersion(layoutId, versionId, req.user);
  }

  // Collaboration endpoints
  @Get('regions/:id/presence')
  @ApiOperation({ summary: 'Get presence information for a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Presence retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPresence(@Param('id') id: string, @Request() req: any) {
    return this.collaborationService.getPresence(id, req.user.tenantId);
  }

  @Post('regions/:id/presence')
  @ApiOperation({ summary: 'Update presence for a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Presence updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePresence(@Param('id') id: string, @Body() body: { userId: string; sessionId: string; isEditing: boolean }, @Request() req: any) {
    await this.collaborationService.updatePresence(id, body.userId, body.sessionId, body.isEditing, req.user.tenantId);
    return { success: true };
  }

  @Post('regions/:id/lock')
  @ApiOperation({ summary: 'Acquire or release lock on a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Lock operation completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async acquireLock(@Param('id') id: string, @Body() body: { action: 'acquire' | 'release'; sessionId?: string }, @Request() req: any) {
    const sessionId = body.sessionId || req.user.sessionId || `session-${Date.now()}`;
    if (body.action === 'acquire') {
      return this.collaborationService.acquireLock(id, req.user.userId, req.user.tenantId, sessionId);
    } else {
      await this.collaborationService.releaseLock(id, req.user.userId, sessionId, req.user.tenantId);
      return { success: true };
    }
  }

  // Widget registry endpoints
  @Post('widgets/register')
  @ApiOperation({ summary: 'Register a new widget' })
  @ApiResponse({ status: 201, description: 'Widget registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid widget manifest' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async registerWidget(@Body() registerDto: RegisterWidgetDto, @Request() req: any) {
    return this.widgetRegistryService.registerWidget(registerDto, req.user);
  }

  @Get('widgets/approved')
  @ApiOperation({ summary: 'Get all approved widgets' })
  @ApiResponse({ status: 200, description: 'Approved widgets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getApprovedWidgets(@Request() req: any) {
    return this.widgetRegistryService.getApprovedWidgets(req.user.tenantId);
  }

  // Migration endpoint
  @Post('migrate/cards-to-regions')
  @ApiOperation({ summary: 'Migrate cards to regions' })
  @ApiResponse({ status: 200, description: 'Migration completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async migrateCardsToRegions(@Body() body: { layoutId: string }, @Request() req: any) {
    try {
      const result = await this.cardToRegionConverter.convertCardsToRegions(
        body.layoutId,
        req.user.userId,
        req.user.tenantId
      );
      return result;
    } catch (error) {
      throw new BadRequestException(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
