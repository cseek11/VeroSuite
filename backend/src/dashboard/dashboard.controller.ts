import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDashboardLayoutDto, UpdateDashboardLayoutDto, CreateDashboardCardDto, UpdateDashboardCardDto } from './dto';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
}
