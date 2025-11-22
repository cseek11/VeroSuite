import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LayoutsService } from './layouts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLayoutDto, UpdateLayoutDto, SearchLayoutsDto } from './dto';

@ApiTags('Layouts')
@Controller({ path: 'layouts', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LayoutsController {
  constructor(private readonly layoutsService: LayoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new dashboard layout' })
  @ApiResponse({ status: 201, description: 'Layout saved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid layout data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createLayout(@Body() createLayoutDto: CreateLayoutDto, @Request() req: any) {
    return this.layoutsService.createLayout(createLayoutDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get user layouts' })
  @ApiResponse({ status: 200, description: 'Layouts retrieved successfully' })
  async getUserLayouts(@Request() req: any) {
    return this.layoutsService.getUserLayouts(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific layout by ID' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  async getLayout(@Param('id') id: string, @Request() req: any) {
    return this.layoutsService.getLayout(id, req.user);
  }

  @Get(':id/data')
  @ApiOperation({ summary: 'Get layout data (JSON content)' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  async getLayoutData(@Param('id') id: string, @Request() req: any) {
    return this.layoutsService.getLayoutData(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a layout' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout updated successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  async updateLayout(@Param('id') id: string, @Body() updateLayoutDto: UpdateLayoutDto, @Request() req: any) {
    return this.layoutsService.updateLayout(id, updateLayoutDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a layout' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout deleted successfully' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  async deleteLayout(@Param('id') id: string, @Request() req: any) {
    return this.layoutsService.deleteLayout(id, req.user);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search layouts' })
  @ApiQuery({ name: 'q', description: 'Search query', required: false })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchLayouts(@Query() searchDto: SearchLayoutsDto, @Request() req: any) {
    return this.layoutsService.searchLayouts(searchDto, req.user);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a layout file' })
  @ApiResponse({ status: 201, description: 'Layout uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  async uploadLayout(@Body() uploadDto: any, @Request() req: any) {
    return this.layoutsService.uploadLayout(uploadDto, req.user);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a layout file' })
  @ApiParam({ name: 'id', description: 'Layout ID' })
  @ApiResponse({ status: 200, description: 'Layout file downloaded' })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  async downloadLayout(@Param('id') id: string, @Request() req: any) {
    return this.layoutsService.downloadLayout(id, req.user);
  }
}
